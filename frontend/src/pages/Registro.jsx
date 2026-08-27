import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/api.js';

function Registro() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({ nombre: '', correo: '', clave: '' });
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [cargando, setCargando] = useState(false);

  function cambiar(event) {
    const { name, value } = event.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const datos = await registrarUsuario(formulario);
      setEsError(false);
      setMensaje(datos.mensaje || 'Usuario registrado correctamente.');
      setTimeout(() => navigate('/login'), 800);
    } catch (error) {
      setEsError(true);
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="auth-card">
      <div className="eyebrow">Nueva cuenta</div>
      <h1>Registro</h1>
      <p>Los datos se envían directamente a <code>POST /api/registro</code>.</p>

      <form onSubmit={enviar} className="formulario">
        <label>
          Nombre
          <input name="nombre" value={formulario.nombre} onChange={cambiar} required />
        </label>

        <label>
          Correo electrónico
          <input type="email" name="correo" value={formulario.correo} onChange={cambiar} required />
        </label>

        <label>
          Contraseña
          <input type="password" name="clave" value={formulario.clave} onChange={cambiar} required />
        </label>

        {mensaje && <div className={`mensaje ${esError ? 'error' : 'exito'}`}>{mensaje}</div>}

        <button className="btn primario" type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrar usuario'}
        </button>
      </form>

      <p className="auth-footer">¿Ya tiene cuenta? <Link to="/login">Ingresar</Link></p>
    </section>
  );
}

export default Registro;
