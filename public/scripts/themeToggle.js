/**
 * 📁 themeToggle.js
 * 
 * Alterna entre tema claro y oscuro en TianguiStore.
 * Guarda la preferencia del usuario en localStorage y actualiza el ícono dinámicamente.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Última actualización: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleThemeBtn");
  const root = document.documentElement;

  if (!root) return;

  // 🌗 Establecer tema inicial según localStorage
  const temaGuardado = localStorage.getItem("tema") ?? "oscuro";
  root.classList.toggle("dark", temaGuardado === "oscuro");

  // 🌞🌙 Configurar ícono e interacción
  if (toggleBtn) {
    actualizarIcono();

    toggleBtn.addEventListener("click", () => {
      const activarOscuro = !root.classList.contains("dark");
      root.classList.toggle("dark", activarOscuro);
      localStorage.setItem("tema", activarOscuro ? "oscuro" : "claro");
      actualizarIcono();
    });
  }

  // 🔁 Cambia el ícono según el tema actual
  function actualizarIcono() {
    if (!toggleBtn) return;
    const esOscuro = root.classList.contains("dark");
    toggleBtn.innerHTML = `<i class="fas ${esOscuro ? "fa-sun" : "fa-moon"}"></i>`;
  }
});
