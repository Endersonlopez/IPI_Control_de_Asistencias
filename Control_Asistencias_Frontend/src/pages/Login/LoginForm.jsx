import { useState, useContext } from 'react';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import { AuthContext } from '../../context/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 
    
    try {
      const response = await api.post('/Auth/login', {
        Nombre_Usuario: email.trim(), 
        Contrasena: password.trim() 
      });

      const { usuario, token } = response.data;

      // Detectar el rol del usuario
      const rol = (usuario?.roles || '').toLowerCase();

      // Bloquear a estudiantes en la web
      if (rol.includes('alumno') || rol.includes('estudiante')) {
        setError('Debes iniciar sesión desde tu celular.');
        return;
      }

      login(usuario, token);
      navigate('/dashboard'); 

    } catch (err) {
      if (err.response && err.response.data) {
         setError(err.response.data.message || 'Credenciales incorrectas. Intenta de nuevo.');
      } else {
         console.error("Error en la petición:", err);
         setError('No se pudo conectar con el servidor de la API.');
      }
    }
  };

  return (
    <div className="flex w-full flex-col justify-center px-8 sm:px-16 md:px-24 lg:w-1/2 xl:px-32 relative">
      <div className="mb-12 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
          <BookOpen size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sistema Universitario</span>
          <span className="text-sm font-semibold text-gray-800">Control de Asistencias</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Bienvenido de vuelta</h2>
        <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="mail@udm.edu.ni"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-semibold text-gray-600" htmlFor="password">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
            Recuérdame
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setForgotModalOpen(true);
            }}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Ingresar al sistema
        </button>
      </form>

      <div className="absolute bottom-6 text-xs text-gray-400">
        © 2026 Universidad de Managua — Control de Asistencias
      </div>

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
      />
    </div>
  );
}