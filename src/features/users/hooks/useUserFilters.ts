import { useState, useMemo, useCallback } from 'react';
import type { User, UserFilters } from '../interfaces/user.interfaces';

/**
 * Custom hook para manejo de filtros de usuarios
 * Proporciona lógica de filtrado y búsqueda para la tabla de usuarios
 */
export const useUserFilters = (users: User[]) => {
  // Estado de filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<UserFilters['statusFilter']>('all');
  const [roleFilter, setRoleFilter] = useState<UserFilters['roleFilter']>('all');

  /**
   * 🔍 Aplicar filtros a la lista de usuarios
   */
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filtro por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(user => {
        const fullName = `${user.FirstName || ''} ${user.LastName || ''}`.toLowerCase();
        const email = (user.Email || '').toLowerCase();
        const company = (user.Company || '').toLowerCase();
        const userId = (user.UserId?.toString() || '');

        return fullName.includes(term) ||
               email.includes(term) ||
               company.includes(term) ||
               userId.includes(term);
      });
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      result = result.filter(user => {
        if (statusFilter === 'active') return user.Status === 1;
        if (statusFilter === 'inactive') return user.Status === 0;
        return true;
      });
    }

    // Filtro por rol
    if (roleFilter !== 'all' && typeof roleFilter === 'number') {
      result = result.filter(user => user.RoleId === roleFilter);
    }

    return result;
  }, [users, searchTerm, statusFilter, roleFilter]);

  /**
   * 🔍 Manejar cambio en búsqueda
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  /**
   * 🔍 Manejar cambio en filtro de estado
   */
  const handleStatusChange = useCallback((value: UserFilters['statusFilter']) => {
    setStatusFilter(value);
  }, []);

  /**
   * 🔍 Manejar cambio en filtro de rol
   */
  const handleRoleChange = useCallback((value: UserFilters['roleFilter']) => {
    setRoleFilter(value);
  }, []);

  /**
   * 🔄 Resetear todos los filtros
   */
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoleFilter('all');
  }, []);

  /**
   * 📊 Estadísticas de filtrado
   */
  const filterStats = useMemo(() => {
    return {
      totalOriginal: users.length,
      totalFiltered: filteredUsers.length,
      hasActiveFilters: searchTerm !== '' ||
                       statusFilter !== 'all' ||
                       roleFilter !== 'all'
    };
  }, [users.length, filteredUsers.length, searchTerm, statusFilter, roleFilter]);

  /**
   * 🏢 Obtener lista única de empresas
   */
  const uniqueCompanies = useMemo(() => {
    const companies = new Set<string>();
    users.forEach(user => {
      if (user.Company) {
        companies.add(user.Company);
      }
    });
    return Array.from(companies).sort();
  }, [users]);

  /**
   * 👤 Obtener lista única de roles
   */
  const uniqueRoles = useMemo(() => {
    const rolesMap = new Map<number, string>();
    users.forEach(user => {
      if (!rolesMap.has(user.RoleId)) {
        // Mapeo básico de roles (debería venir del backend)
        const roleNames: { [key: number]: string } = {
          1: 'Administrador',
          2: 'Usuario',
          3: 'Supervisor',
          4: 'Operador',
          5: 'Gerente'
        };
        rolesMap.set(user.RoleId, roleNames[user.RoleId] || `Rol ${user.RoleId}`);
      }
    });
    return Array.from(rolesMap.entries()).map(([id, name]) => ({ id, name }));
  }, [users]);

  /**
   * 🏷️ Obtener etiquetas de filtros activos
   */
  const activeFilterTags = useMemo(() => {
    const tags: string[] = [];

    if (searchTerm) {
      tags.push(`Búsqueda: "${searchTerm}"`);
    }
    if (statusFilter !== 'all') {
      tags.push(`Estado: ${statusFilter === 'active' ? 'Activo' : 'Inactivo'}`);
    }
    if (roleFilter !== 'all') {
      const role = uniqueRoles.find(r => r.id === roleFilter);
      if (role) {
        tags.push(`Rol: ${role.name}`);
      }
    }

    return tags;
  }, [searchTerm, statusFilter, roleFilter, uniqueRoles]);

  return {
    // Estado de filtros
    searchTerm,
    statusFilter,
    roleFilter,

    // Resultados
    filteredUsers,
    filterStats,
    uniqueCompanies,
    uniqueRoles,
    activeFilterTags,

    // Handlers
    handleSearchChange,
    handleStatusChange,
    handleRoleChange,
    resetFilters
  };
};