document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    mostrarError("ID de producto no especificado.");
    return;
  }

  try {
    const res = await fetch(`/productos/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener el producto.");

    const producto = await res.json();
    renderizarProducto(producto);
  } catch (err) {
    console.error("❌ Error cargando el producto:", err);
    mostrarError("No se pudo cargar la información del producto.");
  }
});

function renderizarProducto(producto) {
  const contenedor = document.getElementById("detalle-producto");
  const {
    nombre = "Sin nombre",
    descripcion = "Sin descripción disponible.",
    precio = 0,
    stock = 0,
    imagen_url
  } = producto;

  let imagen = (imagen_url && imagen_url.trim()) ? imagen_url.trim() : "/imagenes/default.png";
  imagen = imagen.replace(/\\/g, "/").replace(/^public/, "").replace(/^\/?/, "/");

  contenedor.innerHTML = `
    <h4 class="amber-text text-lighten-2">${nombre}</h4>
    <img src="${imagen}" alt="${nombre}" class="producto-img z-depth-2" onerror="this.src='/imagenes/default.png'"/>
    <p style="margin-top: 1rem;">${descripcion}</p>
    <h5 class="white-text">$${parseFloat(precio).toFixed(2)}</h5>
    <p class="grey-text text-lighten-1">Stock disponible: ${stock}</p>
    <button class="btn amber darken-2 waves-effect waves-light" onclick="agregarDesdeDetalle('${producto.producto_id}', '${nombre}', ${precio}, '${imagen}')">
      <i class="fas fa-cart-plus left"></i> Agregar al carrito
    </button>
  `;
}

function mostrarError(mensaje) {
  const contenedor = document.getElementById("detalle-producto");
  contenedor.innerHTML = `<p class="red-text">${mensaje}</p>`;
}

function agregarDesdeDetalle(id, nombre, precio, imagen_url) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1, imagen_url });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  M.toast({
    html: `<i class="fas fa-check-circle left"></i> ${nombre} agregado al carrito`,
    classes: "rounded amber darken-2 white-text",
    displayLength: 3000
  });
}
