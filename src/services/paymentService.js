// services/paymentService.js
import { fetchWithAuth } from './api';

// Helper para armar querystrings seguros
const qs = (params = {}) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');

export const paymentService = {
  /**
   * Trae cuotas activas de un usuario
   * GET /payments/active-fees?id_usuario=...
   * auth: token obligatorio
   */
  getActiveFees: (token, { id_usuario }) => {
    if (!id_usuario) throw new Error('id_usuario es requerido');
    const query = qs({ id_usuario });
    return fetchWithAuth(`/payments/active-fees?${query}`, token);
  },

  /**
   * Registra una nueva cuota (toma info del plan)
   * POST /payments/register-fee
   * Body: { id_usuario, id_plan, metodo_pago, pagado }
   * auth: token + role admin|profesor
   */
  registerFee: (token, { id_usuario, id_plan, metodo_pago, pagado }) => {
    if (!id_usuario || !id_plan || !metodo_pago || pagado === undefined) {
      throw new Error('Faltan campos: id_usuario, id_plan, metodo_pago, pagado');
    }
    return fetchWithAuth('/payments/register-fee', token, {
      method: 'POST',
      body: JSON.stringify({
        id_usuario: Number(id_usuario),
        id_plan: Number(id_plan),
        metodo_pago: String(metodo_pago),
        pagado: Boolean(pagado),
      }),
    });
  },

  /**
   * Paga una cuota pendiente
   * POST /payments/pay-fee
   * Body: { id_cuota, metodo_pago }
   * auth: token + role admin|profesor
   */
  payFee: (token, { id_cuota, metodo_pago }) => {
    if (!id_cuota || !metodo_pago) {
      throw new Error('Faltan campos: id_cuota, metodo_pago');
    }
    return fetchWithAuth('/payments/pay-fee', token, {
      method: 'POST',
      body: JSON.stringify({
        id_cuota: Number(id_cuota),
        metodo_pago: String(metodo_pago),
      }),
    });
  },
};

export default paymentService;
