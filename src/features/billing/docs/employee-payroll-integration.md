# 📊 Employee Payroll Report - Guía de Integración

## 📦 Archivos Creados

### Interfaces
- `interfaces/user.interfaces.ts` - Tipos para usuarios del sistema

### Servicios
- `services/user.service.ts` - Servicio para operaciones de usuarios

### Hooks
- `hooks/useUsers.ts` - Hook para manejo de usuarios
- `hooks/useEmployeePayrollReport.ts` - Hook específico para el reporte individual

### Componentes de Ejemplo
- `components/EmployeePayrollReport.example.tsx` - Implementación de referencia

### Testing
- `services/test-services.ts` - Script de prueba para verificar los endpoints

## 🚀 Cómo Integrar

### 1. Verificar los Endpoints del API

Primero, verifica que las interfaces coincidan con las respuestas reales del API:

```typescript
// En cualquier componente temporal o en la consola del navegador:
import { testAllServices } from '@/features/billing/services/test-services';

// En un useEffect:
useEffect(() => {
  testAllServices().then(results => {
    console.log('Resultados de prueba:', results);
  });
}, []);

// O directamente en la consola:
await window.testBillingServices();
```

### 2. Uso Básico en un Componente

```typescript
import { useUsers } from '@/features/billing/hooks/useUsers';
import { useEmployeePayrollReport } from '@/features/billing/hooks/useEmployeePayrollReport';

const MyPayrollComponent = () => {
  // Cargar usuarios para el selector
  const { users, loading: usersLoading } = useUsers();

  // Hook para el reporte
  const {
    details,
    summary,
    loading,
    fetchReport,
    clearReport
  } = useEmployeePayrollReport();

  // Consultar reporte
  const handleSearch = async (userId: number, dateRange: PayrollWeekRange) => {
    await fetchReport(userId, dateRange);
  };

  return (
    // Tu UI aquí
  );
};
```

### 3. Integración con Autocomplete de MUI

```typescript
import { Autocomplete, TextField } from '@mui/material';
import { useUsers } from '@/features/billing/hooks/useUsers';

const EmployeeSelector = () => {
  const { users, filterUsersLocally, loading } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Autocomplete
      options={users}
      value={selectedUser}
      onChange={(_, value) => setSelectedUser(value)}
      getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
      loading={loading}
      renderInput={(params) => (
        <TextField {...params} label="Seleccionar Empleado" />
      )}
      filterOptions={(options, { inputValue }) => {
        return filterUsersLocally(inputValue);
      }}
    />
  );
};
```

## 🔍 Verificación de Interfaces

### ⚠️ IMPORTANTE: Validar Estructura del API

Las interfaces creadas son **suposiciones** basadas en el código legacy. Debes verificar:

1. **User Interface** (`interfaces/user.interfaces.ts`):
   - Campos reales que devuelve `GET /api/user`
   - Tipos de datos correctos
   - Campos opcionales vs requeridos

2. **Endpoints Disponibles**:
   - `GET /api/user` - Lista de usuarios
   - `GET /api/user/:id` - Usuario específico (verificar si existe)
   - Otros endpoints de user (crear, actualizar, eliminar)

### Cómo Verificar

1. Ejecuta el script de prueba:
```bash
npm run dev
# Abre la consola del navegador
await window.testBillingServices()
```

2. Revisa la estructura real:
```javascript
// La consola mostrará:
// 📝 === ESTRUCTURA DE USER (para verificar interface) ===
// Campos encontrados: ['UserId', 'FirstName', 'LastName', ...]
// Muestra completa: { UserId: 1, FirstName: "Diego", ... }
```

3. Actualiza las interfaces según lo encontrado:
```typescript
// En interfaces/user.interfaces.ts
export interface User {
  UserId: number;
  FirstName: string;
  LastName: string;
  // Agregar o modificar campos según la respuesta real
}
```

## 📋 Checklist de Integración

- [ ] Verificar que el token de autenticación esté en localStorage (`x-token`)
- [ ] Ejecutar `testAllServices()` para validar endpoints
- [ ] Actualizar interfaces según respuestas reales del API
- [ ] Probar el componente de ejemplo
- [ ] Adaptar estilos al tema de la aplicación
- [ ] Implementar manejo de errores apropiado (toast/snackbar)
- [ ] Agregar validaciones de formulario si es necesario
- [ ] Configurar permisos/roles si aplica

## 🎯 Flujo de Uso

1. **Usuario carga la página**:
   - `useUsers` se ejecuta automáticamente
   - Carga lista de empleados para el selector

2. **Usuario selecciona empleado y fechas**:
   - Completa el formulario con los filtros

3. **Usuario hace clic en "Consultar"**:
   - Se ejecuta `fetchReport(userId, dateRange)`
   - Se muestran los detalles diarios

4. **Usuario puede**:
   - Refrescar datos con `refreshReport()`
   - Limpiar todo con `clearReport()`
   - Generar comprobante PDF con `generateStatement()`

## 🔧 Personalización

### Cambiar el Endpoint Base

Si el endpoint de usuarios es diferente:

```typescript
// En services/user.service.ts
export class UserService {
  private static readonly BASE_PATH = '/api/tu-endpoint-aqui'; // Cambiar aquí
  // ...
}
```

### Agregar Campos a User

Si el API devuelve más campos:

```typescript
// En interfaces/user.interfaces.ts
export interface User {
  UserId: number;
  FirstName: string;
  LastName: string;
  // Agregar nuevos campos:
  Email?: string;
  Department?: string;
  Position?: string;
  // etc...
}
```

### Filtrado Avanzado

Para agregar más opciones de filtrado:

```typescript
// En hooks/useUsers.ts
const filterUsersAdvanced = useCallback((filters: UserFilters) => {
  return users.filter(user => {
    // Implementar lógica de filtrado personalizada
    if (filters.department && user.Department !== filters.department) {
      return false;
    }
    if (filters.role && user.Role !== filters.role) {
      return false;
    }
    return true;
  });
}, [users]);
```

## 🐛 Solución de Problemas

### Error: "No se encontraron usuarios"

1. Verificar autenticación (token en localStorage)
2. Verificar endpoint correcto (`/api/user`)
3. Revisar consola para errores de red

### Error: "Cannot read property 'UserId' of undefined"

1. La estructura de User no coincide con el API
2. Actualizar interface según respuesta real
3. Verificar que el API devuelve datos

### El autocomplete no filtra correctamente

1. Verificar que `filterUsersLocally` usa los campos correctos
2. Ajustar la función de filtrado en `UserService.filterUsersLocally()`

## 📚 Referencias

- [PayrollService existente](../services/payroll.service.ts)
- [Interfaces de Payroll](../interfaces/payroll.interfaces.ts)
- [Hook usePayroll original](../hooks/usePayroll.ts)
- [Componente de ejemplo](../components/EmployeePayrollReport.example.tsx)

## 💡 Tips

1. **Performance**: Si hay muchos usuarios, considera implementar búsqueda con debounce
2. **Cache**: Los usuarios se cargan una vez, considera refresh periódico si es necesario
3. **Validación**: Agrega validación de fechas (no futuras, rango máximo, etc.)
4. **UX**: Muestra skeleton loaders mientras carga
5. **Accesibilidad**: Asegura labels apropiados y navegación con teclado