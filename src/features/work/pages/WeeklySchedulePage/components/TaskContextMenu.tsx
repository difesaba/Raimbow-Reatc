// src/features/work/pages/WeeklySchedulePage/components/TaskContextMenu.tsx
import { Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  CalendarToday as CalendarTodayIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import type { LotDetail } from '../../../interfaces/work.interfaces';
import { hasValidTaskId } from '../utils/taskMappers';

interface TaskContextMenuProps {
  anchorPosition: { mouseX: number; mouseY: number } | null;
  task: LotDetail | null;
  isAdmin: boolean;
  loading: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onAssignManager: () => void;
  onEditDates: () => void;
  onToggleCompleted: () => void;
  onAuditAssignment: () => void;
}

/**
 * 📋 Menú contextual para acciones sobre tareas
 * Componente puro que solo maneja la presentación del menú
 */
export const TaskContextMenu = ({
  anchorPosition,
  task,
  isAdmin,
  loading,
  onClose,
  onViewDetails,
  onAssignManager,
  onEditDates,
  onToggleCompleted,
  onAuditAssignment
}: TaskContextMenuProps) => {
  // Validación: Solo permitir editar si tiene TaskId válido
  const canEdit = hasValidTaskId(task);

  // Determinar mensaje de tooltip según la restricción
  const getTooltipMessage = (requiresAdmin: boolean): string => {
    if (!canEdit) {
      return 'Esta acción requiere que la tarea esté guardada en el sistema';
    }
    if (requiresAdmin && !isAdmin) {
      return 'Esta acción requiere permisos de Administrador';
    }
    return '';
  };

  return (
    <Menu
      open={anchorPosition !== null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        anchorPosition !== null
          ? { top: anchorPosition.mouseY, left: anchorPosition.mouseX }
          : undefined
      }
      sx={{
        '& .MuiMenuItem-root': {
          py: { xs: 1.5, md: 1 },
          minHeight: { xs: 48, md: 36 }
        },
        '& .MuiListItemIcon-root': {
          fontSize: { xs: 24, md: 20 },
          minWidth: { xs: 40, md: 36 }
        },
        '& .MuiListItemText-root': {
          '& .MuiTypography-root': {
            fontSize: { xs: '0.9rem', md: '1rem' }
          }
        }
      }}
    >
      {/* Opción 1: Ver Detalles - Siempre habilitada */}
      <MenuItem onClick={onViewDetails}>
        <ListItemIcon>
          <InfoIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Ver Detalles</ListItemText>
      </MenuItem>

      {/* Opción 2: Auditoría - Solo Admin + Requiere TaskId */}
      <Tooltip title={getTooltipMessage(true)} placement="right" arrow>
        <span>
          <MenuItem
            onClick={onAuditAssignment}
            disabled={!isAdmin || !canEdit}
          >
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Auditoría</ListItemText>
          </MenuItem>
        </span>
      </Tooltip>

      {/* Opción 3: Asignar/Reasignar Manager - Solo Admin + Requiere TaskId */}
      <Tooltip title={getTooltipMessage(true)} placement="right" arrow>
        <span>
          <MenuItem
            onClick={onAssignManager}
            disabled={!isAdmin || !canEdit}
          >
            <ListItemIcon>
              <PersonAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {task?.Manager ? 'Reasignar Manager' : 'Asignar Manager'}
            </ListItemText>
          </MenuItem>
        </span>
      </Tooltip>

      {/* Opción 4: Editar Fechas - Solo Admin + Requiere TaskId */}
      <Tooltip title={getTooltipMessage(true)} placement="right" arrow>
        <span>
          <MenuItem
            onClick={onEditDates}
            disabled={!isAdmin || !canEdit}
          >
            <ListItemIcon>
              <CalendarTodayIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar Fechas</ListItemText>
          </MenuItem>
        </span>
      </Tooltip>

      {/* Opción 5: Toggle Completado - Todos los usuarios + Requiere TaskId */}
      {task && (
        <Tooltip title={getTooltipMessage(false)} placement="right" arrow>
          <span>
            <MenuItem
              onClick={onToggleCompleted}
              disabled={!canEdit || loading}
            >
              <ListItemIcon>
                {task.IsComplete === 1 ? (
                  <RadioButtonUncheckedIcon fontSize="small" />
                ) : (
                  <CheckCircleIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>
                {task.IsComplete === 1
                  ? 'Marcar como Pendiente'
                  : 'Marcar como Completada'}
              </ListItemText>
            </MenuItem>
          </span>
        </Tooltip>
      )}
    </Menu>
  );
};
