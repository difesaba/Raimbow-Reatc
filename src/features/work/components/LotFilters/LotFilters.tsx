import { Stack, Autocomplete, TextField, Button, Box, CircularProgress } from '@mui/material';
import { Search as SearchIcon  } from '@mui/icons-material';
import type { LotFiltersProps } from './LotFilters.types';

/**
 * 🔍 LotFilters - Filtros para consulta de lotes (Responsive)
 *
 * Diseño Responsive:
 * - Desktop: Filtros en fila horizontal
 * - Mobile: Filtros apilados verticalmente
 * - Subdivisión obligatoria (Autocomplete)
 * - Número de lote opcional (TextField alfanumérico)
 * - Botón de búsqueda adaptativo
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
    <Box padding={{ xs: 2, md: 3 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, md: 3 }}
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
      >
        {/* Subdivision Selector - OBLIGATORIO */}
        <Box
          sx={{
            flex: { xs: '1', md: '2' },
            width: '100%'
          }}
        >
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
        <Box
          sx={{
            flex: { xs: '1', md: '1' },
            width: '100%'
          }}
        >
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
        <Box
          sx={{
            width: { xs: '100%', md: 'auto' },
            minWidth: { md: '140px' }
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={onSearch}
            disabled={!canSearch || isSearching}
            startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
            sx={{
              height: { xs: '48px', md: '56px' }
            }}
          >
            {isSearching ? 'Consultando...' : 'Consultar'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
