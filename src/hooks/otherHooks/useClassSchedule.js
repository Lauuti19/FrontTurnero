import { useState, useEffect, useCallback } from 'react';
import { classService } from '../../services';

export const useClassSchedule = ({ userId, adminMode = false, getToken }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formatear fecha para la API (YYYY-MM-DD) con JavaScript nativo
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDate(currentDate);

  // En useClassSchedule.js
const fetchClasses = useCallback(async () => {
  const token = getToken();
  if (!token) {
    setError('No se pudo obtener el token de autenticación');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    let classesData;

    if (adminMode) {
      classesData = await classService.getAllClasses(token, formattedDate);
    } else if (userId) {
      classesData = await classService.getClassesByUser(token, userId, formattedDate);
    } else {
      classesData = await classService.getAllClasses(token, formattedDate);
    }

    // Normalizar respuesta
    const normalized = Array.isArray(classesData)
      ? classesData
      : classesData.classes || classesData.clases || [];

    setClasses(normalized);
  } catch (err) {
    console.error('Error fetching classes:', err);
    setError(err.message || 'Error al cargar las clases');
  } finally {
    setLoading(false);
  }
}, [userId, adminMode, getToken, formattedDate]);

  // Navegación entre días
  const handlePreviousDay = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  // Calcular porcentaje de capacidad
  const getCapacityPercentage = useCallback((disponibles, total) => {
    if (!total || total === 0) return 0;
    const used = total - disponibles;
    return Math.round((used / total) * 100);
  }, []);

  // Obtener color según la capacidad
  const getCapacityColor = useCallback((percentage) => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 70) return '#f59e0b';
    if (percentage >= 50) return '#eab308';
    return '#22c55e';
  }, []);

  // Verificar si un usuario está registrado en una clase
  const checkUserRegistration = useCallback(async (classId, classType) => {
    if (!userId) return false;
    const token = getToken();
    if (!token) return false;

    try {
      const result = await classService.checkUserRegistration(
        token,
        { classId, classType, userId, fecha: formattedDate },
        adminMode
      );
      return result.isRegistered;
    } catch (err) {
      console.warn('Error checking registration:', err);
      return false;
    }
  }, [userId, formattedDate, adminMode, getToken]);

  // Registrar usuario a clase
  const registerToClass = useCallback(async (classId, classType, specialClassOriginalId = null) => {
    const token = getToken();
    if (!token) throw new Error('No se pudo obtener el token');

    const registrationData = { classId, classType, userId, fecha: formattedDate };
    if (specialClassOriginalId) registrationData.specialClassOriginalId = specialClassOriginalId;

    try {
      await classService.registerToClass(token, registrationData);
      await fetchClasses();
    } catch (err) {
      throw new Error(err.message || 'Error al registrar en la clase');
    }
  }, [userId, formattedDate, getToken, fetchClasses]);

  // Desinscribir usuario de clase
  const unregisterFromClass = useCallback(async (classId, classType, specialClassOriginalId = null) => {
    const token = getToken();
    if (!token) throw new Error('No se pudo obtener el token');

    const registrationData = { classId, classType, userId, fecha: formattedDate };
    if (specialClassOriginalId) registrationData.specialClassOriginalId = specialClassOriginalId;

    try {
      if (adminMode) {
        await classService.unregisterFromClassNoCredits(token, registrationData);
      } else {
        await classService.unregisterFromClass(token, registrationData);
      }
      await fetchClasses();
    } catch (err) {
      throw new Error(err.message || 'Error al desinscribir de la clase');
    }
  }, [userId, formattedDate, adminMode, getToken, fetchClasses]);

  // Obtener usuarios registrados en una clase
  const getClassUsers = useCallback(async (classId, classType) => {
    const token = getToken();
    if (!token) throw new Error('No se pudo obtener el token');

    try {
      const result = await classService.getUsersByClassAndDate(token, classId, classType, formattedDate);
      return Array.isArray(result) ? result : result.users || result.usuarios || [];
    } catch (err) {
      throw new Error(err.message || 'Error al obtener los usuarios de la clase');
    }
  }, [formattedDate, getToken]);

  // Filtrar clases por disciplina
  const filterClassesByDiscipline = useCallback((discipline) => {
    if (!discipline) return classes;
    return classes.filter(clase => clase.disciplina?.toLowerCase().includes(discipline.toLowerCase()));
  }, [classes]);

  // Agrupar clases por hora
  const groupClassesByTime = useCallback(() => {
    const grouped = {};
    classes.forEach(clase => {
      const time = clase.hora;
      if (!grouped[time]) grouped[time] = [];
      grouped[time].push(clase);
    });
    return grouped;
  }, [classes]);

  // Estadísticas de clases
  const getClassStatistics = useCallback(() => {
    const totalClasses = classes.length;
    const totalCapacity = classes.reduce((sum, clase) => sum + (clase.total || 0), 0);
    const totalAvailable = classes.reduce((sum, clase) => sum + (clase.disponibles || 0), 0);
    const totalRegistered = totalCapacity - totalAvailable;
    const disciplines = [...new Set(classes.map(clase => clase.disciplina))];

    return {
      totalClasses,
      totalCapacity,
      totalAvailable,
      totalRegistered,
      disciplines: disciplines.length,
      occupancyRate: totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0
    };
  }, [classes]);

  // Formatear fecha para mostrar (DD/MM/YYYY)
  const getFormattedDisplayDate = useCallback(() => {
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
  }, [currentDate]);

  // Obtener nombre del día de la semana
  const getDayName = useCallback(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[currentDate.getDay()];
  }, [currentDate]);

  // Cargar clases al montar o cambiar fecha
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    currentDate,
    classes,
    loading,
    error,
    formattedDate,
    handlePreviousDay,
    handleNextDay,
    handleToday,
    refetch: fetchClasses,
    registerToClass,
    unregisterFromClass,
    getClassUsers,
    checkUserRegistration,
    getCapacityPercentage,
    getCapacityColor,
    filterClassesByDiscipline,
    groupClassesByTime,
    getClassStatistics,
    setCurrentDate,
    setClasses,
    clearError: () => setError(null),
    // Funciones adicionales para formateo
    getFormattedDisplayDate,
    getDayName,
  };
};