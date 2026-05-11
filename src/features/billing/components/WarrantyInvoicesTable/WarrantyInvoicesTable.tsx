import type { FC } from 'react';
import {
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  DeleteOutline as DeleteOutlineIcon,
  AttachMoney as MoneyIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Payments as PaymentsIcon,
  Visibility as VisibilityIcon,
  ReceiptLong as ReceiptLongIcon,
} from '@mui/icons-material';
import type { WarrantyInvoicesTableProps } from '../../interfaces/warranty.interfaces';
import { formatCurrency } from '../../utils/payroll.utils';

const formatInvoiceDate = (isoDate: string): string => {
  const dateOnly = isoDate.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

const getPaidChipProps = (paid: number) => {
  if (paid === 1) {
    return {
      label: 'Pagado',
      color: 'success' as const,
      variant: 'filled' as const,
    };
  }

  return {
    label: 'Pendiente',
    color: 'warning' as const,
    variant: 'outlined' as const,
  };
};

const canProcessInvoice = (invoice: WarrantyInvoicesTableProps['invoices'][number]) =>
  invoice.Paid === 0 && !invoice.GeneratedInvoiceNumber;

const shouldHideInvoiceActions = (invoice: WarrantyInvoicesTableProps['invoices'][number]) =>
  (invoice.UserRaimbow ?? invoice.UserId) === 3;

const desktopTableContainerSx = {
  height: '100%',
  maxHeight: '100%',
  overflow: 'auto',
};

const stickyHeaderCellSx = {
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  zIndex: 1,
  '& .MuiTypography-root': {
    color: 'inherit',
    fontWeight: 700,
  },
};

export const WarrantyInvoicesTable: FC<WarrantyInvoicesTableProps> = ({
  invoices,
  loading = false,
  selectedInvoiceId,
  deletingInvoiceId,
  onViewDetail,
  onProcess,
  onViewGeneratedPdf,
  onDeleteGeneratedInvoice,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    if (isMobile) {
      return (
        <Stack spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Skeleton variant="text" width="35%" height={28} />
                <Skeleton variant="text" width="65%" />
                <Skeleton variant="text" width="45%" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      );
    }

    return (
      <TableContainer component={Paper} variant="outlined" sx={desktopTableContainerSx}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={stickyHeaderCellSx}>Factura</TableCell>
              <TableCell sx={stickyHeaderCellSx}>Fecha</TableCell>
              <TableCell sx={stickyHeaderCellSx}>Contratista</TableCell>
              <TableCell sx={stickyHeaderCellSx}>Compañía</TableCell>
              <TableCell align="right" sx={stickyHeaderCellSx}>Total</TableCell>
              <TableCell align="center" sx={stickyHeaderCellSx}>Estado</TableCell>
              <TableCell align="center" sx={stickyHeaderCellSx}>Factura generada</TableCell>
              <TableCell align="center" sx={stickyHeaderCellSx}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (invoices.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 5, textAlign: 'center' }}>
        <Stack spacing={1.5} alignItems="center">
          <ReceiptLongIcon color="disabled" />
          <Typography variant="h6" color="text.secondary">
            No hay facturas warranty disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cuando el backend devuelva registros, aparecerán aquí con acceso al detalle por fila.
          </Typography>
        </Stack>
      </Paper>
    );
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {invoices.map((invoice) => {
          const isDeletingGeneratedInvoice = deletingInvoiceId === invoice.IdInvoice;
          const hideInvoiceActions = shouldHideInvoiceActions(invoice);

          return (
          <Card
            key={invoice.IdInvoice}
            variant="outlined"
            sx={{
              borderColor: selectedInvoiceId === invoice.IdInvoice ? 'primary.main' : 'divider',
              borderWidth: selectedInvoiceId === invoice.IdInvoice ? 2 : 1,
            }}
          >
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ReceiptLongIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Factura #{invoice.Number}
                    </Typography>
                  </Stack>
                  {!hideInvoiceActions ? (
                    <Stack direction="row" spacing={1}>
                      {canProcessInvoice(invoice) && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PaymentsIcon />}
                          onClick={() => onProcess(invoice)}
                          disabled={isDeletingGeneratedInvoice}
                        >
                          Procesar
                        </Button>
                      )}
                      <Tooltip title="Ver detalle">
                        <IconButton
                          color="primary"
                          onClick={() => onViewDetail(invoice)}
                          disabled={isDeletingGeneratedInvoice}
                          aria-label={`Ver detalle de factura ${invoice.Number}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {invoice.GeneratedInvoiceNumber ? (
                        <Tooltip title="Ver factura generada">
                          <IconButton
                            color="secondary"
                            onClick={() => onViewGeneratedPdf(invoice)}
                            disabled={isDeletingGeneratedInvoice}
                            aria-label={`Ver factura generada ${invoice.GeneratedInvoiceNumber}`}
                          >
                            <PictureAsPdfIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      {invoice.GeneratedInvoiceNumber ? (
                        <Tooltip title="Eliminar factura generada">
                          <span>
                            <IconButton
                              color="error"
                              onClick={() => onDeleteGeneratedInvoice(invoice)}
                              disabled={isDeletingGeneratedInvoice}
                              aria-label={`Eliminar factura generada ${invoice.GeneratedInvoiceNumber}`}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null}
                    </Stack>
                  ) : null}
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatInvoiceDate(invoice.DateInvoice)}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {invoice.Company || invoice.Nombre}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Contratista: {invoice.Nombre}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    {...getPaidChipProps(invoice.Paid)}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  {!hideInvoiceActions ? (
                    <Chip
                      label={
                        invoice.GeneratedInvoiceNumber
                          ? `Generada #${invoice.GeneratedInvoiceNumber}`
                          : 'Sin factura generada'
                      }
                      color={invoice.GeneratedInvoiceNumber ? 'primary' : 'default'}
                      variant={invoice.GeneratedInvoiceNumber ? 'filled' : 'outlined'}
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  ) : null}
                  <Chip
                    icon={<MoneyIcon />}
                    label={formatCurrency(invoice.Total)}
                    color="success"
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          );
        })}
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={desktopTableContainerSx}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={stickyHeaderCellSx}>
              <Typography variant="subtitle2" fontWeight={700}>Factura</Typography>
            </TableCell>
            <TableCell sx={stickyHeaderCellSx}>
              <Typography variant="subtitle2" fontWeight={700}>Fecha</Typography>
            </TableCell>
            <TableCell sx={stickyHeaderCellSx}>
              <Typography variant="subtitle2" fontWeight={700}>Contratista</Typography>
            </TableCell>
            <TableCell sx={stickyHeaderCellSx}>
              <Typography variant="subtitle2" fontWeight={700}>Compañía</Typography>
            </TableCell>
            <TableCell align="right" sx={stickyHeaderCellSx}>
              <Typography variant="subtitle2" fontWeight={700}>Total</Typography>
            </TableCell>
            <TableCell align="center" sx={stickyHeaderCellSx}>
              <Typography variant="subtitle2" fontWeight={700}>Estado</Typography>
            </TableCell>
            <TableCell align="center" sx={stickyHeaderCellSx}>
              <Typography variant="subtitle2" fontWeight={700}>Factura generada</Typography>
            </TableCell>
            <TableCell align="center" sx={stickyHeaderCellSx}>
              <Typography variant="subtitle2" fontWeight={700}>Acciones</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => {
            const isDeletingGeneratedInvoice = deletingInvoiceId === invoice.IdInvoice;
            const hideInvoiceActions = shouldHideInvoiceActions(invoice);

            return (
            <TableRow
              key={invoice.IdInvoice}
              hover
              selected={selectedInvoiceId === invoice.IdInvoice}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  #{invoice.Number}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatInvoiceDate(invoice.DateInvoice)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {invoice.Nombre}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {invoice.Company || 'Sin compañía'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={700} color="success.main">
                  {formatCurrency(invoice.Total)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  size="small"
                  {...getPaidChipProps(invoice.Paid)}
                />
              </TableCell>
              <TableCell align="center">
                {hideInvoiceActions ? null : invoice.GeneratedInvoiceNumber ? (
                 <Chip
                   size="small"
                   label={`#${invoice.GeneratedInvoiceNumber}`}
                   color="primary"
                   variant="filled"
                 />
                ) : (
                 <Typography variant="body2" color="text.secondary">
                   Sin generar
                 </Typography>
                )}
              </TableCell>
              <TableCell align="center">
               {!hideInvoiceActions ? (
                 <Stack direction="row" spacing={1} justifyContent="center">
                   <Tooltip title="Ver detalle">
                     <IconButton
                       color="primary"
                       onClick={() => onViewDetail(invoice)}
                       disabled={isDeletingGeneratedInvoice}
                       aria-label={`Ver detalle de factura ${invoice.Number}`}
                     >
                       <VisibilityIcon />
                     </IconButton>
                   </Tooltip>
                   {canProcessInvoice(invoice) && (
                     <Button
                       size="small"
                       variant="outlined"
                       onClick={() => onProcess(invoice)}
                       disabled={isDeletingGeneratedInvoice}
                     >
                       Procesar
                     </Button>
                   )}
                   {invoice.GeneratedInvoiceNumber ? (
                     <Tooltip title="Ver factura generada">
                       <IconButton
                         color="secondary"
                         onClick={() => onViewGeneratedPdf(invoice)}
                         disabled={isDeletingGeneratedInvoice}
                         aria-label={`Ver factura generada ${invoice.GeneratedInvoiceNumber}`}
                       >
                         <PictureAsPdfIcon />
                       </IconButton>
                     </Tooltip>
                   ) : null}
                   {invoice.GeneratedInvoiceNumber ? (
                     <Tooltip title="Eliminar factura generada">
                       <span>
                         <IconButton
                           color="error"
                           onClick={() => onDeleteGeneratedInvoice(invoice)}
                           disabled={isDeletingGeneratedInvoice}
                           aria-label={`Eliminar factura generada ${invoice.GeneratedInvoiceNumber}`}
                         >
                           <DeleteOutlineIcon />
                         </IconButton>
                       </span>
                     </Tooltip>
                   ) : null}
                 </Stack>
               ) : null}
             </TableCell>
           </TableRow>
           );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
