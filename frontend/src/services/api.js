// El backend ORIGINAL (TecladitosApp) escucha por defecto en el puerto 3000.
// No se cambia ninguna ruta del backend, solo se habilitó CORS en server.js
// para que este frontend en React (http://localhost:5173) pueda consumirlo.
const API_URL = 'http://localhost:3000/api';

export function obtenerToken() {
  return localStorage.getItem('token');
}

export function guardarToken(token) {
  localStorage.setItem('token', token);
}

export function eliminarToken() {
  localStorage.removeItem('token');
}

function headersJSON(conToken = false) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (conToken) {
    const token = obtenerToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

async function procesarJSON(respuesta) {
  let datos = null;

  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje = datos?.error || datos?.mensaje || `Error HTTP ${respuesta.status}`;
    throw new Error(mensaje);
  }

  return datos;
}

// --- Autenticación ---
// El backend original espera { nombre, correo, clave } en el registro
// y { correo, clave } en el login (no "email").

export async function registrarUsuario(usuario) {
  const respuesta = await fetch(`${API_URL}/registro`, {
    method: 'POST',
    headers: headersJSON(false),
    body: JSON.stringify(usuario)
  });

  return procesarJSON(respuesta);
}

export async function iniciarSesion(correo, clave) {
  const respuesta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: headersJSON(false),
    body: JSON.stringify({ correo, clave })
  });

  return procesarJSON(respuesta);
}

export async function obtenerUsuarioLogueado() {
  const respuesta = await fetch(`${API_URL}/usuario-logueado`, {
    method: 'GET',
    headers: headersJSON(true)
  });

  return procesarJSON(respuesta);
}

// --- Teclados ---

export async function obtenerTeclados(filtros = {}) {
  const parametros = new URLSearchParams();

  if (filtros.tipoSwitch) {
    parametros.set('tipoSwitch', filtros.tipoSwitch);
  }

  if (filtros.marca) {
    parametros.set('marca', filtros.marca);
  }

  const query = parametros.toString();
  const url = query ? `${API_URL}/teclados?${query}` : `${API_URL}/teclados`;

  const respuesta = await fetch(url, {
    method: 'GET',
    headers: headersJSON(true)
  });

  return procesarJSON(respuesta);
}

export async function obtenerTeclado(id) {
  const respuesta = await fetch(`${API_URL}/teclados/${id}`, {
    method: 'GET',
    headers: headersJSON(true)
  });

  return procesarJSON(respuesta);
}

export async function crearTeclado(teclado) {
  const respuesta = await fetch(`${API_URL}/teclados`, {
    method: 'POST',
    headers: headersJSON(true),
    body: JSON.stringify(teclado)
  });

  return procesarJSON(respuesta);
}

export async function actualizarTeclado(id, teclado) {
  const respuesta = await fetch(`${API_URL}/teclados/${id}`, {
    method: 'PUT',
    headers: headersJSON(true),
    body: JSON.stringify(teclado)
  });

  return procesarJSON(respuesta);
}

export async function eliminarTeclado(id) {
  const respuesta = await fetch(`${API_URL}/teclados/${id}`, {
    method: 'DELETE',
    headers: headersJSON(true)
  });

  return procesarJSON(respuesta);
}
