import { Stack, Autocomplete, TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Search as SearchIcon, Person as PersonIcon } from '@mui/icons-material';
import type { Dayjs } from 'dayjs';
import type { EmployeePayrollFiltersProps } from './EmployeePayrollFilters.types';
import 'dayjs/locale/es';

export const EmployeePayrollFilters: React.FC<EmployeePayrollFiltersProps> = ({
  users,
  selectedUser,
  startDate,
  endDate,
  onUserChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  isSearching = false,
  disabled = false,
}) => {
  // Auto-trigger search when all filters are set
  const canSearch = selectedUser && startDate && endDate && !disabled;

  const handleUserChange = (value: typeof selectedUser) => {
    onUserChange(value);
    // Auto-search if other filters are already set
    if (value && startDate && endDate) {
      setTimeout(() => onSearch(), 300);
    }
  };

  const handleStartDateChange = (value: Dayjs | null) => {
    onStartDateChange(value);
    // Auto-search if other filters are already set
    if (selectedUser && value && endDate) {
      setTimeout(() => onSearch(), 300);
    }
  };

  const handleEndDateChange = (value: Dayjs | null) => {
    onEndDateChange(value);
    // Auto-search if other filters are already set
    if (selectedUser && startDate && value) {
      setTimeout(() => onSearch(), 300);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'flex-end' }}
        >
          {/* Employee Selector */}
          <Box flex={2} minWidth={250}>
            <Autocomplete
              size="small"
              options={users}
              value={selectedUser}
              onChange={(_, value) => handleUserChange(value)}
              getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
              disabled={disabled || isSearching}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <PersonIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2">{`${option.FirstName} ${option.LastName}`}</Typography>
                      {option.Department && (
                        <Typography variant="caption" color="text.secondary">
                          {option.Department}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Empleado"
                  placeholder="Buscar empleado..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Box marginRight={1}>
                          <PersonIcon fontSize="small" color="action" />
                        </Box>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>

          {/* Start Date */}
          <Box minWidth={150}>
            <DatePicker
              label="Fecha Inicio"
              value={startDate}
              onChange={(value: any) => handleStartDateChange(value)}
              disabled={disabled || isSearching}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                },
              }}
            />
          </Box>

          {/* End Date */}
          <Box minWidth={150}>
            <DatePicker
              label="Fecha Fin"
              value={endDate}
              onChange={(value: any) => handleEndDateChange(value)}
              disabled={disabled || isSearching}
              format="DD/MM/YYYY"
              minDate={startDate || undefined}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                },
              }}
            />
          </Box>

          {/* Search Button - Only shown for manual trigger if needed */}
          <Box minWidth={120}>
            <Button
              size="small"
              variant="contained"
              fullWidth
              onClick={onSearch}
              disabled={!canSearch || isSearching}
              startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              {isSearching ? 'Consultando...' : 'Consultar'}
            </Button>
          </Box>
        </Stack>

        {/* Optional help text */}
        {!selectedUser && (
          <Box marginTop={1}>
            <Typography variant="body2" color="text.secondary">
              Seleccione un empleado para ver su reporte de nómina
            </Typography>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};
