// hooks/otherHooks/useRegisterMap.js
import { useState, useEffect, useCallback } from 'react';
import { classService, userService } from '../../services';

export const useRegisterMap = ({ classId, classType, fecha, getToken, isAdmin = false, fetchUserDetails = false }) => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRegisteredUsers = useCallback(async () => {
    if (!classId || !fecha || !getToken) {
      setError('Datos incompletos para cargar usuarios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error('No se pudo obtener el token');

      // Obtener usuarios registrados en la clase
      const users = await classService.getUsersInClass(token, classId, classType, fecha);
      const usersArray = Array.isArray(users) ? users : users.users || users.usuarios || [];
      
      setRegisteredUsers(usersArray);

      // Solo obtener detalles completos si es necesario (para RegistrationManager)
      if (fetchUserDetails) {
        const userDetailsMap = {};
        const userPromises = usersArray.map(async (user) => {
          try {
            const userId = user.id_usuario || user.id;
            if (userId) {
              const userInfo = await userService.getUserFullInfo(token, userId);
              userDetailsMap[userId] = userInfo.datos_usuario || userInfo;
            }
          } catch (err) {
            console.warn(`Error obteniendo detalles del usuario ${user.id_usuario}:`, err);
            userDetailsMap[user.id_usuario || user.id] = user;
          }
        });

        await Promise.all(userPromises);
        setUserDetails(userDetailsMap);
      }
    } catch (err) {
      console.error('Error fetching registered users:', err);
      setError(err.message || 'Error al cargar los usuarios registrados');
    } finally {
      setLoading(false);
    }
  }, [classId, classType, fecha, getToken, fetchUserDetails]);

  const isUserRegistered = useCallback((userId) => {
    return registeredUsers.some(user => 
      user.id_usuario === userId || user.id === userId
    );
  }, [registeredUsers]);

  const getUserDetail = useCallback((userId) => {
    return userDetails[userId] || null;
  }, [userDetails]);

  // Cargar usuarios al montar o cambiar dependencias
  useEffect(() => {
    fetchRegisteredUsers();
  }, [fetchRegisteredUsers]);

  return {
    registeredUsers,
    userDetails,
    loading,
    error,
    isUserRegistered,
    getUserDetail,
    refetch: fetchRegisteredUsers,
    clearError: () => setError(null)
  };
};