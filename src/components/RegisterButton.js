import React, { useEffect, useState, useCallback } from 'react';
import { classService } from '../services/classService';
import Swal from 'sweetalert2';
import { useAuth } from "../AuthContext";
import '../styles/RegisterButton.css';

const RegisterButton = ({
  classId,
  classType = 'normal',           // 👈 NUEVO: viene "normal" o "especial"
  specialClassOriginalId,          // 👈 NUEVO: para cuando es especial
  fecha,
  hora,
  disciplina,
  onSuccess,
  disabled,
  disabledReason,
  userId,
  getToken,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const { actualizarCreditos, getToken: authGetToken } = useAuth();

  // token
  const obtenerToken = () => (getToken ? getToken() : authGetToken());

  // ---------- 1) Chequear si ya está anotado ----------
  const checkRegistration = useCallback(async () => {
    if (!userId || !classId || !fecha) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = obtenerToken();
      if (!token) {
        console.error("No hay token disponible");
        setLoading(false);
        return;
      }

      // 👇 usamos el service nuevo que espera classType
      const result = await classService.checkUserRegistration(token, {
        classId,
        classType,  // "normal" | "especial"
        userId,
        fecha,
      });

      setIsRegistered(!!result.isRegistered);
    } catch (err) {
      console.error("Error al verificar registro:", err);
      // si falla, lo dejamos como no registrado
      setIsRegistered(false);
    } finally {
      setLoading(false);
    }
  }, [userId, classId, fecha, classType, obtenerToken]);

  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

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

    const token = obtenerToken();
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'No hay token de autenticación disponible.',
      });
      return;
    }

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
      setLoading(true);

      // 👇 armamos el body según si es normal o especial
      let payload;
      if (classType === 'especial') {
        // el back quiere specialClassId numérico → usamos id_original que te trae el back
        payload = {
          userId,
          fecha,
          specialClassId: specialClassOriginalId,  // 👈 clave
        };
      } else {
        payload = {
          userId,
          fecha,
          classId,
        };
      }

      // usar service (ya apunta a /classes/register)
      await classService.registerUserToClass(token, payload);

      await modal.fire({
        icon: 'success',
        title: '¡Registrado!',
        html: 'Te anotaste correctamente.',
      });

      // refrescar créditos
      await actualizarCreditos?.();

      setIsRegistered(true);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Algo no funcionó',
        html: err.message || 'Intentá nuevamente en unos minutos.',
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------- 3) Desanotar ----------
  const handleCancel = async () => {
    const token = obtenerToken();
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'No hay token de autenticación disponible.',
      });
      return;
    }

    const result = await modal.fire({
      title: '<span class="simbolo">¿</span>Cancelar inscripción<span class="simbolo">?</span>',
      html: `¿Querés cancelar tu inscripción a <strong>${disciplina}</strong> a las <strong>${hora}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Desanotarse',
      cancelButtonText: 'Volver',
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      // igual que arriba, pero a /classes/unregister
      let payload;
      if (classType === 'especial') {
        payload = {
          userId,
          fecha,
          specialClassId: specialClassOriginalId,
        };
      } else {
        payload = {
          userId,
          fecha,
          classId,
        };
      }

      await classService.unregisterUserFromClass(token, payload);

      await modal.fire({
        icon: 'success',
        title: 'Inscripción cancelada',
      });

      await actualizarCreditos?.();

      setIsRegistered(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      await modal.fire({
        icon: 'error',
        title: 'Error',
        html: err.message || 'No se pudo cancelar',
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------- 4) Render ----------
  if (loading) {
    return <button className="botonReservar" disabled>Cargando...</button>;
  }

  if (disabled) {
    return (
      <button className="botonReservar botonDesactivado" disabled title={disabledReason}>
        <h3>{disabledReason || "No disponible"}</h3>
      </button>
    );
  }

  if (!userId) {
    return (
      <button className="botonReservar botonDesactivado" disabled title="Seleccione un usuario primero">
        <h3>Seleccione usuario</h3>
      </button>
    );
  }

  return (
    <button
      className={`botonReservar ${isRegistered ? 'botonCancelar' : 'botonAnotarse'}`}
      onClick={isRegistered ? handleCancel : handleRegister}
      disabled={loading}
    >
      <h3>{loading ? 'Procesando...' : isRegistered ? 'Desanotarse' : 'Anotarse'}</h3>
    </button>
  );
};

export default RegisterButton;
