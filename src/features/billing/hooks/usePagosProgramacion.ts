import { useState, useCallback, useEffect } from 'react';
import type {
  PagosProgramacionResumen,
  PagosProgramacionDetalle,
  PagosProgramacionWeekRange,
} from '../interfaces/pagosProgramacion.interfaces';
import { PagosProgramacionService } from '../services/pagosProgramacion.service';
import { getCurrentWeekRange } from '../utils/payroll.utils';

const getDefaultRange = (): PagosProgramacionWeekRange => {
  const { ini, final } = getCurrentWeekRange();
  return { ini, fin: final };
};

export const usePagosProgramacionSemana = (initialRange?: PagosProgramacionWeekRange) => {
  const [range, setRange] = useState<PagosProgramacionWeekRange>(
    initialRange ?? getDefaultRange()
  );
  const [data, setData] = useState<PagosProgramacionResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (r: PagosProgramacionWeekRange) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PagosProgramacionService.getWeekSummary(r);
      setData(result);
    } catch (err) {
      setError(err as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [fetchData, range]);

  const refresh = useCallback(() => fetchData(range), [fetchData, range]);

  return { data, loading, error, range, setRange, refresh };
};

export const usePagosProgramacionDetalle = () => {
  const [detalle, setDetalle] = useState<PagosProgramacionDetalle[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetalle = useCallback(
    async (userId: number, range: PagosProgramacionWeekRange) => {
      setLoading(true);
      setError(null);
      try {
        const result = await PagosProgramacionService.getUserDetail(userId, range);
        setDetalle(result);
      } catch (err) {
        setError(err as Error);
        setDetalle(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setDetalle(null);
    setError(null);
  }, []);

  return { detalle, loading, error, fetchDetalle, clear };
};
