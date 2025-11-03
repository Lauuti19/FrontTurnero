// components/ClassUsersModal.jsx
import React from 'react';
import '../styles/ClassUserModal.css';
import { FiUser } from "react-icons/fi";
import { useClassUsers } from '../hooks/otherHooks/useClassUsers';

const ClassUsersModal = ({ classId, classType, fecha, onClose, getToken }) => {
  const { users, loading, error } = useClassUsers(classId, classType, fecha, getToken);

  return (
    <div className="modal-overlay">
      <div className="modal-users-box">
        <button className="cerrar-modal" onClick={onClose}>X</button>
        <h2>Anotados en la clase</h2>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading-container"><p>Cargando usuarios...</p></div>
        ) : users.length > 0 ? (
          <div className="attendees-list-modal">
            {users.map((u, i) => (
              <div key={u.id_usuario || i} className="user-badge-modal">
                <FiUser className="user-icon-modal" />
                <span className="user-name-modal">
                  {u.nombre} {u.apellido}
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