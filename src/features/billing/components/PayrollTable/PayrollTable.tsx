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
  Skeleton,
  Card,
  CardContent,
  CardActions,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Visibility as ViewIcon,
  FileDownload as DownloadIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import type { PayrollTableProps } from '../../interfaces/payroll.interfaces';
import { formatCurrency, dollarsToWords } from '../../utils/payroll.utils';

/**
 * Table component displaying employee payroll information
 * Features responsive design: Cards on mobile, Table on desktop
 */
export const PayrollTable: React.FC<PayrollTableProps> = ({
  employees,
  onViewDetail,
  onDownloadStatement,
  selectedEmployeeId,
  loading = false,
  downloading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Loading state
  if (loading) {
    if (isMobile) {
      // Mobile loading skeleton
      return (
        <Stack spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Card key={index} elevation={1}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="50%" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      );
    } else {
      // Desktop loading skeleton
      return (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Empleado</TableCell>
                <TableCell align="right">Horas Trabajadas</TableCell>
                <TableCell align="right">Pago Total</TableCell>
                {!isTablet && <TableCell>Amount in Words</TableCell>}
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  {!isTablet && <TableCell><Skeleton /></TableCell>}
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  // Empty state
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

  // Mobile view (Cards)
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {employees.map((employee) => (
          <Card
            key={employee.IdUser}
            elevation={selectedEmployeeId === employee.IdUser ? 3 : 1}
            sx={{
              borderLeft: selectedEmployeeId === employee.IdUser ? 3 : 0,
              borderColor: 'primary.main',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                elevation: 2,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent>
              {/* Employee Name */}
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <PersonIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  {employee.FullName}
                </Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* Hours */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Horas Trabajadas
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={500}>
                  {employee.TotalHour.toFixed(2)}
                </Typography>
              </Stack>

              {/* Total Payment */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <MoneyIcon fontSize="small" color="success" />
                  <Typography variant="body2" color="text.secondary">
                    Pago Total
                  </Typography>
                </Stack>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  {formatCurrency(employee.Total)}
                </Typography>
              </Stack>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
              <Tooltip title="Ver Detalles">
                <IconButton
                  color="primary"
                  onClick={() => onViewDetail(employee.IdUser)}
                  aria-label={`Ver detalles de ${employee.FullName}`}
                  sx={{ minWidth: 44, minHeight: 44 }} // Touch-friendly size
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar Comprobante">
                <IconButton
                  color="default"
                  onClick={() => onDownloadStatement?.(employee.IdUser)}
                  disabled={downloading}
                  aria-label={`Descargar comprobante de ${employee.FullName}`}
                  sx={{ minWidth: 44, minHeight: 44 }} // Touch-friendly size
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        ))}
      </Stack>
    );
  }

  // Desktop view (Table)
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
            {/* Hide "Amount in Words" on tablet to save space */}
            {!isTablet && (
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Amount in Words
                </Typography>
              </TableCell>
            )}
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
              {!isTablet && (
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {dollarsToWords(employee.Total)}
                  </Typography>
                </TableCell>
              )}
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