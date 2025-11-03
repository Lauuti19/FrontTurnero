import { useState, useCallback } from 'react';
import { planService } from '../services/planService';

export const usePlans = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);

  // Obtener todos los planes
  const getAllPlans = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const plansData = await planService.getAllPlans(token);
      setPlans(plansData.planes || []);
      setLoading(false);
      return plansData.planes || [];
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Crear un nuevo plan
  const createPlan = useCallback(async (token, planData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await planService.createPlan(token, planData);
      setLoading(false);
      
      // Recargar la lista de planes después de crear uno nuevo
      if (token) {
        await getAllPlans(token);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getAllPlans]);

  // Actualizar un plan existente
  const updatePlan = useCallback(async (token, planData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await planService.updatePlan(token, planData);
      setLoading(false);
      
      // Recargar la lista de planes después de actualizar
      if (token) {
        await getAllPlans(token);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getAllPlans]);

  // Eliminar un plan (borrado lógico)
  const deletePlan = useCallback(async (token, planId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await planService.deletePlan(token, planId);
      setLoading(false);
      
      // Actualizar la lista local eliminando el plan
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    // Estados
    loading,
    error,
    plans,
    
    // Acciones
    getAllPlans,
    createPlan,
    updatePlan,
    deletePlan,
    
    // Utilidades
    clearError: () => setError(null),
  };
};  