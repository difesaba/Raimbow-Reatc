// src/features/work/pages/WeeklySchedulePage/components/WeekNavigationBar.tsx
import { Box, Button, Paper, Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon
} from '@mui/icons-material';

interface WeekNavigationBarProps {
  weekRangeText: string;
  isCurrentWeek: boolean;
  loading: boolean;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
}

/**
 * 🗓️ Barra de navegación semanal
 * Componente puro para navegación entre semanas
 */
export const WeekNavigationBar = ({
  weekRangeText,
  isCurrentWeek,
  loading,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek
}: WeekNavigationBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper elevation={isMobile ? 0 : 1}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        flexWrap="wrap"
        gap={2}
      >
        {/* Semana actual */}
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600}>
          Semana del {weekRangeText}
        </Typography>

        {/* Botones de navegación */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={!isMobile ? <ChevronLeftIcon /> : undefined}
            onClick={onPreviousWeek}
            disabled={loading}
          >
            {isMobile ? <ChevronLeftIcon /> : 'Anterior'}
          </Button>

          {!isCurrentWeek && (
            <Button
              variant="contained"
              size="small"
              startIcon={!isMobile ? <TodayIcon /> : undefined}
              onClick={onCurrentWeek}
              disabled={loading}
            >
              {isMobile ? <TodayIcon /> : 'Hoy'}
            </Button>
          )}

          <Button
            variant="outlined"
            size="small"
            endIcon={!isMobile ? <ChevronRightIcon /> : undefined}
            onClick={onNextWeek}
            disabled={loading}
          >
            {isMobile ? <ChevronRightIcon /> : 'Siguiente'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};
