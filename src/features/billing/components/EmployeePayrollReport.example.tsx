/**
 * 📊 Ejemplo de uso de los hooks y servicios para Employee Payroll Report
 *
 * Este archivo muestra cómo integrar:
 * - useUsers: Para el autocomplete de empleados
 * - useEmployeePayrollReport: Para consultar y mostrar el reporte
 * - useEmployeeStatement: Para generar comprobantes PDF
 *
 * NOTA: Este es un ejemplo de referencia. El componente real debe
 * adaptarse al diseño y requisitos específicos de la aplicación.
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

// Hooks personalizados
import { useUsers } from '../hooks/useUsers';
import { useEmployeePayrollReport, useEmployeeStatement } from '../hooks/useEmployeePayrollReport';

// Interfaces
import type { PayrollWeekRange } from '../interfaces/payroll.interfaces';
import type { User } from '../interfaces/user.interfaces';

// Utilidades
import { formatCurrency, formatDate } from '../utils/payroll.utils';

export const EmployeePayrollReportExample: React.FC = () => {
  // ==================== ESTADOS LOCALES ====================

  // 👤 Empleado seleccionado
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 📅 Rango de fechas
  const [dateRange, setDateRange] = useState<PayrollWeekRange>({
    ini: '',
    final: ''
  });

  // ==================== HOOKS PERSONALIZADOS ====================

  // 👥 Hook para cargar usuarios
  const {
    users,
    loading: usersLoading,
    error: usersError,
    filterUsersLocally
  } = useUsers();

  // 📊 Hook para el reporte de nómina
  const {
    details,
    summary,
    loading: reportLoading,
    error: reportError,
    hasData,
    isEmpty,
    fetchReport,
    clearReport,
    refreshReport
  } = useEmployeePayrollReport();

  // 📄 Hook para generar comprobantes
  const {
    generating,
    error: statementError,
    generateStatement
  } = useEmployeeStatement();

  // ==================== HANDLERS ====================

  /**
   * 🔍 Manejar búsqueda de reporte
   */
  const handleSearch = async () => {
    if (!selectedUser) {
      alert('Por favor seleccione un empleado');
      return;
    }

    if (!dateRange.ini || !dateRange.final) {
      alert('Por favor seleccione un rango de fechas válido');
      return;
    }

    await fetchReport(selectedUser.UserId, dateRange);
  };

  /**
   * 📄 Manejar descarga de comprobante
   */
  const handleDownloadStatement = async () => {
    if (!selectedUser || !dateRange.ini || !dateRange.final) {
      alert('Debe consultar un reporte primero');
      return;
    }

    const success = await generateStatement(selectedUser.UserId, dateRange);
    if (success) {
      console.log('✅ Comprobante descargado exitosamente');
    }
  };

  /**
   * 🔄 Limpiar formulario y resultados
   */
  const handleClear = () => {
    setSelectedUser(null);
    setDateRange({ ini: '', final: '' });
    clearReport();
  };

  // ==================== RENDERIZADO ====================

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        📊 Employee Payroll Report
      </Typography>

      {/* Formulario de búsqueda */}
      <Box marginBottom={3}>
        <Card>
          <CardContent>
          <Stack spacing={2}>
            {/* Selector de empleado */}
            <Box>
              <Autocomplete
                options={users}
                value={selectedUser}
                onChange={(_, value) => setSelectedUser(value)}
                getOptionLabel={(option) => `${option.FirstName} ${option.LastName}`}
                loading={usersLoading}
                disabled={reportLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar Empleado"
                    variant="outlined"
                    error={!!usersError}
                    helperText={usersError?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {usersLoading && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                filterOptions={(_, { inputValue }) => {
                  return filterUsersLocally(inputValue);
                }}
              />
            </Box>

            {/* Fecha inicio */}
            <Box>
              <TextField
                label="Fecha Inicio"
                type="date"
                value={dateRange.ini}
                onChange={(e) => setDateRange({ ...dateRange, ini: e.target.value })}
                disabled={reportLoading}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Fecha fin */}
            <Box>
              <TextField
                label="Fecha Fin"
                type="date"
                value={dateRange.final}
                onChange={(e) => setDateRange({ ...dateRange, final: e.target.value })}
                disabled={reportLoading}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Botones de acción */}
            <Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  disabled={reportLoading || !selectedUser || !dateRange.ini || !dateRange.final}
                  startIcon={reportLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                  fullWidth
                >
                  {reportLoading ? 'Consultando...' : 'Consultar'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  disabled={reportLoading}
                  startIcon={<ClearIcon />}
                >
                  Limpiar
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      </Box>

      {/* Mensajes de error */}
      {reportError && (
        <Box marginBottom={2}>
          <Alert severity="error">
            {reportError.message}
          </Alert>
        </Box>
      )}

      {statementError && (
        <Box marginBottom={2}>
          <Alert severity="warning">
            Error al generar comprobante: {statementError.message}
          </Alert>
        </Box>
      )}

      {/* Mensaje cuando no hay datos */}
      {isEmpty && (
        <Box marginBottom={2}>
          <Alert severity="info">
            No se encontraron registros para el período seleccionado.
          </Alert>
        </Box>
      )}

      {/* Resumen del reporte */}
      {hasData && summary && (
        <Box marginBottom={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Resumen del Período
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Empleado
                  </Typography>
                  <Typography variant="subtitle1">
                    {summary.employeeName}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    Días Trabajados
                  </Typography>
                  <Typography variant="subtitle1">
                    {summary.daysWorked}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    Horas Totales
                  </Typography>
                  <Typography variant="subtitle1">
                    {summary.totalHours.toFixed(2)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pago Total
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(summary.totalPayment)}
                  </Typography>
                </Box>
              </Stack>

              <Box marginY={2}>
                <Divider />
              </Box>

              {/* Botones de acción para el reporte */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={refreshReport}
                  startIcon={<RefreshIcon />}
                  disabled={reportLoading}
                >
                  Refrescar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDownloadStatement}
                  startIcon={generating ? <CircularProgress size={20} /> : <DownloadIcon />}
                  disabled={generating}
                >
                  {generating ? 'Generando...' : 'Descargar Comprobante'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Tabla de detalles diarios */}
      {hasData && details && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📅 Detalle Diario
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Día</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Entrada</TableCell>
                    <TableCell>Salida</TableCell>
                    <TableCell>Almuerzo</TableCell>
                    <TableCell align="right">Horas</TableCell>
                    <TableCell align="right">Tarifa/Hr</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map((day, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{day.Dia}</TableCell>
                      <TableCell>{formatDate(day.DateHour)}</TableCell>
                      <TableCell>{day.TimeIni}</TableCell>
                      <TableCell>{day.TimeEnd}</TableCell>
                      <TableCell>{day.Lunch}</TableCell>
                      <TableCell align="right">{day.TotalHour.toFixed(2)}</TableCell>
                      <TableCell align="right">{formatCurrency(day.Unit)}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(day.Total)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Fila de totales */}
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <Typography variant="subtitle2">
                        TOTALES
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {summary?.totalHours.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        Prom: {formatCurrency(summary?.averageHourlyRate || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" color="primary">
                        {formatCurrency(summary?.totalPayment || 0)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

/**
 * 📝 NOTAS DE INTEGRACIÓN
 *
 * Para usar este componente en tu aplicación:
 *
 * 1. Importar en tu página principal:
 *    import { EmployeePayrollReportExample } from '../components/EmployeePayrollReport.example';
 *
 * 2. Renderizar en el lugar apropiado:
 *    <EmployeePayrollReportExample />
 *
 * 3. Personalizar según necesidades:
 *    - Ajustar estilos con theme de MUI
 *    - Agregar validaciones adicionales
 *    - Integrar con sistema de notificaciones
 *    - Agregar permisos/roles si es necesario
 *
 * 4. Verificar las interfaces:
 *    - Ejecutar testAllServices() para confirmar estructura del API
 *    - Ajustar interfaces en user.interfaces.ts según respuesta real
 *
 * 5. Manejo de errores:
 *    - Considerar usar un toast/snackbar en lugar de alerts
 *    - Implementar retry automático si es necesario
 */

export default EmployeePayrollReportExample;