import { fetchWithAuth } from './api';

// Helper para construir query strings
const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const classService = {
  /**
   * Obtener todas las clases para una fecha
   */
  getAllClasses: async (token, fecha) => {
    const query = buildQueryString({ fecha });
    return await fetchWithAuth(`/classes/all?${query}`, token);
  },

  /**
   * Obtener clases de un usuario en una fecha (con verificación de créditos)
   */
  getClassesByUser: async (token, userId, fecha) => {
    const query = buildQueryString({ userId, fecha });
    return await fetchWithAuth(`/classes/by-user?${query}`, token);
  },

  /**
   * Obtener clases de un usuario en una fecha (SIN verificación de créditos)
   */
  getClassesByUserNoCredits: async (token, userId, fecha) => {
    const query = buildQueryString({ userId, fecha });
    return await fetchWithAuth(`/classes/by-user-no-credits?${query}`, token);
  },

  /**
   * Registrar usuario a clase
   */
  registerToClass: async (token, registrationData) => {
    return await fetchWithAuth('/classes/register', token, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  /**
   * Desinscribir usuario de clase
   */
  unregisterFromClass: async (token, registrationData) => {
    return await fetchWithAuth('/classes/unregister', token, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  /**
   * Obtener usuarios anotados en una clase
   */
  getUsersByClassAndDate: async (token, classId, classType, fecha) => {
    const query = buildQueryString({ classId, classType, fecha });
    return await fetchWithAuth(`/classes/users-by-class?${query}`, token);
  },

  /**
   * Crear clase
   */
  createClass: async (token, classData) => {
    return await fetchWithAuth('/classes/create', token, {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  /**
   * Obtener clases por día de la semana
   */
  getClassesByDay: async (token, id_dia) => {
    const query = buildQueryString({ id_dia });
    return await fetchWithAuth(`/classes/by-day?${query}`, token);
  },

  /**
   * Actualizar clase
   */
  updateClass: async (token, classId, classData) => {
  return await fetchWithAuth('/classes/update', token, {
    method: 'PUT',
    body: JSON.stringify({ id_clase: classId, ...classData }),
  });
  },


  /**
   * Eliminar clase (borrado lógico)
   */
  deleteClass: async (token, classId) => {
    return await fetchWithAuth('/classes/delete', token, {
      method: 'PUT',
      body: JSON.stringify({ classId }),
    });
  },

  /**
   * Actualizar asistencia
   */
  updateAttendance: async (token, attendanceData) => {
    return await fetchWithAuth('/classes/update-attendance', token, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    });
  },

  /**
   * Verificar asistencia por QR
   */
  checkAttendanceQR: async (token, userId) => {
    return await fetchWithAuth('/classes/check', token, {
      method: 'POST',
      body: JSON.stringify({ id_usuario: userId }),
    });
  },

  /**
   * Registrar asistencia individual
   */
  registerIndividualAttendance: async (token, attendanceData) => {
    return await fetchWithAuth('/classes/register-attendance', token, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    });
  },

  /**
   * Verificar si usuario está registrado en una clase
   */
  checkUserRegistration: async (token, { classId, classType, userId, fecha }, isStaff = false) => {
    try {
      // Usar endpoint según el rol
      const userClasses = isStaff
        ? await classService.getClassesByUserNoCredits(token, userId, fecha)
        : await classService.getClassesByUser(token, userId, fecha);

      const classesArray = Array.isArray(userClasses) ? userClasses : [];

      // Buscar si está registrado en la clase específica
      const isRegistered = classesArray.some(clase => {
        if (classType === 'especial') {
          return clase.id_original === classId || clase.id_clase === classId;
        } else {
          return clase.id_clase === classId;
        }
      });

      return { isRegistered };
    } catch (error) {
      console.warn("Error verificando registro:", error);
      return { isRegistered: false };
    }
  },
};