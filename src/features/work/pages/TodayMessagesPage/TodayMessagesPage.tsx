import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Button,
 
  Tooltip,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { WorkService } from '../../services/work.service';
import { TodayMessagesTable } from '../../components/TodayMessagesTable';
import { useNotification } from '../../../shared/hooks/useNotification';
import type { TodayMessage } from '../../interfaces';

/**
 * ⏰ Intervalo de auto-refresh en milisegundos (30 segundos)
 */
const AUTO_REFRESH_INTERVAL = 30000;

/**
 * 💬 TodayMessagesPage - Página de mensajes de WhatsApp del día
 *
 * Características:
 * - Auto-refresh cada 30 segundos
 * - Botón de refresh manual
 * - Contador de próximo refresh
 * - Manejo de errores con notificaciones
 */
export const TodayMessagesPage = () => {
  const { showError, showSuccess } = useNotification();

  // Estado
  const [messages, setMessages] = useState<TodayMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(30);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  /**
   * Carga los mensajes del día
   */
  const fetchMessages = useCallback(async (isManualRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await WorkService.getTodayMessages();
      setMessages(data);
      setLastRefreshTime(new Date());
      setSecondsUntilRefresh(30);

      if (isManualRefresh) {
        showSuccess(`${data.length} mensajes cargados exitosamente`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar mensajes';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error fetching today messages:', err);
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  /**
   * Maneja el refresh manual
   */
  const handleManualRefresh = () => {
    fetchMessages(true);
  };

  // Carga inicial
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMessages();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  // Contador de segundos hasta el próximo refresh
  useEffect(() => {
    const countdownId = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownId);
  }, []);

  /**
   * Formatea la hora del último refresh
   */
  const formatLastRefresh = (): string => {
    if (!lastRefreshTime) return 'Nunca';

    return lastRefreshTime.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3} paddingY={3}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Mensajes de hoy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mensajes de WhatsApp enviados durante el día actual
            </Typography>
          </Box>

          {/* Botón de refresh */}
          <Tooltip title="Actualizar mensajes">
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleManualRefresh}
              disabled={loading}
            >
              Actualizar
            </Button>
          </Tooltip>
        </Stack>

        {/* Información de auto-refresh */}
        <Paper elevation={0} sx={{ padding: 2, backgroundColor: 'grey.50' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <ScheduleIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Última actualización: <strong>{formatLastRefresh()}</strong>
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Próxima actualización en:
              </Typography>
              <Chip
                label={`${secondsUntilRefresh}s`}
                color="primary"
                size="small"
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Paper>

        {/* Barra de progreso durante carga */}
        {loading && <LinearProgress />}

        {/* Tabla de mensajes */}
        <Paper elevation={0}>
          <TodayMessagesTable
            messages={messages}
            isLoading={loading && messages.length === 0}
          />
        </Paper>

        {/* Error message */}
        {error && !loading && (
          <Paper elevation={0} sx={{ padding: 2, backgroundColor: 'error.light', color: 'error.contrastText' }}>
            <Typography variant="body2">
              <strong>Error:</strong> {error}
            </Typography>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={handleManualRefresh}
              sx={{ marginTop: 1 }}
            >
              Reintentar
            </Button>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};
