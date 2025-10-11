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
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import type { EmployeePayrollDetailTableProps } from './EmployeePayrollDetailTable.types';

export const EmployeePayrollDetailTable: React.FC<EmployeePayrollDetailTableProps> = ({
  details,
  isLoading = false,
  onExport,
  onPrint,
  summary,
}) => {
  // Format currency with Colombian peso format
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date from ISO string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Format hours display
  const formatHours = (hours: number): string => {
    return `${hours.toFixed(1)}h`;
  };

  // Render loading skeletons
  if (isLoading) {
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

  return (
    <Box>
      {/* Table Actions Bar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h6">
          Detalle de Horas Trabajadas
        </Typography>
        <Stack direction="row" spacing={1}>
          {onPrint && (
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
            >
              Exportar Excel
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Data Table */}
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
              <TableRow
                key={index}
                hover
              >
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

      {/* Optional Statistics Cards */}
      {summary && (
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