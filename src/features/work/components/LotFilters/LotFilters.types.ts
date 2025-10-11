import type { Subdivision } from '../../interfaces/subdivision.interfaces';

// Re-export Subdivision for use in other modules
export type { Subdivision };

/**
 * ⚙️ Props para componente LotFilters
 */
export interface LotFiltersProps {
  /** Lista de subdivisiones disponibles */
  subdivisions: Subdivision[];

  /** Subdivisión seleccionada */
  selectedSubdivision: Subdivision | null;

  /** Número de lote (opcional) */
  lotNumber: string;

  /** Callback al cambiar subdivisión */
  onSubdivisionChange: (subdivision: Subdivision | null) => void;

  /** Callback al cambiar número de lote */
  onLotNumberChange: (lotNumber: string) => void;

  /** Callback al hacer click en Consultar */
  onSearch: () => void;

  /** Indica si está consultando */
  isSearching?: boolean;

  /** Deshabilitar filtros */
  disabled?: boolean;
}
