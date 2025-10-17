// services/exerciseService.js
import { fetchWithAuth } from './api';

export const exerciseService = {
  // Obtener todos los ejercicios
  getExercises: async (token = null) => {
    try {
      if (token) {
        return await fetchWithAuth('/exercises', token);
      } else {
        const res = await fetch('https://backturnero-vvk6.onrender.com/api/exercises');
        if (!res.ok) {
          throw new Error(`Error ${res.status} al obtener los ejercicios`);
        }
        return await res.json();
      }
    } catch (error) {
      console.error('Error en exerciseService.getExercises:', error);
      throw new Error(error.message || 'Error al obtener los ejercicios');
    }
  },

  // Crear un nuevo ejercicio
  createExercise: async (token, exerciseData) => {
    try {
      return await fetchWithAuth('/exercises/create', token, {
        method: 'POST',
        body: JSON.stringify(exerciseData)
      });
    } catch (error) {
      console.error('Error en exerciseService.createExercise:', error);
      throw new Error(error.message || 'Error al crear el ejercicio');
    }
  },

  // Actualizar un ejercicio
  updateExercise: async (token, id, exerciseData) => {
    try {
      return await fetchWithAuth('/exercises/update', token, {
        method: 'PUT',
        body: JSON.stringify({
          id,
          name: exerciseData.name,
          link: exerciseData.link
        })
      });
    } catch (error) {
      console.error('Error en exerciseService.updateExercise:', error);
      throw new Error(error.message || 'Error al actualizar el ejercicio');
    }
  },

  // Eliminar (desactivar) un ejercicio
  deleteExercise: async (token, id) => {
    try {
      return await fetchWithAuth('/exercises/delete', token, {
        method: 'PUT',
        body: JSON.stringify({ id })
      });
    } catch (error) {
      console.error('Error en exerciseService.deleteExercise:', error);
      throw new Error(error.message || 'Error al eliminar el ejercicio');
    }
  },

  // Reactivar un ejercicio (si tu API lo soporta)
  activateExercise: async (token, id) => {
    try {
      return await fetchWithAuth('/exercises/activate', token, {
        method: 'PUT',
        body: JSON.stringify({ id })
      });
    } catch (error) {
      console.error('Error en exerciseService.activateExercise:', error);
      throw new Error(error.message || 'Error al reactivar el ejercicio');
    }
  }
};