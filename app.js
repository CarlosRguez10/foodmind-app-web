console.log("FoodMind iniciado");
function agregarAlimento() {

  const nombre = document.getElementById("nombre").value.trim();
  const cantidad = Number(document.getElementById("cantidad").value);

  if (!nombre) {
    alert("Introduce un nombre");
    return;
  }

  if (cantidad <= 0) {
    alert("La cantidad debe ser mayor que 0");
    return;
  }

  const tarjeta = document.createElement("div");

  tarjeta.className = "card";

  tarjeta.innerHTML = `
    <h3>${nombre}</h3>
    <p>Cantidad: ${cantidad}</p>
  `;

  document
    .getElementById("lista-alimentos")
    .appendChild(tarjeta);

  document.getElementById("nombre").value = "";
  document.getElementById("cantidad").value = "";
}
