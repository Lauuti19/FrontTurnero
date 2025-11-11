// hooks/useUsers.js
import { useState, useCallback } from 'react';
import { userService } from '../services';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar usuarios por nombre
  const searchByName = useCallback(async (token, nombre = '') => {
    setLoading(true);
    setError(null);
    try {
      const users = await userService.searchByName(token, nombre);
      setLoading(false);
      return users;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener información completa de usuario
  const getUserFullInfo = useCallback(async (token, userId) => {
    setLoading(true);
    setError(null);
    try {
      const userInfo = await userService.getUserFullInfo(token, userId);
      setLoading(false);
      return userInfo;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener datos completos del usuario (combinado)
  const getFullUserData = useCallback(async (token, userId) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await userService.getFullUserData(token, userId);
      setLoading(false);
      return userData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Actualizar información del usuario
  const updateUserInfo = useCallback(async (token, userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.updateUserInfo(token, userData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener profesores y administradores
  const getProfesAndAdmins = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const users = await userService.getProfesAndAdmins(token);
      setLoading(false);
      return users;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener administradores
  const getAdmins = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const admins = await userService.getAdmins(token);
      setLoading(false);
      return admins;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    // Estados
    loading,
    error,
    
    // Acciones
    searchByName,
    getUserFullInfo,
    getFullUserData,
    updateUserInfo,
    getProfesAndAdmins,
    getAdmins,
    
    // Utilidades
    clearError: () => setError(null),
  };
};