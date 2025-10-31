// services/planService.js
import { fetchWithAuth } from './api';

export const planService = {
  getPlanes: (token) => fetchWithAuth('/planes', token),

  createPlan: (token, planData) =>
    fetchWithAuth('/planes/create', token, {
      method: 'POST',
      body: JSON.stringify(planData),
    }),

  updatePlan: (token, id, planData) =>
    fetchWithAuth('/planes/update', token, {
      method: 'PUT',
      body: JSON.stringify({ id, ...planData }),
    }),

  deletePlan: (token, id) =>
    fetchWithAuth('/planes/delete', token, {
      method: 'PUT',
      body: JSON.stringify({ id }),
    }),
};
