// components/RegisterButtonFiles/RegistrationManager.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useRegisterMap } from '../../hooks/otherHooks/useRegisterMap';
import { classService } from '../../services';
import RegisterButton from '../RegisterButton';

const RegistrationManager = ({
  classId,
  classType,
  fecha,
  hora,
  getToken,
  userId,
  isAdmin = false,
  onRegistrationChange,
  classInfo = {},               // info de la clase (disciplina, hora, etc.)
  ignoreTimeRestrictions = false // modo especial (profe anotando alumno desde otra pantalla)
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
    fetchUserDetails: true
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const isRegistered = userId ? isUserRegistered(userId) : false;
  const isLoading = usersLoading || actionLoading;
  const error = usersError || actionError;

  // Alerta de éxito
  const showSuccessAlert = (isRegistration) => {
    const disciplina = classInfo.disciplina || 'la clase';
    const horaClase = classInfo.hora || hora || '';
    
    Swal.fire({
      title: isRegistration ? '¡Anotado correctamente!' : '¡Desanotado correctamente!',
      html: isRegistration 
        ? `Te anotaste a <strong>${disciplina}</strong>${horaClase ? ` a las ${horaClase} Hs` : ''}`
        : `Te desanotaste de <strong>${disciplina}</strong>${horaClase ? ` de las ${horaClase} Hs` : ''}`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      timer: 3000,
      timerProgressBar: true
    });
  };

  // Alerta de error
  const showErrorAlert = (errorMessage) => {
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#d33'
    });
  };

  // Construye un Date local usando "YYYY-MM-DD" sin el bug de UTC
  const buildClassDateTime = (fechaClase, horaClase) => {
    let dateObj;

    if (fechaClase instanceof Date) {
      dateObj = new Date(fechaClase);
    } else if (fechaClase && typeof fechaClase === 'string') {
      // Si viene en formato YYYY-MM-DD lo parseamos a mano
      if (/^\d{4}-\d{2}-\d{2}$/.test(fechaClase)) {
        const [year, month, day] = fechaClase.split('-').map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        // Otros formatos (ISO completo, etc.)
        dateObj = new Date(fechaClase);
      }
    } else {
      // Si no viene fecha, usamos hoy como base
      dateObj = new Date();
    }

    if (horaClase) {
      const [hoursStr, minutesStr] = horaClase.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr || '0', 10);
      dateObj.setHours(hours, minutes, 0, 0);
    }

    return dateObj;
  };

  const getMinutesDifference = (fechaClase, horaClase) => {
    const now = new Date();
    const classDateTime = buildClassDateTime(fechaClase, horaClase);

    const diffMs = classDateTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    return diffMinutes;
  };

  const getButtonState = () => {
    const minutesDiff = getMinutesDifference(fecha, hora);

    // 🔓 MODO LIBRE:
    // - ignoreTimeRestrictions: profe anotando a un alumno desde "AnotarUsuarioAClase"
    // - isAdmin: cuando el propio profe/admin se anota a una clase
    const freeMode = ignoreTimeRestrictions || isAdmin;

    if (freeMode) {
      if (isRegistered) {
        return {
          type: 'unregister',
          disabled: false,
          title: 'Desanotarse',
          reason: ''
        };
      }
      return {
        type: 'register',
        disabled: false,
        title: 'Anotarse',
        reason: ''
      };
    }

    // 🔒 LÓGICA SOLO PARA ALUMNOS (isAdmin === false && !ignoreTimeRestrictions)
    if (minutesDiff < -5) {
      return {
        type: 'finished',
        disabled: true,
        title: 'Finalizada',
        reason: 'La clase ya comenzó o terminó'
      };
    }

    if (isRegistered && minutesDiff <= 15 && minutesDiff > 0) {
      return {
        type: 'unregister',
        disabled: true,
        title: 'Desanotarse',
        reason: 'No puedes desanotarte a menos de 15 minutos del inicio'
      };
    }

    if (isRegistered && minutesDiff > 0) {
      return {
        type: 'unregister',
        disabled: false,
        title: 'Desanotarse',
        reason: ''
      };
    }

    if (minutesDiff <= 0 && minutesDiff >= -5) {
      return {
        type: 'register',
        disabled: true,
        title: 'En curso',
        reason: 'La clase está en curso'
      };
    }

    return {
      type: 'register',
      disabled: false,
      title: 'Anotarse',
      reason: ''
    };
  };

  const handleRegistrationSuccess = (isRegistration) => {
    showSuccessAlert(isRegistration);
    refetch();
    if (onRegistrationChange) {
      onRegistrationChange();
    }
  };

  const handleRegister = async () => {
    if (!classId || !userId || !fecha || !getToken) {
      const msg = 'Datos incompletos para el registro';
      setActionError(msg);
      showErrorAlert(msg);
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
      handleRegistrationSuccess(true);
    } catch (err) {
      console.error('Error en registro:', err);
      const errorMsg = err.message || 'Error al registrar en la clase';
      setActionError(errorMsg);
      showErrorAlert(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!classId || !userId || !fecha || !getToken) {
      const msg = 'Datos incompletos para la desinscripción';
      setActionError(msg);
      showErrorAlert(msg);
      return;
    }

    const minutesDiff = getMinutesDifference(fecha, hora);

    // 🚫 Restricción de desanotarse cerca del inicio:
    // solo aplica a alumnos (no admin) y solo si NO estamos en modo libre
    if (!ignoreTimeRestrictions && !isAdmin && minutesDiff <= 15 && minutesDiff > 0) {
      const errorMsg = 'No puedes desanotarte a menos de 15 minutos del inicio';
      setActionError(errorMsg);
      showErrorAlert(errorMsg);
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
      
      if (isAdmin) {
        await classService.unregisterFromClassNoCredits(token, registrationData);
      } else {
        await classService.unregisterFromClass(token, registrationData);
      }
      
      handleRegistrationSuccess(false);
    } catch (err) {
      console.error('Error en desinscripción:', err);
      const errorMsg = err.message || 'Error al desinscribirse de la clase';
      setActionError(errorMsg);
      showErrorAlert(errorMsg);
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
