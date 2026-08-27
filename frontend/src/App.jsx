import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Inicio from './pages/Inicio.jsx';
import Teclados from './pages/Teclados.jsx';
import Filtros from './pages/Filtros.jsx';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="contenedor-principal">
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/inicio"
            element={
              <RutaProtegida>
                <Inicio />
              </RutaProtegida>
            }
          />
          <Route
            path="/teclados"
            element={
              <RutaProtegida>
                <Teclados />
              </RutaProtegida>
            }
          />
          <Route
            path="/filtros"
            element={
              <RutaProtegida>
                <Filtros />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
