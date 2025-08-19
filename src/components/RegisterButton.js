import React, { useEffect, useState } from 'react';
import '../styles/RegisterButton.css';
import Swal from 'sweetalert2';

const RegisterButton = ({
  classId, fecha, hora, disciplina, userId, onSuccess, disabled, disabledReason
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/classes/users-by-class?classId=${classId}&fecha=${fecha}`);
        const data = await res.json();
        setIsRegistered(data.some(user => user.id_usuario === userId));
      } catch (err) {
        console.error("Error al verificar registro:", err);
      } finally {
        setLoading(false);
      }
    };
    checkRegistration();
  }, [classId, fecha, userId]);

  // Unificamos estilos de Swal en un mixin
  const modal = Swal.mixin({
    buttonsStyling: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    backdrop: true,
    customClass: {
      popup: 'mi-popup',          // base
      title: 'mi-titulo',
      htmlContainer: 'mi-html',
      confirmButton: 'mi-boton-confirmar',
      cancelButton: 'mi-boton-cancelar',
    }
  });

  const handleRegister = async () => {
    const result = await modal.fire({
      title: '<span class="simbolo">¿</span>Confirmar inscripción<span class="simbolo">?</span>',
      html: `<div class="textos-alert">
               <h2 class="texto-alert1">¿Querés anotarte a <strong>${disciplina}</strong> a las <strong>${hora}</strong>?</h2>
               <h2 class="texto-alert2">Recordá que se descontará 1 crédito de tu cuenta</h2>
             </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, anotarme',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch('http://localhost:3001/api/classes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, classId, fecha }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || 'No se pudo registrar');

      await modal.fire({
        icon: 'success',
        title: '¡Registrado!',
        html: 'Te anotaste correctamente.',
      });

      setIsRegistered(true);
      onSuccess?.();
    } catch (err) {
      // Modal de error CONSISTENTE y centrado
      await Swal.fire({
        icon: 'error',
        title: 'Algo no funcionó',
        html: 'Intentá nuevamente en unos minutos.',
        confirmButtonText: 'OK',
        buttonsStyling: false,
        customClass: {
          popup: 'mi-popup mi-popup-error',
          title: 'mi-titulo',
          htmlContainer: 'mi-html',
          confirmButton: 'mi-boton-confirmar'
        }
      });

    }
  };

  const handleCancel = async () => {
    const result = await modal.fire({
      title: '<span class="simbolo">¿</span>Cancelar inscripción<span class="simbolo">?</span>',
      html: `¿Querés cancelar tu inscripción a <strong>${disciplina}</strong> a las <strong>${hora}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Desanotarse',
      cancelButtonText: 'Volver',
      // si querés un look distinto para warning:
      customClass: { popup: 'mi-popup mi-popup-warning' }
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch('http://localhost:3001/api/classes/unregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, classId, fecha }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo cancelar');
      }

      await modal.fire({ icon: 'success', title: 'Inscripción cancelada', html: '' });
      setIsRegistered(false);
      onSuccess?.();
    } catch (err) {
      await modal.fire({
        icon: 'error',
        title: 'Error',
        html: err.message,
        customClass: { popup: 'mi-popup mi-popup-error' }
      });
    }
  };

  if (loading) return <button className="botonReservar" disabled>Cargando...</button>;

  if (disabled) {
    return (
      <button className="botonReservar botonDesactivado" disabled title={disabledReason}>
        <h3>{disabledReason || "No disponible"}</h3>
      </button>
    );
  }

  return (
    <button
      className={`botonReservar ${isRegistered ? 'botonCancelar' : 'botonAnotarse'}`}
      onClick={isRegistered ? handleCancel : handleRegister}
    >
      <h3>{isRegistered ? 'Desanotarse' : 'Anotarse'}</h3>
    </button>
  );
};

export default RegisterButton;
