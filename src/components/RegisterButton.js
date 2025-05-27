import React from 'react';
import Swal from 'sweetalert2';

const RegisterButton = ({ classId, fecha, hora, disciplina, userId, onSuccess, disabled }) => {
const handleRegister = async () => {
const result = await Swal.fire({
title: '¿Confirmar inscripción?',
html: `¿Querés anotarte a <strong>${disciplina}</strong> a las <strong>${hora}</strong>?`,
icon: 'question',
showCancelButton: true,
confirmButtonText: 'Sí, anotarme',
cancelButtonText: 'Cancelar',
reverseButtons: true,
});
if (result.isConfirmed) {
  try {
    const res = await fetch('http://localhost:3001/api/classes/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        classId,
        fecha,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'No se pudo registrar la clase');
    }

    await Swal.fire('¡Registrado!', 'Te anotaste correctamente.', 'success');
    onSuccess?.();
  } catch (error) {
    console.error(error);
    Swal.fire('Error', error.message, 'error');
  }
}
};

return (
    <button className="botonReservar" onClick={handleRegister} disabled={disabled}>
      <h3>{disabled ? "Anotado" : "Anotarse"}</h3>
    </button>
    );
};

export default RegisterButton;