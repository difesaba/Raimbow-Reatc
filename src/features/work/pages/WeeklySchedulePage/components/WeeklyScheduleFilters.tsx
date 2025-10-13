import {
  Box,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Autocomplete,
  TextField
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  ViewList,
  FilterList,
  HourglassEmpty
} from '@mui/icons-material';
import type { WeeklyScheduleFiltersProps, FilterStatus } from './WeeklyScheduleFilters.types';

export const WeeklyScheduleFilters = ({
  loading,
  filterStatus,
  onFilterChange,
  progressFilter,
  onProgressFilterChange,
  availableProgress,
  subdivisions,
  selectedSubdivision,
  onSubdivisionChange
}: WeeklyScheduleFiltersProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper elevation={isMobile ? 0 : 1}>
      <Box padding={{ xs: 1.5, md: 3 }}>
        <Stack spacing={{ xs: 2, md: 2 }}>
          {/* All Filters in One Row */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
          >
            {/* Subdivision Filter */}
            <Box sx={{ flex: { xs: 1, sm: 0.35 }, minWidth: { sm: 200 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                sx={{ display: { xs: 'none', sm: 'block' }, mb: 1 }}
              >
                Subdivisión:
              </Typography>
              <Autocomplete
                options={subdivisions}
                value={selectedSubdivision}
                onChange={(_, value) => onSubdivisionChange(value)}
                getOptionLabel={(option) => option.Name}
                disabled={loading}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subdivisión"
                    placeholder="Todas"
                    size="small"
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      '&.Mui-focused, &[aria-selected="true"]': {
                        color: 'white',
                        '& .MuiTypography-root': {
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <Typography variant="body2">{option.Name}</Typography>
                  </Box>
                )}
              />
            </Box>

            {/* Status Filter */}
            <Box flex={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                sx={{ display: { xs: 'none', sm: 'block' }, mb: 1 }}
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
                <ToggleButton value="in_progress" aria-label="mostrar en progreso">
                  <HourglassEmpty fontSize="small" sx={{ mr: { xs: 1, sm: 0.5 } }} />
                  En progreso
                </ToggleButton>
                <ToggleButton value="completed" aria-label="mostrar completadas">
                  <CheckCircle fontSize="small" sx={{ mr: { xs: 1, sm: 0.5 } }} />
                  Completadas
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Progress/WorkType Filter */}
            <FormControl size="small" disabled={loading} sx={{ flex: { xs: 1, sm: 0.4 }, minWidth: { sm: 250 } }}>
              <InputLabel id="progress-filter-label">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <FilterList fontSize="small" />
                  <span>Tipo de trabajo</span>
                </Stack>
              </InputLabel>
              <Select
                labelId="progress-filter-label"
                value={progressFilter}
                label="Tipo de trabajo"
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
    </Paper>
  );
};
