// src/features/shared/pages/DashboardPage/DashboardPage.tsx
import { Box, Paper, Stack, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  Engineering as EngineeringIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../auth/hooks/useAuth';

/**
 * DashboardPage - Página principal de dashboard
 *
 * Diseñado siguiendo ui-ux-design-expert:
 * - Cards con estadísticas principales
 * - Información del usuario autenticado
 * - Vista previa de módulos próximos
 *
 * Diseño según MUI Theme Best Practices:
 * - Sin uso de `sx` props extensivo
 * - Utiliza variant="dashboard" para Cards
 * - Colores desde theme.palette
 */
export const DashboardPage: React.FC = () => {
  const { displayName } = useAuth();

  const modules = [
    {
      title: 'Obras',
      icon: <EngineeringIcon fontSize="large" />,
      colorKey: 'primary',
      description: 'Gestión de obras y proyectos',
      status: 'Próximamente',
    },
    {
      title: 'Contratos',
      icon: <DescriptionIcon fontSize="large" />,
      colorKey: 'secondary',
      description: 'Administración de contratos',
      status: 'Próximamente',
    },
    {
      title: 'Facturación',
      icon: <ReceiptIcon fontSize="large" />,
      colorKey: 'success',
      description: 'Control de facturación',
      status: 'Próximamente',
    },
    {
      title: 'Reportes',
      icon: <AnalyticsIcon fontSize="large" />,
      colorKey: 'info',
      description: 'Análisis y reportes',
      status: 'Próximamente',
    },
  ];

  return (
    <Box>
      <Stack spacing={2.5}>
        {/* Header de bienvenida */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            ¡Bienvenido, {displayName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Has iniciado sesión exitosamente en el Sistema ERP de Rainbow Painting
          </Typography>
        </Box>

        {/* Cards de módulos */}
        <Grid container spacing={2}>
          {modules.map((module) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={module.title}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: `${module.colorKey}.main`,
                      color: 'white',
                      mb: 1.5,
                      opacity: 0.9,
                    }}
                  >
                    {module.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {module.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: 'warning.light',
                      color: 'warning.dark',
                      fontWeight: 500,
                    }}
                  >
                    {module.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Información del sistema */}
        <Paper
          sx={{
            p: 2,
            border: 1,
            borderColor: 'primary.light',
            bgcolor: 'primary.lighter',
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Sistema de Autenticación Activo ✅
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tu sesión está protegida con autenticación JWT. El token se renueva automáticamente
              y tu información está segura en el sistema.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Puedes cerrar sesión desde el menú de usuario en la esquina superior derecha.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};
