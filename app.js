let alimentos =
  JSON.parse(localStorage.getItem("alimentos")) || [];

function guardarAlimentos() {
  localStorage.setItem(
    "alimentos",
    JSON.stringify(alimentos)
  );
}

function diasHastaCaducidad(fecha) {

  const hoy = new Date();

  const vencimiento = new Date(fecha);

  const diferencia =
    vencimiento - hoy;

  return Math.ceil(
    diferencia / (1000 * 60 * 60 * 24)
  );
}

function colorCaducidad(dias) {

  if (dias <= 3) {
    return "#EF4444";
  }

  if (dias <= 7) {
    return "#FACC15";
  }

  return "#22C55E";
}

function mostrarAlimentos() {

  const lista =
    document.getElementById("lista-alimentos");

  if (!lista) return;

  lista.innerHTML = "";

  alimentos.forEach((alimento, indice) => {

    const dias =
      diasHastaCaducidad(
        alimento.caducidad
      );

    const tarjeta =
      document.createElement("div");

    tarjeta.className = "card";

    tarjeta.innerHTML = `
      <h3>${alimento.nombre}</h3>

      <p>Cantidad:
      ${alimento.cantidad}</p>

      <p>
      Caduca:
      ${alimento.caducidad}
      </p>

      <p style="
      color:${colorCaducidad(dias)};
      font-weight:bold;">
      ${dias} días
      </p>

      <button
      onclick="eliminarAlimento(${indice})">
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
    .value
    .trim();

  const cantidad =
    Number(
      document.getElementById("cantidad")
      .value
    );

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

  if (!caducidad) {
    alert("Selecciona una fecha");
    return;
  }

  alimentos.push({
    nombre,
    cantidad,
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

function actualizarDashboard() {

  let total = alimentos.length;

  let proximos = 0;

  alimentos.forEach(alimento => {

    const dias =
      diasHastaCaducidad(
        alimento.caducidad
      );

    if (dias <= 7) {
      proximos++;
    }

  });

  const totalElement =
    document.getElementById(
      "total-productos"
    );

  const proximosElement =
    document.getElementById(
      "productos-caducar"
    );

  if (totalElement) {
    totalElement.textContent = total;
  }

  if (proximosElement) {
    proximosElement.textContent =
      proximos;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  mostrarAlimentos
);
