require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const conectarBD = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tecladoRoutes = require('./routes/entidadRoutes');

const app = express();

// Habilitar CORS para que cualquier dominio (por ejemplo, el frontend en
// React corriendo en http://localhost:5173 con Vite) pueda consumir esta API.
app.use(cors());

// Middleware para parsear JSON en las peticiones (body-parser integrado)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function iniciarServidor() {
  await conectarBD();
}
iniciarServidor();

// Rutas de autenticación: /api/registro, /api/login, /api/verificatoken, /api/usuario-logueado
app.use('/api', authRoutes);

// Rutas del CRUD de teclados: /api/teclados
app.use('/api/teclados', tecladoRoutes);

// En local seguimos levantando el servidor normalmente.
// En Vercel, la plataforma invoca la app exportada abajo, así que este
// listen() no se ejecuta en producción.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor API escuchando en http://localhost:3000`);
  });
}

module.exports = app;