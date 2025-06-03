/**
 * 📁 MODELO: usuarios.model.js
 * 🧠 Acceso a la tabla `usuarios`
 * 🔒 Autenticación, gestión de perfil, auditoría y administración segura
 */

const pool = require("../db/connection");

const ROL_CLIENTE_ID = 3;
const NIVEL_POR_DEFECTO_ID = 1;

/* ══════════════════════════════════════
   🔍 Obtener usuario por correo (activo y no borrado)
═══════════════════════════════════════ */
async function buscarUsuarioPorCorreo(correo) {
  const [rows] = await pool.query(`
    SELECT 
      u.usuario_id, u.correo_electronico, u.contrasena_hash, u.nombre,
      u.apellido_paterno, u.apellido_materno, u.foto_perfil_url,
      u.nivel_id, nf.nombre_nivel AS nivel,
      u.rol_id, r.rol_nombre AS rol, r.permisos_json
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    LEFT JOIN niveles_fidelidad nf ON u.nivel_id = nf.nivel_id
    WHERE u.correo_electronico = ? AND u.activo = 1 AND u.borrado_logico = 0
  `, [correo.trim()]);
  return rows[0] || null;
}

/* ══════════════════════════════════════
   🔍 Obtener usuario por ID (aunque esté inactivo)
═══════════════════════════════════════ */
async function buscarUsuarioPorId(id) {
  if (!id || isNaN(id)) throw new Error("ID inválido");
  const [rows] = await pool.query(`
    SELECT 
      u.usuario_id, u.correo_electronico, u.nombre,
      u.apellido_paterno, u.apellido_materno, u.foto_perfil_url,
      u.nivel_id, nf.nombre_nivel AS nivel,
      u.rol_id, r.rol_nombre AS rol, r.permisos_json
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    LEFT JOIN niveles_fidelidad nf ON u.nivel_id = nf.nivel_id
    WHERE u.usuario_id = ? AND u.borrado_logico = 0
  `, [parseInt(id)]);
  return rows[0] || null;
}

/* ══════════════════════════════════════
   📋 Listar todos los usuarios activos
═══════════════════════════════════════ */
async function obtenerTodos() {
  const [rows] = await pool.query(`
    SELECT 
      u.usuario_id, u.nombre, u.correo_electronico,
      u.activo, u.verificado, r.rol_nombre AS rol
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    WHERE u.borrado_logico = 0
    ORDER BY u.nombre ASC
  `);
  return rows;
}

/* ══════════════════════════════════════
   📧 Verificar si el correo está registrado
═══════════════════════════════════════ */
async function existeCorreo(correo) {
  const [rows] = await pool.query(`
    SELECT usuario_id FROM usuarios WHERE correo_electronico = ?
  `, [correo.trim()]);
  return rows.length > 0;
}

