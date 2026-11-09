import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axiosConfig';

export default function ConfigNotificaciones() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await api.get('/Configuracion');
        if (response.data) {
          setNotificaciones(response.data.notificaciones_Activas ?? true);
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const toggle = async () => {
    const nuevoValor = !notificaciones;
    setNotificaciones(nuevoValor);
    try {
      await api.put('/Configuracion', {
        Tiempo_QR: 30,
        Notificaciones_Activas: nuevoValor,
      });
      toast.success(nuevoValor ? 'Notificaciones activadas.' : 'Notificaciones desactivadas.');
    } catch (error) {
      setNotificaciones(!nuevoValor);
      toast.error('Error al actualizar la configuración.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 rounded-xl ${notificaciones ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
          {notificaciones ? <Bell size={20} /> : <BellOff size={20} />}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Notificaciones</h3>
          <p className="text-xs text-gray-500 mt-0.5">Gestiona las alertas del sistema</p>
        </div>
      </div>

      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
      ) : (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Notificar asistencia registrada</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggle}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notificaciones ? 'bg-[#3C31C6]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notificaciones ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-semibold text-gray-700">
              {notificaciones ? 'Activado' : 'Desactivado'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}