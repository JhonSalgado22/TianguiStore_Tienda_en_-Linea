document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();
  actualizarContadorCarrito();
});

async function cargarProductos() {
  const contenedor = document.getElementById("productos-container");
  if (!contenedor) return;

  try {
    const res = await fetch("/productos");
    if (!res.ok) throw new Error("No se pudo obtener el listado de productos.");

    const productos = await res.json();
    contenedor.innerHTML = "";

    if (!Array.isArray(productos) || productos.length === 0) {
      contenedor.innerHTML = `<p class="center-align grey-text text-lighten-2">No hay productos disponibles.</p>`;
      return;
    }

    productos.forEach(producto => renderizarProducto(producto, contenedor));
    asignarEventosAgregar();
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    contenedor.innerHTML = `<p class="center-align red-text text-lighten-2">No se pudieron cargar los productos.</p>`;
  }
}

function renderizarProducto(producto, contenedor) {
  const {
    producto_id: id,
    nombre = "Producto sin nombre",
    descripcion = "Sin descripción",
    precio = 0,
    stock = 0,
    imagen_url
  } = producto;

  let imagen = (imagen_url && imagen_url.trim()) ? imagen_url.trim() : "/imagenes/default.png";
  imagen = imagen.replace(/\\/g, "/").replace(/^public/, "").replace(/^\/?/, "/");

  const tarjeta = document.createElement("div");
  tarjeta.className = "col s12 m6 l4";

  const card = document.createElement("div");
  card.className = "card product-card hoverable z-depth-3 glass-card";

  // Imagen con enlace al detalle
  const cardImage = document.createElement("div");
  cardImage.className = "card-image";

  const link = document.createElement("a");
  link.href = `producto.html?id=${id}`;

  const img = document.createElement("img");
  img.src = imagen;
  img.alt = nombre;
  img.className = "responsive-img";
  img.style.height = "180px";
  img.style.objectFit = "cover";
  img.onerror = () => {
    img.src = "/imagenes/default.png";
  };

  link.appendChild(img);
  cardImage.appendChild(link);

  const cardContent = document.createElement("div");
  cardContent.className = "card-content white-text";
  cardContent.innerHTML = `
    <h6 class="product-title amber-text text-lighten-2 truncate" style="font-weight:bold;">
      ${nombre}
    </h6>
    <p class="grey-text text-lighten-1" style="font-size: 0.9rem;">${descripcion}</p>
    <p class="white-text" style="margin-top: 0.6rem;">
      <strong>$${parseFloat(precio).toFixed(2)}</strong>
      <span class="grey-text text-lighten-1" style="font-size: 0.85rem;"> | Stock: ${stock}</span>
    </p>
  `;

  const cardAction = document.createElement("div");
  cardAction.className = "card-action center-align";
  const btn = document.createElement("button");
  btn.className = "btn amber darken-2 waves-effect waves-light btn-agregar z-depth-1";
  btn.style.borderRadius = "20px";
  btn.innerHTML = `<i class="fas fa-cart-plus left"></i> Agregar`;
  btn.dataset.id = id;
  btn.dataset.nombre = nombre;
  btn.dataset.precio = precio;
  btn.dataset.imagen = imagen;
  cardAction.appendChild(btn);

  card.appendChild(cardImage);
  card.appendChild(cardContent);
  card.appendChild(cardAction);
  tarjeta.appendChild(card);
  contenedor.appendChild(tarjeta);
}

function asignarEventosAgregar() {
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const { id, nombre, precio, imagen } = btn.dataset;
      const imagen_final = (imagen && imagen.trim()) ? imagen.trim() : "/imagenes/default.png";
      agregarAlCarrito(id, nombre, parseFloat(precio), imagen_final);
    });
  });
}

function agregarAlCarrito(id, nombre, precio, imagen_url) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1, imagen_url });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  mostrarToast(`🛒 ${nombre} agregado al carrito`);
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  document.querySelectorAll("#contador-carrito").forEach(el => (el.textContent = total));
}

function mostrarToast(mensaje) {
  M.toast({
    html: `<i class="fas fa-check-circle left"></i> ${mensaje}`,
    classes: "rounded amber darken-2 white-text",
    displayLength: 3000
  });
}
