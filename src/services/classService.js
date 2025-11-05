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
  getAllClasses: async (token, fecha) => {
    const query = buildQueryString({ fecha });
    return await fetchWithAuth(`/classes/all?${query}`, token);
  },

  getClassesByUser: async (token, userId, fecha) => {
    const query = buildQueryString({ userId, fecha });
    return await fetchWithAuth(`/classes/by-user?${query}`, token);
  },

  getClassesByUserNoCredits: async (token, userId, fecha) => {
    const query = buildQueryString({ userId, fecha });
    return await fetchWithAuth(`/classes/by-user-no-credits?${query}`, token);
  },

  registerToClass: async (token, registrationData) => {
    return await fetchWithAuth('/classes/register', token, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  unregisterFromClass: async (token, registrationData) => {
    return await fetchWithAuth('/classes/unregister', token, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  unregisterFromClassNoCredits: async (token, registrationData) => {
    return await fetchWithAuth('/classes/unregister-no-credits', token, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  // ✅ CORREGIDO - getUsersInClass funcionando
  getUsersInClass: async (token, classId, classType, fecha) => {
    const query = buildQueryString({ classId, classType, fecha });
    return await fetchWithAuth(`/classes/users-by-class?${query}`, token);
  },

  createClass: async (token, classData) => {
    return await fetchWithAuth('/classes/create', token, {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  getClassesByDay: async (token, id_dia) => {
    const query = buildQueryString({ id_dia });
    return await fetchWithAuth(`/classes/by-day?${query}`, token);
  },

  updateClass: async (token, classId, classData) => {
    return await fetchWithAuth('/classes/update', token, {
      method: 'PUT',
      body: JSON.stringify({ id_clase: classId, ...classData }),
    });
  },

  deleteClass: async (token, classId) => {
    return await fetchWithAuth('/classes/delete', token, {
      method: 'PUT',
      body: JSON.stringify({ classId }),
    });
  },

  updateAttendance: async (token, attendanceData) => {
    return await fetchWithAuth('/classes/update-attendance', token, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    });
  },

  checkAttendanceQR: async (token, userId) => {
    return await fetchWithAuth('/classes/check', token, {
      method: 'POST',
      body: JSON.stringify({ id_usuario: userId }),
    });
  },

  registerIndividualAttendance: async (token, attendanceData) => {
    return await fetchWithAuth('/classes/register-attendance', token, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    });
  },

  checkUserRegistration: async (token, { classId, classType, userId, fecha }, isStaff = false) => {
    try {
      const userClasses = isStaff
        ? await classService.getClassesByUserNoCredits(token, userId, fecha)
        : await classService.getClassesByUser(token, userId, fecha);

      const classesArray = Array.isArray(userClasses) ? userClasses : [];

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