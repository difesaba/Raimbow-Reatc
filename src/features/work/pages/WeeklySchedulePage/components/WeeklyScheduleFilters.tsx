import { useState } from 'react';
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
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  ViewList,
  FilterList,
  HourglassEmpty,
  ExpandMore,
  Person
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
  onSubdivisionChange,
  leaders,
  selectedLeader,
  onLeaderChange
}: WeeklyScheduleFiltersProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  // Contar filtros activos
  const activeFiltersCount = [
    selectedSubdivision !== null,
    filterStatus !== 'all',
    progressFilter !== 'all',
    selectedLeader !== null
  ].filter(Boolean).length;

  // Renderizar contenido de los filtros
  const renderFiltersContent = () => (
    <Stack spacing={2}>
      {/* Subdivision Filter */}
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
          sx={{ display: { xs: 'block', md: 'none' }, mb: 1 }}
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

      {/* Leader Filter */}
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
          sx={{ display: { xs: 'block', md: 'none' }, mb: 1 }}
        >
          Leader:
        </Typography>
        <Autocomplete
          options={leaders}
          value={selectedLeader}
          onChange={(_, value) => onLeaderChange(value)}
          getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
          disabled={loading}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Leader"
              placeholder="Todos"
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <Person fontSize="small" sx={{ color: 'action.active', mr: 0.5 }} />
                    {params.InputProps.startAdornment}
                  </>
                )
              }}
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
              <Stack direction="row" spacing={1} alignItems="center">
                <Person fontSize="small" />
                <Typography variant="body2">
                  {option.FirstName} {option.LastName}
                </Typography>
              </Stack>
            </Box>
          )}
        />
      </Box>

      {/* Status Filter */}
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
          sx={{ display: { xs: 'block', md: 'none' }, mb: 1 }}
        >
          Estado:
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
          fullWidth
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
      <FormControl size="small" disabled={loading} fullWidth>
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
  );

  // Vista desktop: Paper normal con todos los filtros
  if (!isMobile) {
    return (
      <Paper elevation={1}>
        <Box padding={3}>
          <Stack
            direction="row"
            alignItems="flex-start"
            spacing={2}
            flexWrap="wrap"
          >
            {/* Subdivision Filter */}
            <Box sx={{ flex: '0 1 250px', minWidth: 200 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                mb={1}
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

            {/* Leader Filter */}
            <Box sx={{ flex: '0 1 250px', minWidth: 200 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                mb={1}
              >
                Leader:
              </Typography>
              <Autocomplete
                options={leaders}
                value={selectedLeader}
                onChange={(_, value) => onLeaderChange(value)}
                getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
                disabled={loading}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Leader"
                    placeholder="Todos"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Person fontSize="small" sx={{ color: 'action.active', mr: 0.5 }} />
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
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
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person fontSize="small" />
                      <Typography variant="body2">
                        {option.FirstName} {option.LastName}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              />
            </Box>

            {/* Status Filter */}
            <Box sx={{ flex: '1 1 auto', minWidth: 300 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                mb={1}
              >
                Estado:
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
                fullWidth
              >
                <ToggleButton value="all" aria-label="mostrar todos">
                  <ViewList fontSize="small" sx={{ mr: 0.5 }} />
                  Todos
                </ToggleButton>
                <ToggleButton value="pending" aria-label="mostrar pendientes">
                  <Warning fontSize="small" sx={{ mr: 0.5 }} />
                  Pendientes
                </ToggleButton>
                <ToggleButton value="in_progress" aria-label="mostrar en progreso">
                  <HourglassEmpty fontSize="small" sx={{ mr: 0.5 }} />
                  En progreso
                </ToggleButton>
                <ToggleButton value="completed" aria-label="mostrar completadas">
                  <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                  Completadas
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Progress/WorkType Filter */}
            <Box sx={{ flex: '0 1 280px', minWidth: 250 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                mb={1}
              >
                Tipo de trabajo:
              </Typography>
              <FormControl size="small" disabled={loading} fullWidth>
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
            </Box>
          </Stack>
        </Box>
      </Paper>
    );
  }

  // Vista mobile/tablet: Accordion
  return (
    <Accordion
      expanded={accordionExpanded}
      onChange={(_, isExpanded) => setAccordionExpanded(isExpanded)}
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        '&:before': {
          display: 'none'
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Badge badgeContent={activeFiltersCount} color="primary">
            <FilterList />
          </Badge>
          <Typography variant="subtitle1" fontWeight={600}>
            Filtros
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} activo${activeFiltersCount > 1 ? 's' : ''}`}
              size="small"
              color="primary"
              sx={{ height: 22 }}
            />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 2, pb: 3 }}>
        {renderFiltersContent()}
      </AccordionDetails>
    </Accordion>
  );
};
