import { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axiosConfig';

export default function ConfigSeguridad() {
  const [actualPassword, setActualPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const validarNuevaContrasena = (password) => {
    const tieneLongitud = password.length >= 8;
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!tieneLongitud) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!tieneMinuscula) return 'Debe contener al menos una letra minúscula (a-z).';
    if (!tieneMayuscula) return 'Debe contener al menos una letra mayúscula (A-Z).';
    if (!tieneNumero) return 'Debe contener al menos un número (0-9).';
    if (!tieneEspecial) return 'Debe contener al menos un carácter especial (!@#$%^&*()_+-=, etc.).';
    return null;
  };

  const cambiarContrasena = async () => {
    if (!actualPassword || !newPassword) {
      toast.error('Completa todos los campos.');
      return;
    }
    const errorValidacion = validarNuevaContrasena(newPassword);
    if (errorValidacion) {
      toast.error(errorValidacion);
      return;
    }
    setSaving(true);
    try {
      await api.post('/Auth/cambiar-contrasena', {
        ContrasenaActual: actualPassword,
        ContrasenaNueva: newPassword,
      });
      toast.success('Contraseña actualizada correctamente.');
      setActualPassword('');
      setNewPassword('');
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al cambiar la contraseña.';
      toast.error(mensaje);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Shield size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Seguridad</h3>
          <p className="text-xs text-gray-500 mt-0.5">Contraseña y acceso al sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Contraseña actual</label>
          <div className="relative">
            <input
              type={showActual ? 'text' : 'password'}
              value={actualPassword}
              onChange={(e) => setActualPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-gray-50 border border-gray-100 px-4 py-2.5 text-xs text-gray-700 outline-none focus:border-indigo-600 focus:bg-white transition-all h-11"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowActual(!showActual)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showActual ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-gray-50 border border-gray-100 px-4 py-2.5 text-xs text-gray-700 outline-none focus:border-indigo-600 focus:bg-white transition-all h-11"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mt-3 mb-4">
        Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
      </p>

      <button
        onClick={cambiarContrasena}
        disabled={saving}
        className="rounded-xl bg-[#3C31C6] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-70 cursor-pointer"
      >
        {saving ? 'Cambiando...' : 'Cambiar contraseña'}
      </button>
    </div>
  );
}