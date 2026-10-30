let alimentos = JSON.parse(localStorage.getItem("alimentos")) || [];
let compra = JSON.parse(localStorage.getItem("compra")) || [];
let catalogoUsuario =
  JSON.parse(
    localStorage.getItem("catalogoUsuario")
  ) || {};

function guardarAlimentos() {
  localStorage.setItem("alimentos", JSON.stringify(alimentos));
}

function guardarCompra() {
  localStorage.setItem("compra", JSON.stringify(compra));
}

function guardarCatalogoUsuario() {

  localStorage.setItem(
    "catalogoUsuario",
    JSON.stringify(catalogoUsuario)
  );

}

function obtenerCatalogoCompleto() {

  return {
    ...catalogo,
    ...catalogoUsuario
  };

}

function guardarEnCatalogo() {

  const nombre =
    document.getElementById("nombre")
      .value.trim();
  const fechaCaducidad =
  document.getElementById("caducidad")
    .value;

let conservacion = 30;

if (fechaCaducidad) {

  const hoy = new Date();

  const fecha = new Date(fechaCaducidad);

  conservacion = Math.max(
    1,
    Math.ceil(
      (fecha - hoy) /
      (1000 * 60 * 60 * 24)
    )
  );

}
  if (!nombre) {

    alert("Introduce un nombre");

    return;

  }

  const catalogoCompleto =
    obtenerCatalogoCompleto();

  if (catalogoCompleto[nombre]) {

    alert(
      "Ese producto ya existe en el catálogo"
    );

    return;

  }
  const stockMinimo = prompt(
      "Indica el stock mínimo para este producto:",
      "1"
    );
    
    if (stockMinimo === null) {
      return;
    }
  catalogoUsuario[nombre] = {

    categoria:
      document.getElementById("categoria")
      .value,

    ubicacion:
      document.getElementById("ubicacion")
      .value,

    unidad:
      document.getElementById("unidad")
      .value,

    conservacion: conservacion,

    stockMinimo: Number(stockMinimo) || 1
    
  };

  guardarCatalogoUsuario();

  alert(
    `✅ ${nombre} guardado en el catálogo`
  );

}

function diasHastaCaducidad(fecha) {

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const vencimiento = new Date(fecha);
  vencimiento.setHours(0, 0, 0, 0);

  const diferencia = vencimiento - hoy;

  return Math.floor(
    diferencia / (1000 * 60 * 60 * 24)
  );

}

function colorCaducidad(dias) {

  if (dias < 0) return "#EF4444";

  if (dias <= 7) return "#FACC15";

  return "#22C55E";

}
function iconoCategoria(categoria) {

  const iconos = {

    "Fruta": "🍎",
    "Verdura": "🥦",
    "Huevos": "🥚",
    "Lácteos": "🥛",
    "Carne": "🥩",
    "Pescado": "🐟",
    "Conservas": "🥫",
    "Cereales": "🌾",
    "Legumbres": "🫘",
    "Pasta y Arroz": "🍝",
    "Condimentos": "🧂",
    "Bebidas": "🥤",
    "Bodega": "🍷",
    "Snacks y Dulces": "🍪",
    "Congelados": "❄️",
    "Otros": "📦"

  };

  return iconos[categoria] || "📦";

}

function iconoUbicacion(ubicacion) {

  if (!ubicacion) return "📦 ";

  if (ubicacion.includes("Nevera"))
    return "🧊 ";

  if (ubicacion.includes("Congelador"))
    return "❄️ ";

  if (ubicacion.includes("Despensa"))
    return "🗄️ ";

  if (ubicacion.includes("Bodega"))
    return "🍷 ";

  return "📦 ";

}

