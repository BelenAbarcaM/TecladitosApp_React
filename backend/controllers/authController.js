const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function registrar(req, res) {
  try {
    const { nombre, correo, clave } = req.body;

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(clave, salt);

    const nuevoUsuario = new Usuario({ nombre, correo, clave: hash });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: nuevoUsuario._id });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(400).json({ error: 'No se pudo registrar el usuario', detalle: error.message });
  }
}

async function login(req, res) {
  try {
    const { correo, clave } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordOk = await bcrypt.compare(clave, usuario.clave);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const datosToken = { id: usuario._id };
    const secreto = process.env.SECRETO;
    const opciones = { expiresIn: '1h' };
    const token = jwt.sign(datosToken, secreto, opciones);

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

async function verificarTokenController(req, res) {
  res.send('verificado');
}

async function usuarioLogueado(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('-clave');

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error obteniendo el usuario:', error);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
}

module.exports = {
  registrar,
  login,
  verificarTokenController,
  usuarioLogueado
};
