import { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function AsistenciasFiltros({ onBuscar, clasesDisponibles = [] }) {
  const [buscar, setBuscar] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idClase, setIdClase] = useState('');
  const [estadoAsistencia, setEstadoAsistencia] = useState('');

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Validar y ajustar fechas automáticamente
    let inicio = fechaInicio;
    let fin = fechaFin;
    if (inicio && fin && inicio > fin) {
      setFechaInicio(fin);
      setFechaFin(inicio);
      inicio = fin;
      fin = inicio;
    }

    const timeoutId = setTimeout(() => {
      if (onBuscar) {
        onBuscar({ buscar, fechaInicio: inicio, fechaFin: fin, idClase, estadoAsistencia });
      }
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [buscar, fechaInicio, fechaFin, idClase, estadoAsistencia]);

  const limpiarFiltros = () => {
    setBuscar('');
    setFechaInicio('');
    setFechaFin('');
    setIdClase('');
    setEstadoAsistencia('');
    if (onBuscar) {
      onBuscar({ buscar: '', fechaInicio: '', fechaFin: '', idClase: '', estadoAsistencia: '' });
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar por código, alumno, clase..." 
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#3C31C6] focus:ring-1 focus:ring-[#3C31C6] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-[#3C31C6] focus-within:ring-1 focus-within:ring-[#3C31C6] transition-all">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Fecha inicio:</span>
            <input 
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-[145px] bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-[#3C31C6] focus-within:ring-1 focus-within:ring-[#3C31C6] transition-all">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Fecha fin:</span>
            <input 
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-[145px] bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4">
          <select 
            value={idClase}
            onChange={(e) => setIdClase(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3C31C6] md:w-[220px]"
          >
            <option value="">Todas las clases</option>
            {clasesDisponibles.map(clase => (
              <option key={clase.id_Materia || clase.id_Horario} value={clase.id_Materia || clase.id_Horario}>
                {clase.nombre_Materia || clase.Nombre_Materia || clase.nombre_Completo}
              </option>
            ))}
          </select>

          <select 
            value={estadoAsistencia}
            onChange={(e) => setEstadoAsistencia(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3C31C6] md:w-[180px]"
          >
            <option value="">Todos los estados</option>
            <option value="Presente">Presente</option>
            <option value="Ausente">Ausente</option>
            <option value="Llegada con tolerancia">Llegada con tolerancia</option>
            <option value="Tarde">Tarde</option>
          </select>

          {/* Limpiar filtros */}
          <button 
            type="button"
            onClick={limpiarFiltros}
            className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#3C31C6] hover:bg-indigo-700 text-white px-6 py-2.5 text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}