import { useEffect, useRef, useState } from 'react';
import TecladoCard from '../components/TecladoCard.jsx';
import { obtenerTeclados } from '../services/api.js';

function Filtros() {
  const [filtroSwitch, setFiltroSwitch] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [teclados, setTeclados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const temporizador = useRef(null);

  async function cargar(filtros) {
    try {
      setCargando(true);
      const datos = await obtenerTeclados(filtros);
      setTeclados(datos || []);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar({});
  }, []);

  function programarBusqueda(nuevoSwitch, nuevaMarca) {
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      cargar({ tipoSwitch: nuevoSwitch, marca: nuevaMarca });
    }, 350);
  }

  function cambiarSwitch(event) {
    const valor = event.target.value;
    setFiltroSwitch(valor);
    programarBusqueda(valor, filtroMarca);
  }

  function cambiarMarca(event) {
    const valor = event.target.value;
    setFiltroMarca(valor);
    programarBusqueda(filtroSwitch, valor);
  }

  function limpiarFiltros() {
    setFiltroSwitch('');
    setFiltroMarca('');
    clearTimeout(temporizador.current);
    cargar({});
  }

  return (
    <section>
      <div className="encabezado-seccion">
        <div>
          <div className="eyebrow">GET /api/teclados?tipoSwitch=&amp;marca=</div>
          <h1>Filtrar inventario</h1>
          <p>Busque teclados por tipo de switch o marca usando los filtros originales del backend.</p>
        </div>
      </div>

      <div className="panel filtros-panel">
        <div className="grid-campos">
          <label className="campo-field">
            <span>Tipo de switch</span>
            <input type="text" value={filtroSwitch} onChange={cambiarSwitch} placeholder="Ej: rojo" />
          </label>

          <label className="campo-field">
            <span>Marca</span>
            <input type="text" value={filtroMarca} onChange={cambiarMarca} placeholder="Ej: logitech" />
          </label>
        </div>

        <div className="acciones">
          <button className="btn secundario" type="button" onClick={limpiarFiltros}>Limpiar filtros</button>
        </div>
      </div>

      {mensaje && <div className="mensaje error">{mensaje}</div>}

      <div className="subtitulo-lista">
        <h2>Resultados</h2>
      </div>

      {cargando ? (
        <p>Buscando teclados...</p>
      ) : teclados.length === 0 ? (
        <div className="vacio">No hay teclados que coincidan con esos criterios.</div>
      ) : (
        <div className="grid-teclados">
          {teclados.map((item) => (
            <TecladoCard teclado={item} key={item._id} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Filtros;
