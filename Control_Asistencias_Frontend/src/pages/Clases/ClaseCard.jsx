import { Clock, Calendar, Users, QrCode, Edit2, BookOpen } from 'lucide-react';

export default function ClaseCard({ clase, esAdmin, onProyectarQR, onIngresoManual, onEditar }) {
  
  const formatearHora = (horaString) => {
    if (!horaString) return '';
    return horaString.substring(0, 5);
  };

  // Determinar si la clase está activa
  const esActiva = Number(clase.estado_Horario) === 1;

  const obtenerEstilosMateria = (codigo) => {
    if (!codigo || codigo === 'N/A') {
      return {
        badge: 'bg-gray-600 text-white',
        headerBg: 'bg-gray-50',
        border: 'border-gray-100',
        iconText: 'text-gray-600',
        glow: 'bg-gray-400/10'
      };
    }

    const paletas = [
      { badge: 'bg-[#3C31C6] text-white', headerBg: 'bg-[#3C31C6]/5', border: 'border-[#3C31C6]/10', iconText: 'text-[#3C31C6]', glow: 'bg-[#3C31C6]/10 group-hover:bg-[#3C31C6]/20' },
      { badge: 'bg-[#5B21B6] text-white', headerBg: 'bg-[#5B21B6]/5', border: 'border-[#5B21B6]/10', iconText: 'text-[#5B21B6]', glow: 'bg-[#5B21B6]/10 group-hover:bg-[#5B21B6]/20' },
      { badge: 'bg-[#0D9488] text-white', headerBg: 'bg-[#0D9488]/5', border: 'border-[#0D9488]/10', iconText: 'text-[#0D9488]', glow: 'bg-[#0D9488]/10 group-hover:bg-[#0D9488]/20' },
      { badge: 'bg-[#059669] text-white', headerBg: 'bg-[#059669]/5', border: 'border-[#059669]/10', iconText: 'text-[#059669]', glow: 'bg-[#059669]/10 group-hover:bg-[#059669]/20' },
      { badge: 'bg-[#D97706] text-white', headerBg: 'bg-[#D97706]/5', border: 'border-[#D97706]/10', iconText: 'text-[#D97706]', glow: 'bg-[#D97706]/10 group-hover:bg-[#D97706]/20' },
      { badge: 'bg-[#C026D3] text-white', headerBg: 'bg-[#C026D3]/5', border: 'border-[#C026D3]/10', iconText: 'text-[#C026D3]', glow: 'bg-[#C026D3]/10 group-hover:bg-[#C026D3]/20' },
      { badge: 'bg-[#E11D48] text-white', headerBg: 'bg-[#E11D48]/5', border: 'border-[#E11D48]/10', iconText: 'text-[#E11D48]', glow: 'bg-[#E11D48]/10 group-hover:bg-[#E11D48]/20' },
      { badge: 'bg-[#2563EB] text-white', headerBg: 'bg-[#2563EB]/5', border: 'border-[#2563EB]/10', iconText: 'text-[#2563EB]', glow: 'bg-[#2563EB]/10 group-hover:bg-[#2563EB]/20' }
    ];

    let hash = 0;
    for (let i = 0; i < codigo.length; i++) {
      hash = codigo.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % paletas.length;
    return paletas[index];
  };

  const estilos = obtenerEstilosMateria(clase.codigo_Materia);

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow group ${!esActiva ? 'grayscale opacity-70' : ''}`}>
      
      <div className={`${estilos.headerBg} p-5 border-b ${estilos.border} relative overflow-hidden transition-colors`}>
        <div className={`absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full ${estilos.glow} blur-2xl transition-colors`}></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <span className={`inline-block rounded-md ${estilos.badge} px-2.5 py-1 text-[11px] font-bold mb-3 shadow-xs`}>
              {clase.codigo_Materia}
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {clase.nombre_Materia}
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 font-medium">
              Prof: {clase.nombre_Profesor || 'No asignado'}
            </p>
            {!esActiva && (
              <span className="inline-block mt-2 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-200">
                Inactiva
              </span>
            )}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ml-4">
            <BookOpen size={20} className={estilos.iconText} />
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-medium">{clase.nombre_Dia}</span>
        </div>
        
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <Clock size={16} className="text-gray-400" />
          <span>
            {formatearHora(clase.hora_Inicio)} - {formatearHora(clase.hora_Fin)}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <Users size={16} className="text-gray-400" />
          <span>
            <strong className="text-gray-900">{clase.alumnos_Inscritos}</strong> alumnos inscritos
          </span>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center gap-2 p-4 border-t border-gray-50 bg-gray-50/50 justify-end">
        {esActiva && !esAdmin && (
          <button 
            onClick={onProyectarQR}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#3C31C6] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <QrCode size={16} />
            Proyectar QR
          </button>
        )}

        {esAdmin && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEditar(clase);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-indigo-600 transition-colors"
            title="Editar clase"
          >
            <Edit2 size={16} />
            Editar
          </button>
        )}
      </div>

    </div>
  );
}