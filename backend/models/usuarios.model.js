/**
 * 📁 MODELO: usuarios.model.js
 * 🧠 Lógica de acceso a la tabla `usuarios`
 * 🔒 Autenticación, gestión de perfil, auditoría y administración
 */

const pool = require("../db/connection");

const ROL_CLIENTE_ID = 3; // ID predeterminado para usuarios cliente

// ─────────────────────────────────────────────
// 🔍 Buscar usuario por correo (solo activos y no eliminados)
// ─────────────────────────────────────────────
async function buscarUsuarioPorCorreo(correo) {
  const [rows] = await pool.query(`
    SELECT 
      u.usuario_id,
      u.correo_electronico,
      u.contrasena_hash,
      u.nombre,
      u.rol_id,
      r.rol_nombre AS rol,
      r.permisos_json
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    WHERE u.correo_electronico = ? AND u.activo = 1 AND u.borrado_logico = 0
  `, [correo.trim()]);
  return rows[0] || null;
}

// ─────────────────────────────────────────────
// 🔍 Buscar usuario por ID (aunque esté inactivo)
// ─────────────────────────────────────────────
async function buscarUsuarioPorId(id) {
  const [rows] = await pool.query(`
    SELECT 
      u.usuario_id,
      u.correo_electronico,
      u.nombre,
      u.rol_id,
      r.rol_nombre AS rol,
      r.permisos_json
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    WHERE u.usuario_id = ? AND u.borrado_logico = 0
  `, [parseInt(id)]);
  return rows[0] || null;
}

// ─────────────────────────────────────────────
// 📋 Obtener todos los usuarios (activos y no eliminados)
// ─────────────────────────────────────────────
async function obtenerTodos() {
  const [rows] = await pool.query(`
    SELECT 
      u.usuario_id,
      u.nombre,
      u.correo_electronico,
      u.activo,
      u.verificado,
      r.rol_nombre AS rol
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    WHERE u.borrado_logico = 0
    ORDER BY u.nombre ASC
  `);
  return rows;
}

// ─────────────────────────────────────────────
// 📧 Verificar si el correo ya está registrado
// ─────────────────────────────────────────────
async function existeCorreo(correo) {
  const [rows] = await pool.query(`
    SELECT usuario_id FROM usuarios WHERE correo_electronico = ?
  `, [correo.trim()]);
  return rows.length > 0;
}

// ─────────────────────────────────────────────
// ➕ Crear nuevo usuario (rol cliente por defecto)
// ─────────────────────────────────────────────
async function crearUsuario({
  correo_electronico,
  contrasena_hash,
  nombre,
  apellido_paterno = "",
  apellido_materno = "",
  telefono = "",
  direccion = "",
  genero = "no_especificado"
}) {
  await pool.query(`
    INSERT INTO usuarios (
      correo_electronico, contrasena_hash, nombre,
      apellido_paterno, apellido_materno,
      telefono, direccion, genero,
      rol_id, activo, verificado, borrado_logico
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    correo_electronico?.trim(),
    contrasena_hash,
    nombre?.trim(),
    apellido_paterno?.trim(),
    apellido_materno?.trim(),
    telefono?.trim(),
    direccion?.trim(),
    genero,
    ROL_CLIENTE_ID,
    1, // activo
    0, // no verificado
    0  // no borrado
  ]);
}

// ─────────────────────────────────────────────
// ✅ Activar usuario
// ─────────────────────────────────────────────
async function activarUsuario(id) {
  await pool.query(`UPDATE usuarios SET activo = 1 WHERE usuario_id = ?`, [parseInt(id)]);
}

// ─────────────────────────────────────────────
// 🔴 Desactivar usuario
// ─────────────────────────────────────────────
async function desactivarUsuario(id) {
  await pool.query(`UPDATE usuarios SET activo = 0 WHERE usuario_id = ?`, [parseInt(id)]);
}

// ─────────────────────────────────────────────
// 🧹 Borrado lógico de usuario + auditoría
// ─────────────────────────────────────────────
async function borrarUsuarioLogico(id) {
  await pool.query(`
    UPDATE usuarios SET borrado_logico = 1, activo = 0 WHERE usuario_id = ?
  `, [parseInt(id)]);
  await registrarAuditoriaUsuario(id, "borrado_logico");
}

// ─────────────────────────────────────────────
// 📬 Marcar como verificado (ej. confirmación de email)
// ─────────────────────────────────────────────
async function verificarUsuario(id) {
  await pool.query(`UPDATE usuarios SET verificado = 1 WHERE usuario_id = ?`, [parseInt(id)]);
}

// ─────────────────────────────────────────────
// 🔐 Cambiar contraseña (hash ya procesado por bcrypt)
// ─────────────────────────────────────────────
async function cambiarContrasena(id, nuevoHash) {
  await pool.query(`
    UPDATE usuarios SET contrasena_hash = ? WHERE usuario_id = ?
  `, [nuevoHash, parseInt(id)]);
}

// ─────────────────────────────────────────────
// ✏️ Actualizar perfil (solo campos válidos enviados)
// ─────────────────────────────────────────────
async function actualizarUsuario(id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(id));
  await pool.query(`UPDATE usuarios SET ${campos.join(", ")} WHERE usuario_id = ?`, valores);
}

// ─────────────────────────────────────────────
// 🕵️ Registrar auditoría manual (fallback de trigger)
// ─────────────────────────────────────────────
async function registrarAuditoriaUsuario(usuario_id, accion) {
  await pool.query(`
    INSERT INTO auditoria_borrado (
      entidad, entidad_id, accion, fecha, comentario
    ) VALUES (?, ?, ?, NOW(), ?)
  `, [
    "usuario",
    parseInt(usuario_id),
    accion,
    `Auditoría generada manualmente desde backend para el usuario ${usuario_id}`
  ]);
}

// ─────────────────────────────────────────────
// ⏰ Actualizar última conexión del usuario
// ─────────────────────────────────────────────
async function actualizarUltimaConexion(usuario_id) {
  await pool.query(`
    UPDATE usuarios
    SET ultima_conexion = NOW()
    WHERE usuario_id = ?
  `, [parseInt(usuario_id)]);
}

// ─────────────────────────────────────────────
// 📦 Exportar funciones del modelo
// ─────────────────────────────────────────────
module.exports = {
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
  obtenerTodos,
  existeCorreo,
  crearUsuario,
  activarUsuario,
  desactivarUsuario,
  verificarUsuario,
  borrarUsuarioLogico,
  cambiarContrasena,
  actualizarUsuario,
  registrarAuditoriaUsuario,
  actualizarUltimaConexion
};
