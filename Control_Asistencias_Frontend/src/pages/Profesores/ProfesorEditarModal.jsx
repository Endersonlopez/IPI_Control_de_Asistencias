import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfesorEditarModal({ profesor, onClose, onActualizado }) {
  const [formData, setFormData] = useState({
    primer_Nombre: profesor?.primer_Nombre || '',
    segundo_Nombre: profesor?.segundo_Nombre || '',
    primer_Apellido: profesor?.primer_Apellido || '',
    segundo_Apellido: profesor?.segundo_Apellido || '',
    nombre_Usuario: profesor?.nombre_Usuario || '',
    correo_Electronico: profesor?.correo_Electronico || '',
    telefono: profesor?.telefono || '',
    facultad: profesor?.facultad || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTelefonoChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4);
    setFormData({ ...formData, telefono: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id_Profesor: profesor.id_Profesor,
      id_Usuario: profesor.id_Usuario,
      primer_Nombre: formData.primer_Nombre,
      segundo_Nombre: formData.segundo_Nombre || null,
      primer_Apellido: formData.primer_Apellido,
      segundo_Apellido: formData.segundo_Apellido || null,
      nombre_Usuario: formData.nombre_Usuario,
      correo_Electronico: formData.correo_Electronico,
      telefono: formData.telefono.replace('-', ''),
      facultad: formData.facultad,
      id_Modificador: obtenerUsuarioLogueado()
    };

    try {
      const response = await fetch('http://localhost:5110/api/Profesores/actualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Profesor actualizado con éxito.");
        onActualizado();
        onClose();
      } else {
        const errorData = await response.text();
        const mensajeError = errorData || "Error al actualizar el profesor.";
        setError(mensajeError);
        toast.error(mensajeError);
      }
    } catch (err) {
      console.error("Error en la petición de actualización:", err);
      const mensajeError = "Error de conexión con el servidor.";
      setError(mensajeError);
      toast.error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // Iniciales para el encabezado
  const iniciales = profesor?.nombre_Completo
    ? profesor.nombre_Completo.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PR';
  const codigoUnico = `PROF${String(profesor?.id_Profesor).padStart(4, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Encabezado azul */}
        <div className="bg-[#3C31C6] px-6 py-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 font-bold text-sm tracking-wide text-white">
              {iniciales}
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">{profesor?.nombre_Completo}</h3>
              <p className="text-xs text-indigo-200 font-light mt-0.5">{codigoUnico}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-indigo-200 hover:bg-white/10 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Contenido scrolleable */}
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
                  <input required type="text" name="primer_Nombre" value={formData.primer_Nombre} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Segundo nombre</label>
                  <input type="text" name="segundo_Nombre" value={formData.segundo_Nombre} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Primer apellido <span className="text-red-500">*</span></label>
                  <input required type="text" name="primer_Apellido" value={formData.primer_Apellido} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Segundo apellido</label>
                  <input type="text" name="segundo_Apellido" value={formData.segundo_Apellido} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Cuenta de Usuario */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cuenta de Usuario</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Nombre de usuario <span className="text-red-500">*</span></label>
                  <input required type="text" name="nombre_Usuario" value={formData.nombre_Usuario} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Correo electrónico <span className="text-red-500">*</span></label>
                  <input required type="email" name="correo_Electronico" value={formData.correo_Electronico} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleTelefonoChange} maxLength={9} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Datos Académicos */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Datos Académicos</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Facultad <span className="text-red-500">*</span></label>
                  <input required type="text" name="facultad" value={formData.facultad} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none" />
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
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}