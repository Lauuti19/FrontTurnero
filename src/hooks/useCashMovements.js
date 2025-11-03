import { useState, useCallback } from 'react';
import { cashMovementsService } from '../services';

export const useCashMovements = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movements, setMovements] = useState([]);
  const [todaySummary, setTodaySummary] = useState(null);
  const [availableCash, setAvailableCash] = useState(0);
  const [paymentSummary, setPaymentSummary] = useState([]);
  const [periodTotals, setPeriodTotals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activeCashBox, setActiveCashBox] = useState(null);

  // Obtener todos los movimientos
  const getAllCashMovements = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getAllCashMovements(token);
      const movementsList = result.movements || [];
      setMovements(movementsList);
      setLoading(false);
      return movementsList;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener movimientos por rango de fechas
  const getCashMovementsByDateRange = useCallback(async (token, startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getCashMovementsByDateRange(token, startDate, endDate);
      const movementsList = result.movements || [];
      setMovements(movementsList);
      setLoading(false);
      return movementsList;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener movimientos de hoy
  const getTodayCashMovements = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getTodayCashMovements(token);
      const movementsList = result.movements || [];
      setMovements(movementsList);
      setLoading(false);
      return movementsList;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Registrar movimiento
  const registerCashMovement = useCallback(async (token, movementData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.registerCashMovement(token, movementData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener resumen de hoy
  const getTodayCashSummary = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getTodayCashSummary(token);
      setTodaySummary(result.summary);
      setLoading(false);
      return result.summary;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener efectivo disponible
  const getAvailableCash = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getAvailableCash(token);
      const cash = result.efectivo || 0;
      setAvailableCash(cash);
      setLoading(false);
      return cash;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener resumen por método de pago
  const getCashSummaryByPaymentMethod = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getCashSummaryByPaymentMethod(token);
      const summary = result.summary || [];
      setPaymentSummary(summary);
      setLoading(false);
      return summary;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Registrar egreso
  const registerCashOut = useCallback(async (token, cashOutData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.registerCashOut(token, cashOutData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener totales por periodo
  const getTotalCashByPeriod = useCallback(async (token, period) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getTotalCashByPeriod(token, period);
      const totals = result.totals || [];
      setPeriodTotals(totals);
      setLoading(false);
      return totals;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener egresos por periodo
  const getExpensesByPeriod = useCallback(async (token, period) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getExpensesByPeriod(token, period);
      const expensesList = result.egresos || [];
      setExpenses(expensesList);
      setLoading(false);
      return expensesList;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener caja activa
  const getActiveCashBox = useCallback(async (token, period = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.getActiveCashBox(token, period);
      const cashBox = result.caja && result.caja.length > 0 ? result.caja[0] : null;
      setActiveCashBox(cashBox);
      setLoading(false);
      return cashBox;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Cerrar caja mensual
  const closeMonthlyCashBox = useCallback(async (token, closingData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cashMovementsService.closeMonthlyCashBox(token, closingData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Utilidades
  const calculateDailyTotal = useCallback((movementsList = []) => {
    return movementsList.reduce((total, movement) => {
      if (movement.tipo === 'ingreso') {
        return total + (movement.monto || 0);
      } else if (movement.tipo === 'egreso') {
        return total - (movement.monto || 0);
      }
      return total;
    }, 0);
  }, []);

  const filterMovementsByType = useCallback((type, movementsList = []) => {
    return movementsList.filter(movement => movement.tipo === type);
  }, []);

  const filterMovementsByPaymentMethod = useCallback((paymentMethod, movementsList = []) => {
    return movementsList.filter(movement => movement.metodo_pago === paymentMethod);
  }, []);

  const getCurrentPeriod = useCallback(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  return {
    // Estados
    loading,
    error,
    movements,
    todaySummary,
    availableCash,
    paymentSummary,
    periodTotals,
    expenses,
    activeCashBox,
    
    // Acciones
    getAllCashMovements,
    getCashMovementsByDateRange,
    getTodayCashMovements,
    registerCashMovement,
    getTodayCashSummary,
    getAvailableCash,
    getCashSummaryByPaymentMethod,
    registerCashOut,
    getTotalCashByPeriod,
    getExpensesByPeriod,
    getActiveCashBox,
    closeMonthlyCashBox,
    
    // Utilidades
    calculateDailyTotal,
    filterMovementsByType,
    filterMovementsByPaymentMethod,
    getCurrentPeriod,
    clearError: () => setError(null),
    clearMovements: () => setMovements([]),
  };
};