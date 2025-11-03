import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useClasses } from '../../hooks';
import RegisterButton from '../RegisterButton';

const RegistrationManager = (props) => {
  const { 
    classId,
    classType = 'normal',
    specialClassOriginalId,
    fecha,
    hora,
    disciplina,
    onSuccess,
    disabled: externalDisabled,
    disabledReason: externalDisabledReason,
    userId,
    getToken: propGetToken,
    targetUserId,
    adminMode = false
  } = props;

  const { getToken: authGetToken, usuario: authUser, actualizarCreditos } = useAuth();
  const { 
    checkUserRegistration, 
    registerToClass, 
    unregisterFromClass, 
    loading: classesLoading, 
    error: classesError 
  } = useClasses();
  
  const [registrationStatus, setRegistrationStatus] = useState({
    isRegistered: false,
    loading: true,
    isStaff: false,
    disabled: false,
    disabledReason: '',
    requiresCredits: true
  });

  const obtenerToken = () => (propGetToken ? propGetToken() : authGetToken());

  // Determinar si es staff (admin o profesor)
  const isAdmin = authUser?.id_rol === 1;
  const isProfesor = authUser?.id_rol === 2;
  const isStaff = isAdmin || isProfesor || adminMode;
  
  const targetUser = targetUserId || userId;
  const isAnotandoAOtro = targetUserId && targetUserId !== authUser?.id;

  // Verificar estado de registro
  useEffect(() => {
    const checkRegistration = async () => {
      if (!targetUser || !classId || !fecha) {
        setRegistrationStatus(prev => ({
          ...prev,
          loading: false,
          disabled: true,
          disabledReason: !targetUser ? 'Seleccione un usuario primero' : 'Datos incompletos'
        }));
        return;
      }

      try {
        setRegistrationStatus(prev => ({ ...prev, loading: true }));

        const token = obtenerToken();
        if (!token) {
          setRegistrationStatus(prev => ({
            ...prev,
            loading: false,
            disabled: true,
            disabledReason: 'No hay token disponible'
          }));
          return;
        }

        const registrationCheck = await checkUserRegistration(
          token, 
          { 
            classId, 
            classType, 
            userId: targetUser, 
            fecha 
          },
          isStaff
        );

        setRegistrationStatus(prev => ({
          ...prev,
          isRegistered: !!registrationCheck?.isRegistered,
          loading: false,
          isStaff,
          disabled: externalDisabled || false,
          disabledReason: externalDisabledReason || '',
          requiresCredits: !isStaff
        }));

      } catch (err) {
        console.error("Error al verificar registro:", err);
        setRegistrationStatus(prev => ({
          ...prev,
          loading: false,
          disabled: true,
          disabledReason: 'Error al verificar estado de inscripción'
        }));
      }
    };

    checkRegistration();
  }, [
    targetUser, 
    classId, 
    classType, 
    fecha, 
    isStaff, 
    externalDisabled, 
    externalDisabledReason,
    checkUserRegistration
  ]);

  // ✅ CORREGIDO: Usar los mismos endpoints para todos
  const handleRegister = async () => {
    const token = obtenerToken();
    if (!token) {
      throw new Error('No se pudo obtener el token');
    }

    try {
      const registrationData = {
        classId: classType === 'especial' ? specialClassOriginalId : classId,
        classType,
        userId: targetUser,
        fecha
      };

      // ✅ Usar el mismo endpoint para todos
      await registerToClass(token, registrationData);

      // Actualizar créditos solo si NO es staff
      if (!isStaff) {
        await actualizarCreditos?.();
      }

      onSuccess?.();
      
      // Actualizar estado local
      setRegistrationStatus(prev => ({
        ...prev,
        isRegistered: true
      }));
    } catch (err) {
      console.error("Error en registro:", err);
      throw err;
    }
  };

  const handleUnregister = async () => {
    const token = obtenerToken();
    if (!token) {
      throw new Error('No se pudo obtener el token');
    }

    try {
      const registrationData = {
        classId: classType === 'especial' ? specialClassOriginalId : classId,
        classType,
        userId: targetUser,
        fecha
      };

      // ✅ Usar el mismo endpoint para todos
      await unregisterFromClass(token, registrationData);

      // Actualizar créditos solo si NO es staff
      if (!isStaff) {
        await actualizarCreditos?.();
      }

      onSuccess?.();
      
      // Actualizar estado local
      setRegistrationStatus(prev => ({
        ...prev,
        isRegistered: false
      }));
    } catch (err) {
      console.error("Error en desinscripción:", err);
      throw err;
    }
  };

  // Mensajes personalizados según el contexto
  const getRegistrationContext = () => {
    const serviceType = isStaff ? ' (modo staff)' : '';
    
    if (isAnotandoAOtro) {
      return {
        registerTitle: `Anotar usuario en ${disciplina}`,
        registerMessage: `¿Anotar al usuario seleccionado en ${disciplina} a las ${hora}?${serviceType}`,
        cancelTitle: `Desanotar usuario de ${disciplina}`,
        cancelMessage: `¿Desanotar al usuario seleccionado de ${disciplina} a las ${hora}?`,
        successRegister: '✅ Usuario anotado correctamente',
        successCancel: '✅ Usuario desanotado correctamente',
        creditMessage: isStaff ? '' : 'Se descontará 1 crédito de la cuenta del usuario'
      };
    }

    if (isStaff) {
      return {
        registerTitle: `Anotarse en ${disciplina}`,
        registerMessage: `¿Anotarse en ${disciplina} a las ${hora}?${serviceType}`,
        cancelTitle: `Desanotarse de ${disciplina}`,
        cancelMessage: `¿Desanotarse de ${disciplina} a las ${hora}?`,
        successRegister: '✅ Te anotaste correctamente',
        successCancel: '✅ Te desanotaste correctamente',
        creditMessage: ''
      };
    }

    // Alumno normal
    return {
      registerTitle: `Confirmar inscripción`,
      registerMessage: `¿Querés anotarte a ${disciplina} a las ${hora}?`,
      cancelTitle: `Cancelar inscripción`,
      cancelMessage: `¿Querés cancelar tu inscripción a ${disciplina} a las ${hora}?`,
      successRegister: '✅ ¡Registrado! Te anotaste correctamente.',
      successCancel: '✅ Inscripción cancelada',
      creditMessage: 'Se descontará 1 crédito de tu cuenta'
    };
  };

  return (
    <RegisterButton
      classId={classId}
      classType={classType}
      specialClassOriginalId={specialClassOriginalId}
      fecha={fecha}
      hora={hora}
      disciplina={disciplina}
      onSuccess={onSuccess}
      disabled={registrationStatus.disabled}
      disabledReason={registrationStatus.disabledReason}
      userId={targetUser}
      getToken={obtenerToken}
      registrationContext={getRegistrationContext()}
      requiresCredits={registrationStatus.requiresCredits}
      isRegistered={registrationStatus.isRegistered}
      isLoading={registrationStatus.loading || classesLoading}
      onRegister={handleRegister}
      onUnregister={handleUnregister}
      isStaff={isStaff}
      isAnotandoAOtro={isAnotandoAOtro}
    />
  );
};

export default RegistrationManager;