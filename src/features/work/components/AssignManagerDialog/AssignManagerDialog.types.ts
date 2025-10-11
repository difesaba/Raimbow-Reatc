import type { Work } from '../../interfaces/work.interfaces';

/**
 * Extended Work interface with additional display information
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
}

/**
 * Manager interface for manager selection
 */
export interface Manager {
  id: number;
  name: string;
  email: string;
  department: string;
  available: boolean;
}

/**
 * Props for AssignManagerDialog component
 */
export interface AssignManagerDialogProps {
  /**
   * Controls dialog visibility
   */
  open: boolean;

  /**
   * Work assignment to assign manager to
   */
  work: WorkAssignment | null;

  /**
   * Callback when dialog is closed
   */
  onClose: () => void;

  /**
   * Callback when manager is confirmed
   * Receives the full Manager object for optimistic UI updates
   */
  onConfirm: (manager: Manager) => Promise<void>;
}