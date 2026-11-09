import { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axiosConfig';

export default function ConfigQr() {
  const [tiempoQR, setTiempoQR] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await api.get('/Configuracion');
        if (response.data) {
          setTiempoQR(response.data.tiempo_QR || 30);
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const guardar = async () => {
    setSaving(true);
    try {
      await api.put('/Configuracion', {
        Tiempo_QR: tiempoQR,
        Notificaciones_Activas: true,
      });
      toast.success('Tiempo del QR actualizado correctamente.');
    } catch (error) {
      toast.error('Error al guardar la configuración.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <QrCode size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Generador de Código QR</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configura el tiempo de exposición del QR en pantalla
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-10 bg-gray-200 rounded animate-pulse w-48" />
      ) : (
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Tiempo de exposición (segundos)
            </label>
            <select
              value={tiempoQR}
              onChange={(e) => setTiempoQR(Number(e.target.value))}
              className="w-48 rounded-xl bg-gray-50 border border-gray-100 px-4 py-2.5 text-xs text-gray-700 outline-none focus:border-indigo-600 focus:bg-white transition-all h-11 cursor-pointer"
            >
              <option value={15}>15 segundos</option>
              <option value={30}>30 segundos</option>
              <option value={45}>45 segundos</option>
              <option value={60}>60 segundos</option>
            </select>
          </div>
          <button
            onClick={guardar}
            disabled={saving}
            className="rounded-xl bg-[#3C31C6] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-70 cursor-pointer"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      )}
    </div>
  );
}