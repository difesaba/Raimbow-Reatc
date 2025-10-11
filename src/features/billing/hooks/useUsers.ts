import { useState, useEffect, useCallback } from 'react';
import type { User, UserFilters, UserOption } from '../interfaces/user.interfaces';
import { UserService } from '../services/user.service';

/**
 * 👥 Hook personalizado para gestión de usuarios
 *
 * Funcionalidades:
 * - ✅ Carga automática de usuarios al montar el componente
 * - ✅ Manejo de estados de carga y error
 * - ✅ Función de refresco manual
 * - ✅ Búsqueda y filtrado local de usuarios
 * - ✅ Conversión a formato UserOption para autocomplete
 *
 * @returns Objeto con usuarios, estados y funciones de control
 */
export const useUsers = () => {
  // 👥 Lista completa de usuarios
  const [users, setUsers] = useState<User[]>([]);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * 🔄 Función para cargar todos los usuarios
   * Se ejecuta automáticamente al montar el componente
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 📡 Llamada al servicio
      const data = await UserService.getAllUsers();

      // ✅ Actualizar estado con los datos obtenidos
      setUsers(data);

      console.log(`✅ ${data.length} usuarios cargados exitosamente`);
    } catch (err) {
      // ❌ Capturar error y actualizar estado
      const error = err as Error;
      setError(error);
      console.error('❌ Error al cargar usuarios:', error.message);

      // 🔄 Limpiar datos en caso de error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🚀 Efecto para cargar usuarios al montar el componente
   */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * 🔁 Función pública para refrescar manualmente los datos
   */
  const refresh = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);

  /**
   * 🔍 Buscar usuarios con filtros (llamada al API)
   * @param filters - Filtros de búsqueda
   * @returns Promise con los usuarios filtrados
   */
  const searchUsers = useCallback(async (filters: UserFilters): Promise<User[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await UserService.searchUsers(filters);

      // Opcionalmente actualizar el estado local si queremos
      // mantener los resultados de búsqueda
      // setUsers(data);

      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('❌ Error al buscar usuarios:', error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔍 Filtrar usuarios localmente (sin llamada al API)
   * Útil para filtrado rápido en componentes como autocomplete
   * @param searchTerm - Término de búsqueda
   * @returns Usuarios filtrados
   */
  const filterUsersLocally = useCallback((searchTerm: string): User[] => {
    return UserService.filterUsersLocally(users, searchTerm);
  }, [users]);

  /**
   * 🔄 Convertir usuarios a formato UserOption para selectores
   * @param usersToConvert - Usuarios a convertir (por defecto todos)
   * @returns Array de UserOptions
   */
  const getUserOptions = useCallback((usersToConvert?: User[]): UserOption[] => {
    const usersArray = usersToConvert || users;
    return UserService.toUserOptions(usersArray);
  }, [users]);

  /**
   * 🔍 Buscar un usuario específico por ID
   * @param userId - ID del usuario
   * @returns Usuario encontrado o undefined
   */
  const findUserById = useCallback((userId: number): User | undefined => {
    return users.find(user => user.UserId === userId);
  }, [users]);

  /**
   * 📊 Estadísticas de usuarios
   */
  const stats = {
    total: users.length,
    active: users.filter(u => u.Active !== false).length,
    inactive: users.filter(u => u.Active === false).length,
    byRole: users.reduce((acc, user) => {
      const role = user.Role || 'Sin rol';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byDepartment: users.reduce((acc, user) => {
      const dept = user.Department || 'Sin departamento';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return {
    // 📝 Datos
    users,
    userOptions: getUserOptions(),
    stats,

    // 📊 Estados
    loading,
    error,

    // 🔄 Acciones
    refresh,
    searchUsers,
    filterUsersLocally,
    getUserOptions,
    findUserById
  };
};

/**
 * 👤 Hook para manejo de un usuario individual
 * Útil cuando necesitas cargar/editar un usuario específico
 *
 * @param userId - ID del usuario a cargar (opcional)
 * @returns Objeto con usuario, estados y funciones
 */
export const useUser = (userId?: number) => {
  // 👤 Usuario individual
  const [user, setUser] = useState<User | null>(null);

  // ⏳ Estado de carga
  const [loading, setLoading] = useState(false);

  // ❌ Estado de error
  const [error, setError] = useState<Error | null>(null);

  /**
   * 📡 Cargar datos del usuario
   * @param id - ID del usuario (usa el prop userId si no se proporciona)
   */
  const fetchUser = useCallback(async (id?: number) => {
    const userIdToFetch = id || userId;

    if (!userIdToFetch) {
      setError(new Error('No se proporcionó ID de usuario'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await UserService.getUserById(userIdToFetch);
      setUser(data);
      console.log(`✅ Usuario ${userIdToFetch} cargado exitosamente`);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error(`❌ Error al cargar usuario ${userIdToFetch}:`, error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * 🚀 Cargar usuario si se proporciona ID inicial
   */
  useEffect(() => {
    if (userId && userId > 0) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  /**
   * 🗑️ Limpiar datos del usuario
   */
  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return {
    // 📝 Datos
    user,

    // 📊 Estados
    loading,
    error,

    // 🔄 Acciones
    fetchUser,
    clearUser,
    refresh: () => fetchUser(userId)
  };
};