function mostrarAlimentos() {

  const lista =
    document.getElementById("lista-alimentos");

  if (!lista) return;

  lista.innerHTML = "";

  const texto =
    document.getElementById("searchInput")
      ?.value.toLowerCase() || "";

  const categoria =
    document.getElementById("categoryFilter")
      ?.value || "";

  const ubicacion =
    document.getElementById("locationFilter")
      ?.value || "";

  let filtrados = alimentos.filter(alimento => {

    const coincideNombre =
      alimento.nombre.toLowerCase()
      .includes(texto);

    const coincideCategoria =
      categoria === "" ||
      alimento.categoria === categoria;

    const coincideUbicacion =
      ubicacion === "" ||
      alimento.ubicacion === ubicacion;

    return (
      coincideNombre &&
      coincideCategoria &&
      coincideUbicacion
    );

  });

  filtrados.sort((a, b) => {

    const diasA =
      diasHastaCaducidad(a.caducidad);

    const diasB =
      diasHastaCaducidad(b.caducidad);

    return diasA - diasB;

  });

  filtrados.forEach((alimento) => {

    const dias =
      diasHastaCaducidad(alimento.caducidad);

    const tarjeta =
      document.createElement("div");

    let clase = "card";

    if (dias < 0) {
      clase += " caducado";
    } else if (dias <= 7) {
      clase += " proximo";
    }

    tarjeta.className = clase;

    tarjeta.innerHTML = `
      <h3>${alimento.nombre}</h3>

      <p>
      ${iconoCategoria(alimento.categoria)}
      ${alimento.categoria}
      </p>
      <p>
      ${iconoUbicacion(alimento.ubicacion)}
      ${alimento.ubicacion || "Sin ubicación"}
      </p>

      <p>
      Cantidad:
      ${alimento.cantidad}
      ${alimento.unidad || "uds"}
      ${alimento.cantidad <= 1
        ? '<span class="stock-bajo"> ⚠️ Stock bajo</span>'
        : ''}
      </p>

      <p>
      Caduca:
      ${new Date(alimento.caducidad)
        .toLocaleDateString("es-ES")}
      </p>

      <p
      style="
      color:${colorCaducidad(dias)};
      font-weight:bold;
      ">
      ${
        dias < 0
        ? `Caducado hace ${Math.abs(dias)} días`
        : dias === 0
        ? "Caduca hoy"
        : dias === 1
        ? "Caduca mañana"
        : `Caduca en ${dias} días`
      }
      </p>

      <button
      onclick="anadirACompra('${alimento.nombre}')">
      🛒 Comprar
      </button>

      <button
      onclick="eliminarAlimento(${alimentos.indexOf(alimento)})">
      🗑️ Eliminar
      </button>
    `;

    lista.appendChild(tarjeta);

  });

  actualizarDashboard();

}

function autocompletarProducto() {

  const nombre =
    document.getElementById("nombre")
      .value.trim();

  const sugerencias =
    document.getElementById("sugerencias");

  sugerencias.innerHTML = "";

  if (!nombre) return;

  const coincidencias =
    Object.keys(obtenerCatalogoCompleto())
      .filter(producto =>
        producto.toLowerCase()
          .includes(nombre.toLowerCase())
      )
      .slice(0, 5);

  coincidencias.forEach(producto => {

    const item =
      document.createElement("div");

    item.className = "sugerencia-item";

    item.textContent = producto;

    item.onclick = () => {
      seleccionarProducto(producto);
    };

    sugerencias.appendChild(item);

  });

  const clave = Object.keys(obtenerCatalogoCompleto()).find(
    item =>
      item.toLowerCase() ===
      nombre.toLowerCase()
  );

  if (!clave) return;

  seleccionarProducto(clave);

}

function seleccionarProducto(clave) {

  const producto = obtenerCatalogoCompleto()[clave];

  document.getElementById("nombre").value =
    clave;

  document.getElementById("categoria").value =
    producto.categoria;

  document.getElementById("ubicacion").value =
    producto.ubicacion;

  document.getElementById("unidad").value =
    producto.unidad;

  const fecha = new Date();

  fecha.setDate(
    fecha.getDate() +
    producto.conservacion
  );

  document.getElementById("caducidad").value =
    fecha.toISOString().split("T")[0];

  document.getElementById("sugerencias")
    .innerHTML = "";

}

