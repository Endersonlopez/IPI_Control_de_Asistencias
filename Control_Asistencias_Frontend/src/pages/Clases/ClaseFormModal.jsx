import { useState, useEffect } from 'react';
import { X, Save, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const DIAS_SEMANA = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' }
];

export default function ClaseFormModal({ 
  isOpen, onClose, onGuardado, clase, materias, profesores, onMateriaCreada 
}) {
  const [formData, setFormData] = useState({
    id_Materia: '',
    id_Profesor: '',
    dia_Semana: 1,
    hora_Inicio: '08:00',
    hora_Fin: '10:00',
    id_Estado: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mostrarCrearMateria, setMostrarCrearMateria] = useState(false);
  const [nombreNuevaMateria, setNombreNuevaMateria] = useState('');
  const [creandoMateria, setCreandoMateria] = useState(false);

  const modoEdicion = Boolean(clase);
  const esActiva = Number(formData.id_Estado) === 1;

  useEffect(() => {
    if (clase) {
      setFormData({
        id_Materia: clase.id_Materia || '',
        id_Profesor: clase.id_Profesor || '',
        dia_Semana: clase.dia_Semana || 1,
        hora_Inicio: clase.hora_Inicio?.substring(0, 5) || '08:00',
        hora_Fin: clase.hora_Fin?.substring(0, 5) || '10:00',
        id_Estado: Number(clase.estado_Horario) || 1
      });
    } else {
      setFormData({ id_Materia: '', id_Profesor: '', dia_Semana: 1, hora_Inicio: '08:00', hora_Fin: '10:00', id_Estado: 1 });
    }
    setError(null);
    setMostrarCrearMateria(false);
    setNombreNuevaMateria('');
  }, [clase, isOpen]);

  if (!isOpen) return null;

  const obtenerToken = () => localStorage.getItem('token') || '';
  const obtenerUsuarioLogueado = () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      return usuario.id_Usuario || usuario.id || 1;
    } catch { return 1; }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id_Materia: Number(formData.id_Materia),
      id_Profesor: Number(formData.id_Profesor),
      dia_Semana: Number(formData.dia_Semana),
      hora_Inicio: formData.hora_Inicio,
      hora_Fin: formData.hora_Fin,
      id_Estado: Number(formData.id_Estado)
    };

    if (modoEdicion) {
      payload.id_Horario = clase.id_Horario;
      payload.id_Modificador = obtenerUsuarioLogueado();
    } else {
      payload.id_Creador = obtenerUsuarioLogueado();
    }

    const url = modoEdicion
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:5110/api'}/Horarios/actualizar`
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5110/api'}/Horarios/insertar`;
    const method = modoEdicion ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(modoEdicion ? 'Clase actualizada correctamente.' : 'Clase creada exitosamente.');
        onGuardado();
        onClose();
      } else {
        const data = await response.json().catch(() => ({}));
        const mensaje = data.message || 'Error al guardar la clase.';
        setError(mensaje);
        toast.error(mensaje);
      }
    } catch (err) {
      console.error(err);
      const mensaje = 'Error de conexión con el servidor.';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearMateria = async () => {
    if (!nombreNuevaMateria.trim()) {
      toast.error('Ingresa un nombre para la materia');
      return;
    }
    setCreandoMateria(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5110/api'}/Materias/insertar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify({
          nombre_Materia: nombreNuevaMateria.trim(),
          id_Creador: obtenerUsuarioLogueado()
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Materia ${data.codigo_Materia} creada`);
        if (onMateriaCreada) await onMateriaCreada();
        setFormData(prev => ({ ...prev, id_Materia: data.id_Materia }));
        setMostrarCrearMateria(false);
        setNombreNuevaMateria('');
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.message || 'Error al crear la materia');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión al crear la materia');
    } finally {
      setCreandoMateria(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden ${!esActiva && modoEdicion ? 'grayscale opacity-80' : ''}`}>
        
        <div className="bg-[#3C31C6] px-6 py-4 text-white flex items-center justify-between">
          <h3 className="text-base font-bold">{modoEdicion ? 'Editar Clase' : 'Nueva Clase'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Materia */}
            <div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Materia *</label>
                  <select required name="id_Materia" value={formData.id_Materia} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none">
                    <option value="">Seleccione una materia</option>
                    {materias.map(m => (
                      <option key={m.id_Materia} value={m.id_Materia}>{m.codigo_Materia} - {m.nombre_Materia}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => setMostrarCrearMateria(!mostrarCrearMateria)} className="shrink-0 mb-0.5 flex items-center gap-1 px-3 py-2.5 bg-indigo-50 text-[#3C31C6] rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors">
                  <PlusCircle size={16} /> Nueva
                </button>
              </div>
              {mostrarCrearMateria && (
                <div className="mt-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de la materia</label>
                  <div className="flex gap-2">
                    <input type="text" value={nombreNuevaMateria} onChange={(e) => setNombreNuevaMateria(e.target.value)} className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-600" autoFocus />
                    <button type="button" onClick={handleCrearMateria} disabled={creandoMateria || !nombreNuevaMateria.trim()} className="px-4 py-2 bg-[#3C31C6] text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                      {creandoMateria ? 'Creando...' : 'Crear'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profesor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profesor *</label>
              <select required name="id_Profesor" value={formData.id_Profesor} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none">
                <option value="">Seleccione un profesor</option>
                {profesores.filter(p => p.id_Estado === 1).map(p => (
                  <option key={p.id_Profesor} value={p.id_Profesor}>{p.nombre_Completo}</option>
                ))}
              </select>
            </div>

            {/* Día */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Día de la semana</label>
              <select name="dia_Semana" value={formData.dia_Semana} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none">
                {DIAS_SEMANA.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            </div>

            {/* Horas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio *</label>
                <input type="time" required name="hora_Inicio" value={formData.hora_Inicio} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin *</label>
                <input type="time" required name="hora_Fin" value={formData.hora_Fin} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
              </div>
            </div>

            {/* Estado */}
            {modoEdicion && (
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select name="id_Estado" value={formData.id_Estado} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none">
                  <option value={1}>Activo</option>
                  <option value={2}>Inactivo</option>
                </select>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-[#3C31C6] text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-70">
                <Save size={18} />
                {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Clase')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}