# Demo: plantilla de página de pedidos por WhatsApp

Plantilla para locales de comida (sushi, hamburguesas, pizzas, bebestibles, postres…).
Trae una carta de ejemplo con el nombre **Demo**:

- **Promos** destacadas en la portada (Promo Mixta, Promo 50 piezas, Combo Burger, Promo Handrolls).
- **Sushi**: rolls, handrolls y «Ármalos a tu pinta» (el cliente elige proteína, relleno y envoltura en cada roll).
- **Hamburguesas**: simple o doble, punto de la carne y agregados con precio (tocino, palta, huevo…).
- **Para picar**, **Bebestibles** (bebidas, jugos y limonadas con sabor a elegir) y **Postres**.
- Pedido con retiro o delivery que se envía ordenado por WhatsApp, buscador, horario, mapa y panel `/admin`.

Es una página estática: no necesita servidor, base de datos ni instalar nada. Funciona en Vercel
(y el panel también), y abriendo `index.html` directo en el navegador.

Las imágenes de la carta son ilustraciones de ejemplo. Para cada cliente se reemplazan por sus fotos.

## Crear la página de un cliente nuevo

1. **Copia el repositorio.** En GitHub: *Settings → General → Template repository* (marcarlo una vez) y después
   **Use this template → Create a new repository** con el nombre del cliente. También sirve descargar el ZIP y subirlo
   a un repositorio nuevo.
2. **Cambia la carta** en `carta.js` (o después, desde el panel):
   - `negocio`: nombre, frase corta, WhatsApp (`56912345678`) y cómo se muestra (`+56 9 1234 5678`), dirección, sector,
     ciudad, enlace de Google Maps, Facebook, Instagram, delivery y datos de transferencia.
   - `tema`: colores de la marca, por ejemplo `"color": "#1f6feb"` y `"colorDestacado": "#ffcc1f"`.
     El principal va en botones y detalles; conviene uno oscuro o intenso para que el texto blanco se lea.
   - `secciones`: las partes de la carta (ver más abajo). Borra las que el local no tenga.
   - `textos`: títulos de la portada, la carta y el final.
3. **Cambia las imágenes:**
   - `img/logo.png`: el logo del local (mejor en PNG con fondo transparente; se ve sobre fondo oscuro).
   - `img/icono-192.png` y `img/icono-180.png` (cuadrados) y `favicon.ico`: el ícono de la pestaña y del celular.
   - `img/carta/`: las fotos de los productos.
4. **Cambia el título para Google** en `index.html`: `<title>`, `description` y `og:` (las primeras líneas).
5. **Publica en Vercel**: *Add New… → Project* → importa el repositorio → **Deploy**.
6. **Activa el panel** (ver abajo): `GITHUB_TOKEN` y `ADMIN_PASSWORD` en Vercel, y **Redeploy**.

## Panel de administración

Entra a **tu-pagina.vercel.app/admin**. El usuario es `demo` (se cambia con `ADMIN_USER`) y la contraseña es la
que pongas en `ADMIN_PASSWORD`. El panel no aparece en ningún menú de la página ni en Google.

Ahí ves la página tal cual, y:
- **Tocas cualquier texto** (títulos, nombres y descripciones de productos) y escribes encima.
- Con los botones amarillos **Editar** de cada parte, o con el **+** de cada producto, abres sus opciones:
  precios, fotos, variantes (simple/doble, sabores), productos agotados, promos de la portada, horario,
  dirección, WhatsApp y **colores de la marca**.
- En **Opciones para elegir** están los grupos que el cliente elige al agregar un producto: punto de la carne,
  agregados con precio, y las proteínas, rellenos y envolturas de los rolls. Se pueden crear grupos nuevos
  (por ejemplo «Salsa» o «Tamaño de la pizza») y en cada producto se marca cuáles se le preguntan al cliente.
- **Ver como cliente** muestra la página sin marcas de edición; **Celular** la muestra en tamaño de teléfono.
- Al tocar **Publicar**, los cambios se guardan en el repositorio y Vercel actualiza la página sola
  en uno o dos minutos.

### Configuración (una vez por cliente, en Vercel)

En el proyecto de Vercel: **Settings → Environment Variables**

| Nombre | Para qué sirve |
| --- | --- |
| `GITHUB_TOKEN` | Obligatoria. Clave de GitHub (*fine-grained token*) con permiso *Contents: Read and write* solo sobre el repositorio de ese cliente. Solo la usa el servidor; nunca llega al navegador. |
| `ADMIN_PASSWORD` | Obligatoria. Contraseña del panel. No hay contraseña de fábrica: cada cliente tiene la suya. |
| `ADMIN_USER` | Opcional. Usuario del panel (si no está: `demo`). |
| `GITHUB_REPO` | Opcional. `usuario/repositorio`, si Vercel no lo detecta solo. |
| `GITHUB_BRANCH` | Opcional. Rama donde guarda el panel (si no está: la rama que Vercel publicó, o `main`). |

Después de agregar o cambiar una variable, hay que volver a publicar (**Deployments → Redeploy**).
Para revisar la configuración, abre **tu-pagina.vercel.app/api/admin**: dice si la clave de GitHub y la contraseña
están puestas (nunca las muestra).

## Cómo está armada la carta (`carta.js`)

