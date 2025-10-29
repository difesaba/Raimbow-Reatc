import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { DateHourRecord, CreateDateHourDTO, UpdateDateHourDTO } from '../../interfaces/payroll.interfaces';

interface DateHourFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateDateHourDTO | UpdateDateHourDTO) => Promise<DateHourRecord>;
  onRecordCreated?: (recordId: number) => void;
  editRecord?: DateHourRecord | null;
  userId: number;
  userRate: number;
}

/**
 * 🕐 Modal para agregar/editar registros de horas trabajadas
 *
 * Características:
 * - Cálculo automático de horas y valor total
 * - Modo create: mantiene modal abierto y limpia form después de guardar
 * - Modo edit: cierra modal después de guardar
 * - Validaciones en tiempo real
 */
export const DateHourFormModal: React.FC<DateHourFormModalProps> = ({
  open,
  onClose,
  onSave,
  onRecordCreated,
  editRecord,
  userId,
  userRate
}) => {
  // Estados del formulario
  const [fecha, setFecha] = useState<Dayjs | null>(dayjs());
  const [timeIni, setTimeIni] = useState<Dayjs | null>(null);
  const [timeEnd, setTimeEnd] = useState<Dayjs | null>(null);
  const [hasLunch, setHasLunch] = useState(true); // ✅ Marcado por defecto
  const [lunchMinutes, setLunchMinutes] = useState<number>(60); // ✅ 60 minutos por defecto

  // Estados calculados
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modo edición
  const isEditMode = !!editRecord;

  /**
   * 🔄 Inicializar formulario con datos de edición o valores por defecto
   */
  useEffect(() => {
    if (open) {
      if (editRecord) {
        // Modo edición: prellenar con datos existentes
        // Extraer solo YYYY-MM-DD para evitar conversión de timezone
        setFecha(dayjs(editRecord.DateHour.split('T')[0]));
        setTimeIni(dayjs(`2000-01-01 ${editRecord.TimeIni}`));
        setTimeEnd(dayjs(`2000-01-01 ${editRecord.TimeEnd}`));
        setHasLunch(editRecord.DiscountHour > 0);
        // ✅ Convertir horas decimales del backend → minutos para la UI
        setLunchMinutes(Math.round(editRecord.DiscountHour * 60));
      } else {
        // Modo creación: valores por defecto
        resetForm();
      }
      setError(null);
    }
  }, [open, editRecord]);

  /**
   * 🧮 Cálculo automático de horas y valor total
   */
  useEffect(() => {
    if (!timeIni || !timeEnd) {
      setCalculatedHours(0);
      setCalculatedTotal(0);
      return;
    }

    // Validar que fin > inicio
    if (timeEnd.isBefore(timeIni) || timeEnd.isSame(timeIni)) {
      setCalculatedHours(0);
      setCalculatedTotal(0);
      return;
    }

    // Calcular diferencia en minutos
    const diffMinutes = timeEnd.diff(timeIni, 'minute');

    // Restar tiempo de almuerzo
    const lunchDiscount = hasLunch ? lunchMinutes : 0;
    const workMinutes = diffMinutes - lunchDiscount;

    // Convertir a horas (con 2 decimales)
    const hours = Math.max(0, workMinutes / 60);
    const roundedHours = Math.round(hours * 100) / 100;

    // Calcular valor total
    const total = roundedHours * userRate;
    const roundedTotal = Math.round(total * 100) / 100;

    // ✅ Actualizar estado INMUTABLEMENTE
    setCalculatedHours(roundedHours);
    setCalculatedTotal(roundedTotal);
  }, [timeIni, timeEnd, hasLunch, lunchMinutes, userRate]);

  /**
   * 🧹 Limpiar formulario
   */
  const resetForm = () => {
    setFecha(dayjs());
    setTimeIni(null);
    setTimeEnd(null);
    setHasLunch(true); // ✅ Marcado por defecto
    setLunchMinutes(60); // ✅ 60 minutos por defecto
    setCalculatedHours(0);
    setCalculatedTotal(0);
    setError(null);
  };

  /**
   * ✅ Validar formulario
   */
  const validateForm = (): boolean => {
    if (!fecha) {
      setError('La fecha es requerida');
      return false;
    }

    if (!timeIni || !timeEnd) {
      setError('Las horas de inicio y fin son requeridas');
      return false;
    }

    if (timeEnd.isBefore(timeIni) || timeEnd.isSame(timeIni)) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return false;
    }

    if (hasLunch && lunchMinutes <= 0) {
      setError('Debe especificar los minutos de almuerzo');
      return false;
    }

    if (calculatedHours <= 0) {
      setError('El total de horas debe ser mayor a 0');
      return false;
    }

    return true;
  };

  /**
   * 💾 Manejar guardado
   */
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let savedRecord: DateHourRecord;

      if (isEditMode) {
        // Modo edición
        const updateData: UpdateDateHourDTO = {
          fecha: fecha!.format('YYYY-MM-DD'),
          ini: timeIni!.format('HH:mm'),
          fin: timeEnd!.format('HH:mm'),
          cant: calculatedHours,
          // ✅ Convertir minutos → horas decimales para el backend
          lunch: hasLunch ? (lunchMinutes / 60) : 0
        };

        savedRecord = await onSave(updateData);

        // En modo edición, SÍ cerrar modal
        onClose();
      } else {
        // Modo creación
        const createData: CreateDateHourDTO = {
          user: userId,
          fecha: fecha!.format('YYYY-MM-DD'),
          ini: timeIni!.format('HH:mm'),
          fin: timeEnd!.format('HH:mm'),
          cant: calculatedHours,
          // ✅ Convertir minutos → horas decimales para el backend
          lunch: hasLunch ? (lunchMinutes / 60) : 0
        };

        savedRecord = await onSave(createData);

        // Notificar para hacer highlight en tabla
        if (onRecordCreated) {
          onRecordCreated(savedRecord.Id);
        }

        // ⚠️ NO cerrar modal en modo creación
        // ✅ Limpiar formulario para siguiente registro
        resetForm();
      }

      console.log('✅ Registro guardado exitosamente:', savedRecord);
    } catch (err) {
      const error = err as any;

      // Manejo especial del error 409
      if (error.status === 409) {
        setError(error.message || 'Ya existe un registro para este día');
      } else {
        setError(error.message || 'Error al guardar el registro');
      }

      console.error('❌ Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ❌ Manejar cancelación
   */
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Editar Registro de Horas' : 'Agregar Horas Trabajadas'}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Fecha */}
            <DatePicker
              label="Fecha"
              value={fecha}
              onChange={(newValue) => setFecha(newValue ? dayjs(newValue) : null)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  size: 'small'
                }
              }}
            />

            {/* Hora Inicio */}
            <TimePicker
              label="Hora de Inicio"
              value={timeIni}
              onChange={(newValue) => setTimeIni(newValue ? dayjs(newValue) : null)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  size: 'small'
                }
              }}
            />

            {/* Hora Fin */}
            <TimePicker
              label="Hora de Fin"
              value={timeEnd}
              onChange={(newValue) => setTimeEnd(newValue ? dayjs(newValue) : null)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  size: 'small'
                }
              }}
            />

            {/* Almuerzo */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={hasLunch}
                    onChange={(e) => {
                      setHasLunch(e.target.checked);
                      if (!e.target.checked) {
                        setLunchMinutes(0);
                      }
                    }}
                  />
                }
                label="¿Tomó almuerzo?"
              />

              {hasLunch && (
                <TextField
                  label="Duración del almuerzo (minutos)"
                  type="number"
                  value={lunchMinutes}
                  onChange={(e) => setLunchMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            {/* Valores Calculados */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Cálculos automáticos:
              </Typography>
              <Typography variant="h6">
                Total de horas: {calculatedHours.toFixed(2)} hrs
              </Typography>
              <Typography variant="h6" color="primary">
                Valor total: ${calculatedTotal.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tarifa: ${userRate}/hora
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || calculatedHours <= 0}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
