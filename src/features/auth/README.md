# Auth Module - Rainbow Painting ERP

## 📋 Descripción

Módulo completo de autenticación para Rainbow Painting ERP con gestión de tokens JWT, estado global con Zustand, y protección de rutas.

## 🏗️ Arquitectura Completa

```
src/features/auth/
├── models/                       # Modelos y DTOs
│   ├── shared.model.ts           # OperationResult y tipos compartidos
│   ├── auth.model.ts             # LoginDTO, AuthResponse, User
│   └── index.ts                  # Barrel export
├── services/                     # Servicios de API
│   ├── authService/
│   │   ├── authService.ts        # Login, logout, token management
│   │   ├── authService.spec.ts   # Unit tests
│   │   └── index.ts
│   └── verify-auth-interfaces.ts # Script de verificación
├── store/                        # Estado global
│   ├── authStore.ts              # Zustand store
│   └── index.ts
├── hooks/                        # Custom hooks
│   ├── useAuth.ts                # Hook principal de auth
│   └── index.ts
├── components/                   # Componentes React
│   ├── LoginExample.tsx          # Ejemplos de formularios login
│   ├── ProtectedRoute.tsx        # Protección de rutas
│   └── index.ts
├── pages/                        # Páginas
│   └── LoginPage/                # Página de login existente
└── router/                       # Configuración de rutas
    └── AuthRouter.tsx            # Rutas de autenticación
```

## 🚀 Integración Rápida

### 1. Inicializar Auth en App

```typescript
// App.tsx o main.tsx
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';

function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    // Restaurar estado de auth desde localStorage
    initializeAuth();
  }, []);

  return <AppRouter />;
}
```

### 2. Usar en Página de Login

```typescript
// pages/LoginPage.tsx
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Alert, Button, TextField } from '@mui/material';

export const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
    // Redirección automática manejada por el store
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        required
      />

      <TextField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Contraseña"
        required
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
```

### 3. Proteger Rutas

```typescript
// router/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from '@/features/auth/components/ProtectedRoute';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Solo para usuarios NO autenticados */}
      <Route path="/login" element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      } />

      {/* Requiere autenticación */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      {/* Requiere rol específico */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPage />
        </ProtectedRoute>
      } />

      {/* Requiere permiso específico */}
      <Route path="/reports" element={
        <ProtectedRoute requiredPermission="view_reports">
          <ReportsPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
```

### 4. Usar Auth en Componentes

```typescript
// components/UserMenu.tsx
import { useAuth } from '@/features/auth/hooks/useAuth';

export const UserMenu = () => {
  const { user, logout, displayName, initials, hasRole } = useAuth();

  if (!user) return null;

  return (
    <div>
      <Avatar>{initials}</Avatar>
      <span>{displayName}</span>

      {hasRole('admin') && (
        <Button href="/admin">Admin Panel</Button>
      )}

      <Button onClick={logout}>Cerrar Sesión</Button>
    </div>
  );
};
```

## 🔌 API Endpoints

