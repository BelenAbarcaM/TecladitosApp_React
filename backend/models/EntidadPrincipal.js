const { Schema, model } = require('mongoose');

// Definir el esquema de Teclado
const tecladoSchema = new Schema({
  marca: String,
  modelo: String,
  tipoSwitch: String,
tamaño: String,
idioma: String,
conexion: String,
iluminacion: Boolean,
estado: String,
precio: Number,
imagen: String
});

// Crear el modelo Teclado basado en el esquema
const Teclado = model('Teclado', tecladoSchema);
module.exports = Teclado;