// src/components/ClassUsersModal.jsx
import React, { useEffect, useState } from 'react';
import '../styles/ClassUserModal.css'; 

const ClassUsersModal = ({ classId, fecha, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/classes/users-by-class?classId=${classId}&fecha=${fecha}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error al obtener los usuarios anotados:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [classId, fecha]);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="cerrar-modal" onClick={onClose}>X</button>
        <h2>Anotados en la clase</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : users.length > 0 ? (
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user.nombre}</li>
            ))}
          </ul>
        ) : (
          <p>No hay usuarios anotados.</p>
        )}
      </div>
    </div>
  );
};

export default ClassUsersModal;
