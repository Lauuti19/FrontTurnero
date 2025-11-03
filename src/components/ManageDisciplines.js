import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaDumbbell, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useDisciplines } from '../hooks';
import { useAuth } from '../AuthContext';
import '../styles/ManageDisciplines.css';

const ManageDisciplines = () => {
  const { getToken } = useAuth();
  const { getDisciplinas, updateDisciplina, deleteDisciplina } = useDisciplines(); // ✅ Se usa correctamente el hook

  const [disciplinas, setDisciplinas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDisciplinas = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      const data = await getDisciplinas(token);
      setDisciplinas(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando disciplinas:', err);
      setError(err.message || 'Error al cargar las disciplinas');
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const handleEditClick = (disciplina) => {
    setEditing(disciplina.id_disciplina);
    setEditName(disciplina.disciplina || disciplina.nombre || '');
  };

  const handleEditSave = async (id) => {
    if (!editName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre requerido',
        text: 'El nombre de la disciplina es obligatorio.',
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Guardar cambios?',
      text: 'Se actualizará el nombre de la disciplina.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación disponible');

        await updateDisciplina(token, id, { name: editName.trim() });

        await Swal.fire({
          icon: 'success',
          title: 'Disciplina actualizada',
          showConfirmButton: false,
          timer: 1500
        });

        setEditing(null);
        await fetchDisciplinas();
      } catch (error) {
        console.error('Error actualizando disciplina:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo actualizar la disciplina'
        });
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la disciplina del sistema.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = getToken();
        if (!token) throw new Error('No hay token de autenticación disponible');

        await deleteDisciplina(token, id);

        await Swal.fire({
          icon: 'success',
          title: 'Disciplina eliminada',
          showConfirmButton: false,
          timer: 1500
        });

        await fetchDisciplinas();
      } catch (error) {
        console.error('Error eliminando disciplina:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo eliminar la disciplina'
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setEditName('');
  };

  const getDisciplinaNombre = (disciplina) => {
    return disciplina.disciplina || disciplina.nombre || 'Sin nombre';
  };

  if (loading) {
    return (
      <div className="manage-disciplines-container">
        <div className="manage-disciplines-box">
          <div className="loading-container">
            <p>Cargando disciplinas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && disciplinas.length === 0) {
    return (
      <div className="manage-disciplines-container">
        <div className="manage-disciplines-box">
          <div className="error-message">
            <h2>Disciplinas</h2>
            <p>{error}</p>
            <button onClick={fetchDisciplinas} className="retry-btn">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-disciplines-container">
      <div className="manage-disciplines-box">
        <h2 className="manage-disciplines-title">Gestión de Disciplinas</h2>
        <p className="manage-disciplines-subtitle">
          Administra las disciplinas disponibles en el sistema. Edita o elimina según sea necesario.
        </p>

        {error && (
          <div className="warning-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        <div className="disciplines-list">
          {disciplinas.length === 0 ? (
            <div className="no-disciplines">
              <p>No hay disciplinas disponibles</p>
            </div>
          ) : (
            disciplinas.map((disciplina) => (
              <div key={disciplina.id_disciplina} className="discipline-card">
                {editing === disciplina.id_disciplina ? (
                  <div className="discipline-edit">
                    <div className="edit-header">
                      <FaDumbbell className="edit-icon" />
                      <span>Editando disciplina</span>
                    </div>
                    
                    <div className="edit-form">
                      <div className="form-field">
                        <label>Nombre de la disciplina</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Nombre de la disciplina"
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button 
                        className="btn-save" 
                        onClick={() => handleEditSave(disciplina.id_disciplina)}
                        disabled={!editName.trim()}
                      >
                        <FaSave /> Guardar
                      </button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="discipline-view">
                    <div className="discipline-header">
                      <div className="discipline-info">
                        <FaDumbbell className="discipline-icon" />
                        <h3>{getDisciplinaNombre(disciplina)}</h3>
                      </div>
                      <div className="discipline-actions">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEditClick(disciplina)}
                          title="Editar disciplina"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(disciplina.id_disciplina)}
                          title="Eliminar disciplina"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    <div className="discipline-meta">
                      {disciplina.activo !== undefined && (
                        <span className={`status ${disciplina.activo ? 'active' : 'inactive'}`}>
                          {disciplina.activo ? 'Activa' : 'Inactiva'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="disciplines-stats">
          <p>Total de disciplinas: <strong>{disciplinas.length}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default ManageDisciplines;
