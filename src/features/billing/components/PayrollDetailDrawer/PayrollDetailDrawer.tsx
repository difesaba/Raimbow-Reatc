import React from 'react';
import {
  Drawer,
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
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import type { PayrollDetailDrawerProps } from '../../interfaces/payroll.interfaces';
import { formatCurrency, formatDate } from '../../utils/payroll.utils';

/**
 * Drawer component displaying detailed daily breakdown for an employee
 * Replaces the modal for better UX and context preservation
 */
export const PayrollDetailDrawer: React.FC<PayrollDetailDrawerProps> = ({
  open,
  onClose,
  employeeDetails,
  loading = false
}) => {
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

  const drawerContent = (
    <Stack
      role="presentation"
      spacing={0}
      height="100%"
    >
      {/* Header */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        padding={2}
        borderBottom={1}
        borderColor="divider"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <PersonIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            {loading ? <Skeleton width={150} /> : employeeName}
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          edge="end"
          aria-label="Close drawer"
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* Summary Section */}
      <Stack spacing={1} padding={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Resumen de la Semana
        </Typography>
        <Stack direction="row" spacing={2}>
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

      {/* Daily Details Table */}
      <Stack spacing={2} padding={2} overflow="auto" flexGrow={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Desglose Diario
        </Typography>

        {loading ? (
          <Stack spacing={2}>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={60} />
            ))}
          </Stack>
        ) : employeeDetails && employeeDetails.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Día</TableCell>
                  <TableCell>Fecha</TableCell>
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
                      <Typography variant="body2" fontWeight={500}>
                        {day.Dia}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(day.DateHour)}
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
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(day.Unit)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatCurrency(day.Total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Totals Row */}
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" fontWeight={600}>
                      Total
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {totalHours.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {formatCurrency(totalPayment)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack alignItems="center" paddingY={4}>
            <Typography variant="body2" color="text.secondary">
              No hay detalles disponibles
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true // Better mobile performance
      }}
    >
      {drawerContent}
    </Drawer>
  );
};