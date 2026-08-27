import { useEffect, useState } from 'react';
import TextField from '../components/TextField.jsx';
import SelectField from '../components/SelectField.jsx';
import TecladoCard from '../components/TecladoCard.jsx';
import {
  actualizarTeclado,
  crearTeclado,
  eliminarTeclado,
  obtenerTeclados
} from '../services/api.js';

const TECLADO_VACIO = {
  marca: '',
  modelo: '',
  tipoSwitch: '',
  tamaño: '',
  idioma: '',
  conexion: '',
  estado: 'Disponible',
  precio: '',
  iluminacion: false,
  imagen: ''
};

const OPCIONES_TAMANO = ['Full size', 'TKL (80%)', '75%', '65%', '60%'];
const OPCIONES_IDIOMA = ['Español (Latino)', 'Inglés (US)', 'Inglés (ISO)'];
const OPCIONES_CONEXION = ['USB-C', 'Bluetooth', 'Inalámbrico 2.4GHz'];
const OPCIONES_ESTADO = ['Disponible', 'Agotado', 'Reservado'];

const ANCHO_MAXIMO_IMAGEN = 500;

function convertirImagenBase64(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    lector.onload = () => {
      const img = new Image();

      img.onload = () => {
        const escala = Math.min(1, ANCHO_MAXIMO_IMAGEN / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * escala;
        canvas.height = img.height * escala;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Error procesando la imagen'));
      img.src = lector.result;
    };

    lector.onerror = () => reject(new Error('Error leyendo la imagen'));
    lector.readAsDataURL(archivo);
  });
}

