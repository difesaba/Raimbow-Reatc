import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Stack,
  Skeleton,
  Chip,
  Avatar
} from '@mui/material';
import {
  Edit,
  Delete,
  People,
  CheckCircle,
  Business,
  CalendarToday,
  Key
} from '@mui/icons-material';
import type { UsersTableProps } from './UsersTable.types';

export const UsersTable = ({
  users,
  roles,
  loading,
  onEdit,
  onChangePassword,
  onDelete
}: UsersTableProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get user initials
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get role name from dynamic roles
  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.RoleId === roleId);
    return role?.RoleName || `Rol ${roleId}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Salario</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Badges</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box>
                      <Skeleton variant="text" width={120} />
                      <Skeleton variant="text" width={150} height={16} />
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={70} height={24} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="rounded" width={60} height={20} />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
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

  // Empty state
  if (users.length === 0) {
    return (
      <Stack alignItems="center" spacing={2} paddingY={8}>
        <People fontSize="large" color="disabled" />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No se encontraron usuarios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Intenta ajustar los filtros de búsqueda o añade un nuevo usuario
        </Typography>
      </Stack>
    );
  }

  return (
    <TableContainer style={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Empresa</TableCell>
            <TableCell>Salario</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Badges</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.UserId} hover>
              {/* Usuario column with Avatar + Name + Email */}
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={user.Img}>
                    {getUserInitials(user.FirstName, user.LastName)}
                  </Avatar>
                  <Stack>
                    <Typography variant="body2" fontWeight={500}>
                      {user.FirstName} {user.LastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.Email}
                    </Typography>
                  </Stack>
                </Stack>
              </TableCell>

              {/* Rol */}
              <TableCell>
                <Typography variant="body2">
                  {getRoleName(user.RoleId)}
                </Typography>
              </TableCell>

              {/* Empresa */}
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Business fontSize="small" color="action" />
                  <Typography variant="body2">
                    {user.Company}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Salario */}
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {formatCurrency(user.Salary)}
                </Typography>
              </TableCell>

              {/* Estado */}
              <TableCell>
                {user.Status === 1 ? (
                  <Chip
                    label="Activo"
                    size="small"
                    color="success"
                    icon={<CheckCircle fontSize="small" />}
                  />
                ) : (
                  <Chip
                    label="Inactivo"
                    size="small"
                    color="default"
                  />
                )}
              </TableCell>

              {/* Badges */}
              <TableCell>
                <Stack direction="row" spacing={0.5}>
                  {user.IsAdmin && (
                    <Chip
                      label="Admin"
                      size="small"
                      color="error"
                    />
                  )}
                  {user.isRainbow && (
                    <Chip
                      label="Rainbow"
                      size="small"
                      color="primary"
                    />
                  )}
                  {user.Leader && (
                    <Chip
                      label="Líder"
                      size="small"
                      color="warning"
                    />
                  )}
                </Stack>
              </TableCell>

              {/* Fecha */}
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(user.CreateDate)}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit && onEdit(user)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cambiar Contraseña">
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => onChangePassword && onChangePassword(user)}
                    >
                      <Key fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete && onDelete(user)}
                    >
                      <Delete fontSize="small" />
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