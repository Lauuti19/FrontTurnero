import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import Buscador from './Buscador';
import '../styles/UpdatePassword.css';

const UpdatePassword = () => {
  const { getToken } = useAuth();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (title, message, userName = '') => {
    Swal.fire({
      title: title,
      html: userName 
        ? `${message}<br><strong>${userName}</strong>`
        : message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      background: '#ffffff',
      iconColor: '#28a745',
      timer: 4000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  };

  // Función para mostrar alertas de error
  const showErrorAlert = (title, errorMessage) => {
    Swal.fire({
      title: title,
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545',
      background: '#ffffff',
      showClass: {
        popup: 'animate__animated animate__headShake'
      }
    });
  };

  // Función para mostrar advertencias
  const showWarningAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc107',
      background: '#ffffff',
      iconColor: '#ffc107'
    });
  };

  const validateForm = () => {
    if (!usuarioSeleccionado) {
      showWarningAlert('Usuario requerido', 'Debes seleccionar un usuario para actualizar la contraseña.');
      return false;
    }

    if (!newPassword.trim()) {
      showWarningAlert('Contraseña requerida', 'Debes escribir la nueva contraseña.');
      return false;
    }

    if (newPassword.length < 6) {
      showWarningAlert('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      // Mostrar alerta de carga
      Swal.fire({
        title: 'Actualizando Contraseña...',
        text: 'Por favor espera mientras actualizamos la contraseña',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

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

      // Cerrar alerta de carga
      Swal.close();

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al cambiar la contraseña');
      }

      showSuccessAlert(
        '¡Contraseña Actualizada!', 
        'La contraseña ha sido actualizada exitosamente para el usuario:',
        usuarioSeleccionado.nombre
      );

      // Resetear formulario
      setUsuarioSeleccionado(null);
      setNewPassword('');
      
    } catch (error) {
      // Cerrar alerta de carga si existe
      Swal.close();
      
      console.error('Error actualizando contraseña:', error);
      showErrorAlert('Error al actualizar contraseña', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUsuarioSeleccionado = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  return (
    <div className="CreatePasswordContainer">
      <h2 id="Title-Password">Actualizar Contraseña</h2>

      <form className="form-group-class" onSubmit={handleUpdatePassword}>
        <div className="form-field">
          <label>Buscar Usuario:</label>
          <Buscador 
            onUsuarioSeleccionado={handleUsuarioSeleccionado}
            disabled={loading}
          />
          <div className="helper-text">
            Busca y selecciona un usuario del sistema
          </div>
        </div>

        {usuarioSeleccionado && (
          <div className="user-selected-info">
            <div className="selected-user-card">
              <h4>Usuario Seleccionado:</h4>
              <div className="user-details">
                <div className="user-detail">
                  <strong>Nombre:</strong> {usuarioSeleccionado.nombre}
                </div>
                <div className="user-detail">
                  <strong>Email:</strong> {usuarioSeleccionado.email}
                </div>
                <div className="user-detail">
                  <strong>DNI:</strong> {usuarioSeleccionado.dni}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="form-field">
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ingresa la nueva contraseña (mínimo 7 caracteres)"
            required
            disabled={loading}
            minLength={7}
          />
          <div className="character-counter">
            {newPassword.length}/50 caracteres
          </div>
          <div className="helper-text">
            La contraseña debe tener al menos 7 caracteres
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn-update-password ${loading ? 'loading' : ''}`}
          disabled={loading || !usuarioSeleccionado || !newPassword.trim()}
        >
          {loading ? (
            <>
              <div className="btn-spinner"></div>
              Actualizando Contraseña...
            </>
          ) : (
            'Actualizar Contraseña'
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;