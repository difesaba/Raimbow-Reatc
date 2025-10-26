import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Autocomplete,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import dayjs, { Dayjs } from 'dayjs';
import { DateHourFormModal } from '../../components/DateHourFormModal';
import { DateHourTable, type DateHourTableHandle } from '../../components/DateHourTable';
import { useDateHours } from '../../hooks/useDateHours';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../interfaces/user.interfaces';
import type { DateHourRecord, CreateDateHourDTO, UpdateDateHourDTO } from '../../interfaces/payroll.interfaces';

/**
 * 🕐 Página principal para registro de horas trabajadas
 *
 * Flujo:
 * 1. Seleccionar usuario y fecha
 * 2. Agregar horas (modal NO se cierra, permite agregar múltiples días)
 * 3. Editar/eliminar registros existentes
 * 4. Ver totales del día
 */
export const DateHourPage: React.FC = () => {
  // Estados de selección
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // Estado del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<DateHourRecord | null>(null);

  // Estado de notificaciones
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Ref para la tabla (para hacer highlight)
  const tableRef = useRef<DateHourTableHandle>(null);

  // Hook de usuarios
  const { users, loading: loadingUsers } = useUsers();

  // Hook de registros de horas
  const dateHoursHook = useDateHours(
    selectedUser?.UserId ?? null,
    selectedDate?.format('YYYY-MM-DD') ?? null
  );

  /**
   * 📢 Mostrar notificación
   */
  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * 🔄 Cerrar notificación
   */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /**
   * ➕ Abrir modal para crear
   */
  const handleOpenCreateModal = () => {
    setRecordToEdit(null);
    setModalOpen(true);
  };

  /**
   * ✏️ Abrir modal para editar
   */
  const handleEdit = (record: DateHourRecord) => {
    setRecordToEdit(record);
    setModalOpen(true);
  };

  /**
   * ❌ Cerrar modal
   */
  const handleCloseModal = () => {
    setModalOpen(false);
    setRecordToEdit(null);
  };

  /**
   * 💾 Guardar registro (create o update)
   */
  const handleSave = async (
    data: CreateDateHourDTO | UpdateDateHourDTO
  ): Promise<DateHourRecord> => {
    try {
      let savedRecord: DateHourRecord;

      if (recordToEdit) {
        // Modo edición
        savedRecord = await dateHoursHook.update(recordToEdit.Id, data as UpdateDateHourDTO);
        showSnackbar('Registro actualizado exitosamente');

        // En modo edición, cerrar modal
        handleCloseModal();
      } else {
        // Modo creación
        savedRecord = await dateHoursHook.create(data as CreateDateHourDTO);
        showSnackbar('Registro agregado exitosamente');

        // El modal NO se cierra, se limpia en el componente modal
      }

      return savedRecord;
    } catch (error) {
      const err = error as any;
      showSnackbar(err.message || 'Error al guardar el registro', 'error');
      throw error;
    }
  };

  /**
   * 💡 Callback cuando se crea un registro (para hacer highlight)
   */
  const handleRecordCreated = (recordId: number) => {
    // Hacer highlight en la tabla detrás del modal
    if (tableRef.current) {
      tableRef.current.highlightRow(recordId);
    }
  };

  /**
   * 🗑️ Eliminar registro
   */
  const handleDelete = async (id: number): Promise<void> => {
    try {
      await dateHoursHook.remove(id);
      showSnackbar('Registro eliminado exitosamente');
    } catch (error) {
      const err = error as Error;
      showSnackbar(err.message || 'Error al eliminar el registro', 'error');
      throw error;
    }
  };

  // Validar si se puede agregar horas
  const canAddHours = selectedUser !== null && selectedDate !== null;

  // Obtener tarifa del usuario seleccionado
  const userRate = selectedUser?.Salary ?? selectedUser?.HourlyRate ?? 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Registrar Horas Trabajadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seleccione un usuario y fecha para ver y administrar sus registros de horas
            </Typography>
          </Paper>

          {/* Filtros */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'stretch' }}>
              {/* Selector de Usuario */}
              <Box sx={{ flex: { md: '1 1 50%' } }}>
                <Autocomplete
                  options={users}
                  getOptionLabel={(user) => `${user.FirstName} ${user.LastName}`}
                  value={selectedUser}
                  onChange={(_, newValue) => {
                    console.log('👤 Usuario seleccionado:', newValue);
                    setSelectedUser(newValue);
                  }}
                  loading={loadingUsers}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Usuario *"
                      placeholder="Seleccione un usuario"
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.UserId === value.UserId}
                />
              </Box>

              {/* Selector de Fecha */}
              <Box sx={{ flex: { md: '1 1 33%' }, minWidth: { xs: 200, md: 150 } }}>
                <DatePicker
                  label="Fecha"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue ? dayjs(newValue) : null)}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small'
                    }
                  }}
                />
              </Box>

              {/* Botón Agregar */}
              <Box sx={{ flex: { md: '0 0 auto' }, minWidth: { md: 200 } }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenCreateModal}
                  disabled={!canAddHours}
                  fullWidth
                >
                  Agregar Horas
                </Button>
              </Box>
            </Box>

            {/* Información del usuario seleccionado */}
            {selectedUser && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Usuario:</strong> {selectedUser.FirstName} {selectedUser.LastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Tarifa:</strong> ${userRate}/hora
                </Typography>
                {selectedUser.Department && (
                  <Typography variant="body2">
                    <strong>Departamento:</strong> {selectedUser.Department}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>

          {/* Tabla de registros */}
          {selectedUser && selectedDate && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Registros del {selectedDate.format('DD/MM/YYYY')}
              </Typography>

              <DateHourTable
                ref={tableRef}
                records={dateHoursHook.records}
                totals={dateHoursHook.totals}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={dateHoursHook.loading}
              />
            </Paper>
          )}

          {/* Resumen del día */}
          {selectedUser && selectedDate && dateHoursHook.records.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumen del Día
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Box sx={{ flex: 1, textAlign: 'center', p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Registros
                  </Typography>
                  <Typography variant="h5">
                    {dateHoursHook.totals.recordCount}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center', p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Horas
                  </Typography>
                  <Typography variant="h5">
                    {dateHoursHook.totals.totalHours.toFixed(2)} hrs
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center', p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total a Pagar
                  </Typography>
                  <Typography variant="h5" color="primary">
                    ${dateHoursHook.totals.totalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Mensaje cuando no hay usuario seleccionado */}
          {!selectedUser && (
            <Paper sx={{ p: 5, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Seleccione un usuario para comenzar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Podrá ver y administrar los registros de horas trabajadas
              </Typography>
            </Paper>
          )}
        </Container>

        {/* Modal de formulario */}
        {selectedUser && (
          <DateHourFormModal
            open={modalOpen}
            onClose={handleCloseModal}
            onSave={handleSave}
            onRecordCreated={handleRecordCreated}
            editRecord={recordToEdit}
            userId={selectedUser.UserId}
            userRate={userRate}
          />
        )}

        {/* Snackbar de notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};
