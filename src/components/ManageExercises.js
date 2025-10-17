import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSave, FaDumbbell } from 'react-icons/fa';
import { HiOutlineX } from "react-icons/hi";
import { exerciseService } from '../services/exerciseService';
import { useAuth } from '../AuthContext';
import '../styles/ManageExercises.css';

const ManageExercises = () => {
  const { getToken } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', link: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const data = await exerciseService.getExercises(token);
      setExercises(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando ejercicios:', err);
      setError(err.message || 'Error al cargar los ejercicios');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el ejercicio del sistema.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = getToken();
        
        if (!token) {
          throw new Error('No hay token de autenticación disponible');
        }

        await exerciseService.deleteExercise(token, id);

        await Swal.fire({
          icon: 'success',
          title: 'Ejercicio eliminado',
          showConfirmButton: false,
          timer: 1500
        });

        await fetchExercises();
      } catch (err) {
        console.error('Error eliminando ejercicio:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'No se pudo eliminar el ejercicio'
        });
      }
    }
  };

  const handleEditClick = (exercise) => {
    setEditing(exercise.id_ejercicio);
    setEditForm({ 
      name: exercise.nombre, 
      link: exercise.link || '' 
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    if (!editForm.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre requerido',
        text: 'El nombre del ejercicio es obligatorio.',
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Guardar cambios?',
      text: 'Se actualizará la información del ejercicio.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = getToken();
        
        if (!token) {
          throw new Error('No hay token de autenticación disponible');
        }

        await exerciseService.updateExercise(token, id, {
          name: editForm.name.trim(),
          link: editForm.link.trim()
        });

        await Swal.fire({
          icon: 'success',
          title: 'Ejercicio actualizado',
          showConfirmButton: false,
          timer: 1500
        });

        setEditing(null);
        await fetchExercises();
      } catch (err) {
        console.error('Error actualizando ejercicio:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'No se pudo actualizar el ejercicio'
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setEditForm({ name: '', link: '' });
  };

  //if (loading) {
  //  return (
  //    <div className="manage-exercises-container">
  //      <div className="manage-exercises-box">
  //        <div className="loading-container">
  //          <p>Cargando ejercicios...</p>
  //        </div>
  //      </div>
  //    </div>
  //  );
  //}

  if (error && exercises.length === 0) {
    return (
      <div className="manage-exercises-container">
        <div className="manage-exercises-box">
          <div className="error-message">
            <h2>Ejercicios</h2>
            <p>{error}</p>
            <button onClick={fetchExercises} className="retry-btn">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-exercises-container">
      <div className="manage-exercises-box">
        <h2 className="manage-exercises-title">Gestión de Ejercicios</h2>
        <p className="manage-exercises-subtitle">
          Administra los ejercicios del sistema. Edita o elimina según sea necesario.
        </p>

        {error && (
          <div className="warning-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        <div className="exercises-list">
          {exercises.length === 0 ? (
            <div className="no-exercises">
              <p>No hay ejercicios disponibles</p>
            </div>
          ) : (
            exercises.map((exercise) => (
              <div key={exercise.id_ejercicio} className="exercise-card">
                {editing === exercise.id_ejercicio ? (
                  <div className="exercise-edit">
                    <div className="edit-header">
                      <FaDumbbell className="edit-icon" />
                      <span>Editando ejercicio</span>
                    </div>
                    
                    <div className="edit-form">
                      <div className="form-field">
                        <label>Nombre del ejercicio</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          placeholder="Nombre del ejercicio"
                          required
                        />
                      </div>
                      
                      <div className="form-field">
                        <label>Enlace de video (opcional)</label>
                        <input
                          type="text"
                          name="link"
                          value={editForm.link}
                          onChange={handleEditChange}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button 
                        className="btn-save" 
                        onClick={() => handleEditSave(exercise.id_ejercicio)}
                        disabled={!editForm.name.trim()}
                      >
                        <FaSave /> Guardar
                      </button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>
                        <HiOutlineX /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="exercise-view">
                    <div className="exercise-header">
                      <div className="exercise-title">
                        <FaDumbbell className="exercise-icon" />
                        <h3>{exercise.nombre}</h3>
                      </div>
                      <div className="exercise-actions">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEditClick(exercise)}
                          title="Editar ejercicio"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(exercise.id_ejercicio)}
                          title="Eliminar ejercicio"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {exercise.link && (
                      <div className="exercise-link-container">
                        <a
                          href={exercise.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="exercise-link"
                        >
                          📹 Ver video demostrativo
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageExercises;