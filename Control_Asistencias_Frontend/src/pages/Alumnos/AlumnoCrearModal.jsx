import { useState, useEffect, useCallback } from 'react';
import { X, Save, UserPlus, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AlumnoCrearModal({ onClose, onCreado }) {
  const [formData, setFormData] = useState({
    primer_Nombre: '',
    segundo_Nombre: '',
    primer_Apellido: '',
    segundo_Apellido: '',
    nombre_Usuario: '',
    correo_Electronico: '',
    telefono: '',
    contrasena: '',
    id_Grado: '',
    documento_Identidad: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mostrarCrearCarrera, setMostrarCrearCarrera] = useState(false);
  const [nombreNuevaCarrera, setNombreNuevaCarrera] = useState('');
  const [creandoCarrera, setCreandoCarrera] = useState(false);
  const [carreras, setCarreras] = useState([]);

  const obtenerToken = () => localStorage.getItem('token') || '';
  
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

  // Cargar carreras desde la API
  const cargarCarreras = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    cargarCarreras();
  }, [cargarCarreras]);

  const handleTelefonoChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4);
    setFormData({ ...formData, telefono: value });
  };

  const handleDocumentoChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    if (value.length > 3) value = value.slice(0, 3) + '-' + value.slice(3);
    if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10);
    setFormData({ ...formData, documento_Identidad: value });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para crear nueva carrera
  const handleCrearCarrera = async () => {
    if (!nombreNuevaCarrera.trim()) {
      toast.error('Ingresa un nombre para la carrera');
      return;
    }
    setCreandoCarrera(true);
    try {
      const response = await fetch('http://localhost:5110/api/Grados/insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify({
          nombre_Grado: nombreNuevaCarrera.trim(),
          id_Sede: 1,
          id_Estado: 1,
          id_Creador: obtenerUsuarioLogueado()
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Carrera creada correctamente');
        // Actualizar la lista de carreras
        await cargarCarreras();
        // Obtener el id de la respuesta
        const nuevoId = data.id || data.Id_Grado || (data.data && data.data.id);
        if (nuevoId) {
          setFormData(prev => ({ ...prev, id_Grado: nuevoId }));
        }
        setMostrarCrearCarrera(false);
        setNombreNuevaCarrera('');
      } else {
        const mensajeError = data.message || data.title || 'Error al crear la carrera';
        toast.error(mensajeError);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión al crear la carrera');
    } finally {
      setCreandoCarrera(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      primer_Nombre: formData.primer_Nombre,
      segundo_Nombre: formData.segundo_Nombre || null,
      primer_Apellido: formData.primer_Apellido,
      segundo_Apellido: formData.segundo_Apellido || null,
      nombre_Usuario: formData.nombre_Usuario,
      correo_Electronico: formData.correo_Electronico,
      telefono: formData.telefono.replace('-', ''),
      contrasena: formData.contrasena,
      id_Rol: 3,
      id_Grado: Number(formData.id_Grado),
      documento_Identidad: formData.documento_Identidad.replace(/-/g, ''),
      id_Creador: obtenerUsuarioLogueado()
    };

    try {
      const response = await fetch('http://localhost:5110/api/Alumnos/registro_integral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Alumno registrado exitosamente.");
        onCreado();
        onClose();
      } else {
        const mensajeError = data.message || "Error al registrar el alumno.";
        setError(mensajeError);
        toast.error(mensajeError);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      const mensajeError = "Error de conexión con el servidor.";
      setError(mensajeError);
      toast.error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className="bg-[#3C31C6] px-6 py-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Registrar Nuevo Alumno</h3>
              <p className="text-xs text-indigo-200 font-light mt-0.5">Creación del perfil alumno.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-indigo-200 hover:bg-white/10 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" autoComplete="off">
            
            {/* Datos Personales */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Datos Personales</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Primer nombre <span className="text-red-500">*</span></label>
                  <input required type="text" name="primer_Nombre" value={formData.primer_Nombre} onChange={handleChange} autoComplete="off" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Segundo nombre</label>
                  <input type="text" name="segundo_Nombre" value={formData.segundo_Nombre} onChange={handleChange} autoComplete="off" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Primer apellido <span className="text-red-500">*</span></label>
                  <input required type="text" name="primer_Apellido" value={formData.primer_Apellido} onChange={handleChange} autoComplete="off" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Segundo apellido</label>
                  <input type="text" name="segundo_Apellido" value={formData.segundo_Apellido} onChange={handleChange} autoComplete="off" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Cuenta de Usuario */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cuenta de Usuario</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Nombre de usuario <span className="text-red-500">*</span></label>
                  <input required type="text" name="nombre_Usuario" value={formData.nombre_Usuario} onChange={handleChange} autoComplete="off" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Contraseña <span className="text-red-500">*</span></label>
                  <input required type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} autoComplete="new-password" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Correo electrónico <span className="text-red-500">*</span></label>
                  <input required type="email" name="correo_Electronico" value={formData.correo_Electronico} onChange={handleChange} autoComplete="off" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleTelefonoChange} maxLength={9} autoComplete="off" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Datos Académicos */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Datos Académicos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Documento de identidad <span className="text-red-500">*</span></label>
                  <input required type="text" name="documento_Identidad" value={formData.documento_Identidad} onChange={handleDocumentoChange} maxLength={16} autoComplete="off" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Carrera <span className="text-red-500">*</span></label>
                  <select required name="id_Grado" value={formData.id_Grado} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none">
                    <option value="">Seleccione una carrera...</option>
                    {carreras.map(c => (
                      <option key={c.id_Grado} value={c.id_Grado}>{c.nombre_Grado}</option>
                    ))}
                  </select>
                  {/* Botón nueva carrera */}
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMostrarCrearCarrera(!mostrarCrearCarrera)}
                      className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-[#3C31C6] rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      <PlusCircle size={16} />
                      Nueva
                    </button>
                  </div>
                  {mostrarCrearCarrera && (
                    <div className="mt-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de la carrera</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={nombreNuevaCarrera}
                          onChange={(e) => setNombreNuevaCarrera(e.target.value)}
                          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-600"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleCrearCarrera}
                          disabled={creandoCarrera || !nombreNuevaCarrera.trim()}
                          className="px-4 py-2 bg-[#3C31C6] text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                          {creandoCarrera ? 'Creando...' : 'Crear'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-2 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
              <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#3C31C6] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-70">
                <Save size={18} />
                {loading ? 'Guardando...' : 'Guardar alumno'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}