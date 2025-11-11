import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useDisciplines } from '../hooks';
import { useAuth } from '../AuthContext';
import '../styles/ManageDisciplines.css';

const ManageDisciplines = () => {
  const { getToken } = useAuth();
  const { 
    getDisciplinas,
    updateDiscipline,
    deleteDiscipline,
    loading: disciplinesLoading,
    error: disciplinesError,
    clearError 
  } = useDisciplines();

  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDisciplineId, setEditingDisciplineId] = useState(null);
  const [editedDiscipline, setEditedDiscipline] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (title, message, disciplineName = '') => {
    Swal.fire({
      title: title,
      html: disciplineName 
        ? `${message}<br><strong>${disciplineName}</strong>`
        : message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      background: '#ffffff',
      iconColor: '#28a745',
      timer: 3000,
      timerProgressBar: true
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
      background: '#ffffff'
    });
  };

  // Función para mostrar confirmación de eliminación
  const showDeleteConfirmation = (disciplineName) => {
    return Swal.fire({
      title: '¿Eliminar Disciplina?',
      html: `¿Estás seguro de que deseas eliminar la disciplina <strong>"${disciplineName}"</strong>?<br><br>Esta acción no se puede deshacer.`,
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

  const fetchDisciplinas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      clearError();
      
      const token = getToken();
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      console.log('🔄 Solicitando disciplinas al backend...');
      const data = await getDisciplinas(token);
      setDisciplinas(data);
      
    } catch (err) {
      console.error('❌ Error cargando disciplinas:', err);
      const errorMsg = err.message || 'Error al cargar las disciplinas';
      setError(errorMsg);
      showErrorAlert('Error al cargar disciplinas', errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getToken, getDisciplinas, clearError]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchDisciplinas();
    }
  }, []);

  // Función para normalizar los datos de la disciplina
  const normalizeDisciplineData = (disciplina) => {
    return {
      id: disciplina.id_disciplina || disciplina.id,
      name: disciplina.disciplina || disciplina.name || 'Sin nombre',
      active: disciplina.activo !== undefined ? disciplina.activo : true
    };
  };

  const handleEditClick = (disciplina) => {
    const normalizedDiscipline = normalizeDisciplineData(disciplina);
    setEditingDisciplineId(normalizedDiscipline.id);
    setEditedDiscipline({
      name: normalizedDiscipline.name,
      active: normalizedDiscipline.active
    });
  };

  const handleSaveEdit = async (disciplineId) => {
    try {
      setActionLoading(true);
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      if (!editedDiscipline.name?.trim()) {
        throw new Error('El nombre de la disciplina es requerido');
      }

      // Validar longitud del nombre
      if (editedDiscipline.name.trim().length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }

      if (editedDiscipline.name.trim().length > 50) {
        throw new Error('El nombre no puede exceder los 50 caracteres');
      }

      const updateData = {
        name: editedDiscipline.name.trim()
      };

      console.log('📤 Enviando datos de actualización:', updateData);
      await updateDiscipline(token, disciplineId, updateData);

      setEditingDisciplineId(null);
      setEditedDiscipline({});
      
      // Mostrar alerta de éxito con información de la disciplina
      showSuccessAlert(
        '¡Disciplina Actualizada!', 
        'La disciplina ha sido actualizada exitosamente:',
        editedDiscipline.name
      );
      
      // Recargar la lista
      await fetchDisciplinas();
      
    } catch (error) {
      console.error("❌ Error al editar:", error);
      const errorMsg = error.message || "Error al guardar cambios";
      setError(errorMsg);
      showErrorAlert('Error al actualizar disciplina', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDiscipline = async (disciplina) => {
    const normalizedDiscipline = normalizeDisciplineData(disciplina);
    
    try {
      const result = await showDeleteConfirmation(normalizedDiscipline.name);
      
      if (!result.isConfirmed) {
        return;
      }

      setActionLoading(true);
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      await deleteDiscipline(token, normalizedDiscipline.id);
      
      // Mostrar alerta de éxito
      showSuccessAlert(
        '¡Disciplina Eliminada!', 
        'La disciplina ha sido eliminada exitosamente:',
        normalizedDiscipline.name
      );
      
      // Recargar la lista
      await fetchDisciplinas();
      
    } catch (error) {
      console.error("❌ Error eliminando:", error);
      const errorMsg = error.message || "Error al eliminar la disciplina";
      setError(errorMsg);
      showErrorAlert('Error al eliminar disciplina', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Mostrar confirmación si hay cambios sin guardar
    if (editedDiscipline.name) {
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
          setEditingDisciplineId(null);
          setEditedDiscipline({});
        }
      });
    } else {
      setEditingDisciplineId(null);
      setEditedDiscipline({});
    }
  };

  const handleInputChange = (field, value) => {
    setEditedDiscipline(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Combinar estados
  const isLoading = loading || disciplinesLoading;
  const displayError = error || disciplinesError;

  if (isLoading) {
    return (
      <div className="CreateClassContainer">
        <div className="loading-message">
          <FaSpinner className="spinner" />
          <p>Cargando disciplinas...</p>
        </div>
      </div>
    );
  }

  if (displayError && disciplinas.length === 0) {
    return (
      <div className="CreateDisciplinesContainer">
        <div className="error-message">
          <h2>Error</h2>
          <p>{displayError}</p>
          <button onClick={fetchDisciplinas} className="create-discipline-btn" disabled={loading}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return ( 
    <div className="CreateDisciplinesContainer">
      <h2 id='Title-Disciplinas'>Gestión de Disciplinas</h2>
      
      {displayError && (
        <div className="warning-message">
          <p>⚠️ {displayError}</p>
          <button onClick={() => { setError(null); clearError(); }} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      {disciplinas.length === 0 && !isLoading ? (
        <div className="no-data-message">
          <p>No hay disciplinas disponibles</p>
          <button onClick={fetchDisciplinas} className="create-discipline-btn">
            Reintentar
          </button>
        </div>
      ) : (
        <div className="disciplines-list">
          {disciplinas.map((disciplina) => {
            const normalizedDiscipline = normalizeDisciplineData(disciplina);
            const isEditing = editingDisciplineId === normalizedDiscipline.id;
            
            return (
              <div key={normalizedDiscipline.id} className="discipline-item">
                {isEditing ? (
                  <div className="edit-mode">
                    <h3>Editando Disciplina</h3>
                    
                    <div className="form-group">
                      <label>Nombre de la disciplina:</label>
                      <input
                        type="text"
                        value={editedDiscipline.name || ''}
                        onChange={e => handleInputChange('name', e.target.value)}
                        required
                        disabled={actionLoading}
                        placeholder="Ingrese el nombre de la disciplina"
                        maxLength={50}
                      />
                      <div className="character-counter">
                        {editedDiscipline.name?.length || 0}/50 caracteres
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn-save" 
                        onClick={() => handleSaveEdit(normalizedDiscipline.id)}
                        disabled={!editedDiscipline.name?.trim() || actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaSave />}
                        {actionLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button 
                        className="btn-cancel" 
                        onClick={handleCancelEdit}
                        disabled={actionLoading}
                      >
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <h3>{normalizedDiscipline.name}</h3>

                    <div className="disciplines-action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditClick(disciplina)}
                        disabled={actionLoading}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteDiscipline(disciplina)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? <FaSpinner className="spinner" /> : <FaTrash />}
                        {actionLoading ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="disciplines-stats">
        <p>Total de disciplinas: <strong>{disciplinas.length}</strong></p>
      </div>
    </div>
  );
};

export default ManageDisciplines;