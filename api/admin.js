/*
  Panel de administración de la página: recibe los cambios y los guarda en GitHub.

  Se configura en Vercel → Settings → Environment Variables:
    GITHUB_TOKEN    (obligatoria) clave de GitHub con permiso "Contents: Read and write"
                    sobre el repositorio de la página. Nunca se envía al navegador.
    ADMIN_PASSWORD  (obligatoria) contraseña del panel. No hay contraseña de fábrica, para que
                    cada cliente que use esta plantilla tenga la suya.
    ADMIN_USER      (opcional) usuario del panel. Si no existe: demo
    GITHUB_REPO     (opcional) "usuario/repositorio", si la página cambia de dueño.
    GITHUB_BRANCH   (opcional) rama donde se guardan los cambios. Si no existe: la rama que publicó
                    Vercel, o main
*/
const crypto = require("crypto");

const DEFAULT_USER = "demo";
const CONTENT_FILE = "carta.js";
const MAX_PHOTO_BYTES = 3.5 * 1024 * 1024;
const MAX_SITE_CHARS = 400000;
const PHOTO_PATH = /^fotos\/[a-z0-9-]{4,40}\.jpg$/;
const HEADER = `/*
  CARTA
  =====
  Lo más fácil es editarla desde el panel: tu-pagina/admin
  También se puede editar aquí: los precios van sin punto ni signo (14500), el horario como
  "14:00-23:00" o "cerrado", los colores como "#d01c23", y cada elemento de una lista va
  separado por una coma. La explicación completa está en el README del repositorio.
*/
`;

/* ---------- utilidades ---------- */
function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function sameText(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}
function checkCredentials(user, pass) {
  if (typeof user !== "string" || typeof pass !== "string" || !user || !pass) return false;
  const expectedUser = process.env.ADMIN_USER || DEFAULT_USER;
  const userOk = sameText(user.trim().toLowerCase(), expectedUser.toLowerCase());
  const passOk = sameText(pass, process.env.ADMIN_PASSWORD || "");
  return userOk && passOk;
}
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

