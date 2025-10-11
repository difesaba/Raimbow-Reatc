/**
 * 📦 Barrel export para interfaces del módulo Work
 * Facilita las importaciones en otros archivos
 */

export type {
  Work,
  CreateWorkDTO,
  UpdateWorkDTO,
  WorkReport,
  WorkDay,
  WorkReportFilters,
  WorkDayFilters,
  DeleteWorkParams,
  ImageUploadResponse
} from './work.interfaces';

export { WorkStatus } from './work.interfaces';

export type {
  Subdivision,
  CreateSubdivisionDTO,
  UpdateSubdivisionDTO,
  SubdivisionFilters,
  SubdivisionOption
} from './subdivision.interfaces';
