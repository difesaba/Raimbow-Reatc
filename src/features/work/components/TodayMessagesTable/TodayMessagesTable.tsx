import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  Alert
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import type { TodayMessagesTableProps } from './TodayMessagesTable.types';

/**
 * 💬 TodayMessagesTable - Tabla de mensajes de WhatsApp del día (Responsive)
 *
 * Vistas:
 * - Desktop (≥900px): Tabla tradicional con todas las columnas
 * - Mobile (<900px): Vista de Cards optimizada
 *
 * Características:
 * - Botón copiar por cada mensaje
 * - Texto sin truncar con preservación de formato
 * - Fuente monospace para mejor legibilidad
 * - Chips de estado con colores
 */
export const TodayMessagesTable: React.FC<TodayMessagesTableProps> = ({
  messages,
  isLoading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [copiedId, setCopiedId] = useState<number | null>(null);

  /**
   * Copia el mensaje al clipboard
   */
  const handleCopyMessage = async (message: string, queueId: number) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(queueId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error al copiar mensaje:', error);
    }
  };

  /**
   * Obtiene el color del chip según el estado
   */
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('sent') || statusLower.includes('delivered') || statusLower.includes('enviado')) {
      return 'success';
    }
    if (statusLower.includes('pending') || statusLower.includes('queued') || statusLower.includes('pendiente')) {
      return 'warning';
    }
    if (statusLower.includes('failed') || statusLower.includes('error') || statusLower.includes('fallido')) {
      return 'error';
    }
    if (statusLower.includes('processing') || statusLower.includes('procesando')) {
      return 'info';
    }
    return 'default';
  };

  /**
   * Formatea la fecha para mostrar
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box padding={4} textAlign="center">
        <Typography variant="body1" color="text.secondary" gutterBottom>
          No hay mensajes para mostrar hoy
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Los mensajes aparecerán aquí cuando se envíen notificaciones de WhatsApp
        </Typography>
      </Box>
    );
  }

  return (
    <Box padding={{ xs: 2, md: 3 }}>
      {/* Header con contador */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h6">
          {messages.length} {messages.length === 1 ? 'mensaje' : 'mensajes'}
        </Typography>
      </Stack>

      {/* Vista Mobile: Cards */}
      {isMobile ? (
        <Stack spacing={2}>
          {messages.map((msg) => (
            <Card
              key={msg.QueueId}
              variant="outlined"
              sx={{
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  borderColor: 'primary.main'
                }
              }}
            >
              <CardContent>
                {/* Header del Card */}
                <Stack direction="row" spacing={1} alignItems="center" marginBottom={2}>
                  <MessageIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" color="primary" sx={{ flexGrow: 1 }}>
                    {msg.Name || 'Sin nombre'}
                  </Typography>
                  <Chip
                    label={msg.Status}
                    color={getStatusColor(msg.Status)}
                    size="small"
                  />
                </Stack>

                <Divider sx={{ marginBottom: 2 }} />

                {/* Información del usuario */}
                <Stack spacing={1.5} marginBottom={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Usuario:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {msg.UserName || 'N/A'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Hace:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {msg.MinutesSinceCreated} min
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <InfoIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(msg.CreatedAt)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Mensaje */}
                <Box
                  sx={{
                    backgroundColor: theme.palette.grey[50],
                    padding: 2,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.grey[300]}`,
                    position: 'relative'
                  }}
                >
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0,
                      fontSize: '0.813rem'
                    }}
                  >
                    {msg.Message}
                  </Typography>
                  <Tooltip title={copiedId === msg.QueueId ? 'Copiado!' : 'Copiar mensaje'}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopyMessage(msg.Message, msg.QueueId)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText'
                        }
                      }}
                    >
                      {copiedId === msg.QueueId ? (
                        <CheckIcon fontSize="small" color="success" />
                      ) : (
                        <CopyIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        /* Vista Desktop: Tabla */
        <TableContainer component={Paper} variant="outlined">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    minWidth: 400
                  }}
                >
                  Mensaje
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Usuario
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Fecha/Hora
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    width: 120
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    width: 100,
                    textAlign: 'center'
                  }}
                >
                  Hace (min)
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    width: 80,
                    textAlign: 'center'
                  }}
                >
                  Copiar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.QueueId} hover>
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.grey[50],
                        padding: 1.5,
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.grey[300]}`
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          margin: 0,
                          fontSize: '0.813rem'
                        }}
                      >
                        {msg.Message}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight={500}>
                        {msg.UserName || 'N/A'}
                      </Typography>
                      {msg.Name && (
                        <Typography variant="caption" color="text.secondary">
                          {msg.Name}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(msg.CreatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={msg.Status}
                      color={getStatusColor(msg.Status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={500}>
                      {msg.MinutesSinceCreated}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={copiedId === msg.QueueId ? 'Copiado!' : 'Copiar mensaje'}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyMessage(msg.Message, msg.QueueId)}
                        color={copiedId === msg.QueueId ? 'success' : 'default'}
                      >
                        {copiedId === msg.QueueId ? (
                          <CheckIcon fontSize="small" />
                        ) : (
                          <CopyIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Info adicional */}
      <Alert severity="info" sx={{ marginTop: 2 }}>
        Los mensajes se actualizan automáticamente cada 30 segundos
      </Alert>
    </Box>
  );
};
