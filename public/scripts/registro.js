/**
 * 📦 registro.js
 * Registro elegante, accesible y robusto para TianguiStore.
 * Valida campos, políticas de contraseña, origen de reclutamiento y gestiona errores.
 * Autor: I.S.C. Erick Renato Vega Ceron — Versión Final Mayo 2025
 */

(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const showToast = (msg, cls = "red darken-2") =>
    M.toast({ html: msg, classes: `rounded ${cls}` });

  // === VALIDADORES ========================================================
  const validators = {
    nombre: {
      fn: (v) => typeof v === "string" && v.trim().length > 0,
      err: "⚠️ El nombre es obligatorio.",
    },
    correo_electronico: {
      fn: (v) =>
        typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      err: "⚠️ Correo electrónico inválido.",
    },
    password: {
      fn: (v) => typeof v === "string" && /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(v),
      err: "⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.",
    },
    confirmPassword: {
      fn: (v, all) => v === all.password,
      err: "⚠️ Las contraseñas no coinciden.",
    },
    tipoCuenta: {
      fn: (v) => ["cliente", "vendedor", "soporte"].includes(v),
      err: "⚠️ Selecciona un tipo de cuenta válido.",
    },
    como_conociste: {
      fn: (v) =>
        [
          "redes_sociales",
          "google",
          "videos",
          "eventos",
          "recomendacion",
          "otro",
        ].includes(v),
      err: "⚠️ Selecciona cómo conociste TianguiStore.",
    },
    otro_como_conociste: {
      fn: (v, all) => all.como_conociste !== "otro" || (v && v.length >= 2),
      err: "⚠️ Especifica cómo conociste TianguiStore si seleccionaste “Otro”.",
    },
    foto_perfil_url: urlOpt("foto de perfil"),
    cv_url: urlOpt("CV"),
    portafolio_url: urlOpt("portafolio"),
    sitio_web: urlOpt("sitio web"),
  };

  function urlOpt(label) {
    return {
      fn: (v) =>
        !v || /^(https?:\/\/)?([\w.-]+)\.[a-z]{2,6}([\/\w .-]*)*\/?$/.test(v),
      err: `⚠️ URL inválida en ${label}.`,
    };
  }

  // === CAMPOS DINÁMICOS ===================================================
  const dynamicFields = {
    vendedor: `
      <div class="row animate__animated animate__fadeInUp">
        <div class="input-field col s12 m6">
          <i class="fas fa-id-card prefix accent-icon"></i>
          <input type="text" id="rfc" name="rfc" />
          <label for="rfc">RFC</label>
        </div>
        <div class="input-field col s12 m6">
          <i class="fas fa-globe prefix accent-icon"></i>
          <input type="url" id="sitio_web" name="sitio_web" />
          <label for="sitio_web">Sitio web</label>
        </div>
      </div>`,
    soporte: `
      <div class="row animate__animated animate__fadeInUp">
        <div class="input-field col s12 m6">
          <i class="fas fa-file-alt prefix accent-icon"></i>
          <input type="url" id="cv_url" name="cv_url" />
          <label for="cv_url">URL del CV</label>
        </div>
        <div class="input-field col s12 m6">
          <i class="fas fa-briefcase prefix accent-icon"></i>
          <input type="url" id="portafolio_url" name="portafolio_url" />
          <label for="portafolio_url">Portafolio</label>
        </div>
        <div class="input-field col s12">
          <i class="fas fa-user-edit prefix accent-icon"></i>
          <textarea id="biografia" name="biografia" class="materialize-textarea"></textarea>
          <label for="biografia">Biografía</label>
        </div>
      </div>`,
  };

  function renderDynamicFields(tipo) {
    const cont = $("#camposDinamicos");
    if (cont) {
      cont.innerHTML = dynamicFields[tipo] || "";
      M.updateTextFields();
      M.FormSelect.init($$("select"));
    }
  }

  function toggleCampoOtro() {
    const otro = $("#campoOtroConociste");
    const select = $("#como_conociste");
    if (otro && select) {
      otro.style.display = select.value === "otro" ? "block" : "none";
    }
  }

  function collectData() {
    const data = {};
    $$("#registroForm [name]").forEach((el) => {
      data[el.name] = el.value?.trim() || null;
    });

    // Normalizar origen_reclutamiento
    if (data.como_conociste) {
      data.como_conociste = data.como_conociste
        .toLowerCase()
        .replace(/\s+/g, "_");
    }

    return data;
  }

  function clearValidation() {
    $$("input").forEach((i) => i.classList.remove("valid", "invalid"));
  }

  function applyValidation(field, ok) {
    const el = $(`[name="${field}"]`);
    if (!el) return;
    el.classList.toggle("valid", ok);
    el.classList.toggle("invalid", !ok);
  }

  function validateAll(data) {
    const errors = [];
    const tipo = data.tipoCuenta;

    for (const [key, val] of Object.entries(validators)) {
      // ❌ Omitir campos dinámicos según el tipo de cuenta
      if (
        (tipo === "cliente" &&
          [
            "cv_url",
            "portafolio_url",
            "sitio_web",
            "biografia",
            "rfc",
          ].includes(key)) ||
        (tipo === "soporte" && ["sitio_web", "rfc"].includes(key)) ||
        (tipo === "vendedor" &&
          ["cv_url", "portafolio_url", "biografia"].includes(key))
      ) {
        continue;
      }

      // ✅ Validar el campo normalmente
      if (!(key in data)) {
        console.warn(`Campo ausente: ${key}`);
        continue;
      }

      const ok = val.fn(data[key], data);
      applyValidation(key, ok);
      if (!ok) errors.push(val.err);
    }

    return errors;
  }

  // === INIT ===============================================================
  document.addEventListener("DOMContentLoaded", () => {
    try {
      M.FormSelect.init($$("select"));
      M.updateTextFields();

      const tipoUsuario = $("#tipoUsuario");
      const tipoOculto = $("#tipoCuenta");
      const tipoInicial =
        localStorage.getItem("tipoCuentaSeleccionado") ||
        tipoUsuario?.value ||
        "cliente";

      if (tipoUsuario && tipoOculto) {
        tipoUsuario.value = tipoInicial;
        tipoOculto.value = tipoInicial;
        M.FormSelect.init(tipoUsuario);
        renderDynamicFields(tipoInicial);

        tipoUsuario.addEventListener("change", () => {
          const tipo = tipoUsuario.value;
          tipoOculto.value = tipo;
          localStorage.setItem("tipoCuentaSeleccionado", tipo);
          renderDynamicFields(tipo);
        });
      }

      $("#como_conociste")?.addEventListener("change", toggleCampoOtro);
      toggleCampoOtro();

      document.body.addEventListener("click", (e) => {
        const btn = e.target.closest(".toggle-password");
        if (!btn) return;
        const input = document.getElementById(btn.dataset.target);
        const icon = btn.querySelector("i");
        if (!input || !icon) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        icon.classList.toggle("fa-eye", show);
        icon.classList.toggle("fa-eye-slash", !show);
      });

      $("#password")?.addEventListener("input", () => {
        const val = $("#password").value;
        const fuerza = $("#fuerzaPassword");
        const input = $("#password");

        let nivel = {
          msg: "Seguridad: Débil",
          cls: "red-text",
          icon: "cancel",
          valid: false,
        };
        if (
          val.length >= 12 &&
          /[A-Z]/.test(val) &&
          /\d/.test(val) &&
          /[!@#$%^&*]/.test(val)
        ) {
          nivel = {
            msg: "Seguridad: Fuerte",
            cls: "green-text",
            icon: "check_circle",
            valid: true,
          };
        } else if (
          val.length >= 8 &&
          /[A-Za-z]/.test(val) &&
          /\d/.test(val) &&
          /[A-Z]/.test(val)
        ) {
          nivel = {
            msg: "Seguridad: Aceptable",
            cls: "amber-text",
            icon: "priority_high",
            valid: true,
          };
        }

        fuerza.innerHTML = `<i class="material-icons ${nivel.cls}">${nivel.icon}</i> ${nivel.msg}`;
        fuerza.className = `helper-text ${nivel.cls}`;
        input.classList.toggle("valid", nivel.valid);
        input.classList.toggle("invalid", !nivel.valid);
      });

      $("#confirmPassword")?.addEventListener("input", () => {
        const pass = $("#password").value;
        const confirm = $("#confirmPassword").value;
        const match =
          pass === confirm && $("#password").classList.contains("valid");
        const mensaje = $("#mensajeConfirmacion");
        mensaje.innerHTML = match
          ? '<i class="material-icons green-text">check_circle</i> Coincide'
          : '<i class="material-icons red-text">cancel</i> No coincide';
        mensaje.className = `helper-text ${match ? "green-text" : "red-text"}`;
        $("#confirmPassword").classList.toggle("valid", match);
        $("#confirmPassword").classList.toggle("invalid", !match);
      });
    } catch (err) {
      console.error("❌ Error al inicializar:", err);
      showToast("Error al preparar el formulario.", "red darken-4");
    }
  });

  // === SUBMIT =============================================================
  document.addEventListener("submit", async (e) => {
    if (e.target.id !== "registroForm") return;
    e.preventDefault();
    clearValidation();

    try {
      const data = collectData();
      const errores = validateAll(data);
      if (errores.length) {
        showToast(errores[0], "red darken-3");
        errores.slice(1).forEach((err) => showToast(err, "orange darken-3"));
        return;
      }

      const payload = {
        correo_electronico: data.correo_electronico,
        contrasena: data.password,
        confirmar_contrasena: data.confirmPassword,
        tipo_cuenta: data.tipoCuenta,
        nombre: data.nombre,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        direccion: data.direccion,
        telefono: data.telefono,
        genero: data.genero,
        fecha_nacimiento: data.fecha_nacimiento,
        foto_perfil_url: data.foto_perfil_url,
        biografia: data.biografia,
        cv_url: data.cv_url,
        portafolio_url: data.portafolio_url,
        origen_reclutamiento: data.como_conociste,
        otro_como_conociste: data.otro_como_conociste,
      };

      const res = await fetch("/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error en registro");

      showToast("✅ Registro exitoso. Redirigiendo...", "green darken-2");
      setTimeout(() => (location.href = "login.html"), 2000);
    } catch (err) {
      console.error("❌ Error en envío:", err);
      showToast(err.message || "Error inesperado en registro.", "red darken-3");
    }
  });
})();
