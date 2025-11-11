// services/exerciseService.js
import { fetchWithAuth } from './api';

export const exerciseService = {
  /**
   * Obtener todos los ejercicios
   */
  getExercises: async (token) => {
    return await fetchWithAuth('/exercises', token);
  },

  /**
   * Crear ejercicio
   */
  createExercise: async (token, exerciseData) => {
    return await fetchWithAuth('/exercises/create', token, {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
  },

  /**
   * Actualizar ejercicio
   */
  updateExercise: async (token, exerciseData) => {
    return await fetchWithAuth('/exercises/update', token, {
      method: 'PUT',
      body: JSON.stringify(exerciseData),
    });
  },

  /**
   * Eliminar ejercicio (borrado lógico)
   */
  deleteExercise: async (token, id) => {
    return await fetchWithAuth('/exercises/delete', token, {
      method: 'PUT',
      body: JSON.stringify({ id }),
    });
  },
};