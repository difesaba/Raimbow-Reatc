import { useState } from 'react';
import {
  Box,
  Stack,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Search,
  Today,
  NavigateBefore,
  NavigateNext,
  CheckCircle,
  Warning,
  ViewList
} from '@mui/icons-material';
import { es } from 'date-fns/locale';
import type { WorkAssignmentFiltersProps, FilterStatus } from './WorkAssignmentFilters.types';

export const WorkAssignmentFilters = ({
  selectedDate,
  onDateChange,
  onSearch,
  loading,
  filterStatus,
  onFilterChange
}: WorkAssignmentFiltersProps) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Navigate to previous day
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  // Navigate to next day
  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  // Navigate to today
  const handleToday = () => {
    onDateChange(new Date());
  };

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Check if selected date is today
  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Box padding={3}>
      <Stack spacing={2}>
        {/* First Row: Date Navigation and Search */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
        >
          {/* Date Navigation Controls */}
          <Stack direction="row" alignItems="center" spacing={1} flex={1}>
            {/* Previous Day */}
            <Tooltip title="Día anterior">
              <IconButton
                onClick={handlePreviousDay}
                disabled={loading}
                color="primary"
              >
                <NavigateBefore />
              </IconButton>
            </Tooltip>

            {/* Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha de consulta"
                value={selectedDate}
                onChange={(newValue) => {
                  if (newValue) {
                    // Convert to Date if it's a Dayjs object
                    const dateValue = newValue instanceof Date ? newValue : new Date(newValue.toString());
                    onDateChange(dateValue);
                  }
                }}
                open={datePickerOpen}
                onOpen={() => setDatePickerOpen(true)}
                onClose={() => setDatePickerOpen(false)}
                disabled={loading}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    size: 'small'
                  }
                }}
              />
            </LocalizationProvider>

            {/* Next Day */}
            <Tooltip title="Día siguiente">
              <IconButton
                onClick={handleNextDay}
                disabled={loading}
                color="primary"
              >
                <NavigateNext />
              </IconButton>
            </Tooltip>

            {/* Today Button */}
            {!isToday() && (
              <Tooltip title="Ir a hoy">
                <IconButton
                  onClick={handleToday}
                  disabled={loading}
                  color="info"
                >
                  <Today />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {/* Display Selected Date */}
          <Box flex={1} textAlign="center">
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              textTransform="capitalize"
            >
              {formatDisplayDate(selectedDate)}
            </Typography>
          </Box>

          {/* Search Button */}
          <Box minWidth={120}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={onSearch}
              disabled={loading}
              fullWidth
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Search />
                )
              }
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </Button>
          </Box>
        </Stack>

        {/* Second Row: Status Filter */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Filtrar por estado:
          </Typography>
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={(_event, newFilter: FilterStatus) => {
              if (newFilter !== null) {
                onFilterChange(newFilter);
              }
            }}
            size="small"
            disabled={loading}
          >
            <ToggleButton value="all" aria-label="mostrar todos">
              <ViewList fontSize="small" sx={{ mr: 0.5 }} />
              Todos
            </ToggleButton>
            <ToggleButton value="pending" aria-label="mostrar pendientes">
              <Warning fontSize="small" sx={{ mr: 0.5 }} />
              Pendientes
            </ToggleButton>
            <ToggleButton value="assigned" aria-label="mostrar asignados">
              <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
              Asignados
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
};
