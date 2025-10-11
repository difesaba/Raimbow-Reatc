import type { WorkReport } from '../../interfaces/work.interfaces';

/**
 * ⚙️ Props para componente LotsTable
 */
export interface LotsTableProps {
  /** Lista de lotes a mostrar */
  lots: WorkReport[];

  /** Indica si está cargando */
  isLoading?: boolean;

  /** Callback para exportar datos */
  onExport?: () => void;

  /** Callback para ver detalles de un lote */
  onViewDetail?: (lot: WorkReport) => void;
}
