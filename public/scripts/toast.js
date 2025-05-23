/**
 * 📁 toast.js
 *
 * Muestra notificaciones tipo "toast" con MaterializeCSS en TianguiStore.
 * Soporta tipos: success, danger, warning, info.
 *
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Última actualización: Mayo 2025
 */

/**
 * Mostrar un toast con estilo personalizado.
 * @param {string} mensaje - El texto del mensaje.
 * @param {"success"|"danger"|"warning"|"info"} tipo - Tipo de notificación.
 * @param {number} duracion - Tiempo en milisegundos (opcional).
 */
function mostrarToast(mensaje, tipo = "success", duracion = 4000) {
  const configPorTipo = {
    success: {
      icono: "check_circle",
      clase: "teal darken-2"
    },
    danger: {
      icono: "error",
      clase: "red darken-2"
    },
    warning: {
      icono: "warning",
      clase: "amber darken-2 black-text"
    },
    info: {
      icono: "info",
      clase: "blue darken-2"
    }
  };

  const { icono, clase } = configPorTipo[tipo] ?? configPorTipo.info;

  const html = `
    <span class="white-text">
      <i class="material-icons left">${icono}</i> ${mensaje}
    </span>`;

  M.toast({ html, displayLength: duracion, classes: `rounded ${clase}` });
}
