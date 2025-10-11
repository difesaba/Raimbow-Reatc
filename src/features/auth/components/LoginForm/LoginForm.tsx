// src/features/auth/components/LoginForm/LoginForm.tsx
import type { FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Stack,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Collapse,
  Checkbox,
  FormControlLabel,
  Zoom,
  Container,
  Paper,
} from '@mui/material';
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  EmailOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ErrorOutlineOutlined,
  LoginOutlined,
} from '@mui/icons-material';
import type { LoginFormProps } from './LoginForm.types';

/**
 * LoginForm - Pure presentational component for authentication form
 *
 * NO business logic or API calls.
 * All authentication logic handled by parent component via props.
 *
 * MUI Theme Best Practices:
 * - Minimal sx prop usage (only for spacing/layout)
 * - Theme colors from palette
 * - Consistent spacing with theme.spacing
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error = null,
  disabled = false,
  email = '',
  password = '',
  rememberMe = false,
  showPassword = false,
  emailError,
  passwordError,
  emailValid = false,
  passwordValid = false,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onTogglePasswordVisibility,
  onForgotPassword,
  onTermsClick,
  onPrivacyClick,
}) => {
  // Handler for form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <Paper
          elevation={0}
          variant="authForm"
        >
          <Stack spacing={3}>
            {/* Form Title */}
            <Box textAlign="center">
              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
                gutterBottom
              >
                Rainbow Painting
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={400}
              >
                Sistema ERP de Gestión de Construcción
              </Typography>
            </Box>

            {/* Server Error Message */}
            <Collapse in={!!error}>
              <Alert
                severity="error"
                variant="standard"
                icon={<ErrorOutlineOutlined />}
              >
                {error}
              </Alert>
            </Collapse>

            {/* Email Field */}
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              type="email"
              label="Correo electrónico"
              placeholder="usuario@rainbowpainting.com"
              value={email}
              onChange={(e) => onEmailChange?.(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              disabled={disabled || loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined
                      fontSize="small"
                      color={
                        emailValid
                          ? 'success'
                          : emailError
                          ? 'error'
                          : 'action'
                      }
                    />
                  </InputAdornment>
                ),
                endAdornment: emailValid && (
                  <Zoom in>
                    <InputAdornment position="end">
                      <CheckCircleOutlined fontSize="small" color="success" />
                    </InputAdornment>
                  </Zoom>
                ),
              }}
              autoComplete="email"
              autoFocus
            />

            {/* Password Field */}
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => onPasswordChange?.(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              disabled={disabled || loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      fontSize="small"
                      color={
                        passwordValid
                          ? 'success'
                          : passwordError
                          ? 'error'
                          : 'action'
                      }
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton
                      onClick={onTogglePasswordVisibility}
                      edge="end"
                      size="small"
                      disabled={disabled || loading}
                      aria-label={
                        showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                      }
                    >
                      {showPassword ? (
                        <VisibilityOffOutlined fontSize="small" />
                      ) : (
                        <VisibilityOutlined fontSize="small" />
                      )}
                    </IconButton>
                    {passwordValid && (
                      <Zoom in>
                        <CheckCircleOutlined
                          fontSize="small"
                          color="success"
                        />
                      </Zoom>
                    )}
                  </Stack>
                ),
              }}
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => onRememberMeChange?.(e.target.checked)}
                    disabled={disabled || loading}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Recordarme
                  </Typography>
                }
              />

              <Link
                component="button"
                type="button"
                variant="body2"
                color="primary"
                underline="none"
                fontWeight={500}
                onClick={(e) => {
                  e.preventDefault();
                  onForgotPassword?.();
                }}
                disabled={disabled || loading}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={disabled || loading}
              startIcon={!loading && <LoginOutlined />}
            >
              {loading ? (
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                  <Typography
                    variant="button"
                    color="inherit"
                  >
                    Ingresando...
                  </Typography>
                </Stack>
              ) : (
                'Ingresar al Sistema'
              )}
            </Button>

            {/* Footer Links */}
            <Box textAlign="center" pt={2}>
              <Typography
                variant="caption"
                color="text.secondary"
                component="div"
              >
                Al ingresar, aceptas nuestros{' '}
                <Link
                  component="button"
                  type="button"
                  color="primary"
                  underline="none"
                  fontWeight={500}
                  onClick={(e) => {
                    e.preventDefault();
                    onTermsClick?.();
                  }}
                  variant={'footerLink' as any}
                >
                  Términos y Condiciones
                </Link>
                {' y '}
                <Link
                  component="button"
                  type="button"
                  color="primary"
                  underline="none"
                  fontWeight={500}
                  onClick={(e) => {
                    e.preventDefault();
                    onPrivacyClick?.();
                  }}
                  variant={'footerLink' as any}
                >
                  Políticas de Privacidad
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};