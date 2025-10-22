import type { LotDetail } from '../../interfaces/work.interfaces';

/**
 * Props para TaskDetailDialog
 */
export interface TaskDetailDialogProps {
  open: boolean;
  task: LotDetail | any | null; // Accept both LotDetail and WorkAssignment types
  onClose: () => void;
  onEdit?: () => void;
  onAssignManager?: () => void;
  onEditDate?: () => void;
  onVerifyChange?: (task: LotDetail) => Promise<void>;
}
