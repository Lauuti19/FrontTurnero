import { fetchWithAuth } from './api';

export const cashMovementsService = {
  /**
   * Obtener todos los movimientos de caja
   */
  getAllCashMovements: async (token) => {
    return await fetchWithAuth('/cash-movements/all', token);
  },

  /**
   * Obtener movimientos por rango de fechas
   */
  getCashMovementsByDateRange: async (token, startDate, endDate) => {
    const queryParams = new URLSearchParams({ start_date: startDate, end_date: endDate });
    return await fetchWithAuth(`/cash-movements/by-date-range?${queryParams}`, token);
  },

  /**
   * Obtener movimientos de hoy
   */
  getTodayCashMovements: async (token) => {
    return await fetchWithAuth('/cash-movements/today', token);
  },

  /**
   * Registrar movimiento de caja
   */
  registerCashMovement: async (token, movementData) => {
    return await fetchWithAuth('/cash-movements/register', token, {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
  },

  /**
   * Obtener resumen de caja de hoy
   */
  getTodayCashSummary: async (token) => {
    return await fetchWithAuth('/cash-movements/summary/today', token);
  },

  /**
   * Obtener efectivo disponible
   */
  getAvailableCash: async (token) => {
    return await fetchWithAuth('/cash-movements/summary/efectivo', token);
  },

  /**
   * Obtener resumen por método de pago
   */
  getCashSummaryByPaymentMethod: async (token) => {
    return await fetchWithAuth('/cash-movements/summary/by-payment', token);
  },

  /**
   * Registrar egreso
   */
  registerCashOut: async (token, cashOutData) => {
    return await fetchWithAuth('/cash-movements/egreso', token, {
      method: 'POST',
      body: JSON.stringify(cashOutData),
    });
  },

  /**
   * Obtener totales por periodo
   */
  getTotalCashByPeriod: async (token, period) => {
    const queryParams = new URLSearchParams({ periodo: period });
    return await fetchWithAuth(`/cash-movements/summary/by-period?${queryParams}`, token);
  },

  /**
   * Obtener egresos por periodo
   */
  getExpensesByPeriod: async (token, period) => {
    const queryParams = new URLSearchParams({ periodo: period });
    return await fetchWithAuth(`/cash-movements/egresos/by-period?${queryParams}`, token);
  },

  /**
   * Obtener caja activa
   */
  getActiveCashBox: async (token, period = null) => {
    const queryParams = new URLSearchParams();
    if (period) queryParams.append('periodo', period);
    return await fetchWithAuth(`/cash-movements/caja/activa?${queryParams}`, token);
  },

  /**
   * Cerrar caja mensual
   */
  closeMonthlyCashBox: async (token, closingData) => {
    return await fetchWithAuth('/cash-movements/caja/cerrar', token, {
      method: 'POST',
      body: JSON.stringify(closingData),
    });
  },
};