// hooks/useClassOperations.js
import { useCallback } from 'react';
import { classService } from '../services/classService';

export const useClassOperations = (options = {}) => {
  const {
    getToken,
    onSuccess
  } = options;

  const createClass = useCallback(async (classData) => {
    try {
      const token = getToken?.();
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const result = await classService.createClass(token, classData);
      onSuccess?.();
      return result;
    } catch (error) {
      throw new Error(error.message || 'Error al crear la clase');
    }
  }, [getToken, onSuccess]);

  const updateClass = useCallback(async (classId, classData) => {
    try {
      const token = getToken?.();
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const result = await classService.updateClass(token, classId, classData);
      onSuccess?.();
      return result;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar la clase');
    }
  }, [getToken, onSuccess]);

  const deleteClass = useCallback(async (classId) => {
    try {
      const token = getToken?.();
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const result = await classService.deleteClass(token, classId);
      onSuccess?.();
      return result;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar la clase');
    }
  }, [getToken, onSuccess]);

  const registerUserToClass = useCallback(async ({ userId, fecha, classId, specialClassId }) => {
    try {
      const token = getToken?.();
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const result = await classService.registerUserToClass(token, { 
        userId, fecha, classId, specialClassId 
      });
      onSuccess?.();
      return result;
    } catch (error) {
      throw new Error(error.message || 'Error al inscribir usuario a la clase');
    }
  }, [getToken, onSuccess]);

  const unregisterUserFromClass = useCallback(async ({ userId, fecha, classId, specialClassId }) => {
    try {
      const token = getToken?.();
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const result = await classService.unregisterUserFromClass(token, { 
        userId, fecha, classId, specialClassId 
      });
      onSuccess?.();
      return result;
    } catch (error) {
      throw new Error(error.message || 'Error al desinscribir usuario de la clase');
    }
  }, [getToken, onSuccess]);

  return {
    createClass,
    updateClass,
    deleteClass,
    registerUserToClass,
    unregisterUserFromClass
  };
};