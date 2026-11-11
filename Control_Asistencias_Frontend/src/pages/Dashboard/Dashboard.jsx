import { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Users, ClipboardCheck, Calendar, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const rol = (user?.roles || '').toLowerCase();
  const esProfesor = rol.includes('profesor');

  const [alumnos, setAlumnos] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        if (esProfesor) {
          // Carga para el profesor
          const respuesta = await api.get('/Dashboard/profesor');
          const datos = respuesta.data;
          setAlumnos(datos.alumnos || []);
          setAsistencias(datos.asistencias || []);
        } else {
          // Carga para el administrador
          const [resAlumnos, resAsistencias] = await Promise.all([
            api.get('/Alumnos/listar'),
            api.get('/Asistencias/listar')
          ]);
          setAlumnos(resAlumnos.data || []);
          setAsistencias(resAsistencias.data || []);
        }
      } catch (error) {
        console.error("Error al cargar datos del Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosDashboard();
  }, [esProfesor]);

  // Cálculos dinámicos
  const totalAlumnos = alumnos.length;
  const totalAsistencias = asistencias.length;

  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  const alumnosEsteMes = alumnos.filter(alumno => {
    if (!alumno.fecha_Creacion) return false;
    const f = new Date(alumno.fecha_Creacion);
    return f.getMonth() === mesActual && f.getFullYear() === anioActual;
  }).length;

  const offset = hoy.getTimezoneOffset() * 60000;
  const fechaHoyISO = new Date(hoy.getTime() - offset).toISOString().split('T')[0];

  const asistenciasHoy = asistencias.filter(asistencia => {
    if (!asistencia.fecha) return false;
    return asistencia.fecha.startsWith(fechaHoyISO);
  }).length;

  const porcentajeHoy = totalAlumnos > 0
    ? Math.round((asistenciasHoy / totalAlumnos) * 100)
    : 0;

  // Ranking de Alumnos con más asistencias
  const conteoPorAlumno = {};
  asistencias.forEach(item => {
    const nombre = item.nombre_Alumno || 'Alumno';
    conteoPorAlumno[nombre] = (conteoPorAlumno[nombre] || 0) + 1;
  });

  const topAlumnos = Object.entries(conteoPorAlumno)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Datos para el gráfico de asistencias por fecha
  const agrupadoPorFecha = [...asistencias].reverse().reduce((acc, item) => {
    if (!item.fecha) return acc;
    const f = new Date(item.fecha);
    const etiquetaFecha = f.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    acc[etiquetaFecha] = (acc[etiquetaFecha] || 0) + 1;
    return acc;
  }, {});

  const dataGrafico = Object.entries(agrupadoPorFecha).map(([fecha, total]) => ({
    fecha,
    total
  }));

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden relative">
        <Header />

        <div className="flex-1 overflow-auto p-8">
          {/* Títulos corregidos */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Control de Asistencias Universitario</h2>
            <p className="text-sm text-gray-500 mt-1">Resumen de asistencias</p>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Total Alumnos</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : totalAlumnos}</p>
                <p className="text-xs text-gray-500">{loading ? '...' : `${alumnosEsteMes} este mes`}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                <ClipboardCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Total Asistencias</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : totalAsistencias}</p>
                <p className="text-xs text-gray-500">Histórico total</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Asistencias Hoy</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : asistenciasHoy}</p>
                <p className="text-xs text-gray-500">Registradas hoy</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Porcentaje Hoy</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : `${porcentajeHoy}%`}</p>
                <p className="text-xs font-medium text-emerald-500">{loading ? '...' : `${porcentajeHoy}%`}</p>
              </div>
            </div>
          </div>

          {/* Gráficos y Lista de top alumnos */}
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm min-h-[350px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Gráfico de asistencias</h3>
                </div>
              </div>

              <div className="h-64 w-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    Cargando gráfica...
                  </div>
                ) : dataGrafico.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAsistencias" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="fecha" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                        allowDecimals={false} 
                      />
                      <Tooltip
                        cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          borderRadius: '12px', 
                          border: '1px solid #F3F4F6', 
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          padding: '8px 12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        name="Asistencias" 
                        stroke="#4F46E5" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorAsistencias)" 
                        dot={{ r: 4, fill: '#4F46E5', stroke: '#FFFFFF', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#3C31C6' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs border border-dashed border-gray-200 rounded-lg">
                    No hay asistencias registradas para graficar
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full lg:w-[30%] rounded-xl border border-gray-100 bg-white p-6 shadow-sm min-h-[350px]">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Top alumnos</h3>

              {loading ? (
                <p className="text-xs text-gray-400">Cargando lista...</p>
              ) : topAlumnos.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {topAlumnos.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{item.nombre}</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        {item.total} {item.total === 1 ? 'asistencia' : 'asistencias'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No hay asistencias registradas aún.</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}