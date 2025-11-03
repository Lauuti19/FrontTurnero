// services/authService.js
import { fetchWithAuth } from './api';

export const authService = {
  /**
   * Registrar cliente (usuario normal)
   */
   registerClient: async (userData) => {
    // ✅ Asegurar que la estructura sea la correcta
    const registrationData = {
      nombre: userData.nombre,
      email: userData.email,
      dni: userData.dni,
      celular: userData.celular,
      password: userData.password
    };

    console.log('📝 Datos de registro enviados:', registrationData);

    return await fetchWithAuth('/auth/register-user', null, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },
   registerUser: async (token, userData) => {
    return await fetchWithAuth('/auth/register', token, {
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