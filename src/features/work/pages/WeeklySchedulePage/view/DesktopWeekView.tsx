// src/features/work/pages/WeeklySchedulePage/view/DesktopWeekView.tsx
import { Box, Paper, Skeleton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { TaskBar } from '../../../components/TaskBar';
import type { LotDetail } from '../../../interfaces/work.interfaces';
import type { TaskWithGridPosition } from '../../../hooks/useWeeklySchedule';

interface DayName {
  name: string;
  number: string;
  isToday: boolean;
}

interface DesktopWeekViewProps {
  dayNames: DayName[];
  tasksWithGridPositions: TaskWithGridPosition[];
  loading: boolean;
  onTaskClick: (task: LotDetail, event: React.MouseEvent) => void;
}

// Estilos CSS Grid como objeto para mejor organización
const gridStyles = {
  weekHeader: {
    display: 'grid',
    gap: 0, // Sin gap - usa borderRight para separar columnas
    position: 'sticky' as const,
    top: 0,
    zIndex: 10
  },
  tasksGrid: {
    display: 'grid',
    gridAutoFlow: 'dense',
    gridAutoRows: 'minmax(95px, auto)',
    gap: 1.5, // Gap de 12px (1.5 * 8px del tema MUI)
    padding: 2, // Padding de 16px (2 * 8px)
    position: 'relative' as const
  }
};

/**
 * 💻 Vista desktop del calendario semanal
 * Muestra las tareas en formato Gantt con grid CSS
 */
export const DesktopWeekView = ({
  dayNames,
  tasksWithGridPositions,
  loading,
  onTaskClick
}: DesktopWeekViewProps) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Configuración responsive del grid
  const gridColumns = isTablet ? 'repeat(5, 1fr)' : 'repeat(7, 1fr)';

  return (
    <Box display={{ xs: 'none', sm: 'block' }}>
      <Paper
        elevation={1}
        style={{
          overflow: 'auto',
          minHeight: 400,
          maxHeight: 'calc(100vh - 300px)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Header de días de la semana (sticky) */}
        <Box
          style={{
            ...gridStyles.weekHeader,
            gridTemplateColumns: gridColumns,
            borderBottom: `2px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          {dayNames.map((day, index) => {
            const shouldHideOnTablet = isTablet && index >= 5;

            return (
              <Box
                key={index}
                p={2}
                textAlign="center"
                bgcolor={day.isToday ? 'primary.main' : 'background.default'}
                color={day.isToday ? 'primary.contrastText' : 'text.primary'}
                borderRight={index < 6 ? 1 : 0}
                borderColor="divider"
                display={shouldHideOnTablet ? 'none' : 'block'}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  textTransform="capitalize"
                  display="block"
                >
                  {isTablet ? day.name.substring(0, 3) : day.name}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {day.number}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Grid de tareas con auto-flow dense */}
        <Box
          style={{
            ...gridStyles.tasksGrid,
            gridTemplateColumns: gridColumns
          }}
        >
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Box
                  key={i}
                  style={{
                    gridColumn: `${Math.floor(Math.random() * 5) + 1} / span ${Math.floor(Math.random() * 3) + 1}`
                  }}
                >
                  <Skeleton variant="rectangular" height={60} />
                </Box>
              ))}
            </>
          ) : tasksWithGridPositions.length > 0 ? (
            tasksWithGridPositions.map((task) => (
              <TaskBar
                key={task.IdDet}
                task={task}
                gridColumnStart={task.gridColumnStart}
                gridColumnSpan={task.gridColumnSpan}
                onClick={onTaskClick}
              />
            ))
          ) : (
            <Box
              style={{ gridColumn: '1 / -1' }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight={300}
              color="text.secondary"
            >
              <Typography variant="h6" gutterBottom>
                Sin tareas programadas
              </Typography>
              <Typography variant="body2">
                No hay tareas para esta semana
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
