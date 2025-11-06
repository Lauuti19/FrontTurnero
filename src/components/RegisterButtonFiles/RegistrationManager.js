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
  classInfo = {} // Nueva prop para información de la clase
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

  // Función para mostrar alerta de éxito
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

  // Función para mostrar alerta de error
  const showErrorAlert = (errorMessage) => {
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#d33'
    });
  };

  const getMinutesDifference = (fechaClase, horaClase) => {
    const now = new Date();
    const today = new Date().toISOString().split('T')[0];
    
    let classDateTime;
    
    if (fechaClase && typeof fechaClase === 'string') {
      if (horaClase) {
        const [hours, minutes] = horaClase.split(':');
        classDateTime = new Date(fechaClase);
        classDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        classDateTime = new Date(fechaClase);
      }
    } else if (horaClase) {
      const [hours, minutes] = horaClase.split(':');
      classDateTime = new Date();
      classDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      classDateTime = new Date(fechaClase);
    }

    const diffMs = classDateTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    return diffMinutes;
  };

  const getButtonState = () => {
    const minutesDiff = getMinutesDifference(fecha, hora);

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
    // Mostrar alerta de éxito
    showSuccessAlert(isRegistration);
    
    refetch();
    if (onRegistrationChange) {
      onRegistrationChange();
    }
  };

  const handleRegister = async () => {
    if (!classId || !userId || !fecha || !getToken) {
      setActionError('Datos incompletos para el registro');
      showErrorAlert('Datos incompletos para el registro');
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
      handleRegistrationSuccess(true); // true = registro exitoso
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
      setActionError('Datos incompletos para la desinscripción');
      showErrorAlert('Datos incompletos para la desinscripción');
      return;
    }

    const minutesDiff = getMinutesDifference(fecha, hora);
    if (!isAdmin && minutesDiff <= 15 && minutesDiff > 0) {
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
      
      handleRegistrationSuccess(false); // false = desregistro exitoso
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