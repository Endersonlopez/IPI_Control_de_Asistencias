import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import NotificacionesBell from './NotificacionesBell';

export default function Header({ titulo = "Dashboard" }) {
  const { user } = useContext(AuthContext);
  const rol = (user?.roles || '').toLowerCase();
  const esAdmin = rol.includes('admin');

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-gray-800">{titulo}</h1>
      </div>
      <div className="flex items-center gap-6">
        {/* Administrador: Campana de notificaciones */}
        {esAdmin && <NotificacionesBell />}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white uppercase">
            {user?.primer_Nombre?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.primer_Nombre} {user?.primer_Apellido}
          </span>
        </div>
      </div>
    </header>
  );
}