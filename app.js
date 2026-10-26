console.log("FoodMind iniciado");
function agregarAlimento() {

  const nombre = document.getElementById("nombre").value;
  const cantidad = document.getElementById("cantidad").value;

  const tarjeta = document.createElement("div");

  tarjeta.className = "card";

  tarjeta.innerHTML = `
    <h3>${nombre}</h3>
    <p>Cantidad: ${cantidad}</p>
  `;

  document
    .getElementById("lista-alimentos")
    .appendChild(tarjeta);

}
