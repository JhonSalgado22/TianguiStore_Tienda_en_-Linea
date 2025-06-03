/**
 * 📁 ARCHIVO: routes/auth.routes.js
 * 📦 MÓDULO: Autenticación y gestión de sesión
 *
 * 🔐 Rutas para:
 *   - Registro de usuarios
 *   - Inicio y cierre de sesión
 *   - Manejo de tokens (Access & Refresh)
 *   - Validación de sesiones activas
 *
 * 🛠️ Integrado con:
 *   - Controladores: authController.js
 * 
 *   - Middlewares: authMiddleware.js, sanitizeAndValidateMiddleware.js
 *   - Sistema JWT con Access Token + Refresh Token
 */

const express = require("express");
const router = express.Router();

// 🧠 Controladores
const {
  registrarUsuario,
  verificarUsuario,
  obtenerSesion,
  cerrarSesion,
  refrescarToken
} = require("../controllers/authController");

// 🛡️ Middlewares
const { verificarAutenticacion } = require("../middlewares/authMiddleware");
const sanitizarEntradas = require("../middlewares/sanitizeAndValidateMiddleware");

// ───────────────────────────────────────────────
// 🔓 RUTAS PÚBLICAS — no requieren autenticación
// ───────────────────────────────────────────────

/**
 * 📝 POST /auth/registro
 * Registra un nuevo usuario cliente.
 */
router.post("/registro", sanitizarEntradas, registrarUsuario);

/**
 * 🔐 POST /auth/login
 * Inicia sesión con correo y contraseña.
 */
router.post("/login", sanitizarEntradas, verificarUsuario);

/**
 * ♻️ POST /auth/refrescar
 * Genera un nuevo access token usando el refresh token.
 */
router.post("/refrescar", sanitizarEntradas, refrescarToken);

// ───────────────────────────────────────────────
// 🔐 RUTAS PROTEGIDAS — requieren JWT válido
// ───────────────────────────────────────────────

/**
 * 📦 GET /auth/sesion
 * Devuelve los datos del usuario autenticado.
 */
router.get("/sesion", verificarAutenticacion, obtenerSesion);

/**
 * 🔓 POST /auth/logout
 * Finaliza la sesión actual. El frontend debe limpiar los tokens.
 */
router.post("/logout", verificarAutenticacion, cerrarSesion);

// ───────────────────────────────────────────────

module.exports = router;
