import { fetchWithAuth } from './api';

export const cashActionsService = {
  /**
   * Obtener acciones activas
   */
  getActiveActions: async (token) => {
    return await fetchWithAuth('/cash-acciones/activas', token);
  },

  /**
   * Crear o actualizar acción de usuario
   */
  upsertUserAction: async (token, actionData) => {
    return await fetchWithAuth('/cash-acciones/upsert', token, {
      method: 'POST',
      body: JSON.stringify(actionData),
    });
  },

  /**
   * Desactivar acción de usuario
   */
  deactivateUserAction: async (token, deactivationData) => {
    return await fetchWithAuth('/cash-acciones/desactivar', token, {
      method: 'POST',
      body: JSON.stringify(deactivationData),
    });
  },

  /**
   * Obtener distribución de ganancias por caja
   */
  getProfitDistributionByCashBox: async (token, cashBoxId) => {
    const queryParams = new URLSearchParams({ id_caja: cashBoxId });
    return await fetchWithAuth(`/cash-acciones/distribucion/by-caja?${queryParams}`, token);
  },

  /**
   * Obtener todas las cajas mensuales
   */
  getAllMonthlyCashBoxes: async (token) => {
    return await fetchWithAuth('/cash-acciones/cajas/todas', token);
  },

  /**
   * Obtener cajas mensuales con filtros
   */
  getMonthlyCashBoxes: async (token, startDate = null, endDate = null, onlyActive = false) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('desde', startDate);
    if (endDate) queryParams.append('hasta', endDate);
    if (onlyActive) queryParams.append('solo_activas', '1');
    
    return await fetchWithAuth(`/cash-acciones/cajas?${queryParams}`, token);
  },
};