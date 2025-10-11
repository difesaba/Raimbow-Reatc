import type { WorkReport, LotDetail } from '../../interfaces/work.interfaces';

export interface LotDetailDialogProps {
  /** Whether the dialog is open */
  open: boolean;

  /** The lot basic info (for header) */
  lot: WorkReport | null;

  /** Array of lot details with tasks */
  lotDetails: LotDetail[] | null;

  /** Whether lot details are loading */
  isLoading?: boolean;

  /** Callback when dialog is closed */
  onClose: () => void;
}
