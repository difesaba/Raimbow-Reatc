// src/config/router/routes.ts

/**
 * Definición de rutas de la aplicación como constantes
 * Esto permite tener un único lugar de verdad para las rutas
 * y evitar errores de tipeo en strings
 */

export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',

  // Rutas protegidas
  ROOT: '/',
  DASHBOARD: '/dashboard',

  // Módulos de negocio (futuro)
  OBRAS: '/obras',
  CONTRATOS: '/contratos',
  FACTURACION: '/facturacion',
  REPORTES: '/reportes',

  // Páginas de error
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
} as const;

// Type helper para autocompletado
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
