import { fetchWithAuth } from './api';

export const paymentService = {
  /**
   * Obtener cuotas activas de un usuario
   */
  getActiveFees: async (token, userId) => {
    const queryParams = new URLSearchParams({ id_usuario: userId });
    return await fetchWithAuth(`/payments/active-fees?${queryParams}`, token);
  },

  /**
   * Registrar nueva cuota
   */
  registerFee: async (token, feeData) => {
    return await fetchWithAuth('/payments/register-fee', token, {
      method: 'POST',
      body: JSON.stringify(feeData),
    });
  },

  /**
   * Pagar cuota existente
   */
  payFee: async (token, paymentData) => {
    return await fetchWithAuth('/payments/pay-fee', token, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};