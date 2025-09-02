import React, { useEffect, useState, useCallback } from 'react';
import '../styles/RegisterButton.css';
import Swal from 'sweetalert2';
import { useAuth } from "../AuthContext";

const RegisterButton = ({ 
  classId, 
  fecha, 
  hora, 
  disciplina, 
  onSuccess, 
  disabled, 
  disabledReason,
  userId 
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const { actualizarCreditos } = useAuth();

  // Función para verificar el registro - useCallback con dependencias correctas
  const checkRegistration = useCallback(async () => {
    try {
      if (userId && classId && fecha) {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/api/classes/users-by-class?classId=${classId}&fecha=${fecha}`
        );
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        
        const data = await res.json();
        console.log('Datos de verificación:', data); // Para debug
        // CORRECCIÓN: cambiar usuario.id por usuario.id_usuario
        setIsRegistered(data.some(usuario => usuario.id_usuario === userId));
      }
    } catch (err) {
      console.error("Error al verificar registro:", err);
    } finally {
      setLoading(false);
    }
  }, [classId, fecha, userId]);

  // Verificar registro al montar y cuando cambien las dependencias IMPORTANTES
  useEffect(() => {
    checkRegistration();
  }, [classId, fecha, userId, checkRegistration]);

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

  const handleRegister = async () => {
    if (!userId) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'No se ha seleccionado un usuario válido.',
        confirmButtonText: 'OK'
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

      // Actualizar créditos después de registrar
      await actualizarCreditos();
      
      // Forzar una verificación manual después de la acción
      setLoading(true);
      const checkRes = await fetch(
        `http://localhost:3001/api/classes/users-by-class?classId=${classId}&fecha=${fecha}`
      );
      const checkData = await checkRes.json();
      // CORRECCIÓN: cambiar usuario.id por usuario.id_usuario
      setIsRegistered(checkData.some(usuario => usuario.id_usuario === userId));
      setLoading(false);
      
      onSuccess?.(); // Notificar al componente padre
    } catch (err) {
      setLoading(false);
      await Swal.fire({
        icon: 'error',
        title: 'Algo no funcionó',
        html: 'Intentá nuevamente en unos minutos.',
        confirmButtonText: 'OK'
      });
      console.log(err);
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

      await modal.fire({ 
        icon: 'success', 
        title: 'Inscripción cancelada', 
        html: '' 
      });
      
      // Actualizar créditos después de cancelar (si se devuelven)
      await actualizarCreditos();
      
      // Forzar una verificación manual después de la acción
      setLoading(true);
      const checkRes = await fetch(
        `http://localhost:3001/api/classes/users-by-class?classId=${classId}&fecha=${fecha}`
      );
      const checkData = await checkRes.json();
      // CORRECCIÓN: cambiar usuario.id por usuario.id_usuario
      setIsRegistered(checkData.some(usuario => usuario.id_usuario === userId));
      setLoading(false);
      
      onSuccess?.(); // Notificar al componente padre
    } catch (err) {
      setLoading(false);
      await modal.fire({
        icon: 'error',
        title: 'Error',
        html: err.message,
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
    >
      <h3>{isRegistered ? 'Desanotarse' : 'Anotarse'}</h3>
    </button>
  );
};

export default RegisterButton;