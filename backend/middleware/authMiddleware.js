const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];  // Espera formato "Bearer token"

  try {
    // Usamos la misma variable (SECRETO) con la que authController firma el token
    const decoded = jwt.verify(token, process.env.SECRETO);
    req.usuarioId = decoded.id;              // Guardamos el id del token en la request para usarlo después
    next();                                  // Token válido, continuar a la siguiente función
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;