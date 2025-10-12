// src/features/work/pages/WeeklySchedulePage/view/MobileWeekView.tsx
import { Box, Paper, Skeleton, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { TaskBar } from '../../../components/TaskBar';
import type { LotDetail } from '../../../interfaces/work.interfaces';

interface DayData {
  date: Date;
  dateKey: string;
  dayInfo: {
    name: string;
    number: string;
    isToday: boolean;
    dateKey: string;
    fullDate: string;
  };
  tasks: LotDetail[];
}

interface MobileWeekViewProps {
  tasksByDay: DayData[];
  expandedDays: Set<string>;
  loading: boolean;
  onToggleDay: (dateKey: string) => void;
  onTaskClick: (task: LotDetail, event: React.MouseEvent) => void;
}

/**
 * 📱 Vista móvil del calendario semanal
 * Muestra las tareas agrupadas por día en formato accordion
 */
export const MobileWeekView = ({
  tasksByDay,
  expandedDays,
  loading,
  onToggleDay,
  onTaskClick
}: MobileWeekViewProps) => {
  return (
    <Box display={{ xs: 'block', sm: 'none' }}>
      <Paper
        elevation={0}
        style={{
          overflow: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {loading ? (
          <Box p={2}>
            {[1, 2, 3].map((i) => (
              <Box key={i} mb={2}>
                <Skeleton variant="rectangular" height={120} />
              </Box>
            ))}
          </Box>
        ) : (
          <Stack spacing={0}>
            {tasksByDay.map((day) => (
              <Accordion
                key={day.dateKey}
                expanded={expandedDays.has(day.dateKey)}
                onChange={() => onToggleDay(day.dateKey)}
                disableGutters
                elevation={0}
                sx={{
                  '&:before': {
                    display: 'none'
                  },
                  '&.Mui-expanded': {
                    margin: 0
                  }
                }}
              >
                {/* Header del día */}
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        fontSize: 28,
                        color: day.dayInfo.isToday ? 'primary.contrastText' : 'text.primary'
                      }}
                    />
                  }
                  sx={{
                    backgroundColor: day.dayInfo.isToday ? 'primary.main' : 'background.default',
                    color: day.dayInfo.isToday ? 'primary.contrastText' : 'text.primary',
                    borderBottom: 2,
                    borderColor: 'divider',
                    px: 2,
                    py: 1.5,
                    minHeight: 64,
                    '&.Mui-expanded': {
                      minHeight: 64,
                      borderBottom: 2,
                      borderColor: 'divider'
                    },
                    '& .MuiAccordionSummary-content': {
                      my: 1
                    },
                    '& .MuiAccordionSummary-content.Mui-expanded': {
                      my: 1
                    }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} textTransform="capitalize">
                      {day.dayInfo.fullDate}
                    </Typography>
                    {day.tasks.length > 0 && (
                      <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                        {day.tasks.length} tarea{day.tasks.length !== 1 ? 's' : ''}
                      </Typography>
                    )}
                  </Box>
                </AccordionSummary>

                {/* Tareas del día */}
                <AccordionDetails sx={{ p: 0 }}>
                  {day.tasks.length > 0 ? (
                    <Stack spacing={1.5} p={1.5}>
                      {day.tasks.map((task) => (
                        <TaskBar
                          key={task.IdDet}
                          task={task}
                          gridColumnStart={1}
                          gridColumnSpan={1}
                          onClick={onTaskClick}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box p={2} textAlign="center">
                      <Typography variant="caption" color="text.secondary">
                        Sin tareas programadas
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};
