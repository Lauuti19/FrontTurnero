import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { usePlans } from '../hooks';
import { useAuth } from '../AuthContext';
import '../styles/ManagePlans.css';

const ManagePlans = () => {
  const { getToken } = useAuth();
  const { 
    getAllPlans, 
    updatePlan, 
    deletePlan, 
    loading: plansLoading, 
    error: plansError,
    clearError 
  } = usePlans(); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editedPlan, setEditedPlan] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPlanes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      clearError();
      
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      const data = await getAllPlans(token);
      
      // Asegurarnos de que siempre sea un array
      if (Array.isArray(data)) {
        setPlanes(data);
      } else if (data && typeof data === 'object') {
        // Intentar extraer el array de diferentes estructuras posibles
        const planesArray = data.planes || data.data || Object.values(data).find(Array.isArray) || [];
        setPlanes(planesArray);
      } else {
        setPlanes([]);
      }
      
    } catch (err) {
      console.error('Error cargando planes:', err);
      const errorMsg = err.message || 'Error al cargar los planes';
      setError(errorMsg);
      setPlanes([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, getAllPlans, clearError]);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const handleEditClick = (plan) => {
    setEditingPlanId(plan.id_plan || plan.id);
    setEditedPlan({
      name: plan.nombre || plan.name,
      description: plan.descripcion || plan.description,
      price: plan.monto || plan.price,
      totalCredits: plan.creditos_total || plan.totalCredits,
      disciplines: plan.disciplinas || plan.disciplines || []
    });
  };

  const handleSaveEdit = async (planId) => {
    try {
      setActionLoading(true);
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      // Preparar datos para la actualización
      const updateData = {
        id_plan: planId,
        name: editedPlan.name,
        description: editedPlan.description,
        price: parseFloat(editedPlan.price),
        totalCredits: parseInt(editedPlan.totalCredits),
        disciplines: editedPlan.disciplines
      };

      await updatePlan(token, updateData);

      setEditingPlanId(null);
      setEditedPlan({});
      
      // Recargar la lista
      await fetchPlanes();
      
      // Mostrar alerta de éxito
      alert('✅ Plan actualizado exitosamente');
    } catch (error) {
      console.error("Error al editar:", error);
      const errorMsg = error.message || "Error al guardar cambios";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este plan?");
    if (!confirm) return;

    try {
      setActionLoading(true);
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      await deletePlan(token, planId);

      // Actualizar estado local inmediatamente
      setPlanes(prev => prev.filter(p => (p.id_plan || p.id) !== planId));
      
      alert('✅ Plan eliminado exitosamente');
    } catch (error) {
      console.error("Error eliminando:", error);
      const errorMsg = error.message || "Error al eliminar el plan";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlanId(null);
    setEditedPlan({});
  };

  const handleInputChange = (field, value) => {
    setEditedPlan(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Combinar errores del hook y del componente
  const displayError = error || plansError;

  if (loading) {
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
      <div className="CreateClassContainer">
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
    <div className="CreateClassContainer">
      <h2 id='Title-Planes'>Gestión de Planes</h2>
      
      {displayError && (
        <div className="warning-message">
          <p>⚠️ {displayError}</p>
          <button onClick={() => { setError(null); clearError(); }} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      {planes.length === 0 && !loading ? (
        <div className="no-data-message">
          <p>No hay planes disponibles</p>
          <button onClick={fetchPlanes} className="create-plan-btn">
            Reintentar
          </button>
        </div>
      ) : (
        <div className="plans-list">
          {planes.map((plan) => {
            const planId = plan.id_plan || plan.id;
            const isEditing = editingPlanId === planId;
            
            return (
              <div key={planId} className="plan-item">
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
                        onClick={() => handleSaveEdit(planId)}
                        disabled={!editedPlan.name || !editedPlan.description || actionLoading}
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
                    <h3>{plan.nombre || plan.name}</h3>
                    <p><strong>Descripción:</strong> {plan.descripcion || plan.description}</p>
                    <p><strong>Precio:</strong> ${plan.monto || plan.price}</p>
                    <p><strong>Créditos:</strong> {plan.creditos_total || plan.totalCredits}</p>
                    <p><strong>Disciplinas:</strong> {(plan.disciplinas || plan.disciplines || []).length} incluidas</p>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditClick(plan)}
                        disabled={actionLoading}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeletePlan(planId)}
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

export default ManagePlans;