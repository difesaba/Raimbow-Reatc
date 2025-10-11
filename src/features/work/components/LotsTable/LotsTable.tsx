import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  VisibilityOutlined as VisibilityIcon
} from '@mui/icons-material';
import type { LotsTableProps } from './LotsTable.types';

/**
 * 📊 LotsTable - Tabla de resultados de lotes
 *
 * Columnas:
 * - Builder
 * - Subdivisión (Sub)
 * - Número de Lote (Number)
 * - Tipo (Lote / Townhome basado en IsTownHome)
 *
 * Diseño siguiendo estándares del proyecto
 */
export const LotsTable: React.FC<LotsTableProps> = ({
  lots,
  isLoading = false,
  onExport,
  onViewDetail
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (lots.length === 0) {
    return (
      <Box padding={4} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          No se encontraron lotes para los filtros seleccionados
        </Typography>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      {/* Header con contador y botón de exportar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h6">
          Resultados ({lots.length} {lots.length === 1 ? 'lote' : 'lotes'})
        </Typography>
        {onExport && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={onExport}
          >
            Exportar
          </Button>
        )}
      </Stack>

      {/* Tabla de resultados con sticky header y scroll */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          maxHeight: 'calc(100vh - 400px)',
          overflow: 'auto'
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600
                }}
              >
                Builder
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600
                }}
              >
                Subdivisión
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600
                }}
              >
                Número de Lote
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600
                }}
              >
                Tipo
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600
                }}
              >
                SQ FT
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600
                }}
              >
                Colores
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600
                }}
              >
                Descripción Puerta
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600,
                  width: 100
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lots.map((lot, index) => (
              <TableRow
                key={lot.LoteId || index}
                hover
                sx={{
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                <TableCell>
                  <Typography variant="body2">
                    {lot.Builder || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {lot.Sub || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {lot.Number || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={lot.IsTownHome ? 'primary.main' : 'text.secondary'}
                  >
                    {lot.IsTownHome ? 'Townhome' : 'Lote'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {lot.SFQuantity || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {lot.Colors || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {lot.DoorDesc || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {onViewDetail && (
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onViewDetail(lot)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
