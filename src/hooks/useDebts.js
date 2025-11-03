import { useState, useCallback } from 'react';
import { debtService } from '../services';

export const useDebts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allDebts, setAllDebts] = useState([]);
  const [userDebts, setUserDebts] = useState([]);
  const [debtSummary, setDebtSummary] = useState(null);
  const [userMovements, setUserMovements] = useState([]);

  // Obtener todas las deudas (para admin/profesor)
  const getAllDebts = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await debtService.getAllDebts(token);
      const debts = result.deudas || [];
      setAllDebts(debts);
      setLoading(false);
      return debts;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener deudas de un usuario específico
  const getUserDebts = useCallback(async (token, userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await debtService.getUserDebts(token, userId);
      const debts = result.deudas || [];
      setUserDebts(debts);
      setLoading(false);
      return debts;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener resumen de deudas de un usuario
  const getUserDebtSummary = useCallback(async (token, userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await debtService.getUserDebtSummary(token, userId);
      const summary = result.resumen || {
        total_deudas: 0,
        monto_total_deuda: 0,
        deudas_vencidas: 0,
        monto_vencido: 0,
        proximo_vencimiento: null,
        ultimo_vencimiento: null,
      };
      setDebtSummary(summary);
      setLoading(false);
      return summary;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener movimientos del usuario autenticado
  const getMyMovements = useCallback(async (token, months = 12) => {
    setLoading(true);
    setError(null);
    try {
      const result = await debtService.getMyMovements(token, months);
      const movements = result.movimientos || [];
      setUserMovements(movements);
      setLoading(false);
      return movements;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener deudas vencidas de un usuario
  const getOverdueDebts = useCallback((debts = []) => {
    const today = new Date();
    return debts.filter(debt => {
      if (!debt.fecha_vencimiento) return false;
      const dueDate = new Date(debt.fecha_vencimiento);
      return dueDate < today && debt.estado !== 'pagado';
    });
  }, []);

  // Obtener próximas deudas a vencer (próximos 7 días)
  const getUpcomingDebts = useCallback((debts = []) => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return debts.filter(debt => {
      if (!debt.fecha_vencimiento || debt.estado === 'pagado') return false;
      const dueDate = new Date(debt.fecha_vencimiento);
      return dueDate >= today && dueDate <= nextWeek;
    });
  }, []);

  // Calcular total de deuda
  const calculateTotalDebt = useCallback((debts = []) => {
    return debts
      .filter(debt => debt.estado !== 'pagado')
      .reduce((total, debt) => total + (debt.monto || 0), 0);
  }, []);

  return {
    // Estados
    loading,
    error,
    allDebts,
    userDebts,
    debtSummary,
    userMovements,
    
    // Acciones
    getAllDebts,
    getUserDebts,
    getUserDebtSummary,
    getMyMovements,
    
    // Utilidades
    getOverdueDebts,
    getUpcomingDebts,
    calculateTotalDebt,
    clearError: () => setError(null),
    clearUserDebts: () => setUserDebts([]),
    clearAllDebts: () => setAllDebts([]),
  };
};