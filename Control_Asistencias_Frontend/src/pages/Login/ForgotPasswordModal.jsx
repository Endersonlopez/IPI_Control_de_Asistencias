import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identificador.trim()) {
      setError('Ingresa tu usuario o correo electrónico');
      return;
    }
    setLoading(true);
    setError('');
    setMensaje('');
    try {
      await api.post('/Auth/solicitar-cambio', {
        Nombre_Usuario: identificador.trim()
      });
      setMensaje('Solicitud enviada. Un administrador te asignará una nueva contraseña.');
      setIdentificador('');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Error al enviar la solicitud.';
      setError(typeof msg === 'string' ? msg : 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between bg-[#3C31C6] px-6 py-4 text-white">
          <h3 className="text-lg font-bold">Recuperar contraseña</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {mensaje ? (
            <>
              <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200 mb-4">
                {mensaje}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-[#3C31C6] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-500">
                Ingresa tu nombre de usuario o correo electrónico para solicitar un cambio de contraseña.
              </p>
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {error}
                </div>
              )}
              <input
                type="text"
                placeholder="Usuario o correo electrónico"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
                autoFocus
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#3C31C6] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}