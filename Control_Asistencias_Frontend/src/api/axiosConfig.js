import axios from 'axios';

// Creación de instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:5110/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    // Busca el token en el almacenamiento
    const token = localStorage.getItem('token');
    if (token) {
      // Si existe, lo inyecta como Bearer Token (Igual que en Postman Fase 3)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;