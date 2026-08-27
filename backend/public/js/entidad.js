const API_TECLADOS = '/api/teclados';

// Formulario
const formulario = document.getElementById('form-teclado');
const inputId = document.getElementById('teclado-id');
const inputMarca = document.getElementById('marca');
const inputModelo = document.getElementById('modelo');
const selectSwitch = document.getElementById('tipoSwitch');
const selectTamano = document.getElementById('tamano');
const inputIdioma = document.getElementById('idioma');
const selectConexion = document.getElementById('conexion');
const checkIluminacion = document.getElementById('iluminacion');
const selectEstado = document.getElementById('estado');
const inputPrecio = document.getElementById('precio');
const btnGuardarTeclado = document.getElementById('btn-guardar-teclado');
const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');
const tituloFormulario = document.getElementById('titulo-formulario');

router.post('/', async (req, res) => {
  try {
    const teclado = new Teclado(req.body);
    await teclado.save();
    res.json(teclado);
  } catch(error) {
    res.status(500).json({error:error.message});
  }
});

// Filtros
const filtroSwitch = document.getElementById('filtro-switch');
const filtroMarca = document.getElementById('filtro-marca');
const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');

// Listado y mensajes
const listaTeclados = document.getElementById('lista-teclados');
const mensaje = document.getElementById('mensaje');

let modoEdicion = false;


document.addEventListener('DOMContentLoaded', iniciarPagina);


async function iniciarPagina() {
  const sesionValida = await verificarSesion();

  if (!sesionValida) {
    return;
  }

  formulario.addEventListener('submit', manejarEnvioFormulario);
  btnCancelarEdicion.addEventListener('click', cancelarEdicion);
  filtroSwitch.addEventListener('change', cargarTeclados);
  filtroMarca.addEventListener('input', debounce(cargarTeclados, 400));
  btnLimpiarFiltros.addEventListener('click', limpiarFiltros);

  await cargarTeclados();
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


function regresarAlLogin() {
  localStorage.removeItem('token');
  window.location.replace('login.html');
}


async function procesarRespuesta(respuesta) {
  if (respuesta.status === 401 || respuesta.status === 403) {
    regresarAlLogin();
    throw new Error('La sesión expiró');
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



async function cargarTeclados() {
  try {
    const parametros = new URLSearchParams();

    if (filtroSwitch.value) {
      parametros.set('tipoSwitch', filtroSwitch.value);
    }

    if (filtroMarca.value.trim()) {
      parametros.set('marca', filtroMarca.value.trim());
    }

    const url = parametros.toString()
      ? API_TECLADOS + '?' + parametros.toString()
      : API_TECLADOS;

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: obtenerHeaders()
    });

    const teclados = await procesarRespuesta(respuesta);

    mostrarTeclados(teclados);

  } catch (error) {
    console.error(error);
    mostrarMensaje(error.message, true);
  }
}


function limpiarFiltros() {
  filtroSwitch.value = '';
  filtroMarca.value = '';
  cargarTeclados();
}


function debounce(funcion, espera) {
  let temporizador;

  return function (...args) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcion.apply(this, args), espera);
  };
}



function mostrarTeclados(teclados) {
  listaTeclados.replaceChildren();

  if (teclados.length === 0) {
    const aviso = document.createElement('div');
    aviso.className = 'sin-teclados';
    aviso.textContent = 'No hay teclados registrados con esos criterios.';
    listaTeclados.appendChild(aviso);
    return;
  }

  teclados.forEach((teclado) => {
    listaTeclados.appendChild(crearTarjetaTeclado(teclado));
  });
}


function crearTarjetaTeclado(teclado) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta-teclado';

  const titulo = document.createElement('h3');
  titulo.textContent = teclado.marca;

  const modelo = document.createElement('div');
  modelo.className = 'modelo';
  modelo.textContent = teclado.modelo;

  const detalleSwitch = document.createElement('div');
  detalleSwitch.className = 'detalle';
  detalleSwitch.textContent = 'Switch: ' + teclado.tipoSwitch;

  const detalleTamano = document.createElement('div');
  detalleTamano.className = 'detalle';
  detalleTamano.textContent = 'Tamaño: ' + (teclado.tamaño || 'No especificado');

  const detalleConexion = document.createElement('div');
  detalleConexion.className = 'detalle';
  detalleConexion.textContent = 'Conexión: ' + (teclado.conexion || 'No especificada');

  const detalleIdioma = document.createElement('div');
  detalleIdioma.className = 'detalle';
  detalleIdioma.textContent = 'Idioma: ' + (teclado.idioma || 'No especificado');

  const detalleIluminacion = document.createElement('div');
  detalleIluminacion.className = 'detalle';
  detalleIluminacion.textContent = 'Iluminación: ' + (teclado.iluminacion ? 'Sí' : 'No');

  const detallePrecio = document.createElement('div');
  detallePrecio.className = 'detalle';
  detallePrecio.textContent = 'Precio: ₡' + (teclado.precio || 0);

  const estado = document.createElement('span');
  estado.className = 'etiqueta-estado ' + obtenerClaseEstado(teclado.estado);
  estado.textContent = teclado.estado || 'Disponible';

  const acciones = document.createElement('div');
  acciones.className = 'acciones-teclado';

  const btnEditar = document.createElement('button');
  btnEditar.type = 'button';
  btnEditar.className = 'btn-editar';
  btnEditar.textContent = 'Editar';
  btnEditar.addEventListener('click', () => cargarTecladoEnFormulario(teclado));

  const btnEliminar = document.createElement('button');
  btnEliminar.type = 'button';
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.addEventListener('click', () => eliminarTeclado(teclado._id));

  acciones.appendChild(btnEditar);
  acciones.appendChild(btnEliminar);

  tarjeta.appendChild(titulo);
  tarjeta.appendChild(modelo);
  tarjeta.appendChild(detalleSwitch);
  tarjeta.appendChild(detalleTamano);
  tarjeta.appendChild(detalleConexion);
  tarjeta.appendChild(detalleIdioma);
  tarjeta.appendChild(detalleIluminacion);
  tarjeta.appendChild(detallePrecio);
  tarjeta.appendChild(estado);
  tarjeta.appendChild(acciones);

  return tarjeta;
}


