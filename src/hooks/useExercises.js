import { useState, useCallback } from 'react';
import { exerciseService } from '../services/exerciseService';
import { useAuth } from '../AuthContext';

export const useExercises = () => {
  const { getToken } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener todos los ejercicios
   */
  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error('Token no disponible');

      const data = await exerciseService.getExercises(token);
      setExercises(data || []);
      return data;
    } catch (err) {
      console.error('Error al obtener ejercicios:', err);
      setError(err.message || 'Error al cargar ejercicios');
      setExercises([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  /**
   * Crear un nuevo ejercicio
   */
  const createExercise = useCallback(async (exerciseData) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error('Token no disponible');

      const data = await exerciseService.createExercise(token, exerciseData);
      setExercises((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error al crear ejercicio:', err);
      setError(err.message || 'Error al crear ejercicio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  /**
   * Actualizar un ejercicio existente
   */
  const updateExercise = useCallback(async (exerciseData) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error('Token no disponible');

      const data = await exerciseService.updateExercise(token, exerciseData);
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id_ejercicio === exerciseData.id_ejercicio ? data : ex
        )
      );
      return data;
    } catch (err) {
      console.error('Error al actualizar ejercicio:', err);
      setError(err.message || 'Error al actualizar ejercicio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  /**
   * Eliminar ejercicio (borrado lógico)
   */
  const deleteExercise = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error('Token no disponible');

      await exerciseService.deleteExercise(token, id);
      setExercises((prev) => prev.filter((ex) => ex.id_ejercicio !== id));
    } catch (err) {
      console.error('Error al eliminar ejercicio:', err);
      setError(err.message || 'Error al eliminar ejercicio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  return {
    exercises,
    loading,
    error,
    fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    setExercises,
  };
};
