import type { LotDetail } from '../../interfaces/work.interfaces';

/**
 * Props del componente TaskBar
 */
export interface TaskBarProps {
  /**
   * Datos de la tarea a mostrar
   */
  task: LotDetail;

  /**
   * Columna de inicio en el grid (1-7)
   * 1 = Lunes, 7 = Domingo
   */
  gridColumnStart: number;

  /**
   * Número de columnas que ocupa (días de duración)
   */
  gridColumnSpan: number;

  /**
   * Callback al hacer click en la barra (opcional)
   * Recibe la tarea y el evento del mouse
   */
  onClick?: (task: LotDetail, event: React.MouseEvent) => void;
}
