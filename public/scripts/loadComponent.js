/**
 * 📦 loadComponent.js
 * Carga dinámica de Navbar y Footer, aplica tema, y controla visibilidad por sesión.
 * Adaptado con menús/submenús y roles.
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

    gestionarVisibilidadMenus(); // 🔐 Visibilidad y roles
    inicializarMaterialize(); // Asegura dropdowns y collapsibles
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
  M.Collapsible.init(document.querySelectorAll(".collapsible"));
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
   🔐 VISIBILIDAD DE MENÚ POR SESIÓN Y ROL
═══════════════════════════════════════ */

function gestionarVisibilidadMenus() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const permisos = usuario?.permisos || {};
  const menuUsuario = document.getElementById("menu-usuario");

  if (!menuUsuario) return;

  menuUsuario.innerHTML = ""; // Limpiar menú anterior

  if (!token || !usuario) {
    menuUsuario.innerHTML = `
      <li id="menu-login-desktop"><a href="login.html"><i class="fas fa-sign-in-alt left"></i> Iniciar sesión</a></li>
      <li id="menu-registro"><a href="registro.html"><i class="fas fa-user-plus left"></i> Crear cuenta</a></li>
    `;
    return;
  }

  // Usuario autenticado
  const nombre = usuario.nombre || usuario.correo || "Usuario";

  menuUsuario.innerHTML = `
    <li>
      <a class="dropdown-trigger" href="#!" data-target="dropdown-usuario">
        <i class="fas fa-user-circle left"></i> <span id="usuario-info">${nombre}</span> <i class="fas fa-caret-down right"></i>
      </a>
    </li>
  `;

  // Generar dropdown
  const dropdown = document.createElement("ul");
  dropdown.id = "dropdown-usuario";
  dropdown.className = "dropdown-content";

  dropdown.innerHTML = `
    <li><a href="perfil.html" id="menu-perfil-desktop"><i class="fas fa-user left"></i> Mi Perfil</a></li>
    ${permisos.admin ? `<li><a href="adminPanel.html" id="nav-panel"><i class="fas fa-cogs left"></i> Panel Admin</a></li>` : ""}
    ${permisos.usuarios?.leer ? `<li><a href="usuarios.html" id="nav-usuarios"><i class="fas fa-users left"></i> Usuarios</a></li>` : ""}
    ${permisos.configuracion?.leer ? `<li><a href="configuracion.html" id="nav-configuracion"><i class="fas fa-sliders-h left"></i> Configuración</a></li>` : ""}
    ${permisos.reportes?.exportar ? `<li><a href="metricas.html" id="nav-metricas"><i class="fas fa-chart-bar left"></i> Métricas</a></li>` : ""}
    <li class="divider"></li>
    <li><a href="#" id="menu-logout"><i class="fas fa-sign-out-alt left"></i> Cerrar sesión</a></li>
  `;
  document.body.appendChild(dropdown);

  M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
    constrainWidth: false,
    coverTrigger: false,
    alignment: 'right'
  });

  asignarLogout(["menu-logout"]);
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
