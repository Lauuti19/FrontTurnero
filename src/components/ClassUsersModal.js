import React, { useEffect, useState } from 'react';
import '../styles/ClassUserModal.css';
import { FiUser } from "react-icons/fi";
import { useAuth } from '../AuthContext';
import { classService } from '../services/classService';

const ClassUsersModal = ({ classId, classType, fecha, onClose, getToken }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken: authGetToken } = useAuth();

  const obtenerToken = () => (getToken ? getToken() : authGetToken());

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = obtenerToken();
        if (!token) throw new Error("No hay token disponible");

        // ✅ ahora sí: classId + classType + fecha
        const data = await classService.getClassUsers(token, {
          classId,
          classType,           // "normal" o "especial"
          fecha,
        });

        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al obtener los usuarios anotados:', err);
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    // solo traigo si tengo todo
    if (classId && fecha && classType) {
      fetchUsers();
    } else {
      // si por algún motivo no vino el tipo, marcamos error legible
      if (!classType) {
        setError("Falta el tipo de clase (normal/especial)");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, classType, fecha]);

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
