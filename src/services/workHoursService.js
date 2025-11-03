import { fetchWithAuth } from './api';

export const workHoursService = {
  /**
   * Crear horas pactadas
   */
  createWorkHours: async (token, workHoursData) => {
    return await fetchWithAuth('/workhours/create', token, {
      method: 'POST',
      body: JSON.stringify(workHoursData),
    });
  },

  /**
   * Obtener horas pactadas
   */
  getWorkHours: async (token, userId = null) => {
    const queryParams = new URLSearchParams();
    if (userId) queryParams.append('user_id', userId);
    return await fetchWithAuth(`/workhours/list?${queryParams}`, token);
  },

  /**
   * Liquidar profesor
   */
  liquidateTeacher: async (token, liquidationData) => {
    return await fetchWithAuth('/workhours/liquidar', token, {
      method: 'POST',
      body: JSON.stringify(liquidationData),
    });
  },

  /**
   * Registrar check-in
   */
  registerCheckIn: async (token, checkInData) => {
    return await fetchWithAuth('/workhours/checkin', token, {
      method: 'POST',
      body: JSON.stringify(checkInData),
    });
  },

  /**
   * Registrar check-out
   */
  registerCheckOut: async (token, checkOutData) => {
    return await fetchWithAuth('/workhours/checkout', token, {
      method: 'POST',
      body: JSON.stringify(checkOutData),
    });
  },

  /**
   * Eliminar horas pactadas (soft delete)
   */
  deleteWorkHours: async (token, workHoursId) => {
    return await fetchWithAuth(`/workhours/delete/${workHoursId}`, token, {
      method: 'DELETE',
    });
  },

  /**
   * Actualizar horas pactadas
   */
  updateWorkHours: async (token, updateData) => {
    return await fetchWithAuth('/workhours/update', token, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Obtener horas trabajadas por periodo
   */
  getWorkedHours: async (token, userId, period = null) => {
    const queryParams = new URLSearchParams({ id_usuario: userId });
    if (period) queryParams.append('periodo', period);
    return await fetchWithAuth(`/workhours/worked-hours?${queryParams}`, token);
  },

  /**
   * Obtener horas trabajadas por rango
   */
  getWorkedHoursByRange: async (token, userId, startDate, endDate) => {
    const queryParams = new URLSearchParams({ 
      id_usuario: userId, 
      desde: startDate, 
      hasta: endDate 
    });
    return await fetchWithAuth(`/workhours/worked-hours-range?${queryParams}`, token);
  },

  /**
   * Obtener asistencias de profesores
   */
  getTeacherAttendances: async (token, startDate = null, endDate = null, period = null) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('desde', startDate);
    if (endDate) queryParams.append('hasta', endDate);
    if (period) queryParams.append('periodo', period);
    return await fetchWithAuth(`/workhours/asistencias?${queryParams}`, token);
  },

  /**
   * Obtener horas trabajadas de profesores
   */
  getTeacherWorkedHours: async (token, startDate = null, endDate = null, period = null) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('desde', startDate);
    if (endDate) queryParams.append('hasta', endDate);
    if (period) queryParams.append('periodo', period);
    return await fetchWithAuth(`/workhours/horas-profes?${queryParams}`, token);
  },

  /**
   * Obtener pre-liquidación de profesor
   */
  getTeacherPreLiquidation: async (token, userId, period) => {
    const queryParams = new URLSearchParams({ 
      id_usuario: userId, 
      periodo: period 
    });
    return await fetchWithAuth(`/workhours/pre-liquidacion?${queryParams}`, token);
  },

  /**
   * Obtener liquidaciones por rango
   */
  getLiquidationsByRange: async (token, startDate, endDate) => {
    const queryParams = new URLSearchParams({ desde: startDate, hasta: endDate });
    return await fetchWithAuth(`/workhours/liquidaciones?${queryParams}`, token);
  },

  /**
   * Obtener estado de asistencia
   */
  getAttendanceStatus: async (token, userId, date) => {
    const queryParams = new URLSearchParams({ id_usuario: userId, fecha: date });
    return await fetchWithAuth(`/workhours/status?${queryParams}`, token);
  },

  /**
   * Obtener estado de check del día
   */
  getCheckStatusDay: async (token, userId, date) => {
    const queryParams = new URLSearchParams({ id_usuario: userId, fecha: date });
    return await fetchWithAuth(`/workhours/check-status-dia?${queryParams}`, token);
  },
};