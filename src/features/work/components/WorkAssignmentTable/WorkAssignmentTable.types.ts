import type { Work } from '../../interfaces/work.interfaces';

/**
 * Extended Work interface with manager and client information
 */
export interface WorkAssignment extends Work {
  ManagerName?: string;
  ClientName?: string;
  WorkName?: string;
  ScheduledDate?: string;
  Number?: string;
  Days?: number;
  SFQuantity?: number | string;
  Colors?: string;
  DoorDesc?: string;
  StainDesc?: string;
  Address?: string; // Dirección de la obra/lote
  UserCreate?: number;
  UserUpdate?: number;
}

/**
 * Props for WorkAssignmentTable component
 */
export interface WorkAssignmentTableProps {
  /**
   * Array of work assignments to display
   */
  works: WorkAssignment[];

  /**
   * Loading state for the table
   */
  loading: boolean;

  /**
   * Callback when edit button is clicked
   * Opens unified edit dialog (manager + dates + completed)
   */
  onEdit: (work: WorkAssignment) => void;

  /**
   * Callback when view details button is clicked
   * Opens readonly detailed view
   */
  onViewDetails: (work: WorkAssignment) => void;

  /**
   * Callback when view audit button is clicked
   * Opens audit history dialog
   */
  onViewAudit: (work: WorkAssignment) => void;

  /**
   * Callback when delete button is clicked
   */
  onDeleteWork: (work: WorkAssignment) => void;
}