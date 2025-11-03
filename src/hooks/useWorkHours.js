import { useState, useCallback } from 'react';
import { workHoursService, liquidationService } from '../services';

export const useWorkHours = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workHours, setWorkHours] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [teacherHours, setTeacherHours] = useState([]);
  const [preLiquidation, setPreLiquidation] = useState(null);
  const [liquidations, setLiquidations] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [checkStatus, setCheckStatus] = useState(null);

  // Horas Pactadas
  const createWorkHours = useCallback(async (token, workHoursData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.createWorkHours(token, workHoursData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getWorkHours = useCallback(async (token, userId = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getWorkHours(token, userId);
      const hours = result.horas || [];
      setWorkHours(hours);
      setLoading(false);
      return hours;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateWorkHours = useCallback(async (token, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.updateWorkHours(token, updateData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const deleteWorkHours = useCallback(async (token, workHoursId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.deleteWorkHours(token, workHoursId);
      setLoading(false);
      
      // Actualizar lista local
      setWorkHours(prev => prev.filter(hours => hours.id_pactado !== workHoursId));
      
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Asistencias y Checks
  const registerCheckIn = useCallback(async (token, checkInData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.registerCheckIn(token, checkInData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const registerCheckOut = useCallback(async (token, checkOutData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.registerCheckOut(token, checkOutData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getAttendanceStatus = useCallback(async (token, userId, date) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getAttendanceStatus(token, userId, date);
      setAttendanceStatus(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getCheckStatusDay = useCallback(async (token, userId, date) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getCheckStatusDay(token, userId, date);
      setCheckStatus(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Horas Trabajadas
  const getWorkedHours = useCallback(async (token, userId, period = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getWorkedHours(token, userId, period);
      setLoading(false);
      return result.horas_trabajadas || 0;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getWorkedHoursByRange = useCallback(async (token, userId, startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getWorkedHoursByRange(token, userId, startDate, endDate);
      setLoading(false);
      return result.horas_trabajadas || 0;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Reportes para Admin
  const getTeacherAttendances = useCallback(async (token, startDate = null, endDate = null, period = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getTeacherAttendances(token, startDate, endDate, period);
      const attendancesList = result.asistencias || [];
      setAttendances(attendancesList);
      setLoading(false);
      return attendancesList;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getTeacherWorkedHours = useCallback(async (token, startDate = null, endDate = null, period = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getTeacherWorkedHours(token, startDate, endDate, period);
      const hoursList = result.horas || [];
      setTeacherHours(hoursList);
      setLoading(false);
      return hoursList;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Liquidaciones
  const liquidateTeacher = useCallback(async (token, liquidationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.liquidateTeacher(token, liquidationData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getTeacherPreLiquidation = useCallback(async (token, userId, period) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getTeacherPreLiquidation(token, userId, period);
      setPreLiquidation(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getLiquidationsByRange = useCallback(async (token, startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await workHoursService.getLiquidationsByRange(token, startDate, endDate);
      const liquidationsList = result.liquidaciones || [];
      setLiquidations(liquidationsList);
      setLoading(false);
      return liquidationsList;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Liquidaciones Reports
  const getClosedLiquidationsByPeriod = useCallback(async (token, period) => {
    setLoading(true);
    setError(null);
    try {
      const result = await liquidationService.getClosedLiquidationsByPeriod(token, period);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getLiquidationDetailsByPeriod = useCallback(async (token, period) => {
    setLoading(true);
    setError(null);
    try {
      const result = await liquidationService.getLiquidationDetailsByPeriod(token, period);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getTeacherLiquidations = useCallback(async (token, userId, period = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await liquidationService.getTeacherLiquidations(token, userId, period);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getTeacherAttendanceSummary = useCallback(async (token, userId, period = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await liquidationService.getTeacherAttendanceSummary(token, userId, period);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const getTeacherLiquidationHistory = useCallback(async (token, userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await liquidationService.getTeacherLiquidationHistory(token, userId);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Utilidades
  const calculateWorkedHours = useCallback((checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime) return 0;
    
    const checkIn = new Date(`1970-01-01T${checkInTime}`);
    const checkOut = new Date(`1970-01-01T${checkOutTime}`);
    
    const diffMs = checkOut - checkIn;
    return Math.max(0, diffMs / (1000 * 60 * 60)); // Convertir a horas
  }, []);

  const formatTime = useCallback((timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }, []);

  const getCurrentPeriod = useCallback(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  return {
    // Estados
    loading,
    error,
    workHours,
    attendances,
    teacherHours,
    preLiquidation,
    liquidations,
    attendanceStatus,
    checkStatus,
    
    // Acciones - Horas Pactadas
    createWorkHours,
    getWorkHours,
    updateWorkHours,
    deleteWorkHours,
    
    // Acciones - Asistencias
    registerCheckIn,
    registerCheckOut,
    getAttendanceStatus,
    getCheckStatusDay,
    
    // Acciones - Horas Trabajadas
    getWorkedHours,
    getWorkedHoursByRange,
    
    // Acciones - Reportes Admin
    getTeacherAttendances,
    getTeacherWorkedHours,
    
    // Acciones - Liquidaciones
    liquidateTeacher,
    getTeacherPreLiquidation,
    getLiquidationsByRange,
    
    // Acciones - Reportes Liquidaciones
    getClosedLiquidationsByPeriod,
    getLiquidationDetailsByPeriod,
    getTeacherLiquidations,
    getTeacherAttendanceSummary,
    getTeacherLiquidationHistory,
    
    // Utilidades
    calculateWorkedHours,
    formatTime,
    getCurrentPeriod,
    clearError: () => setError(null),
    clearPreLiquidation: () => setPreLiquidation(null),
    clearAttendanceStatus: () => setAttendanceStatus(null),
  };
};