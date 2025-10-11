import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserService } from '../services/user.service';
import type { User, CreateUserDTO, UpdateUserDTO, UserStatistics } from '../interfaces/user.interfaces';

/**
 * Custom hook para gestión de usuarios
 * Maneja el estado, operaciones CRUD y estadísticas de usuarios
 */
export const useUsers = () => {
  // Estado principal
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para operaciones individuales
  const [operationLoading, setOperationLoading] = useState(false);

  /**
   * 📋 Obtener todos los usuarios
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar usuarios';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ➕ Crear nuevo usuario
   */
  const createUser = useCallback(async (userData: CreateUserDTO): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setError(null);

      const newUser = await UserService.createUser(userData);

      // Actualizar lista local con el nuevo usuario
      setUsers(prev => [...prev, newUser]);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear usuario';
      setError(errorMessage);
      console.error('Error creating user:', err);
      throw err; // Re-throw para que el componente pueda manejar el error
    } finally {
      setOperationLoading(false);
    }
  }, []);

  /**
   * ✏️ Actualizar usuario existente
   */
  const updateUser = useCallback(async (userId: number, userData: UpdateUserDTO): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setError(null);

      const updatedUser = await UserService.updateUser(userId, userData);

      // Actualizar lista local con el usuario actualizado
      setUsers(prev => prev.map(user =>
        user.UserId === userId ? updatedUser : user
      ));

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar usuario';
      setError(errorMessage);
      console.error('Error updating user:', err);
      throw err; // Re-throw para que el componente pueda manejar el error
    } finally {
      setOperationLoading(false);
    }
  }, []);

  /**
   * 🗑️ Eliminar usuario
   */
  const deleteUser = useCallback(async (userId: number): Promise<boolean> => {
    try {
      setOperationLoading(true);
      setError(null);

      await UserService.deleteUser(userId);

      // Eliminar de la lista local
      setUsers(prev => prev.filter(user => user.UserId !== userId));

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar usuario';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      throw err; // Re-throw para que el componente pueda manejar el error
    } finally {
      setOperationLoading(false);
    }
  }, []);

  /**
   * 📊 Calcular estadísticas de usuarios
   */
  const statistics: UserStatistics = useMemo(() => {
    const total = users.length;
    const active = users.filter(user => user.Status === 1).length;
    const inactive = total - active;
    const administrators = users.filter(user => user.IsAdmin).length;

    return {
      total,
      active,
      inactive,
      administrators
    };
  }, [users]);

  /**
   * 🔍 Buscar usuario por ID
   */
  const getUserById = useCallback((userId: number): User | undefined => {
    return users.find(user => user.UserId === userId);
  }, [users]);

  /**
   * 🔍 Obtener usuarios por empresa
   */
  const getUsersByCompany = useCallback((company: string): User[] => {
    if (company === 'all') return users;
    return users.filter(user => user.Company === company);
  }, [users]);

  /**
   * 🔍 Obtener usuarios por rol
   */
  const getUsersByRole = useCallback((roleId: number): User[] => {
    return users.filter(user => user.RoleId === roleId);
  }, [users]);

  /**
   * 🔍 Obtener usuarios activos
   */
  const getActiveUsers = useCallback((): User[] => {
    return users.filter(user => user.Status === 1);
  }, [users]);

  /**
   * 🔍 Obtener usuarios Rainbow
   */
  const getRainbowUsers = useCallback((): User[] => {
    return users.filter(user => user.isRainbow);
  }, [users]);

  /**
   * 🔍 Obtener líderes
   */
  const getLeaders = useCallback((): User[] => {
    return users.filter(user => user.Leader);
  }, [users]);

  // Cargar usuarios al montar el hook
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // Estado
    users,
    loading,
    error,
    operationLoading,
    statistics,

    // Operaciones CRUD
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,

    // Utilidades
    getUserById,
    getUsersByCompany,
    getUsersByRole,
    getActiveUsers,
    getRainbowUsers,
    getLeaders
  };
};