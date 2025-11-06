import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { usePlans } from '../hooks';
import { useAuth } from '../AuthContext';
import '../styles/ManagePlans.css';

const ManagePlanes = () => {
  const { getToken } = useAuth();
  const { 
    getPlanes, 
    updatePlan, 
    deletePlan, 
    loading: plansLoading, 
    error: plansError,
    clearError,
    plans: plansFromHook
  } = usePlans(); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editedPlan, setEditedPlan] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (title, message, planName = '') => {
    Swal.fire({
      title: title,
      html: planName 
        ? `${message}<br><strong>${planName}</strong>`
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
  const showDeleteConfirmation = (planName) => {
    return Swal.fire({
      title: '¿Eliminar Plan?',
      html: `¿Estás seguro de que deseas eliminar el plan <strong>"${planName}"</strong>?<br><br>Esta acción no se puede deshacer.`,
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

  const fetchPlanes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      clearError();
      
      const token = getToken();
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      console.log('🔄 Solicitando planes al backend...');
      await getPlanes(token);
      
    } catch (err) {
      console.error('❌ Error cargando planes:', err);
      const errorMsg = err.message || 'Error al cargar los planes';
      setError(errorMsg);
      showErrorAlert('Error al cargar planes', errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getToken, getPlanes, clearError]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchPlanes();
    }
  }, []);

  // Función para normalizar los datos del plan
  const normalizePlanData = (plan) => {
    return {
      id: plan.id_plan || plan.id,
      name: plan.nombre || plan.name,
      description: plan.descripcion || plan.description,
      price: plan.monto || plan.price,
      totalCredits: plan.creditos_total || plan.totalCredits,
      disciplines: plan.disciplinas || plan.disciplines || []
    };
  };

  const handleEditClick = (plan) => {
    const normalizedPlan = normalizePlanData(plan);
    setEditingPlanId(normalizedPlan.id);
    setEditedPlan({
      name: normalizedPlan.name,
      description: normalizedPlan.description,
      price: normalizedPlan.price,
      totalCredits: normalizedPlan.totalCredits,
      disciplines: normalizedPlan.disciplines
    });
  };

  const handleSaveEdit = async (planId) => {
    try {
      setActionLoading(true);
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      if (!editedPlan.name?.trim()) {
        throw new Error('El nombre del plan es requerido');
      }
      if (!editedPlan.description?.trim()) {
        throw new Error('La descripción del plan es requerida');
      }

      const updateData = {
        planId: planId,
        name: editedPlan.name.trim(),
        description: editedPlan.description.trim(),
        price: parseFloat(editedPlan.price) || 0,
        totalCredits: parseInt(editedPlan.totalCredits) || 0,
        disciplines: editedPlan.disciplines || []
      };

      console.log('📤 Enviando datos de actualización:', updateData);
      await updatePlan(token, updateData);

      setEditingPlanId(null);
      setEditedPlan({});
      
      // Mostrar alerta de éxito con información del plan
      showSuccessAlert(
        '¡Plan Actualizado!', 
        'El plan ha sido actualizado exitosamente:',
        editedPlan.name
      );
      
    } catch (error) {
      console.error("❌ Error al editar:", error);
      const errorMsg = error.message || "Error al guardar cambios";
      setError(errorMsg);
      showErrorAlert('Error al actualizar plan', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async (plan) => {
    const normalizedPlan = normalizePlanData(plan);
    
    try {
      const result = await showDeleteConfirmation(normalizedPlan.name);
      
      if (!result.isConfirmed) {
        return;
      }

      setActionLoading(true);
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      await deletePlan(token, normalizedPlan.id);
      
      // Mostrar alerta de éxito
      showSuccessAlert(
        '¡Plan Eliminado!', 
        'El plan ha sido eliminado exitosamente:',
        normalizedPlan.name
      );
      
    } catch (error) {
      console.error("❌ Error eliminando:", error);
      const errorMsg = error.message || "Error al eliminar el plan";
      setError(errorMsg);
      showErrorAlert('Error al eliminar plan', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Mostrar confirmación si hay cambios sin guardar
    if (editedPlan.name || editedPlan.description) {
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
          setEditingPlanId(null);
          setEditedPlan({});
        }
      });
    } else {
      setEditingPlanId(null);
      setEditedPlan({});
    }
  };

  const handleInputChange = (field, value) => {
    setEditedPlan(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Combinar estados
  const isLoading = loading || plansLoading;
  const displayError = error || plansError;
  const planes = plansFromHook;

  if (isLoading) {
    return (
      <div className="CreateClassContainer">
        <div className="loading-message">
          <FaSpinner className="spinner" />
          <p>Cargando planes...</p>
        </div>
      </div>
    );
  }

  if (displayError && planes.length === 0) {
    return (
      <div className="CreatePlanesContainer">
        <div className="error-message">
          <h2>Error</h2>
          <p>{displayError}</p>
          <button onClick={fetchPlanes} className="create-plan-btn" disabled={loading}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return ( 
    <div className="CreatePlanesContainer">
      <h2 id='Title-Planes'>Gestión de Planes</h2>
      
      {displayError && (
        <div className="warning-message">
          <p>⚠️ {displayError}</p>
          <button onClick={() => { setError(null); clearError(); }} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      {planes.length === 0 && !isLoading ? (
        <div className="no-data-message">
          <p>No hay planes disponibles</p>
          <button onClick={fetchPlanes} className="create-plan-btn">
            Reintentar
          </button>
        </div>
      ) : (
        <div className="plans-list">
          {planes.map((plan) => {
            const normalizedPlan = normalizePlanData(plan);
            const isEditing = editingPlanId === normalizedPlan.id;
            
            return (
              <div key={normalizedPlan.id} className="plan-item">
                {isEditing ? (
                  <div className="edit-mode">
                    <h3>Editando Plan</h3>
                    
                    <div className="form-group">
                      <label>Nombre del plan:</label>
                      <input
                        type="text"
                        value={editedPlan.name || ''}
                        onChange={e => handleInputChange('name', e.target.value)}
                        required
                        disabled={actionLoading}
                        placeholder="Ingrese el nombre del plan"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Descripción:</label>
                      <textarea
                        value={editedPlan.description || ''}
                        onChange={e => handleInputChange('description', e.target.value)}
                        required
                        rows="3"
                        disabled={actionLoading}
                        placeholder="Ingrese la descripción del plan"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Precio ($):</label>
                        <input
                          type="number"
                          value={editedPlan.price || ''}
                          onChange={e => handleInputChange('price', e.target.value)}
                          required
                          min="0"
                          step="0.01"
                          disabled={actionLoading}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Créditos totales:</label>
                        <input
                          type="number"
                          value={editedPlan.totalCredits || ''}
                          onChange={e => handleInputChange('totalCredits', e.target.value)}
                          required
                          min="1"
                          disabled={actionLoading}
                        />
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn-save" 
                        onClick={() => handleSaveEdit(normalizedPlan.id)}
                        disabled={!editedPlan.name?.trim() || !editedPlan.description?.trim() || actionLoading}
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
                    <h3>{normalizedPlan.name}</h3>
                    <p><strong>Descripción:</strong> {normalizedPlan.description}</p>
                    <p><strong>Precio:</strong> ${normalizedPlan.price}</p>
                    <p><strong>Créditos:</strong> {normalizedPlan.totalCredits}</p>
                    
                    <div className="plans-action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditClick(plan)}
                        disabled={actionLoading}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeletePlan(plan)}
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
    </div>
  );
};

export default ManagePlanes;