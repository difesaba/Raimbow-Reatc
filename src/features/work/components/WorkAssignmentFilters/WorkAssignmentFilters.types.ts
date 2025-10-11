/**
 * Filter status type
 */
export type FilterStatus = 'all' | 'pending' | 'assigned';

/**
 * Props for WorkAssignmentFilters component
 */
export interface WorkAssignmentFiltersProps {
  /**
   * Currently selected date
   */
  selectedDate: Date;

  /**
   * Callback when date changes
   */
  onDateChange: (date: Date) => void;

  /**
   * Callback when search button is clicked
   */
  onSearch: () => void;

  /**
   * Loading state for the search
   */
  loading: boolean;

  /**
   * Current filter status
   */
  filterStatus: FilterStatus;

  /**
   * Callback when filter status changes
   */
  onFilterChange: (filter: FilterStatus) => void;
}