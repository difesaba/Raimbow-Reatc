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
  ToggleButton,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
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
  ViewList,
  FilterList
} from '@mui/icons-material';
import { es } from 'date-fns/locale';
import type { WorkAssignmentFiltersProps, FilterStatus } from './WorkAssignmentFilters.types';

export const WorkAssignmentFilters = ({
  selectedDate,
  onDateChange,
  onSearch,
  loading,
  filterStatus,
  onFilterChange,
  progressFilter,
  onProgressFilterChange,
  availableProgress
}: WorkAssignmentFiltersProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    <Box padding={{ xs: 1.5, md: 3 }}>
      <Stack spacing={{ xs: 2, md: 2 }}>
        {/* First Row: Date Navigation and Search */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          {/* Date Navigation Controls */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, md: 1 }}
            flex={{ md: 1 }}
            justifyContent={{ xs: 'center', md: 'flex-start' }}
          >
            {/* Previous Day */}
            <Tooltip title="Día anterior">
              <IconButton
                onClick={handlePreviousDay}
                disabled={loading}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              >
                <NavigateBefore fontSize={isMobile ? 'medium' : 'large'} />
              </IconButton>
            </Tooltip>

            {/* Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label={isMobile ? '' : 'Fecha de consulta'}
                value={selectedDate}
                onChange={(newValue) => {
                  if (newValue) {
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
                    size: 'small',
                    placeholder: isMobile ? 'dd/MM/yyyy' : undefined,
                    sx: {
                      minWidth: { xs: '130px', md: '200px' },
                      maxWidth: { xs: '130px', md: '200px' }
                    }
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
                size={isMobile ? 'small' : 'medium'}
              >
                <NavigateNext fontSize={isMobile ? 'medium' : 'large'} />
              </IconButton>
            </Tooltip>

            {/* Today Button */}
            {!isToday() && (
              <Tooltip title="Ir a hoy">
                <IconButton
                  onClick={handleToday}
                  disabled={loading}
                  color="info"
                  size={isMobile ? 'small' : 'medium'}
                >
                  <Today fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {/* Display Selected Date - Hidden in mobile, shown in desktop */}
          {!isMobile && (
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
          )}

          {/* Search Button */}
          <Box width={{ xs: '100%', md: 'auto' }} minWidth={{ md: 140 }}>
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
              sx={{ height: { xs: '48px', md: '40px' } }}
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </Button>
          </Box>
        </Stack>

        {/* Display Selected Date - Mobile only */}
        {isMobile && (
          <Box textAlign="center" paddingY={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              textTransform="capitalize"
            >
              {formatDisplayDate(selectedDate)}
            </Typography>
          </Box>
        )}

        {/* Second Row: Status Filter */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
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
            fullWidth={isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
          >
            <ToggleButton value="all" aria-label="mostrar todos">
              <ViewList fontSize="small" sx={{ mr: { xs: 1, sm: 0.5 } }} />
              Todos
            </ToggleButton>
            <ToggleButton value="pending" aria-label="mostrar pendientes">
              <Warning fontSize="small" sx={{ mr: { xs: 1, sm: 0.5 } }} />
              Pendientes
            </ToggleButton>
            <ToggleButton value="assigned" aria-label="mostrar asignados">
              <CheckCircle fontSize="small" sx={{ mr: { xs: 1, sm: 0.5 } }} />
              Asignados
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Third Row: Progress/WorkType Filter */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
            sx={{ display: { xs: 'none', sm: 'block' }, minWidth: '120px' }}
          >
            Tipo de trabajo:
          </Typography>
          <FormControl fullWidth size="small" disabled={loading}>
            <InputLabel id="progress-filter-label">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <FilterList fontSize="small" />
                <span>Filtrar por tipo</span>
              </Stack>
            </InputLabel>
            <Select
              labelId="progress-filter-label"
              value={progressFilter}
              label="Filtrar por tipo"
              onChange={(e) => onProgressFilterChange(e.target.value)}
              renderValue={(selected) => {
                if (selected === 'all') {
                  return (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">Todos los tipos</Typography>
                      <Chip
                        label={availableProgress.length}
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Stack>
                  );
                }
                return selected;
              }}
            >
              <MenuItem value="all">
                <Stack direction="row" spacing={1} alignItems="center" width="100%">
                  <ViewList fontSize="small" color="action" />
                  <Typography variant="body2">Todos los tipos</Typography>
                  <Box flex={1} />
                  <Chip
                    label={availableProgress.length}
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Stack>
              </MenuItem>
              {availableProgress.length > 0 ? (
                availableProgress.map((progress) => (
                  <MenuItem key={progress} value={progress}>
                    <Typography variant="body2">{progress}</Typography>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    No hay tipos disponibles
                  </Typography>
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </Box>
  );
};
