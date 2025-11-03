// hooks/useExercises.js
import { useState, useCallback } from 'react';
import { exerciseService } from '../services';

export const useExercises = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exercises, setExercises] = useState([]);

  // Obtener todos los ejercicios
  const getAllExercises = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const exercisesData = await exerciseService.getAllExercises(token);
      setExercises(exercisesData);
      setLoading(false);
      return exercisesData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Buscar ejercicios por nombre
  const searchExercisesByName = useCallback(async (token, name) => {
    setLoading(true);
    setError(null);
    try {
      const results = await exerciseService.searchExercisesByName(token, name);
      setLoading(false);
      return results;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Crear ejercicio
  const createExercise = useCallback(async (token, exerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.createExercise(token, exerciseData);
      // Recargar ejercicios después de crear
      await getAllExercises(token);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getAllExercises]);

  // Actualizar ejercicio
  const updateExercise = useCallback(async (token, exerciseData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.updateExercise(token, exerciseData);
      // Recargar ejercicios después de actualizar
      await getAllExercises(token);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getAllExercises]);

  // Eliminar ejercicio
  const deleteExercise = useCallback(async (token, id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await exerciseService.deleteExercise(token, id);
      // Recargar ejercicios después de eliminar
      await getAllExercises(token);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getAllExercises]);

  return {
    // Estados
    loading,
    error,
    exercises,
    
    // Acciones
    getAllExercises,
    searchExercisesByName,
    createExercise,
    updateExercise,
    deleteExercise,
    
    // Utilidades
    clearError: () => setError(null),
    refetch: (token) => getAllExercises(token),
  };
};