import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  Divider,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Close as CloseIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { WorkService } from '../../services/work.service';
import type { TaskAuditDialogProps } from './TaskAuditDialog.types';
import type { AuditRecord } from '../../interfaces/work.interfaces';

/**
 * 📅 Formatear fecha a formato legible
 */
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'No disponible';
  try {
    const date = new Date(dateStr);
    return format(date, "d 'de' MMMM 'de' yyyy - HH:mm", { locale: es });
  } catch {
    return dateStr;
  }
};

/**
 * 🔍 Parsear Summary JSON
 */
const parseSummary = (summaryStr: string): Record<string, unknown> | null => {
  try {
    if (!summaryStr || summaryStr.trim() === '') {
      console.log('📋 Summary vacío o inválido');
      return null;
    }

    console.log('📋 Summary raw string:', summaryStr);
    const parsed = JSON.parse(summaryStr) as Record<string, unknown>;
    console.log('📋 Summary parsed:', parsed);
    console.log('📋 Summary keys:', Object.keys(parsed));
    console.log('📋 Summary structure:', JSON.stringify(parsed, null, 2));

    return parsed;
  } catch (error) {
    console.warn('❌ Error parsing summary:', error);
    console.warn('❌ Summary string was:', summaryStr);
    return null;
  }
};

/**
 * 🔎 Detectar si un valor tiene estructura {Old, New}
 */
const hasOldNewStructure = (value: unknown): boolean => {
  return typeof value === 'object' &&
         value !== null &&
         !Array.isArray(value) &&
         ('Old' in value || 'New' in value);
};

/**
 * 🎨 Get color for action type
 */
const getActionTypeColor = (actionType: string): 'success' | 'primary' | 'error' | 'default' => {
  switch (actionType.toUpperCase()) {
    case 'CREATE':
      return 'success';
    case 'UPDATE':
      return 'primary';
    case 'DELETE':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * 🎯 Get icon for action type
 */
const getActionTypeIcon = (actionType: string) => {
  switch (actionType.toUpperCase()) {
    case 'CREATE':
      return <AddIcon fontSize="small" />;
    case 'UPDATE':
      return <EditIcon fontSize="small" />;
    case 'DELETE':
      return <DeleteIcon fontSize="small" />;
    default:
      return <HistoryIcon fontSize="small" />;
  }
};

/**
 * 📝 Formatear valor para mostrar
 */
const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

/**
 * 🏷️ Traducir nombre de campo
 */
const translateFieldName = (field: string): string => {
  const translations: Record<string, string> = {
    // Campos de tarea
    'UserRainbow': 'Manager',
    'StartDate': 'Fecha Inicio',
    'EndDate': 'Fecha Fin',
    'Completed': 'Completado',
    'Obs': 'Observaciones',
    'Observacion': 'Observaciones',
    'Status': 'Estado',
    // Campos del Summary
    'Tipo': 'Tipo',
    'Tarea': 'ID Tarea',
    'Subdivision': 'Subdivisión',
    'Progreso': 'Progreso',
    'Numero': 'Número de Lote'
  };
  return translations[field] || field;
};

/**
 * 🕒 Dialog de Auditoría de Tarea
 * Muestra historial completo de cambios realizados en una tarea
 */
export const TaskAuditDialog: React.FC<TaskAuditDialogProps> = ({
  open,
  taskId,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);

  // Fetch audit records when dialog opens
  useEffect(() => {
    if (open && taskId && taskId > 0) {
      fetchAuditRecords();
    } else if (open && (!taskId || taskId <= 0)) {
      setError('No se puede cargar auditoría: TaskId inválido');
    }
  }, [open, taskId]);

  /**
   * Fetch audit records from API
   */
  const fetchAuditRecords = async () => {
    if (!taskId || taskId <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await WorkService.getTaskAudit(taskId);
      setAuditRecords(response.data || []);
    } catch (err: unknown) {
      console.error('Error fetching audit:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar auditoría';
      setError(errorMessage);
      setAuditRecords([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset state when closing
   */
  const handleClose = () => {
    setAuditRecords([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      {/* Header */}
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <HistoryIcon color="primary" fontSize="medium" />
              <Typography variant="h6" fontWeight={600}>
                Auditoría de Tarea
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Historial completo de cambios
              {taskId && ` - Tarea #${taskId}`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="medium">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3, pt: 3 }}>
        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Cargando historial de auditoría...
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && auditRecords.length === 0 && (
          <Box py={6} textAlign="center">
            <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay registros de auditoría
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Esta tarea aún no tiene historial de cambios
            </Typography>
          </Box>
        )}

        {/* Audit Records */}
        {!loading && !error && auditRecords.length > 0 && (
          <Stack spacing={2}>
            {auditRecords.map((record, index) => {
              const summary = parseSummary(record.Summary);

              return (
                <Accordion
                  key={record.AuditId}
                  defaultExpanded={index === 0}
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" alignItems="center" spacing={2} width="100%">
                      {/* Action Type Chip */}
                      <Chip
                        icon={getActionTypeIcon(record.ActionType)}
                        label={record.ActionType}
                        color={getActionTypeColor(record.ActionType)}
                        size="small"
                      />

                      {/* Date */}
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(record.CreatedAt)}
                        </Typography>
                      </Stack>

                      <Box flex={1} />

                      {/* User */}
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {record.Usuario || `Usuario #${record.UserId}`}
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Stack spacing={2}>
                      {/* Description */}
                      {record.Description && (
                        <Alert severity="info" icon={false}>
                          <Typography variant="body2">
                            {record.Description}
                          </Typography>
                        </Alert>
                      )}

                      {/* Summary Tables - Separated by type */}
                      {summary && Object.keys(summary).length > 0 && (() => {
                        // Separate fields into info (simple values) and changes (Old/New structure)
                        const infoFields: [string, unknown][] = [];
                        const changeFields: [string, unknown][] = [];

                        Object.entries(summary).forEach(([field, value]) => {
                          if (hasOldNewStructure(value)) {
                            changeFields.push([field, value]);
                          } else {
                            infoFields.push([field, value]);
                          }
                        });

                        return (
                          <Stack spacing={2}>
                            {/* Información General - Compact chips */}
                            {infoFields.length > 0 && (
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
                                  CONTEXTO
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                  {infoFields.map(([field, value]) => (
                                    <Chip
                                      key={field}
                                      label={`${translateFieldName(field)}: ${formatValue(value)}`}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontWeight: 500 }}
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            )}

                            {/* Cambios Realizados */}
                            {changeFields.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  Cambios Realizados
                                </Typography>
                                <TableContainer component={Paper} variant="outlined">
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell><strong>Campo</strong></TableCell>
                                        <TableCell><strong>Valor Anterior</strong></TableCell>
                                        <TableCell><strong>Valor Nuevo</strong></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {changeFields.map(([field, change]) => {
                                        // Type assertion - we know change has Old/New structure from hasOldNewStructure check
                                        const typedChange = change as { Old: unknown; New: unknown };
                                        return (
                                          <TableRow key={field}>
                                            <TableCell>
                                              <Typography variant="body2" fontWeight={500}>
                                                {translateFieldName(field)}
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography variant="body2" color="text.secondary">
                                                {formatValue(typedChange.Old)}
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography variant="body2" color="primary.main" fontWeight={500}>
                                                {formatValue(typedChange.New)}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                            )}
                          </Stack>
                        );
                      })()}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        )}
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
