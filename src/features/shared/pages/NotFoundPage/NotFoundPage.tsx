// src/features/shared/pages/NotFoundPage/NotFoundPage.tsx
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config/router/routes';

/**
 * NotFoundPage - Página 404 profesional
 *
 * Mostrada cuando el usuario intenta acceder a una ruta que no existe
 */
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.ROOT);
  };

  const handleGoBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
    >
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center" textAlign="center">
          {/* Ilustración 404 */}
          <Typography
            component="div"
            fontSize={{ xs: 120, sm: 180 }}
            fontWeight={700}
            lineHeight={1}
            color="primary.main"
            sx={{ opacity: 0.2, userSelect: 'none' }}
          >
            404
          </Typography>

          {/* Mensaje principal */}
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4" fontWeight={600} color="text.primary">
              Página no encontrada
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="400px">
              Lo sentimos, la página que estás buscando no existe o ha sido
              movida a otra ubicación.
            </Typography>
          </Stack>

          {/* Acciones */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            width="100%"
            maxWidth="400px"
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Ir al Inicio
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              Volver Atrás
            </Button>
          </Stack>

          {/* Info adicional */}
          <Typography variant="caption" color="text.disabled">
            Si crees que esto es un error, contacta al administrador del sistema.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};
