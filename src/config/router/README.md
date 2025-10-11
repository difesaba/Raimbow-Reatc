# Router Configuration - Rainbow Painting ERP

## 📋 Descripción

Sistema de rutas de React Router configurado para el ERP de Rainbow Painting. Incluye rutas públicas, protegidas y manejo de autenticación.

## 🗺️ Mapa de Rutas

```
/                     → Redirige a /dashboard (si autenticado) o /login (si no)
/login                → Página de login (redirige a /dashboard si ya autenticado)
/dashboard            → Dashboard principal (PROTEGIDA)
/404                  → Página de error 404
/*                    → Cualquier ruta no definida muestra 404
```

## 📁 Estructura de Archivos

```
src/config/router/
├── index.tsx              # Configuración principal del router
├── ProtectedRoute.tsx     # HOC para rutas protegidas
├── routes.ts              # Constantes de rutas
└── README.md              # Esta documentación
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Usuario sin token accede a `/`**
   - ProtectedRoute detecta ausencia de token
   - Redirige automáticamente a `/login`

2. **Usuario ingresa credenciales en `/login`**
   - LoginPage valida credenciales (actualmente mock)
   - Si son correctas:
     - Guarda token en `localStorage.setItem('x-token', token)`
     - Redirige a `/dashboard`
   - Si son incorrectas:
     - Muestra mensaje de error

3. **Usuario autenticado intenta acceder a `/login`**
   - LoginRedirect detecta token existente
   - Redirige automáticamente a `/dashboard`

4. **Usuario autenticado accede a rutas protegidas**
   - ProtectedRoute verifica token
   - Permite acceso a la ruta

5. **Usuario hace logout**
   - Se elimina token: `localStorage.removeItem('x-token')`
   - Redirige a `/login`

### Token Storage

- **Key**: `x-token`
- **Location**: `localStorage`
- **Format**: JWT (en producción)
- **Lifetime**: Según configuración del backend

## 🛠️ Componentes

### 1. Router Principal (`index.tsx`)

```typescript
export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: '/login', element: <LoginRedirect /> },
  { path: '/dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '*', element: <NotFoundPage /> },
]);
```

### 2. ProtectedRoute Component

HOC que protege rutas que requieren autenticación:

```typescript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

**Funcionalidad:**
- Verifica si existe token en localStorage
- Si NO hay token → Redirige a `/login`
- Si HAY token → Permite acceso al componente hijo

### 3. Routes Constants (`routes.ts`)

Constantes para evitar strings hardcodeados:

```typescript
import { ROUTES } from './config/router/routes';

navigate(ROUTES.DASHBOARD); // ✅ Autocomplete y type-safe
navigate('/dashboard');     // ❌ Evitar
```

## 🚀 Uso

### Agregar Nueva Ruta Protegida

1. **Agregar constante en `routes.ts`:**
```typescript
export const ROUTES = {
  // ... existing routes
  OBRAS: '/obras',
};
```

2. **Agregar ruta en `index.tsx`:**
```typescript
{
  path: ROUTES.OBRAS,
  element: (
    <ProtectedRoute>
      <ObrasPage />
    </ProtectedRoute>
  ),
},
```

3. **Navegar desde cualquier componente:**
```typescript
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/router/routes';

const navigate = useNavigate();
navigate(ROUTES.OBRAS);
```

### Agregar Ruta Pública

```typescript
{
  path: '/terms',
  element: <TermsPage />, // Sin ProtectedRoute
},
```

## 📱 Navegación Programática

### useNavigate Hook

```typescript
import { useNavigate } from 'react-router-dom';
import { ROUTES } from './config/router/routes';

function MyComponent() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const goBack = () => {
    navigate(-1); // Vuelve atrás
  };

  const replaceRoute = () => {
    navigate(ROUTES.LOGIN, { replace: true }); // No agrega a history
  };
}
```

### Link Component

```typescript
import { Link } from 'react-router-dom';
import { ROUTES } from './config/router/routes';

<Link to={ROUTES.DASHBOARD}>
  Ir al Dashboard
</Link>
```

## 🔒 Seguridad

### Validación Actual (Mock)

⚠️ **IMPORTANTE**: La validación actual es SOLO para demostración.

**Implementación actual:**
```typescript
const token = localStorage.getItem('x-token');
if (!token) {
  return <Navigate to={ROUTES.LOGIN} replace />;
}
```

### Validación Recomendada para Producción

```typescript
// ProtectedRoute.tsx
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};
```

**Hook useAuth() debería:**
1. Verificar existencia del token
2. Validar formato del token (JWT)
3. Verificar expiración del token
4. Opcionalmente: Verificar con backend (`/auth/verify`)

## 🎯 Mejoras Futuras

### 1. Rutas Anidadas

```typescript
{
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { path: 'users', element: <UsersPage /> },
    { path: 'settings', element: <SettingsPage /> },
  ],
}
```

### 2. Lazy Loading

```typescript
const ObrasPage = lazy(() => import('./features/obras/pages/ObrasPage'));

{
  path: ROUTES.OBRAS,
  element: (
    <Suspense fallback={<LoadingScreen />}>
      <ProtectedRoute>
        <ObrasPage />
      </ProtectedRoute>
    </Suspense>
  ),
}
```

### 3. Protección por Roles

```typescript
interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
```

### 4. Breadcrumbs Automáticos

```typescript
// En cada ruta
{
  path: ROUTES.OBRAS,
  element: <ObrasPage />,
  handle: {
    crumb: () => <Link to={ROUTES.OBRAS}>Obras</Link>,
  },
}
```

## 🧪 Testing

```typescript
// Ejemplo de test para ProtectedRoute
describe('ProtectedRoute', () => {
  it('should redirect to login when no token', () => {
    localStorage.removeItem('x-token');
    render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
    expect(window.location.pathname).toBe(ROUTES.LOGIN);
  });

  it('should render children when token exists', () => {
    localStorage.setItem('x-token', 'mock-token');
    render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

## 📖 Recursos

- [React Router Docs](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Protected Routes Pattern](https://ui.dev/react-router-protected-routes-authentication)

## 🐛 Troubleshooting

### Redirect Loop

**Problema:** La aplicación se queda en un loop infinito de redirecciones.

**Solución:**
- Verifica que LoginRedirect no tenga lógica circular
- Asegúrate de usar `replace={true}` en Navigate
- Verifica que el token se esté guardando correctamente

### Token No Persiste

**Problema:** El token desaparece al recargar la página.

**Solución:**
- Verifica que estés usando `localStorage` (no `sessionStorage`)
- Verifica que el token se guarde correctamente en LoginPage
- Revisa la consola del navegador (Application > Local Storage)

### 404 en Producción

**Problema:** Las rutas funcionan en desarrollo pero no en producción.

**Solución:**
- Configura el servidor web para redirigir todas las rutas a `index.html`
- Ejemplo Nginx:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
