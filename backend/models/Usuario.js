const { Schema, model } = require('mongoose');

// Definir el esquema de Usuario
const usuarioSchema = new Schema({
nombre: {
type: String,
required: true,
trim: true
},
correo: {
type: String,
required: true,
unique: true,
lowercase: true,
trim: true
},
clave: {
type: String,
required: true
},
fechaRegistro: {
type: Date,
default: Date.now
}
});

// Crear el modelo Usuario basado en el esquema
const Usuario = model('Usuario', usuarioSchema);
module.exports = Usuario;