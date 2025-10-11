import { useState, useEffect, useCallback, useMemo } from 'react';
import { RoleService } from '../services/role.service';
import type { Role, CreateRoleDTO, UpdateRoleDTO, RoleStatistics } from '../models';

/**
 * 🎭 Custom hook para gestión de roles
 * Maneja el estado, operaciones CRUD y estadísticas de roles
 *
 * Funcionalidades:
 * - ✅ Carga automática de roles al montar
 * - ✅ Manejo de estados de carga y error
 * - ✅ Operaciones CRUD completas
 * - ✅ Actualizaciones funcionales de estado
 * - ✅ Métodos de búsqueda y filtrado
 * - ✅ Cálculo automático de estadísticas
 *
 * @returns Objeto con datos, estados y funciones de control
 */
export const useRoles = () => {
  // ==================== ESTADOS PRINCIPALES ====================

  /** 📋 Lista de roles cargados */
  const [roles, setRoles] = useState<Role[]>([]);

  /** ⏳ Estado de carga para fetch inicial */
  const [loading, setLoading] = useState(false);

  /** ❌ Estado de error */
  const [error, setError] = useState<string | null>(null);

  /** 🔄 Estado de carga para operaciones individuales (create, update, delete) */
  const [operationLoading, setOperationLoading] = useState(false);

  // ==================== OPERACIONES CRUD ====================

  /**
   * 📋 Obtener todos los roles del sistema
   * Se ejecuta automáticamente al montar el componente
   */
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await RoleService.getRoles();

      // ✅ Actualizar estado con los roles obtenidos
      setRoles(data);
    } catch (err: any) {
      // ❌ Capturar error y actualizar estado
      const errorMessage = err.message || 'Error al cargar roles';
      setError(errorMessage);
      console.error('❌ Error fetching roles:', err);

      // 🔄 Limpiar datos en caso de error
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ➕ Crear nuevo rol
   *
   * @param roleData - Datos del nuevo rol
   * @returns true si la creación fue exitosa, false en caso contrario
   *
   * 📝 Notas:
   * - Actualiza el estado local solo si el backend confirma éxito
   * - Usa actualización funcional para evitar problemas de concurrencia
   * - Re-lanza el error para que el componente pueda manejarlo (ej: mostrar toast)
   */
  const createRole = useCallback(async (roleData: CreateRoleDTO): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setError(null);

      // ✅ Validar datos antes de enviar
      const validation = RoleService.validateRoleName(roleData.RoleName);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      // 📡 Llamada al servicio
      const newRole = await RoleService.createRole(roleData);

      // ✅ Actualizar lista local con el nuevo rol (solo si el backend respondió OK)
      setRoles(prev => [...prev, newRole]);

      console.log('✅ Role created and added to local state:', newRole);
      return true;
    } catch (err: any) {
      // ❌ Capturar error y actualizar estado
      const errorMessage = err.message || 'Error al crear rol';
      setError(errorMessage);
      console.error('❌ Error creating role:', err);

      // ⚠️ Re-lanzar error para que el componente pueda manejarlo
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  /**
   * ✏️ Actualizar rol existente (FUTURO)
   *
   * @param roleId - ID del rol a actualizar
   * @param roleData - Datos actualizados del rol
   * @returns true si la actualización fue exitosa
   *
   * ⚠️ NOTA: Este endpoint aún no está implementado en el backend
   */
  const updateRole = useCallback(async (roleId: number, roleData: UpdateRoleDTO): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setError(null);

      // 📡 Llamada al servicio
      const updatedRole = await RoleService.updateRole(roleId, roleData);

      // ✅ Actualizar lista local con el rol actualizado (usando map)
      setRoles(prev => prev.map(role =>
        role.RoleId === roleId ? updatedRole : role
      ));

      console.log('✅ Role updated in local state:', updatedRole);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar rol';
      setError(errorMessage);
      console.error('❌ Error updating role:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  /**
   * 🗑️ Eliminar rol (FUTURO)
   *
   * @param roleId - ID del rol a eliminar
   * @returns true si la eliminación fue exitosa
   *
   * ⚠️ NOTA: Este endpoint aún no está implementado en el backend
   */
  const deleteRole = useCallback(async (roleId: number): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setError(null);

      // 📡 Llamada al servicio
      await RoleService.deleteRole(roleId);

      // ✅ Eliminar de la lista local (usando filter)
      setRoles(prev => prev.filter(role => role.RoleId !== roleId));

      console.log('✅ Role removed from local state:', roleId);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar rol';
      setError(errorMessage);
      console.error('❌ Error deleting role:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // ==================== MÉTODOS DE BÚSQUEDA ====================

  /**
   * 🔍 Buscar rol por ID
   * @param roleId - ID del rol a buscar
   * @returns Rol encontrado o undefined
   */
  const getRoleById = useCallback((roleId: number): Role | undefined => {
    return RoleService.findRoleById(roles, roleId);
  }, [roles]);

  /**
   * 🔍 Buscar rol por nombre
   * @param roleName - Nombre del rol a buscar (case-insensitive)
   * @returns Rol encontrado o undefined
   */
  const getRoleByName = useCallback((roleName: string): Role | undefined => {
    return RoleService.findRoleByName(roles, roleName);
  }, [roles]);

  /**
   * 🔍 Obtener roles activos
   * @returns Array de roles activos
   */
  const getActiveRoles = useCallback((): Role[] => {
    return roles.filter(role => role.Active !== false);
  }, [roles]);

  /**
   * 🔍 Obtener roles por nivel de acceso mínimo
   * @param minLevel - Nivel mínimo de acceso
   * @returns Array de roles que cumplen el criterio
   */
  const getRolesByAccessLevel = useCallback((minLevel: number): Role[] => {
    return roles.filter(role => (role.AccessLevel || 1) >= minLevel);
  }, [roles]);

  // ==================== ESTADÍSTICAS ====================

  /**
   * 📊 Calcular estadísticas de roles
   * Se recalcula automáticamente cuando cambia el array de roles
   */
  const statistics: RoleStatistics = useMemo(() => {
    const total = roles.length;
    const active = roles.filter(role => role.Active !== false).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive
    };
  }, [roles]);

  // ==================== UTILIDADES ====================

  /**
   * 🔄 Refrescar lista de roles manualmente
   */
  const refresh = useCallback(() => {
    fetchRoles();
  }, [fetchRoles]);

  /**
   * 🧹 Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==================== EFECTOS ====================

  /**
   * 🚀 Cargar roles al montar el hook
   */
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // ==================== RETORNO ====================

  return {
    // 📝 Datos
    roles,
    statistics,

    // 📊 Estados
    loading,
    error,
    operationLoading,

    // 🔄 Operaciones CRUD
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,

    // 🔍 Búsqueda y filtrado
    getRoleById,
    getRoleByName,
    getActiveRoles,
    getRolesByAccessLevel,

    // 🛠️ Utilidades
    refresh,
    clearError
  };
};
