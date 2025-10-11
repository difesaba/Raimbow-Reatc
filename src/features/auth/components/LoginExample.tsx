/**
 * Login Component Example
 *
 * This is an example implementation showing how to use the authentication
 * architecture with a login form.
 *
 * USAGE:
 * Import and use this component in your login page:
 * import { LoginExample } from '@/features/auth/components/LoginExample';
 */

import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGuestOnly } from '../hooks/useAuth';

export const LoginExample = () => {
  // Redirect to home if already authenticated
  useGuestOnly('/home');

  // Get auth hook functions and state
  const { login, isLoading, error, clearError } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    clearError();

    // Attempt login
    await login({ email, password });

    // Navigation is handled by the auth store
    // After successful login, user will be redirected
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Rainbow Painting ERP - Login</h2>

        {/* Error message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Email input */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="usuario@ejemplo.com"
          />
        </div>

        {/* Password input */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="••••••••"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !email || !password}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

/**
 * Alternative Material-UI Implementation
 */
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';

export const LoginMUI = () => {
  // Redirect to home if already authenticated
  useGuestOnly('/home');

  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    await login({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          mx: 2
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Rainbow Painting ERP
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            type="email"
            label="Correo Electrónico"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
            autoFocus
          />

          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading || !email || !password}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};