import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSave, FaDumbbell, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import { useExercises } from '../hooks/useExercises';
import '../styles/ManageExercises.css';

const ManageExercises = () => {
  const { 
    exercises, 
    fetchExercises, 
    updateExercise, 
    deleteExercise,
    loading, 
    error, 
    setError 
  } = useExercises();

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', link: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (title, message, exerciseName = '') => {
    Swal.fire({
      title: title,
      html: exerciseName 
        ? `${message}<br><strong>${exerciseName}</strong>`
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

  // Función para mostrar confirmación de eliminación
  const showDeleteConfirmation = (exerciseName) => {
    return Swal.fire({
      title: '¿Eliminar Ejercicio?',
      html: `¿Estás seguro de que deseas eliminar el ejercicio <strong>"${exerciseName}"</strong>?<br><br>Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      background: '#ffffff',
      reverseButtons: true
    });
  };

  const handleDelete = async (exercise) => {
    try {
      const result = await showDeleteConfirmation(exercise.nombre);
      
      if (!result.isConfirmed) {
        return;
      }

      setActionLoading(true);
      await deleteExercise(exercise.id_ejercicio);

      showSuccessAlert(
        '¡Ejercicio Eliminado!', 
        'El ejercicio ha sido eliminado exitosamente:',
        exercise.nombre
      );
      
    } catch (err) {
      console.error('Error eliminando ejercicio:', err);
      showErrorAlert('Error al eliminar ejercicio', err.message || 'No se pudo eliminar el ejercicio');
    } finally {
      setActionLoading(false);
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

  const validateEditForm = () => {
    if (!editForm.name.trim()) {
      Swal.fire({
        title: 'Nombre requerido',
        text: 'El nombre del ejercicio es obligatorio.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ffc107'
      });
      return false;
    }

    if (editForm.name.trim().length < 2) {
      Swal.fire({
        title: 'Nombre muy corto',
        text: 'El nombre debe tener al menos 2 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ffc107'
      });
      return false;
    }

    if (editForm.name.trim().length > 100) {
      Swal.fire({
        title: 'Nombre muy largo',
        text: 'El nombre no puede exceder los 100 caracteres.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ffc107'
      });
      return false;
    }

    if (editForm.link && !isValidUrl(editForm.link)) {
      Swal.fire({
        title: 'Enlace inválido',
        text: 'Por favor ingresa una URL válida (YouTube, Vimeo, etc.).',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ffc107'
      });
      return false;
    }

    return true;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleEditSave = async (id) => {
    if (!validateEditForm()) {
      return;
    }

    try {
      setActionLoading(true);

      // Mostrar alerta de carga
      Swal.fire({
        title: 'Actualizando Ejercicio...',
        text: 'Por favor espera mientras actualizamos el ejercicio',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await updateExercise(id, {
        name: editForm.name.trim(),
        link: editForm.link.trim() || null
      });

      // Cerrar alerta de carga
      Swal.close();

      showSuccessAlert(
        '¡Ejercicio Actualizado!', 
        'El ejercicio ha sido actualizado exitosamente:',
        editForm.name
      );

      setEditing(null);
      setEditForm({ name: '', link: '' });
      
    } catch (err) {
      // Cerrar alerta de carga si existe
      Swal.close();
      
      console.error('Error actualizando ejercicio:', err);
      showErrorAlert('Error al actualizar ejercicio', err.message || 'No se pudo actualizar el ejercicio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Mostrar confirmación si hay cambios sin guardar
    if (editForm.name || editForm.link) {
      Swal.fire({
        title: '¿Descartar cambios?',
        text: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Seguir editando',
        confirmButtonColor: '#6c757d',
        cancelButtonColor: '#007bff',
        background: '#ffffff'
      }).then((result) => {
        if (result.isConfirmed) {
          setEditing(null);
          setEditForm({ name: '', link: '' });
        }
      });
    } else {
      setEditing(null);
      setEditForm({ name: '', link: '' });
    }
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'enlace';
    }
  };

  if (loading) {
    return (
      <div className="ManageExercisesContainer">
        <div className="loading-message">
          <FaSpinner className="spinner" />
          <p>Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  if (error && exercises.length === 0) {
    return (
      <div className="ManageExercisesContainer">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchExercises} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ManageExercisesContainer">
      <h2 id="Title-GestionEjercicios">Gestión de Ejercicios</h2>

      {error && (
        <div className="warning-message">
          <p>⚠️ {error}</p>
          <button onClick={() => setError(null)} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      <div className="exercises-content">

        {exercises.length === 0 ? (
          <div className="no-data-message">
            <div className="no-data-icon">💪</div>
            <p>No hay ejercicios disponibles</p>
            <span>Los ejercicios creados aparecerán aquí</span>
          </div>
        ) : (
          <div className="exercises-grid">
            {exercises.map((exercise) => (
              <div key={exercise.id_ejercicio} className="exercise-card">
                {editing === exercise.id_ejercicio ? (
                  <div className="exercise-edit">
                    <div className="edit-header">
                      <FaDumbbell className="edit-icon" />
                      <h4>Editando Ejercicio</h4>
                    </div>
                    
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Nombre del Ejercicio:</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          placeholder="Ingresa el nombre del ejercicio"
                          required
                          disabled={actionLoading}
                          maxLength={100}
                        />
                        <div className="character-counter">
                          {editForm.name.length}/100 caracteres
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Enlace de Video (Opcional):</label>
                        <input
                          type="url"
                          name="link"
                          value={editForm.link}
                          onChange={handleEditChange}
                          placeholder="https://youtube.com/ejemplo"
                          disabled={actionLoading}
                        />
                        <div className="helper-text">
                          Enlace a YouTube, Vimeo o cualquier plataforma de video
                        </div>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button 
                        className="btn-save" 
                        onClick={() => handleEditSave(exercise.id_ejercicio)}
                        disabled={!editForm.name.trim() || actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaSave />}
                        {actionLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button 
                        className="btn-cancel" 
                        onClick={handleCancelEdit}
                        disabled={actionLoading}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="exercise-view">
                    <div className="exercise-header">
                      <div className="exercise-info">
                        <FaDumbbell className="exercise-icon" />
                        <h3>{exercise.nombre}</h3>
                      </div>
                      <div className="exercise-actions">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEditClick(exercise)}
                          disabled={actionLoading}
                          title="Editar ejercicio"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(exercise)}
                          disabled={actionLoading}
                          title="Eliminar ejercicio"
                        >
                          {actionLoading ? <FaSpinner className="spinner" /> : <FaTrash />}
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
                          title="Ver video demostrativo"
                        >
                          <FaExternalLinkAlt className="link-icon" />
                          <span className="link-text">
                            Ver video demostrativo
                          </span>
                        </a>
                      </div>
                    )}
                    
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageExercises;