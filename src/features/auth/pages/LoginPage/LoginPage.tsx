// src/features/auth/pages/LoginPage/LoginPage.tsx
import { useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Fade,
  Grow,
} from '@mui/material';
import {
  Brush as BrushIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LoginFormContainer } from '../../components/LoginForm';
import type { LoginCredentials } from '../../components/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../../../config/router/routes';

// ==================== MAIN PAGE COMPONENT ====================

/**
 * LoginPage - Página principal de autenticación
 *
 * Integrado con el sistema de autenticación usando:
 * - useAuth() hook para manejo de estado global
 * - authService para llamadas al backend
 * - Zustand store para persistencia
 *
 * Diseño según MUI Theme Best Practices:
 * - Sin uso de `sx` props
 * - Utiliza variantes personalizadas del tema
 * - Todos los estilos centralizados en cvhomes-light-theme.ts
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Hook de autenticación con estado global
  const { login, isLoading, error, isAuthenticated } = useAuth();

  /**
   * Handler del login - Integrado con servicio real
   * Redirige al dashboard después del login exitoso
   */
  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
  };

  // Efecto para redirigir cuando el login sea exitoso
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Box className="login-container">
      <Fade in timeout={600}>
        <Container maxWidth="sm">
            {/* Card principal del login con animación */}
            <Grow in timeout={800} style={{ transformOrigin: '50% 50%' }}>
              <Paper variant="loginCard" elevation={3}>
                {/* Logo profesional con animación */}
                <Box className="logo-box">
                  {/* Icono profesional de construcción/pintura */}
                  <Stack
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                  >
                    <BrushIcon
                      fontSize="large"
                      color="inherit"
                      className="logo-icon-left"
                    />
                    <ConstructionIcon
                      fontSize="large"
                      color="inherit"
                      className="logo-icon-right"
                    />
                  </Stack>
                </Box>

                {/* Formulario de login */}
                <LoginFormContainer
                  onSubmit={handleLogin}
                  loading={isLoading}
                  error={error}
                />
              </Paper>
            </Grow>

            {/* Información adicional (solo en desarrollo) */}
            {import.meta.env.DEV && (
              <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Paper variant="infoPanel">
                  <Stack spacing={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Modo Desarrollo - Sistema de autenticación:
                    </Typography>
                    <Box component="ul" m={0} pl={2.5}>
                      <Typography component="li" variant="caption">
                        Conectado a: {import.meta.env.VITE_API_URL || 'https://rainbowback-production.up.railway.app'}
                      </Typography>
                      <Typography component="li" variant="caption">
                        Token almacenado en: localStorage.x-token
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Fade>
            )}
        </Container>
      </Fade>
    </Box>
  );
};
