import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Slider,
  Typography,
  Divider
} from '@mui/material';
import type { CreateRoleModalProps } from './CreateRoleModal.types';
import { useRoles } from '../../hooks';
import type { CreateRoleDTO } from '../../models';

/**
 * ➕ Modal para crear nuevo rol
 * Componente controlado con validación y manejo de estados
 *
 * Features:
 * - ✅ Formulario con validación en tiempo real
 * - ✅ Manejo de estados: loading, error, success
 * - ✅ Feedback visual de operaciones
 * - ✅ Limpieza de formulario al cerrar
 * - ✅ Prevención de envíos múltiples
 * - ✅ Slider para nivel de acceso
 */
export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  open,
  onClose,
  onSuccess,
  loading: externalLoading = false
}) => {
  // ==================== HOOKS ====================

  const { createRole, operationLoading } = useRoles();

  // ==================== ESTADOS DEL FORMULARIO ====================

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [accessLevel, setAccessLevel] = useState(1);

  // ==================== ESTADOS DE VALIDACIÓN Y FEEDBACK ====================

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ==================== VALIDACIÓN ====================

  /**
   * 📝 Validar campo de nombre
   */
  const validateRoleName = (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'El nombre del rol es requerido';
    }
    if (value.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    if (value.length > 50) {
      return 'El nombre no debe exceder 50 caracteres';
    }
    return null;
  };

  /**
   * 📝 Validar formulario completo
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    const nameError = validateRoleName(roleName);
    if (nameError) {
      newErrors.roleName = nameError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== HANDLERS ====================

  /**
   * 🔄 Handler para cambio de nombre
   */
  const handleRoleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoleName(value);

    // Validar en tiempo real
    const error = validateRoleName(value);
    if (error) {
      setErrors(prev => ({ ...prev, roleName: error }));
    } else {
      setErrors(prev => {
        const { roleName, ...rest } = prev;
        return rest;
      });
    }
  };

  /**
   * 📤 Handler para envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar errores previos
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    try {
      // Preparar datos del rol
      const roleData: CreateRoleDTO = {
        RoleName: roleName.trim(),
        Description: description.trim() || undefined,
        Active: isActive,
        AccessLevel: accessLevel
      };

      // Llamar al hook para crear el rol
      await createRole(roleData);

      // Mostrar éxito
      setSubmitSuccess(true);

      // Notificar al componente padre
      if (onSuccess) {
        onSuccess();
      }

      // Esperar un momento antes de cerrar para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: any) {
      // Mostrar error
      setSubmitError(error.message || 'Error al crear el rol');
    }
  };

  /**
   * 🚪 Handler para cerrar el modal
   */
  const handleClose = () => {
    // Limpiar formulario
    setRoleName('');
    setDescription('');
    setIsActive(true);
    setAccessLevel(1);
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);

    // Cerrar modal
    onClose();
  };

  // ==================== COMPUTADOS ====================

  const isLoading = operationLoading || externalLoading;
  const canSubmit = !isLoading && roleName.trim().length >= 3;

  // ==================== RENDER ====================

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      {/* ==================== HEADER ==================== */}
      <DialogTitle>
        <Typography variant="h5" component="div">
          ➕ Crear Nuevo Rol
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Define un nuevo rol con sus permisos y nivel de acceso
        </Typography>
      </DialogTitle>

      <Divider />

      {/* ==================== CONTENT ==================== */}
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {/* Feedback de éxito */}
          {submitSuccess && (
            <Alert severity="success">
              ✅ Rol creado exitosamente. Cerrando...
            </Alert>
          )}

          {/* Feedback de error */}
          {submitError && (
            <Alert severity="error" onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {/* Campo: Nombre del Rol */}
          <TextField
            autoFocus
            required
            fullWidth
            label="Nombre del Rol"
            placeholder="Ej: Administrador, Supervisor, Operador"
            value={roleName}
            onChange={handleRoleNameChange}
            error={!!errors.roleName}
            helperText={errors.roleName || 'Nombre descriptivo del rol (mínimo 3 caracteres)'}
            disabled={isLoading}
          />

          {/* Campo: Descripción */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción"
            placeholder="Describe las responsabilidades y permisos de este rol"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Opcional: Explica qué puede hacer este rol en el sistema"
            disabled={isLoading}
          />

          {/* Campo: Nivel de Acceso */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Nivel de Acceso: <strong>{accessLevel}</strong>
            </Typography>
            <Slider
              value={accessLevel}
              onChange={(_, value) => setAccessLevel(value as number)}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              disabled={isLoading}
              sx={{ mt: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              1 = Acceso básico | 5 = Acceso medio | 10 = Acceso total
            </Typography>
          </Box>

          {/* Campo: Estado Activo */}
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isLoading}
                color="success"
              />
            }
            label={
              <Box>
                <Typography variant="body1">
                  {isActive ? 'Rol Activo' : 'Rol Inactivo'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Los roles inactivos no pueden ser asignados a usuarios
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>

      <Divider />

      {/* ==================== ACTIONS ==================== */}
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!canSubmit}
          variant="contained"
          color="primary"
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Creando...' : 'Crear Rol'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