/* ══════════════════════════════════════
   ➕ Crear nuevo usuario
═══════════════════════════════════════ */
async function crearUsuario(datos) {
  const {
    correo_electronico, contrasena_hash, nombre,
    apellido_paterno = "", apellido_materno = "", telefono = "",
    direccion = "", genero = "no_especificado", fecha_nacimiento = null,
    foto_perfil_url = null, biografia = null,
    cv_url = null, portafolio_url = null,
    origen_reclutamiento = "externo", nivel_id = NIVEL_POR_DEFECTO_ID
  } = datos;

  await pool.query(`
    INSERT INTO usuarios (
      correo_electronico, contrasena_hash, nombre,
      apellido_paterno, apellido_materno, telefono, direccion,
      genero, fecha_nacimiento, foto_perfil_url, biografia,
      cv_url, portafolio_url, origen_reclutamiento,
      rol_id, nivel_id,
      activo, verificado, borrado_logico
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    correo_electronico?.trim(), contrasena_hash, nombre?.trim(),
    apellido_paterno?.trim(), apellido_materno?.trim(),
    telefono?.trim(), direccion?.trim(),
    genero, fecha_nacimiento, foto_perfil_url, biografia,
    cv_url, portafolio_url, origen_reclutamiento,
    ROL_CLIENTE_ID, nivel_id, 1, 0, 0
  ]);
}

/* ══════════════════════════════════════
   ✅ Activar / Desactivar / Verificar usuario
═══════════════════════════════════════ */
async function activarUsuario(id) {
  if (!id || isNaN(id)) throw new Error("ID inválido");
  await pool.query(`UPDATE usuarios SET activo = 1 WHERE usuario_id = ?`, [parseInt(id)]);
}
async function desactivarUsuario(id) {
  if (!id || isNaN(id)) throw new Error("ID inválido");
  await pool.query(`UPDATE usuarios SET activo = 0 WHERE usuario_id = ?`, [parseInt(id)]);
}
async function verificarUsuario(id) {
  if (!id || isNaN(id)) throw new Error("ID inválido");
  await pool.query(`UPDATE usuarios SET verificado = 1 WHERE usuario_id = ?`, [parseInt(id)]);
}

async function actualizarAccesoUsuario(id) {
  if (!id || isNaN(id)) throw new Error("ID inválido");
  await pool.query(`UPDATE usuarios SET usuarios.ultima_conexion=CURRENT_TIMESTAMP() WHERE usuario_id = ?`, [parseInt(id)]);
}

/* ══════════════════════════════════════
   🔐 Cambiar contraseña
═══════════════════════════════════════ */
async function cambiarContrasena(id, nuevoHash) {
  if (!id || isNaN(id)) throw new Error("ID inválido");
  await pool.query(`UPDATE usuarios SET contrasena_hash = ? WHERE usuario_id = ?`, [nuevoHash, parseInt(id)]);
}

/* ══════════════════════════════════════
   ✏️ Actualizar perfil (dinámico)
═══════════════════════════════════════ */
async function actualizarUsuario(id, datos) {
  if (!id || isNaN(id)) throw new Error("ID inválido");
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (
      typeof clave === "string" &&
      clave.trim().length > 0 &&
      !["usuario_id", "contrasena_hash"].includes(clave)
    ) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return;
  valores.push(parseInt(id));
  await pool.query(`UPDATE usuarios SET ${campos.join(", ")} WHERE usuario_id = ?`, valores);
}

/* ══════════════════════════════════════
   🧹 Borrado lógico + auditoría
═══════════════════════════════════════ */
async function borrarUsuarioLogico(id) {
  if (!id || isNaN(id)) throw new Error("ID inválido");
  await pool.query(`UPDATE usuarios SET borrado_logico = 1, activo = 0 WHERE usuario_id = ?`, [parseInt(id)]);
  await registrarAuditoriaUsuario(id, "borrado_logico");
}

/* ══════════════════════════════════════
   🕵️ Auditoría manual (fallback del trigger)
═══════════════════════════════════════ */
async function registrarAuditoriaUsuario(usuario_id, accion) {
  if (!usuario_id || isNaN(usuario_id)) throw new Error("ID inválido");
  await pool.query(`
    INSERT INTO auditoria_borrado (
      entidad, entidad_id, accion, fecha, comentario
    ) VALUES (?, ?, ?, NOW(), ?)
  `, [
    "usuario", parseInt(usuario_id),
    accion,
    `Auditoría manual para usuario ${usuario_id}`
  ]);
}

/* ══════════════════════════════════════
   📦 Exportar funciones del modelo
═══════════════════════════════════════ */
module.exports = {
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
  obtenerTodos,
  existeCorreo,
  actualizarAccesoUsuario,
  crearUsuario,
  activarUsuario,
  desactivarUsuario,
  verificarUsuario,
  cambiarContrasena,
  actualizarUsuario,
  borrarUsuarioLogico,
  registrarAuditoriaUsuario
};