import { apiService } from '../../../config/services/apiService';
import type {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  Role,
  Company
} from '../interfaces/user.interfaces';

/**
 * 👤 Servicio para manejo de operaciones de Usuario
 * Utiliza apiService centralizado para todas las llamadas HTTP
 */
export class UserService {
  private static readonly BASE_PATH = '/api/user';

  /**
   * 📋 Obtener todos los usuarios
   * GET /api/user/
   *
   * @returns Array de usuarios
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getUsers(): Promise<User[]> {
    try {
      console.log('📋 Fetching all users');

      const response = await apiService.get(`${this.BASE_PATH}/`);

      // Normalizar respuesta del backend
      let users: User[] = [];

      if (Array.isArray(response.data)) {
        // Opción 1: Array directo
        users = response.data;
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        // Opción 2: Objeto con propiedad 'users'
        users = response.data.users;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Opción 3: Objeto con propiedad 'data'
        users = response.data.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        users = [];
      }

      console.log(`✅ ${users.length} usuarios cargados exitosamente`);
      return users;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error al obtener usuarios';

      console.error('❌ Error fetching users:', {
        endpoint: `${this.BASE_PATH}/`,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * ➕ Crear nuevo usuario
   * POST /api/user/
   *
   * @param userData - Datos del nuevo usuario
   * @returns Usuario creado
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async createUser(userData: CreateUserDTO): Promise<User> {
    try {
      // 📝 Validaciones básicas
      if (!userData.FirstName || userData.FirstName.length < 2) {
        throw new Error('El nombre es requerido y debe tener al menos 2 caracteres');
      }
      if (!userData.LastName || userData.LastName.length < 2) {
        throw new Error('El apellido es requerido y debe tener al menos 2 caracteres');
      }
      if (!userData.Email || !this.isValidEmail(userData.Email)) {
        throw new Error('El email es requerido y debe ser válido');
      }
      if (!userData.Password || userData.Password.length < 8) {
        throw new Error('La contraseña es requerida y debe tener al menos 8 caracteres');
      }
      if (userData.Salary < 0) {
        throw new Error('El salario debe ser un número positivo');
      }

      console.log('➕ Creating new user:', { ...userData, Password: '***' });

      // Mapear datos al formato del backend
      const backendData = this.mapCreateUserToBackend(userData);

      const response = await apiService.post(`${this.BASE_PATH}/`, backendData);

      console.log('✅ User created successfully:', { ...response.data, Password: undefined });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error al crear usuario';

      console.error('❌ Error creating user:', {
        endpoint: `${this.BASE_PATH}/`,
        userData: { ...userData, Password: '***' },
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * ✏️ Actualizar usuario existente
   * PUT /api/user/:id
   *
   * @param userId - ID del usuario a actualizar
   * @param userData - Datos actualizados del usuario
   * @returns Usuario actualizado
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async updateUser(userId: number, userData: UpdateUserDTO): Promise<User> {
    try {
      // 📝 Validaciones básicas
      if (!userId || userId <= 0) {
        throw new Error('UserId es requerido y debe ser mayor a 0');
      }
      if (!userData.FirstName || userData.FirstName.length < 2) {
        throw new Error('El nombre es requerido y debe tener al menos 2 caracteres');
      }
      if (!userData.LastName || userData.LastName.length < 2) {
        throw new Error('El apellido es requerido y debe tener al menos 2 caracteres');
      }
      if (!userData.Email || !this.isValidEmail(userData.Email)) {
        throw new Error('El email es requerido y debe ser válido');
      }
      if (userData.Password && userData.Password !== '-1' && userData.Password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }
      if (userData.Salary < 0) {
        throw new Error('El salario debe ser un número positivo');
      }

      console.log('✏️ Updating user:', { userId, userData: { ...userData, Password: userData.Password ? '***' : undefined } });

      // Mapear datos al formato del backend
      const backendData = this.mapUpdateUserToBackend(userData);

      const response = await apiService.put(`${this.BASE_PATH}/${userId}`, backendData);

      console.log('✅ User updated successfully:', { ...response.data, Password: undefined });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          `Error al actualizar usuario ${userId}`;

      console.error('❌ Error updating user:', {
        endpoint: `${this.BASE_PATH}/${userId}`,
        userId,
        userData: { ...userData, Password: userData.Password ? '***' : undefined },
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🔑 Cambiar contraseña de usuario
   * PUT /api/user/:id/password
   *
   * @param passwordData - Datos del cambio de contraseña
   * @returns true si el cambio fue exitoso
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async changePassword(passwordData: {
    UserId: number;
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<boolean> {
    try {
      // 📝 Validaciones básicas
      if (!passwordData.UserId || passwordData.UserId <= 0) {
        throw new Error('UserId es requerido y debe ser mayor a 0');
      }
      if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
        throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      console.log('🔑 Changing password for user:', { userId: passwordData.UserId });

      await apiService.put(`${this.BASE_PATH}/${passwordData.UserId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      console.log('✅ Password changed successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          `Error al cambiar contraseña del usuario ${passwordData.UserId}`;

      console.error('❌ Error changing password:', {
        endpoint: `${this.BASE_PATH}/${passwordData.UserId}/password`,
        userId: passwordData.UserId,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🗑️ Eliminar usuario
   * DELETE /api/user/:id
   *
   * @param userId - ID del usuario a eliminar
   * @returns true si la eliminación fue exitosa
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async deleteUser(userId: number): Promise<boolean> {
    try {
      // 📝 Validaciones básicas
      if (!userId || userId <= 0) {
        throw new Error('UserId es requerido y debe ser mayor a 0');
      }

      console.log('🗑️ Deleting user:', { userId });

      await apiService.delete(`${this.BASE_PATH}/${userId}`);

      console.log('✅ User deleted successfully');
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

  /**
   * 📋 Obtener roles disponibles
   * GET /api/role/
   *
   * @returns Array de roles
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getRoles(): Promise<Role[]> {
    try {
      console.log('📋 Fetching roles');

      const response = await apiService.get('/api/role/');

      // Normalizar respuesta del backend
      let roles: Role[] = [];

      if (Array.isArray(response.data)) {
        roles = response.data;
      } else if (response.data?.roles && Array.isArray(response.data.roles)) {
        roles = response.data.roles;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        roles = response.data.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        roles = [];
      }

      console.log(`✅ ${roles.length} roles cargados exitosamente`);
      return roles;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error al obtener roles';

      console.error('❌ Error fetching roles:', {
        endpoint: '/api/role/',
        error: errorMessage,
        status: error.response?.status
      });

      // Return default roles if API fails
      return [
        { RoleId: 1, RoleName: 'Administrador' },
        { RoleId: 2, RoleName: 'Usuario' },
        { RoleId: 3, RoleName: 'Supervisor' }
      ];
    }
  }

  /**
   * 📋 Obtener empresas disponibles
   * GET /api/company/
   *
   * @returns Array de empresas
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getCompanies(): Promise<Company[]> {
    try {
      console.log('📋 Fetching companies');

      const response = await apiService.get('/api/company/');

      // Normalizar respuesta del backend
      let companies: Company[] = [];

      if (Array.isArray(response.data)) {
        companies = response.data;
      } else if (response.data?.companies && Array.isArray(response.data.companies)) {
        companies = response.data.companies;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        companies = response.data.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        companies = [];
      }

      console.log(`✅ ${companies.length} empresas cargadas exitosamente`);
      return companies;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error al obtener empresas';

      console.error('❌ Error fetching companies:', {
        endpoint: '/api/company/',
        error: errorMessage,
        status: error.response?.status
      });

      // Return default companies if API fails
      return [
        { CompanyId: 'rainbow', CompanyName: 'Rainbow Construction', Active: true },
        { CompanyId: 'subsidiary1', CompanyName: 'Subsidiary 1', Active: true },
        { CompanyId: 'subsidiary2', CompanyName: 'Subsidiary 2', Active: true }
      ];
    }
  }

  // ==================== MÉTODOS HELPER ====================

  /**
   * 🔄 Mapear datos de creación al formato del backend
   * Transforma PascalCase a camelCase según especificaciones del backend
   * @param userData - Datos del usuario en formato frontend
   * @returns Datos en formato backend
   */
  private static mapCreateUserToBackend(userData: CreateUserDTO) {
    return {
      firstName: userData.FirstName,
      lastName: userData.LastName,
      email: userData.Email,
      password: userData.Password,
      role: userData.RoleId,
      salary: userData.Salary,
      discount: userData.DiscountHour,
      isRainbow: userData.isRainbow || false,
      leader: userData.Leader || false,
      img: userData.Img || ''
    };
  }

  /**
   * 🔄 Mapear datos de actualización al formato del backend
   * Transforma PascalCase a camelCase según especificaciones del backend
   * @param userData - Datos del usuario en formato frontend
   * @returns Datos en formato backend
   */
  private static mapUpdateUserToBackend(userData: UpdateUserDTO) {
    return {
      firstName: userData.FirstName,
      lastName: userData.LastName,
      email: userData.Email,
      password: userData.Password,
      role: userData.RoleId,
      salary: userData.Salary,
      discount: userData.DiscountHour,
      status: userData.Status,
      isRainbow: userData.isRainbow,
      leader: userData.Leader,
      img: userData.Img
    };
  }

  /**
   * 📝 Validar formato de email
   * @param email - Email a validar
   * @returns true si el formato es válido
   */
  static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * 🔐 Validar fortaleza de contraseña
   * @param password - Contraseña a validar
   * @returns Objeto con validación y mensaje
   */
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 8) {
      return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
    }
    if (!/\d/.test(password)) {
      return { isValid: false, message: 'La contraseña debe contener al menos un número' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'La contraseña debe contener al menos una letra minúscula' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
    }
    return { isValid: true, message: 'Contraseña válida' };
  }
}