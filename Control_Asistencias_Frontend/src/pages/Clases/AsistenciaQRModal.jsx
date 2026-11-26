import { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axiosConfig';

export default function AsistenciaQRModal({ claseInfo, onClose }) {
  const [qrValue, setQrValue] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(30); // valor inicial temporal
  const [tiempoConfigurado, setTiempoConfigurado] = useState(30); // valor real desde la API
  const [cargandoConfig, setCargandoConfig] = useState(true);

  // Obtener la configuración del usuario al abrir el modal
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const respuesta = await api.get('/Configuracion');
        if (respuesta.data) {
          const segundos = respuesta.data.tiempo_QR || 30;
          setTiempoConfigurado(segundos);
          setTiempoRestante(segundos);
        }
      } catch (error) {
        console.error('Error al cargar configuración del QR:', error);
        // Si falla, se queda con 30 segundos por defecto
      } finally {
        setCargandoConfig(false);
      }
    };
    cargarConfiguracion();
  }, []);

  const generarNuevoToken = () => {
    const idHorario = claseInfo?.id_Horario || claseInfo?.Id_Horario;
    if (!idHorario) {
      console.error('No se encontró el ID del horario');
      return;
    }
    const nuevoToken = `ASISTENCIA-${idHorario}-${Date.now()}`;
    setQrValue(nuevoToken);
    setTiempoRestante(tiempoConfigurado);
  };

  useEffect(() => {
    if (cargandoConfig) return;
    generarNuevoToken();
    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          generarNuevoToken();
          return tiempoConfigurado;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cargandoConfig]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between bg-[#3C31C6] px-6 py-4 text-white">
          <div>
            <h3 className="text-lg font-bold">Captura de Asistencia</h3>
            <p className="text-xs text-indigo-200 mt-0.5">Escanea el código para registrarte</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 w-full relative">
            {!qrValue ? (
              <div className="h-[200px] w-[200px] flex items-center justify-center">
                <RefreshCw className="animate-spin text-gray-300" size={32} />
              </div>
            ) : (
              <QRCodeSVG 
                value={qrValue} 
                size={220} 
                level={"H"}
                includeMargin={true}
                className="rounded-xl shadow-sm bg-white"
              />
            )}

            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-500">
              <RefreshCw size={14} className={tiempoRestante < 5 ? "text-red-500 animate-spin" : "text-indigo-500"} />
              <p>
                Actualizando en <span className={`font-bold ${tiempoRestante < 5 ? 'text-red-500' : 'text-gray-700'}`}>{tiempoRestante}s</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 px-4">
            Este código QR es de un solo uso o temporal para garantizar la seguridad de la asistencia.
          </p>
        </div>
      </div>
    </div>
  );
}