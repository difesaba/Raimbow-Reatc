import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  LinearProgress,
  InputAdornment,
  Chip,
  AppBar,
  Toolbar,
  Slide
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import {
  Lock,
  Close,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  ArrowBack,
  Save
} from '@mui/icons-material';
import type { ChangePasswordModalProps, PasswordChangeData } from './ChangePasswordModal.types';

// Transition for fullscreen mode
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ChangePasswordModal = ({
  open,
  user,
  onClose,
  onSubmit,
  loading = false
}: ChangePasswordModalProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      setSubmitting(false);
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [open]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const password = formData.newPassword;
    if (!password) return { score: 0, label: '', color: 'error' as const };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    if (checks.length) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    const getLabel = () => {
      if (score < 40) return 'Muy débil';
      if (score < 60) return 'Débil';
      if (score < 80) return 'Media';
      if (score < 100) return 'Fuerte';
      return 'Muy fuerte';
    };

    const getColor = () => {
      if (score < 40) return 'error' as const;
      if (score < 60) return 'warning' as const;
      if (score < 80) return 'info' as const;
      return 'success' as const;
    };

    return { score, label: getLabel(), color: getColor(), checks };
  }, [formData.newPassword]);

  // Handle field change
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword || formData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    } else if (passwordStrength.score < 60) {
      newErrors.newPassword = 'La contraseña es muy débil. Debe incluir mayúsculas, minúsculas, números y caracteres especiales';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.newPassword && formData.currentPassword && formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente de la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm() || !user) return;

    setSubmitting(true);
    try {
      const passwordData: PasswordChangeData = {
        UserId: user.UserId,
        user: user, // Enviar el usuario completo con todos sus datos actuales
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };

      await onSubmit(passwordData);
      handleClose();
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      TransitionComponent={Transition}
    >
      {fullScreen ? (
        /* Mobile fullscreen mode */
        <>
          <AppBar sx={{ position: 'relative' }} color="default" elevation={1}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                disabled={loading || submitting}
              >
                <ArrowBack />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Cambiar Contraseña
              </Typography>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || submitting}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <Save />}
              >
                {submitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </Toolbar>
          </AppBar>

          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              {user && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Cambiando contraseña para: <strong>{user.FirstName} {user.LastName}</strong>
                  </Typography>
                </Box>
              )}

              {/* Current Password */}
              <TextField
                label="Contraseña Actual"
                name="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                fullWidth
                size="small"
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                disabled={loading || submitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrent(!showCurrent)}
                        edge="end"
                        size="small"
                      >
                        {showCurrent ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Divider />

              {/* New Password */}
              <TextField
                label="Nueva Contraseña"
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                required
                fullWidth
                size="small"
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                disabled={loading || submitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNew(!showNew)}
                        edge="end"
                        size="small"
                      >
                        {showNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Confirm Password */}
              <TextField
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
                fullWidth
                size="small"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading || submitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                        size="small"
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Fortaleza: {passwordStrength.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {passwordStrength.score}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Stack spacing={0.5} mt={1.5}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Requisitos:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        size="small"
                        label="8+ caracteres"
                        icon={passwordStrength.checks?.length ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.length ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Minúscula"
                        icon={passwordStrength.checks?.lowercase ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.lowercase ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Mayúscula"
                        icon={passwordStrength.checks?.uppercase ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.uppercase ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Número"
                        icon={passwordStrength.checks?.number ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.number ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Especial"
                        icon={passwordStrength.checks?.special ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.special ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Stack>
          </DialogContent>
        </>
      ) : (
        /* Desktop mode */
        <Box padding={1}>
          <DialogTitle>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  width={36}
                  height={36}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="50%"
                  bgcolor="primary.light"
                >
                  <Lock color="primary" />
                </Box>
                <Box>
                  <Typography variant="h6">
                    Cambiar Contraseña
                  </Typography>
                  {user && (
                    <Typography variant="body2" color="text.secondary">
                      {user.FirstName} {user.LastName}
                    </Typography>
                  )}
                </Box>
              </Stack>
              <IconButton onClick={handleClose} size="small">
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              {/* Current Password */}
              <TextField
                label="Contraseña Actual"
                name="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                fullWidth
                size="small"
                error={!!errors.currentPassword}
                helperText={errors.currentPassword || 'Opcional si eres administrador'}
                disabled={loading || submitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrent(!showCurrent)}
                        edge="end"
                        size="small"
                      >
                        {showCurrent ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Divider />

              {/* New Password */}
              <TextField
                label="Nueva Contraseña"
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                required
                fullWidth
                size="small"
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                disabled={loading || submitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNew(!showNew)}
                        edge="end"
                        size="small"
                      >
                        {showNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Confirm Password */}
              <TextField
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
                fullWidth
                size="small"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading || submitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                        size="small"
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Fortaleza: {passwordStrength.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {passwordStrength.score}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Stack spacing={0.5} mt={1.5}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Requisitos:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        size="small"
                        label="8+ caracteres"
                        icon={passwordStrength.checks?.length ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.length ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Minúscula"
                        icon={passwordStrength.checks?.lowercase ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.lowercase ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Mayúscula"
                        icon={passwordStrength.checks?.uppercase ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.uppercase ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Número"
                        icon={passwordStrength.checks?.number ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.number ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label="Especial"
                        icon={passwordStrength.checks?.special ? <CheckCircle /> : <Cancel />}
                        color={passwordStrength.checks?.special ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} variant="text" disabled={loading || submitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading || submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {submitting ? 'Guardando...' : 'Cambiar Contraseña'}
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};
