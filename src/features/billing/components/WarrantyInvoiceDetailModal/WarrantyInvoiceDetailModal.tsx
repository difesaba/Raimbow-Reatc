import {
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  HomeWork as HomeWorkIcon,
  ReceiptLong as ReceiptLongIcon,
} from '@mui/icons-material';
import type { WarrantyInvoiceDetailModalProps } from '../../interfaces/warranty.interfaces';
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

const modalTableContainerSx = {
  maxHeight: 'calc(100vh - 360px)',
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

export const WarrantyInvoiceDetailModal: React.FC<WarrantyInvoiceDetailModalProps> = ({
  open,
  onClose,
  invoice,
  details,
  loading = false,
  error = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const totalCost = details.reduce((sum, detail) => sum + detail.Cost, 0);

  const renderLoading = () => (
    <Stack spacing={2}>
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} variant="rounded" height={isMobile ? 120 : 56} />
      ))}
    </Stack>
  );

  const renderEmpty = () => (
    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
      <Stack spacing={1.5} alignItems="center">
        <HomeWorkIcon color="disabled" />
        <Typography variant="subtitle1" color="text.secondary">
          No hay renglones para esta factura
        </Typography>
      </Stack>
    </Paper>
  );

  const renderMobile = () => (
    <Stack spacing={2}>
      {details.map((detail) => (
        <Card key={detail.IdWarranty} variant="outlined">
          <CardContent>
            <Stack spacing={1.25}>
              <Typography variant="subtitle1" fontWeight={700}>
                {detail.SubName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {detail.Address}
              </Typography>
              <Divider />
              <Typography variant="body2">
                <strong>Contratista:</strong> {detail.Name}
              </Typography>
              <Typography variant="body2">
                <strong>Warranty ID:</strong> {detail.IdWarranty}
              </Typography>
              <Typography variant="body2">
                <strong>Observación:</strong> {detail.Observation || 'Sin observación'}
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={700}>
                {formatCurrency(detail.Cost)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  const renderDesktop = () => (
    <TableContainer component={Paper} variant="outlined" sx={modalTableContainerSx}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={stickyHeaderCellSx}>Subdivision</TableCell>
            <TableCell sx={stickyHeaderCellSx}>Address</TableCell>
            <TableCell sx={stickyHeaderCellSx}>Observation</TableCell>
            <TableCell sx={stickyHeaderCellSx}>Contractor</TableCell>
            <TableCell align="right" sx={stickyHeaderCellSx}>Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((detail) => (
            <TableRow key={detail.IdWarranty} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {detail.SubName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {detail.Address}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {detail.Observation || 'Sin observación'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {detail.Name}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={700} color="primary.main">
                  {formatCurrency(detail.Cost)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ pr: 7 }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ReceiptLongIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              {invoice ? `Detalle factura #${invoice.Number}` : 'Detalle de factura'}
            </Typography>
          </Stack>
          {invoice && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 0.75, sm: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Fecha: {formatInvoiceDate(invoice.DateInvoice)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contratista: {invoice.Nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total factura: {formatCurrency(invoice.Total)}
              </Typography>
            </Stack>
          )}
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
          aria-label="Cerrar detalle"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error.message}</Alert>}

          {loading ? renderLoading() : null}

          {!loading && !error && details.length === 0 ? renderEmpty() : null}

          {!loading && !error && details.length > 0 ? (
            <>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: 'background.default',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 3 }}
                  justifyContent="space-between"
                >
                  <Typography variant="body2" color="text.secondary">
                    Renglones: <strong>{details.length}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total detalle: <strong>{formatCurrency(totalCost)}</strong>
                  </Typography>
                </Stack>
              </Paper>
              {isMobile ? renderMobile() : renderDesktop()}
            </>
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
