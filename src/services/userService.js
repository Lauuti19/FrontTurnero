// services/userService.js
import { fetchWithAuth } from "./api";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const userService = {
  /**
   * Buscar usuarios por nombre
   */
  searchByName: async (token, nombre = '') => {
    const query = buildQueryString({ nombre });
    return await fetchWithAuth(`/usuarios/buscar?${query}`, token);
  },

  /**
   * Obtener información completa de un usuario
   */
  getUserFullInfo: async (token, userId) => {
    return await fetchWithAuth(`/usuarios/${userId}`, token);
  },

  /**
   * Actualizar información del usuario
   */
  updateUserInfo: async (token, userData) => {
    return await fetchWithAuth('/usuarios/update', token, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Obtener profesores y administradores
   */
  getProfesAndAdmins: async (token) => {
    return await fetchWithAuth('/usuarios/profes-admins/buscar', token);
  },

  /**
   * Obtener administradores
   */
  getAdmins: async (token) => {
    return await fetchWithAuth('/usuarios/admins/buscar', token);
  },

  /**
   * Obtener datos completos del usuario (combinación de endpoints)
   */
  getFullUserData: async (token, userId) => {
    try {
      // Obtener perfil básico
      const perfil = await fetchWithAuth('/auth/perfil', token);
      
      // Obtener información extendida del usuario
      const userInfo = await userService.getUserFullInfo(token, userId);

      // Combinar datos
      const combinedData = {
        // Datos del perfil
        ...perfil.usuario,
        // Datos extendidos del usuario
        ...userInfo.datos_usuario,
        // Información de cuota si existe
        cuota: userInfo.cuota || null,
      };

      return combinedData;
    } catch (error) {
      console.error('Error obteniendo datos completos del usuario:', error);
      throw error;
    }
  },
};
