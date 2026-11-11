import { useState, useEffect, useRef } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axiosConfig';

export default function NotificacionesBell() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [passwordInputs, setPasswordInputs] = useState({});
  const [cargandoAccion, setCargandoAccion] = useState(null);
  const dropdownRef = useRef(null);

  const cargarSolicitudes = async () => {
    try {
      const response = await api.get('/Auth/solicitudes-pendientes');
      setSolicitudes(response.data || []);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
    const interval = setInterval(cargarSolicitudes, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAsignar = async (idSolicitud) => {
    const nuevaContrasena = passwordInputs[idSolicitud]?.trim();
    if (!nuevaContrasena) {
      toast.error('Debes ingresar una nueva contraseña.');
      return;
    }

    setCargandoAccion(idSolicitud);
    try {
      await api.post('/Auth/asignar-contrasena', {
        Id_Solicitud: idSolicitud,
        Nueva_Contrasena: nuevaContrasena,
      });
      setPasswordInputs((prev) => {
        const updated = { ...prev };
        delete updated[idSolicitud];
        return updated;
      });
      toast.success('Contraseña asignada correctamente.');
      await cargarSolicitudes();
    } catch (error) {
      console.error('Error al asignar contraseña:', error);
      toast.error('No se pudo asignar la contraseña.');
    } finally {
      setCargandoAccion(null);
    }
  };

  const handleDescartar = async (idSolicitud) => {
    setCargandoAccion(idSolicitud);
    try {
      await api.post('/Auth/descartar-solicitud', { Id_Solicitud: idSolicitud });
      toast.success('Solicitud descartada correctamente.');
      await cargarSolicitudes();
    } catch (error) {
      console.error('Error al descartar solicitud:', error);
      toast.error('No se pudo descartar la solicitud.');
    } finally {
      setCargandoAccion(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setMostrar(!mostrar)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-gray-400 hover:text-gray-600" />
        {solicitudes.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {solicitudes.length}
          </span>
        )}
      </button>

      {mostrar && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50 max-h-96 overflow-y-auto">
          <h4 className="font-bold text-gray-800 mb-3 text-sm">
            Solicitudes de cambio de contraseña
          </h4>
          {solicitudes.length === 0 ? (
            <p className="text-sm text-gray-500">No hay solicitudes pendientes.</p>
          ) : (
            solicitudes.map((sol) => (
              <div
                key={sol.id_Solicitud}
                className="border-b border-gray-100 py-3 last:border-0"
              >
                <p className="text-sm font-medium text-gray-800 truncate">
                  {sol.nombre_Completo}
                </p>
                <p className="text-xs text-gray-500 truncate mb-2">
                  @{sol.nombre_Usuario}
                </p>

                {/* Campo de nueva contraseña */}
                <input
                  type="text"
                  placeholder="Nueva contraseña"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-600 mb-2"
                  value={passwordInputs[sol.id_Solicitud] || ''}
                  onChange={(e) =>
                    setPasswordInputs((prev) => ({
                      ...prev,
                      [sol.id_Solicitud]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAsignar(sol.id_Solicitud);
                  }}
                />

                {/* Botones de acción */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleDescartar(sol.id_Solicitud)}
                    disabled={cargandoAccion === sol.id_Solicitud}
                    className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100 hover:text-red-700 disabled:opacity-50 transition-colors"
                  >
                    Descartar
                  </button>
                  <button
                    onClick={() => handleAsignar(sol.id_Solicitud)}
                    disabled={cargandoAccion === sol.id_Solicitud}
                    className="bg-[#3C31C6] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {cargandoAccion === sol.id_Solicitud ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      'Asignar'
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}