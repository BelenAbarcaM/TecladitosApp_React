const express = require('express');
const router = express.Router();

const tecladoController = require('../controllers/entidadController');
const verificarToken = require('../middleware/authMiddleware');

// Todas las rutas de teclados requieren un token válido
router.get('/', verificarToken, tecladoController.obtenerTodos);
router.get('/:id', verificarToken, tecladoController.obtenerPorId);
router.post('/', verificarToken, tecladoController.crear);
router.put('/:id', verificarToken, tecladoController.actualizar);
router.delete('/:id', verificarToken, tecladoController.eliminar);

module.exports = router;