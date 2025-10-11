import { Stack, Autocomplete, TextField, Button, Box, CircularProgress } from '@mui/material';
import { Search as SearchIcon  } from '@mui/icons-material';
import type { LotFiltersProps } from './LotFilters.types';

/**
 * 🔍 LotFilters - Filtros para consulta de lotes
 *
 * Diseño:
 * - Todos los campos size="small" para consistencia
 * - Subdivisión obligatoria (Autocomplete)
 * - Número de lote opcional (TextField alfanumérico)
 * - Botón de búsqueda alineado con los campos
 */
export const LotFilters: React.FC<LotFiltersProps> = ({
  subdivisions,
  selectedSubdivision,
  lotNumber,
  onSubdivisionChange,
  onLotNumberChange,
  onSearch,
  isSearching = false,
  disabled = false,
}) => {
  // Validar que se pueda buscar (subdivisión es obligatoria)
  const canSearch = selectedSubdivision !== null && !disabled;

  return (
    <Box padding={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
      >
        {/* Subdivision Selector - OBLIGATORIO */}
        <Box flex={2} minWidth={300}>
          <Autocomplete
            options={subdivisions}
            value={selectedSubdivision}
            onChange={(_, value) => onSubdivisionChange(value)}
            getOptionLabel={(option) => option.Name}
            disabled={disabled || isSearching}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Subdivisión *"
                placeholder="Seleccionar subdivisión..."
                error={!selectedSubdivision}
                helperText={!selectedSubdivision ? 'Campo obligatorio' : ' '}
                InputLabelProps={{
                  shrink: true
                }}
              />
            )}
          />
        </Box>

        {/* Lot Number - OPCIONAL */}
        <Box flex={1} minWidth={220}>
          <TextField
            fullWidth
            label="Número de Lote"
            placeholder="Ej: 10 o 10A"
            value={lotNumber}
            onChange={(e) => onLotNumberChange(e.target.value)}
            disabled={!selectedSubdivision || disabled || isSearching}
            helperText={
              !selectedSubdivision
                ? 'Primero seleccione una subdivisión'
                : 'Opcional - Puede incluir letras'
            }
            InputLabelProps={{
              shrink: true
            }}
          />
        </Box>

        {/* Search Button */}
        <Box minWidth={140}>
          <Button
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
    </Box>
  );
};
