import { QrCode, LayoutDashboard, Users, ClipboardList, Settings, LogOut, BookOpen, Briefcase } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Detectar el rol del usuario
  const rol = (user?.roles || '').toLowerCase();
  const esAdmin = rol.includes('admin');

  return (
    <aside className="hidden w-64 flex-col bg-indigo-600 text-white md:flex">
      {/* Logo superior */}
      <div className="flex h-20 items-center gap-3 px-6 pt-4">
        <QrCode size={28} />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-semibold tracking-wider text-indigo-200 uppercase">Control de</span>
          <span className="font-bold text-lg">Asistencias</span>
        </div>
      </div>
      
      {/* Navegación */}
      <nav className="flex flex-1 flex-col gap-2 p-4 mt-2">
        <Link 
          to="/dashboard" 
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            location.pathname === '/dashboard' 
              ? 'bg-white/20 text-white font-bold' 
              : 'text-indigo-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard size={18} />
          Inicio
        </Link>

        {/* Enlaces para administradores */}
        {esAdmin && (
          <>
            <Link 
              to="/alumnos" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                location.pathname === '/alumnos' 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users size={18} />
              Alumnos
            </Link>

            <Link 
              to="/profesores" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                location.pathname === '/profesores' 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Briefcase size={18} />
              Profesores
            </Link>
          </>
        )}

        <Link 
          to="/clases" 
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            location.pathname === '/clases' 
              ? 'bg-white/20 text-white font-bold' 
              : 'text-indigo-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          <BookOpen size={18} />
          Clases
        </Link>

        <Link 
          to="/asistencias" 
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            location.pathname === '/asistencias' 
              ? 'bg-white/20 text-white font-bold' 
              : 'text-indigo-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ClipboardList size={18} />
          Asistencias
        </Link>

        <Link 
          to="/configuracion" 
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            location.pathname === '/configuracion' 
              ? 'bg-white/20 text-white font-bold' 
              : 'text-indigo-200 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings size={18} />
          Configuración
        </Link>
      </nav>

      {/* Botón cerrar sesión */}
      <div className="p-4 mb-2">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}