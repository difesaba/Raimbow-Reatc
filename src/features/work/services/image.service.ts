import { apiService } from '../../../config/services/apiService';
import type { ImageUploadResponse } from '../interfaces/work.interfaces';

/**
 * 🖼️ Servicio para manejo de subida de imágenes
 * Utiliza apiService centralizado con soporte para FormData
 */
export class ImageService {
  private static readonly BASE_PATH = '/api/uploadimg';

  /**
   * 📤 Subir imagen al servidor
   * POST /api/uploadimg/
   *
   * @param file - Archivo de imagen a subir
   * @param fieldName - Nombre del campo en FormData (default: 'archivo')
   * @returns Respuesta con URL/información de la imagen subida
   * @throws Error con mensaje descriptivo si la petición falla
   *
   * Uso:
   * ```typescript
   * const file = event.target.files[0];
   * const response = await ImageService.uploadImage(file);
   * console.log('Image URL:', response.url);
   * ```
   */
  static async uploadImage(
    file: File,
    fieldName: string = 'archivo'
  ): Promise<ImageUploadResponse> {
    try {
      // 📝 Validaciones básicas
      if (!file) {
        throw new Error('No se proporcionó ningún archivo');
      }

      // 🔍 Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // 📦 Crear FormData
      const formData = new FormData();
      formData.append(fieldName, file);

      console.log('📤 Uploading image:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        fileType: file.type,
        fieldName
      });

      // 📡 Enviar petición con headers apropiados para FormData
      const response = await apiService.post(
        this.BASE_PATH,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('✅ Image uploaded successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string }; status?: number }; message?: string }).response?.data?.message ||
                          (error as { message?: string }).message ||
                          'Error al subir imagen';

      console.error('❌ Error uploading image:', {
        endpoint: this.BASE_PATH,
        fileName: file?.name,
        error: errorMessage,
        status: (error as { response?: { status?: number } }).response?.status
      });

      throw new Error(errorMessage);
    }
  }

  /**
   * 📤 Subir múltiples imágenes al servidor
   * POST /api/uploadimg/ (múltiples veces)
   *
   * @param files - Array de archivos a subir
   * @param fieldName - Nombre del campo en FormData (default: 'archivo')
   * @returns Array de respuestas con URLs/información de las imágenes
   * @throws Error con mensaje descriptivo si alguna petición falla
   *
   * Uso:
   * ```typescript
   * const files = Array.from(event.target.files);
   * const responses = await ImageService.uploadMultipleImages(files);
   * console.log('Image URLs:', responses.map(r => r.url));
   * ```
   */
  static async uploadMultipleImages(
    files: File[],
    fieldName: string = 'archivo'
  ): Promise<ImageUploadResponse[]> {
    try {
      if (!files || files.length === 0) {
        throw new Error('No se proporcionaron archivos');
      }

      console.log(`📤 Uploading ${files.length} images...`);

      // 🔄 Subir todas las imágenes en paralelo
      const uploadPromises = files.map(file =>
        this.uploadImage(file, fieldName)
      );

      const responses = await Promise.all(uploadPromises);

      console.log(`✅ ${responses.length} images uploaded successfully`);
      return responses;
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Error al subir imágenes';

      console.error('❌ Error uploading multiple images:', {
        filesCount: files?.length,
        error: errorMessage
      });

      throw new Error(errorMessage);
    }
  }

  // ==================== MÉTODOS HELPER ====================

  /**
   * 🔍 Validar tipo de archivo de imagen
   * @param file - Archivo a validar
   * @returns true si es imagen válida
   */
  static isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  /**
   * 📏 Validar tamaño de archivo (en MB)
   * @param file - Archivo a validar
   * @param maxSizeMB - Tamaño máximo en MB (default: 5)
   * @returns true si el tamaño es válido
   */
  static isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * ✅ Validar imagen completa (tipo + tamaño)
   * @param file - Archivo a validar
   * @param maxSizeMB - Tamaño máximo en MB (default: 5)
   * @returns Objeto con resultado de validación
   */
  static validateImage(file: File, maxSizeMB: number = 5): {
    isValid: boolean;
    error?: string;
  } {
    if (!file) {
      return { isValid: false, error: 'No se proporcionó archivo' };
    }

    if (!this.isValidImageFile(file)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)'
      };
    }

    if (!this.isValidFileSize(file, maxSizeMB)) {
      return {
        isValid: false,
        error: `El archivo excede el tamaño máximo de ${maxSizeMB}MB`
      };
    }

    return { isValid: true };
  }

  /**
   * 🖼️ Crear URL de preview de imagen (para mostrar antes de subir)
   * @param file - Archivo de imagen
   * @returns URL de objeto para preview
   */
  static createPreviewURL(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * 🗑️ Liberar URL de preview (llamar cuando ya no se necesite)
   * @param url - URL de objeto a liberar
   */
  static revokePreviewURL(url: string): void {
    URL.revokeObjectURL(url);
  }
}
