import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Typography,
  Stack,
  Button,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Print as PrintIcon,
  Schedule as ScheduleIcon,
  Restaurant as LunchIcon,
} from '@mui/icons-material';
import type { EmployeePayrollDetailTableProps } from './EmployeePayrollDetailTable.types';

export const EmployeePayrollDetailTable: React.FC<EmployeePayrollDetailTableProps> = ({
  details,
  isLoading = false,
  onExport,
  onPrint,
  summary,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Format currency with Colombian peso format
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date from ISO string (handles timezone issues)
  const formatDate = (dateString: string): string => {
    // Extract date components from ISO string (YYYY-MM-DD)
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);

    // Create date using UTC to avoid timezone offset issues
    const date = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC', // Force UTC to prevent timezone conversion
    }).format(date);
  };

  // Format hours display
  const formatHours = (hours: number): string => {
    return `${hours.toFixed(1)}h`;
  };

  // Mobile view renderer (Cards)
  const renderMobileView = () => (
    <Stack spacing={2}>
      {details.map((row, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            {/* Day and Date Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarIcon fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  {row.Dia}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {formatDate(row.DateHour)}
              </Typography>
            </Stack>

            <Divider sx={{ mb: 1.5 }} />

            {/* Time Schedule */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ScheduleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Horario
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip label={row.TimeIni} size="small" color="success" variant="outlined" />
                <Chip label={row.TimeEnd} size="small" color="error" variant="outlined" />
              </Stack>
            </Stack>

            {/* Lunch */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LunchIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Almuerzo
                </Typography>
              </Stack>
              <Typography variant="body2">
                {row.Lunch}
              </Typography>
            </Stack>

            {/* Hours and Rate */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Horas Trabajadas
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {formatHours(row.TotalHour)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Tarifa por Hora
              </Typography>
              <Typography variant="body2">
                {formatCurrency(row.Unit)}
              </Typography>
            </Stack>

            <Divider sx={{ my: 1 }} />

            {/* Total */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={600}>
                Total del Día
              </Typography>
              <Typography variant="h6" fontWeight={600} color="primary">
                {formatCurrency(row.Total)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  // Desktop view renderer (Table)
  const renderDesktopView = () => (
    <TableContainer component={Paper} variant="outlined">
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarIcon fontSize="small" />
                <Typography variant="subtitle2">Día</Typography>
              </Stack>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Fecha</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2">Entrada</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2">Salida</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2">Almuerzo</Typography>
            </TableCell>
            <TableCell align="right">
              <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end">
                <TimeIcon fontSize="small" />
                <Typography variant="subtitle2">Horas</Typography>
              </Stack>
            </TableCell>
            <TableCell align="right">
              <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end">
                <MoneyIcon fontSize="small" />
                <Typography variant="subtitle2">Tarifa/Hr</Typography>
              </Stack>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2">Total Día</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell>
                <Typography variant="body2">
                  {row.Dia}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(row.DateHour)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.TimeIni}
                  size="small"
                  variant="outlined"
                  color="success"
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.TimeEnd}
                  size="small"
                  variant="outlined"
                  color="error"
                />
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" color="text.secondary">
                  {row.Lunch}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {formatHours(row.TotalHour)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {formatCurrency(row.Unit)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="primary">
                  {formatCurrency(row.Total)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* Summary Footer */}
        {summary && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <Typography variant="subtitle2">
                  TOTALES DEL PERÍODO
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="primary">
                    {formatHours(summary.totalHours)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Promedio: {formatHours(summary.avgHoursPerDay)}/día
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <Typography variant="h6" color="success">
                  {formatCurrency(summary.totalAmount)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );

  // Render loading skeletons
  if (isLoading) {
    if (isMobile) {
      return (
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="70%" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      );
    } else {
      return (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                {['Día', 'Fecha', 'Entrada', 'Salida', 'Almuerzo', 'Horas', 'Tarifa', 'Total'].map((header) => (
                  <TableCell key={header}>
                    <Skeleton width="100%" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((row) => (
                <TableRow key={row}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                    <TableCell key={col}>
                      <Skeleton width="100%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  return (
    <Box>
      {/* Table Actions Bar - Responsive */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={{ xs: 1, sm: 0 }}
        marginBottom={2}
      >
        <Typography variant="h6" sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
          Detalle de Horas Trabajadas
        </Typography>
        <Stack direction="row" spacing={1}>
          {onPrint && !isMobile && (
            <Tooltip title="Imprimir reporte">
              <IconButton onClick={onPrint} size="small">
                <PrintIcon />
              </IconButton>
            </Tooltip>
          )}
          {onExport && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={onExport}
              fullWidth={isMobile}
            >
              {isMobile ? 'Exportar' : 'Exportar Excel'}
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Responsive Data View */}
      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* Summary Statistics Cards - Responsive */}
      {summary && isMobile && (
        <Stack spacing={2} marginTop={3}>
          {/* Summary Card for Mobile */}
          <Card variant="outlined" sx={{ backgroundColor: 'action.hover' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Resumen del Período
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TimeIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Horas Totales
                    </Typography>
                  </Stack>
                  <Typography variant="h6" color="primary">
                    {formatHours(summary.totalHours)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Promedio Diario
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={500}>
                    {formatHours(summary.avgHoursPerDay)}/día
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MoneyIcon color="success" fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>
                      Pago Total
                    </Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight={600} color="success">
                    {formatCurrency(summary.totalAmount)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Desktop Statistics Cards */}
      {summary && !isMobile && (
        <Stack direction="row" spacing={2} marginTop={3} justifyContent="flex-end">
          <Paper variant="outlined">
            <Box padding={2} minWidth={150}>
              <Stack alignItems="center">
                <TimeIcon color="primary" />
                <Typography variant="h6">
                  {formatHours(summary.totalHours)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Horas Totales
                </Typography>
              </Stack>
            </Box>
          </Paper>
          <Paper variant="outlined">
            <Box padding={2} minWidth={150}>
              <Stack alignItems="center">
                <MoneyIcon color="success" />
                <Typography variant="h6" color="success">
                  {formatCurrency(summary.totalAmount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Pago Total
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Stack>
      )}
    </Box>
  );
};