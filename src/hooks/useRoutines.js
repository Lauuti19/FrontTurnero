import { useState, useCallback } from 'react';
import { routineService } from '../services';

export const useRoutines = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRoutines, setUserRoutines] = useState([]);
  const [allRoutines, setAllRoutines] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [routineExercises, setRoutineExercises] = useState([]);

  // Crear rutina plantilla con ejercicios
  const createRoutineTemplate = useCallback(async (token, routineData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routineService.createRoutineTemplate(token, routineData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Asignar rutina a usuario
  const assignRoutineToUser = useCallback(async (token, assignmentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routineService.assignRoutineToUser(token, assignmentData);
      setLoading(false);
      
      // Recargar rutinas del usuario después de asignar
      if (token && assignmentData.id_usuario) {
        await getRoutinesByUser(token, assignmentData.id_usuario);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Desactivar rutina de usuario
  const deactivateUserRoutine = useCallback(async (token, deactivationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routineService.deactivateUserRoutine(token, deactivationData);
      setLoading(false);
      
      // Actualizar lista local
      if (deactivationData.id_usuario) {
        setUserRoutines(prev => 
          prev.filter(routine => 
            !(routine.id_rutina === deactivationData.id_rutina && 
              routine.id_usuario === deactivationData.id_usuario)
          )
        );
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener rutinas activas de un usuario
  const getRoutinesByUser = useCallback(async (token, userId) => {
    setLoading(true);
    setError(null);
    try {
      const routines = await routineService.getRoutinesByUser(token, userId);
      setUserRoutines(routines || []);
      setLoading(false);
      return routines || [];
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener detalle completo de una rutina
  const getRoutineDetail = useCallback(async (token, routineId) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await routineService.getRoutineDetail(token, routineId);
      setCurrentRoutine(detail);
      setLoading(false);
      return detail;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener ejercicios de una rutina
  const getRoutineExercises = useCallback(async (token, routineId) => {
    setLoading(true);
    setError(null);
    try {
      const exercises = await routineService.getRoutineExercises(token, routineId);
      setRoutineExercises(exercises || []);
      setLoading(false);
      return exercises || [];
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener todas las rutinas plantilla
  const getAllRoutines = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const routines = await routineService.getAllRoutines(token);
      setAllRoutines(routines || []);
      setLoading(false);
      return routines || [];
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Activar/desactivar rutina
  const setRoutineActive = useCallback(async (token, routineId, active) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routineService.setRoutineActive(token, routineId, active);
      setLoading(false);
      
      // Actualizar lista local
      setAllRoutines(prev => 
        prev.map(routine => 
          routine.id_rutina === routineId 
            ? { ...routine, activa: active }
            : routine
        )
      );
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Agregar ejercicio a rutina
  const addExerciseToRoutine = useCallback(async (token, routineId, exerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routineService.addExerciseToRoutine(token, routineId, exerciseData);
      setLoading(false);
      
      // Recargar ejercicios de la rutina
      await getRoutineExercises(token, routineId);
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getRoutineExercises]);

  // Quitar ejercicio de rutina
  const removeExerciseFromRoutine = useCallback(async (token, routineId, exerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routineService.removeExerciseFromRoutine(token, routineId, exerciseData);
      setLoading(false);
      
      // Recargar ejercicios de la rutina
      await getRoutineExercises(token, routineId);
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getRoutineExercises]);

  return {
    // Estados
    loading,
    error,
    userRoutines,
    allRoutines,
    currentRoutine,
    routineExercises,
    
    // Acciones
    createRoutineTemplate,
    assignRoutineToUser,
    deactivateUserRoutine,
    getRoutinesByUser,
    getRoutineDetail,
    getRoutineExercises,
    getAllRoutines,
    setRoutineActive,
    addExerciseToRoutine,
    removeExerciseFromRoutine,
    
    // Utilidades
    clearError: () => setError(null),
    clearCurrentRoutine: () => setCurrentRoutine(null),
    clearRoutineExercises: () => setRoutineExercises([]),
  };
};