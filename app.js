let alimentos = JSON.parse(localStorage.getItem("alimentos")) || [];

function guardarAlimentos() {
  localStorage.setItem("alimentos", JSON.stringify(alimentos));
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

    return coincideNombre &&
           coincideCategoria;
  });

  filtrados.sort((a,b) => {

    return new Date(a.caducidad) -
           new Date(b.caducidad);

  });

  filtrados.forEach((alimento, indice) => {

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

      <p>Categoría: ${alimento.categoria}</p>

      <p>Cantidad: ${alimento.cantidad}</p>

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

  alimentos.splice(indice,1);

  guardarAlimentos();

  mostrarAlimentos();
}

function actualizarDashboard() {

  const total =
    alimentos.length;

  let proximos = 0;

  let caducados = 0;

  alimentos.forEach(alimento => {

    const dias =
      diasHastaCaducidad(alimento.caducidad);

    if (dias < 0)
      caducados++;

    if (dias >= 0 && dias <= 7)
      proximos++;

  });

  const totalElement =
    document.getElementById("total-productos") ||
    document.getElementById("totalProductos");

  const proximosElement =
    document.getElementById("productos-caducar") ||
    document.getElementById("caducarPronto");

  const caducadosElement =
    document.getElementById("caducados");

  if (totalElement)
    totalElement.textContent = total;

  if (proximosElement)
    proximosElement.textContent = proximos;

  if (caducadosElement)
    caducadosElement.textContent = caducados;
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    mostrarAlimentos();

    actualizarDashboard();

  }
);
