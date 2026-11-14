import { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';

export default function ProfesorModal({ profesor, onClose }) {
  const [cargando, setCargando] = useState(false);
  const isEditing = !!profesor;
  const token = localStorage.getItem('token');

  // Estado del formulario
  const [formData, setFormData] = useState({
    primer_Nombre: '',
    segundo_Nombre: '',
    primer_Apellido: '',
    segundo_Apellido: '',
    nombre_Usuario: '',
    correo_Electronico: '',
    telefono: '',
    especialidad: '',
    departamento: '',
    facultad: '',
    id_Estado: 1 // 1: Activo por defecto según tu catálogo
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        ...profesor
      });
    }
  }, [profesor, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const url = isEditing 
        ? `http://localhost:5110/api/Profesores/actualizar` 
        : `http://localhost:5110/api/Profesores/insertar`;
        
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onClose(true); // true indica que debe recargar la lista
      } else {
        const err = await response.json();
        alert(`Error al guardar: ${err.message || 'Verifica los datos'}`);
      }
    } catch (error) {
      console.error("Error en petición:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}
          </h2>
          <button 
            onClick={() => onClose(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Datos Personales */}
            <div className="col-span-full">
              <h3 className="text-xs font-bold text-[#3C31C6] uppercase tracking-wider mb-3">Datos Personales</h3>
              <div className="h-px bg-gray-100 w-full mb-1"></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Primer Nombre *</label>
              <input required name="primer_Nombre" value={formData.primer_Nombre} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-[#3C31C6] focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Primer Apellido *</label>
              <input required name="primer_Apellido" value={formData.primer_Apellido} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-[#3C31C6] focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico *</label>
              <input required type="email" name="correo_Electronico" value={formData.correo_Electronico} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-[#3C31C6] focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
              <input required name="telefono" value={formData.telefono} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-[#3C31C6] focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de Usuario *</label>
              <input required name="nombre_Usuario" value={formData.nombre_Usuario} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-[#3C31C6] focus:bg-white focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed" disabled={isEditing} />
            </div>

            {/* Datos Académicos */}
            <div className="col-span-full mt-2">
              <h3 className="text-xs font-bold text-[#3C31C6] uppercase tracking-wider mb-3">Datos Académicos</h3>
              <div className="h-px bg-gray-100 w-full mb-1"></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Especialidad *</label>
              <input required name="especialidad" value={formData.especialidad} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-[#3C31C6] focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Departamento *</label>
              <input required name="departamento" value={formData.departamento} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-[#3C31C6] focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Facultad *</label>
              <input required name="facultad" value={formData.facultad} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-[#3C31C6] focus:bg-white focus:outline-none transition-colors" />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => onClose(false)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={cargando}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3C31C6] text-white text-sm font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-70 w-full sm:w-auto"
            >
              {cargando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Guardar Profesor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}