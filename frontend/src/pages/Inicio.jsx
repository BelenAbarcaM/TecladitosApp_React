import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eliminarToken, obtenerUsuarioLogueado } from '../services/api.js';

function Inicio() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerUsuarioLogueado();
        setUsuario(datos);
      } catch (err) {
        setError(err.message);
        if (/token/i.test(err.message)) {
          eliminarToken();
          navigate('/login');
        }
      }
    }

    cargar();
  }, [navigate]);

  return (
    <section>
      <div className="hero">
        <div>
          <div className="eyebrow">Panel principal</div>
          <h1>{usuario ? `Bienvenido, ${usuario.nombre}` : 'Bienvenido a TecladitosApp'}</h1>
          <p>
            Esta interfaz React consume las mismas API del proyecto Node.js original utilizando
            <code> fetch()</code> y el JWT guardado en <code>localStorage</code>.
          </p>
          {error && <div className="mensaje error">{error}</div>}
        </div>
      </div>

      <div className="grid-opciones">
        <Link className="opcion-card" to="/teclados">
          <span className="opcion-numero">01</span>
          <h2>Administrar teclados</h2>
          <p>Crear, consultar, modificar y eliminar teclados del inventario.</p>
        </Link>

        <Link className="opcion-card" to="/filtros">
          <span className="opcion-numero">02</span>
          <h2>Filtrar inventario</h2>
          <p>Buscar teclados por tipo de switch o marca usando la API original.</p>
        </Link>
      </div>
    </section>
  );
}

export default Inicio;
