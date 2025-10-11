import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton
} from '@mui/material';
import {
  Close as CloseIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import type { LotDetailDialogProps } from './LotDetailDialog.types';

/**
 * 🔍 LotDetailDialog - Modal para mostrar detalles completos de un lote con tareas
 *
 * Estilo ADPRO: Header dentro del DialogContent, sin DialogTitle ni Divider
 */
export const LotDetailDialog: React.FC<LotDetailDialogProps> = ({
  open,
  lot,
  lotDetails,
  isLoading = false,
  onClose
}) => {
  if (!lot) return null;

  /**
   * Formatear fecha de YYYY-MM-DD a DD/MM/YYYY
   */
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('es-ES');
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={( reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      slotProps={{
        paper: {
          sx: { width: '720px' },
        },
      }}
    >
      <DialogContent sx={{ height: '600px', padding: '24px 18px !important', overflow: 'auto' }}>
        <Stack gap={2} justifyContent="flex-start">
          {/* Header Section - Estilo ADPRO */}
          <Stack direction="row" gap={1.5} justifyContent="flex-start" alignItems="center" alignSelf="stretch">
            <Stack>
              <HomeIcon color="primary" sx={{ fontSize: 40 }} />
            </Stack>
            <Stack>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Lote {lot.Number} - {lot.Sub}
              </Typography>
              <Typography variant="caption">
                Subdivisión: {lot.Sub}
              </Typography>
              <Typography variant="caption">
                Tipo: {lot.IsTownHome ? 'Townhome' : 'Lote'}
              </Typography>
              {lot.SFQuantity && (
                <Typography variant="caption">
                  SQ FT: {lot.SFQuantity}
                </Typography>
              )}
              {lot.Colors && (
                <Typography variant="caption">
                  Colores: {lot.Colors}
                </Typography>
              )}
              {lot.DoorDesc && (
                <Typography variant="caption">
                  Descripción Puerta: {lot.DoorDesc}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Table Section */}
          {isLoading ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={300} />
            </Box>
          ) : !lotDetails || lotDetails.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron detalles para este lote
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600
                      }}
                    >
                      Número
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600
                      }}
                    >
                      Fecha Inicial
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600
                      }}
                    >
                      Fecha Final
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600
                      }}
                    >
                      Estado Pago
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600
                      }}
                    >
                      Progreso
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600
                      }}
                    >
                      Días
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600
                      }}
                    >
                      Manager
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lotDetails.map((detail, index) => (
                    <TableRow
                      key={detail.IdDet || index}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {detail.Number || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(detail.InitialDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(detail.EndDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={detail.InvoiceId !== 0 ? 'Pagado' : 'Pendiente'}
                          color={detail.InvoiceId !== 0 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {detail.Progress}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {detail.Days || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {detail.Manager || 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          startIcon={<CloseIcon />}
          disabled={isLoading}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
