// components/ClassUsersModal.jsx
import React from 'react';
import '../styles/ClassUserModal.css';
import { FiUser } from "react-icons/fi";
import { useRegisterMap } from '../hooks/otherHooks/useRegisterMap';

const ClassUsersModal = ({ classId, classType, fecha, onClose, getToken }) => {
  const { 
    registeredUsers, 
    loading, 
    error 
  } = useRegisterMap({
    classId,
    classType,
    fecha,
    getToken
  });

  // Función para obtener el nombre completo del usuario
  const getUserFullName = (user) => {
    return `${user.nombre || ''} ${user.apellido || ''}`.trim();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-users-box">
        <button className="cerrar-modal" onClick={onClose}>X</button>
        <h2>Anotados en la clase</h2>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading-container-modal">
            <div className="loader-modal"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : registeredUsers.length > 0 ? (
          <div className="attendees-list-modal">
            {registeredUsers.map((user, index) => (
              <div key={user.id_usuario || user.id || index} className="user-badge-modal">
                <FiUser className="user-icon-modal" />
                <span className="user-name-modal">
                  {getUserFullName(user)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          !error && <p>No hay usuarios anotados.</p>
        )}
      </div>
    </div>
  );
};

export default ClassUsersModal;