// services/authService.js
import { fetchWithAuth } from './api';

export const authService = {
  /**
   * Registrar cliente (usuario normal)
   */
  registerClient: async (userData) => {
    return await fetchWithAuth('/auth/register', null, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Registrar usuario (admin/profesor)
   */
  registerUser: async (token, userData) => {
    return await fetchWithAuth('/auth/register-user', token, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Login de usuario
   */
  login: async (credentials) => {
    return await fetchWithAuth('/auth/login', null, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  getProfile: async (token) => {
    return await fetchWithAuth('/auth/perfil', token);
  },

  /**
   * Actualizar contraseña
   */
  updatePassword: async (token, passwordData) => {
    return await fetchWithAuth('/auth/update-password', token, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
};