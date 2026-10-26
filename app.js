let alimentos = JSON.parse(localStorage.getItem("alimentos")) || [];

function guardarAlimentos() {
  localStorage.setItem(
    "alimentos",
    JSON.stringify(alimentos)
  );
}

function mostrarAlimentos() {

  const lista = document.getElementById("lista-alimentos");

  if (!lista) return;

  lista.innerHTML = "";

  alimentos.forEach((alimento, indice) => {

    const tarjeta = document.createElement("div");

    tarjeta.className = "card";

    tarjeta.innerHTML = `
    <h3>${alimento.nombre}</h3>
    <p>Cantidad: ${alimento.cantidad}</p>

    <button onclick="eliminarAlimento(${indice})">
    🗑️ Eliminar
    </button>
    `;

    lista.appendChild(tarjeta);
  });

  actualizarDashboard();
}

function agregarAlimento() {

  const nombre = document
    .getElementById("nombre")
    .value
    .trim();

  const cantidad = Number(
    document.getElementById("cantidad").value
  );

  if (!nombre) {
    alert("Introduce un nombre");
    return;
  }

  if (cantidad <= 0) {
    alert("La cantidad debe ser mayor que 0");
    return;
  }

  alimentos.push({
    nombre,
    cantidad
  });

  guardarAlimentos();

  mostrarAlimentos();

  document.getElementById("nombre").value = "";
  document.getElementById("cantidad").value = "";
}

function eliminarAlimento(indice) {

  alimentos.splice(indice, 1);

  guardarAlimentos();

  mostrarAlimentos();
}

function actualizarDashboard() {

  const total = document.getElementById("total-productos");

  if (total) {
    total.textContent = alimentos.length;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  mostrarAlimentos
);
