import { useState } from 'react';
import { Container, Paper, Box, Typography, Alert, Stack, Chip, Divider } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { EmployeePayrollFilters } from '../../components/EmployeePayrollFilters';
import { EmployeePayrollDetailTable } from '../../components/EmployeePayrollDetailTable';
import type { User } from './EmployeePayrollReportPage.types';
import { useUsers } from '../../hooks/useUsers';
import { useEmployeePayrollReport } from '../../hooks/useEmployeePayrollReport';

// ==================== MAIN PAGE COMPONENT ====================
export const EmployeePayrollReportPage = () => {
  // 👥 Load users from API
  const { users, loading: usersLoading } = useUsers();

  // 📊 Payroll report hook
  const {
    details,
    summary,
    loading: reportLoading,
    error: reportError,
    hasData,
    isEmpty,
    fetchReport
  } = useEmployeePayrollReport();

  // Visual state for filters and selections
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf('week'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf('week'));

  // Handler for search action
  const handleSearch = async () => {
    if (!selectedUser || !startDate || !endDate) return;

    // Call API with real data
    await fetchReport(selectedUser.UserId, {
      ini: startDate.format('YYYY-MM-DD'),
      final: endDate.format('YYYY-MM-DD')
    });
  };

  // Handler for export action
  const handleExport = () => {
    // TODO: Implement export to Excel/CSV
    console.log('Exporting payroll data...');
  };

  // Determine current view state
  const showEmptyState = !selectedUser && !reportLoading;
  const showNoResults = isEmpty;
  const showResults = hasData;

  return (
    <Container maxWidth="xl">
      <Stack spacing={3} paddingY={3}>
        {/* Page Header */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Reporte de Nómina por Empleado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consulte el detalle de horas trabajadas y pagos por empleado en un período específico
          </Typography>
        </Box>

        {/* Main Content Paper */}
        <Paper elevation={0}>
          <Box padding={3}>
            {/* Filters Section */}
            <EmployeePayrollFilters
            users={users}
            selectedUser={selectedUser}
            startDate={startDate}
            endDate={endDate}
            onUserChange={setSelectedUser}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSearch={handleSearch}
            isSearching={reportLoading}
            disabled={usersLoading}
          />

            <Divider />
            <Box marginY={3} />

            {/* Results Section */}
            {showEmptyState && (
              <Stack alignItems="center" spacing={2} paddingY={8}>
                <InfoIcon fontSize="large" color="disabled" />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Seleccione un empleado para comenzar
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Use los filtros superiores para buscar el reporte de nómina de un empleado específico
                </Typography>
              </Stack>
            )}

            {reportError && (
              <Box marginTop={2}>
                <Alert severity="error">
                  {reportError.message || 'Error al cargar el reporte. Por favor intente nuevamente.'}
                </Alert>
              </Box>
            )}

            {showNoResults && (
              <Box marginTop={2}>
                <Alert severity="info">
                  No se encontraron registros de nómina para el empleado y período seleccionado.
                  Intente con un rango de fechas diferente.
                </Alert>
              </Box>
            )}

            {showResults && summary && details && (
              <Stack spacing={3}>
                {/* Period Summary Header */}
                <Paper variant="outlined">
                  <Box padding={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                      <Box>
                        <Typography variant="h6">
                          {summary.employeeName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Período: {startDate?.format('DD/MM/YYYY')} - {endDate?.format('DD/MM/YYYY')}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          label={`${summary.daysWorked} días trabajados`}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={`${summary.totalHours} horas totales`}
                          color="success"
                          variant="outlined"
                        />
                        <Chip
                          label={`$${summary.totalPayment?.toLocaleString('es-CO')} total`}
                          color="info"
                          variant="filled"
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </Paper>

              {/* Details Table */}
              <EmployeePayrollDetailTable
                details={details}
                isLoading={reportLoading}
                onExport={handleExport}
                summary={{
                  totalHours: summary.totalHours,
                  totalAmount: summary.totalPayment,
                  avgHoursPerDay: summary.averageHoursPerDay,
                }}
              />
            </Stack>
          )}
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};