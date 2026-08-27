function claseEstado(estado) {
  if (estado === 'Agotado') return 'estado-agotado';
  if (estado === 'Reservado') return 'estado-reservado';
  return 'estado-disponible';
}

function formatearPrecio(precio) {
  const valor = Number(precio) || 0;
  return '₡' + valor.toLocaleString('es-CR');
}

function TecladoCard({ teclado, children }) {
  return (
    <article className="teclado-card">
      {teclado.imagen && (
        <img className="teclado-imagen" src={teclado.imagen} alt={`${teclado.marca} ${teclado.modelo}`} loading="lazy" />
      )}

      <div className="teclado-card-header">
        <div>
          <h3>{teclado.marca} {teclado.modelo}</h3>
          <small>{teclado._id}</small>
        </div>
        <span className={`etiqueta-estado ${claseEstado(teclado.estado)}`}>
          {teclado.estado || 'Disponible'}
        </span>
      </div>

      <div className="detalles-teclado">
        <div className="detalle-item"><span>Switch</span><strong>{teclado.tipoSwitch || '—'}</strong></div>
        <div className="detalle-item"><span>Tamaño</span><strong>{teclado.tamaño || '—'}</strong></div>
        <div className="detalle-item"><span>Idioma</span><strong>{teclado.idioma || '—'}</strong></div>
        <div className="detalle-item"><span>Conexión</span><strong>{teclado.conexion || '—'}</strong></div>
        <div className="detalle-item"><span>Iluminación</span><strong>{teclado.iluminacion ? 'Sí' : 'No'}</strong></div>
        <div className="detalle-item"><span>Precio</span><strong>{formatearPrecio(teclado.precio)}</strong></div>
      </div>

      {children && <div className="acciones">{children}</div>}
    </article>
  );
}

export default TecladoCard;
