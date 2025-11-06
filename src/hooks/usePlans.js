// hooks/usePlans.js
import { useState, useCallback } from 'react';
import { planService } from '../services/planService';

export const usePlans = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);

  // ✅ CORREGIDO - useCallback con dependencias vacías
  const getPlanes = useCallback(async (token) => {
    if (!token) {
      const errorMsg = 'Token de autenticación requerido';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Iniciando carga de planes...');
      
      const response = await planService.getAllPlans(token);
      console.log('✅ Respuesta de planes:', response);
      
      // Manejar diferentes estructuras posibles de respuesta
      let planesArray;
      
      if (Array.isArray(response)) {
        planesArray = response;
      } else if (response && Array.isArray(response.planes)) {
        planesArray = response.planes;
      } else if (response && Array.isArray(response.data)) {
        planesArray = response.data;
      } else {
        planesArray = [];
        console.warn('⚠️ Estructura de respuesta inesperada:', response);
      }
      
      console.log('📋 Planes finales:', planesArray);
      setPlans(planesArray);
      
      return planesArray;
      
    } catch (err) {
      console.error('❌ Error en getPlanes:', err);
      const errorMsg = err.message || 'Error al cargar los planes';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // ✅ DEPENDENCIAS VACÍAS - esto evita el bucle

  const createPlan = useCallback(async (token, planData) => {
    if (!token) {
      throw new Error('Token de autenticación requerido');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await planService.createPlan(token, planData);
      // Recargar la lista después de crear
      await getPlanes(token);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Error al crear el plan';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getPlanes]); // ✅ Solo depende de getPlanes

  const updatePlan = useCallback(async (token, planData) => {
    if (!token) {
      throw new Error('Token de autenticación requerido');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await planService.updatePlan(token, planData);
      // Recargar la lista después de actualizar
      await getPlanes(token);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Error al actualizar el plan';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getPlanes]); // ✅ Solo depende de getPlanes

  const deletePlan = useCallback(async (token, planId) => {
    if (!token) {
      throw new Error('Token de autenticación requerido');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await planService.deletePlan(token, planId);
      // Actualizar lista local sin recargar
      setPlans(prev => prev.filter(plan => (plan.id_plan || plan.id) !== planId));
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Error al eliminar el plan';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // ✅ No necesita dependencias

  return {
    // Estados
    loading,
    error,
    plans,
    
    // Acciones - funciones estables
    getPlanes,
    createPlan,
    updatePlan,
    deletePlan,
    
    // Utilidades
    clearError: () => setError(null),
  };
};