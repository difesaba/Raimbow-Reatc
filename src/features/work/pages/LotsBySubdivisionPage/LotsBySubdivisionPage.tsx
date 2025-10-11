import { useState } from 'react';
import { Container, Paper, Box, Typography, Alert, Stack, Divider, CircularProgress } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { LotFilters } from '../../components/LotFilters';
import { LotsTable } from '../../components/LotsTable';
import { LotDetailDialog } from '../../components/LotDetailDialog';
import { useLotsReport } from '../../hooks/useLotsReport';
import { useSubdivisions } from '../../hooks/useSubdivisions';
import { WorkService } from '../../services/work.service';
import type { Subdivision } from '../../interfaces/subdivision.interfaces';
import type { WorkReport, LotDetail } from '../../interfaces/work.interfaces';

/**
 * 🏗️ LotsBySubdivisionPage - Página de consulta de lotes por subdivisión
 *
 * Funcionalidades:
 * - Filtro obligatorio: Subdivisión
 * - Filtro opcional: Número de lote (alfanumérico)
 * - Tabla de resultados: Builder, Subdivisión, Número de Lote
 */
export const LotsBySubdivisionPage = () => {
  // 🏘️ Hook para cargar subdivisiones
  const {
    subdivisions,
    loading: subdivisionsLoading,
    error: subdivisionsError
  } = useSubdivisions();

  // 📊 Hook para consulta de lotes
  const {
    data,
    loading,
    error,
    hasData,
    isEmpty,
    fetchLots
  } = useLotsReport();

  // 🔍 Estados de filtros
  const [selectedSubdivision, setSelectedSubdivision] = useState<Subdivision | null>(null);
  const [lotNumber, setLotNumber] = useState('');

  // 📋 Estados del modal de detalles
  const [selectedLot, setSelectedLot] = useState<WorkReport | null>(null);
  const [lotDetails, setLotDetails] = useState<LotDetail[] | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  /**
   * 📡 Manejar búsqueda
   */
  const handleSearch = async () => {
    if (!selectedSubdivision) return;

    // Construir filtros usando el nuevo campo SubdivisionId
    const filters = {
      sub: selectedSubdivision.SubdivisionId,
      town: selectedSubdivision.IsTownHome ? 1 : 0, // Town basado en IsTownHome
      lot: lotNumber || '-1' // Si está vacío, enviar '-1' como valor por defecto del SP
    };

    // Consultar
    await fetchLots(filters);
  };

  /**
   * 📥 Manejar exportación (TODO: implementar)
   */
  const handleExport = () => {
    console.log('Exportando lotes...', data);
    // TODO: Implementar exportación a Excel/CSV
  };

  /**
   * 👁️ Manejar apertura de modal de detalles
   */
  const handleViewDetail = async (lot: WorkReport) => {
    setSelectedLot(lot);
    setDetailDialogOpen(true);
    setIsLoadingDetails(true);
    setLotDetails(null); // Reset previous details

    // 📡 Llamar al servicio para obtener detalles completos del lote
    try {
      const filters = {
        sub: lot.SubdivisionId,
        town: selectedSubdivision?.IsTownHome ? 1 : 0,
        lot: lot.LoteId.toString(),
        status: -1
      };

      // Llamar al endpoint /report-lot para detalles del lote
      const details = await WorkService.getLotDetails(filters);
      console.log('📋 Lot details:', details);
      setLotDetails(details);
    } catch (error) {
      console.error('Error fetching lot details:', error);
      setLotDetails(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  /**
   * ❌ Manejar cierre de modal de detalles
   */
  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedLot(null);
    setLotDetails(null);
    setIsLoadingDetails(false);
  };

  // 🎨 Estados de vista
  const showEmptyState = !selectedSubdivision && !loading;
  const showNoResults = isEmpty;
  const showResults = hasData;

  return (
    <Container maxWidth="xl">
      <Stack spacing={3} paddingY={3}>
        {/* Page Header */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Lotes por Subdivisión
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consulte lotes filtrando por subdivisión y opcionalmente por número de lote
          </Typography>
        </Box>

        {/* Main Content Paper */}
        <Paper elevation={0}>
          <Box>
            {/* Error al cargar subdivisiones */}
            {subdivisionsError && (
              <Box marginBottom={3}>
                <Alert severity="error">
                  {subdivisionsError.message || 'Error al cargar subdivisiones'}
                </Alert>
              </Box>
            )}

            {/* Loading subdivisiones */}
            {subdivisionsLoading && (
              <Box display="flex" justifyContent="center" padding={2}>
                <CircularProgress size={24} />
                <Typography variant="body2" marginLeft={2}>
                  Cargando subdivisiones...
                </Typography>
              </Box>
            )}

            {/* Filters Section */}
            {!subdivisionsLoading && (
              <LotFilters
                subdivisions={subdivisions}
                selectedSubdivision={selectedSubdivision}
                lotNumber={lotNumber}
                onSubdivisionChange={setSelectedSubdivision}
                onLotNumberChange={setLotNumber}
                onSearch={handleSearch}
                isSearching={loading}
                disabled={subdivisionsLoading || !!subdivisionsError}
              />
            )}

            <Divider sx={{ my: 3 }} />

            {/* Results Section */}
            {showEmptyState && (
              <Stack alignItems="center" spacing={2} paddingY={8}>
                <InfoIcon fontSize="large" color="disabled" />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Seleccione una subdivisión para comenzar
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Use los filtros superiores para buscar lotes
                </Typography>
              </Stack>
            )}

            {error && (
              <Box padding={3}>
                <Alert severity="error">
                  {error.message || 'Error al cargar lotes. Por favor intente nuevamente.'}
                </Alert>
              </Box>
            )}

            {showNoResults && (
              <Box padding={3}>
                <Alert severity="info">
                  No se encontraron lotes para los filtros seleccionados.
                  Intente con otros criterios de búsqueda.
                </Alert>
              </Box>
            )}

            {showResults && data && (
              <LotsTable
                lots={data}
                isLoading={loading}
                onExport={handleExport}
                onViewDetail={handleViewDetail}
              />
            )}
          </Box>
        </Paper>

        {/* Modal de detalles */}
        <LotDetailDialog
          open={detailDialogOpen}
          lot={selectedLot}
          lotDetails={lotDetails}
          isLoading={isLoadingDetails}
          onClose={handleCloseDetail}
        />
      </Stack>
    </Container>
  );
};
