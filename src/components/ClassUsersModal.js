import React, { useEffect, useState } from 'react';
import '../styles/ClassUserModal.css';
import { FiUser } from "react-icons/fi";
import { useAuth } from '../AuthContext'; // Importar el AuthContext

const ClassUsersModal = ({ classId, fecha, onClose, getToken }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken: authGetToken } = useAuth(); // Obtener getToken del contexto

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Usar getToken pasado como prop o del contexto
        const token = getToken ? getToken() : authGetToken();
        if (!token) {
          console.error("No hay token disponible");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `https://backturnero.onrender.com/api/classes/users-by-class?classId=${classId}&fecha=${fecha}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setUsers(data);
        console.log('Usuarios obtenidos:', data);
      } catch (err) {
        console.error('Error al obtener los usuarios anotados:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (classId && fecha) {
      fetchUsers();
    }
  }, [classId, fecha, getToken, authGetToken]);

  return (
    <div className="modal-overlay">
      <div className="modal-users-box">
        <button className="cerrar-modal" onClick={onClose}>X</button>
        <h2>Anotados en la clase</h2>
        {loading ? (
          <p>Cargando...</p>
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
          <p>No hay usuarios anotados.</p>
        )}
      </div>
    </div>
  );
};

export default ClassUsersModal;