import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
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
  AppBar,
  Toolbar,
  Slide,
  Avatar,
  Alert
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import {
  Person,
  Close,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Save,
  PhotoCamera,
  Delete as DeleteIcon,
  AttachMoney
} from '@mui/icons-material';
import type { CreateUserModalProps, CreateUserData } from './CreateUserModal.types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CreateUserModal = ({
  open,
  onClose,
  onSubmit,
  roles,
  companies: _companies,
  loading = false
}: CreateUserModalProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<CreateUserData>({
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    RoleId: 2,
    Company: 'Rainbow',
    Salary: 0,
    DiscountHour: 0,
    Status: 1,
    IsAdmin: false,
    isRainbow: false,
    Leader: false,
    Img: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Image upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
        RoleId: 2,
        Company: 'Rainbow',
        Salary: 0,
        DiscountHour: 0,
        Status: 1,
        IsAdmin: false,
        isRainbow: false,
        Leader: false,
        Img: ''
      });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
      setSelectedFile(null);
      setPreviewUrl('');
      setImageError('');
    }
  }, [open]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const passwordStrength = useMemo(() => {
    const password = formData.Password;
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
  }, [formData.Password]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Image upload handlers
  const handleFileSelect = useCallback((file: File) => {
    setImageError('');

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setImageError('Por favor selecciona una imagen válida (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('El tamaño del archivo debe ser menor a 5MB');
      return;
    }

    // Validate file has content
    if (file.size === 0) {
      setImageError('Por favor selecciona un archivo válido');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setFormData(prev => ({ ...prev, Img: result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    setImageError('');
    setFormData(prev => ({ ...prev, Img: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.FirstName || formData.FirstName.length < 2) {
      newErrors.FirstName = 'El nombre debe tener al menos 2 caracteres';
    }
    if (!formData.LastName || formData.LastName.length < 2) {
      newErrors.LastName = 'El apellido debe tener al menos 2 caracteres';
    }
    if (!formData.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = 'Email inválido';
    }

    if (!formData.Password) {
      newErrors.Password = 'La contraseña es requerida';
    } else if (formData.Password.length < 8) {
      newErrors.Password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (passwordStrength.score < 60) {
      newErrors.Password = 'La contraseña es muy débil';
    }

    if (formData.Password !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.Salary < 0) {
      newErrors.Salary = 'El salario debe ser positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ConfirmPassword, ...dataWithoutConfirm } = formData;
      await onSubmit(dataWithoutConfirm as any);
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      TransitionComponent={Transition}
    >
      {fullScreen ? (
        <>
          <AppBar sx={{ position: 'relative' }} color="default" elevation={1}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={onClose} disabled={loading || submitting}>
                <ArrowBack />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6">Crear Usuario</Typography>
              <Button color="primary" variant="contained" onClick={handleSubmit} disabled={loading || submitting}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <Save />}>
                {submitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </Toolbar>
          </AppBar>

          <DialogContent>
            <Stack spacing={2}>
              <Box><Typography variant="subtitle1" fontWeight={600}>Información Personal</Typography></Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Nombre" value={formData.FirstName} onChange={(e) => handleChange('FirstName', e.target.value)}
                  required fullWidth size="small" error={!!errors.FirstName} helperText={errors.FirstName} disabled={loading || submitting} />
                <TextField label="Apellido" value={formData.LastName} onChange={(e) => handleChange('LastName', e.target.value)}
                  required fullWidth size="small" error={!!errors.LastName} helperText={errors.LastName} disabled={loading || submitting} />
              </Stack>
              <TextField label="Email" type="email" value={formData.Email} onChange={(e) => handleChange('Email', e.target.value)}
                required fullWidth size="small" error={!!errors.Email} helperText={errors.Email} disabled={loading || submitting} />

              <Divider />

              <Box><Typography variant="subtitle1" fontWeight={600}>Seguridad</Typography></Box>
              <TextField label="Contraseña" type={showPassword ? 'text' : 'password'} value={formData.Password}
                onChange={(e) => handleChange('Password', e.target.value)} required fullWidth size="small"
                error={!!errors.Password} helperText={errors.Password} disabled={loading || submitting}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }} />
              <TextField label="Confirmar Contraseña" type={showConfirmPassword ? 'text' : 'password'} value={formData.ConfirmPassword}
                onChange={(e) => handleChange('ConfirmPassword', e.target.value)} required fullWidth size="small"
                error={!!errors.ConfirmPassword} helperText={errors.ConfirmPassword} disabled={loading || submitting}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }} />

              {formData.Password && (
                <Box>
                  <LinearProgress variant="determinate" value={passwordStrength.score} color={passwordStrength.color} sx={{ height: 6, borderRadius: 3, mb: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Fortaleza: {passwordStrength.label} ({passwordStrength.score}%)
                  </Typography>
                </Box>
              )}

              <Divider />

              <Box><Typography variant="subtitle1" fontWeight={600}>Información Laboral</Typography></Box>
              <FormControl fullWidth size="small" required>
                <InputLabel>Rol</InputLabel>
                <Select value={formData.RoleId} label="Rol" onChange={(e) => handleChange('RoleId', e.target.value)} disabled={loading || submitting}>
                  {roles.map((role) => <MenuItem key={role.RoleId} value={role.RoleId}>{role.RoleName}</MenuItem>)}
                </Select>
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Salario"
                  type="number"
                  value={formData.Salary}
                  onChange={(e) => handleChange('Salary', parseFloat(e.target.value) || 0)}
                  required
                  fullWidth
                  size="small"
                  error={!!errors.Salary}
                  helperText={errors.Salary}
                  disabled={loading || submitting}
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney fontSize="small" color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label="Descuento por Hora"
                  type="number"
                  value={formData.DiscountHour}
                  onChange={(e) => handleChange('DiscountHour', parseFloat(e.target.value) || 0)}
                  fullWidth
                  size="small"
                  disabled={loading || submitting}
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney fontSize="small" color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>

              <Box><Typography variant="subtitle1" fontWeight={600}>Configuración</Typography></Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.Status === 1}
                      onChange={(e) => handleChange('Status', e.target.checked ? 1 : 0)}
                      color="success"
                      disabled={loading || submitting}
                    />
                  }
                  label="Usuario Activo"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isRainbow}
                      onChange={(e) => handleChange('isRainbow', e.target.checked)}
                      color="primary"
                      disabled={loading || submitting}
                    />
                  }
                  label="Es Rainbow"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.Leader}
                      onChange={(e) => handleChange('Leader', e.target.checked)}
                      color="warning"
                      disabled={loading || submitting}
                    />
                  }
                  label="Es Líder"
                />
              </Stack>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Foto de Perfil
                </Typography>

                {imageError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {imageError}
                  </Alert>
                )}

                <Stack spacing={2}>
                  <Box display="flex" justifyContent="center">
                    <Avatar
                      src={previewUrl || formData.Img || undefined}
                      sx={{ width: 120, height: 120 }}
                    >
                      <Person sx={{ fontSize: 60 }} />
                    </Avatar>
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCamera />}
                      onClick={handleBrowseClick}
                      disabled={loading || submitting}
                      size="small"
                    >
                      Subir Imagen
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleClearImage}
                      disabled={loading || submitting || (!previewUrl && !formData.Img)}
                      size="small"
                    >
                      Limpiar
                    </Button>
                  </Stack>

                  <TextField
                    label="URL Foto de Perfil (opcional)"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={formData.Img && !previewUrl ? formData.Img : ''}
                    onChange={(e) => {
                      handleChange('Img', e.target.value);
                      if (e.target.value) {
                        setPreviewUrl('');
                        setSelectedFile(null);
                      }
                    }}
                    fullWidth
                    size="small"
                    disabled={loading || submitting}
                    helperText="También puedes ingresar una URL de imagen externa"
                  />

                  {selectedFile && (
                    <Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="caption" color="success.dark" display="block">
                        ✓ Archivo seleccionado: {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                    disabled={loading || submitting}
                  />
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
        </>
      ) : (
        <Box padding={1}>
          <DialogTitle>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box width={36} height={36} display="flex" alignItems="center" justifyContent="center" borderRadius="50%" bgcolor="primary.main">
                  <Person sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6">Crear Usuario</Typography>
              </Stack>
              <IconButton onClick={onClose} size="small"><Close /></IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <Box><Typography variant="subtitle1" fontWeight={600}>Información Personal</Typography></Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Nombre" value={formData.FirstName} onChange={(e) => handleChange('FirstName', e.target.value)}
                  required fullWidth size="small" error={!!errors.FirstName} helperText={errors.FirstName} disabled={loading || submitting} />
                <TextField label="Apellido" value={formData.LastName} onChange={(e) => handleChange('LastName', e.target.value)}
                  required fullWidth size="small" error={!!errors.LastName} helperText={errors.LastName} disabled={loading || submitting} />
              </Stack>
              <TextField label="Email" type="email" value={formData.Email} onChange={(e) => handleChange('Email', e.target.value)}
                required fullWidth size="small" error={!!errors.Email} helperText={errors.Email} disabled={loading || submitting} />

              <Divider />

              <Box><Typography variant="subtitle1" fontWeight={600}>Seguridad</Typography></Box>
              <TextField label="Contraseña" type={showPassword ? 'text' : 'password'} value={formData.Password}
                onChange={(e) => handleChange('Password', e.target.value)} required fullWidth size="small"
                error={!!errors.Password} helperText={errors.Password} disabled={loading || submitting}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }} />
              <TextField label="Confirmar Contraseña" type={showConfirmPassword ? 'text' : 'password'} value={formData.ConfirmPassword}
                onChange={(e) => handleChange('ConfirmPassword', e.target.value)} required fullWidth size="small"
                error={!!errors.ConfirmPassword} helperText={errors.ConfirmPassword} disabled={loading || submitting}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }} />

              {formData.Password && (
                <Box>
                  <LinearProgress variant="determinate" value={passwordStrength.score} color={passwordStrength.color} sx={{ height: 6, borderRadius: 3, mb: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Fortaleza: {passwordStrength.label} ({passwordStrength.score}%)
                  </Typography>
                </Box>
              )}

              <Divider />

              <Box><Typography variant="subtitle1" fontWeight={600}>Información Laboral</Typography></Box>
              <FormControl fullWidth size="small" required>
                <InputLabel>Rol</InputLabel>
                <Select value={formData.RoleId} label="Rol" onChange={(e) => handleChange('RoleId', e.target.value)} disabled={loading || submitting}>
                  {roles.map((role) => <MenuItem key={role.RoleId} value={role.RoleId}>{role.RoleName}</MenuItem>)}
                </Select>
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Salario"
                  type="number"
                  value={formData.Salary}
                  onChange={(e) => handleChange('Salary', parseFloat(e.target.value) || 0)}
                  required
                  fullWidth
                  size="small"
                  error={!!errors.Salary}
                  helperText={errors.Salary}
                  disabled={loading || submitting}
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney fontSize="small" color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label="Descuento por Hora"
                  type="number"
                  value={formData.DiscountHour}
                  onChange={(e) => handleChange('DiscountHour', parseFloat(e.target.value) || 0)}
                  fullWidth
                  size="small"
                  disabled={loading || submitting}
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney fontSize="small" color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>

              <Box><Typography variant="subtitle1" fontWeight={600}>Configuración</Typography></Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.Status === 1}
                      onChange={(e) => handleChange('Status', e.target.checked ? 1 : 0)}
                      color="success"
                      disabled={loading || submitting}
                    />
                  }
                  label="Usuario Activo"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isRainbow}
                      onChange={(e) => handleChange('isRainbow', e.target.checked)}
                      color="primary"
                      disabled={loading || submitting}
                    />
                  }
                  label="Es Rainbow"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.Leader}
                      onChange={(e) => handleChange('Leader', e.target.checked)}
                      color="warning"
                      disabled={loading || submitting}
                    />
                  }
                  label="Es Líder"
                />
              </Stack>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Foto de Perfil
                </Typography>

                {imageError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {imageError}
                  </Alert>
                )}

                <Stack spacing={2}>
                  <Box display="flex" justifyContent="center">
                    <Avatar
                      src={previewUrl || formData.Img || undefined}
                      sx={{ width: 120, height: 120 }}
                    >
                      <Person sx={{ fontSize: 60 }} />
                    </Avatar>
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCamera />}
                      onClick={handleBrowseClick}
                      disabled={loading || submitting}
                      size="small"
                    >
                      Subir Imagen
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleClearImage}
                      disabled={loading || submitting || (!previewUrl && !formData.Img)}
                      size="small"
                    >
                      Limpiar
                    </Button>
                  </Stack>

                  <TextField
                    label="URL Foto de Perfil (opcional)"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={formData.Img && !previewUrl ? formData.Img : ''}
                    onChange={(e) => {
                      handleChange('Img', e.target.value);
                      if (e.target.value) {
                        setPreviewUrl('');
                        setSelectedFile(null);
                      }
                    }}
                    fullWidth
                    size="small"
                    disabled={loading || submitting}
                    helperText="También puedes ingresar una URL de imagen externa"
                  />

                  {selectedFile && (
                    <Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="caption" color="success.dark" display="block">
                        ✓ Archivo seleccionado: {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                    disabled={loading || submitting}
                  />
                </Stack>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} variant="text" disabled={loading || submitting}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading || submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}>
              {submitting ? 'Guardando...' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};
