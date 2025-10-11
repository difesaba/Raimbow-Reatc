# 🎭 Feature: Roles Management

Feature completo de gestión de roles para el sistema ERP Rainbow Construction.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Estructura de Archivos](#estructura-de-archivos)
- [Instalación e Integración](#instalación-e-integración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Componentes](#componentes)
- [Hooks](#hooks)
- [Servicios](#servicios)
- [Futuras Mejoras](#futuras-mejoras)

---

## 📖 Descripción

Este feature proporciona una interfaz completa para gestionar los roles del sistema ERP, incluyendo:

- ✅ Visualización de roles existentes en tabla
- ✅ Creación de nuevos roles con validación
- ✅ Estadísticas en tiempo real (total, activos, inactivos)
- ✅ Control de nivel de acceso (1-10)
- ✅ Estado activo/inactivo
- ✅ Preparado para edición y eliminación (endpoints futuros)

---

## 🏗️ Arquitectura

Sigue **Clean Architecture** con principios **SOLID** y **KISS**:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components, UI Logic)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Application Layer               │
│  (Hooks, State Management)              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Domain Layer                    │
│  (Models, Business Logic)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Infrastructure Layer            │
│  (Services, API Calls)                  │
└─────────────────────────────────────────┘
```

**Principios aplicados:**

- **Single Responsibility**: Cada módulo tiene una única responsabilidad
- **Dependency Injection**: Hooks consumen servicios, componentes consumen hooks
- **Functional Updates**: Todos los `setState` usan funciones: `setState(prev => ...)`
- **Error Handling**: Try-catch-finally en todas las operaciones async
- **Type Safety**: TypeScript strict mode, cero `any` innecesarios

---

## 📁 Estructura de Archivos

```
src/features/roles/
├── models/                     # Tipos y estructuras de datos
│   ├── index.ts
│   ├── role.model.ts           # Role, CreateRoleDTO, UpdateRoleDTO, etc.
│   └── shared.model.ts         # OperationResult<T>
├── services/                   # Capa de servicios (API calls)
│   └── role.service.ts         # RoleService (clase estática)
├── hooks/                      # Custom hooks
│   ├── index.ts
│   └── useRoles.ts             # Hook principal de gestión
├── components/                 # Componentes reutilizables
│   ├── index.ts
│   ├── RolesTable/             # Tabla de roles
│   │   ├── index.ts
│   │   ├── RolesTable.tsx
│   │   └── RolesTable.types.ts
│   └── CreateRoleModal/        # Modal de creación
│       ├── index.ts
│       ├── CreateRoleModal.tsx
│       └── CreateRoleModal.types.ts
├── pages/                      # Páginas principales
│   ├── index.ts
│   └── RolesManagementPage/
│       ├── index.ts
│       ├── RolesManagementPage.tsx
│       └── RolesManagementPage.types.ts
├── router/                     # Configuración de rutas
│   └── roles.routes.tsx
├── index.ts                    # Barrel export principal
└── README.md                   # Este archivo
```

---

## 🔧 Instalación e Integración

### 1. Verificar Dependencias

Este feature requiere:
- React 18+
- React Router 6+
- Material-UI (MUI) 5+
- Axios (ya configurado en `src/config/services/`)

### 2. Integrar Rutas

Agregar las rutas del módulo al router principal:

```tsx
// src/config/router/index.tsx (o tu archivo de rutas principal)

import { rolesRoutes } from '@/features/roles';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Otras rutas...
      ...rolesRoutes,
    ]
  }
];
```

### 3. Agregar al Menú de Navegación

```tsx
// src/features/shared/components/MainLayout/Sidebar.tsx (o tu componente de menú)

import { rolesNavigation } from '@/features/roles';

const menuItems = [
  // Otros items...
  ...rolesNavigation,
];
```

### 4. Verificar Configuración del Backend

Asegúrate de que el backend tenga estos endpoints configurados:

- `GET /api/role/` - Obtener todos los roles
- `POST /api/role/` - Crear nuevo rol

---

## 💡 Uso

### Uso Básico en una Página

```tsx
import { RolesManagementPage } from '@/features/roles';

// La página ya tiene todo integrado, solo renderízala
function App() {
  return <RolesManagementPage />;
}
```

### Uso del Hook `useRoles`

```tsx
import { useRoles } from '@/features/roles';

function MyComponent() {
  const {
    roles,            // Array de roles
    loading,          // Estado de carga
    error,            // Error si lo hay
    statistics,       // Estadísticas calculadas
    createRole,       // Función para crear rol
    refresh           // Refrescar lista
  } = useRoles();

  const handleCreate = async () => {
    try {
      await createRole({
        RoleName: 'Nuevo Rol',
        Description: 'Descripción del rol',
        Active: true,
        AccessLevel: 5
      });
      console.log('Rol creado exitosamente');
    } catch (error) {
      console.error('Error al crear rol:', error);
    }
  };

  return (
    <div>
      <h1>Total de roles: {statistics.total}</h1>
      <button onClick={handleCreate}>Crear Rol</button>
    </div>
  );
}
```

### Uso de Componentes Individuales

```tsx
import { RolesTable, CreateRoleModal } from '@/features/roles';

function MyCustomPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { roles, loading } = useRoles();

  return (
    <>
      <button onClick={() => setModalOpen(true)}>
        Crear Rol
      </button>

      <RolesTable
        roles={roles}
        loading={loading}
        onEdit={(role) => console.log('Edit', role)}
      />

      <CreateRoleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          // Mostrar notificación de éxito
        }}
      />
    </>
  );
}
```

---

## 🌐 API Endpoints

### GET `/api/role/`

Obtiene todos los roles del sistema.

**Headers:**
- `x-token`: Token JWT de autenticación (inyectado automáticamente)
- `Authorization`: Bearer token (inyectado automáticamente)

**Response:**
```json
[
  {
    "RoleId": 1,
    "RoleName": "Administrador",
    "Description": "Acceso total al sistema",
    "Active": true,
    "AccessLevel": 10
  },
  {
    "RoleId": 2,
    "RoleName": "Usuario",
    "Description": "Acceso básico",
    "Active": true,
    "AccessLevel": 1
  }
]
```

### POST `/api/role/`

Crea un nuevo rol.

**Headers:**
- `x-token`: Token JWT de autenticación
- `Authorization`: Bearer token
- `Content-Type`: application/json

**Body:**
```json
{
  "RoleName": "Supervisor",
  "Description": "Supervisa operaciones",
  "Active": true,
  "AccessLevel": 5
}
```

**Response:**
```json
{
  "RoleId": 3,
  "RoleName": "Supervisor",
  "Description": "Supervisa operaciones",
  "Active": true,
  "AccessLevel": 5
}
```

---

## 🧩 Componentes

### `RolesTable`

Tabla de roles con Material-UI.

**Props:**
```typescript
interface RolesTableProps {
  roles: Role[];
  loading?: boolean;
  onEdit?: (role: Role) => void;
  onDelete?: (roleId: number) => void;
  onViewDetails?: (role: Role) => void;
  selectedRoleId?: number;
}
```

**Features:**
- Maneja estados: loading, empty, error
- Muestra estado activo/inactivo con chips
- Nivel de acceso con colores según importancia
- Acciones: editar, eliminar, ver detalles

### `CreateRoleModal`

Modal para crear nuevos roles.

**Props:**
```typescript
interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  loading?: boolean;
}
```

**Features:**
- Validación en tiempo real
- Slider para nivel de acceso
- Switch para estado activo/inactivo
- Feedback de éxito/error
- Prevención de envíos múltiples

---

## 🎣 Hooks

### `useRoles()`

Hook principal para gestión de roles.

**Retorna:**
```typescript
{
  // Datos
  roles: Role[];
  statistics: RoleStatistics;

  // Estados
  loading: boolean;
  error: string | null;
  operationLoading: boolean;

  // Operaciones CRUD
  fetchRoles: () => Promise<void>;
  createRole: (data: CreateRoleDTO) => Promise<boolean>;
  updateRole: (id: number, data: UpdateRoleDTO) => Promise<boolean>;
  deleteRole: (id: number) => Promise<boolean>;

  // Búsqueda
  getRoleById: (id: number) => Role | undefined;
  getRoleByName: (name: string) => Role | undefined;
  getActiveRoles: () => Role[];
  getRolesByAccessLevel: (min: number) => Role[];

  // Utilidades
  refresh: () => void;
  clearError: () => void;
}
```

---

## 🔧 Servicios

### `RoleService`

Clase estática para operaciones API.

**Métodos:**
```typescript
class RoleService {
  // CRUD
  static getRoles(): Promise<Role[]>;
  static createRole(data: CreateRoleDTO): Promise<Role>;
  static updateRole(id: number, data: UpdateRoleDTO): Promise<Role>;
  static deleteRole(id: number): Promise<boolean>;

