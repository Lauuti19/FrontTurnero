// hooks/useUserCredits.js
import { useCallback } from 'react';
import { useAuth } from '../AuthContext';

export const useUserCredits = () => {
  const { creditos, actualizarCreditos, loadingCredits, canAfford } = useAuth();

  const deductCredits = useCallback((amount = 1) => {
    // Esta función sería para uso local, la deducción real se hace en el backend
    console.log(`Se deberían deducir ${amount} créditos`);
    // En una implementación real, aquí harías la llamada API para deducir créditos
  }, []);

  return {
    creditos,
    loadingCredits,
    actualizarCreditos,
    deductCredits,
    hasSufficientCredits: canAfford,
    canAfford
  };
};