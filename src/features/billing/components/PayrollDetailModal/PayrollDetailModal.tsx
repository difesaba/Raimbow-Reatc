import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
  Chip,
  Skeleton,
  Paper,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Restaurant as LunchIcon
} from '@mui/icons-material';
import type { PayrollDetailModalProps } from '../../interfaces/payroll.interfaces';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/payroll.utils';

/**
 * Modal component displaying detailed daily breakdown for an employee
 * Features responsive design: fullscreen on mobile, large modal on desktop
 */
export const PayrollDetailModal: React.FC<PayrollDetailModalProps> = ({
  open,
  onClose,
  employeeDetails,
  loading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const calculateTotals = () => {
    if (!employeeDetails || employeeDetails.length === 0) {
      return { totalHours: 0, totalPayment: 0 };
    }

    return employeeDetails.reduce(
      (acc, day) => ({
        totalHours: acc.totalHours + day.TotalHour,
        totalPayment: acc.totalPayment + day.Total
      }),
      { totalHours: 0, totalPayment: 0 }
    );
  };

  const { totalHours, totalPayment } = calculateTotals();
  const employeeName = employeeDetails?.[0]?.FullName || '';

  // Mobile view for daily details (Cards)
  const renderMobileDetails = () => {
    if (!employeeDetails || employeeDetails.length === 0) {
      return (
        <Stack alignItems="center" paddingY={4}>
          <Typography variant="body2" color="textSecondary">
            No hay detalles disponibles
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        {employeeDetails.map((day, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              {/* Day and Date */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" component="div">
                  <strong>{day.Dia}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatDate(day.DateHour)}
                </Typography>
              </Stack>

              <Divider />

              {/* Creation Date */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="caption" color="textSecondary">
                  Fecha de Registro
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatDateTime(day.CreateDate)}
                </Typography>
              </Stack>

              {/* Schedule */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary">
                    Horario
                  </Typography>
                </Stack>
                <Typography variant="body2">
                  {day.TimeIni} - {day.TimeEnd}
                </Typography>
              </Stack>

              {/* Lunch */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LunchIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary">
                    Almuerzo
                  </Typography>
                </Stack>
                <Typography variant="body2">
                  {day.Lunch}
                </Typography>
              </Stack>

              {/* Hours */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="body2" color="textSecondary">
                  Horas Trabajadas
                </Typography>
                <Typography variant="body2">
                  <strong>{day.TotalHour.toFixed(2)} hrs</strong>
                </Typography>
              </Stack>

              {/* Rate */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="body2" color="textSecondary">
                  Tarifa por Hora
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(day.Unit)}
                </Typography>
              </Stack>

              <Divider />

              {/* Total */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">
                  <strong>Total del Día</strong>
                </Typography>
                <Typography variant="h6" color="success">
                  <strong>{formatCurrency(day.Total)}</strong>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {/* Totals Card */}
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">
                <strong>Total de la Semana</strong>
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">
                Horas Totales
              </Typography>
              <Typography variant="body2">
                <strong>{totalHours.toFixed(2)} hrs</strong>
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">
                <strong>Pago Total</strong>
              </Typography>
              <Typography variant="h6" color="success">
                <strong>{formatCurrency(totalPayment)}</strong>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  };

  // Desktop view for daily details (Table)
  const renderDesktopDetails = () => {
    if (!employeeDetails || employeeDetails.length === 0) {
      return (
        <Stack alignItems="center" paddingY={4}>
          <Typography variant="body2" color="textSecondary">
            No hay detalles disponibles
          </Typography>
        </Stack>
      );
    }

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Día</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell align="center">Horario</TableCell>
              <TableCell align="center">Almuerzo</TableCell>
              <TableCell align="right">Horas</TableCell>
              <TableCell align="right">Tarifa</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeDetails.map((day, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <Typography variant="body2">
                    <strong>{day.Dia}</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(day.DateHour)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDateTime(day.CreateDate)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="caption" display="block">
                    {day.TimeIni} - {day.TimeEnd}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {day.Lunch}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {day.TotalHour.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="textSecondary">
                    {formatCurrency(day.Unit)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="success">
                    <strong>{formatCurrency(day.Total)}</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            {/* Totals Row */}
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="body2">
                  <strong>Total</strong>
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  <strong>{totalHours.toFixed(2)}</strong>
                </Typography>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <Typography variant="body2" color="success">
                  <strong>{formatCurrency(totalPayment)}</strong>
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      {/* Header with Employee Name and Close Button */}
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonIcon color="primary" fontSize={isSmallMobile ? 'small' : 'medium'} />
            <Typography variant={isSmallMobile ? 'subtitle1' : 'h6'} component="span">
              {loading ? <Skeleton width={150} /> : <strong>{employeeName}</strong>}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            edge="end"
            aria-label="Cerrar modal"
            size={isMobile ? 'medium' : 'small'}
          >
            <CloseIcon fontSize={isMobile ? 'medium' : 'small'} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Content - Scrollable */}
      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Summary Section */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="textSecondary">
              Resumen de la Semana
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                icon={<CalendarIcon />}
                label={loading ? <Skeleton width={60} /> : `${employeeDetails?.length || 0} Días`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<MoneyIcon />}
                label={loading ? <Skeleton width={80} /> : formatCurrency(totalPayment)}
                size="small"
                color="success"
              />
              <Chip
                label={loading ? <Skeleton width={70} /> : `${totalHours.toFixed(2)} Horas`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Stack>

          <Divider />

          {/* Daily Details */}
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Desglose Diario
            </Typography>

            {loading ? (
              <Stack spacing={2}>
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={60} />
                ))}
              </Stack>
            ) : isMobile ? (
              renderMobileDetails()
            ) : (
              renderDesktopDetails()
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
