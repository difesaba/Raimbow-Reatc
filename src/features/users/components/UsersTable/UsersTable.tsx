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
  Avatar,
  Card,
  CardContent,
  CardActions,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Edit,
  Delete,
  People,
  CheckCircle,
  Business,
  CalendarToday,
  Key,
  Email as EmailIcon,
  AttachMoney as MoneyIcon
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    // Validación defensiva para valores undefined, null o vacíos
    const firstInitial = firstName && firstName.length > 0 ? firstName.charAt(0) : '?';
    const lastInitial = lastName && lastName.length > 0 ? lastName.charAt(0) : '?';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Get role name from dynamic roles
  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.RoleId === roleId);
    return role?.RoleName || `Rol ${roleId}`;
  };

  // Loading skeleton
  if (loading) {
    if (isMobile) {
      return (
        <Stack spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Skeleton variant="circular" width={56} height={56} />
                  <Box flex={1}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Box>
                </Stack>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="45%" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      );
    } else {
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

  // Mobile view (Cards)
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {users.map((user) => (
          <Card key={user.UserId} elevation={1}>
            <CardContent>
              {/* User Header with Avatar */}
              <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                <Avatar src={user.Img} sx={{ width: 56, height: 56 }}>
                  {getUserInitials(user.FirstName, user.LastName)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user.FirstName} {user.LastName}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <EmailIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                      {user.Email}
                    </Typography>
                  </Stack>
                </Box>
                {/* Status Badge */}
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
              </Stack>

              <Divider sx={{ mb: 1.5 }} />

              {/* User Details */}
              <Stack spacing={1}>
                {/* Rol */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Rol
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {getRoleName(user.RoleId)}
                  </Typography>
                </Stack>

                {/* Empresa */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Empresa
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Business fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {user.Company}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Salario */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Salario
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <MoneyIcon fontSize="small" color="success" sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {formatCurrency(user.Salary)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Badges */}
                {(user.IsAdmin || user.isRainbow || user.Leader) && (
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Badges
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {user.IsAdmin && (
                        <Chip label="Admin" size="small" color="error" />
                      )}
                      {user.isRainbow && (
                        <Chip label="Rainbow" size="small" color="primary" />
                      )}
                      {user.Leader && (
                        <Chip label="Líder" size="small" color="warning" />
                      )}
                    </Stack>
                  </Stack>
                )}

                {/* Fecha */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Creado
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <CalendarToday fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(user.CreateDate)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>

            {/* Actions */}
            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
              <Tooltip title="Editar">
                <IconButton
                  color="primary"
                  onClick={() => onEdit && onEdit(user)}
                  sx={{ minWidth: 44, minHeight: 44 }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cambiar Contraseña">
                <IconButton
                  color="warning"
                  onClick={() => onChangePassword && onChangePassword(user)}
                  sx={{ minWidth: 44, minHeight: 44 }}
                >
                  <Key />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  color="error"
                  onClick={() => onDelete && onDelete(user)}
                  sx={{ minWidth: 44, minHeight: 44 }}
                >
                  <Delete />
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