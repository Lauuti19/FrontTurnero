// services/planService.js
import { fetchWithAuth } from './api';

export const planService = {
  getAllPlans: async (token) => {
    const response = await fetchWithAuth('/planes', token);
    // El backend devuelve { planes: [...] }, así que extraemos el array
    return response.planes || response.data || response;
  },
  
  createPlan: async (token, planData) => {
    const response = await fetchWithAuth('/planes/create', token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
    return response;
  },
  
  updatePlan: async (token, planData) => {
    const response = await fetchWithAuth('/planes/update', token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
    return response;
  },
  
  deletePlan: async (token, planId) => {
    const response = await fetchWithAuth('/planes/delete', token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId }),
    });
    return response;
  },
};