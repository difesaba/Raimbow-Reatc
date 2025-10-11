import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Stack,
  Skeleton
} from '@mui/material';
import {
  Visibility as ViewIcon,
  FileDownload as DownloadIcon
} from '@mui/icons-material';
import type { PayrollTableProps } from '../../interfaces/payroll.interfaces';
import { formatCurrency, dollarsToWords } from '../../utils/payroll.utils';

/**
 * Table component displaying employee payroll information
 * Features enhanced interactions and better visual hierarchy
 */
export const PayrollTable: React.FC<PayrollTableProps> = ({
  employees,
  onViewDetail,
  onDownloadStatement,
  selectedEmployeeId,
  loading = false,
  downloading = false
}) => {
  if (loading) {
    return (
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Empleado</TableCell>
              <TableCell align="right">Horas Trabajadas</TableCell>
              <TableCell align="right">Pago Total</TableCell>
              <TableCell>Amount in Words</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (employees.length === 0) {
    return (
      <Paper elevation={1}>
        <Stack padding={4} alignItems="center">
          <Typography variant="body1" color="text.secondary">
            No hay datos de nómina disponibles para este período
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Empleado
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight={600}>
                Horas Trabajadas
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight={600}>
                Pago Total
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Amount in Words
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2" fontWeight={600}>
                Acciones
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.IdUser}
              selected={selectedEmployeeId === employee.IdUser}
              hover
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {employee.FullName}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {employee.TotalHour.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="success.main"
                >
                  {formatCurrency(employee.Total)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {dollarsToWords(employee.Total)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Ver Detalles">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => onViewDetail(employee.IdUser)}
                      aria-label={`Ver detalles de ${employee.FullName}`}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Descargar Comprobante">
                    <IconButton
                      color="default"
                      size="small"
                      onClick={() => onDownloadStatement?.(employee.IdUser)}
                      disabled={downloading}
                      aria-label={`Descargar comprobante de ${employee.FullName}`}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};