```
secciones            → botones grandes de la carta: Promos, Sushi, Hamburguesas…
  categorias         → si una sección tiene más de una, aparecen como botones chicos (Bebidas, Jugos…)
    productos        → cada producto con su precio
personalizacion      → grupos que el cliente elige: punto de la carne, agregados, proteína de cada roll…
```

**Productos**
- **Precio**: `"precio": 14500`, sin punto ni signo.
- **Variantes con otro precio** (simple/doble, mediana/grande): `"opciones": ["Simple", "Doble"]` y
  `"preciosOpciones": { "Simple": 6490, "Doble": 8490 }`. Sin `preciosOpciones`, todas cuestan lo mismo (sabores).
- **Qué incluye** (combos y promos): en `"detalle"`, una cosa por línea separada con `\n`:
  `"1 hamburguesa a elección\n1 papas fritas\n1 bebida en lata"`. Si todas las líneas son piezas o cortes
  (`"25 piezas frías\n25 piezas calientes"`), además suma las piezas.
- **Nota destacada**: `"nota": "Válido por tiempo limitado."`
- **Agotado**: `"disponible": false`.
- **Promo en la portada**: `"destacado": true` y una `"foto"`.
- **Fotos**: en `img/carta/`, con `"foto": "img/carta/mi-foto.webp"`. Si una categoría tiene al menos un producto
  con foto, se muestra en tarjetas; si no, en lista. Se ven mejor en formato horizontal (1000 × 725).
- **Producto nuevo**: copia uno parecido y cambia `id` (no se puede repetir), `nombre`, `detalle` y `precio`.

**Opciones para elegir** (`personalizacion`)
- `"tipo": "elegir"`, `"min": 1`, `"max": 1` → el cliente elige una sí o sí (punto de la carne, salsa).
  Con `"porDefecto": true` en una opción, queda marcada de entrada.
- `"tipo": "extra"`, `"max": 10` → agregados opcionales, cada uno con su `"precio"` (tocino +$1.000).
- `"porRoll": true` → se elige en cada roll; el producto dice cuántos rolls arma el cliente con `"rolls": 2`.
  Con `"gratis": 1` en una opción, la primera no se cobra y cada repetida sí (envoltura en palta o en queso).
- Para usar un grupo: `"personalizar": ["punto", "agregados"]` en la categoría (vale para todos sus productos)
  o en un producto (reemplaza al de la categoría; por ejemplo el pollo crispy solo lleva `["agregados"]`).
- La sección **Arma tu roll** de la página aparece sola si hay una categoría con grupos `porRoll`;
  si el local no vende sushi, desaparece junto con su enlace del menú.

**Local, horario y delivery**
- **Horario**: `"lunes": "12:30-23:00"`, `"domingo": "cerrado"` o dos turnos `"12:00-15:30, 19:00-23:00"`.
  Con `"horarioConfirmado": false` se muestra como *horario referencial, por confirmar* y no bloquea pedidos;
  con `true` aparece *Abierto ahora / Cerrado ahora* y fuera de horario no se puede agregar.
- **Días sin atención** (feriados): `"diasCerrados": ["2026-12-25", "2027-01-01"]`.
- Lo que quede vacío no se muestra: sin `"direccion"` no aparece la sección de ubicación; sin `"instagram"`, no hay enlace.
- **Mapa**: `"mapa"` es el enlace del local en Google Maps y `"mapaBusqueda"` lo que se busca para mostrar el mapa.
- **Delivery**: con `"valorDelivery": null` y `"notaDelivery": "Según el sector"` el valor se confirma por WhatsApp;
  con un valor fijo (`"valorDelivery": 2000`) se suma al total.
- **Transferencia**: `"datosTransferencia": "Banco …\nCuenta …\nRUT …"` se muestra cuando el cliente elige ese pago.
- **Aviso «Carta de referencia»**: se quita con `"cartaReferencial": false`.

Al editar a mano, cuida las comillas y las comas: cada elemento de una lista va separado por una coma.
Si la carta deja de aparecer, lo más probable es que falte o sobre una coma en el último cambio.

## Archivos

- `index.html`: estructura de la página y textos fijos (portada, arma tu roll, cómo pedir, ubicación).
- `carta.js`: datos del local, colores, horario, productos, precios y opciones para elegir.
- `css/estilos.css`: diseño (computador y celular). Los colores se cambian desde `carta.js` → `tema`.
- `js/app.js`: carta, buscador, pedido, horario de apertura y mensaje de WhatsApp.
- `js/tema.js`: aplica los colores de la marca.
- `img/`: logo e íconos; en `img/carta/` las imágenes de los productos.
- `admin.html`: el panel de administración.
- `api/admin.js`: el servidor del panel (revisa la contraseña y guarda los cambios en GitHub).
- `fotos/`: las fotos que se suben desde el panel (se crea sola).
- `vercel.json` y `robots.txt`: configuración para que el panel no aparezca en Google.

## Cómo funciona el pedido

El cliente arma el pedido, escribe su nombre y elige retiro o delivery (con dirección, ubicación opcional
y forma de pago). Al tocar **Enviar pedido por WhatsApp** se abre WhatsApp con un mensaje ordenado:
productos, variantes, punto, agregados, lo elegido en cada roll, notas y subtotal. El pedido queda guardado
en el navegador del cliente aunque cierre la página.
