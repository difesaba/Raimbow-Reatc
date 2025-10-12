import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Stack,
  Skeleton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActions,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  PersonAdd,
  Warning,
  Assignment,
  Person,
  CalendarToday,
  Info,
  Delete,
  Edit,
  MoreVert,
  History,
  Home as LotIcon,
  LocationCity as SubdivisionIcon
} from '@mui/icons-material';
import type { WorkAssignmentTableProps } from './WorkAssignmentTable.types';

export const WorkAssignmentTable = ({
  works,
  loading,
  onEdit,
  onViewDetails,
  onViewAudit,
  onDeleteWork
}: WorkAssignmentTableProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const menuOpen = Boolean(anchorEl);

  // Memoize sorted works (unassigned first)
  const sortedWorks = useMemo(() => {
    return [...works].sort((a, b) => {
      // Unassigned works first
      if (!a.UserRainbow && b.UserRainbow) return -1;
      if (a.UserRainbow && !b.UserRainbow) return 1;
      return 0;
    });
  }, [works]);

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, work: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedWork(work);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWork(null);
  };

  const handleEdit = () => {
    if (selectedWork) {
      onEdit(selectedWork);
      handleMenuClose();
    }
  };

  const handleViewDetails = () => {
    if (selectedWork) {
      onViewDetails(selectedWork);
      handleMenuClose();
    }
  };

  const handleViewAudit = () => {
    if (selectedWork) {
      onViewAudit(selectedWork);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedWork) {
      onDeleteWork(selectedWork);
      handleMenuClose();
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Proceso</TableCell>
              <TableCell>Subdivision</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>PIES</TableCell>
              <TableCell>Colores</TableCell>
              <TableCell>Puerta</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width={40} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={100} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="70%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={60} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={100} height={32} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Empty state
  if (works.length === 0) {
    return (
      <Stack alignItems="center" spacing={2} paddingY={8}>
        <Assignment fontSize="large" color="disabled" />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay trabajos programados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona una fecha y haz clic en "Consultar" para ver los trabajos del día
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      {/* Vista Mobile: Cards */}
      {isMobile ? (
        <Stack spacing={2} padding={{ xs: 1, sm: 2 }}>
          {sortedWorks.map((work, index) => {
            const needsManager = !work.UserRainbow;

            return (
              <Card
                key={`${work.LotId}-${work.Status}-${work.TaskId || index}`}
                variant="outlined"
                sx={{
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    borderColor: needsManager ? 'warning.main' : 'primary.main'
                  },
                  ...(needsManager && {
                    borderColor: 'warning.light',
                    borderWidth: 2
                  })
                }}
              >
                <CardContent>
                  {/* Header del Card */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LotIcon color="primary" />
                      <Typography variant="h6" component="div" color="primary">
                        {work.Number || 'N/A'}
                      </Typography>
                      <Chip
                        label={work.Town === 1 ? 'Townhome' : 'Lote'}
                        size="small"
                        color={work.Town === 1 ? 'info' : 'default'}
                        variant="outlined"
                      />
                    </Stack>
                    {!needsManager && work.TaskId && work.TaskId > 0 && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, work)}
                        aria-label="más acciones"
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>

                  <Divider sx={{ marginBottom: 2 }} />

                  {/* Información Principal */}
                  <Stack spacing={1.5}>
                    {/* Proceso */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        PROCESO
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {work.WorkName}
                      </Typography>
                      {work.Obs && (
                        <Typography variant="caption" color="text.secondary">
                          {work.Obs}
                        </Typography>
                      )}
                    </Box>

                    {/* Subdivisión */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SubdivisionIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {work.ClientName}
                      </Typography>
                    </Stack>

                    {/* Manager */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      {work.ManagerName ? (
                        <>
                          <Person fontSize="small" color="action" />
                          <Typography variant="body2">
                            Manager: <strong>{work.ManagerName}</strong>
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Warning fontSize="small" color="warning" />
                          <Typography variant="body2" color="warning.main" fontWeight={600}>
                            Sin manager asignado
                          </Typography>
                        </>
                      )}
                    </Stack>

                    {/* Fecha */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">
                        {work.ScheduledDate || 'Sin fecha'}
                      </Typography>
                    </Stack>

                    {/* Información Adicional (solo si existe) */}
                    {(work.SFQuantity || work.Colors || work.DoorDesc) && (
                      <Box sx={{ paddingTop: 1, borderTop: 1, borderColor: 'divider' }}>
                        <Stack spacing={0.5}>
                          {work.SFQuantity && (
                            <Typography variant="caption" color="text.secondary">
                              SQ FT: {work.SFQuantity}
                            </Typography>
                          )}
                          {work.Colors && (
                            <Typography variant="caption" color="text.secondary">
                              Colores: {work.Colors}
                            </Typography>
                          )}
                          {work.DoorDesc && (
                            <Typography variant="caption" color="text.secondary">
                              Puerta: {work.DoorDesc}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </CardContent>

                {/* Acciones */}
                <CardActions sx={{ padding: 2, paddingTop: 0 }}>
                  {needsManager ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      startIcon={<PersonAdd />}
                      onClick={() => onEdit(work)}
                    >
                      Asignar Manager
                    </Button>
                  ) : work.TaskId && work.TaskId > 0 ? (
                    <Stack direction="row" spacing={1} width="100%">
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => onEdit(work)}
                      >
                        Editar
                      </Button>
                      <Tooltip title="Ver auditoría">
                        <IconButton
                          color="info"
                          onClick={() => onViewAudit(work)}
                        >
                          <History />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => onViewDetails(work)}
                    >
                      Ver Detalles
                    </Button>
                  )}
                </CardActions>
              </Card>
            );
          })}
        </Stack>
      ) : (
        /* Vista Desktop: Tabla */
        <TableContainer style={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Proceso</TableCell>
                <TableCell>Subdivision</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Pies</TableCell>
                <TableCell>Colores</TableCell>
                <TableCell>Puerta</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedWorks.map((work, index) => {
                const needsManager = !work.UserRainbow;

                return (
                  <TableRow
                    key={`${work.LotId}-${work.Status}-${work.TaskId || index}`}
                    hover
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {work.Number || 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={work.Town === 1 ? 'Townhome' : 'Lote'}
                        size="small"
                        color={work.Town === 1 ? 'info' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={500}>
                          {work.WorkName}
                        </Typography>
                        {work.Obs && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {work.Obs}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {work.ClientName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {work.ManagerName ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Person fontSize="small" color="action" />
                          <Typography variant="body2">
                            {work.ManagerName}
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Warning fontSize="small" color="warning" />
                          <Typography
                            variant="body2"
                            color="warning.main"
                            fontWeight={500}
                          >
                            No asignado
                          </Typography>
                        </Stack>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {work.SFQuantity || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {work.Colors || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {work.DoorDesc || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">
                          {work.ScheduledDate || 'Sin fecha'}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {needsManager ? (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<PersonAdd />}
                            onClick={() => onEdit(work)}
                          >
                            Asignar
                          </Button>
                        ) : work.TaskId && work.TaskId > 0 ? (
                          <>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onEdit(work)}
                                aria-label="editar tarea"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Ver auditoría">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => onViewAudit(work)}
                                aria-label="ver auditoría"
                              >
                                <History fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Más acciones">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, work)}
                                aria-label="más acciones"
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title="Más acciones">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, work)}
                              aria-label="más acciones"
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {selectedWork?.TaskId && selectedWork.TaskId > 0 ? (
          <>
            <MenuItem onClick={handleViewDetails}>
              <ListItemIcon>
                <Info fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Ver detalles completos" />
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Delete fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Eliminar tarea" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              onClick={handleEdit}
              disabled
            >
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Editar" />
            </MenuItem>

            <MenuItem onClick={handleViewDetails}>
              <ListItemIcon>
                <Info fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Ver detalles completos" />
            </MenuItem>

            <MenuItem onClick={handleViewAudit}>
              <ListItemIcon>
                <History fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Ver auditoría" />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};
