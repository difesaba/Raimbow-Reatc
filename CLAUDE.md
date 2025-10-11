# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto del Proyecto

Sistema ERP (Enterprise Resource Planning) para empresa de construcción grande, desarrollado en React + TypeScript + Vite. El sistema maneja gestión integral de obras, contratos, facturación, reportes de avance, control de costos y recursos.

## Comandos de Desarrollo

- **Iniciar servidor de desarrollo**: `npm run dev`
- **Compilar para producción**: `npm run build` (ejecuta verificación TypeScript + build de Vite)
- **Ejecutar linter**: `npm run lint`
- **Previsualizar build de producción**: `npm run preview`

## Arquitectura del ERP

### Estructura Basada en Módulos de Negocio

El ERP sigue una arquitectura modular por features en `src/features/`, donde cada módulo representa un área funcional del negocio de construcción:

```
src/features/
  ├── auth/         - Autenticación y control de acceso de usuarios
  ├── billing/      - Facturación, control financiero y pagos de obras
  ├── reports/      - Reportes de avances, costos, recursos y KPIs
  └── shared/       - Componentes y servicios compartidos del ERP
```

Cada módulo del ERP contiene:
- `components/` - Componentes React específicos del módulo
- `hooks/` - Custom hooks para lógica de negocio del módulo
- `interfaces/` - TypeScript interfaces para entidades del dominio
- `pages/` - Páginas principales del módulo
- `router/` - Configuración de rutas del módulo
- `services/` - Servicios de API específicos del módulo (ej: facturación, obras, contratos)

### Configuración Centralizada de API

API del ERP configurada en `src/config/services/`:

- **`api.ts`**: Instancia de Axios configurada para el backend del ERP
  - Base URL: Variable de entorno `REACT_APP_API_URL` (default: Railway production)
  - Interceptor de autenticación: Inyecta automáticamente el token `x-token` desde localStorage
  - Headers estándar: `Content-Type: application/json`
  - Patrón Bearer token para todas las peticiones autenticadas

- **`apiService.ts`**: Clase wrapper genérica para operaciones HTTP
  - Métodos: `get()`, `post()`, `put()`, `delete()`
  - Logging centralizado de errores
  - Manejo consistente de respuestas y errores del backend

### Configuración TypeScript

- **Strict mode habilitado** con reglas adicionales de linting
- **Target**: ES2022 con soporte DOM
- **Module resolution**: `bundler` (específico de Vite)
- **JSX**: React JSX transform mode
- Opciones de linting estrictas: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

### Variables de Entorno

- `REACT_APP_API_URL`: URL del backend del ERP (default: `https://rainbowback-production.up.railway.app`)

## Patrones Clave del ERP

1. **Autenticación**:
   - Token JWT almacenado en localStorage con key `x-token`
   - Auto-inyección en todas las peticiones vía interceptor (src/config/services/api.ts:12-23)
   - El interceptor añade header `Authorization: Bearer {token}`

2. **Llamadas a API**:
   - **SIEMPRE** usar `apiService` de `src/config/services/apiService.ts` en lugar de axios directamente
   - Esto garantiza logging consistente y manejo de errores centralizado

3. **Aislamiento de Módulos**:
   - Mantener lógica específica dentro de su feature folder correspondiente
   - Funcionalidad compartida entre módulos va en `features/shared/`
   - Servicios de API específicos de cada módulo en su respectiva carpeta `services/`

4. **Entidades del Dominio de Construcción**:
   - Definir interfaces TypeScript en carpeta `interfaces/` de cada módulo
   - Ejemplos típicos: Obras, Contratos, Facturas, Proveedores, Materiales, Recursos, Avances

## Contexto de Negocio

El sistema debe manejar operaciones típicas de construcción:
- Gestión de múltiples obras simultáneas
- Control de contratos y subcontratos
- Seguimiento de avances y entregas
- Facturación a clientes y proveedores
- Control de costos y presupuestos
- Gestión de recursos (maquinaria, personal, materiales)
- Reportes financieros y operativos
