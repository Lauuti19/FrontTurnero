import React, { useEffect, useState } from 'react';
import '../styles/RegisterButton.css';
import Swal from 'sweetalert2';

const RegisterButton = ({ classId, fecha, hora, disciplina, userId, onSuccess, disabled, disabledReason
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  // consultar si el usuario ya esta anotado al cargar el componente
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

  const handleRegister = async () => {
    console.log('Se hizo clic en Anotarse');
    const result = await Swal.fire({
    title: '<span class="simbolo">¿</span>Confirmar inscripción<span class="simbolo">?</span>',
    html: `<div classname="textos-alert"><h2 class="texto-alert1">¿Querés anotarte a <strong>${disciplina}</strong> a las <strong>${hora}</strong>?</h2><h2 class="texto-alert2">Recuerda que se descontara 1 credito de tu cuenta</h2></div>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, anotarme',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
    popup: 'mi-popup',
    title: 'mi-titulo',
    htmlContainer: 'mi-html',
    confirmButton: 'mi-boton-confirmar',
    cancelButton: 'mi-boton-cancelar',
    }
    });

    if (!result.isConfirmed) {
  console.log('El usuario canceló el SweetAlert');
  return;
}

console.log('El usuario confirmó el SweetAlert');
console.log('Datos enviados:', { userId, classId, fecha });

    try {
      const res = await fetch('http://localhost:3001/api/classes/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, classId, fecha }),
});

console.log('Respuesta de success:', res);


const text = await res.text();
console.log('Texto recibido del backend:', text);

if (!res.ok) {
  console.log('No se pudo hacer el try');
  console.log('Datos enviados:', { userId, classId, fecha });
  throw new Error(text || 'No se pudo registrar');
}

await Swal.fire('¡Registrado!', 'Te anotaste correctamente.', 'success');
setIsRegistered(true);
console.log('funciono el success');
onSuccess?.();

    } catch (err) {
        console.error('Error durante el registro:', err);
        Swal.fire('Error', err.message, 'error');
        }

  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: '<span class="simbolo">¿</span>Cancelar inscripción<span class="simbolo">?</span>',
      html: `¿Querés cancelar tu inscripción a <strong>${disciplina}</strong> a las <strong>${hora}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Desanotarse',
      cancelButtonText: 'Volver',
      buttonsStyling: false,
    customClass: {
    popup: 'mi-popup',
    title: 'mi-titulo',
    htmlContainer: 'mi-html',
    confirmButton: 'mi-boton-confirmar',
    cancelButton: 'mi-boton-cancelar',
    }
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

      await Swal.fire('Inscripción cancelada', '', 'success');
      setIsRegistered(false);
      onSuccess?.();

    } catch (err) {
      Swal.fire('Error', err.message, 'error');
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
