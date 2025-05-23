/**
 * 📁 togglePassword.js
 * 
 * Alterna visibilidad del campo de contraseña en TianguiStore con accesibilidad completa.
 * Compatible con FontAwesome, MaterializeCSS y prácticas recomendadas.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Última actualización: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const icon = toggleBtn?.querySelector("i");

  // ⚠️ Validación de existencia de elementos
  if (!toggleBtn || !passwordInput || !icon) return;

  // ♿ Accesibilidad inicial
  configurarAccesibilidad(toggleBtn);

  // 🔁 Alternar visibilidad
  const toggleVisibilidad = () => {
    const oculto = passwordInput.type === "password";
    passwordInput.type = oculto ? "text" : "password";

    icon.classList.toggle("fa-eye", oculto);
    icon.classList.toggle("fa-eye-slash", !oculto);

    toggleBtn.setAttribute("aria-pressed", String(!oculto));
    toggleBtn.setAttribute("aria-label", oculto ? "Ocultar contraseña" : "Mostrar contraseña");
  };

  // 🖱️ Click
  toggleBtn.addEventListener("click", toggleVisibilidad);

  // ⌨️ Teclado (Enter o Espacio)
  toggleBtn.addEventListener("keydown", ({ key }) => {
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      toggleVisibilidad();
    }
  });
});

/**
 * ♿ Configura atributos ARIA en el botón toggle
 */
function configurarAccesibilidad(btn) {
  btn.setAttribute("role", "button");
  btn.setAttribute("tabindex", "0");
  btn.setAttribute("aria-label", "Mostrar contraseña");
  btn.setAttribute("aria-pressed", "false");
}
