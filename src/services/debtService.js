import { fetchWithAuth } from './api';

export const debtService = {
  /**
   * Obtener todas las deudas (admin/profesor)
   */
  getAllDebts: async (token) => {
    return await fetchWithAuth('/deudas/all', token);
  },

  /**
   * Obtener deudas de un usuario específico
   */
  getUserDebts: async (token, userId) => {
    return await fetchWithAuth(`/deudas/${userId}`, token);
  },

  /**
   * Obtener resumen de deudas de un usuario
   */
  getUserDebtSummary: async (token, userId) => {
    return await fetchWithAuth(`/deudas/${userId}/resumen`, token);
  },

  /**
   * Obtener movimientos del usuario autenticado
   */
  getMyMovements: async (token, months = 12) => {
    const queryParams = new URLSearchParams({ meses: months });
    return await fetchWithAuth(`/deudas/movimientos?${queryParams}`, token);
  },
};