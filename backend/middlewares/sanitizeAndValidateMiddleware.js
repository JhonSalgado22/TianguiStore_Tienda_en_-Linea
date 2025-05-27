const validator = require("validator");
const db = require("../db/connection");

// 📋 Campos permitidos y reglas por tipo
const camposPermitidos = {
  correo_electronico: { tipo: "string", max: 120, validar: "isEmail" },
  contrasena: {
    tipo: "string", max: 100,
    validar: "isStrongPassword"
  },
  confirmar_contrasena: { tipo: "string", max: 100 },
  nombre: { tipo: "string", max: 100 },
  apellido_paterno: { tipo: "string", max: 100 },
  apellido_materno: { tipo: "string", max: 100 },
  direccion: { tipo: "string", max: 255 },
  telefono: { tipo: "string", max: 20 },
  genero: { tipo: "string", max: 30 },
  fecha_nacimiento: { tipo: "string", validar: "isDate" },
  foto_perfil_url: { tipo: "string", validar: "isURL", max: 255 },
  biografia: { tipo: "string", max: 1000 },
  cv_url: { tipo: "string", validar: "isURL", max: 255 },
  portafolio_url: { tipo: "string", validar: "isURL", max: 255 },
  tipo_cuenta: { tipo: "string", max: 20 },
  origen_reclutamiento: {
    tipo: "string", max: 30, validar: "enum",
    opciones: ["redes_sociales", "google", "videos", "eventos", "recomendacion", "otro"]
  },

  // 🛍️ Productos
  nombre_producto: { tipo: "string", max: 100 },
  descripcion: { tipo: "string", max: 500 },
  precio: { tipo: "float", validar: "isFloat", opciones: { min: 0 } },
  descuento: { tipo: "float", validar: "isFloat", opciones: { min: 0, max: 100 } },
  stock: { tipo: "int", validar: "isInt", opciones: { min: 0 } },
  publicado: { tipo: "boolean" },
  categoria_id: { tipo: "int", validar: "isInt", opciones: { min: 1 } },
  marca_id: { tipo: "int", validar: "isInt", opciones: { min: 1 } },
  proveedor_id: { tipo: "int", validar: "isInt", opciones: { min: 1 } },
  tipo_pago: { tipo: "string", max: 30 },
  meses_sin_intereses: { tipo: "boolean" }
};

/**
 * 🧽 Sanitización y validación
 */
function sanitizarYValidar(obj) {
  const errores = [];

  for (const campo in obj) {
    const valor = obj[campo];
    const config = camposPermitidos[campo];

    if (!config) {
      delete obj[campo];
      continue;
    }

    try {
      if (config.tipo === "string" && typeof valor === "string") {
        let limpio = validator.stripLow(validator.escape(valor.trim()));
        limpio = validator.whitelist(limpio, "a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ@._\\-\\s:/");

        if (config.max && limpio.length > config.max) {
          limpio = limpio.slice(0, config.max);
        }

        if (config.validar === "isEmail" && !validator.isEmail(limpio)) {
          errores.push(`El campo '${campo}' debe ser un correo electrónico válido.`);
        }

        if (config.validar === "isStrongPassword" &&
            !validator.isStrongPassword(limpio, {
              minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 0
            })) {
          errores.push(`El campo '${campo}' debe contener al menos 8 caracteres, una mayúscula y un número.`);
        }

        if (config.validar === "isURL" && !validator.isURL(limpio)) {
          errores.push(`El campo '${campo}' contiene una URL inválida.`);
        }

        if (config.validar === "isDate" && !validator.isDate(limpio)) {
          errores.push(`El campo '${campo}' debe tener el formato de fecha YYYY-MM-DD.`);
        }

        if (config.validar === "enum" &&
            (!config.opciones || !config.opciones.includes(limpio))) {
          errores.push(`El campo '${campo}' contiene un valor no permitido.`);
        }

        obj[campo] = limpio;
      }

      else if (config.tipo === "float") {
        const num = parseFloat(valor);
        if (isNaN(num) || !validator.isFloat(String(num), config.opciones)) {
          errores.push(`El campo '${campo}' debe ser un número decimal válido.`);
        } else {
          obj[campo] = num;
        }
      }

      else if (config.tipo === "int") {
        const entero = parseInt(valor);
        if (isNaN(entero) || !validator.isInt(String(entero), config.opciones)) {
          errores.push(`El campo '${campo}' debe ser un número entero válido.`);
        } else {
          obj[campo] = entero;
        }
      }

      else if (config.tipo === "boolean") {
        if (typeof valor === "boolean") {
          obj[campo] = valor;
        } else if (valor === "true" || valor === "false") {
          obj[campo] = valor === "true";
        } else {
          errores.push(`El campo '${campo}' debe ser booleano (true o false).`);
        }
      }

      else if (typeof valor !== config.tipo) {
        errores.push(`Tipo incorrecto para '${campo}'. Se esperaba '${config.tipo}'.`);
      }

    } catch (err) {
      errores.push(`Error inesperado al procesar '${campo}': ${err.message}`);
    }
  }

  return errores;
}

/**
 * 📝 Auditoría de errores
 */
async function registrarErrorAuditoria({ req, errores, sqlstate = "VAL001", errno = 1048 }) {
  const sql = `
    INSERT INTO auditoria_errores (
      modulo, procedimiento, usuario_id,
      datos_entrada, \`sqlstate\`, mysql_errno, mensaje
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    "Middleware",
    "sanitizeAndValidate",
    req.usuario?.usuario_id || null,
    JSON.stringify(req.body || {}),
    sqlstate,
    errno,
    errores.join("; ")
  ];

  try {
    await db.query(sql, valores);
  } catch (err) {
    console.error("❌ Error al registrar en auditoria_errores:", err.message);
  }
}

/**
 * 🚦 Middleware principal
 */
module.exports = async function sanitizeAndValidate(req, res, next) {
  try {
    const errores = [
      ...sanitizarYValidar(req.body || {}),
      ...sanitizarYValidar(req.query || {}),
      ...sanitizarYValidar(req.params || {})
    ];

    if (errores.length > 0) {
      console.warn("🛑 Validación fallida en", req.originalUrl, "\n→", errores);

      await registrarErrorAuditoria({ req, errores });

      return res.status(400).json({
        message: "⚠️ Se encontraron errores en los datos enviados. Revisa los campos y vuelve a intentarlo.",
        errores
      });
    }

    next();
  } catch (err) {
    console.error("❌ Error inesperado en sanitizeAndValidate:", err);

    await registrarErrorAuditoria({
      req,
      errores: [`Error interno del servidor: ${err.message}`],
      sqlstate: "SYS500",
      errno: 500
    });

    return res.status(500).json({
      message: "⚠️ Error interno al validar los datos. Por favor intenta más tarde."
    });
  }
};
