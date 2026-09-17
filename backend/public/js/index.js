const nombreHeader = document.getElementById('nombre-header');
const tituloBienvenida = document.getElementById('titulo-bienvenida');
const contenedorDatos = document.getElementById('datos-usuario');
const elementoCargando = document.getElementById('cargando');
const mensaje = document.getElementById('mensaje');
const btnLogout = document.getElementById('btn-logout');
const enlaceLogout = document.getElementById('enlace-logout');

document.addEventListener('DOMContentLoaded', iniciarPagina);


async function iniciarPagina() {
  const sesionValida = await verificarSesion();

  if (!sesionValida) {
    return;
  }

  configurarEventos();

  await cargarUsuarioLogueado();
}


function configurarEventos() {
  btnLogout.addEventListener('click', cerrarSesion);

  enlaceLogout.addEventListener('click', function (evento) {
    evento.preventDefault();
    cerrarSesion();
  });
}


function obtenerToken() {
  return localStorage.getItem('token');
}


function obtenerHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + obtenerToken()
  };
}


async function verificarSesion() {
  const token = obtenerToken();

  if (!token) {
    regresarAlLogin();
    return false;
  }

  try {
    const respuesta = await fetch('/api/verificatoken', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!respuesta.ok) {
      regresarAlLogin();
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error verificando la sesión:', error);
    regresarAlLogin();
    return false;
  }
}


async function cargarUsuarioLogueado() {
  try {
    const respuesta = await fetch('/api/usuario-logueado', {
      method: 'GET',
      headers: obtenerHeaders()
    });

    const usuario = await procesarRespuesta(respuesta);

    mostrarDatosUsuario(usuario);

  } catch (error) {
    console.error(error);
    elementoCargando.hidden = true;
    mostrarMensaje(error.message);
  }
}


async function procesarRespuesta(respuesta) {
  if (respuesta.status === 401 || respuesta.status === 403) {
    regresarAlLogin();
    throw new Error('La sesión ha expirado');
  }

  let datos = {};

  try {
    datos = await respuesta.json();
  } catch (error) {
    datos = {};
  }

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No fue posible completar la operación');
  }

  return datos;
}


function mostrarDatosUsuario(usuario) {
  elementoCargando.hidden = true;
  contenedorDatos.hidden = false;

  const nombre = usuario.nombre || 'Usuario';

  nombreHeader.textContent = nombre;
  tituloBienvenida.textContent = 'Bienvenido, ' + nombre;

  document.getElementById('usuario-id').textContent = usuario._id || 'No disponible';
  document.getElementById('usuario-nombre').textContent = nombre;
  document.getElementById('usuario-email').textContent = usuario.email || 'No disponible';
  document.getElementById('usuario-fecha').textContent = formatearFecha(usuario.fechaRegistro);
}


function formatearFecha(fecha) {
  if (!fecha) {
    return 'No disponible';
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return 'No disponible';
  }

  return fechaConvertida.toLocaleString('es-CR');
}


function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}


function regresarAlLogin() {
  localStorage.removeItem('token');
  window.location.replace('login.html');
}


function mostrarMensaje(texto) {
  mensaje.textContent = texto;
}