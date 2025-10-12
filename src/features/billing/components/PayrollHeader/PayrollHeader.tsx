import React from 'react';
import { Chip, Typography, Stack, Skeleton } from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Schedule as HoursIcon
} from '@mui/icons-material';
import type { PayrollHeaderProps } from '../../interfaces/payroll.interfaces';
import { formatCurrency } from '../../utils/payroll.utils';

/**
 * Header component displaying payroll period and summary metrics
 * Uses compact chips for better information density
 */
export const PayrollHeader: React.FC<PayrollHeaderProps> = ({
  weekRange,
  summary,
  loading = false
}) => {
  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };

    return `${startDate.toLocaleDateString('es-ES', options)} - ${endDate.toLocaleDateString('es-ES', options)}`;
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Skeleton variant="rounded" width={250} height={32} />
          <Skeleton variant="rounded" width={150} height={32} />
          <Skeleton variant="rounded" width={120} height={32} />
          <Skeleton variant="rounded" width={130} height={32} />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={{ xs: 1.5, sm: 2 }}>
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' }, // h6 size on mobile, h5 on desktop
        }}
      >
        Reporte de Nómina Semanal
      </Typography>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ gap: { xs: 1, sm: 1.5 } }}
      >
        {/* Date Range Chip */}
        <Chip
          icon={<CalendarIcon fontSize="small" />}
          label={formatDateRange(weekRange.ini, weekRange.final)}
          color="default"
          variant="outlined"
          size="medium"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        />

        {/* Total Payroll Chip */}
        <Chip
          icon={<MoneyIcon fontSize="small" />}
          label={`Total: ${formatCurrency(summary.totalPayroll)}`}
          color="success"
          variant="filled"
          size="medium"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        />

        {/* Employee Count Chip */}
        <Chip
          icon={<PeopleIcon fontSize="small" />}
          label={`${summary.employeeCount} Empleados`}
          color="primary"
          variant="outlined"
          size="medium"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        />

        {/* Total Hours Chip */}
        <Chip
          icon={<HoursIcon fontSize="small" />}
          label={`${summary.totalHours.toFixed(1)} Horas`}
          color="secondary"
          variant="outlined"
          size="medium"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        />
      </Stack>
    </Stack>
  );
};