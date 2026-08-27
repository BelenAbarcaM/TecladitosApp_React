const Teclado = require('../models/EntidadPrincipal');

// Crear un nuevo teclado
async function crear(req, res) {
  try {
    console.log('req.body recibido en crear():', Object.keys(req.body), '| imagen presente:', !!req.body.imagen, '| longitud imagen:', req.body.imagen ? req.body.imagen.length : 0);

    const {
      marca,
      modelo,
      tipoSwitch,
      tamaño,
      idioma,
      conexion,
      iluminacion,
      estado,
      precio,
      imagen
    } = req.body;

    const nuevoTeclado = new Teclado({
      creador: req.usuarioId,
      marca,
      modelo,
      tipoSwitch,
      tamaño,
      idioma,
      conexion,
      iluminacion,
      estado,
      precio,
      imagen
    });

    const tecladoGuardado = await nuevoTeclado.save();

    res.status(201).json(tecladoGuardado);
  } catch (error) {
    console.error('Error al crear teclado:', error);
    res.status(400).json({ error: 'Error al crear el teclado' });
  }
}

// Consultar todos los teclados
async function obtenerTodos(req, res) {
  try {
    const filtro = {};

    // Filtrar por tipo de switch
    if (req.query.tipoSwitch) {
      filtro.tipoSwitch = req.query.tipoSwitch;
    }

    // Buscar por marca
    if (req.query.marca) {
      filtro.marca = { $regex: req.query.marca, $options: 'i' };
    }

    const teclados = await Teclado.find(filtro).sort({ fechaCreacion: -1 });

    res.json(teclados);
  } catch (error) {
    console.error('Error al obtener teclados:', error);
    res.status(500).json({ error: 'Error al obtener los teclados' });
  }
}

// Consultar un teclado por su identificador
async function obtenerPorId(req, res) {
  try {
    const teclado = await Teclado.findOne({ _id: req.params.id });

    if (!teclado) {
      return res.status(404).json({ error: 'Teclado no encontrado' });
    }

    res.json(teclado);
  } catch (error) {
    console.error('Error al obtener teclado:', error);
    res.status(400).json({ error: 'Identificador de teclado inválido' });
  }
}

// Actualizar un teclado existente
async function actualizar(req, res) {
  try {
    const {
      marca,
      modelo,
      tipoSwitch,
      tamaño,
      idioma,
      conexion,
      iluminacion,
      estado,
      precio,
      imagen
    } = req.body;

    const tecladoActualizado = await Teclado.findOneAndUpdate(
      { _id: req.params.id },
      { marca, modelo, tipoSwitch, tamaño, idioma, conexion, iluminacion, estado, precio, imagen },
      { new: true, runValidators: true }
    );

    if (!tecladoActualizado) {
      return res.status(404).json({ error: 'Teclado no encontrado' });
    }

    res.json(tecladoActualizado);
  } catch (error) {
    console.error('Error al actualizar teclado:', error);
    res.status(400).json({ error: 'Error al actualizar el teclado' });
  }
}

// Eliminar un teclado
async function eliminar(req, res) {
  try {
    const tecladoEliminado = await Teclado.findOneAndDelete({ _id: req.params.id });

    if (!tecladoEliminado) {
      return res.status(404).json({ error: 'Teclado no encontrado' });
    }

    res.json({ mensaje: 'Teclado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar teclado:', error);
    res.status(400).json({ error: 'Error al eliminar el teclado' });
  }
}

module.exports = {
  crear,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar
};