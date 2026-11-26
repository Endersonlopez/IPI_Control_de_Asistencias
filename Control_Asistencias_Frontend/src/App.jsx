import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Toaster } from 'sonner';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Alumnos from './pages/Alumnos/Alumnos';
import Asistencias from './pages/Asistencias/Asistencias';
import Configuracion from './pages/Configuracion/Configuracion';
import Clases from './pages/Clases/Clases';
import Profesores from './pages/Profesores/Profesores';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div />;
  return user ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div />;
  if (!user) return <Navigate to="/" />;
  const rol = (user?.roles || '').toLowerCase();
  const esAdmin = rol.includes('admin');
  return esAdmin ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/alumnos" element={<AdminRoute><Alumnos /></AdminRoute>} />
        <Route path="/profesores" element={<AdminRoute><Profesores /></AdminRoute>} />
        <Route path="/clases" element={<PrivateRoute><Clases /></PrivateRoute>} />
        <Route path="/asistencias" element={<PrivateRoute><Asistencias /></PrivateRoute>} />
        <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}