function obtenerClaseEstado(estado) {
  if (estado === 'Agotado') {
    return 'estado-agotado';
  }

  if (estado === 'Reservado') {
    return 'estado-reservado';
  }

  return 'estado-disponible';
}



async function manejarEnvioFormulario(evento) {
  evento.preventDefault();

  const datosTeclado = {
    marca: inputMarca.value.trim(),
    modelo: inputModelo.value.trim(),
    tipoSwitch: selectSwitch.value,
    tamaño: selectTamano.value,
    idioma: inputIdioma.value.trim(),
    conexion: selectConexion.value,
    iluminacion: checkIluminacion.checked,
    estado: selectEstado.value,
    precio: Number(inputPrecio.value) || 0
  };

  try {
    if (modoEdicion) {
      await actualizarTeclado(inputId.value, datosTeclado);
      mostrarMensaje('Teclado actualizado correctamente.');
    } else {
      await crearTeclado(datosTeclado);
      mostrarMensaje('Teclado registrado correctamente.');
    }

    cancelarEdicion();
    await cargarTeclados();

  } catch (error) {
    console.error(error);
    mostrarMensaje(error.message, true);
  }
}


async function crearTeclado(datosTeclado) {
  const respuesta = await fetch(API_TECLADOS, {
    method: 'POST',
    headers: obtenerHeaders(),
    body: JSON.stringify(datosTeclado)
  });

  return procesarRespuesta(respuesta);
}


async function actualizarTeclado(id, datosTeclado) {
  const respuesta = await fetch(API_TECLADOS + '/' + id, {
    method: 'PUT',
    headers: obtenerHeaders(),
    body: JSON.stringify(datosTeclado)
  });

  return procesarRespuesta(respuesta);
}


function cargarTecladoEnFormulario(teclado) {
  modoEdicion = true;

  inputId.value = teclado._id;
  inputMarca.value = teclado.marca || '';
  inputModelo.value = teclado.modelo || '';
  selectSwitch.value = teclado.tipoSwitch || '';
  selectTamano.value = teclado.tamaño || 'TKL';
  inputIdioma.value = teclado.idioma || '';
  selectConexion.value = teclado.conexion || 'USB';
  checkIluminacion.checked = Boolean(teclado.iluminacion);
  selectEstado.value = teclado.estado || 'Disponible';
  inputPrecio.value = teclado.precio || 0;

  tituloFormulario.textContent = 'Editar teclado';
  btnGuardarTeclado.textContent = 'Guardar cambios';
  btnCancelarEdicion.hidden = false;

  formulario.scrollIntoView({ behavior: 'smooth' });
}


function cancelarEdicion() {
  modoEdicion = false;

  formulario.reset();
  inputId.value = '';

  tituloFormulario.textContent = 'Registrar nuevo teclado';
  btnGuardarTeclado.textContent = 'Registrar teclado';
  btnCancelarEdicion.hidden = true;
}



async function eliminarTeclado(id) {
  const confirmado = confirm('¿Está seguro de que desea eliminar este teclado?');

  if (!confirmado) {
    return;
  }

  try {
    const respuesta = await fetch(API_TECLADOS + '/' + id, {
      method: 'DELETE',
      headers: obtenerHeaders()
    });

    await procesarRespuesta(respuesta);

    mostrarMensaje('Teclado eliminado correctamente.');
    await cargarTeclados();

  } catch (error) {
    console.error(error);
    mostrarMensaje(error.message, true);
  }
}


function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.className = esError ? 'mensaje-error' : 'mensaje-correcto';

  setTimeout(() => {
    mensaje.textContent = '';
    mensaje.className = '';
  }, 2500);
}