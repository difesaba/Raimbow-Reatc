import type { Subdivision } from '../../../interfaces/subdivision.interfaces';
import type { User } from '../../../../users/interfaces/user.interfaces';

/**
 * Filter status type (assignment filter)
 */
export type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed';

/**
 * Props for WeeklyScheduleFilters component
 */
export interface WeeklyScheduleFiltersProps {
  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Current filter status (assignment)
   */
  filterStatus: FilterStatus;

  /**
   * Callback when filter status changes
   */
  onFilterChange: (filter: FilterStatus) => void;

  /**
   * Current progress filter (tipo de trabajo)
   */
  progressFilter: string;

  /**
   * Callback when progress filter changes
   */
  onProgressFilterChange: (value: string) => void;

  /**
   * Available progress types (tipos de trabajo únicos)
   */
  availableProgress: string[];

  /**
   * Lista de subdivisiones disponibles
   */
  subdivisions: Subdivision[];

  /**
   * Subdivisión seleccionada (null = todas)
   */
  selectedSubdivision: Subdivision | null;

  /**
   * Callback cuando cambia la subdivisión seleccionada
   */
  onSubdivisionChange: (subdivision: Subdivision | null) => void;

  /**
   * Lista de leaders disponibles (usuarios con Leader = true)
   */
  leaders: User[];

  /**
   * Leader seleccionado (null = todos)
   */
  selectedLeader: User | null;

  /**
   * Callback cuando cambia el leader seleccionado
   */
  onLeaderChange: (leader: User | null) => void;
}