/* ---------- GitHub ---------- */
// Al pegar la clave en Vercel es fácil que quede un espacio o un salto de línea: se limpian.
function token() {
  return (process.env.GITHUB_TOKEN || "").trim();
}
function repo() {
  const env = process.env;
  const full = env.GITHUB_REPO ||
    (env.VERCEL_GIT_REPO_OWNER && env.VERCEL_GIT_REPO_SLUG ? `${env.VERCEL_GIT_REPO_OWNER}/${env.VERCEL_GIT_REPO_SLUG}` : "thesairux/sushi-demo");
  return { full, branch: env.GITHUB_BRANCH || env.VERCEL_GIT_COMMIT_REF || "main" };
}
async function gh(path, opts = {}) {
  const r = repo();
  const res = await fetch(`https://api.github.com/repos/${r.full}${path}`, {
    method: opts.method || "GET",
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "panel-pagina",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.body ? { "Content-Type": "application/json" } : {})
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!res.ok) {
    const err = new Error(`GitHub ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

/* carta.js trae un comentario arriba y luego "window.CARTA = { … };" */
async function loadSite() {
  try {
    const f = await gh(`/contents/${CONTENT_FILE}?ref=${encodeURIComponent(repo().branch)}`);
    const text = Buffer.from(f.content, "base64").toString("utf8");
    const start = text.indexOf("{", text.indexOf("window.CARTA"));
    return JSON.parse(text.slice(start, text.lastIndexOf("}") + 1));
  } catch (e) {
    if (e.status === 404 || e instanceof SyntaxError) return null;
    throw e;
  }
}

async function uploadPhoto(data) {
  if (typeof data !== "string") throw Object.assign(new Error("foto"), { client: "foto" });
  const bytes = Buffer.from(data, "base64");
  const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isJpeg || bytes.length > MAX_PHOTO_BYTES) throw Object.assign(new Error("foto"), { client: "foto" });
  const blob = await gh("/git/blobs", { method: "POST", body: { content: data, encoding: "base64" } });
  return blob.sha;
}

/* Fotos subidas desde el panel que la carta usa */
function usedPhotos(site) {
  const used = new Set();
  (Array.isArray(site.secciones) ? site.secciones : []).forEach(sec => {
    (sec && Array.isArray(sec.categorias) ? sec.categorias : []).forEach(cat => {
      (cat && Array.isArray(cat.productos) ? cat.productos : []).forEach(p => {
        if (p && typeof p.foto === "string" && p.foto.startsWith("fotos/")) used.add(p.foto);
      });
    });
  });
  return used;
}

async function publish(site, photos) {
  if (!site || typeof site !== "object" || Array.isArray(site) || !Array.isArray(site.secciones)) {
    throw Object.assign(new Error("site"), { client: "datos" });
  }
  const json = JSON.stringify(site, null, 2);
  if (json.length > MAX_SITE_CHARS) throw Object.assign(new Error("site"), { client: "datos" });
  const list = (Array.isArray(photos) ? photos : []).filter(p =>
    p && typeof p.path === "string" && PHOTO_PATH.test(p.path) && typeof p.sha === "string" && /^[0-9a-f]{40}$/.test(p.sha));
  const used = usedPhotos(site);
  const content = HEADER + "window.CARTA = " + json + ";\n";
  const branch = encodeURIComponent(repo().branch);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const ref = await gh(`/git/ref/heads/${branch}`);
      const headSha = ref.object.sha;
      const head = await gh(`/git/commits/${headSha}`);
      const entries = list.filter(p => used.has(p.path)).map(p => ({ path: p.path, mode: "100644", type: "blob", sha: p.sha }));
      const cblob = await gh("/git/blobs", { method: "POST", body: { content, encoding: "utf-8" } });
      entries.push({ path: CONTENT_FILE, mode: "100644", type: "blob", sha: cblob.sha });
      // fotos subidas desde el panel que ya no aparecen en la carta: se borran del repositorio
      const tree = await gh(`/git/trees/${head.tree.sha}?recursive=1`);
      (tree.tree || []).forEach(t => {
        if (t.type === "blob" && t.path.startsWith("fotos/") && !used.has(t.path)) {
          entries.push({ path: t.path, mode: "100644", type: "blob", sha: null });
        }
      });
      const newTree = await gh("/git/trees", { method: "POST", body: { base_tree: head.tree.sha, tree: entries } });
      const commit = await gh("/git/commits", { method: "POST", body: { message: "Cambios desde el panel de la página", tree: newTree.sha, parents: [headSha] } });
      await gh(`/git/refs/heads/${branch}`, { method: "PATCH", body: { sha: commit.sha } });
      return;
    } catch (e) {
      if (attempt === 0 && (e.status === 409 || e.status === 422)) continue; // la rama cambió: se intenta otra vez
      throw e;
    }
  }
}

/* ---------- estado ----------
   Abrir /api/admin en el navegador muestra qué configuración le llegó al servidor.
   Nunca muestra la clave: solo si está y si se pegó limpia. */
function estado() {
  const raw = process.env.GITHUB_TOKEN || "";
  const t = raw.trim();
  const r = repo();
  return {
    ok: true,
    claveGithub: t ? "configurada" : "FALTA",
    claveFormato: !t ? "-" : (/^(github_pat_|ghp_|gho_|ghs_)[A-Za-z0-9_]+$/.test(t) ? "se ve bien" : "se ve rara: revisa que esté pegada completa y sin nada más"),
    claveConEspacios: raw !== t,
    repositorio: r.full,
    rama: r.branch,
    usuario: process.env.ADMIN_USER ? "propio" : `de fábrica (${DEFAULT_USER})`,
    contrasena: process.env.ADMIN_PASSWORD ? "configurada" : "FALTA",
    entorno: process.env.VERCEL_ENV || "desconocido",
    version: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7)
  };
}

/* ---------- entrada ---------- */
module.exports = async (req, res) => {
  if (req.method === "GET") return send(res, 200, estado());
  if (req.method !== "POST") return send(res, 405, { error: "metodo" });
  let body;
  try { body = await readBody(req); } catch (e) { return send(res, 400, { error: "datos" }); }
  body = body || {};

  if (!process.env.ADMIN_PASSWORD) return send(res, 500, { error: "clave" });
  if (!checkCredentials(body.user, body.pass)) {
    await sleep(1200); // frena a quien intente adivinar la contraseña
    return send(res, 401, { error: "acceso" });
  }
  if (!token()) return send(res, 500, { error: "config" });

  try {
    if (body.action === "login") return send(res, 200, { ok: true, site: await loadSite() });
    if (body.action === "photo") return send(res, 200, { ok: true, sha: await uploadPhoto(body.data) });
    if (body.action === "publish") { await publish(body.site, body.photos); return send(res, 200, { ok: true }); }
    return send(res, 400, { error: "accion" });
  } catch (e) {
    if (e.client) return send(res, 400, { error: e.client });
    return send(res, 502, { error: "github", status: e.status || 0 });
  }
};
