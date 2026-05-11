import {
  Card,
  CardContent,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { WarrantyProcessTableProps } from '../../interfaces/warranty.interfaces';
import { formatCurrency } from '../../utils/payroll.utils';

const desktopTableContainerSx = {
  height: '100%',
  maxHeight: '100%',
  overflow: 'auto',
};

const stickyHeaderCellSx = {
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  zIndex: 1,
  '& .MuiTypography-root': {
    color: 'inherit',
    fontWeight: 700,
  },
};

export const WarrantyProcessTable: React.FC<WarrantyProcessTableProps> = ({
  details,
  values,
  loading = false,
  missingWarrantyIds = [],
  saving = false,
  onValueChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return (
      <Stack spacing={2}>
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} variant="rounded" height={isMobile ? 150 : 52} />
        ))}
      </Stack>
    );
  }

  if (details.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay detalle disponible para procesar.
        </Typography>
      </Paper>
    );
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {details.map((detail, index) => (
          <Card key={detail.IdWarranty} variant="outlined">
            <CardContent>
              <Stack spacing={1.25}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  Fila {index + 1}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  {detail.SubName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {detail.Address}
                </Typography>
                <Typography variant="body2">
                  <strong>Contratista:</strong> {detail.Name}
                </Typography>
                <Typography variant="body2">
                  <strong>Costo warranty:</strong> {formatCurrency(detail.Cost)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {detail.Observation || 'Sin observación'}
                </Typography>
                <TextField
                  size="small"
                  label="Valor a procesar"
                  type="number"
                  value={values[detail.IdWarranty] ?? ''}
                  error={missingWarrantyIds.includes(detail.IdWarranty)}
                  disabled={saving}
                  onChange={(event) => onValueChange(detail.IdWarranty, event.target.value)}
                  inputMode="decimal"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: '0.01',
                    },
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={desktopTableContainerSx}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={stickyHeaderCellSx}>Fila</TableCell>
            <TableCell sx={stickyHeaderCellSx}>Subdivision</TableCell>
            <TableCell sx={stickyHeaderCellSx}>Address</TableCell>
            <TableCell sx={stickyHeaderCellSx}>Observation</TableCell>
            <TableCell sx={stickyHeaderCellSx}>Contratista</TableCell>
            <TableCell align="right" sx={stickyHeaderCellSx}>Costo warranty</TableCell>
            <TableCell align="right" sx={stickyHeaderCellSx}>Valor a procesar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={detail.IdWarranty} hover>
              <TableCell align="center">
                <Typography variant="body2" fontWeight={700}>
                  {index + 1}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {detail.SubName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{detail.Address}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {detail.Observation || 'Sin observación'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{detail.Name}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(detail.Cost)}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ minWidth: 180 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Valor"
                  type="number"
                  value={values[detail.IdWarranty] ?? ''}
                  error={missingWarrantyIds.includes(detail.IdWarranty)}
                  disabled={saving}
                  onChange={(event) => onValueChange(detail.IdWarranty, event.target.value)}
                  inputMode="decimal"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: '0.01',
                    },
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
