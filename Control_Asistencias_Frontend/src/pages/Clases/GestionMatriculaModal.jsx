import { useEffect, useState } from 'react';
import { X, Search, UserPlus, UserMinus, Loader2, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
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

export default function GestionMatriculaModal({ isOpen, onClose, clase, onActualizar }) {
  const [alumnosInscritos, setAlumnosInscritos] = useState([]);
  const [todosLosAlumnos, setTodosLosAlumnos] = useState([]);
  
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);

  const idMateriaActual = clase?.id_Materia ?? clase?.Id_Materia;

  // Determinar si la clase está activa
  const esActiva = Number(clase?.estado_Horario) === 1;

  useEffect(() => {
    if (isOpen && idMateriaActual) {
      cargarDatosMatricula();
    }
  }, [isOpen, idMateriaActual]);

  if (!isOpen) return null;

  const cargarDatosMatricula = async () => {
    setCargando(true);
    try {
      const resInscritos = await api.get(`/Clases/materia/${idMateriaActual}/alumnos`);
      setAlumnosInscritos(resInscritos.data || []);

      const resTodos = await api.get('/Clases/alumnos/todos');
      setTodosLosAlumnos(resTodos.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('No se pudieron cargar los alumnos');
    } finally {
      setCargando(false);
    }
  };

  const alumnosSugeridos = todosLosAlumnos.filter(alumno => {
    const idAl = alumno.id_Alumno ?? alumno.Id_Alumno;
    const yaInscrito = alumnosInscritos.some(
      inscrito => (inscrito.id_Alumno ?? inscrito.Id_Alumno) === idAl
    );
    const nombre = alumno.nombre_Completo || alumno.Nombre_Completo || '';
    return !yaInscrito && nombre.toLowerCase().includes(busquedaGlobal.toLowerCase());
  });

  const handleInscribir = async (alumno) => {
    const idAlumno = alumno.id_Alumno ?? alumno.Id_Alumno;
    const nombreAlumno = alumno.nombre_Completo || alumno.Nombre_Completo;

    setProcesandoId(idAlumno);
    try {
      await api.post('/Clases/materia/guardar-alumno', {
        id_Materia: idMateriaActual,
        id_Alumno: idAlumno,
        id_Creador: 1
      });

      toast.success(`¡${nombreAlumno} inscrito correctamente!`);
      setBusquedaGlobal('');
      setMostrarDropdown(false);
      await cargarDatosMatricula();
      if (onActualizar) onActualizar();
    } catch (error) {
      console.error('Error al inscribir:', error);
      toast.error('Error al inscribir el alumno');
    } finally {
      setProcesandoId(null);
    }
  };

  const handleDesinscribir = async (alumno) => {
    const idAlumno = alumno.id_Alumno ?? alumno.Id_Alumno;
    const nombreCompleto = alumno.nombre_Completo || alumno.Nombre_Completo;

    if (!idAlumno || !idMateriaActual) {
      toast.error('Datos de alumno o materia incompletos');
      return;
    }

    setProcesandoId(idAlumno);
    try {
      await api.delete(`/Clases/materia/${idMateriaActual}/alumno/${idAlumno}`);

      toast.success(`${nombreCompleto} ha sido desinscrito`);
      await cargarDatosMatricula();
      if (onActualizar) onActualizar();
    } catch (error) {
      console.error('Error al desinscribir:', error);
      toast.error('Error al desinscribir el alumno');
    } finally {
      setProcesandoId(null);
    }
  };

  const codigoMateria = clase?.codigo_Materia || clase?.Codigo_Materia || 'N/A';
  const nombreProfesor = clase?.nombre_Profesor || clase?.Nombre_Profesor || 'No asignado';
  const estilos = obtenerEstilosMateria(codigoMateria);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className={`relative w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col max-h-[85vh] ${!esActiva ? 'grayscale opacity-80' : ''}`}>
        
        {/* Encabezado */}
        <div className={`flex items-center justify-between px-6 py-4 flex-shrink-0 transition-colors duration-300 ${estilos.badge}`}>
          <div>
            <h3 className="text-lg font-bold leading-tight">
              {clase?.nombre_Materia || clase?.Nombre_Materia || 'Matrícula'}
            </h3>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              Prof: {nombreProfesor}
            </p>
            <p className="text-[11px] text-white/75 mt-0.5">
              Gestión de estudiantes ({codigoMateria})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">

          {/* Buscador de Inscribir */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Buscar estudiante para inscribir
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Escribe un nombre o apellido..."
                value={busquedaGlobal}
                onChange={(e) => {
                  setBusquedaGlobal(e.target.value);
                  setMostrarDropdown(true);
                }}
                onFocus={() => setMostrarDropdown(true)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C31C6] focus:bg-white transition-all"
              />
            </div>

            {/* Desplegable de resultados */}
            {mostrarDropdown && busquedaGlobal.trim().length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {alumnosSugeridos.length === 0 ? (
                  <div className="p-3 text-xs text-gray-400 text-center">
                    No se encontraron alumnos disponibles.
                  </div>
                ) : (
                  alumnosSugeridos.map((alumno) => {
                    const idAl = alumno.id_Alumno ?? alumno.Id_Alumno;
                    const nombreAl = alumno.nombre_Completo || alumno.Nombre_Completo;
                    return (
                      <div
                        key={idAl}
                        className="px-4 py-2.5 hover:bg-indigo-50/60 flex items-center justify-between text-sm border-b border-gray-50 last:border-none"
                      >
                        <div>
                          <p className="font-medium text-gray-700">{nombreAl}</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: {idAl}</p>
                        </div>
                        <button
                          onClick={() => handleInscribir(alumno)}
                          disabled={procesandoId === idAl}
                          className="flex items-center gap-1 px-3 py-1 bg-[#3C31C6] hover:bg-[#3228a8] text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          {procesandoId === idAl ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <UserPlus size={12} />
                          )}
                          Inscribir
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <hr className="border-gray-100 my-2" />

          {/* Lista de Alumnos Inscritos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Users size={14} className="text-[#3C31C6]" />
                Alumnos Inscritos
              </span>
              <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-[#3C31C6] rounded-full">
                {alumnosInscritos.length}
              </span>
            </div>

            {cargando ? (
              <div className="py-8 flex items-center justify-center text-gray-400 gap-2">
                <Loader2 size={20} className="animate-spin text-[#3C31C6]" />
                <span className="text-xs">Cargando lista...</span>
              </div>
            ) : alumnosInscritos.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-gray-400 text-xs gap-1 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <BookOpen size={20} className="text-gray-300" />
                <p>No hay alumnos inscritos en esta materia.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {alumnosInscritos.map((alumno) => {
                  const idAl = alumno.id_Alumno ?? alumno.Id_Alumno;
                  const nombreAl = alumno.nombre_Completo || alumno.Nombre_Completo;
                  return (
                    <div
                      key={idAl}
                      className="flex items-center justify-between p-3 bg-gray-50/70 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-[#3C31C6] font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {nombreAl?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {nombreAl}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            ID: {idAl}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDesinscribir(alumno)}
                        disabled={procesandoId === idAl}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 hover:border-red-200 rounded-lg text-xs font-medium transition-all shadow-sm disabled:opacity-50"
                      >
                        {procesandoId === idAl ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <UserMinus size={14} strokeWidth={2.5} />
                        )}
                        <span>Desinscribir</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Pie */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium text-xs rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}