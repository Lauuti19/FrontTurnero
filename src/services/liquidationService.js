import { fetchWithAuth } from './api';

export const liquidationService = {
  /**
   * Obtener liquidaciones cerradas por periodo
   */
  getClosedLiquidationsByPeriod: async (token, period) => {
    const queryParams = new URLSearchParams({ periodo: period });
    return await fetchWithAuth(`/liquidaciones/cerradas?${queryParams}`, token);
  },

  /**
   * Obtener detalle de liquidaciones por periodo
   */
  getLiquidationDetailsByPeriod: async (token, period) => {
    const queryParams = new URLSearchParams({ periodo: period });
    return await fetchWithAuth(`/liquidaciones/detalle?${queryParams}`, token);
  },

  /**
   * Obtener liquidaciones de profesor
   */
  getTeacherLiquidations: async (token, userId, period = null) => {
    const queryParams = new URLSearchParams({ id_usuario: userId });
    if (period) queryParams.append('periodo', period);
    return await fetchWithAuth(`/liquidaciones/profesor?${queryParams}`, token);
  },

  /**
   * Obtener resumen de asistencias de profesor
   */
  getTeacherAttendanceSummary: async (token, userId, period = null) => {
    const queryParams = new URLSearchParams({ id_usuario: userId });
    if (period) queryParams.append('periodo', period);
    return await fetchWithAuth(`/liquidaciones/profesor/resumen?${queryParams}`, token);
  },

  /**
   * Obtener historial de liquidaciones de profesor
   */
  getTeacherLiquidationHistory: async (token, userId) => {
    const queryParams = new URLSearchParams({ id_usuario: userId });
    return await fetchWithAuth(`/liquidaciones/profesor/historial?${queryParams}`, token);
  },
};