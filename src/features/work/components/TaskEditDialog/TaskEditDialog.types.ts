import type { WorkAssignment } from '../WorkAssignmentTable/WorkAssignmentTable.types';

/**
 * Manager interface for task assignment
 */
export interface Manager {
  id: number;
  name: string;
  email: string;
  department: string;
  available: boolean;
}

/**
 * Form data sent when confirming task edit
 */
export interface TaskEditFormData {
  manager: Manager;
  startDate: string; // Format: YYYY-MM-DD
  endDate: string;   // Format: YYYY-MM-DD
  completed: boolean;
  observations: string; // Observaciones de la tarea
}

/**
 * Props for TaskEditDialog component
 */
export interface TaskEditDialogProps {
  /**
   * Controls dialog visibility
   */
  open: boolean;

  /**
   * Work assignment to edit
   */
  work: WorkAssignment | null;

  /**
   * Callback when dialog is closed without saving
   */
  onClose: () => void;

  /**
   * Callback when save button is clicked
   * Receives the form data with manager, dates, and completed status
   */
  onConfirm: (data: TaskEditFormData) => Promise<void>;
}
