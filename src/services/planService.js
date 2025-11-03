// services/planService.js
import { fetchWithAuth } from './api';

export const planService = {
  /**
   * Obtener todos los planes
   */
  getPlanes: async (token) => {
    return await fetchWithAuth('/planes', token);
  },

  /**
   * Crear un nuevo plan
   */
  createPlan: async (token, planData) => {
    return await fetchWithAuth('/planes/create', token, {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },

  /**
   * Actualizar un plan existente
   */
  updatePlan: async (token, planData) => {
    return await fetchWithAuth('/planes/update', token, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  },

  /**
   * Eliminar un plan (borrado lógico)
   */
  deletePlan: async (token, planId) => {
    return await fetchWithAuth('/planes/delete', token, {
      method: 'PUT',
      body: JSON.stringify({ planId }),
    });
  },
};