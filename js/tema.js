/* Colores de la marca ("tema" en carta.js).
   Se carga antes de mostrar la página para que no aparezca un color y después otro. */
(function () {
  "use strict";

  var BLANCO = [255, 255, 255];
  var NEGRO = [0, 0, 0];
  function rgb(h) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(h || "").trim());
    if (!m) return null;
    var n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function hex(c) { return "#" + c.map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join(""); }
  // t: cuánto del segundo color (0 a 1)
  function mezcla(a, b, t) { return hex(a.map(function (v, i) { return v + (b[i] - v) * t; })); }

  /* Sin color en la carta (o con uno mal escrito) quedan los de css/estilos.css */
  window.aplicarTema = function (carta) {
    var t = (carta && carta.tema) || {};
    var p = rgb(t.color);
    var d = rgb(t.colorDestacado);
    var vars = {
      "--principal": p && hex(p),
      "--principal-rgb": p && p.join(" "),
      "--principal-oscuro": p && mezcla(p, NEGRO, 0.22),
      "--acento": p && hex(p),
      "--acento-rgb": p && p.join(" "),
      "--acento-claro": p && mezcla(p, BLANCO, 0.35),
      "--acento-fondo": p && mezcla(p, BLANCO, 0.94),
      "--acento-borde": p && mezcla(p, BLANCO, 0.7),
      "--amarillo": d && hex(d),
      "--amarillo-rgb": d && d.join(" "),
      "--amarillo-claro": d && mezcla(d, BLANCO, 0.3)
    };
    var estilo = document.documentElement.style;
    Object.keys(vars).forEach(function (k) {
      if (vars[k]) estilo.setProperty(k, vars[k]);
      else estilo.removeProperty(k);
    });
  };
  window.aplicarTema(window.CARTA);
})();
