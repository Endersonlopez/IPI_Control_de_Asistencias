import { useEffect, useState } from 'react';
import { X, User, GraduationCap, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const obtenerEstilosMateria = (codigo) => {
  if (!codigo || codigo === 'N/A') {
    return { badge: 'bg-gray-600 text-white' };
  }
  const paletas = [
    { badge: 'bg-[#3C31C6] text-white' },
    { badge: 'bg-[#5B21B6] text-white' },
    { badge: 'bg-[#0D9488] text-white' },
    { badge: 'bg-[#059669] text-white' },
    { badge: 'bg-[#D97706] text-white' },
    { badge: 'bg-[#C026D3] text-white' },
    { badge: 'bg-[#E11D48] text-white' },
    { badge: 'bg-[#2563EB] text-white' }
  ];
  let hash = 0;
  for (let i = 0; i < codigo.length; i++) {
    hash = codigo.charCodeAt(i) + ((hash << 5) - hash);
  }
  return paletas[Math.abs(hash) % paletas.length];
};

export default function AlumnosDrawer({ isOpen, onClose, clase }) {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Determinar si la clase está activa
  const esActiva = Number(clase?.estado_Horario) === 1;

  useEffect(() => {
    if (isOpen && clase?.id_Materia) {
      cargarAlumnos();
    }
    if (!isOpen) {
      setTimeout(() => setAlumnos([]), 300);
    }
  }, [isOpen, clase]);

  const cargarAlumnos = async () => {
    setCargando(true);
    try {
      const response = await api.get(`/Clases/materia/${clase.id_Materia}/alumnos`);
      setAlumnos(response.data || []);
    } catch (error) {
      console.error('Error al cargar la lista de alumnos:', error);
    } finally {
      setCargando(false);
    }
  };

  const estilos = obtenerEstilosMateria(clase?.codigo_Materia);
  // borrar
console.log('AlumnosDrawer - clase:', clase);
  return (
    <div 
      className={`fixed inset-y-0 right-0 z-40 w-[400px] bg-white shadow-2xl border-l border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${!esActiva ? 'grayscale opacity-80' : ''}`}
    >
      
      {/* Encabezado */}
      <div className={`pl-6 pr-3 pt-4 pb-5 flex items-start justify-between flex-shrink-0 transition-colors duration-300 ${estilos.badge}`}>
        <div className="flex items-center gap-3 mt-1">
          <GraduationCap className="w-6 h-6" />
          <div>
            <h2 className="font-bold text-lg leading-tight">{clase?.nombre_Materia || 'Cargando...'}</h2>
            <p className="text-xs text-white/80 font-mono mt-0.5">{clase?.codigo_Materia}</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-3 bg-slate-50 border-b border-gray-100 flex justify-between items-center text-sm text-slate-600 font-medium flex-shrink-0">
        <span>Alumnos inscritos</span>
        <span className="bg-indigo-50 text-[#3C31C6] px-2.5 py-0.5 rounded-full text-xs font-bold">
          {alumnos.length} registrados
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        {cargando ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#3C31C6]" />
            <p className="text-sm">Cargando lista de alumnos...</p>
          </div>
        ) : alumnos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <User className="w-12 h-12 stroke-1 mb-2 text-gray-300" />
            <p className="text-sm font-medium">No hay alumnos inscritos en esta materia.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {alumnos.map((alumno, index) => (
              <li 
                key={alumno.id_Alumno || index} 
                className="flex items-center gap-4 p-4 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#3C31C6] font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {alumno.nombre_Completo}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    ID Alumno: {alumno.id_Alumno}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pie de página */}
      <div className="pl-6 pr-4 py-4 border-t border-gray-100 bg-white flex justify-end flex-shrink-0">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-white text-gray-700 font-medium text-sm rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
        >
          Cerrar
        </button>
      </div>

    </div>
  );
}