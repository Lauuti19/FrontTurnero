import { fetchWithAuth } from './api';

export const routineService = {
  /**
   * Crear rutina plantilla con ejercicios
   */
  createRoutineTemplate: async (token, routineData) => {
    return await fetchWithAuth('/routines/create-template', token, {
      method: 'POST',
      body: JSON.stringify(routineData),
    });
  },

  /**
   * Asignar rutina a usuario
   */
  assignRoutineToUser: async (token, assignmentData) => {
    return await fetchWithAuth('/routines/assign', token, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  /**
   * Desactivar rutina de usuario
   */
  deactivateUserRoutine: async (token, deactivationData) => {
    return await fetchWithAuth('/routines/deactivate-user', token, {
      method: 'POST',
      body: JSON.stringify(deactivationData),
    });
  },

  /**
   * Obtener rutinas activas de un usuario
   */
  getRoutinesByUser: async (token, userId) => {
    return await fetchWithAuth(`/routines/user/${userId}`, token);
  },

  /**
   * Obtener detalle completo de una rutina
   */
  getRoutineDetail: async (token, routineId) => {
    return await fetchWithAuth(`/routines/${routineId}`, token);
  },

  /**
   * Obtener ejercicios de una rutina (CORREGIDO)
   */
  getRoutineExercises: async (token, routineId) => {
    return await fetchWithAuth(`/routines/detail/${routineId}`, token);
  },

  /**
   * Obtener todas las rutinas plantilla
   */
  getAllRoutines: async (token) => {
    return await fetchWithAuth('/routines', token);
  },

  /**
   * Activar/desactivar rutina
   */
  setRoutineActive: async (token, routineId, active) => {
    return await fetchWithAuth(`/routines/${routineId}/active`, token, {
      method: 'PUT',
      body: JSON.stringify({ activa: active }),
    });
  },

  /**
   * Agregar ejercicio a rutina
   */
  addExerciseToRoutine: async (token, routineId, exerciseData) => {
    return await fetchWithAuth(`/routines/${routineId}/add-exercise`, token, {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
  },

  /**
   * Quitar ejercicio de rutina
   */
  removeExerciseFromRoutine: async (token, routineId, exerciseData) => {
    return await fetchWithAuth(`/routines/${routineId}/remove-exercise`, token, {
      method: 'DELETE',
      body: JSON.stringify(exerciseData),
    });
  },

  /**
   * Obtener rutinas para gestión (simplificado)
   */
  getRoutines: async (token) => {
    return await fetchWithAuth('/routines', token);
  },

  /**
   * Crear rutina básica (para gestión)
   */
  createRoutine: async (token, routineData) => {
    return await fetchWithAuth('/routines/create-template', token, {
      method: 'POST',
      body: JSON.stringify(routineData),
    });
  },

  /**
   * Actualizar rutina básica (para gestión)
   */
  updateRoutine: async (token, routineData) => {
    // Para rutinas, la actualización puede ser cambiar el estado activo
    if (routineData.activa !== undefined) {
      return await routineService.setRoutineActive(token, routineData.id, routineData.activa);
    }
    // Si necesitas más campos, puedes agregar un endpoint de update específico
    throw new Error('Actualización de rutina no implementada completamente');
  },

  /**
   * Eliminar rutina (borrado lógico cambiando estado)
   */
  deleteRoutine: async (token, routineId) => {
    // En lugar de eliminar, desactivamos la rutina
    return await fetchWithAuth(`/routines/${routineId}/active`, token, {
      method: 'PUT',
      body: JSON.stringify({ activa: false }),
    });
  },
};