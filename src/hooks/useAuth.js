// hooks/useAuth.js
import { useState, useCallback } from 'react';
import { authService } from '../services';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const registerClient = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerClient(userData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const registerUser = useCallback(async (token, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerUser(token, userData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getProfile = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getProfile(token);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const updatePassword = useCallback(async (token, passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updatePassword(token, passwordData);
      setLoading(false);
      return response;
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
    login,
    registerClient,
    registerUser,
    getProfile,
    updatePassword,
    
    // Utilidades
    clearError: () => setError(null),
  };
};