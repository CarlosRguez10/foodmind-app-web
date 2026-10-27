let alimentos = JSON.parse(localStorage.getItem("alimentos")) || [];

let compra = JSON.parse(localStorage.getItem("compra")) || [];

function guardarAlimentos() {
  localStorage.setItem("alimentos", JSON.stringify(alimentos));
}

function guardarCompra() {
  localStorage.setItem("compra", JSON.stringify(compra));
}

function diasHastaCaducidad(fecha) {

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const vencimiento = new Date(fecha);
  vencimiento.setHours(0, 0, 0, 0);

  const diferencia =
    vencimiento - hoy;

  return Math.floor(
    diferencia / (1000 * 60 * 60 * 24)
  );
}

function colorCaducidad(dias) {

  if (dias < 0) return "#EF4444";

  if (dias <= 7) return "#FACC15";

  return "#22C55E";
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

  let filtrados = alimentos.filter(alimento => {

    const coincideNombre =
      alimento.nombre.toLowerCase()
      .includes(texto);

    const coincideCategoria =
      categoria === "" ||
      alimento.categoria === categoria;

    return (
      coincideNombre &&
      coincideCategoria
    );
  });

  filtrados.sort((a, b) => {

    return (
      new Date(a.caducidad) -
      new Date(b.caducidad)
    );

  });

  filtrados.forEach((alimento) => {

    const dias =
      diasHastaCaducidad(
        alimento.caducidad
      );

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

      <p>Categoría: ${alimento.categoria}</p>

      <p>
        Cantidad: ${alimento.cantidad}

        ${alimento.cantidad <= 1
          ? '<span class="stock-bajo">⚠️ Stock Bajo</span>'
          : ''}
      </p>

      <p>
        Caduca:
        ${new Date(alimento.caducidad)
          .toLocaleDateString("es-ES")}
      </p>

      <p style="color:${colorCaducidad(dias)};font-weight:bold;">

      ${dias < 0
      ? `Caducado hace ${Math.abs(dias)} días`
      : dias === 0
        ? "Caduca hoy"
        : dias === 1
          ? "Caduca mañana"
          : `Caduca en ${dias} días`}

      </p>

      <button onclick="anadirACompra('${alimento.nombre}')">
        🛒 Comprar
      </button>

      <button onclick="eliminarAlimento(${alimentos.indexOf(alimento)})">
        🗑️ Eliminar
      </button>
    `;

    lista.appendChild(tarjeta);

  });

  actualizarDashboard();
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

  alimentos.push({

    nombre,
    cantidad,
    categoria,
    caducidad

  });

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

  compra.push({
    nombre,
    comprado: false
  });

  guardarCompra();

  actualizarDashboard();

  alert("Añadido a la compra");
}

function agregarCompra() {

  const input =
    document.getElementById("nuevoProducto");

  if (!input) return;

  const nombre =
    input.value.trim();

  if (!nombre) return;

  compra.push({
    nombre,
    comprado: false
  });

  guardarCompra();

  mostrarCompra();

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

function mostrarCompra() {

  const lista =
    document.getElementById("lista-compra");

  if (!lista) return;

  lista.innerHTML = "";

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
        ${item.comprado
          ? "↩️ Reabrir"
          : "✅ Comprado"}
      </button>

      <button onclick="eliminarCompra(${indice})">
        🗑️ Eliminar
      </button>

    `;

    lista.appendChild(tarjeta);

  });

}

function actualizarDashboard() {

  const total =
    alimentos.length;

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
