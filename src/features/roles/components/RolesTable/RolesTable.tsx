import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import type { RolesTableProps } from './RolesTable.types';

/**
 * 📋 Componente de tabla para visualizar roles
 * Componente puro que solo recibe datos vía props
 *
 * Features:
 * - ✅ Visualización de roles en formato tabla
 * - ✅ Manejo de estados: loading, empty, error
 * - ✅ Acciones: editar, eliminar, ver detalles (preparadas para futuro)
 * - ✅ Indicador visual de estado activo/inactivo
 * - ✅ Tooltips descriptivos
 * - ✅ Responsive design
 */
export const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  loading = false,
  onEdit,
  onDelete,
  onViewDetails,
  selectedRoleId
}) => {
  // ==================== MANEJO DE ESTADOS ====================

  /** ⏳ Mostrar skeleton mientras carga */
  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre del Rol</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Nivel de Acceso
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Estado
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {/* ID */}
                <TableCell>
                  <Skeleton variant="text" width={40} />
                </TableCell>
                {/* Nombre del Rol */}
                <TableCell>
                  <Skeleton variant="text" width={150} />
                </TableCell>
                {/* Descripción */}
                <TableCell>
                  <Skeleton variant="text" width={250} />
                </TableCell>
                {/* Nivel de Acceso */}
                <TableCell align="center">
                  <Skeleton variant="rounded" width={40} height={24} sx={{ margin: '0 auto' }} />
                </TableCell>
                {/* Estado */}
                <TableCell align="center">
                  <Skeleton variant="rounded" width={70} height={24} sx={{ margin: '0 auto' }} />
                </TableCell>
                {/* Acciones */}
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  /** 📭 Mostrar mensaje cuando no hay roles */
  if (!roles || roles.length === 0) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Alert severity="info">
          No hay roles registrados en el sistema. Crea tu primer rol usando el botón "Nuevo Rol".
        </Alert>
      </Box>
    );
  }

  // ==================== RENDER PRINCIPAL ====================

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de roles">
        {/* ==================== HEADER ==================== */}
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre del Rol</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Nivel de Acceso
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Estado
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>

        {/* ==================== BODY ==================== */}
        <TableBody>
          {roles.map((role) => {
            const isSelected = selectedRoleId === role.RoleId;
            const isActive = role.Active !== false; // Default true si no está definido

            return (
              <TableRow
                key={role.RoleId}
                hover
                selected={isSelected}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: isSelected ? 'action.selected' : 'inherit'
                }}
              >
                {/* ID */}
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="medium">
                    {role.RoleId}
                  </Typography>
                </TableCell>

                {/* Nombre del Rol */}
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {role.RoleName}
                  </Typography>
                </TableCell>

                {/* Descripción */}
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {role.Description || 'Sin descripción'}
                  </Typography>
                </TableCell>

                {/* Nivel de Acceso */}
                <TableCell align="center">
                  <Chip
                    label={role.AccessLevel || 1}
                    size="small"
                    color={
                      (role.AccessLevel || 1) >= 7
                        ? 'error'
                        : (role.AccessLevel || 1) >= 4
                        ? 'warning'
                        : 'default'
                    }
                  />
                </TableCell>

                {/* Estado */}
                <TableCell align="center">
                  <Chip
                    label={isActive ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={isActive ? 'success' : 'default'}
                    variant={isActive ? 'filled' : 'outlined'}
                  />
                </TableCell>

                {/* Acciones */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {/* Ver detalles */}
                    {onViewDetails && (
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => onViewDetails(role)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Editar */}
                    {onEdit && (
                      <Tooltip title="Editar rol">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(role)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Eliminar */}
                    {onDelete && (
                      <Tooltip title="Eliminar rol">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(role.RoleId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
