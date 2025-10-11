import { apiService } from '../../../config/services/apiService';
import type {
  Role,
  RoleAPIResponse,
  CreateRoleDTO,
  UpdateRoleDTO
} from '../models';

/**
 * 🎭 Servicio para manejo de operaciones de Roles
 * Utiliza apiService centralizado para todas las llamadas HTTP
 *
 * 📝 Endpoints disponibles:
 * - GET  /api/role/     → Obtener todos los roles
 * - POST /api/role/     → Crear nuevo rol
 * - PUT  /api/role/:id  → Actualizar rol (futuro)
 * - DELETE /api/role/:id → Eliminar rol (futuro)
 */
export class RoleService {
  private static readonly BASE_PATH = '/api/role';

  /**
   * 📋 Obtener todos los roles del sistema
   * GET /api/role/
   *
   * @returns Array de roles disponibles
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * 📝 Notas:
   * - El endpoint requiere autenticación JWT (header x-token)
   * - El interceptor de axios lo inyecta automáticamente
   * - Normaliza diferentes formatos de respuesta del backend
   */
  static async getRoles(): Promise<Role[]> {
    try {
      console.log('📋 Fetching all roles');

      const response = await apiService.get(`${this.BASE_PATH}/`);

      // ✅ Normalizar respuesta del backend (puede venir en diferentes formatos)
      let apiRoles: RoleAPIResponse[] = [];

      if (Array.isArray(response.data)) {
        // Opción 1: Array directo
        apiRoles = response.data;
      } else if (response.data?.roles && Array.isArray(response.data.roles)) {
        // Opción 2: Objeto con propiedad 'roles'
        apiRoles = response.data.roles;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Opción 3: Objeto con propiedad 'data'
        apiRoles = response.data.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        apiRoles = [];
      }

      // 🔄 Mapear respuesta del backend al modelo del frontend
      // Transforma "Name" → "RoleName" y descarta "operi"
      const roles: Role[] = apiRoles.map(apiRole => this.mapAPIResponseToRole(apiRole));

      console.log(`✅ ${roles.length} roles cargados exitosamente`);
      return roles;
    } catch (error: any) {
      // 📝 Extraer mensaje de error del backend si está disponible
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.msg ||
                          error.message ||
                          'Error al obtener roles';

      console.error('❌ Error fetching roles:', {
        endpoint: `${this.BASE_PATH}/`,
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * ➕ Crear nuevo rol en el sistema
   * POST /api/role/
   *
   * @param roleData - Datos del nuevo rol a crear
   * @returns Rol creado con su ID asignado
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * 📝 Notas:
   * - El endpoint requiere autenticación JWT (header x-token)
   * - Requiere middleware validateJWT y existRole en backend
   * - Valida que el nombre del rol sea único antes de crear
   */
  static async createRole(roleData: CreateRoleDTO): Promise<Role> {
    try {
      // 📝 Validaciones básicas antes de enviar al backend
      if (!roleData.RoleName || roleData.RoleName.trim().length < 3) {
        throw new Error('El nombre del rol es requerido y debe tener al menos 3 caracteres');
      }

      // ✅ Sanitizar datos
      const sanitizedData: CreateRoleDTO = {
        RoleName: roleData.RoleName.trim(),
        Description: roleData.Description?.trim(),
        Active: roleData.Active ?? true, // Default: activo
        Permissions: roleData.Permissions || [],
        AccessLevel: roleData.AccessLevel ?? 1 // Default: nivel 1
      };

      console.log('➕ Creating new role:', sanitizedData);

      const response = await apiService.post(`${this.BASE_PATH}/`, sanitizedData);

      // ✅ Normalizar respuesta del backend
      let apiRole: RoleAPIResponse;

      if (response.data?.role) {
        apiRole = response.data.role;
      } else if (response.data?.RoleId) {
        apiRole = response.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        apiRole = response.data;
      }

      // 🔄 Mapear respuesta del backend al modelo del frontend
      // Transforma "Name" → "RoleName" y descarta "operi"
      const createdRole: Role = this.mapAPIResponseToRole(apiRole);

      console.log('✅ Role created successfully:', createdRole);
      return createdRole;
    } catch (error: any) {
      // 📝 Extraer mensaje de error del backend
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.msg ||
                          error.message ||
                          'Error al crear rol';

      console.error('❌ Error creating role:', {
        endpoint: `${this.BASE_PATH}/`,
        roleData,
        error: errorMessage,
        status: error.response?.status,
        details: error.response?.data
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * ✏️ Actualizar rol existente (FUTURO)
   * PUT /api/role/:id
   *
   * @param roleId - ID del rol a actualizar
   * @param roleData - Datos actualizados del rol
   * @returns Rol actualizado
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * ⚠️ NOTA: Este endpoint aún no está implementado en el backend
   * Se mantiene como placeholder para futura implementación
   */
  static async updateRole(roleId: number, roleData: UpdateRoleDTO): Promise<Role> {
    try {
      // 📝 Validaciones básicas
      if (!roleId || roleId <= 0) {
        throw new Error('RoleId es requerido y debe ser mayor a 0');
      }

      console.log('✏️ Updating role:', { roleId, roleData });

      const response = await apiService.put(`${this.BASE_PATH}/${roleId}`, roleData);

      console.log('✅ Role updated successfully:', response.data);
      return response.data.role || response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.msg ||
                          error.message ||
                          `Error al actualizar rol ${roleId}`;

      console.error('❌ Error updating role:', {
        endpoint: `${this.BASE_PATH}/${roleId}`,
        roleId,
        roleData,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🗑️ Eliminar rol (FUTURO)
   * DELETE /api/role/:id
   *
   * @param roleId - ID del rol a eliminar
   * @returns true si la eliminación fue exitosa
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * ⚠️ NOTA: Este endpoint aún no está implementado en el backend
   * Se mantiene como placeholder para futura implementación
   */
  static async deleteRole(roleId: number): Promise<boolean> {
    try {
      // 📝 Validaciones básicas
      if (!roleId || roleId <= 0) {
        throw new Error('RoleId es requerido y debe ser mayor a 0');
      }

      console.log('🗑️ Deleting role:', { roleId });

      await apiService.delete(`${this.BASE_PATH}/${roleId}`);

      console.log('✅ Role deleted successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.msg ||
                          error.message ||
                          `Error al eliminar rol ${roleId}`;

      console.error('❌ Error deleting role:', {
        endpoint: `${this.BASE_PATH}/${roleId}`,
        roleId,
        error: errorMessage,
        status: error.response?.status
      });

      throw new Error(errorMessage);
    }
  }

  // ==================== MÉTODOS HELPER ====================

  /**
   * 🔄 Mapear respuesta del backend al modelo del frontend
   * Transforma los datos del backend al formato esperado por la aplicación
   *
   * @param apiResponse - Respuesta del backend
   * @returns Rol normalizado para uso en el frontend
   *
   * 📝 Transformaciones:
   * - Name → RoleName (el backend usa "Name", el frontend "RoleName")
   * - operi → descartado (campo no utilizado en el frontend)
   */
  static mapAPIResponseToRole(apiResponse: RoleAPIResponse): Role {
    return {
      RoleId: apiResponse.RoleId,
      RoleName: apiResponse.Name, // ✅ Mapeo principal: Name → RoleName
      Description: apiResponse.Description,
      Active: apiResponse.Active,
      CreatedAt: apiResponse.CreatedAt,
      UpdatedAt: apiResponse.UpdatedAt,
      Permissions: apiResponse.Permissions,
      AccessLevel: apiResponse.AccessLevel
      // 📝 Nota: "operi" se descarta intencionalmente
    };
  }

  /**
   * 📝 Validar nombre de rol
   * @param roleName - Nombre a validar
   * @returns Objeto con validación y mensaje
   */
  static validateRoleName(roleName: string): { isValid: boolean; message: string } {
    if (!roleName || roleName.trim().length === 0) {
      return { isValid: false, message: 'El nombre del rol es requerido' };
    }

    if (roleName.trim().length < 3) {
      return { isValid: false, message: 'El nombre del rol debe tener al menos 3 caracteres' };
    }

    if (roleName.length > 50) {
      return { isValid: false, message: 'El nombre del rol no debe exceder 50 caracteres' };
    }

    // ✅ Validar que no contenga caracteres especiales peligrosos
    const dangerousChars = /[<>{}[\]\\\/]/;
    if (dangerousChars.test(roleName)) {
      return { isValid: false, message: 'El nombre del rol contiene caracteres no permitidos' };
    }

    return { isValid: true, message: 'Nombre válido' };
  }

  /**
   * 🔍 Buscar rol por ID en un array de roles
   * @param roles - Array de roles
   * @param roleId - ID a buscar
   * @returns Rol encontrado o undefined
   */
  static findRoleById(roles: Role[], roleId: number): Role | undefined {
    return roles.find(role => role.RoleId === roleId);
  }

  /**
   * 🔍 Buscar rol por nombre en un array de roles
   * @param roles - Array de roles
   * @param roleName - Nombre a buscar (case-insensitive)
   * @returns Rol encontrado o undefined
   */
  static findRoleByName(roles: Role[], roleName: string): Role | undefined {
    const normalizedName = roleName.trim().toLowerCase();
    return roles.find(role => role.RoleName.toLowerCase() === normalizedName);
  }

  /**
   * 📊 Validar nivel de acceso
   * @param accessLevel - Nivel de acceso a validar
   * @returns true si el nivel es válido (1-10)
   */
  static isValidAccessLevel(accessLevel?: number): boolean {
    if (accessLevel === undefined) return true; // Es opcional
    return accessLevel >= 1 && accessLevel <= 10;
  }
}