function agregarAlimento() {

  const nombre =
    document.getElementById("nombre")
      .value.trim();

  const cantidad =
    Number(
      document.getElementById("cantidad")
        .value
    );

  const unidad =
    document.getElementById("unidad")
      .value;

  const ubicacion =
    document.getElementById("ubicacion")
      .value;

  const categoria =
    document.getElementById("categoria")
      .value;

  const caducidad =
    document.getElementById("caducidad")
      .value;

  if (!nombre) {
    alert("Introduce un nombre");
    return;
  }

  if (cantidad <= 0) {
    alert("Cantidad inválida");
    return;
  }

  const existente = alimentos.find(
    a =>
      a.nombre.toLowerCase() ===
      nombre.toLowerCase()
  );

  if (existente) {

  if (existente.unidad !== unidad) {

    alert(
      `⚠️ El producto "${nombre}" ya existe con la unidad "${existente.unidad}".\n\nConvierte la cantidad manualmente antes de añadirla.`
    );

    return;
  }

  existente.cantidad += cantidad;

  if (
    new Date(caducidad) <
    new Date(existente.caducidad)
  ) {
    existente.caducidad = caducidad;
  }

} else {

    alimentos.push({
      nombre,
      cantidad,
      unidad,
      ubicacion,
      categoria,
      caducidad
    });

  }

  guardarAlimentos();

  mostrarAlimentos();

  document.getElementById("nombre").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("caducidad").value = "";

}

function eliminarAlimento(indice) {

  alimentos.splice(indice, 1);

  guardarAlimentos();

  mostrarAlimentos();

}

function anadirACompra(nombre) {

  const duplicado =
    compra.find(
      item =>
      item.nombre.toLowerCase() ===
      nombre.toLowerCase()
    );

  if (duplicado) {
    alert("Ya está en la lista");
    return;
  }

  compra.push({
    nombre,
    comprado: false
  });

  guardarCompra();

  mostrarCompra();

  actualizarDashboard();

}

function agregarCompra() {

  const input =
    document.getElementById("nuevoProducto");

  if (!input) return;

  const nombre =
    input.value.trim();

  if (!nombre) return;

  const existe =
    compra.find(
      item =>
      item.nombre.toLowerCase() ===
      nombre.toLowerCase()
    );

  if (existe) {
    alert("Ya está en la lista");
    return;
  }

  compra.push({
    nombre,
    comprado: false
  });

  guardarCompra();

  mostrarCompra();

  actualizarDashboard();

  input.value = "";

}

function marcarComprado(indice) {

  compra[indice].comprado =
    !compra[indice].comprado;

  guardarCompra();

  mostrarCompra();

  actualizarDashboard();

}

function eliminarCompra(indice) {

  compra.splice(indice, 1);

  guardarCompra();

  mostrarCompra();

  actualizarDashboard();

}

function limpiarComprados() {

  compra =
    compra.filter(
      item => !item.comprado
    );

  guardarCompra();

  mostrarCompra();

  actualizarDashboard();

}

function mostrarCompra() {

  const lista =
    document.getElementById("lista-compra");

  if (!lista) return;

  lista.innerHTML = "";

  const botonLimpiar =
    document.createElement("button");

  botonLimpiar.innerHTML =
    "🧹 Limpiar comprados";

  botonLimpiar.onclick =
    limpiarComprados;

  lista.appendChild(botonLimpiar);

  compra.forEach((item, indice) => {

    const tarjeta =
      document.createElement("div");

    tarjeta.className =
      item.comprado
      ? "card comprado"
      : "card";

    tarjeta.innerHTML = `
      <h3>${item.nombre}</h3>

      <button onclick="marcarComprado(${indice})">

      ${
        item.comprado
        ? "↩️ Reabrir"
        : "✅ Comprado"
      }

      </button>

      <button onclick="eliminarCompra(${indice})">
      🗑️ Eliminar
      </button>
    `;

    lista.appendChild(tarjeta);

  });

}

function actualizarDashboard() {

  const total = alimentos.length;

  let proximos = 0;
  let caducados = 0;

  alimentos.forEach(alimento => {

    const dias =
      diasHastaCaducidad(
        alimento.caducidad
      );

    if (dias < 0)
      caducados++;

    if (dias >= 0 && dias <= 7)
      proximos++;

  });

  const pendientes =
    compra.filter(
      item => !item.comprado
    ).length;

  const totalElement =
    document.getElementById("total-productos") ||
    document.getElementById("totalProductos");

  const proximosElement =
    document.getElementById("productos-caducar") ||
    document.getElementById("caducarPronto");

  const caducadosElement =
    document.getElementById("caducados");

  const compraElement =
    document.getElementById("compraPendiente");

  if (totalElement)
    totalElement.textContent = total;

  if (proximosElement)
    proximosElement.textContent = proximos;

  if (caducadosElement)
    caducadosElement.textContent = caducados;

  if (compraElement)
    compraElement.textContent = pendientes;

}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    mostrarAlimentos();

    mostrarCompra();

    actualizarDashboard();

  }
);