function Teclados() {
  const [teclado, setTeclado] = useState(TECLADO_VACIO);
  const [teclados, setTeclados] = useState([]);
  const [idEditando, setIdEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  async function cargarTeclados() {
    try {
      setCargando(true);
      const datos = await obtenerTeclados();
      setTeclados(datos || []);
    } catch (error) {
      mostrarMensaje(error.message, true);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTeclados();
  }, []);

  function mostrarMensaje(texto, error = false) {
    setMensaje(texto);
    setEsError(error);
  }

  function cambiarCampo(event) {
    const { name, value } = event.target;
    setTeclado((anterior) => ({ ...anterior, [name]: value }));
  }

  function cambiarIluminacion(event) {
    setTeclado((anterior) => ({ ...anterior, iluminacion: event.target.checked }));
  }

  async function cambiarImagen(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    try {
      const imagenBase64 = await convertirImagenBase64(archivo);
      setTeclado((anterior) => ({ ...anterior, imagen: imagenBase64 }));
    } catch (error) {
      mostrarMensaje(error.message, true);
    }
  }

  function limpiar() {
    setTeclado(TECLADO_VACIO);
    setIdEditando(null);
    setMensaje('');
  }

  function comenzarEdicion(item) {
    setIdEditando(item._id);
    setTeclado({
      marca: item.marca || '',
      modelo: item.modelo || '',
      tipoSwitch: item.tipoSwitch || '',
      tamaño: item.tamaño || '',
      idioma: item.idioma || '',
      conexion: item.conexion || '',
      estado: item.estado || 'Disponible',
      precio: item.precio ?? '',
      iluminacion: Boolean(item.iluminacion),
      imagen: item.imagen || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function guardar(event) {
    event.preventDefault();

    if (!teclado.marca.trim() || !teclado.modelo.trim() || !teclado.tipoSwitch.trim()) {
      mostrarMensaje('Marca, modelo y tipo de switch son obligatorios.', true);
      return;
    }

    setGuardando(true);

    const datosEnviar = {
      ...teclado,
      precio: Number(teclado.precio) || 0
    };

    try {
      if (idEditando) {
        await actualizarTeclado(idEditando, datosEnviar);
        mostrarMensaje('Teclado actualizado correctamente.');
      } else {
        await crearTeclado(datosEnviar);
        mostrarMensaje('Teclado registrado correctamente.');
      }

      limpiar();
      await cargarTeclados();
    } catch (error) {
      mostrarMensaje(error.message, true);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id) {
    if (!window.confirm('¿Desea eliminar este teclado?')) return;

    try {
      const datos = await eliminarTeclado(id);
      mostrarMensaje(datos?.mensaje || 'Teclado eliminado correctamente.');
      if (idEditando === id) limpiar();
      await cargarTeclados();
    } catch (error) {
      mostrarMensaje(error.message, true);
    }
  }

  return (
    <section>
      <div className="encabezado-seccion">
        <div>
          <div className="eyebrow">CRUD con fetch</div>
          <h1>Administrar teclados</h1>
          <p>Registre, edite o elimine los teclados del inventario.</p>
        </div>
      </div>

      <div className="layout-diseño">
        <form className="panel" onSubmit={guardar}>
          <div className="panel-titulo">
            <h2>{idEditando ? 'Editar teclado' : 'Nuevo teclado'}</h2>
            {idEditando && <span className="badge">Modo edición</span>}
          </div>

          <div className="grid-campos">
            <TextField label="Marca" name="marca" value={teclado.marca} onChange={cambiarCampo} required placeholder="Ej: Logitech" />
            <TextField label="Modelo" name="modelo" value={teclado.modelo} onChange={cambiarCampo} required placeholder="Ej: G Pro X" />
            <TextField label="Tipo de switch" name="tipoSwitch" value={teclado.tipoSwitch} onChange={cambiarCampo} required placeholder="Ej: Rojo, Azul, Marrón" />
            <SelectField label="Tamaño" name="tamaño" value={teclado.tamaño} onChange={cambiarCampo} opciones={OPCIONES_TAMANO} />
            <SelectField label="Idioma" name="idioma" value={teclado.idioma} onChange={cambiarCampo} opciones={OPCIONES_IDIOMA} />
            <SelectField label="Conexión" name="conexion" value={teclado.conexion} onChange={cambiarCampo} opciones={OPCIONES_CONEXION} />
            <SelectField label="Estado" name="estado" value={teclado.estado} onChange={cambiarCampo} opciones={OPCIONES_ESTADO} placeholder="" />
            <TextField label="Precio" name="precio" type="number" min="0" value={teclado.precio} onChange={cambiarCampo} required placeholder="Ej: 65000" />
          </div>

          <label className="campo-check">
            <input type="checkbox" checked={teclado.iluminacion} onChange={cambiarIluminacion} />
            Tiene iluminación RGB
          </label>

          <label className="campo-field">
            <span>Foto del teclado</span>
            <input type="file" accept="image/*" onChange={cambiarImagen} />
          </label>

          {teclado.imagen && (
            <img className="vista-previa-imagen" src={teclado.imagen} alt="Vista previa del teclado" />
          )}

          <div className="acciones">
            <button className="btn primario" type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : idEditando ? 'Actualizar' : 'Guardar teclado'}
            </button>
            <button className="btn secundario" type="button" onClick={limpiar}>Limpiar</button>
          </div>

          {mensaje && <div className={`mensaje ${esError ? 'error' : 'exito'}`}>{mensaje}</div>}
        </form>

        <div className="panel preview-panel">
          <h2>Datos que se enviarán</h2>
          <pre>{JSON.stringify({ ...teclado, imagen: teclado.imagen ? '(imagen en base64...)' : '' }, null, 2)}</pre>
        </div>
      </div>

      <div className="subtitulo-lista">
        <h2>Teclados registrados</h2>
        <button className="btn secundario" onClick={cargarTeclados}>Recargar</button>
      </div>

      {cargando ? (
        <p>Cargando teclados...</p>
      ) : teclados.length === 0 ? (
        <div className="vacio">No hay teclados registrados.</div>
      ) : (
        <div className="grid-teclados">
          {teclados.map((item) => (
            <TecladoCard teclado={item} key={item._id}>
              <button className="btn secundario" onClick={() => comenzarEdicion(item)}>Editar</button>
              <button className="btn peligro" onClick={() => eliminar(item._id)}>Eliminar</button>
            </TecladoCard>
          ))}
        </div>
      )}
    </section>
  );
}

export default Teclados;
