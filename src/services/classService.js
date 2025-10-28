// services/classService.js
import { fetchWithAuth } from './api';

export const classService = {
  // Obtener todas las clases para una fecha específica
  getClasses: async (token, fecha = null) => {
    try {
      const endpoint = fecha ? `/classes/all?fecha=${fecha}` : '/classes/all';
      const data = await fetchWithAuth(endpoint, token);
      // Asegurarnos de que devolvemos un array
      return Array.isArray(data) ? data : (data[0] || []);
    } catch (error) {
      console.error('Error en classService.getClasses:', error);
      throw new Error(error.message || 'Error al obtener las clases');
    }
  },

  
  getClassUsers: async (token, classId, fecha) => {
    try {
      const data = await fetchWithAuth(`/classes/users-by-class?classId=${classId}&fecha=${fecha}`, token);
      console.log('Datos crudos de getClassUsers:', data);
      console.log('Tipo de datos:', typeof data);
      console.log('Es array?', Array.isArray(data));
      
      let result = Array.isArray(data) ? data : (data[0] || []);
      console.log('Resultado procesado:', result);
      return result;
    } catch (error) {
      // ... manejo de error
    }
  },

  // Verificar si un usuario está registrado en una clase
  checkUserRegistration: async (token, classId, userId, fecha) => {
    try {
      const users = await classService.getClassUsers(token, classId, fecha);
      console.log('Usuarios obtenidos para verificación:', users);
      console.log('Buscando usuario ID:', userId);
      
      const isRegistered = users.some(usuario => {
        console.log('Comparando:', usuario.id_usuario, 'con', userId, 'resultado:', usuario.id_usuario === userId);
        return usuario.id_usuario === userId;
      });
      
      console.log('Resultado de verificación:', isRegistered);
      return { isRegistered };
    } catch (error) {
      console.error('Error en classService.checkUserRegistration:', error);
      throw new Error(error.message || 'Error al verificar el registro');
    }
  },

  // Inscribir usuario a una clase
  registerUserToClass: async (token, classId, userId, fecha) => {
    try {
      const result = await fetchWithAuth('/classes/register', token, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          classId, 
          fecha
        })
      });
      return result;
    } catch (error) {
      console.error('Error en classService.registerUserToClass:', error);
      throw new Error(error.message || 'Error al inscribir usuario a la clase');
    }
  },

  // Desinscribir usuario de una clase
  unregisterUserFromClass: async (token, classId, userId, fecha) => {
    try {
      const result = await fetchWithAuth('/classes/unregister', token, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          classId,
          fecha
        })
      });
      return result;
    } catch (error) {
      console.error('Error en classService.unregisterUserFromClass:', error);
      throw new Error(error.message || 'Error al desinscribir usuario de la clase');
    }
  },

  // Resto de funciones mantienen la misma lógica...
  createClass: async (token, classData) => {
    try {
      return await fetchWithAuth('/classes/create', token, {
        method: 'POST',
        body: JSON.stringify(classData)
      });
    } catch (error) {
      console.error('Error en classService.createClass:', error);
      throw new Error(error.message || 'Error al crear la clase');
    }
  },

  updateClass: async (token, id, classData) => {
    try {
      return await fetchWithAuth('/classes/update', token, {
        method: 'PUT',
        body: JSON.stringify({ 
          id_clase: id, 
          ...classData 
        })
      });
    } catch (error) {
      console.error('Error en classService.updateClass:', error);
      throw new Error(error.message || 'Error al actualizar la clase');
    }
  },

  deleteClass: async (token, id) => {
    try {
      return await fetchWithAuth('/classes/delete', token, {
        method: 'PUT',
        body: JSON.stringify({ classId: id })
      });
    } catch (error) {
      console.error('Error en classService.deleteClass:', error);
      throw new Error(error.message || 'Error al eliminar la clase');
    }
  },

  getClassesByDiscipline: async (token, disciplineId) => {
    try {
      const data = await fetchWithAuth(`/classes/discipline/${disciplineId}`, token);
      return Array.isArray(data) ? data : (data[0] || []);
    } catch (error) {
      console.error('Error en classService.getClassesByDiscipline:', error);
      throw new Error(error.message || 'Error al obtener las clases por disciplina');
    }
  },

  getClassesByUser: async (token, userId, fecha = null) => {
    try {
      const endpoint = fecha 
        ? `/classes/user-classes?userId=${userId}&fecha=${fecha}`
        : `/classes/user-classes?userId=${userId}`;
      const data = await fetchWithAuth(endpoint, token);
      return Array.isArray(data) ? data : (data[0] || []);
    } catch (error) {
      console.error('Error en classService.getClassesByUser:', error);
      throw new Error(error.message || 'Error al obtener las clases del usuario');
    }
  }
};