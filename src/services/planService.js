import { fetchWithAuth } from './api';

export const planService = {
  // Crear un nuevo plan
  createPlan: async (token, planData) => {
    return await fetchWithAuth('/planes/create', token, {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  },

  // Obtener todos los planes
  getPlanes: async (token) => {
    return await fetchWithAuth('/planes', token);
  },

  // Actualizar un plan
  updatePlan: async (token, id, planData) => {
    return await fetchWithAuth(`/planes/update/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(planData)
    });
  },

  // Eliminar un plan
  deletePlan: async (token, id) => {
    return await fetchWithAuth(`/planes/delete/${id}`, token, {
      method: 'DELETE'
    });
  }
};