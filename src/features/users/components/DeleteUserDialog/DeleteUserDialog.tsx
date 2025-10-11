import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import type { DeleteUserDialogProps } from './DeleteUserDialog.types';

export const DeleteUserDialog = ({
  open,
  user,
  onClose,
  onConfirm,
  loading = false
}: DeleteUserDialogProps) => {
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(user.UserId);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirmar Eliminación</DialogTitle>

      <DialogContent>
        <Alert severity="warning">
          Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
        </Alert>

        <Box marginTop={2}>
          <Typography variant="body2" gutterBottom>
            ¿Estás seguro de que deseas eliminar al siguiente usuario?
          </Typography>

          <Box
            marginTop={2}
            padding={2}
            bgcolor="grey.100"
            borderRadius={1}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {user.FirstName} {user.LastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.Email}
            </Typography>
          </Box>

          {user.IsAdmin && (
            <Box marginTop={2}>
              <Alert severity="error">
                Este usuario es administrador. Su eliminación puede afectar el acceso al sistema.
              </Alert>
            </Box>
          )}

          {user.Leader && (
            <Box marginTop={2}>
              <Alert severity="info">
                Este usuario es líder de equipo. Considera reasignar sus responsabilidades.
              </Alert>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="text"
          disabled={loading || submitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {submitting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};