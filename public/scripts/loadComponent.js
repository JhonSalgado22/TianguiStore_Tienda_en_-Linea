/**
 * 📦 loadComponent.js
 * Carga dinámica de Navbar y Footer, aplica tema, y controla visibilidad por sesión.
 * Autor: I.S.C. Erick Renato Vega Ceron — Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    aplicarTemaDesdePreferencias();
    await Promise.all([cargarNavbar(), cargarFooter()]);
    sincronizarToggleTema();
    actualizarContadorCarrito();
  } catch (error) {
    console.error("⚠️ Error al inicializar interfaz:", error);
  }
});

/* ══════════════════════════════════════════════
   📁 CARGA DE COMPONENTES
══════════════════════════════════════════════ */

async function cargarNavbar() {
  const contenedor = document.getElementById("navbar-container");
  if (!contenedor) return;

  try {
    const res = await fetch("./componentes/navbar.html");
    if (!res.ok) throw new Error("Error al cargar navbar");
    contenedor.innerHTML = await res.text();
    contenedor.classList.add("animate__animated", "animate__fadeInDown");

    inicializarMaterialize();
    gestionarVisibilidadMenus();
  } catch {
    contenedor.innerHTML = `<nav class="red darken-4 center-align">⚠️ Error al cargar menú</nav>`;
  }
}

async function cargarFooter() {
  const contenedor = document.getElementById("footer-container");
  if (!contenedor) return;

  try {
    const res = await fetch("./componentes/footer.html");
    if (!res.ok) throw new Error("Error al cargar footer");
    contenedor.innerHTML = await res.text();
    contenedor.classList.add("animate__animated", "animate__fadeInUp");
  } catch {
    contenedor.innerHTML = `<footer class="page-footer red darken-4 center-align">⚠️ Error al cargar pie de página</footer>`;
  }
}

/* ══════════════════════════════════════════════
   🌗 TEMA OSCURO / CLARO
══════════════════════════════════════════════ */

function aplicarTemaDesdePreferencias() {
  const tema = localStorage.getItem("tema") ?? "oscuro";
  document.documentElement.classList.toggle("dark", tema === "oscuro");
}

function sincronizarToggleTema() {
  const toggle = document.getElementById("toggleThemeBtn");
  const icono = toggle?.querySelector("i");
  if (!toggle || !icono) return;

  const temaActual = localStorage.getItem("tema") ?? "oscuro";
  icono.classList.replace("fa-moon", temaActual === "oscuro" ? "fa-sun" : "fa-moon");

  toggle.addEventListener("click", () => {
    const esOscuro = document.documentElement.classList.toggle("dark");
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
    icono.classList.toggle("fa-sun", esOscuro);
    icono.classList.toggle("fa-moon", !esOscuro);
  });
}

/* ══════════════════════════════════════════════
   🧠 MATERIALIZE INIT
══════════════════════════════════════════════ */

function inicializarMaterialize() {
  M.Sidenav.init(document.querySelectorAll(".sidenav"));
  M.Tooltip.init(document.querySelectorAll(".tooltipped"));
  M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"), {
    constrainWidth: false,
    coverTrigger: false,
    alignment: "right"
  });
}

/* ══════════════════════════════════════════════
   🛒 CARRITO
══════════════════════════════════════════════ */

function actualizarContadorCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito") ?? "[]");
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.querySelectorAll("#contador-carrito")
      .forEach(el => el.textContent = total);
  } catch (e) {
    console.error("❌ Error al actualizar carrito:", e);
  }
}

/* ══════════════════════════════════════════════
   🔐 VISIBILIDAD DE MENÚ POR SESIÓN
══════════════════════════════════════════════ */

function gestionarVisibilidadMenus() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") ?? "null");
  const permisos = usuario?.permisos ?? {};
  const usuarioInfo = document.getElementById("usuario-info");

  const mostrar = (ids, visible = true) =>
    [].concat(ids).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = visible ? "block" : "none";
    });

  const idsGlobales = [
    "menu-login", "menu-login-desktop", "menu-login-mobile",
    "menu-registro", "menu-registro-mobile",
    "menu-logout", "menu-logout-desktop", "menu-logout-mobile",
    "menu-perfil-desktop", "menu-perfil-mobile",
    "nav-usuarios", "nav-usuarios-mobile",
    "nav-pedidos", "nav-pedidos-mobile",
    "nav-configuracion", "nav-metricas", "nav-panel"
  ];

  mostrar(idsGlobales, false);

  if (!token || !usuario) {
    mostrar(["menu-login", "menu-login-desktop", "menu-login-mobile", "menu-registro", "menu-registro-mobile"], true);
    if (usuarioInfo) usuarioInfo.textContent = "Cuenta";
    return;
  }

  if (usuarioInfo) usuarioInfo.textContent = usuario.nombre ?? usuario.correo ?? "Usuario";

  mostrar(["menu-logout", "menu-logout-desktop", "menu-logout-mobile"], true);
  mostrar(["menu-perfil-desktop", "menu-perfil-mobile"], true);
  mostrar(["nav-pedidos", "nav-pedidos-mobile"], true); // Siempre visible autenticado

  const reglas = [
    { ids: ["nav-usuarios", "nav-usuarios-mobile"], permiso: permisos.usuarios?.leer },
    { ids: ["nav-configuracion"], permiso: permisos.configuracion?.leer },
    { ids: ["nav-metricas"], permiso: permisos.reportes?.exportar },
    {
      ids: ["nav-panel"],
      permiso:
        permisos.usuarios?.leer ||
        permisos.productos?.leer ||
        permisos.configuracion?.leer ||
        permisos.reportes?.exportar
    }
  ];
  reglas.forEach(({ ids, permiso }) => mostrar(ids, permiso));

  asignarLogout(["menu-logout", "menu-logout-desktop", "menu-logout-mobile"]);
}

/* ══════════════════════════════════════════════
   🔓 LOGOUT
══════════════════════════════════════════════ */

function asignarLogout(ids) {
  const logout = () => {
    localStorage.clear();
    M.toast({
      html: "Sesión cerrada exitosamente",
      classes: "rounded amber darken-3",
    });
    window.location.href = "login.html";
  };

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = logout;
  });
}
