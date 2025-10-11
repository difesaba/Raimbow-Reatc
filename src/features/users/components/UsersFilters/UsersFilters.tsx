import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Stack,
  Chip,
  Typography
} from '@mui/material';
import {
  Search,
  FilterListOff,
  Close
} from '@mui/icons-material';
import type { UsersFiltersProps } from './UsersFilters.types';

export const UsersFilters = ({
  searchTerm,
  statusFilter,
  roleFilter,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onReset,
  roles = [],
  totalResults = 0
}: UsersFiltersProps) => {
  // Status options for Autocomplete
  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' }
  ];

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    roleFilter !== 'all';

  // Get active filters for chips
  const activeFilters = [];
  if (searchTerm) {
    activeFilters.push({ type: 'Búsqueda', value: searchTerm, onRemove: () => onSearchChange('') });
  }
  if (statusFilter !== 'all') {
    const statusLabel = statusOptions.find(s => s.value === statusFilter)?.label || statusFilter;
    activeFilters.push({ type: 'Estado', value: statusLabel, onRemove: () => onStatusChange('all') });
  }
  if (roleFilter !== 'all') {
    const roleLabel = roles.find(r => r.RoleId === roleFilter)?.RoleName || `Rol ${roleFilter}`;
    activeFilters.push({ type: 'Rol', value: roleLabel, onRemove: () => onRoleChange('all') });
  }

  return (
    <Box padding={3}>
      <Stack spacing={2}>
        {/* Filter controls */}
        <Grid container spacing={2} alignItems="center">
          {/* Search field */}
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <TextField
              label="Buscar"
              placeholder="Nombre, email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <Search fontSize="small" color="action" />
              }}
            />
          </Grid>

          {/* Status filter - Now using Autocomplete for consistency */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              value={statusOptions.find(s => s.value === statusFilter) || statusOptions[0]}
              onChange={(_, newValue) => {
                onStatusChange((newValue?.value as any) || 'all');
              }}
              options={statusOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Estado"
                  size="small"
                  placeholder="Todos"
                />
              )}
              isOptionEqualToValue={(option, value) => option.value === value?.value}
              disableClearable
            />
          </Grid>

          {/* Role filter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              value={roleFilter === 'all' ? null : roles.find(r => r.RoleId === roleFilter) || null}
              onChange={(_, newValue) => {
                onRoleChange(newValue ? newValue.RoleId : 'all');
              }}
              options={roles}
              getOptionLabel={(option) => option.RoleName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rol"
                  size="small"
                  placeholder="Todos los roles"
                />
              )}
              isOptionEqualToValue={(option, value) => option.RoleId === value?.RoleId}
            />
          </Grid>

          {/* Reset filters button - Now with better sizing */}
          <Grid size={{ xs: 12, sm: 6, md: 1 }} display="flex" alignItems="center">
            <Button
              variant="outlined"
              fullWidth
              onClick={onReset}
              disabled={!hasActiveFilters}
              startIcon={<FilterListOff />}
              sx={{ minWidth: { xs: '100%', md: 'auto' } }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>

        {/* Active filters chips */}
        {activeFilters.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Filtros activos:
            </Typography>
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={`${filter.type}: ${filter.value}`}
                size="small"
                onDelete={filter.onRemove}
                deleteIcon={<Close fontSize="small" />}
                variant="outlined"
                color="primary"
              />
            ))}
            <Button
              size="small"
              onClick={onReset}
              startIcon={<FilterListOff />}
              sx={{ ml: 1 }}
            >
              Limpiar todos
            </Button>
          </Stack>
        )}

        {/* Results count */}
        <Typography variant="body2" color="text.secondary">
          {hasActiveFilters ? `${totalResults} resultado${totalResults !== 1 ? 's' : ''} encontrado${totalResults !== 1 ? 's' : ''}` : `${totalResults} usuario${totalResults !== 1 ? 's' : ''} en total`}
        </Typography>
      </Stack>
    </Box>
  );
};