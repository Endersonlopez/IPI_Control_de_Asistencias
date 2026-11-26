import { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Header from '../Dashboard/Header';
import { QrCode, Bell, BellOff, Shield, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axiosConfig';

export default function Configuracion() {
  // Estados compartidos para QR y notificaciones
  const [tiempoQR, setTiempoQR] = useState(30);
  const [notificaciones, setNotificaciones] = useState(true);
  const [loading, setLoading] = useState(true);

  // Estados para cambio de contraseña
  const [actualPassword, setActualPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Estado único para el botón Guardar cambios
  const [saving, setSaving] = useState(false);

  // Cargar configuración actual
  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const response = await api.get('/Configuracion');
        if (response.data) {
          setTiempoQR(response.data.tiempo_QR || 30);
          setNotificaciones(response.data.notificaciones_Activas ?? true);
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarConfig();
  }, []);

  // Validar nueva contraseña (solo si se ingresó)
  const validarNuevaContrasena = (password) => {
    if (!password) return null;
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

  // Guardar todo
  const guardarTodo = async () => {
    if (newPassword) {
      if (!actualPassword) {
        toast.error('Debes ingresar tu contraseña actual para cambiarla.');
        return;
      }
      const errorValidacion = validarNuevaContrasena(newPassword);
      if (errorValidacion) {
        toast.error(errorValidacion);
        return;
      }
    }

    setSaving(true);
    try {
      // Guardar QR y notificaciones
      await api.put('/Configuracion', {
        Tiempo_QR: tiempoQR,
        Notificaciones_Activas: notificaciones,
      });

      // Si se ingresó contraseña, cambiarla
      if (actualPassword && newPassword) {
        await api.post('/Auth/cambiar-contrasena', {
          ContrasenaActual: actualPassword,
          ContrasenaNueva: newPassword,
        });
        setActualPassword('');
        setNewPassword('');
      }

      toast.success('Configuración guardada correctamente.');
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al guardar la configuración.';
      toast.error(mensaje);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-800">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden relative">
        <Header titulo="Configuración" />
        <div className="flex-1 overflow-auto p-8 flex flex-col gap-6 relative">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
            <p className="text-sm text-gray-500 mt-0.5">Ajusta las preferencias del sistema de asistencias</p>
          </div>

          {/* Bloque 1: QR */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Generador de Código QR</h3>
                <p className="text-xs text-gray-500 mt-0.5">Configura el tiempo de exposición del QR en pantalla</p>
              </div>
            </div>
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse w-48" />
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Tiempo de exposición (segundos)</label>
                <select
                  value={tiempoQR}
                  onChange={(e) => setTiempoQR(Number(e.target.value))}
                  className="w-48 rounded-xl bg-gray-50 border border-gray-100 px-4 py-2.5 text-xs text-gray-700 outline-none focus:border-indigo-600 focus:bg-white transition-all h-11 cursor-pointer"
                >
                  <option value={15}>15 segundos</option>
                  <option value={30}>30 segundos</option>
                  <option value={45}>45 segundos</option>
                  <option value={60}>60 segundos</option>
                </select>
              </div>
            )}
          </div>

          {/* Bloque 2: Notificaciones */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-xl ${notificaciones ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                {notificaciones ? <Bell size={20} /> : <BellOff size={20} />}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Notificaciones</h3>
                <p className="text-xs text-gray-500 mt-0.5">Gestiona las alertas del sistema</p>
              </div>
            </div>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Notificar asistencia registrada</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNotificaciones(!notificaciones)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      notificaciones ? 'bg-[#3C31C6]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notificaciones ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-gray-700">
                    {notificaciones ? 'Activado' : 'Desactivado'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bloque 3: Seguridad */}
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

            <p className="text-[11px] text-gray-400 mt-3">
              Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
            </p>
          </div>

          {/* Botón único: Guardar cambios (abajo de todo) */}
          <button
            onClick={guardarTodo}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#3C31C6] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-70 cursor-pointer w-fit"
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>

        </div>
      </main>
    </div>
  );
}