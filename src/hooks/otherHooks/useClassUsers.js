import { useState, useEffect, useCallback } from 'react';
import { classService } from '../../services';

export const useClassUsers = (classId, classType, fecha, getToken) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar los usuarios de la clase
  const fetchClassUsers = useCallback(async () => {
    if (!classId || !fecha || !getToken) {
      setError('Faltan parámetros requeridos');
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setError('No se pudo obtener el token de autenticación');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const usersData = await classService.getUsersByClassAndDate(
        token, 
        classId, 
        classType, 
        fecha
      );

      // Normalizar los datos de usuarios
      const normalizedUsers = Array.isArray(usersData) ? usersData : 
                             usersData.users || usersData.usuarios || [];

      setUsers(normalizedUsers);
    } catch (err) {
      console.error('Error fetching class users:', err);
      setError(err.message || 'Error al cargar los usuarios de la clase');
    } finally {
      setLoading(false);
    }
  }, [classId, classType, fecha, getToken]);

  // Función para actualizar asistencia de un usuario
  const updateUserAttendance = useCallback(async (userId, attended) => {
    const token = getToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }

    try {
      const attendanceData = {
        classId,
        classType,
        userId,
        fecha,
        attended
      };

      await classService.updateAttendance(token, attendanceData);
      
      // Actualizar el estado local del usuario
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id_usuario === userId 
            ? { ...user, asistio: attended }
            : user
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating attendance:', err);
      throw new Error(err.message || 'Error al actualizar la asistencia');
    }
  }, [classId, classType, fecha, getToken]);

  // Función para registrar asistencia individual
  const registerIndividualAttendance = useCallback(async (userId) => {
    const token = getToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }

    try {
      const attendanceData = {
        classId,
        classType,
        userId,
        fecha
      };

      await classService.registerIndividualAttendance(token, attendanceData);
      
      // Actualizar el estado local del usuario
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id_usuario === userId 
            ? { ...user, asistio: true }
            : user
        )
      );

      return true;
    } catch (err) {
      console.error('Error registering individual attendance:', err);
      throw new Error(err.message || 'Error al registrar la asistencia');
    }
  }, [classId, classType, fecha, getToken]);

  // Función para verificar asistencia por QR
  const checkAttendanceQR = useCallback(async (userId) => {
    const token = getToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }

    try {
      const result = await classService.checkAttendanceQR(token, userId);
      return result;
    } catch (err) {
      console.error('Error checking QR attendance:', err);
      throw new Error(err.message || 'Error al verificar asistencia por QR');
    }
  }, [getToken]);

  // Función para desinscribir usuario de la clase
  const unregisterUser = useCallback(async (userId) => {
    const token = getToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }

    try {
      const registrationData = {
        classId,
        classType,
        userId,
        fecha
      };

      await classService.unregisterFromClass(token, registrationData);
      
      // Remover el usuario de la lista local
      setUsers(prevUsers => 
        prevUsers.filter(user => user.id_usuario !== userId)
      );

      return true;
    } catch (err) {
      console.error('Error unregistering user:', err);
      throw new Error(err.message || 'Error al desinscribir al usuario');
    }
  }, [classId, classType, fecha, getToken]);

  // Función para normalizar datos de usuario
  const normalizeUserData = useCallback((userData) => {
    if (!userData) return null;

    return {
      id_usuario: userData.id_usuario || userData.id || userData.userId,
      nombre: userData.nombre || userData.name || '',
      apellido: userData.apellido || userData.lastName || '',
      email: userData.email || userData.correo || '',
      telefono: userData.telefono || userData.phone || '',
      dni: userData.dni || userData.documentNumber || '',
      asistio: userData.asistio || userData.attended || false,
      fecha_registro: userData.fecha_registro || userData.registrationDate,
      observaciones: userData.observaciones || userData.notes,
      
      // Campos calculados
      nombre_completo: userData.nombre_completo || 
                      `${userData.nombre || ''} ${userData.apellido || ''}`.trim(),
      iniciales: getInitials(userData.nombre, userData.apellido)
    };
  }, []);

  // Función auxiliar para obtener iniciales
  const getInitials = (nombre, apellido) => {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '';
    const last = apellido ? apellido.charAt(0).toUpperCase() : '';
    return first + last;
  };

  // Filtrar usuarios por estado de asistencia
  const filterUsersByAttendance = useCallback((attended) => {
    return users.filter(user => user.asistio === attended);
  }, [users]);

  // Obtener estadísticas de asistencia
  const getAttendanceStats = useCallback(() => {
    const totalUsers = users.length;
    const attendedUsers = users.filter(user => user.asistio).length;
    const notAttendedUsers = totalUsers - attendedUsers;
    
    return {
      totalUsers,
      attendedUsers,
      notAttendedUsers,
      attendanceRate: totalUsers > 0 ? Math.round((attendedUsers / totalUsers) * 100) : 0
    };
  }, [users]);

  // Buscar usuarios por nombre
  const searchUsersByName = useCallback((searchTerm) => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.nombre?.toLowerCase().includes(term) ||
      user.apellido?.toLowerCase().includes(term) ||
      user.nombre_completo?.toLowerCase().includes(term)
    );
  }, [users]);

  // Ordenar usuarios
  const sortUsers = useCallback((sortBy = 'nombre', order = 'asc') => {
    const sortedUsers = [...users];
    
    sortedUsers.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'nombre':
          aValue = a.nombre_completo || '';
          bValue = b.nombre_completo || '';
          break;
        case 'asistencia':
          aValue = a.asistio ? 1 : 0;
          bValue = b.asistio ? 1 : 0;
          break;
        case 'fecha_registro':
          aValue = new Date(a.fecha_registro || 0);
          bValue = new Date(b.fecha_registro || 0);
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }
      
      if (order === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });
    
    return sortedUsers;
  }, [users]);

  // Efecto para cargar los usuarios cuando cambian los parámetros
  useEffect(() => {
    fetchClassUsers();
  }, [fetchClassUsers]);

  return {
    // Estados
    users,
    loading,
    error,
    
    // Acciones
    refetch: fetchClassUsers,
    updateUserAttendance,
    registerIndividualAttendance,
    checkAttendanceQR,
    unregisterUser,
    
    // Utilidades
    normalizeUserData,
    filterUsersByAttendance,
    getAttendanceStats,
    searchUsersByName,
    sortUsers,
    
    // Funciones de manejo de estado
    setUsers,
    clearError: () => setError(null),
  };
};