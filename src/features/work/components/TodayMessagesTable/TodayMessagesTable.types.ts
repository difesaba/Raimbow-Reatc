import type { TodayMessage } from '../../interfaces';

export interface TodayMessagesTableProps {
  messages: TodayMessage[];
  isLoading?: boolean;
  onRefresh?: () => void;
}