**Base URL**: `https://rainbowback-production.up.railway.app`

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "1",
      "email": "usuario@ejemplo.com",
      "nombre": "Juan Pérez",
      "rol": "admin"
    }
  }
  ```

## 📦 Características Implementadas

### ✅ Servicios (`services/authService/`)
- `login()` - Autenticación con email/password
- `logout()` - Limpiar sesión
- `verifyToken()` - Verificar validez del token
- `getCurrentUser()` - Obtener usuario actual
- `isAuthenticated()` - Estado de autenticación
- `register()` - Registro de usuario (preparado)
- `requestPasswordReset()` - Reset de password (preparado)
- `changePassword()` - Cambio de password (preparado)

### ✅ Store Zustand (`store/authStore.ts`)
- Estado global de autenticación
- Persistencia con localStorage
- Acciones: login, logout, initializeAuth
- Integración con Redux DevTools
- Rehidratación automática

### ✅ Custom Hooks (`hooks/useAuth.ts`)
- `useAuth()` - Hook principal con todo el estado y acciones
- `useRequireAuth()` - Proteger rutas que requieren auth
- `useGuestOnly()` - Solo para usuarios no autenticados
- `useRequireRole()` - Control de acceso por rol
- `useRequirePermission()` - Control de acceso por permiso
- Helpers: `hasRole()`, `hasPermission()`, `displayName`, `initials`

### ✅ Componentes (`components/`)
- `LoginExample` - Formularios de ejemplo (básico y MUI)
- `ProtectedRoute` - HOC para proteger rutas
- `GuestRoute` - HOC para rutas públicas
- `withAuth` - HOC para proteger componentes

### ✅ Testing
- Unit tests completos para authService
- Mocks de localStorage y apiService
- Coverage de casos de éxito y error

## 🔐 Seguridad

### Implementado:
- ✅ Tokens JWT en localStorage (`x-token`)
- ✅ Auto-inyección de token en headers via interceptor
- ✅ Limpieza de estado en logout
- ✅ Validación de roles y permisos
- ✅ Redirección segura post-login

### Pendiente para Producción:
- ⏳ HTTPS obligatorio
- ⏳ Refresh token mechanism
- ⏳ Token expiration handling
- ⏳ Rate limiting en backend
- ⏳ 2FA (Two-Factor Authentication)

## 🧪 Verificación de Interfaces

**⚠️ IMPORTANTE**: Las interfaces son ASSUMPTIONS basadas en el código legacy. Deben verificarse con el API real.

### Ejecutar Verificación:

```typescript
// En consola del navegador o componente de test
import '@/features/auth/services/verify-auth-interfaces';

// Luego en consola:
window.verifyAuth.runAll({
  email: 'test@example.com',
  password: 'password123'
});
```

Esto mostrará:
- Estructura real de las respuestas
- Campos presentes y tipos
- Sugerencias de interfaces TypeScript

## 📝 Migración desde Código Legacy

### Código Original (JavaScript):
```javascript
// Backend legacy
async function auth(login) {
    const response = await axios.post('/api/auth/login', login);
    localStorage.setItem('x-token', response.data.token);
    localStorage.setItem('log-user', JSON.stringify(response.data));
    window.location.href = "../../views/home.html";
}
```

### Nueva Implementación (TypeScript + React):
```typescript
// Nueva arquitectura
const { login } = useAuth();
await login({ email, password });
// Redirección automática vía React Router
```

## 🎯 Ventajas de la Nueva Arquitectura

1. **Type Safety**: Interfaces TypeScript completas
2. **Estado Global**: Zustand con persistencia
3. **Separation of Concerns**: Services, Store, Hooks separados
4. **Testing**: Unit tests incluidos
5. **Reusabilidad**: Hooks y componentes reutilizables
6. **Seguridad**: Manejo robusto de tokens
7. **UX**: Estados de loading y error
8. **Accesibilidad**: Componentes accesibles

## 🚦 Estado Actual

### ✅ Completado:
- Arquitectura completa de autenticación
- Servicios con manejo de errores
- Store Zustand con persistencia
- Hooks personalizados
- Componentes de protección
- Tests unitarios
- Script de verificación

### ⏳ Pendiente:
- Integración con LoginPage existente
- Verificación de interfaces con API real
- Implementar refresh token
- Añadir 2FA
- Página de recuperación de contraseña

## 📚 Recursos

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [React Router v6](https://reactrouter.com/)
- [Material-UI](https://mui.com/)

## 🤝 Contribución

Para añadir nuevas características de auth:
1. Añadir modelos en `models/auth.model.ts`
2. Implementar servicio en `services/authService/`
3. Actualizar store en `store/authStore.ts`
4. Exponer vía hook en `hooks/useAuth.ts`
5. Añadir tests correspondientes

---

**Generado con api-service-developer agent**
*Arquitectura completa de autenticación para Rainbow Painting ERP*