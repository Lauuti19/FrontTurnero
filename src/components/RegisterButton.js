import React from 'react';
import Swal from 'sweetalert2';
import { useAuth } from "../AuthContext";
import '../styles/RegisterButton.css';

const RegisterButton = ({
  classId,
  classType = 'normal',
  specialClassOriginalId,
  fecha,
  hora,
  disciplina,
  onSuccess,
  disabled,
  disabledReason,
  userId,
  getToken,
  registrationContext,
  requiresCredits = true,
  isRegistered = false,
  isLoading = false,
  onRegister,
  onUnregister,
  isStaff = false,
  isAnotandoAOtro = false
}) => {
  const { actualizarCreditos } = useAuth();

  // ---------- SweetAlert base ----------
  const modal = Swal.mixin({
    buttonsStyling: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    backdrop: true,
    customClass: {
      popup: 'mi-popup',
      title: 'mi-titulo',
      htmlContainer: 'mi-html',
      confirmButton: 'mi-boton-confirmar',
      cancelButton: 'mi-boton-cancelar',
    }
  });

  // ---------- 2) Registrar ----------
  const handleRegister = async () => {
    if (!userId) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'No se ha seleccionado un usuario válido.',
      });
      return;
    }

    const result = await modal.fire({
      title: registrationContext.registerTitle,
      html: `<div class="textos-alert">
               <h2 class="texto-alert1">${registrationContext.registerMessage}</h2>
               ${requiresCredits ? `<h2 class="texto-alert2">${registrationContext.creditMessage}</h2>` : ''}
             </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isAnotandoAOtro ? 'Sí, anotar usuario' : 'Sí, anotarme',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await onRegister();

      await modal.fire({
        icon: 'success',
        title: '¡Éxito!',
        html: registrationContext.successRegister,
        timer: 2000,
        showConfirmButton: false
      });

    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: err.message || 'No se pudo completar la inscripción. Intentá nuevamente.',
      });
    }
  };

  // ---------- 3) Desanotar ----------
  const handleCancel = async () => {
    const result = await modal.fire({
      title: registrationContext.cancelTitle,
      html: `<div class="textos-alert">
               <h2 class="texto-alert1">${registrationContext.cancelMessage}</h2>
             </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isAnotandoAOtro ? 'Sí, desanotar usuario' : 'Sí, desanotarme',
      cancelButtonText: 'Volver',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await onUnregister();

      await modal.fire({
        icon: 'success',
        title: 'Listo',
        html: registrationContext.successCancel,
        timer: 2000,
        showConfirmButton: false
      });

    } catch (err) {
      console.error(err);
      await modal.fire({
        icon: 'error',
        title: 'Error',
        html: err.message || 'No se pudo cancelar la inscripción.',
      });
    }
  };

  // ---------- 4) Render ----------
  if (isLoading) {
    return (
      <button className="botonReservar botonCargando" disabled>
        <h3>Cargando...</h3>
      </button>
    );
  }

  if (disabled) {
    return (
      <button 
        className="botonReservar botonDesactivado" 
        disabled 
        title={disabledReason}
      >
        <h3>{disabledReason || "No disponible"}</h3>
      </button>
    );
  }

  if (!userId) {
    return (
      <button 
        className="botonReservar botonDesactivado" 
        disabled 
        title="Seleccione un usuario primero"
      >
        <h3>Seleccione usuario</h3>
      </button>
    );
  }

  // Textos del botón según el contexto
  const getButtonText = () => {
    if (isAnotandoAOtro) {
      return isRegistered ? 'Desanotar usuario' : 'Anotar usuario';
    }
    
    if (isStaff) {
      return isRegistered ? 'Desanotarse' : 'Anotarse';
    }

    return isRegistered ? 'Desanotarse' : 'Anotarse';
  };

  return (
    <button
      className={`botonReservar ${isRegistered ? 'botonCancelar' : 'botonAnotarse'}`}
      onClick={isRegistered ? handleCancel : handleRegister}
      disabled={isLoading}
      title={isRegistered ? 'Cancelar inscripción' : 'Inscribirse en la clase'}
    >
      <h3>{isLoading ? 'Procesando...' : getButtonText()}</h3>
    </button>
  );
};

export default RegisterButton;