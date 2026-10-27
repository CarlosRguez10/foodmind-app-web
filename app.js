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
          ? '<span class="stock-bajo">⚠️ Stock Bajo</
