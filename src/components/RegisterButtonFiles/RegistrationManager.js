// components/RegisterButtonFiles/RegistrationManager.jsx
import React, { useState } from 'react';
import { useRegisterMap } from '../../hooks/otherHooks/useRegisterMap';
import { classService } from '../../services';
import RegisterButton from '../RegisterButton';

const RegistrationManager = ({
  classId,
  classType,
  fecha,
  hora, // Nueva prop para la hora
  getToken,
  userId,
  isAdmin = false,
  onRegistrationChange
}) => {
  const {
    registeredUsers,
    loading: usersLoading,
    error: usersError,
    isUserRegistered,
    refetch
  } = useRegisterMap({
    classId,
    classType,
    fecha,
    getToken,
    isAdmin,
    fetchUserDetails: true // Solo aquí necesitamos detalles completos
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Determinar el estado del registro
  const isRegistered = userId ? isUserRegistered(userId) : false;
  const isLoading = usersLoading || actionLoading;
  const error = usersError || actionError;

  const getMinutesDifference = (fechaClase, horaClase) => {
    const now = new Date();
    const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
    
    // Combinar la fecha actual con la hora de la clase
    let classDateTime;
    
    if (fechaClase && typeof fechaClase === 'string') {
      // Si tenemos fecha específica (para clases especiales)
      if (horaClase) {
        // Combinar fecha específica con hora
        const [hours, minutes] = horaClase.split(':');
        classDateTime = new Date(fechaClase);
        classDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        // Usar fecha completa si no hay hora separada
        classDateTime = new Date(fechaClase);
      }
    } else if (horaClase) {
      // Para clases regulares: usar fecha actual + hora de la clase
      const [hours, minutes] = horaClase.split(':');
      classDateTime = new Date();
      classDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      // Fallback: usar la fecha como viene
      classDateTime = new Date(fechaClase);
    }

    // Diferencia en minutos
    const diffMs = classDateTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    return diffMinutes;
  };

  const getButtonState = () => {
    const minutesDiff = getMinutesDifference(fecha, hora);

    // Si la clase ya pasó (con margen de 5 minutos para evitar problemas de tiempo)
    if (minutesDiff < -5) {
      return {
        type: 'finished',
        disabled: true,
        title: 'Finalizada',
        reason: 'La clase ya comenzó o terminó'
      };
    }

    // Si está anotado y faltan menos de 15 minutos
    if (isRegistered && minutesDiff <= 15 && minutesDiff > 0) {
      return {
        type: 'unregister',
        disabled: true,
        title: 'Desanotarse',
        reason: 'No puedes desanotarte a menos de 15 minutos del inicio'
      };
    }

    // Si está anotado normalmente y la clase no ha empezado
    if (isRegistered && minutesDiff > 0) {
      return {
        type: 'unregister',
        disabled: false,
        title: 'Desanotarse',
        reason: ''
      };
    }

    // Si la clase está por empezar (en los próximos 5 minutos) o ya empezó
    if (minutesDiff <= 0 && minutesDiff >= -5) {
      return {
        type: 'register',
        disabled: true,
        title: 'En curso',
        reason: 'La clase está en curso'
      };
    }

    // Si aún no está anotado y la clase no empezó
    return {
      type: 'register',
      disabled: false,
      title: 'Anotarse',
      reason: ''
    };
  };

  const handleRegistrationSuccess = () => {
    refetch();
    if (onRegistrationChange) {
      onRegistrationChange();
    }
  };

  const handleRegister = async () => {
    if (!classId || !userId || !fecha || !getToken) {
      setActionError('Datos incompletos para el registro');
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const token = getToken();
      if (!token) throw new Error('No se pudo obtener el token');

      const registrationData = {
        classId,
        classType,
        userId,
        fecha
      };

      console.log('Registrando con datos:', registrationData);
      
      await classService.registerToClass(token, registrationData);
      handleRegistrationSuccess();
    } catch (err) {
      console.error('Error en registro:', err);
      setActionError(err.message || 'Error al registrar en la clase');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!classId || !userId || !fecha || !getToken) {
      setActionError('Datos incompletos para la desinscripción');
      return;
    }

    // Verificar restricción de tiempo (excepto para admin)
    const minutesDiff = getMinutesDifference(fecha, hora);
    if (!isAdmin && minutesDiff <= 15 && minutesDiff > 0) {
      setActionError('No puedes desanotarte a menos de 15 minutos del inicio');
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const token = getToken();
      if (!token) throw new Error('No se pudo obtener el token');

      const registrationData = {
        classId,
        classType,
        userId,
        fecha
      };

      console.log('Desregistrando con datos:', registrationData);
      
      // Usar servicio diferente para admin
      if (isAdmin) {
        await classService.unregisterFromClassNoCredits(token, registrationData);
      } else {
        await classService.unregisterFromClass(token, registrationData);
      }
      
      handleRegistrationSuccess();
    } catch (err) {
      console.error('Error en desinscripción:', err);
      setActionError(err.message || 'Error al desinscribirse de la clase');
    } finally {
      setActionLoading(false);
    }
  };

  const buttonState = getButtonState();

  const handleButtonClick = () => {
    if (isLoading || buttonState.disabled) return;
    
    if (isRegistered) {
      handleUnregister();
    } else {
      handleRegister();
    }
  };

  return (
    <div className="registration-manager">
      <RegisterButton
        type={buttonState.type}
        title={buttonState.title}
        disabled={buttonState.disabled}
        disabledReason={buttonState.reason}
        loading={isLoading}
        onClick={handleButtonClick}
      />
      
      {error && (
        <div className="registration-error">
          <small>Error: {error}</small>
          <button 
            onClick={() => setActionError(null)}
            className="error-dismiss"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrationManager;