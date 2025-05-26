/**
 * 📦 productos.js (versión mejorada)
 * Carga productos desde la API, los muestra en tarjetas con diseño elegante, y permite agregarlos al carrito.
 * Incluye mejoras visuales, accesibilidad, y separación limpia del contenido.
 * Autor: I.S.C. Erick Renato Vega Ceron | Adaptado Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();
  actualizarContadorCarrito();
});

/* ─────────────────────────────────────────────
 * 🔄 Cargar productos y renderizar tarjetas
 * ───────────────────────────────────────────── */
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

    productos.forEach(producto => {
      const {
        producto_id: id,
        nombre = "Producto sin nombre",
        descripcion = "Sin descripción",
        precio = 0,
        stock = 0,
        imagen_url
      } = producto;

      // Validar imagen o usar la predeterminada
      let imagen = (imagen_url && imagen_url.trim()) ? imagen_url.trim() : "/imagenes/default.png";
      imagen = imagen.replace(/\\/g, "/").replace(/^public/, "").replace(/^\/?/, "/");

      const tarjeta = document.createElement("div");
      tarjeta.className = "col s12 m6 l4";

      const card = document.createElement("div");
      card.className = "card product-card hoverable z-depth-3";

      // Imagen
      const cardImage = document.createElement("div");
      cardImage.className = "card-image";
      const img = document.createElement("img");
      img.src = imagen;
      img.alt = nombre;
      img.style.height = "180px";
      img.style.objectFit = "cover";
      img.onerror = () => {
        img.src = "/imagenes/default.png";
      };
      cardImage.appendChild(img);

      // Contenido
      const cardContent = document.createElement("div");
      cardContent.className = "card-content white-text";
      cardContent.innerHTML = `
        <h6 class="product-title amber-text text-lighten-2 truncate" style="font-weight:bold; margin-bottom:0.4rem;">
          ${nombre}
        </h6>
        <p class="product-description grey-text text-lighten-1" style="font-size: 0.9rem; line-height:1.3;">
          ${descripcion}
        </p>
        <div class="product-price-stock" style="margin-top:0.6rem;">
          <span class="product-price white-text" style="font-size:1.05rem; font-weight:bold;">$${parseFloat(precio).toFixed(2)}</span>
          <span class="product-stock grey-text text-lighten-1" style="font-size:0.85rem;"> | Stock: ${stock}</span>
        </div>
      `;

      // Acción
      const cardAction = document.createElement("div");
      cardAction.className = "card-action center-align";
      const btn = document.createElement("button");
      btn.className = "btn amber darken-2 waves-effect waves-light btn-agregar z-depth-1";
      btn.style.borderRadius = "20px";
      btn.style.marginTop = "10px";
      btn.innerHTML = `<i class="fas fa-cart-plus left"></i> Agregar`;
      btn.dataset.id = id;
      btn.dataset.nombre = nombre;
      btn.dataset.precio = precio;
      btn.dataset.imagen = imagen;
      cardAction.appendChild(btn);

      // Ensamblar tarjeta
      card.appendChild(cardImage);
      card.appendChild(cardContent);
      card.appendChild(cardAction);
      tarjeta.appendChild(card);
      contenedor.appendChild(tarjeta);
    });

    asignarEventosAgregar();
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    contenedor.innerHTML = `<p class="center-align red-text">No se pudieron cargar los productos.</p>`;
  }
}

/* ─────────────────────────────────────────────
 * ➕ Eventos de agregar al carrito
 * ───────────────────────────────────────────── */
function asignarEventosAgregar() {
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const { id, nombre, precio, imagen } = btn.dataset;
      const imagen_final = (imagen && imagen.trim()) ? imagen.trim() : "/imagenes/default.png";
      agregarAlCarrito(id, nombre, parseFloat(precio), imagen_final);
    });
  });
}

/* ─────────────────────────────────────────────
 * 🛒 Agregar producto al carrito (localStorage)
 * ───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
 * 🔢 Actualizar contador del carrito
 * ───────────────────────────────────────────── */
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  document.querySelectorAll("#contador-carrito").forEach(el => (el.textContent = total));
}

/* ─────────────────────────────────────────────
 * 🔔 Mostrar notificación tipo toast
 * ───────────────────────────────────────────── */
function mostrarToast(mensaje) {
  M.toast({
    html: `<i class="fas fa-check-circle left"></i> ${mensaje}`,
    classes: "rounded amber darken-2 white-text",
    displayLength: 3000
  });
}
