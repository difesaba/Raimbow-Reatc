import type { Work } from '../../interfaces/work.interfaces';

/**
 * Extended Work interface with display information
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
 * Props for EditScheduledDateDialog component
 */
export interface EditScheduledDateDialogProps {
  /**
   * Controls dialog visibility
   */
  open: boolean;

  /**
   * Work assignment to edit date
   */
  work: WorkAssignment | null;

  /**
   * Callback when dialog is closed
   */
  onClose: () => void;

  /**
   * Callback when date change is confirmed
   * Receives new StartDate and EndDate calculated from selected date and Days
   */
  onConfirm: (newStartDate: string, newEndDate: string) => Promise<void>;
}
