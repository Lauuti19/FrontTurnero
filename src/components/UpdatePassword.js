import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import Buscador from './Buscador';
import '../styles/UpdatePassword.css';

const UpdatePassword = () => {
  const { getToken } = useAuth();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!usuarioSeleccionado || !newPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debes seleccionar un usuario y escribir la nueva contraseña.',
      });
      return;
    }

    try {
      const res = await fetch('https://backturnero-vvk6.onrender.com/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: usuarioSeleccionado.id_usuario,
          nuevaPassword: newPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al cambiar la contraseña');
      }

      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada correctamente',
        timer: 1500,
        showConfirmButton: false,
      });

      setUsuarioSeleccionado(null);
      setNewPassword('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  return (
    <div className="update-password-container">
      <div className="update-password-box">
        <h2 className="update-password-title">Actualizar contraseña</h2>
        <p className="update-password-subtitle">
          Busca un usuario y asigna una nueva contraseña de forma segura.
        </p>

        <form className="update-password-form" onSubmit={handleUpdatePassword}>
          <div className="form-field">
            <label>Buscar usuario</label>
            <Buscador onUsuarioSeleccionado={setUsuarioSeleccionado} />
          </div>

          {usuarioSeleccionado && (
            <p className="user-selected">
              Usuario: <strong>{usuarioSeleccionado.nombre}</strong> 
            </p>
          )}

          <div className="form-field">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Escribe la nueva contraseña"
              required
            />
          </div>

          <button type="submit" className="update-password-btn">
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
