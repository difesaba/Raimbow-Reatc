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
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  VisibilityOutlined as VisibilityIcon,
  Business as BuilderIcon,
  LocationCity as SubdivisionIcon,
  Home as LotIcon
} from '@mui/icons-material';
import type { LotsTableProps } from './LotsTable.types';

/**
 * 📊 LotsTable - Tabla de resultados de lotes (Responsive)
 *
 * Vistas:
 * - Desktop (≥900px): Tabla tradicional con todas las columnas
 * - Mobile (<900px): Vista de Cards optimizada
 *
 * Diseño siguiendo estándares del proyecto con mejores prácticas UX
 */
export const LotsTable: React.FC<LotsTableProps> = ({
  lots,
  isLoading = false,
  onExport,
  onViewDetail
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box padding={{ xs: 2, md: 3 }}>
      {/* Header con contador y botón de exportar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
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
            fullWidth={isMobile}
          >
            Exportar
          </Button>
        )}
      </Stack>

      {/* Vista Mobile: Cards */}
      {isMobile ? (
        <Stack spacing={2}>
          {lots.map((lot, index) => (
            <Card
              key={lot.LoteId || index}
              variant="outlined"
              sx={{
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  borderColor: 'primary.main'
                }
              }}
            >
              <CardContent>
                {/* Header del Card */}
                <Stack direction="row" spacing={1} alignItems="center" marginBottom={2}>
                  <LotIcon color="primary" />
                  <Typography variant="h6" component="div" color="primary">
                    Lote {lot.Number || 'N/A'}
                  </Typography>
                  <Chip
                    label={lot.IsTownHome ? 'Townhome' : 'Lote'}
                    color={lot.IsTownHome ? 'primary' : 'default'}
                    size="small"
                  />
                </Stack>

                <Divider sx={{ marginBottom: 2 }} />

                {/* Información Principal */}
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BuilderIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Builder:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lot.Builder || 'N/A'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <SubdivisionIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Subdivisión:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {lot.Sub || 'N/A'}
                    </Typography>
                  </Stack>

                  {lot.SFQuantity && (
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        SQ FT:
                      </Typography>
                      <Typography variant="body2">
                        {lot.SFQuantity}
                      </Typography>
                    </Stack>
                  )}

                  {lot.Colors && (
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Colores:
                      </Typography>
                      <Typography variant="body2">
                        {lot.Colors}
                      </Typography>
                    </Stack>
                  )}

                  {lot.DoorDesc && (
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Puerta:
                      </Typography>
                      <Typography variant="body2">
                        {lot.DoorDesc}
                      </Typography>
                    </Stack>
                  )}

                  {lot.StainDesc && (
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Stain:
                      </Typography>
                      <Typography variant="body2">
                        {lot.StainDesc}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>

              {/* Acciones */}
              {onViewDetail && (
                <CardActions>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => onViewDetail(lot)}
                  >
                    Ver Detalles
                  </Button>
                </CardActions>
              )}
            </Card>
          ))}
        </Stack>
      ) : (
        /* Vista Desktop: Tabla */
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
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600
                  }}
                >
                  Stain
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
                  <TableCell>
                    <Typography variant="body2">
                      {lot.StainDesc || '-'}
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
      )}
    </Box>
  );
};
