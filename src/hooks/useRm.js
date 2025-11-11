import { useState, useCallback } from 'react';
import { rmService } from '../services';

export const useRM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRMs, setUserRMs] = useState([]);

  // Crear un nuevo record máximo
  const createRM = useCallback(async (token, rmData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await rmService.createRM(token, rmData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Actualizar un record máximo existente
  const updateRM = useCallback(async (token, rmData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await rmService.updateRM(token, rmData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener todos los records de un usuario
  const getRMsByUser = useCallback(async (token, userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await rmService.getRMsByUser(token, userId);
      
      // Manejar diferentes formatos de respuesta
      let rmsData = [];
      if (Array.isArray(result)) {
        rmsData = result;
      } else if (result.data) {
        rmsData = result.data;
      } else if (result.message && result.data) {
        rmsData = result.data;
      }
      
      setUserRMs(rmsData);
      setLoading(false);
      return rmsData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener record específico de un ejercicio para un usuario
  const getRMByExercise = useCallback(async (token, userId, exerciseId) => {
    setLoading(true);
    setError(null);
    try {
      const allRMs = await getRMsByUser(token, userId);
      const exerciseRM = allRMs.find(rm => 
        rm.id_ejercicio === exerciseId || rm.ejercicio_id === exerciseId
      );
      setLoading(false);
      return exerciseRM || null;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getRMsByUser]);

  return {
    // Estados
    loading,
    error,
    userRMs,
    
    // Acciones
    createRM,
    updateRM,
    getRMsByUser,
    getRMByExercise,
    
    // Utilidades
    clearError: () => setError(null),
    clearUserRMs: () => setUserRMs([]),
  };
};