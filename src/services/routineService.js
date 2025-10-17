import { fetchWithAuth } from './api';

export const routineService = {
  // Obtener rutinas de un usuario específico
  getUserRoutines: async (token, userId) => {
    try {
      return await fetchWithAuth(`/routines/user/${userId}`, token);
    } catch (error) {
      console.error('Error en routineService.getUserRoutines:', error);
      throw new Error(error.message || 'Error al obtener las rutinas del usuario');
    }
  },

  // Crear una nueva rutina
  createRoutine: async (token, routineData) => {
    try {
      return await fetchWithAuth('/routines/create', token, {
        method: 'POST',
        body: JSON.stringify(routineData)
      });
    } catch (error) {
      console.error('Error en routineService.createRoutine:', error);
      throw new Error(error.message || 'Error al crear la rutina');
    }
  },

  // Actualizar una rutina existente
  updateRoutine: async (token, routineId, routineData) => {
    try {
      return await fetchWithAuth(`/routines/update/${routineId}`, token, {
        method: 'PUT',
        body: JSON.stringify(routineData)
      });
    } catch (error) {
      console.error('Error en routineService.updateRoutine:', error);
      throw new Error(error.message || 'Error al actualizar la rutina');
    }
  },

  // Eliminar una rutina
  deleteRoutine: async (token, routineId) => {
    try {
      return await fetchWithAuth(`/routines/delete/${routineId}`, token, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error en routineService.deleteRoutine:', error);
      throw new Error(error.message || 'Error al eliminar la rutina');
    }
  },

  // Obtener todas las rutinas (para administradores)
  getAllRoutines: async (token) => {
    try {
      return await fetchWithAuth('/routines/all', token);
    } catch (error) {
      console.error('Error en routineService.getAllRoutines:', error);
      throw new Error(error.message || 'Error al obtener todas las rutinas');
    }
  },

  // Obtener rutinas por día específico
  getRoutinesByDay: async (token, userId, day) => {
    try {
      return await fetchWithAuth(`/routines/user/${userId}/day/${day}`, token);
    } catch (error) {
      console.error('Error en routineService.getRoutinesByDay:', error);
      throw new Error(error.message || 'Error al obtener las rutinas del día');
    }
  },

  // Agregar ejercicio a una rutina existente
  addExerciseToRoutine: async (token, routineId, exerciseData) => {
    try {
      return await fetchWithAuth(`/routines/${routineId}/exercises`, token, {
        method: 'POST',
        body: JSON.stringify(exerciseData)
      });
    } catch (error) {
      console.error('Error en routineService.addExerciseToRoutine:', error);
      throw new Error(error.message || 'Error al agregar ejercicio a la rutina');
    }
  },

  // Actualizar ejercicio en una rutina
  updateExerciseInRoutine: async (token, routineId, exerciseId, exerciseData) => {
    try {
      return await fetchWithAuth(`/routines/${routineId}/exercises/${exerciseId}`, token, {
        method: 'PUT',
        body: JSON.stringify(exerciseData)
      });
    } catch (error) {
      console.error('Error en routineService.updateExerciseInRoutine:', error);
      throw new Error(error.message || 'Error al actualizar el ejercicio');
    }
  },

  // Eliminar ejercicio de una rutina
  removeExerciseFromRoutine: async (token, routineId, exerciseId) => {
    try {
      return await fetchWithAuth(`/routines/${routineId}/exercises/${exerciseId}`, token, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error en routineService.removeExerciseFromRoutine:', error);
      throw new Error(error.message || 'Error al eliminar el ejercicio');
    }
  }
};