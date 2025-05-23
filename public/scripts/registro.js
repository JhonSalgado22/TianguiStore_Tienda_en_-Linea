/**
 * 📦 registro.js
 * Registro de usuarios con campos extendidos, validaciones, confirmación de contraseña y retroalimentación visual.
 * Autor: I.S.C. Erick Renato Vega Ceron | Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const fuerzaPassword = document.getElementById("fuerzaPassword");
  const mensajeConfirmacion = document.getElementById("mensajeConfirmacion");

  const campos = {
    nombre: document.getElementById("nombre"),
    apellido_paterno: document.getElementById("apellido_paterno"),
    apellido_materno: document.getElementById("apellido_materno"),
    genero: document.getElementById("genero"),
    fecha_nacimiento: document.getElementById("fecha_nacimiento"),
    telefono: document.getElementById("telefono"),
    direccion: document.getElementById("direccion"),
    correo_electronico: document.getElementById("email"),
    contrasena: password,
    foto_perfil_url: document.getElementById("foto_perfil_url"),
    biografia: document.getElementById("biografia"),
    origen_reclutamiento: document.getElementById("origen_reclutamiento"),
    cv_url: document.getElementById("cv_url"),
    portafolio_url: document.getElementById("portafolio_url")
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})([\/\w .-]*)*\/?$/i;

  password.addEventListener("input", () => {
    const val = password.value;
    let msg = "Seguridad: Débil", clase = "red-text";
    if (val.length >= 12 && /[A-Z]/.test(val) && /\d/.test(val) && /[!@#$%^&*]/.test(val)) {
      msg = "Seguridad: Fuerte"; clase = "green-text";
    } else if (val.length >= 8 && /[A-Za-z]/.test(val) && /\d/.test(val)) {
      msg = "Seguridad: Aceptable"; clase = "amber-text";
    }
    fuerzaPassword.textContent = msg;
    fuerzaPassword.className = `helper-text ${clase}`;
  });

  confirmPassword.addEventListener("input", () => {
    const coincide = password.value === confirmPassword.value;
    mensajeConfirmacion.innerHTML = coincide
      ? '<i class="material-icons green-text">check_circle</i> Coincide'
      : '<i class="material-icons red-text">cancel</i> No coincide';
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensajes();

    const datos = obtenerDatosLimpios();
    const errores = validarCampos(datos);

    if (errores.length > 0) {
      errores.forEach(msg => mostrarToast(msg, "red darken-2"));
      return;
    }

    try {
      const res = await fetch("/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, confirmar_contrasena: confirmPassword.value.trim() })
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("❌ Error del backend:", result);
        mostrarToast(result.message || "❌ Error durante el registro.", "red darken-3");
        return;
      }

      mostrarToast("✅ Registro exitoso. Redirigiendo...", "green darken-2");
      form.reset();
      mensajeConfirmacion.innerHTML = "";
      fuerzaPassword.textContent = "";
      setTimeout(() => (window.location.href = "login.html"), 2000);

    } catch (error) {
      console.error("❌ Error de red:", error);
      mostrarToast("⚠️ No se pudo conectar con el servidor.", "red darken-3");
    }
  });

  function obtenerDatosLimpios() {
    return {
      nombre: campos.nombre.value.trim(),
      apellido_paterno: campos.apellido_paterno.value.trim() || null,
      apellido_materno: campos.apellido_materno.value.trim() || null,
      genero: campos.genero.value || "no_especificado",
      fecha_nacimiento: campos.fecha_nacimiento.value || null,
      telefono: campos.telefono.value.trim() || null,
      direccion: campos.direccion.value.trim() || null,
      correo_electronico: campos.correo_electronico.value.trim(),
      contrasena: campos.contrasena.value.trim(),
      foto_perfil_url: campos.foto_perfil_url?.value.trim() || null,
      biografia: campos.biografia?.value.trim() || null,
      origen_reclutamiento: campos.origen_reclutamiento?.value || "externo",
      cv_url: campos.cv_url?.value.trim() || null,
      portafolio_url: campos.portafolio_url?.value.trim() || null
    };
  }

  function validarCampos(datos) {
    const errores = [];
    if (!datos.nombre) errores.push("⚠️ El nombre es obligatorio.");
    if (!emailRegex.test(datos.correo_electronico)) errores.push("⚠️ Correo electrónico inválido.");
    if (!passwordRegex.test(datos.contrasena)) errores.push("⚠️ La contraseña debe tener al menos 8 caracteres, una letra y un número.");
    if (datos.contrasena !== confirmPassword.value.trim()) errores.push("⚠️ Las contraseñas no coinciden.");
    if (datos.foto_perfil_url && !urlRegex.test(datos.foto_perfil_url)) errores.push("⚠️ URL de foto inválida.");
    if (datos.cv_url && !urlRegex.test(datos.cv_url)) errores.push("⚠️ URL de CV inválida.");
    if (datos.portafolio_url && !urlRegex.test(datos.portafolio_url)) errores.push("⚠️ URL de portafolio inválida.");
    return errores;
  }

  function mostrarToast(msg, color = "red darken-2") {
    M.toast({ html: msg, classes: `rounded ${color}` });
  }

  function ocultarMensajes() {
    const container = document.getElementById("toast-container");
    if (container) container.innerHTML = "";
  }
});
