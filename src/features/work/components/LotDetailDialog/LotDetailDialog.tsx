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
  Skeleton,
  List,
  ListItem,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as ProgressIcon
} from '@mui/icons-material';
import type { LotDetailDialogProps } from './LotDetailDialog.types';

/**
 * 🔍 LotDetailDialog - Modal para mostrar detalles completos de un lote con tareas (Responsive)
 *
 * Vistas:
 * - Desktop (≥900px): Modal centrado con tabla
 * - Mobile (<900px): FullScreen con lista optimizada
 *
 * Estilo ADPRO: Header dentro del DialogContent
 */
export const LotDetailDialog: React.FC<LotDetailDialogProps> = ({
  open,
  lot,
  lotDetails,
  isLoading = false,
  onClose
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      slotProps={{
        paper: {
          sx: {
            ...(!isMobile && { maxWidth: '720px' })
          },
        },
      }}
    >
      <DialogContent
        sx={{
          padding: { xs: '16px', md: '24px 18px' },
          overflow: 'auto',
          ...(isMobile && { paddingBottom: '80px' }) // Espacio para el botón fijo en mobile
        }}
      >
        <Stack gap={2} justifyContent="flex-start">
          {/* Header Section - Estilo ADPRO */}
          <Stack
            direction="row"
            gap={1.5}
            justifyContent="flex-start"
            alignItems="center"
            alignSelf="stretch"
          >
            <HomeIcon
              color="primary"
              sx={{ fontSize: { xs: 32, md: 40 } }}
            />
            <Stack>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                sx={{ color: 'primary.main' }}
              >
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

          <Divider />

          {/* Content Section */}
          {isLoading ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={300} />
            </Box>
          ) : !lotDetails || lotDetails.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={{ xs: 200, md: 400 }}
            >
              <Typography variant="body1" color="text.secondary">
                No se encontraron detalles para este lote
              </Typography>
            </Box>
          ) : (
            <>
              {/* Vista Mobile: Lista */}
              {isMobile ? (
                <List disablePadding>
                  {lotDetails.map((detail, index) => (
                    <Box key={detail.IdDet || index}>
                      <ListItem
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          backgroundColor: index % 2 === 0 ? 'background.paper' : 'action.hover',
                          padding: 2,
                          gap: 1.5
                        }}
                      >
                        {/* Header del item */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" fontWeight={600} color="primary">
                            {detail.Number || 'N/A'}
                          </Typography>
                          <Chip
                            label={detail.InvoiceId !== 0 ? 'Pagado' : 'Pendiente'}
                            color={detail.InvoiceId !== 0 ? 'success' : 'warning'}
                            size="small"
                          />
                        </Stack>

                        {/* Fechas */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Inicio:
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(detail.InitialDate)}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Fin:
                          </Typography>
                          <Typography variant="body2">
                            {formatDate(detail.EndDate)}
                          </Typography>
                        </Stack>

                        {/* Progreso */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ProgressIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            Progreso:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="primary">
                            {detail.Progress}%
                          </Typography>
                        </Stack>

                        {/* Días y Manager */}
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Días: <strong>{detail.Days || 0}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Manager: <strong>{detail.Manager || 'N/A'}</strong>
                          </Typography>
                        </Stack>
                      </ListItem>
                      {index < lotDetails.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                /* Vista Desktop: Tabla */
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
            </>
          )}
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          ...(isMobile && {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            padding: 2,
            zIndex: 1
          })
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          startIcon={<CloseIcon />}
          disabled={isLoading}
          fullWidth={isMobile}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
