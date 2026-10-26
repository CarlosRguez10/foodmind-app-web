console.log("FoodMind iniciado");
function agregarAlimento() {
  const nombre = document.getElementById("nombre").value;
  const cantidad = document.getElementById("cantidad").value;

  alert(
    "Alimento: " + nombre +
    "\nCantidad: " + cantidad
  );
}
