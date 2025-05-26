/**
 * 📦 loadComponent.js
 * Carga dinámica de Navbar y Footer, aplica tema, y controla visibilidad por sesión.
 * Autor: I.S.C. Erick Renato Vega Ceron — Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    aplicarTemaDesdePreferencias();
    await Promise.all([cargarNavbar(), cargarFooter()]);
    inicializarMaterialize();
    sincronizarToggleTema();
    actualizarContadorCarrito();
  } catch (error) {
    console.error("⚠️ Error general de inicialización:", error);
  }
});

/* ══════════════════════════════════════
   📁 CARGA DE COMPONENTES
═══════════════════════════════════════ */

async function cargarNavbar() {
  const contenedor = document.getElementById("navbar-container");
  if (!contenedor) return;

  try {
    const res = await fetch("./componentes/navbar.html");
    if (!res.ok) throw new Error("No se pudo cargar navbar.html");
    contenedor.innerHTML = await res.text();
    contenedor.classList.add("animate__animated", "animate__fadeInDown");

    gestionarVisibilidadMenus();
  } catch (err) {
    console.error("❌ Navbar:", err);
    contenedor.innerHTML = `<nav class="red darken-4 center-align">⚠️ Error al cargar menú</nav>`;
  }
}

async function cargarFooter() {
  const contenedor = document.getElementById("footer-container");
  if (!contenedor) return;

  try {
    const res = await fetch("./componentes/footer.html");
    if (!res.ok) throw new Error("No se pudo cargar footer.html");
    contenedor.innerHTML = await res.text();
    contenedor.classList.add("animate__animated", "animate__fadeInUp");
  } catch (err) {
    console.error("❌ Footer:", err);
    contenedor.innerHTML = `<footer class="page-footer red darken-4 center-align">⚠️ Error al cargar pie de página</footer>`;
  }
}

/* ══════════════════════════════════════
   🌗 TEMA OSCURO / CLARO
═══════════════════════════════════════ */

function aplicarTemaDesdePreferencias() {
  const tema = localStorage.getItem("tema") || "oscuro";
  document.documentElement.classList.toggle("dark", tema === "oscuro");
}

function sincronizarToggleTema() {
  const toggle = document.getElementById("toggleThemeBtn");
  const icono = toggle?.querySelector("i");
  if (!toggle || !icono) return;

  const temaActual = localStorage.getItem("tema") || "oscuro";
  icono.classList.replace("fa-moon", temaActual === "oscuro" ? "fa-sun" : "fa-moon");

  toggle.addEventListener("click", () => {
    const oscuro = document.documentElement.classList.toggle("dark");
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
    icono.classList.toggle("fa-sun", oscuro);
    icono.classList.toggle("fa-moon", !oscuro);
  });
}

/* ══════════════════════════════════════
   🧠 MATERIALIZE INIT
═══════════════════════════════════════ */

function inicializarMaterialize() {
  M.Sidenav.init(document.querySelectorAll(".sidenav"));
  M.Tooltip.init(document.querySelectorAll(".tooltipped"));
  M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"), {
    constrainWidth: false,
    coverTrigger: false,
    alignment: "right"
  });

  // Importante: inits para selects también
  M.FormSelect.init(document.querySelectorAll("select"));
}

/* ══════════════════════════════════════
   🛒 CARRITO
═══════════════════════════════════════ */

function actualizarContadorCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const total = carrito.reduce((acc, prod) => acc + (prod.cantidad || 0), 0);
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = total);
  } catch (err) {
    console.error("❌ Error en contador de carrito:", err);
  }
}

/* ══════════════════════════════════════
   🔐 VISIBILIDAD DE MENÚ POR SESIÓN
═══════════════════════════════════════ */

function gestionarVisibilidadMenus() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const permisos = usuario?.permisos || {};
  const usuarioInfo = document.getElementById("usuario-info");

  const mostrar = (ids, visible = true) => {
    [].concat(ids).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = visible ? "block" : "none";
    });
  };

  const menus = {
    login: ["menu-login", "menu-login-desktop", "menu-login-mobile"],
    registro: ["menu-registro", "menu-registro-mobile"],
    logout: ["menu-logout", "menu-logout-desktop", "menu-logout-mobile"],
    perfil: ["menu-perfil-desktop", "menu-perfil-mobile"],
    pedidos: ["nav-pedidos", "nav-pedidos-mobile"],
    usuarios: ["nav-usuarios", "nav-usuarios-mobile"],
    configuracion: ["nav-configuracion"],
    metricas: ["nav-metricas"],
    panel: ["nav-panel"]
  };

  // Ocultar todo por defecto
  Object.values(menus).flat().forEach(id => mostrar(id, false));

  if (!token || !usuario) {
    mostrar([...menus.login, ...menus.registro], true);
    if (usuarioInfo) usuarioInfo.textContent = "Cuenta";
    return;
  }

  // Sesión iniciada
  mostrar([...menus.logout, ...menus.perfil, ...menus.pedidos], true);
  if (usuarioInfo) usuarioInfo.textContent = usuario.nombre || usuario.correo || "Usuario";

  // Permisos por rol
  if (permisos.usuarios?.leer) mostrar(menus.usuarios, true);
  if (permisos.configuracion?.leer) mostrar(menus.configuracion, true);
  if (permisos.reportes?.exportar) mostrar(menus.metricas, true);

  if (
    permisos.usuarios?.leer ||
    permisos.productos?.leer ||
    permisos.configuracion?.leer ||
    permisos.reportes?.exportar
  ) {
    mostrar(menus.panel, true);
  }

  asignarLogout(menus.logout);
}

/* ══════════════════════════════════════
   🔓 LOGOUT
═══════════════════════════════════════ */

function asignarLogout(ids) {
  const logout = () => {
    localStorage.clear();
    M.toast({ html: "Sesión cerrada exitosamente", classes: "rounded amber darken-3" });
    window.location.href = "login.html";
  };

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = logout;
  });
}
