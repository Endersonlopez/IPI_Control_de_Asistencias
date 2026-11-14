import { useState, useEffect } from 'react';
import { Search, UserPlus, Eye, Edit2, Trash2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import AlumnoModal from './AlumnoModal';
import AlumnoEditarModal from './AlumnoEditarModal';
import AlumnoCrearModal from './AlumnoCrearModal';

export default function AlumnosList() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  
  // Estados para los filtros principales
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroGrado, setFiltroGrado] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [carreras, setCarreras] = useState([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Modales
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  // Obtiene Token
  const obtenerToken = () => {
    const token = localStorage.getItem('token');
    if (token) return token;
    try {
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        const parsed = JSON.parse(usuarioLocal);
        return parsed.token || '';
      }
    } catch {
      return '';
    }
    return '';
  };

  // Cargar carreras al montar
  useEffect(() => {
    const cargarCarreras = async () => {
      try {
        const response = await fetch('http://localhost:5110/api/Grados/listar', {
          headers: { 'Authorization': `Bearer ${obtenerToken()}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCarreras(data || []);
        }
      } catch (err) {
        console.error('Error al cargar carreras:', err);
      }
    };
    cargarCarreras();
  }, []);

  const procesarDatosAlumnos = (data) => {
    if (Array.isArray(data)) {
      setAlumnos(data);
    } else if (data && data.data && Array.isArray(data.data)) {
      setAlumnos(data.data);
    } else if (data && data.result && Array.isArray(data.result)) {
      setAlumnos(data.result);
    } else if (data && data.value && Array.isArray(data.value)) { 
      setAlumnos(data.value);
    } else {
      console.warn("Formato de datos no reconocido.");
      setAlumnos([]);
    }
  };

  // Carga lista completa
  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      const token = obtenerToken();

      const response = await fetch('http://localhost:5110/api/Alumnos/listar', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        procesarDatosAlumnos(data);
      } else {
        if (response.status === 401) {
          alert("Tu sesión ha expirado o no tienes permisos.");
        }
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const handleEliminar = (alumno) => {
    toast.error('¿Estás seguro de desactivar este alumno?', {
      description: `Alumno: ${alumno.nombre_Completo}`,
      action: {
        label: 'Aceptar',
        onClick: async () => {
          const idModificador = obtenerUsuarioLogueado();
          const token = obtenerToken();

          try {
            const response = await fetch(`http://localhost:5110/api/Alumnos/eliminar/${alumno.id_Alumno}?idModificador=${idModificador}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              toast.success("Alumno desactivado correctamente");
              cargarAlumnos(); 
            } else {
              toast.error("No se pudo desactivar el alumno.");
            }
          } catch (error) {
            console.error("Error en la petición de eliminación:", error);
            toast.error("Error de conexión al desactivar.");
          }
        }
      },
      cancel: { label: 'Cancelar' }
    });
  };

  const handleActivar = (alumno) => {
    toast.success('¿Deseas reactivar este alumno?', {
      description: `Alumno: ${alumno.nombre_Completo}`,
      action: {
        label: 'Aceptar',
        onClick: async () => {
          const idModificador = obtenerUsuarioLogueado();
          const token = obtenerToken();

          try {
            const response = await fetch(`http://localhost:5110/api/Alumnos/activar/${alumno.id_Alumno}?idModificador=${idModificador}`, {
              method: 'PUT', 
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              toast.success("Alumno reactivado correctamente");
              cargarAlumnos(); 
            } else {
              toast.error("No se pudo reactivar el alumno.");
            }
          } catch (error) {
            console.error("Error en la petición de reactivación:", error);
            toast.error("Error de conexión al reactivar.");
          }
        }
      },
      cancel: { label: 'Cancelar' }
    });
  };

  const obtenerUsuarioLogueado = () => {
    try {
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        const parsed = JSON.parse(usuarioLocal);
        return parsed.id_Usuario || parsed.id || 1;
      }
    } catch {
      // fallback
    }
    return 1; 
  };

  // Filtrado automático
  const alumnosMostrados = alumnos.filter(alumno => {
    if (filtroGrado && alumno.id_Grado !== Number(filtroGrado)) return false;
    if (filtroEstado && alumno.id_Estado !== Number(filtroEstado)) return false;

    if (terminoBusqueda) {
      const terminoPrincipal = terminoBusqueda.toLowerCase();
      const matchPrincipal = (
        alumno.nombre_Completo?.toLowerCase().includes(terminoPrincipal) ||
        alumno.documento_Identidad?.toLowerCase().includes(terminoPrincipal) ||
        `UNIV${String(alumno.id_Alumno).padStart(4, '0')}`.toLowerCase().includes(terminoPrincipal) ||
        alumno.nombre_Grado?.toLowerCase().includes(terminoPrincipal)
      );
      if (!matchPrincipal) return false;
    }
    return true; 
  });

  // Paginación
  const totalRegistros = alumnosMostrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const alumnosPaginados = alumnosMostrados.slice(indiceInicio, indiceInicio + registrosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setFiltroGrado('');
    setFiltroEstado('');
    setPaginaActual(1);
  };

  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0 overflow-hidden">
      
      {/* Cabecera de Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Alumnos</h2>
          <p className="text-sm text-gray-500 mt-0.5">Administra el registro de alumnos del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setModalCrearOpen(true)} 
            className="flex items-center gap-2 rounded-xl bg-[#3C31C6] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <UserPlus size={16} />
            Registrar Alumno
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por código, nombre o carrera..." 
            value={terminoBusqueda}
            onChange={(e) => {
              setTerminoBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors" 
          />
        </div>
        
        <select 
          value={filtroGrado}
          onChange={(e) => {
            setFiltroGrado(e.target.value);
            setPaginaActual(1);
          }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-600 md:w-[220px]"
        >
          <option value="">Todas las carreras</option>
          {carreras.map(carrera => (
            <option key={carrera.id_Grado} value={carrera.id_Grado}>
              {carrera.nombre_Grado}
            </option>
          ))}
        </select>

        <select 
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value);
            setPaginaActual(1);
          }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-600 md:w-[130px]"
        >
          <option value="">Todos</option>
          <option value="1">Activo</option>
          <option value="2">Inactivo</option>
        </select>

        {/* Botón Limpiar filtros */}
        <button 
          onClick={limpiarFiltros}
          className="flex items-center justify-center gap-2 bg-[#3C31C6] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw size={16} />
          Limpiar filtros
        </button>
      </div>

      {/* Tabla */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
          <p className="text-xs text-gray-500">
            Mostrando <span className="font-bold text-gray-800">{totalRegistros}</span> registros
          </p>
        </div>

        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#3C31C6] text-white sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Código</th>
                <th className="px-6 py-3.5 font-semibold">Nombres Completos</th>
                <th className="px-6 py-3.5 font-semibold">Carrera</th>
                <th className="px-6 py-3.5 font-semibold">Estado</th>
                <th className="px-6 py-3.5 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">Cargando alumnos...</td>
                </tr>
              ) : alumnosPaginados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">No hay registros que coincidan con la búsqueda.</td>
                </tr>
              ) : (
                alumnosPaginados.map((alumno) => (
                  <tr key={alumno.id_Alumno} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className={`inline-block rounded-md text-white px-2.5 py-1 text-[11px] font-bold ${
                        alumno.nombre_Estado === 'Activo' || alumno.id_Estado === 1 
                          ? 'bg-[#3C31C6]' 
                          : 'bg-red-500'
                      }`}>
                        UNIV{String(alumno.id_Alumno).padStart(4, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-gray-800">{alumno.nombre_Completo}</td>
                    <td className="px-6 py-3.5 text-gray-600">{alumno.nombre_Grado}</td>
                    <td className="px-6 py-3.5">
                      <span className={`font-semibold text-[11px] ${
                        alumno.nombre_Estado === 'Activo' || alumno.id_Estado === 1
                          ? 'text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full' 
                          : 'text-red-500 bg-red-50 px-2.5 py-1 rounded-full'
                      }`}>
                        {alumno.nombre_Estado || (alumno.id_Estado === 1 ? 'Activo' : 'Inactivo')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => { setAlumnoSeleccionado(alumno); setModalVerOpen(true); }} 
                          className="text-[#3C31C6] hover:text-indigo-800 transition-colors" 
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => { setAlumnoSeleccionado(alumno); setModalEditarOpen(true); }} 
                          className="text-amber-500 hover:text-amber-700 transition-colors" 
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        {(alumno.nombre_Estado === 'Activo' || alumno.id_Estado === 1) ? (
                          <button 
                            onClick={() => handleEliminar(alumno)} 
                            className="text-red-500 hover:text-red-700 transition-colors" 
                            title="Desactivar alumno"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleActivar(alumno)} 
                            className="text-emerald-500 hover:text-emerald-700 transition-colors" 
                            title="Reactivar alumno"
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!loading && totalRegistros > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <p className="text-xs text-gray-500">
              Página <span className="font-semibold text-gray-800">{paginaActual}</span> de <span className="font-semibold text-gray-800">{totalPaginas}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="flex items-center justify-center p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs font-semibold px-2 text-gray-700">
                {paginaActual} / {totalPaginas}
              </span>

              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="flex items-center justify-center p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalVerOpen && (
        <AlumnoModal 
          alumno={alumnoSeleccionado} 
          onClose={() => setModalVerOpen(false)} 
        />
      )}

      {modalEditarOpen && (
        <AlumnoEditarModal 
          alumno={alumnoSeleccionado} 
          onClose={() => setModalEditarOpen(false)} 
          onActualizado={() => {
            setModalEditarOpen(false);
            cargarAlumnos();
          }}
        />
      )}

      {modalCrearOpen && (
        <AlumnoCrearModal 
          onClose={() => setModalCrearOpen(false)} 
          onCreado={() => {
            setModalCrearOpen(false);
            cargarAlumnos();
          }}
        />
      )}
    </div>
  );
}