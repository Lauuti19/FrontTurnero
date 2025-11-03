import { useState, useCallback } from 'react';
import { cashActionsService } from '../services';

export const useCashActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeActions, setActiveActions] = useState([]);
  const [cashBoxes, setCashBoxes] = useState([]);
  const [profitDistribution, setProfitDistribution] = useState([]);

  // Obtener acciones activas
  const getActiveActions = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashActionsService.getActiveActions(token);
      const actions = result.acciones || [];
      setActiveActions(actions);
      setLoading(false);
      return actions;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Crear o actualizar acción de usuario
  const upsertUserAction = useCallback(async (token, actionData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashActionsService.upsertUserAction(token, actionData);
      setLoading(false);
      
      // Recargar acciones activas
      await getActiveActions(token);
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getActiveActions]);

  // Desactivar acción de usuario
  const deactivateUserAction = useCallback(async (token, deactivationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashActionsService.deactivateUserAction(token, deactivationData);
      setLoading(false);
      
      // Recargar acciones activas
      await getActiveActions(token);
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getActiveActions]);

  // Obtener distribución de ganancias
  const getProfitDistribution = useCallback(async (token, cashBoxId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashActionsService.getProfitDistributionByCashBox(token, cashBoxId);
      const distribution = result.distribucion || [];
      setProfitDistribution(distribution);
      setLoading(false);
      return distribution;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener todas las cajas mensuales
  const getAllMonthlyCashBoxes = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashActionsService.getAllMonthlyCashBoxes(token);
      const boxes = result.cajas || [];
      setCashBoxes(boxes);
      setLoading(false);
      return boxes;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener cajas mensuales con filtros
  const getMonthlyCashBoxes = useCallback(async (token, startDate = null, endDate = null, onlyActive = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashActionsService.getMonthlyCashBoxes(token, startDate, endDate, onlyActive);
      const boxes = result.cajas || [];
      setCashBoxes(boxes);
      setLoading(false);
      return boxes;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Calcular porcentaje total de acciones
  const calculateTotalPercentage = useCallback((actions = []) => {
    return actions.reduce((total, action) => total + (action.porcentaje || 0), 0);
  }, []);

  // Obtener acciones por usuario
  const getActionsByUser = useCallback((userId, actions = []) => {
    return actions.filter(action => action.id_usuario === userId);
  }, []);

  // Verificar si un usuario tiene acciones activas
  const hasActiveActions = useCallback((userId, actions = []) => {
    return actions.some(action => 
      action.id_usuario === userId && 
      action.activo === true
    );
  }, []);

  return {
    // Estados
    loading,
    error,
    activeActions,
    cashBoxes,
    profitDistribution,
    
    // Acciones
    getActiveActions,
    upsertUserAction,
    deactivateUserAction,
    getProfitDistribution,
    getAllMonthlyCashBoxes,
    getMonthlyCashBoxes,
    
    // Utilidades
    calculateTotalPercentage,
    getActionsByUser,
    hasActiveActions,
    clearError: () => setError(null),
    clearProfitDistribution: () => setProfitDistribution([]),
  };
};