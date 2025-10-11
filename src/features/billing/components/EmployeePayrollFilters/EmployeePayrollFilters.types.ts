import { Dayjs } from 'dayjs';

export interface User {
  /** Unique identifier for the user */
  UserId: number;
  /** User's first name */
  FirstName: string;
  /** User's last name */
  LastName: string;
  /** User's department (optional) */
  Department?: string;
}

export interface EmployeePayrollFiltersProps {
  /** List of available users to select from */
  users: User[];

  /** Currently selected user */
  selectedUser: User | null;

  /** Start date for the period */
  startDate: Dayjs | null;

  /** End date for the period */
  endDate: Dayjs | null;

  /** Callback when user selection changes */
  onUserChange: (user: User | null) => void;

  /** Callback when start date changes */
  onStartDateChange: (date: Dayjs | null) => void;

  /** Callback when end date changes */
  onEndDateChange: (date: Dayjs | null) => void;

  /** Callback to trigger search action */
  onSearch: () => void;

  /** Whether the search is currently in progress */
  isSearching?: boolean;

  /** Whether all filters should be disabled */
  disabled?: boolean;
}