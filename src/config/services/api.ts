import axios from 'axios';
import { showGlobalError } from '@/features/shared/contexts';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ROUTES } from '@/config/router/routes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inyectar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('x-token');
    if (token) {
      // Send token in x-token header (backend legacy format)
      config.headers['x-token'] = token;
      // Also send as Bearer token for compatibility
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Manejar sesión expirada (401)
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente retornarla
    return response;
  },
  (error) => {
    // Detectar error 401 (No autorizado / Token expirado / Sin autenticación)
    if (error.response?.status === 401) {
      // 🔒 Sesión expirada o no autorizada
      console.log('[API] Sesión expirada detectada (401). Limpiando autenticación...');

      // 1️⃣ PRIMERO: Limpiar estado de Zustand y localStorage
      // Esto asegura que el estado esté sincronizado antes de cualquier redirección
      const authStore = useAuthStore.getState();
      authStore.logout(true); // silent = true, no mostrar toast de logout exitoso

      // 2️⃣ Mostrar notificación al usuario
      showGlobalError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 5000);

      // 3️⃣ Guardar ruta actual para redirección después del login
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== ROUTES.LOGIN && !currentPath.startsWith(ROUTES.LOGIN)) {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }

      // 4️⃣ Redirigir a la página de login INMEDIATAMENTE
      // No usar setTimeout para evitar race conditions con React Router
      window.location.href = ROUTES.LOGIN;
    }

    // Propagar el error para que pueda ser manejado por el código llamante
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
};

export default api;