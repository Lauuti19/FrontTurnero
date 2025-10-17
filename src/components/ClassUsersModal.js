import React, { useEffect, useState } from 'react';
import '../styles/ClassUserModal.css';
import { FiUser } from "react-icons/fi";
import { useAuth } from '../AuthContext';
import { classService } from '../services/classService'; // Importar el service

const ClassUsersModal = ({ classId, fecha, onClose, getToken }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken: authGetToken } = useAuth();

  // Función unificada para obtener token
  const obtenerToken = () => {
    return getToken ? getToken() : authGetToken();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = obtenerToken();
        if (!token) {
          throw new Error("No hay token disponible");
        }

        // Usar el service en lugar de fetch directo
        const data = await classService.getClassUsers(token, classId, fecha);
        setUsers(data);
      } catch (err) {
        console.error('Error al obtener los usuarios anotados:', err);
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (classId && fecha) {
      fetchUsers();
    }
  }, [classId, fecha, obtenerToken]); 

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
          <div className="loading-container">
            <p>Cargando usuarios...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="attendees-list-modal">
            {users.map((user, index) => (
              <div key={user.id_usuario || index} className="user-badge-modal">
                <FiUser className="user-icon-modal" />
                <span className="user-name-modal">{user.nombre} {user.apellido}</span>
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