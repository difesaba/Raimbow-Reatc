import { apiService } from '../../../config/services/apiService';
import type { User, UserFilters, UserDTO } from '../interfaces/user.interfaces';

/**
 * 👤 Servicio para manejo de operaciones de usuarios
 * Utiliza apiService centralizado para todas las llamadas HTTP
 *
 * 📝 Notas importantes:
 * - La interface User es una suposición basada en el código legacy
 * - Debe verificarse la estructura real del API response
 * - El endpoint /api/user se asume basado en patrones comunes
 */
export class UserService {
  private static readonly BASE_PATH = '/api/user';

  /**
   * 📋 Obtener lista completa de usuarios
   * @returns Array con todos los usuarios del sistema
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * NOTA: Este endpoint devuelve TODOS los usuarios.
   * En producción podría necesitar paginación.
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiService.get(this.BASE_PATH);
      return response.data;
    } catch (error: any) {
      // 📝 Extraer mensaje de error del backend si está disponible
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error al obtener lista de usuarios';

      console.error('❌ Error fetching users:', {
        endpoint: this.BASE_PATH,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🔍 Obtener un usuario específico por ID
   * @param userId - ID del usuario a consultar
   * @returns Datos del usuario
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getUserById(userId: number): Promise<User> {
    try {
      if (!userId || userId <= 0) {
        throw new Error('ID de usuario inválido');
      }

      const response = await apiService.get(`${this.BASE_PATH}/${userId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          `Error al obtener datos del usuario ${userId}`;

      console.error('❌ Error fetching user by ID:', {
        endpoint: `${this.BASE_PATH}/${userId}`,
        userId,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🔍 Buscar usuarios con filtros
   * @param filters - Filtros de búsqueda opcionales
   * @returns Array de usuarios que cumplen los criterios
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * NOTA: Este método asume que el backend soporta query parameters.
   * Debe verificarse la implementación real del API.
   */
  static async searchUsers(filters?: UserFilters): Promise<User[]> {
    try {
      // 🔧 Construir query params
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.role) {
        params.append('role', filters.role);
      }
      if (filters?.activeOnly !== undefined) {
        params.append('active', filters.activeOnly.toString());
      }
      if (filters?.department) {
        params.append('department', filters.department);
      }

      const queryString = params.toString();
      const url = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

      const response = await apiService.get(url);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error al buscar usuarios';

      console.error('❌ Error searching users:', {
        endpoint: this.BASE_PATH,
        filters,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * ➕ Crear un nuevo usuario
   * @param userData - Datos del usuario a crear
   * @returns Usuario creado con su ID asignado
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * NOTA: Este método asume que el backend soporta POST.
   * Debe verificarse la implementación real del API.
   */
  static async createUser(userData: UserDTO): Promise<User> {
    try {
      const response = await apiService.post(this.BASE_PATH, userData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error al crear usuario';

      console.error('❌ Error creating user:', {
        endpoint: this.BASE_PATH,
        userData,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * ✏️ Actualizar un usuario existente
   * @param userId - ID del usuario a actualizar
   * @param userData - Datos actualizados del usuario
   * @returns Usuario actualizado
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * NOTA: Este método asume que el backend soporta PUT.
   * Debe verificarse la implementación real del API.
   */
  static async updateUser(userId: number, userData: Partial<UserDTO>): Promise<User> {
    try {
      if (!userId || userId <= 0) {
        throw new Error('ID de usuario inválido');
      }

      const response = await apiService.put(
        `${this.BASE_PATH}/${userId}`,
        userData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          `Error al actualizar usuario ${userId}`;

      console.error('❌ Error updating user:', {
        endpoint: `${this.BASE_PATH}/${userId}`,
        userId,
        userData,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🗑️ Eliminar un usuario
   * @param userId - ID del usuario a eliminar
   * @returns true si la eliminación fue exitosa
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * NOTA: Este método asume que el backend soporta DELETE.
   * Debe verificarse la implementación real del API.
   */
  static async deleteUser(userId: number): Promise<boolean> {
    try {
      if (!userId || userId <= 0) {
        throw new Error('ID de usuario inválido');
      }

      await apiService.delete(`${this.BASE_PATH}/${userId}`);
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          `Error al eliminar usuario ${userId}`;

      console.error('❌ Error deleting user:', {
        endpoint: `${this.BASE_PATH}/${userId}`,
        userId,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  // ==================== MÉTODOS HELPER ====================

  /**
   * 🔄 Convertir User a UserOption para selectores
   * @param user - Usuario a convertir
   * @returns Objeto UserOption para usar en autocomplete/select
   */
  static toUserOption(user: User) {
    return {
      value: user.UserId,
      label: `${user.FirstName} ${user.LastName}`,
      data: {
        firstName: user.FirstName,
        lastName: user.LastName,
        role: user.Role,
        department: user.Department
      }
    };
  }

  /**
   * 🔄 Convertir array de Users a UserOptions
   * @param users - Array de usuarios
   * @returns Array de UserOptions para selectores
   */
  static toUserOptions(users: User[]) {
    return users.map(user => this.toUserOption(user));
  }

  /**
   * 🔍 Filtrar usuarios localmente (útil para cache)
   * @param users - Lista de usuarios
   * @param searchTerm - Término de búsqueda
   * @returns Usuarios filtrados
   */
  static filterUsersLocally(users: User[], searchTerm: string): User[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return users;
    }

    const term = searchTerm.toLowerCase().trim();
    return users.filter(user => {
      const fullName = `${user.FirstName} ${user.LastName}`.toLowerCase();
      const email = user.Email?.toLowerCase() || '';
      const department = user.Department?.toLowerCase() || '';

      return fullName.includes(term) ||
             email.includes(term) ||
             department.includes(term);
    });
  }
}