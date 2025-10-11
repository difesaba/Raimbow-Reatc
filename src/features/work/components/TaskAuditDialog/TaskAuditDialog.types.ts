/**
 * Props for TaskAuditDialog component
 */
export interface TaskAuditDialogProps {
  /**
   * Controls dialog visibility
   */
  open: boolean;

  /**
   * Task ID to fetch audit information for
   */
  taskId: number | null;

  /**
   * Callback when dialog is closed
   */
  onClose: () => void;
}
