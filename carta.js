/*
  CARTA
  =====
  Aquí están los datos del local, los colores, el horario y todos los productos con sus precios.
  Lo más fácil es editarla desde el panel (tu-pagina/admin). Para editarla aquí, cambia el texto
  entre comillas o el número y guarda el archivo.

  Reglas rápidas:
  - Los precios van sin punto ni signo: 14500 (no "$14.500").
  - "tema": colores de la marca. "color" es el principal (botones, detalles) y "colorDestacado" el de
    los títulos destacados. Van en formato #rrggbb. Si quedan vacíos, se usan el rojo y el amarillo de la plantilla.
  - Horario: "13:00-22:00" o "cerrado". Para dos turnos: "12:00-15:30, 19:00-23:00".
    Si "horario" queda en null, la página no muestra abierto/cerrado y siempre deja pedir.
  - horarioConfirmado: con false el horario solo se muestra como referencia ("por confirmar"):
    no aparece abierto/cerrado ni se bloquean pedidos. Cámbialo a true cuando esté confirmado.
  - diasCerrados: fechas en que no se atiende aunque el horario diga abierto. Ej: ["2026-12-25"].
  - "textos": los títulos y textos fijos de la página (portada, carta, pasos, pie).
  - Lo que quede vacío ("") no se muestra: por ejemplo, sin "direccion" no aparece la sección Ubicación.
  - "secciones" son los botones grandes de la carta (Promos, Sushi, Hamburguesas…) y cada una tiene
    sus "categorias" (si hay más de una, aparecen como botones chicos).
  - Producto agotado: agrega "disponible": false
  - Producto en la portada (promo destacada): agrega "destacado": true y una "foto".
  - Fotos: guárdalas en la carpeta img/carta/ y escribe la ruta, ej: "img/carta/mi-foto.webp".
    Si una categoría tiene al menos un producto con foto, se muestra en tarjetas; si no, en lista.
  - "detalle" con varias líneas (separadas por \n) se muestra como «Ver qué incluye».
  - "opciones": lo que el cliente elige (ej: ["Simple", "Doble"]).
    Si cada opción tiene otro precio, ponlo en "preciosOpciones".
  - "personalizar": los grupos de "personalizacion" que el cliente elige en ese producto o en toda
    la categoría (ej: ["punto", "agregados"] en las hamburguesas). Un producto con su propio
    "personalizar" no usa el de la categoría.
  - Grupos de "personalizacion":
      "tipo": "elegir" con "min": 1 y "max": 1  → el cliente elige una sí o sí (ej: punto de la carne).
      "tipo": "extra" con "max": 10             → agregados opcionales con precio (ej: tocino +$1.000).
      "porRoll": true                           → se elige en cada roll (proteína, relleno, envoltura).
      "porDefecto": true en una opción          → queda marcada de entrada.
  - "cupones": códigos de descuento (un cupón por pedido).
      "tipo": "porcentaje" (10 = 10%) o "monto" (2000 = $2.000), con su "valor".
      Opcionales: "minimo" (pedido mínimo), "tope" (descuento máximo de un porcentaje),
      "desde" y "hasta" ("2026-12-31"), "dias" (["martes"]), "modo" ("retiro" o "delivery"),
      "aplica" (ids de categorías: el descuento se calcula solo sobre esas), "activo": false (apagado)
      y "visible": false (no aparece en la página; sirve para redes o volantes).
      Ojo: los códigos se pueden ver en este archivo. El local confirma cada cupón en el WhatsApp.
  - "rolls": cuántos rolls arma el cliente en ese producto (20 cortes = 2 rolls de 10).
  - En una opción de "personalizacion", "gratis": 1 significa que la primera de esa opción no se cobra
    y desde la segunda se cobra su precio (ej: la primera envoltura en palta y la primera en queso).
  Cuidado con las comas: cada elemento de una lista va separado por una coma.
*/
window.CARTA = {
  "negocio": {
    "nombre": "Demo",
    "lema": "Sushi, burgers y más",
    "whatsapp": "56900000000",
    "whatsappVisible": "+56 9 0000 0000",
    "facebook": "",
    "instagram": "",
    "direccion": "Calle Demo 123",
    "sector": "Centro",
    "ciudad": "Coquimbo",
    "region": "",
    "mapa": "https://www.google.com/maps/search/?api=1&query=Plaza+de+Armas+de+Coquimbo",
    "mapaBusqueda": "Plaza de Armas de Coquimbo, Chile",
    "cartaReferencial": true,
    "valorDelivery": null,
    "notaDelivery": "Según el sector",
    "datosTransferencia": "Banco Demo\nCuenta corriente 00000000\nRUT 11.111.111-1\npagos@demo.cl"
  },
  "tema": {
    "color": "#d01c23",
    "colorDestacado": "#ffcc1f"
  },
  "horario": {
    "lunes": "12:30-23:00",
    "martes": "12:30-23:00",
    "miercoles": "12:30-23:00",
    "jueves": "12:30-23:00",
    "viernes": "12:30-00:00",
    "sabado": "12:30-00:00",
    "domingo": "13:00-22:00"
  },
  "horarioConfirmado": false,
  "diasCerrados": [],
  "textos": {
    "portada": {
      "titulo": "Sushi, burgers",
      "destacado": "y más",
      "bajada": "Promos, sushi, hamburguesas, para picar y bebestibles. Arma tu pedido y mándalo por WhatsApp: el resto lo confirmamos contigo."
    },
    "carta": {
      "titulo": "Elige tu",
      "destacado": "antojo",
      "bajada": "Promos, sushi, hamburguesas, para picar, bebestibles y postres. Suma lo que quieras al pedido."
    },
    "cupones": {
      "titulo": "Cupones",
      "destacado": "de la semana",
      "bajada": "Toca «Usar cupón» y el descuento se aplica solo en tu pedido. Un cupón por pedido."
    },
    "arma": { "titulo": "Arma tu", "destacado": "roll" },
    "pasos": {
      "titulo": "Haz tu pedido",
      "destacado": "en 3 pasos.",
      "bajada": "El pedido te llega listo para enviar por WhatsApp. Nosotros te confirmamos disponibilidad, modalidad y total.",
      "lista": [
        { "titulo": "Elige o arma", "texto": "Escoge una promo, una burger con tus agregados o arma tus rolls como más te gusten." },
        { "titulo": "Revisa tu pedido", "texto": "Ajusta cantidades, deja una nota y elige si lo retiras o pides delivery." },
        { "titulo": "Envíalo por WhatsApp", "texto": "Te respondemos para confirmar el pedido y el total." }
      ]
    },
    "ubicacion": { "titulo": "Te esperamos" },
    "antojo": { "titulo": "¿Qué se te", "destacado": "antoja hoy?" },
    "pie": { "nota": "Página de demostración. Precios y promociones sujetos a confirmación por WhatsApp." }
  },
  "secciones": [
    {
      "nombre": "Promos",
      "categorias": [
        {
          "id": "promociones",
          "nombre": "Promociones",
          "nota": "Promociones válidas todos los días, hasta agotar stock.",
          "productos": [
            {
              "id": "promo-mixta",
              "nombre": "Promo Mixta",
              "detalle": "40 piezas de sushi\n2 hamburguesas clásicas\n1 papas fritas grandes\n1 bebida 1,5 L",
              "nota": "Para compartir entre 3 o 4 personas.",
              "precio": 24990,
              "foto": "img/carta/promo-mixta.webp",
              "destacado": true
            },
            {
              "id": "promo-50-piezas",
              "nombre": "Promo 50 piezas",
              "detalle": "25 piezas frías, envueltas en palta o en queso\n25 piezas calientes en panko",
              "nota": "Incluye una bebida 1,5 L de regalo.",
              "precio": 16990,
              "opciones": ["Fríos envueltos en palta", "Fríos envueltos en queso"],
              "foto": "img/carta/promo-50-piezas.webp",
              "destacado": true
            },
            {
              "id": "combo-burger",
              "nombre": "Combo Burger",
              "detalle": "1 hamburguesa a elección\n1 papas fritas medianas\n1 bebida en lata",
              "precio": 8990,
              "opciones": ["Clásica", "Cheddar bacon", "Italiana", "Pollo crispy"],
              "foto": "img/carta/combo-burger.webp",
              "destacado": true
            },
            {
              "id": "promo-handrolls",
              "nombre": "Promo Handrolls",
              "detalle": "3 handrolls a elección: pollo, salmón o camarón.",
              "precio": 9490,
              "foto": "img/carta/promo-handrolls.webp",
              "destacado": true
            }
          ]
        }
      ]
    },
    {
      "nombre": "Sushi",
      "categorias": [
        {
          "id": "rolls",
          "nombre": "Rolls",
          "nota": "Rolls de 10 cortes.",
          "productos": [
            { "id": "roll-california", "nombre": "California", "detalle": "Kanikama, palta y queso crema, envuelto en sésamo.", "precio": 5490 },
            { "id": "roll-acevichado", "nombre": "Acevichado", "detalle": "Camarón y queso crema, envuelto en palta con salsa acevichada.", "precio": 6990 },
            { "id": "roll-salmon-queso", "nombre": "Salmón queso", "detalle": "Salmón, queso crema y cebollín, envuelto en palta.", "precio": 6490 },
            { "id": "roll-tempura-pollo", "nombre": "Tempura pollo", "detalle": "Pollo, queso crema y cebollín, frito en panko.", "precio": 5990 },
            { "id": "roll-vegetariano", "nombre": "Vegetariano", "detalle": "Palta, pepino, pimentón y queso crema, envuelto en sésamo.", "precio": 4990 }
          ]
        },
        {
          "id": "handrolls",
          "nombre": "Handrolls",
          "productos": [
            { "id": "handroll-pollo", "nombre": "Pollo", "detalle": "Pollo, queso crema y palta.", "precio": 3290 },
            { "id": "handroll-salmon", "nombre": "Salmón", "detalle": "Salmón, queso crema y cebollín.", "precio": 3990 },
            { "id": "handroll-camaron", "nombre": "Camarón", "detalle": "Camarón, queso crema y palta.", "precio": 3790 }
          ]
        },
        {
          "id": "armalos-a-tu-pinta",
          "nombre": "Ármalos a tu pinta",
          "nota": "Las promos de 40 cortes o más llevan una bebida de regalo.",
          "ayuda": "Cada roll lleva queso crema + 1 proteína + 1 relleno + 1 envoltura.",
          "personalizar": ["proteina", "relleno", "envoltura"],
          "productos": [
            { "id": "armalos-20-cortes", "nombre": "20 cortes", "detalle": "2 rolls de 10 cortes, armados a tu pinta.", "precio": 10990, "rolls": 2 },
            { "id": "armalos-30-cortes", "nombre": "30 cortes", "detalle": "3 rolls de 10 cortes, armados a tu pinta.", "precio": 13990, "rolls": 3 },
            { "id": "armalos-40-cortes", "nombre": "40 cortes", "detalle": "4 rolls de 10 cortes, armados a tu pinta.", "precio": 16990, "rolls": 4 },
            { "id": "armalos-60-cortes", "nombre": "60 cortes", "detalle": "6 rolls de 10 cortes, armados a tu pinta.", "precio": 21990, "rolls": 6 }
          ]
        }
      ]
    },
    {
      "nombre": "Hamburguesas",
      "categorias": [
        {
          "id": "hamburguesas",
          "nombre": "Hamburguesas",
          "nota": "Pan brioche y carne de vacuno de 150 g. Elige el punto y suma agregados.",
          "personalizar": ["punto", "agregados"],
          "productos": [
            {
              "id": "burger-clasica",
              "nombre": "Clásica",
              "detalle": "Carne, queso cheddar, lechuga, tomate y salsa de la casa.",
              "precio": 6490,
              "opciones": ["Simple", "Doble"],
              "preciosOpciones": { "Simple": 6490, "Doble": 8490 },
              "foto": "img/carta/burger-clasica.webp"
            },
            {
              "id": "burger-cheddar-bacon",
              "nombre": "Cheddar bacon",
              "detalle": "Carne, doble cheddar, tocino crocante y cebolla caramelizada.",
              "precio": 7490,
              "opciones": ["Simple", "Doble"],
              "preciosOpciones": { "Simple": 7490, "Doble": 9490 },
              "foto": "img/carta/burger-cheddar-bacon.webp"
            },
            {
              "id": "burger-italiana",
              "nombre": "Italiana",
              "detalle": "Carne, palta, tomate y mayo casera.",
              "precio": 6990,
              "opciones": ["Simple", "Doble"],
              "preciosOpciones": { "Simple": 6990, "Doble": 8990 },
              "foto": "img/carta/burger-italiana.webp"
            },
            {
              "id": "burger-pollo-crispy",
              "nombre": "Pollo crispy",
              "detalle": "Pechuga de pollo apanada, lechuga y mayo spicy.",
              "precio": 6990,
              "personalizar": ["agregados"],
              "foto": "img/carta/burger-pollo-crispy.webp"
            }
          ]
        }
      ]
    },
    {
      "nombre": "Para picar",
      "categorias": [
        {
          "id": "para-picar",
          "nombre": "Para picar",
          "productos": [
            { "id": "papas-fritas", "nombre": "Papas fritas", "detalle": "Papas fritas crujientes con sal de mar.", "precio": 2990, "opciones": ["Medianas", "Grandes"], "preciosOpciones": { "Medianas": 2990, "Grandes": 3990 } },
            { "id": "papas-cheddar-bacon", "nombre": "Papas cheddar bacon", "detalle": "Papas fritas con salsa cheddar, tocino y cebollín.", "precio": 4990 },
            { "id": "nuggets", "nombre": "Nuggets de pollo", "detalle": "8 unidades con una salsa a elección.", "precio": 3990, "opciones": ["Salsa BBQ", "Mostaza miel", "Agridulce"] },
            { "id": "alitas-bbq", "nombre": "Alitas BBQ", "detalle": "6 alitas de pollo bañadas en salsa BBQ.", "precio": 4990 },
            { "id": "gyozas", "nombre": "Gyozas", "detalle": "5 unidades, a la plancha.", "precio": 3990, "opciones": ["Cerdo", "Verduras"] },
            { "id": "empanaditas-queso", "nombre": "Empanaditas de queso", "detalle": "6 unidades.", "precio": 3490 }
          ]
        }
      ]
    },
    {
      "nombre": "Bebestibles",
      "categorias": [
        {
          "id": "bebidas",
          "nombre": "Bebidas",
          "productos": [
            { "id": "bebida-lata", "nombre": "Lata 350 ml", "detalle": "Coca-Cola, Coca-Cola Zero, Fanta o Sprite.", "precio": 1500, "opciones": ["Coca-Cola", "Coca-Cola Zero", "Fanta", "Sprite"] },
            { "id": "bebida-1-5", "nombre": "Botella 1,5 L", "detalle": "Para compartir: Coca-Cola, Coca-Cola Zero, Fanta o Sprite.", "precio": 2990, "opciones": ["Coca-Cola", "Coca-Cola Zero", "Fanta", "Sprite"] },
            { "id": "agua-mineral", "nombre": "Agua mineral 500 ml", "detalle": "Con o sin gas.", "precio": 1200, "opciones": ["Sin gas", "Con gas"] }
          ]
        },
        {
          "id": "jugos",
          "nombre": "Jugos y limonadas",
          "productos": [
            { "id": "jugo-natural", "nombre": "Jugo natural", "detalle": "Vaso de 500 ml.", "precio": 2990, "opciones": ["Frambuesa", "Mango", "Piña", "Frutilla"] },
            { "id": "limonada", "nombre": "Limonada", "detalle": "Vaso de 500 ml.", "precio": 2990, "opciones": ["Clásica", "Menta jengibre", "Maracuyá"] }
          ]
        }
      ]
    },
    {
      "nombre": "Postres",
      "categorias": [
        {
          "id": "postres",
          "nombre": "Postres",
          "productos": [
            { "id": "brownie", "nombre": "Brownie con helado", "detalle": "Brownie tibio con una bola de helado de vainilla.", "precio": 3490 },
            { "id": "tiramisu", "nombre": "Tiramisú", "detalle": "Porción individual.", "precio": 3290 },
            { "id": "mochis", "nombre": "Mochis", "detalle": "2 unidades.", "precio": 2990, "opciones": ["Frutilla", "Mango", "Chocolate"] }
          ]
        }
      ]
    }
  ],
  "cupones": [
    {
      "codigo": "BIENVENIDA",
      "nombre": "10% en tu primer pedido",
      "tipo": "porcentaje",
      "valor": 10,
      "minimo": 10000,
      "tope": 5000
    },
    {
      "codigo": "RETIRO3000",
      "nombre": "$3.000 menos retirando en el local",
      "tipo": "monto",
      "valor": 3000,
      "minimo": 20000,
      "modo": "retiro"
    },
    {
      "codigo": "MARTESBURGER",
      "nombre": "Martes de burger: 20% en hamburguesas",
      "tipo": "porcentaje",
      "valor": 20,
      "dias": ["martes"],
      "aplica": ["hamburguesas"]
    },
    {
      "codigo": "INSTA15",
      "nombre": "15% para seguidores de Instagram",
      "tipo": "porcentaje",
      "valor": 15,
      "minimo": 15000,
      "hasta": "2026-12-31",
      "visible": false
    }
  ],
  "personalizacion": [
    {
      "id": "proteina",
      "nombre": "Proteína",
      "tipo": "elegir",
      "porRoll": true,
      "min": 1,
      "max": 1,
      "opciones": [
        { "id": "pollo", "nombre": "Pollo", "precio": 0 },
        { "id": "kanikama", "nombre": "Kanikama", "precio": 0 },
        { "id": "salmon", "nombre": "Salmón", "precio": 0 },
        { "id": "camaron", "nombre": "Camarón", "precio": 0 }
      ]
    },
    {
      "id": "relleno",
      "nombre": "Relleno",
      "tipo": "elegir",
      "porRoll": true,
      "min": 1,
      "max": 1,
      "opciones": [
        { "id": "palta", "nombre": "Palta", "precio": 0 },
        { "id": "pepino", "nombre": "Pepino", "precio": 0 },
        { "id": "cebollin", "nombre": "Cebollín", "precio": 0 },
        { "id": "pimenton", "nombre": "Pimentón", "precio": 0 },
        { "id": "champinon", "nombre": "Champiñón", "precio": 0 },
        { "id": "palmitos", "nombre": "Palmitos", "precio": 0 },
        { "id": "choclo-baby", "nombre": "Choclo baby", "precio": 0 }
      ]
    },
    {
      "id": "envoltura",
      "nombre": "Envoltura",
      "tipo": "elegir",
      "porRoll": true,
      "min": 1,
      "max": 1,
      "ayuda": "Envoltura en queso o en palta: la primera de cada una va gratis; desde la segunda, $1.000 cada una.",
      "opciones": [
        { "id": "panko", "nombre": "Panko", "precio": 0 },
        { "id": "sesamo", "nombre": "Sésamo", "precio": 0 },
        { "id": "ciboulette", "nombre": "Ciboulette", "precio": 0 },
        { "id": "nori", "nombre": "Nori", "precio": 0 },
        { "id": "tempura", "nombre": "Tempura", "precio": 0 },
        { "id": "queso", "nombre": "Queso", "precio": 1000, "gratis": 1 },
        { "id": "palta", "nombre": "Palta", "precio": 1000, "gratis": 1 }
      ]
    },
    {
      "id": "punto",
      "nombre": "Punto de la carne",
      "tipo": "elegir",
      "min": 1,
      "max": 1,
      "opciones": [
        { "id": "a-punto", "nombre": "A punto", "precio": 0, "porDefecto": true },
        { "id": "tres-cuartos", "nombre": "Tres cuartos", "precio": 0 },
        { "id": "bien-cocida", "nombre": "Bien cocida", "precio": 0 }
      ]
    },
    {
      "id": "agregados",
      "nombre": "Agregados",
      "tipo": "extra",
      "min": 0,
      "max": 10,
      "opciones": [
        { "id": "cheddar-extra", "nombre": "Queso cheddar extra", "precio": 800 },
        { "id": "tocino", "nombre": "Tocino", "precio": 1000 },
        { "id": "huevo-frito", "nombre": "Huevo frito", "precio": 700 },
        { "id": "palta-extra", "nombre": "Palta", "precio": 900 },
        { "id": "cebolla-caramelizada", "nombre": "Cebolla caramelizada", "precio": 600 },
        { "id": "jalapenos", "nombre": "Jalapeños", "precio": 500 }
      ]
    }
  ],
  "ingredientes": {}
};
