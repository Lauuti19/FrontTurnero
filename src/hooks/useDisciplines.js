// hooks/useDisciplines.js
import { useState, useCallback } from 'react';
import { disciplineService } from '../services';

export const useDisciplines = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [disciplines, setDisciplines] = useState([]);

  // Obtener todas las disciplinas
  const getDisciplinas = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const disciplinas = await disciplineService.getDisciplinas(token);
      setDisciplines(disciplinas);
      setLoading(false);
      return disciplinas;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Crear disciplina
  const createDiscipline = useCallback(async (token, name) => {
    setLoading(true);
    setError(null);
    try {
      const result = await disciplineService.createDiscipline(token, name);
      // Recargar disciplinas después de crear
      await getDisciplinas(token);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getDisciplinas]);

  // Eliminar disciplina
  const deleteDiscipline = useCallback(async (token, disciplineId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await disciplineService.deleteDiscipline(token, disciplineId);
      // Recargar disciplinas después de eliminar
      await getDisciplinas(token);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getDisciplinas]);
  
  const updateDiscipline = useCallback(async (token, disciplineId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await disciplineService.updateDiscipline(token, disciplineId);
      // Recargar disciplinas después de eliminar
      await getDisciplinas(token);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getDisciplinas]);

  return {
    // Estados
    loading,
    error,
    disciplines,
    
    // Acciones
    getDisciplinas,
    createDiscipline,
    deleteDiscipline,
    updateDiscipline,
    
    // Utilidades
    clearError: () => setError(null),
    refetch: (token) => getDisciplinas(token),
  };
};