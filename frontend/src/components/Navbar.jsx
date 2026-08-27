import { NavLink, useNavigate } from 'react-router-dom';
import { eliminarToken, obtenerToken } from '../services/api.js';

function Navbar() {
  const navigate = useNavigate();
  const autenticado = Boolean(obtenerToken());

  function cerrarSesion() {
    eliminarToken();
    navigate('/login');
  }

  return (
    <header className="barra">
      <div className="barra-contenido">
        <NavLink className="marca" to={autenticado ? '/inicio' : '/login'}>
          TecladitosApp
        </NavLink>

        <nav className="nav-links">
          {autenticado ? (
            <>
              <NavLink to="/inicio">Inicio</NavLink>
              <NavLink to="/teclados">Teclados</NavLink>
              <NavLink to="/filtros">Filtros</NavLink>
              <button className="btn-link" onClick={cerrarSesion}>Salir</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Ingresar</NavLink>
              <NavLink to="/registro">Registro</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
