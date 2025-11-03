import React, { useState } from 'react';
import { classService } from '../services';

const RegisterButton = ({
  classId,
  classType = 'normal',
  specialClassOriginalId = null,
  fecha,
  hora = '',
  disciplina = 'Clase',
  userId,
  disabled = false,
  disabledReason = "",
  onSuccess,
  getToken,
  // Props con valores por defecto para evitar undefined
  registerTitle = "Anotarse",
  unregisterTitle = "Desanotarse",
  loadingTitle = "Procesando..."
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // Validar que tenemos los datos necesarios
  const isValid = classId && userId && fecha && getToken;

  const handleRegister = async () => {
    if (!isValid) {
      setError('Datos incompletos para el registro');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error('No se pudo obtener el token');

      const registrationData = {
        classId,
        classType,
        userId,
        fecha,
        hora,
        disciplina
      };

      if (specialClassOriginalId) {
        registrationData.specialClassOriginalId = specialClassOriginalId;
      }

      console.log('Registrando con datos:', registrationData);
      
      await classService.registerToClass(token, registrationData);
      setIsRegistered(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al registrar en la clase');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!isValid) {
      setError('Datos incompletos para la desinscripción');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error('No se pudo obtener el token');

      const registrationData = {
        classId,
        classType,
        userId,
        fecha
      };

      if (specialClassOriginalId) {
        registrationData.specialClassOriginalId = specialClassOriginalId;
      }

      console.log('Desregistrando con datos:', registrationData);
      
      await classService.unregisterFromClass(token, registrationData);
      setIsRegistered(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error en desinscripción:', err);
      setError(err.message || 'Error al desinscribirse de la clase');
    } finally {
      setLoading(false);
    }
  };

  // Si hay un error, mostrarlo
  if (error) {
    return (
      <div className="registration-error">
        <span className="error-text">{error}</span>
        <button 
          onClick={() => setError(null)}
          className="error-dismiss"
        >
          ×
        </button>
      </div>
    );
  }

  // Determinar el estado del botón
  const isCurrentlyRegistered = disabled && disabledReason === "Ya estás anotado";

  return (
    <div className="register-button-container">
      {isCurrentlyRegistered || isRegistered ? (
        <button
          className={`btn-unregister ${loading ? 'loading' : ''}`}
          onClick={handleUnregister}
          disabled={loading}
          title={unregisterTitle}
        >
          {loading ? loadingTitle : unregisterTitle}
        </button>
      ) : (
        <button
          className={`btn-register ${loading ? 'loading' : ''}`}
          onClick={handleRegister}
          disabled={disabled || loading || !isValid}
          title={disabled ? disabledReason : registerTitle}
        >
          {loading ? loadingTitle : registerTitle}
        </button>
      )}
    </div>
  );
};

export default RegisterButton;