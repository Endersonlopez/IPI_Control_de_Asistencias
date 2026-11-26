import { X, Mail, Phone } from 'lucide-react';

export default function AlumnoModal({ alumno, onClose }) {
  if (!alumno) return null;

  const iniciales = alumno.nombre_Completo
    ? alumno.nombre_Completo.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-[460px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Cabecera */}
        <div className="bg-[#3C31C6] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 font-bold text-sm tracking-wide text-white">
              {iniciales}
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">{alumno.nombre_Completo}</h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 text-indigo-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6">
          <h4 className="mb-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Información del Alumno
          </h4>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs mb-5">
            <div>
              <p className="text-gray-400 mb-0.5">Nombre completo</p>
              <p className="font-bold text-gray-800 text-sm">{alumno.nombre_Completo}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Documento</p>
              <p className="font-bold text-gray-800 text-sm">{alumno.documento_Identidad}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Carrera</p>
              <p className="font-bold text-gray-800 text-sm">{alumno.nombre_Grado}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Estado</p>
              <p className="font-bold text-gray-800 text-sm">{alumno.nombre_Estado}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Correo</p>
              <p className="font-bold text-gray-800 text-sm">
                {alumno.correo_Electronico || alumno.Correo_Electronico || alumno.correo || 'Sin correo registrado'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Teléfono</p>
              <p className="font-bold text-gray-800 text-sm">
                {alumno.telefono || alumno.Telefono || 'Sin teléfono'}
              </p>
            </div>
          </div>

          {/* Botón Cerrar */}
          <div className="flex justify-end mt-4">
            <button 
              onClick={onClose} 
              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}