  // Validación
  static validateRoleName(name: string): { isValid: boolean; message: string };
  static isValidAccessLevel(level?: number): boolean;

  // Búsqueda
  static findRoleById(roles: Role[], id: number): Role | undefined;
  static findRoleByName(roles: Role[], name: string): Role | undefined;
}
```

---

## 🚀 Futuras Mejoras

### Corto Plazo
- [ ] Implementar edición de roles (botón ya preparado)
- [ ] Implementar eliminación de roles (botón ya preparado)
- [ ] Agregar página de detalles de rol
- [ ] Filtros avanzados (por nombre, nivel de acceso)
- [ ] Búsqueda en tiempo real

### Mediano Plazo
- [ ] Gestión de permisos individuales por rol
- [ ] Asignación masiva de permisos
- [ ] Historial de cambios de roles
- [ ] Exportación de roles (CSV, Excel)
- [ ] Importación masiva de roles

### Largo Plazo
- [ ] Sistema de herencia de roles
- [ ] Roles temporales con fecha de expiración
- [ ] Dashboard de uso de roles
- [ ] Analytics de permisos más usados
- [ ] Auditoría completa de cambios

---

## 📝 Notas Técnicas

### Estado de Endpoints

✅ **Disponibles:**
- GET `/api/role/` - Obtener roles
- POST `/api/role/` - Crear rol

⏳ **Pendientes de Backend:**
- PUT `/api/role/:id` - Actualizar rol
- DELETE `/api/role/:id` - Eliminar rol

### Compatibilidad

Este feature es compatible con:
- React 18+
- React Router 6+
- Material-UI 5+
- TypeScript 5+

### Performance

- **Lazy Loading**: Las páginas se cargan bajo demanda
- **Memoización**: Estadísticas calculadas con `useMemo`
- **Callbacks Optimizados**: Uso de `useCallback` para evitar re-renders
- **Actualizaciones Optimistas**: El estado se actualiza inmediatamente tras éxito

---

## 🤝 Contribuir

Para agregar nuevas funcionalidades:

1. Mantén la arquitectura limpia (Models → Services → Hooks → Components)
2. Usa actualizaciones funcionales de estado: `setState(prev => ...)`
3. Agrega validaciones en servicios antes de llamadas API
4. Documenta en español con emojis: ✅, ⚠️, 📝
5. Sigue los patrones TypeScript strict mode

---

## 📧 Contacto

Para dudas o soporte sobre este feature, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0
**Fecha:** 2025-01-10
**Autor:** Claude Code (Agentes: clean-code-arquitecture-refactor, react-page-services-integrator)
