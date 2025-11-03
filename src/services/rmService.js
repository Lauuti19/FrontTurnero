import { fetchWithAuth } from './api';

export const rmService = {
  /**
   * Crear un nuevo record máximo (RM)
   */
  createRM: async (token, rmData) => {
    return await fetchWithAuth('/rm', token, {
      method: 'POST',
      body: JSON.stringify(rmData),
    });
  },

  /**
   * Actualizar un record máximo existente
   */
  updateRM: async (token, rmData) => {
    return await fetchWithAuth('/rm/update', token, {
      method: 'PUT',
      body: JSON.stringify(rmData),
    });
  },

  /**
   * Obtener todos los records de un usuario
   */
  getRMsByUser: async (token, userId) => {
    return await fetchWithAuth(`/rm/user/${userId}`, token);
  },
};