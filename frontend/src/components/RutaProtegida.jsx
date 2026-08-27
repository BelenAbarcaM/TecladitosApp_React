import { Navigate, useLocation } from 'react-router-dom';
import { obtenerToken } from '../services/api.js';

function RutaProtegida({ children }) {
  const location = useLocation();
  const token = obtenerToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default RutaProtegida;
