import { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { DateHourRecord, DateHourDayTotals } from '../../interfaces/payroll.interfaces';
import dayjs from 'dayjs';

interface DateHourTableProps {
  records: DateHourRecord[];
  totals: DateHourDayTotals;
  onEdit: (record: DateHourRecord) => void;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export interface DateHourTableHandle {
  highlightRow: (recordId: number) => void;
}

/**
 * 📊 Tabla de registros de horas con funcionalidad de highlight
 *
 * Características:
 * - Highlight animado para nuevos registros
 * - Confirmación antes de eliminar
 * - Formateo de datos (horas, moneda, fecha)
 * - Footer con totales
 * - Ref expuesto para highlight desde componente padre
 */
export const DateHourTable = forwardRef<DateHourTableHandle, DateHourTableProps>(
  ({ records, totals, onEdit, onDelete, loading = false }, ref) => {
    const theme = useTheme();

    // Referencias a las filas para scroll y highlight
    const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());

    // Estado para modal de confirmación
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    /**
     * 💡 Exponer método para hacer highlight desde componente padre
     */
    useImperativeHandle(ref, () => ({
      highlightRow: (recordId: number) => {
        const row = rowRefs.current.get(recordId);
        if (row) {
          // Scroll suave hacia la fila
          row.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          // Aplicar highlight temporal
          const originalBg = row.style.backgroundColor;
          row.style.backgroundColor = theme.palette.success.light;
          row.style.transition = 'background-color 0.3s ease';

          // Remover highlight después de 3 segundos
          setTimeout(() => {
            row.style.backgroundColor = originalBg;
          }, 3000);
        }
      }
    }));

    /**
     * 🗑️ Abrir modal de confirmación
     */
    const handleDeleteClick = (id: number) => {
      setRecordToDelete(id);
      setDeleteDialogOpen(true);
    };

    /**
     * ✅ Confirmar eliminación
     */
    const handleConfirmDelete = async () => {
      if (!recordToDelete) return;

      setDeleting(true);
      try {
        await onDelete(recordToDelete);
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
      } catch (error) {
        console.error('Error al eliminar registro:', error);
      } finally {
        setDeleting(false);
      }
    };

    /**
     * ❌ Cancelar eliminación
     */
    const handleCancelDelete = () => {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    };

    /**
     * 🕐 Formatear almuerzo
     */
    const formatLunch = (discountHour: number): string => {
      if (discountHour === 0) {
        return 'No';
      }
      return `Sí (${discountHour} min)`;
    };

    /**
     * 📅 Formatear fecha
     */
    const formatDate = (dateString: string): string => {
      return dayjs(dateString).format('DD/MM/YYYY');
    };

    return (
      <>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora Inicio</TableCell>
                <TableCell>Hora Fin</TableCell>
                <TableCell>Almuerzo</TableCell>
                <TableCell align="right">Total Horas</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No hay registros para mostrar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow
                    key={record.Id}
                    ref={(el) => {
                      if (el) {
                        rowRefs.current.set(record.Id, el);
                      } else {
                        rowRefs.current.delete(record.Id);
                      }
                    }}
                    hover
                  >
                    <TableCell>{formatDate(record.DateHour)}</TableCell>
                    <TableCell>{record.TimeIni}</TableCell>
                    <TableCell>{record.TimeEnd}</TableCell>
                    <TableCell>{formatLunch(record.DiscountHour)}</TableCell>
                    <TableCell align="right">
                      {record.TotalHour.toFixed(2)} hrs
                    </TableCell>
                    <TableCell align="right">
                      ${record.Total.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(record)}
                            disabled={loading}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(record.Id)}
                            disabled={loading}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            {/* Footer con totales */}
            {records.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="subtitle2" fontWeight="bold">
                      Totales del día:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight="bold">
                      {totals.totalHours.toFixed(2)} hrs
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      ${totals.totalAmount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>

        {/* Modal de confirmación de eliminación */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro que desea eliminar este registro de horas?
              Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} disabled={deleting}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              disabled={deleting}
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

DateHourTable.displayName = 'DateHourTable';
