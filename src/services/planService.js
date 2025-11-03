// services/planService.js
import { fetchWithAuth } from './api';

// ✅ planService.js
export const planService = {
  getAllPlans: async (token) => { // ← cambiar este nombre
    return await fetchWithAuth('/planes', token);
  },
  createPlan: async (token, planData) => {
    return await fetchWithAuth('/planes/create', token, {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },
  updatePlan: async (token, planData) => {
    return await fetchWithAuth('/planes/update', token, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  },
  deletePlan: async (token, planId) => {
    return await fetchWithAuth('/planes/delete', token, {
      method: 'PUT',
      body: JSON.stringify({ planId }),
    });
  },
};
