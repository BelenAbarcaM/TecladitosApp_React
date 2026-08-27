import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { guardarToken, iniciarSesion, obtenerToken } from '../services/api.js';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formulario, setFormulario] = useState({ correo: '', clave: '' });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  if (obtenerToken()) {
    return <Navigate to="/inicio" replace />;
  }

  function cambiar(event) {
    const { name, value } = event.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();
    setMensaje('');
    setCargando(true);

    try {
      const datos = await iniciarSesion(formulario.correo, formulario.clave);
      guardarToken(datos.token);
      navigate(location.state?.from || '/inicio', { replace: true });
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="auth-card">
      <div className="eyebrow">TecladitosApp</div>
      <h1>Iniciar sesión</h1>
      <p>Ingrese con el usuario registrado en el backend original de Node.js.</p>

      <form onSubmit={enviar} className="formulario">
        <label>
          Correo electrónico
          <input
            type="email"
            name="correo"
            value={formulario.correo}
            onChange={cambiar}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="clave"
            value={formulario.clave}
            onChange={cambiar}
            required
            autoComplete="current-password"
          />
        </label>

        {mensaje && <div className="mensaje error">{mensaje}</div>}

        <button className="btn primario" type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="auth-footer">
        ¿No tiene cuenta? <Link to="/registro">Registrarse</Link>
      </p>
    </section>
  );
}

export default Login;
