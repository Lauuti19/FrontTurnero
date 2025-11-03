// services/disciplinaService.js
import { fetchWithAuth } from './api';

export const disciplineService = {
  /**
   * Obtener todas las disciplinas
   */
  getDisciplinas: async (token) => {
    return await fetchWithAuth('/disciplinas', token);
  },

  /**
   * Eliminar disciplina (borrado lógico)
   */
  deleteDiscipline: async (token, disciplineId) => {
    return await fetchWithAuth('/disciplinas/delete', token, {
      method: 'PUT',
      body: JSON.stringify({ disciplineId }),
    });
  },

  /**
   * Crear disciplina
   */
  createDiscipline: async (token, disciplineData) => {
    return await fetchWithAuth('/disciplinas/create', token, {
      method: 'POST',
      body: JSON.stringify(disciplineData),
    });
  },

};