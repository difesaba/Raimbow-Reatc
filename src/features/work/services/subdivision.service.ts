import { apiService } from '../../../config/services/apiService';
import type {
  Subdivision,
  SubdivisionFilters,
  SubdivisionOption
} from '../interfaces/subdivision.interfaces';

/**
 * 🏘️ Servicio para manejo de operaciones de Subdivisiones
 * Utiliza apiService centralizado para todas las llamadas HTTP
 */
export class SubdivisionService {
  private static readonly BASE_PATH = '/api/subdivision';

  /**
   * 📋 Obtener todas las subdivisiones
   * GET /api/subdivision
   *
   * @returns Array con todas las subdivisiones
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getAllSubdivisions(): Promise<Subdivision[]> {
    try {
      console.log('📊 Fetching all subdivisions...');

      const response = await apiService.get(this.BASE_PATH);

      // Normalizar respuesta del backend (puede venir en diferentes formatos)
      let subdivisions: Subdivision[] = [];

      if (Array.isArray(response.data)) {
        // Opción 1: Array directo
        subdivisions = response.data;
      } else if (response.data?.subdivisions && Array.isArray(response.data.subdivisions)) {
        // Opción 2: Objeto con propiedad 'subdivisions'
        subdivisions = response.data.subdivisions;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Opción 3: Objeto con propiedad 'data'
        subdivisions = response.data.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        subdivisions = [];
      }

      console.log(`✅ ${subdivisions.length} subdivisions loaded successfully`);
      return subdivisions;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string }; status?: number }; message?: string }).response?.data?.message ||
                          (error as { message?: string }).message ||
                          'Error al obtener subdivisiones';

      console.error('❌ Error fetching subdivisions:', {
        endpoint: this.BASE_PATH,
        error: errorMessage,
        status: (error as { response?: { status?: number } }).response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 🔍 Obtener una subdivisión por ID
   * GET /api/subdivision/:id
   *
   * @param subdivisionId - ID de la subdivisión
   * @returns Datos de la subdivisión
   * @throws Error con mensaje descriptivo si la petición falla
   */
  static async getSubdivisionById(subdivisionId: number): Promise<Subdivision> {
    try {
      if (!subdivisionId || subdivisionId <= 0) {
        throw new Error('ID de subdivisión inválido');
      }

      const response = await apiService.get(
        `${this.BASE_PATH}/${subdivisionId}`
      );

      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string }; status?: number }; message?: string }).response?.data?.message ||
                          (error as { message?: string }).message ||
                          `Error al obtener subdivisión ${subdivisionId}`;

      console.error('❌ Error fetching subdivision by ID:', {
        endpoint: `${this.BASE_PATH}/${subdivisionId}`,
        subdivisionId,
        error: errorMessage,
        status: (error as { response?: { status?: number } }).response?.status
      });

      throw new Error(errorMessage);
    }
  }

  // ==================== MÉTODOS HELPER ====================

  /**
   * 🔄 Convertir Subdivision a SubdivisionOption para selectores
   * @param subdivision - Subdivisión a convertir
   * @returns Objeto SubdivisionOption para usar en autocomplete/select
   */
  static toSubdivisionOption(subdivision: Subdivision): SubdivisionOption {
    return {
      value: subdivision.SubdivisionId,
      label: subdivision.Name,
      data: {
        builderId: subdivision.BuilderId,
        supervisor: subdivision.Supervisor,
        lotsQuantity: subdivision.LotsQuantity
      }
    };
  }

  /**
   * 🔄 Convertir array de Subdivisions a SubdivisionOptions
   * @param subdivisions - Array de subdivisiones
   * @returns Array de SubdivisionOptions para selectores
   */
  static toSubdivisionOptions(subdivisions: Subdivision[]): SubdivisionOption[] {
    return subdivisions.map(subdivision => this.toSubdivisionOption(subdivision));
  }

  /**
   * 🔍 Filtrar subdivisiones localmente (útil para cache)
   * @param subdivisions - Lista de subdivisiones
   * @param searchTerm - Término de búsqueda
   * @returns Subdivisiones filtradas
   */
  static filterSubdivisionsLocally(
    subdivisions: Subdivision[],
    searchTerm: string
  ): Subdivision[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return subdivisions;
    }

    const term = searchTerm.toLowerCase().trim();
    return subdivisions.filter(subdivision => {
      const name = subdivision.Name?.toLowerCase() || '';
      const supervisor = subdivision.Supervisor?.toLowerCase() || '';
      const email = subdivision.Email?.toLowerCase() || '';

      return name.includes(term) ||
             supervisor.includes(term) ||
             email.includes(term);
    });
  }

  /**
   * 📊 Filtrar subdivisiones por criterios
   * @param subdivisions - Lista de subdivisiones
   * @param filters - Filtros a aplicar
   * @returns Subdivisiones filtradas
   */
  static applyFilters(
    subdivisions: Subdivision[],
    filters: SubdivisionFilters
  ): Subdivision[] {
    let filtered = subdivisions;

    // Filtro de búsqueda por texto
    if (filters.search) {
      filtered = this.filterSubdivisionsLocally(filtered, filters.search);
    }

    // Filtro por builder
    if (filters.builderId !== undefined && filters.builderId !== null) {
      filtered = filtered.filter(s => s.BuilderId === filters.builderId);
    }

    // Filtro por estado
    if (filters.status !== undefined && filters.status !== null) {
      filtered = filtered.filter(s => s.Status === filters.status);
    }

    // Filtro por tipo townhome
    if (filters.isTownHome !== undefined) {
      filtered = filtered.filter(s => s.IsTownHome === filters.isTownHome);
    }

    return filtered;
  }
}
