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
  History
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
                      // Case 1: Work without manager - Only "Asignar" button (no menu)
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
                      // Case 2: Work with manager AND TaskId > 0 - Show Edit + Audit + Menu
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
                      // Case 3: Work with manager but TaskId <= 0 - Only menu
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
        {/* Menu options based on TaskId status */}
        {selectedWork?.TaskId && selectedWork.TaskId > 0 ? (
          // TaskId > 0: Edit and Audit are quick actions, so only show Details and Delete
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
          // TaskId <= 0: Show Edit (disabled), Details, and Audit in menu
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
    </TableContainer>
  );
};
