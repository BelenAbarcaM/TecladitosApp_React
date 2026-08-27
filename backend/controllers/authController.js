const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Registro de un nuevo usuario
async function registrar(req, res) {
  try {
    const { nombre, correo, clave } = req.body;

    // 1. Generar un salt (semilla aleatoria) para el hash
    const salt = await bcrypt.genSalt(10); // 10 rondas de generación de salt

    // 2. Hashear la contraseña proporcionada usando el salt generado
    const hash = await bcrypt.hash(clave, salt);

    // 3. Crear y guardar el nuevo usuario con la contraseña hasheada
    const nuevoUsuario = new Usuario({ nombre, correo, clave: hash });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: nuevoUsuario._id });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(400).json({ error: 'No se pudo registrar el usuario', detalle: error.message });
  }
}

// Login de usuario (autenticación)
async function login(req, res) {
  try {
    const { correo, clave } = req.body;

    // 1. Buscar al usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2. Verificar la contraseña
    const passwordOk = await bcrypt.compare(clave, usuario.clave);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Credenciales válidas: Generar token JWT
    const datosToken = { id: usuario._id };
    const secreto = process.env.SECRETO;
    const opciones = { expiresIn: '1h' };
    const token = jwt.sign(datosToken, secreto, opciones);

    // 4. Enviar el token al cliente
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Confirma que el token enviado es válido
async function verificarTokenController(req, res) {
  res.send('verificado');
}

// Devuelve los datos del usuario actualmente logueado
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
