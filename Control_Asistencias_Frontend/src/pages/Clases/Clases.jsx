import { useState, useEffect, useContext } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Header from '../Dashboard/Header';
import ClaseCard from './ClaseCard';
import AsistenciaQRModal from './AsistenciaQRModal';
import AlumnosDrawer from './AlumnosDrawer';
import GestionMatriculaModal from './GestionMatriculaModal';
import ClaseFormModal from './ClaseFormModal';

// Importación de iconos
import { Plus } from 'lucide-react'; 

import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

export default function Clases() {
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Modales y Paneles
  const [modalQROpen, setModalQROpen] = useState(false);
  const [drawerAlumnosOpen, setDrawerAlumnosOpen] = useState(false);
  const [modalAdminOpen, setModalAdminOpen] = useState(false);
  const [claseActiva, setClaseActiva] = useState(null);

  // Modal para crear/editar clase (solo administrador)
  const [modalClaseOpen, setModalClaseOpen] = useState(false);
  const [claseEditando, setClaseEditando] = useState(null);

  // Administrador: Datos necesarios para el formulario
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);

  const { user } = useContext(AuthContext);

  const esAdmin = Boolean(
    user?.roles?.toLowerCase().includes('admin') || 
    user?.roles?.toLowerCase().includes('administrador') ||
    user?.id_Rol === 1
  );

  const recargarClases = async () => {
    const idUsuario = user?.id_Usuario;
    if (!idUsuario) return;
    
    try {
      const response = await api.get(`/Clases/${idUsuario}`);
      setClases(response.data || []);
    } catch (error) {
      console.error('Error al recargar las clases:', error);
    }
  };

  const recargarMaterias = async () => {
  try {
    const response = await api.get('/Materias/listar');
    setMaterias(response.data || []);
  } catch (error) {
    console.error('Error al recargar materias:', error);
    toast.error('No se pudieron cargar las materias');
  }
};

  // Administrador: Carga de materias y profesores
  useEffect(() => {
    if (esAdmin) {
      const cargarDatos = async () => {
        try {
          const [respMaterias, respProfesores] = await Promise.all([
            api.get('/Materias/listar'),
            api.get('/Profesores/listar')
          ]);
          setMaterias(respMaterias.data || []);
          setProfesores(respProfesores.data || []);
        } catch (error) {
          console.error('Error al cargar materias/profesores:', error);
        }
      };
      cargarDatos();
    }
  }, [esAdmin]);

  useEffect(() => {
    const iniciar = async () => {
      if (!user?.id_Usuario) {
        console.warn("Esperando datos del usuario...");
        return;
      }
      setCargando(true);
      await recargarClases();
      setCargando(false);
    };
    iniciar();
  }, [user]);

  const handleAbrirQR = (clase) => {
    setClaseActiva(clase);
    setModalQROpen(true);
  };

  const handleIngresoManual = (clase) => {
    console.log("Abrir formulario manual para la clase:", clase.nombre_Materia);
  };

  const handleVerAlumnos = (clase) => {
    setClaseActiva(clase);
    if (esAdmin) {
      setModalAdminOpen(true);
    } else {
      setDrawerAlumnosOpen(true);
    }
  };

  // Manejadores del modal de creación/edición
  const handleAgregarClase = () => {
    setClaseEditando(null);  // modo creación
    setModalClaseOpen(true);
  };

  const handleEditarClase = (clase) => {
    setClaseEditando(clase);
    setModalClaseOpen(true);
  };

  const handleGuardarClase = () => {
    recargarClases();
    setModalClaseOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden relative">
        <Header titulo="Clases" />

        <div className={`flex-1 overflow-auto p-8 flex flex-col gap-6 relative transition-all duration-300 ease-in-out ${drawerAlumnosOpen ? 'pr-[430px]' : ''}`}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Clases Asignadas</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {esAdmin 
                  ? "Haz clic en una clase para gestionar su matrícula de estudiantes." 
                  : "Haz clic en una clase para ver sus alumnos inscritos o usa las acciones rápidas."
                }
              </p>
            </div>

            {/* Botón nueva clase para administradores */}
            {esAdmin && (
              <button 
                onClick={handleAgregarClase}
                className="flex items-center justify-center gap-2 bg-[#3C31C6] hover:bg-[#3228a8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm w-full md:w-auto"
              >
                <Plus size={18} strokeWidth={2.5} />
                Agregar nueva clase
              </button>
            )}
          </div>

          {cargando ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${drawerAlumnosOpen ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 mt-4 transition-all duration-300`}>
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : clases.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${drawerAlumnosOpen ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 mt-4 transition-all duration-300`}>
              {clases.map((clase) => (
                <div 
                  key={clase.id_Horario || clase.id_Materia}
                  onClick={() => handleVerAlumnos(clase)}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <ClaseCard 
                    clase={clase} 
                    esAdmin={esAdmin}
                    onProyectarQR={(e) => {
                      e.stopPropagation();
                      handleAbrirQR(clase);
                    }}
                    onIngresoManual={(e) => {
                      e.stopPropagation();
                      handleIngresoManual(clase);
                    }}
                    onEditar={handleEditarClase}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
              <p className="text-gray-500 font-medium">No tienes clases asignadas actualmente.</p>
            </div>
          )}

        </div>
      </main>

      {/* Modal QR */}
      {modalQROpen && (
        <AsistenciaQRModal 
          claseInfo={claseActiva} 
          onClose={() => {
            setModalQROpen(false);
            setClaseActiva(null);
          }} 
        />
      )}

      {/* Profesor: Drawer de alumnos */}
      <AlumnosDrawer 
        isOpen={drawerAlumnosOpen}
        onClose={() => {
          setDrawerAlumnosOpen(false);
          setClaseActiva(null);
        }}
        clase={claseActiva}
      />

      {/* Administrador: Gestión de matrícula */}
      <GestionMatriculaModal 
        isOpen={modalAdminOpen}
        onClose={() => {
          setModalAdminOpen(false);
          setClaseActiva(null);
        }}
        clase={claseActiva}
        onActualizar={recargarClases} 
      />

      {/* Modal de creación/edición de clase */}
      {modalClaseOpen && (
        <ClaseFormModal
          isOpen={modalClaseOpen}
          onClose={() => setModalClaseOpen(false)}
          onGuardado={handleGuardarClase}
          clase={claseEditando}
          materias={materias}
          profesores={profesores}
          onMateriaCreada={recargarMaterias}
        />
      )}

    </div>
  );
}