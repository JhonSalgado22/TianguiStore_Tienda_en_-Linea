// 📦 TianguiStore - carrito.js
const BASE_URL = window.location.origin;
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
  actualizarContadorCarrito();

  // Botón: Proceder al pago
  const btnPagar = document.getElementById("btnRealizarPedido");
  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      if (!token) {
        alert("⚠️ Debes iniciar sesión para completar tu compra.");
        window.location.href = `${BASE_URL}/login.html`;
        return;
      }
      validarStockAntesDeCheckout();
    });
  }

  // Botón: Vaciar carrito
  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      mostrarCarrito();
      actualizarContadorCarrito();
      mostrarToast("Carrito vaciado correctamente.", "warning");
    });
  }
});

/* ══════════════════════════════════════════════
   🛒 Mostrar contenido del carrito
══════════════════════════════════════════════ */
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const lista = document.getElementById("lista-carrito");
  const totalLabel = document.getElementById("total_etiqueta");
  const subtotalLabel = document.getElementById("resumen-subtotal");
  const ivaLabel = document.getElementById("resumen-iva");

  if (!lista || !totalLabel || !subtotalLabel || !ivaLabel) return;

  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `
      <li class="collection-item center-align grey-text text-lighten-1">
        🛒 Tu carrito está vacío.
      </li>`;
    subtotalLabel.textContent = "$0.00";
    ivaLabel.textContent = "$0.00";
    totalLabel.textContent = "Total: $0.00";
    return;
  }

  let subtotal = 0;
  const IVA_PORCENTAJE = 0.16;

  carrito.forEach((producto) => {
    const precio = parseFloat(producto.precio) || 0;
    const cantidad = producto.cantidad || 1;
    const itemSubtotal = precio * cantidad;
    subtotal += itemSubtotal;

    const imagenUrl =
      producto.imagen_url && producto.imagen_url.trim()
        ? producto.imagen_url.startsWith("http")
          ? producto.imagen_url
          : `${BASE_URL}/${producto.imagen_url.replace(/^\/+/, "")}`
        : `${BASE_URL}/imagenes/default.png`;

    const item = document.createElement("li");
    item.className = "collection-item grey darken-4 white-text";

    item.innerHTML = `
      <div class="row valign-wrapper producto-item">
        <div class="col s3 center-align">
         <img src="${imagenUrl}" alt="${producto.nombre}"
        class="responsive-img z-depth-2 producto-img"
        style="width: 100px; height: 100px; object-fit: cover; border-radius: 0.5rem;"
        data-id="${producto.id}" />
        </div>
        <div class="col s9">
          <h6 class="truncate white-text">${producto.nombre}</h6>
          <p class="grey-text text-lighten-1">
            Precio: <strong class="teal-text">$${precio.toFixed(2)}</strong> |
            Subtotal: <strong class="green-text">$${itemSubtotal.toFixed(2)}</strong>
          </p>
          <div class="center-align" style="margin-top: 0.5rem;">
            <div style="margin-bottom: 0.6rem;">
              <button class="btn-floating btn-small red darken-2 disminuir-cantidad" data-id="${producto.id}">
                <i class="fas fa-minus"></i>
              </button>
              <span class="mx-2 white-text" style="margin: 0 0.8rem;">${cantidad}</span>
              <button class="btn-floating btn-small green darken-2 aumentar-cantidad" data-id="${producto.id}">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="btn-flat btn-small white-text red-text eliminar-producto" data-id="${producto.id}">
              <i class="fas fa-trash-alt left"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `;

    lista.appendChild(item);
    const img = item.querySelector("img.producto-img");
    if (img) {
      img.addEventListener("error", () => {
        if (!img.dataset.defaulted) {
          img.dataset.defaulted = "true";
          img.src = `${BASE_URL}/imagenes/default.png`;
        }
      });
    }
  });

  const iva = subtotal * IVA_PORCENTAJE;
  const total = subtotal + iva;

  subtotalLabel.textContent = `$${subtotal.toFixed(2)}`;
  ivaLabel.textContent = `$${iva.toFixed(2)}`;
  totalLabel.textContent = `Total: $${total.toFixed(2)}`;

  // Reasignar listeners
  document
    .querySelectorAll(".disminuir-cantidad")
    .forEach((btn) =>
      btn.addEventListener("click", () => modificarCantidad(btn.dataset.id, -1))
    );
  document
    .querySelectorAll(".aumentar-cantidad")
    .forEach((btn) =>
      btn.addEventListener("click", () => modificarCantidad(btn.dataset.id, 1))
    );
  document
    .querySelectorAll(".eliminar-producto")
    .forEach((btn) =>
      btn.addEventListener("click", () => eliminarProducto(btn.dataset.id))
    );
}

/* ══════════════════════════════════════════════
   🔄 Modificar cantidad
══════════════════════════════════════════════ */
function modificarCantidad(id, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex((p) => p.id === id);
  if (index !== -1) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
  }
}

/* ══════════════════════════════════════════════
   🗑️ Eliminar producto
══════════════════════════════════════════════ */
function eliminarProducto(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter((p) => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
  mostrarToast("Producto eliminado del carrito.", "danger");
}

/* ══════════════════════════════════════════════
   🔢 Contador carrito
══════════════════════════════════════════════ */
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  document
    .querySelectorAll("#contador-carrito")
    .forEach((el) => (el.textContent = total));
}

/* ══════════════════════════════════════════════
   🔔 Toast UI
══════════════════════════════════════════════ */
function mostrarToast(mensaje, tipo = "success") {
  const container =
    document.getElementById("toast-container") || crearContenedorToasts();
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${tipo} border-0 show shadow mb-2`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body fw-bold">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function crearContenedorToasts() {
  const div = document.createElement("div");
  div.id = "toast-container";
  div.className = "position-fixed bottom-0 end-0 p-3";
  div.style.zIndex = 1056;
  document.body.appendChild(div);
  return div;
}

/* ══════════════════════════════════════════════
   ✅ Validar stock en checkout
══════════════════════════════════════════════ */
async function validarStockAntesDeCheckout() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const errores = [];

  if (carrito.length === 0) {
    alert("❌ El carrito está vacío.");
    return;
  }

  for (const item of carrito) {
    try {
      const res = await fetch(`${BASE_URL}/productos/${item.id}`);
      if (!res.ok)
        throw new Error("No se pudo obtener información del producto.");
      const producto = await res.json();
      if (item.cantidad > producto.stock) {
        errores.push(
          `"${producto.nombre}" solo tiene ${producto.stock} unidades disponibles.`
        );
      }
    } catch (error) {
      errores.push(`Error al verificar stock del producto ID ${item.id}`);
    }
  }

  if (errores.length > 0) {
    alert("❌ No se puede continuar:\n\n" + errores.join("\n"));
    return;
  }

  localStorage.setItem("checkout_validado", "true");
  window.location.href = `${BASE_URL}/checkout.html`;
}
