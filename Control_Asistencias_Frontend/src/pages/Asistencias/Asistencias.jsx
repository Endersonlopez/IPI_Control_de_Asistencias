import { useState, useEffect, useContext } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Header from '../Dashboard/Header';
import AsistenciasFiltros from './AsistenciasFiltros';
import AsistenciasList from './AsistenciasList';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

export default function Asistencias() {
  const { user } = useContext(AuthContext);
  const rol = (user?.roles || '').toLowerCase();
  const esAdmin = rol.includes('admin');

  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [clases, setClases] = useState([]);
  const [filtrosActuales, setFiltrosActuales] = useState({
    buscar: '',
    fechaInicio: '',
    fechaFin: '',
    idClase: '',
    estadoAsistencia: ''
  });

  const normalizarRespuesta = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.$values && Array.isArray(data.$values)) return data.$values;
    return [];
  };

  // Carga inicial
  useEffect(() => {
    const cargarInicial = async () => {
      setCargando(true);
      try {
        const response = await api.get('/Asistencias/listar-filtrar');
        setAsistencias(normalizarRespuesta(response.data));
      } catch (error) {
        console.error('Error en carga inicial:', error);
        setAsistencias([]);
      } finally {
        setCargando(false);
      }
    };
    cargarInicial();
  }, []);

  // Cargar clases disponibles para el filtro
  useEffect(() => {
    const cargarClases = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const idUsuario = usuario?.id_Usuario;
        const url = esAdmin ? '/Materias/listar' : `/Clases/${idUsuario}`;
        const response = await api.get(url);
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setClases(data);
      } catch (error) {
        console.error('Error al cargar clases para filtro:', error);
      }
    };
    cargarClases();
  }, [esAdmin]);

  const manejarFiltrado = async (filtros) => {
    setFiltrosActuales(filtros);
    setCargando(true);
    try {
      const { buscar = '', fechaInicio = '', fechaFin = '', idClase = '', estadoAsistencia = '' } = filtros;
      const params = {};
      if (buscar && buscar.trim() !== '') params.buscar = buscar.trim();
      if (fechaInicio && fechaInicio !== '') params.fechaInicio = fechaInicio;
      if (fechaFin && fechaFin !== '') params.fechaFin = fechaFin;
      if (idClase && idClase !== '') params.idClase = idClase;
      if (estadoAsistencia && estadoAsistencia !== '') params.estadoAsistencia = estadoAsistencia;

      const response = await api.get('/Asistencias/listar-filtrar', { params });
      setAsistencias(normalizarRespuesta(response.data));
    } catch (error) {
      console.error('Error al aplicar filtros:', error?.response?.data || error.message);
      setAsistencias([]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden relative">
        <Header titulo="Asistencias" />
        <div className="flex-1 overflow-auto p-8 flex flex-col gap-6 relative">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Registro de Asistencias</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Consulta y filtra el registro de asistencias
            </p>
          </div>
          <AsistenciasFiltros onBuscar={manejarFiltrado} clasesDisponibles={clases} />
          <AsistenciasList
            asistencias={asistencias}
            cargando={cargando}
            filtros={filtrosActuales}
          />
        </div>
      </main>
    </div>
  );
}