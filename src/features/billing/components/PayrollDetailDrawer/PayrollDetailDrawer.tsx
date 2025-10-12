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
  Paper,
  Card,
  CardContent,
  Box,
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
import type { PayrollDetailDrawerProps } from '../../interfaces/payroll.interfaces';
import { formatCurrency, formatDate } from '../../utils/payroll.utils';

/**
 * Drawer component displaying detailed daily breakdown for an employee
 * Features responsive design: full-width on mobile, fixed width on desktop
 */
export const PayrollDetailDrawer: React.FC<PayrollDetailDrawerProps> = ({
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
          <Typography variant="body2" color="text.secondary">
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
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {day.Dia}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(day.DateHour)}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 1.5 }} />

              {/* Schedule */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Horario
                  </Typography>
                </Stack>
                <Typography variant="body2">
                  {day.TimeIni} - {day.TimeEnd}
                </Typography>
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
                  {day.Lunch}
                </Typography>
              </Stack>

              {/* Hours */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Horas Trabajadas
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {day.TotalHour.toFixed(2)} hrs
                </Typography>
              </Stack>

              {/* Rate */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Tarifa por Hora
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(day.Unit)}
                </Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* Total */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" fontWeight={600}>
                  Total del Día
                </Typography>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  {formatCurrency(day.Total)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {/* Totals Card */}
        <Card variant="outlined" sx={{ backgroundColor: 'action.hover' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Total de la Semana
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Horas Totales
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {totalHours.toFixed(2)} hrs
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={600}>
                Pago Total
              </Typography>
              <Typography variant="h6" fontWeight={600} color="success.main">
                {formatCurrency(totalPayment)}
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
          <Typography variant="body2" color="text.secondary">
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
    );
  };

  const drawerContent = (
    <Stack
      role="presentation"
      spacing={0}
      height="100%"
      sx={{ width: isMobile ? '100vw' : 600 }}
    >
      {/* Swipe Handle (Mobile only) */}
      {isMobile && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            py: 1,
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'divider'
            }}
          />
        </Box>
      )}

      {/* Header - Sticky on mobile */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        padding={{ xs: 1.5, sm: 2 }}
        borderBottom={1}
        borderColor="divider"
        sx={{
          position: isMobile ? 'sticky' : 'relative',
          top: 0,
          zIndex: 1, // Low z-index to stay below AppBar but above drawer content
          backgroundColor: 'background.paper',
          ...(isMobile && {
            boxShadow: 1 // Subtle shadow when sticky
          })
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" flex={1} overflow="hidden">
          <PersonIcon color="primary" fontSize={isSmallMobile ? 'small' : 'medium'} />
          <Typography
            variant={isSmallMobile ? 'subtitle1' : 'h6'}
            fontWeight={600}
            noWrap
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {loading ? <Skeleton width={150} /> : employeeName}
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          edge="end"
          aria-label="Close drawer"
          sx={{
            minWidth: isMobile ? 48 : 44,
            minHeight: isMobile ? 48 : 44,
            backgroundColor: isMobile ? 'action.hover' : 'transparent',
            border: isMobile ? 1 : 0,
            borderColor: 'divider',
            '&:hover': {
              backgroundColor: isMobile ? 'action.selected' : 'action.hover',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <CloseIcon fontSize={isMobile ? 'medium' : 'small'} />
        </IconButton>
      </Stack>

      {/* Summary Section */}
      <Stack spacing={1} padding={{ xs: 1.5, sm: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Resumen de la Semana
        </Typography>
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          flexWrap="wrap"
          useFlexGap
        >
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
      <Stack spacing={2} padding={{ xs: 1.5, sm: 2 }} overflow="auto" flexGrow={1}>
        <Typography variant="subtitle2" color="text.secondary">
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
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true // Better mobile performance
      }}
      PaperProps={{
        sx: {
          width: isMobile ? '100vw' : 600,
          maxWidth: '100vw'
        }
      }}
      // Drawer closes by backdrop click by default
      // Drawer closes by ESC key by default
    >
      {drawerContent}
    </Drawer>
  );
};