const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO;

async function conectarBD() {
  try {
    await mongoose.connect(uri);
    console.log('Conectado correctamente a MongoDB con Mongoose');
  } catch (error) {
    console.log('Error conectando con Mongoose:', error.message);
  }
}

module.exports = conectarBD;
module.exports = conectarBD;