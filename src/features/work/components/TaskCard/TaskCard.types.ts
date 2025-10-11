import type { LotDetail } from '../../interfaces/work.interfaces';

/**
 * Props del componente TaskCard
 */
export interface TaskCardProps {
  /**
   * Datos de la tarea a mostrar
   */
  task: LotDetail;

  /**
   * Callback al hacer click en la tarjeta (opcional)
   */
  onClick?: (task: LotDetail) => void;
}
