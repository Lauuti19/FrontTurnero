import React, { useEffect, useState, useCallback } from 'react';
import { classService } from '../services/classService';
import Swal from 'sweetalert2';
import { useAuth } from "../AuthContext";
import '../styles/RegisterButton.css';

const RegisterButton = ({ 
  classId, 
  fecha, 
  hora, 
  disciplina, 
  onSuccess, 
  disabled, 
  disabledReason,
  userId,
  getToken
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const { actualizarCreditos, getToken: authGetToken } = useAuth();

  // Función para obtener el token (usa la prop o del contexto)
  const obtenerToken = () => {
    return getToken ? getToken() : authGetToken();
  };

  // Función para verificar el registro usando el service
  const checkRegistration = useCallback(async () => {
    try {
      if (userId && classId && fecha) {
        setLoading(true);
        const token = obtenerToken();
        if (!token) {
          console.error("No hay token disponible");
          setLoading(false);
          return;
        }

        console.log('Verificando registro con:', { classId, userId, fecha });
        
        // Intentar verificación directa primero
        try {
          const result = await classService.checkUserRegistration(token, classId, userId, fecha);
          console.log('Resultado de verificación:', result);
          setIsRegistered(result.isRegistered);
        } catch (primaryError) {
          console.error("Error en verificación primaria:", primaryError);
          
          // Fallback: usar el método original de fetch directo
          console.log('Usando método de verificación alternativo...');
          const res = await fetch(
            `https://backturnero-vvk6.onrender.com/api/classes/users-by-class?classId=${classId}&fecha=${fecha}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (res.ok) {
            const data = await res.json();
            console.log('Datos de verificación alternativa:', data);
            
            // Procesar la respuesta según el formato que devuelve tu backend
            let usersArray = data;
            if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
              usersArray = data[0]; // Si viene en formato [ [array] ]
            }
            
            const registered = Array.isArray(usersArray) 
              ? usersArray.some(usuario => usuario.id_usuario == userId)
              : false;
              
            console.log('Resultado verificación alternativa:', registered);
            setIsRegistered(registered);
          } else {
            console.error('Error en verificación alternativa:', res.status);
            setIsRegistered(false);
          }
        }
      }
    } catch (err) {
      console.error("Error general al verificar registro:", err);
      // En caso de cualquier error, asumimos que no está registrado
      setIsRegistered(false);
    } finally {
      setLoading(false);
    }
  }, [classId, fecha, userId, obtenerToken]);

  // Verificar registro al montar y cuando cambien las dependencias
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

    const token = obtenerToken();
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'No hay token de autenticación disponible.',
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
      setLoading(true);
      
      // Usar fetch directo para evitar problemas con el service
      const res = await fetch('https://backturnero-vvk6.onrender.com/api/classes/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      
      // Actualizar estado de registro
      setIsRegistered(true);
      
      onSuccess?.();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Algo no funcionó',
        html: 'Intentá nuevamente en unos minutos.',
        confirmButtonText: 'OK'
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const token = obtenerToken();
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'No hay token de autenticación disponible.',
        confirmButtonText: 'OK'
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
      
      // Usar fetch directo para evitar problemas con el service
      const res = await fetch('https://backturnero-vvk6.onrender.com/api/classes/unregister', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      
      // Actualizar créditos después de cancelar
      await actualizarCreditos();
      
      // Actualizar estado de registro
      setIsRegistered(false);
      
      onSuccess?.();
    } catch (err) {
      await modal.fire({
        icon: 'error',
        title: 'Error',
        html: err.message,
      });
    } finally {
      setLoading(false);
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
      disabled={loading}
    >
      <h3>{loading ? 'Procesando...' : isRegistered ? 'Desanotarse' : 'Anotarse'}</h3>
    </button>
  );
};

export default RegisterButton;