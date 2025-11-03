import { useState, useCallback } from 'react';
import { paymentService } from '../services';

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFees, setActiveFees] = useState([]);

  // Obtener cuotas activas de un usuario
  const getActiveFees = useCallback(async (token, userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.getActiveFees(token, userId);
      const fees = result.cuotas || [];
      setActiveFees(fees);
      setLoading(false);
      return fees;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Registrar nueva cuota
  const registerFee = useCallback(async (token, feeData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.registerFee(token, feeData);
      setLoading(false);
      
      // Recargar cuotas activas si el usuario está en el contexto
      if (token && feeData.id_usuario) {
        await getActiveFees(token, feeData.id_usuario);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getActiveFees]);

  // Pagar cuota existente
  const payFee = useCallback(async (token, paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.payFee(token, paymentData);
      setLoading(false);
      
      // Actualizar lista local - marcar como pagada
      setActiveFees(prev => 
        prev.map(fee => 
          fee.id_cuota === paymentData.id_cuota 
            ? { ...fee, pagado: true, metodo_pago: paymentData.metodo_pago }
            : fee
        )
      );
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener cuotas pendientes
  const getPendingFees = useCallback(() => {
    return activeFees.filter(fee => !fee.pagado);
  }, [activeFees]);

  // Obtener cuotas pagadas
  const getPaidFees = useCallback(() => {
    return activeFees.filter(fee => fee.pagado);
  }, [activeFees]);

  return {
    // Estados
    loading,
    error,
    activeFees,
    
    // Acciones
    getActiveFees,
    registerFee,
    payFee,
    
    // Utilidades
    getPendingFees,
    getPaidFees,
    clearError: () => setError(null),
    clearActiveFees: () => setActiveFees([]),
  };
};