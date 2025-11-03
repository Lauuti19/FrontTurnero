import { useState, useCallback } from 'react';
import { classService } from '../services';

export const useClasses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las clases para una fecha
  const getAllClasses = useCallback(async (token, fecha) => {
    setLoading(true);
    setError(null);
    try {
      const classes = await classService.getAllClasses(token, fecha);
      setLoading(false);
      return classes;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener clases de un usuario
  const getClassesByUser = useCallback(async (token, userId, fecha) => {
    setLoading(true);
    setError(null);
    try {
      const classes = await classService.getClassesByUser(token, userId, fecha);
      setLoading(false);
      return classes;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener clases de un usuario sin verificación de créditos
  const getClassesByUserNoCredits = useCallback(async (token, userId, fecha) => {
    setLoading(true);
    setError(null);
    try {
      const classes = await classService.getClassesByUserNoCredits(token, userId, fecha);
      setLoading(false);
      return classes;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Registrar en clase
  const registerToClass = useCallback(async (token, registrationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.registerToClass(token, registrationData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Desinscribir de clase
  const unregisterFromClass = useCallback(async (token, registrationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.unregisterFromClass(token, registrationData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Obtener usuarios anotados
  const getUsersByClassAndDate = useCallback(async (token, classId, classType, fecha) => {
    setLoading(true);
    setError(null);
    try {
      const users = await classService.getUsersByClassAndDate(token, classId, classType, fecha);
      setLoading(false);
      return users;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Verificar registro
  const checkUserRegistration = useCallback(async (token, params, isStaff = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.checkUserRegistration(token, params, isStaff);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Crear clase
  const createClass = useCallback(async (token, classData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.createClass(token, classData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Actualizar asistencia
  const updateAttendance = useCallback(async (token, attendanceData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.updateAttendance(token, attendanceData);
      setLoading(false);
      return result;
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
    getAllClasses,
    getClassesByUser,
    getClassesByUserNoCredits,
    registerToClass,
    unregisterFromClass,
    getUsersByClassAndDate,
    checkUserRegistration,
    createClass,
    updateAttendance,
    
    // Utilidades
    clearError: () => setError(null),
  };
};