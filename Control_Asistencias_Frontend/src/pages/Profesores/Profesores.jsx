import { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Header from '../Dashboard/Header';
import { 
  Search, 
  UserPlus, 
  Eye, 
  Edit2, 
  Trash2, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axiosConfig';
import ProfesorViewModal from './ProfesorViewModal';
import ProfesorEditarModal from './ProfesorEditarModal';
import ProfesorCrearModal from './ProfesorCrearModal';

export default function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroFacultad, setFiltroFacultad] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Paginación 10 registros por página
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Estados para los modales
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);

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

  const obtenerUsuarioLogueado = () => {
    try {
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        const parsed = JSON.parse(usuarioLocal);
        return parsed.id_Usuario || parsed.id || 1;
      }
    } catch {
      return 1;
    }
    return 1;
  };

  // Carga la lista de profesores desde la API
  const cargarProfesores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Profesores/listar');
      const data = response.data || [];
      const lista = Array.isArray(data) ? data : data.data || data.result || [];
      
      lista.sort((a, b) => a.id_Profesor - b.id_Profesor);
      
      setProfesores(lista);
    } catch (error) {
      console.error("Error al cargar profesores:", error);
      toast.error("Error al cargar la lista de profesores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProfesores();
  }, []);

  // Acciones de activación/desactivación
  const handleEliminar = (profesor) => {
    toast.error('¿Estás seguro de desactivar este profesor?', {
      description: `Profesor: ${profesor.nombre_Completo}`,
      action: {
        label: 'Aceptar',
        onClick: async () => {
          const idModificador = obtenerUsuarioLogueado();
          const token = obtenerToken();
          try {
            const response = await fetch(`http://localhost:5110/api/Profesores/eliminar/${profesor.id_Profesor}?idModificador=${idModificador}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              toast.success("Profesor desactivado correctamente");
              cargarProfesores();
            } else {
              toast.error("No se pudo desactivar el profesor.");
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

  const handleActivar = async (profesor) => {
    toast.success('¿Deseas reactivar este profesor?', {
      description: `Profesor: ${profesor.nombre_Completo}`,
      action: {
        label: 'Aceptar',
        onClick: async () => {
          const idModificador = obtenerUsuarioLogueado();
          const token = obtenerToken();
          try {
            const response = await fetch(`http://localhost:5110/api/Profesores/activar/${profesor.id_Profesor}?idModificador=${idModificador}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              toast.success("Profesor reactivado correctamente");
              cargarProfesores();
            } else {
              toast.error("No se pudo reactivar el profesor.");
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

  // Facultades únicas para el filtro
  const facultadesUnicas = [
    ...new Set(profesores.map((p) => p.facultad).filter(Boolean))
  ];

  // Filtrado local
  const profesoresMostrados = profesores.filter((prof) => {
    if (filtroFacultad && prof.facultad !== filtroFacultad) return false;
    
    if (filtroEstado) {
      const esActivo = prof.id_Estado === 1 || prof.nombre_Estado === 'Activo';
      if (filtroEstado === '1' && !esActivo) return false;
      if (filtroEstado === '2' && esActivo) return false;
    }

    if (terminoBusqueda) {
      const termino = terminoBusqueda.toLowerCase().trim();
      const codigoFormat = `PROF${String(prof.id_Profesor).padStart(4, '0')}`.toLowerCase();
      const coincide = 
        codigoFormat.includes(termino) ||
        prof.nombre_Completo?.toLowerCase().includes(termino) ||
        prof.facultad?.toLowerCase().includes(termino);
      if (!coincide) return false;
    }
    return true;
  });

  // Paginación
  const totalRegistros = profesoresMostrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const profesoresPaginados = profesoresMostrados.slice(indiceInicio, indiceInicio + registrosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setFiltroFacultad('');
    setFiltroEstado('');
    setPaginaActual(1);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden relative">
        <Header />
        <div className="flex-1 overflow-auto p-8 flex flex-col gap-6">
          
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Profesores</h2>
              <p className="text-sm text-gray-500 mt-0.5">Administra el registro de profesores del sistema</p>
            </div>
            <button 
              type="button"
              onClick={() => setModalCrearOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#3C31C6] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <UserPlus size={16} />
              Registrar Profesor
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por código, nombre o facultad..." 
                value={terminoBusqueda}
                onChange={(e) => {
                  setTerminoBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors" 
              />
            </div>
            
            <select 
              value={filtroFacultad}
              onChange={(e) => {
                setFiltroFacultad(e.target.value);
                setPaginaActual(1);
              }}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-600 md:w-[220px]"
            >
              <option value="">Todas las facultades</option>
              {facultadesUnicas.map((fac, i) => (
                <option key={i} value={fac}>{fac}</option>
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
                    <th className="px-6 py-3.5 font-semibold">Facultad</th>
                    <th className="px-6 py-3.5 font-semibold">Estado</th>
                    <th className="px-6 py-3.5 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-400">Cargando profesores...</td>
                    </tr>
                  ) : profesoresPaginados.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-400">No hay registros que coincidan con la búsqueda.</td>
                    </tr>
                  ) : (
                    profesoresPaginados.map((prof) => {
                      const esActivo = prof.nombre_Estado === 'Activo' || prof.id_Estado === 1;
                      const codigoFormat = `PROF${String(prof.id_Profesor).padStart(4, '0')}`;

                      return (
                        <tr key={prof.id_Profesor} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3.5">
                            <span className={`inline-block rounded-md text-white px-2.5 py-1 text-[11px] font-bold ${
                              esActivo ? 'bg-[#3C31C6]' : 'bg-red-500'
                            }`}>
                              {codigoFormat}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 font-medium text-gray-800">{prof.nombre_Completo}</td>
                          <td className="px-6 py-3.5 text-gray-600">{prof.facultad}</td>
                          <td className="px-6 py-3.5">
                            <span className={`font-semibold text-[11px] ${
                              esActivo
                                ? 'text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full' 
                                : 'text-red-500 bg-red-50 px-2.5 py-1 rounded-full'
                            }`}>
                              {esActivo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center justify-center gap-3">
                              <button 
                                type="button"
                                onClick={() => { setProfesorSeleccionado(prof); setModalVerOpen(true); }} 
                                className="text-[#3C31C6] hover:text-indigo-800 transition-colors" 
                                title="Ver detalle"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => { setProfesorSeleccionado(prof); setModalEditarOpen(true); }} 
                                className="text-amber-500 hover:text-amber-700 transition-colors" 
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                              {esActivo ? (
                                <button 
                                  type="button"
                                  onClick={() => handleEliminar(prof)} 
                                  className="text-red-500 hover:text-red-700 transition-colors" 
                                  title="Desactivar profesor"
                                >
                                  <Trash2 size={16} />
                                </button>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => handleActivar(prof)} 
                                  className="text-emerald-500 hover:text-emerald-700 transition-colors" 
                                  title="Reactivar profesor"
                                >
                                  <RotateCcw size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
        </div>

        {/* Modales */}
        {modalVerOpen && (
          <ProfesorViewModal 
            profesor={profesorSeleccionado} 
            onClose={() => setModalVerOpen(false)} 
          />
        )}

        {modalEditarOpen && (
          <ProfesorEditarModal 
            profesor={profesorSeleccionado} 
            onClose={() => setModalEditarOpen(false)} 
            onActualizado={() => {
              setModalEditarOpen(false);
              cargarProfesores();
            }}
          />
        )}

        {modalCrearOpen && (
          <ProfesorCrearModal 
            onClose={() => setModalCrearOpen(false)} 
            onCreado={() => {
              setModalCrearOpen(false);
              cargarProfesores();
            }}
          />
        )}
      </main>
    </div>
  );
}