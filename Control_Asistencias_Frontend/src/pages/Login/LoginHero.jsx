import { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function LoginHero() {
  const [stats, setStats] = useState({ alumnos: 0, registros: 0, profesores: 0 });

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const response = await api.get('/Estadisticas/login-stats');
        if (response.data) {
          setStats({ 
            alumnos: response.data.totalAlumnos || 0, 
            registros: response.data.totalRegistros || 0,
            profesores: response.data.totalProfesores || 0
          });
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };
    cargarEstadisticas();
  }, []);

  return (
    <div className="hidden lg:flex lg:w-[100%] flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700 relative overflow-hidden text-white p-12">
      
      <div className="absolute -left-[200px] -top-[200px] h-[500px] w-[500px] rounded-full bg-white/5"></div>
      <div className="absolute -bottom-[300px] -right-[300px] h-[700px] w-[700px] rounded-full bg-white/5"></div>

      <div className="z-10 flex max-w-md flex-col items-center text-center">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white/10 shadow-sm backdrop-blur-sm">
          <QrCode size={56} strokeWidth={1.5} />
        </div>
        
        <h1 className="mb-4 text-3xl font-bold tracking-wide">Escanea y asiste</h1>
        <p className="mb-14 text-sm font-light leading-relaxed text-indigo-100 px-4">
          Los alumnos escanean el código QR desde su dispositivo móvil y la cámara registra su asistencia automáticamente.
        </p>

        <div className="flex w-full justify-between border-t border-white/20 pt-8 px-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.alumnos}</span>
            <span className="text-xs font-light text-indigo-200 mt-1">Alumnos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.registros}</span>
            <span className="text-xs font-light text-indigo-200 mt-1">Registros</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.profesores}</span>
            <span className="text-xs font-light text-indigo-200 mt-1">Profesores</span>
          </div>
        </div>
      </div>
    </div>
  );
}