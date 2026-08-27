const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verificarToken = require('../middleware/authMiddleware');

// Registro de un nuevo usuario
router.post('/registro', authController.registrar);

// Login de usuario (autenticación)
router.post('/login', authController.login);

// Verifica si el token enviado sigue siendo válido
router.post('/verificatoken', verificarToken, authController.verificarTokenController);

// Devuelve los datos del usuario logueado actualmente
router.get('/usuario-logueado', verificarToken, authController.usuarioLogueado);

module.exports = router;