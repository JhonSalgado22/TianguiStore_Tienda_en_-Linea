/**
 * 📦 misPedidos.js
 * Muestra los pedidos del usuario autenticado en TianguiStore.
 * Autor: I.S.C. Erick Renato Vega Ceron — Mayo 2025
 */

const BASE_URL = window.location.origin;
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {
  if (!token) {
    M.toast({ html: "⚠️ Sesión expirada", classes: "red darken-2" });
    return setTimeout(() => (window.location.href = "/login.html"), 1500);
  }

  try {
    await cargarPedidosUsuario();
    M.Modal.init(document.querySelectorAll(".modal"));
  } catch (error) {
    console.error("❌ Error general:", error);
    M.toast({ html: "Error inesperado", classes: "red darken-2" });
  }
});

/**
 * 🛒 Cargar pedidos del usuario
 */
async function cargarPedidosUsuario() {
  const tabla = document.getElementById("tabla-pedidos");
  if (!tabla) return;

  try {
    const response = await fetch(`${BASE_URL}/pedidos/mis`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      return location.href = "/login.html";
    }

    if (!response.ok) throw new Error("No se pudieron obtener los pedidos.");

    const pedidos = await response.json();

    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      return tabla.innerHTML = `
        <tr><td colspan="6" class="center-align grey-text text-lighten-1">
        🛒 No tienes pedidos aún.
        </td></tr>`;
    }

    pedidos.forEach(pedido => {
      const fila = crearFilaPedido(pedido);
      tabla.insertAdjacentHTML("beforeend", fila);
    });

    inicializarModalEventos();
  } catch (error) {
    tabla.innerHTML = `
      <tr><td colspan="6" class="center-align red-text">Error al cargar tus pedidos.</td></tr>`;
    console.error("❌ Error al cargar pedidos:", error);
  }
}

/**
 * 🧾 Genera HTML de fila para tabla responsiva
 */
function crearFilaPedido(pedido) {
  const puedeCancelar = [1, 2].includes(pedido.estado_id);
  return `
    <tr>
      <td data-label="#">${pedido.pedido_id}</td>
      <td data-label="Fecha">${new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
      <td data-label="Estado">${pedido.estado_nombre}</td>
      <td data-label="Total">$${parseFloat(pedido.total).toFixed(2)}</td>
      <td data-label="Ver">
        <button class="btn btn-small amber darken-2 modal-trigger"
                data-pedido="${pedido.pedido_id}" data-target="modalDetalleProductos">
          <i class="fas fa-eye"></i>
        </button>
      </td>
      <td data-label="Cancelar">
        ${
          puedeCancelar
            ? `<button class="btn red darken-1 btn-small" onclick="cancelarPedido(${pedido.pedido_id})">
                 <i class="fas fa-times-circle"></i>
               </button>`
            : `<span class="grey-text text-lighten-1">No cancelable</span>`
        }
      </td>
    </tr>`;
}

/**
 * 🧩 Inicializa eventos de modal
 */
function inicializarModalEventos() {
  document.querySelectorAll(".modal-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const pedidoId = btn.getAttribute("data-pedido");
      obtenerProductosDelPedido(pedidoId);
    });
  });
}

/**
 * 📦 Obtener productos del pedido
 */
async function obtenerProductosDelPedido(pedidoId) {
  const contenedor = document.getElementById("detalle-productos-contenido");
  contenedor.innerHTML = `<p class="grey-text text-lighten-2">Cargando...</p>`;

  try {
    const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}/productos`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("No se pudieron obtener los productos.");
    const productos = await response.json();

    if (!productos.length) {
      contenedor.innerHTML = `<p class="grey-text">Este pedido no tiene productos registrados.</p>`;
      return;
    }

    contenedor.innerHTML = productos.map(p => `
      <div class="col s12 m6">
        <div class="card-panel grey darken-3 white-text z-depth-1">
          <span class="fw-bold">${p.nombre}</span>
          <p>Cantidad: <strong>${p.cantidad}</strong></p>
          <p>Precio unitario: $${parseFloat(p.precio_unitario).toFixed(2)}</p>
        </div>
      </div>`).join("");

  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    contenedor.innerHTML = `<p class="red-text">Error al cargar productos del pedido.</p>`;
  }
}

/**
 * ❌ Cancelar pedido
 */
async function cancelarPedido(pedidoId) {
  if (!confirm("¿Deseas cancelar este pedido?")) return;

  try {
    const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}/cancelar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      M.toast({ html: "✅ Pedido cancelado.", classes: "teal darken-2" });
      setTimeout(() => location.reload(), 1000);
    } else {
      M.toast({ html: `❌ ${data.mensaje}`, classes: "red darken-2" });
    }
  } catch (error) {
    console.error("❌ Error al cancelar pedido:", error);
    M.toast({ html: "❌ No se pudo cancelar el pedido.", classes: "red darken-3" });
  }
}
