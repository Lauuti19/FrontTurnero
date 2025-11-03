import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { usePlans } from '../hooks';
import { useAuth } from '../AuthContext';
import '../styles/CreateClass.css';

const ManagePlans = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editedPlan, setEditedPlan] = useState({});

  
  const fetchPlanes = useCallback(async () => {
  try {
    setLoading(true);
    const token = getToken();
    if (!token) throw new Error('No hay token de autenticación disponible');

    const data = await usePlans.getPlanes(token);
    if (Array.isArray(data)) setPlanes(data);
    else if (data?.planes) setPlanes(data.planes);
    else if (data?.data) setPlanes(data.data);
    else {
      console.warn('Los datos no son un array:', data);
      setPlanes([]);
    }
    setError(null);
  } catch (err) {
    console.error('Error cargando planes:', err);
    setError(err.message || 'Error al cargar los planes');
    setPlanes([]);
  } finally {
    setLoading(false);
  }
}, [getToken]);


  const handleEditClick = (plan) => {
    setEditingPlanId(plan.id_plan);
    setEditedPlan({
      name: plan.nombre,
      description: plan.descripcion,
      price: plan.monto,
      totalCredits: plan.creditos_total
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      // Usar el servicio de planes en lugar de fetch directo
      await usePlans.updatePlan(token, id, {
        name: editedPlan.name,
        description: editedPlan.description,
        price: parseFloat(editedPlan.price),
        totalCredits: parseInt(editedPlan.totalCredits)
      });

      setEditingPlanId(null);
      // Recargar la lista de planes
      await fetchPlanes();
      
      alert('✅ Plan actualizado exitosamente');
    } catch (error) {
      console.error("Error al editar:", error);
      alert(error.message || "Error al guardar cambios");
    }
  };

  const handleDeletePlan = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este plan?");
    if (!confirm) return;

    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      // Usar el servicio de planes en lugar de fetch directo
      await usePlans.deletePlan(token, id);
      
      // Actualizar el estado local
      setPlanes(prev => prev.filter(p => p.id_plan !== id));
      alert('✅ Plan eliminado exitosamente');
    } catch (error) {
      console.error("Error eliminando:", error);
      alert(error.message || "Error al eliminar el plan");
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

  // Asegurarnos de que planes siempre sea un array para el render
  const planesArray = Array.isArray(planes) ? planes : [];

  //if (loading) {
  //  return (
  //    <div className="CreateClassContainer">
  //      <div className="loading-container">
  //        <p>Cargando planes...</p>
  //      </div>
  //    </div>
  //  );
  //}

  if (error && planesArray.length === 0) {
    return (
      <div className="CreateClassContainer">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchPlanes} className="create-plan-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="CreateClassContainer">
      <h2 id='Title-Planes'>Gestión de Planes</h2>
      
      {error && (
        <div className="warning-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {planesArray.length === 0 && !loading ? (
        <div className="no-data-message">
          <p>No hay planes disponibles</p>
        </div>
      ) : (
        <div className="plans-list">
          {planesArray.map((plan) => (
            <div key={plan.id_plan} className="plan-item">
              {editingPlanId === plan.id_plan ? (
                <div className="edit-mode">
                  <h3>Editando Plan</h3>
                  
                  <div className="form-group">
                    <label>Nombre del plan:</label>
                    <input
                      type="text"
                      value={editedPlan.name || ''}
                      onChange={e => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                      value={editedPlan.description || ''}
                      onChange={e => handleInputChange('description', e.target.value)}
                      required
                      rows="3"
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
                      />
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      className="btn-save" 
                      onClick={() => handleSaveEdit(plan.id_plan)}
                      disabled={!editedPlan.name || !editedPlan.description}
                    >
                      <FaSave /> Guardar
                    </button>
                    <button className="btn-cancel" onClick={handleCancelEdit}>
                      <FaTimes /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <h3>{plan.nombre}</h3>
                  <p><strong>Descripción:</strong> {plan.descripcion}</p>
                  <p><strong>Precio:</strong> ${plan.monto}</p>
                  <p><strong>Créditos:</strong> {plan.creditos_total}</p>
                  <p><strong>Disciplinas:</strong> {plan.disciplinas?.length || 0} incluidas</p>
                  
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEditClick(plan)}>
                      <FaEdit /> Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDeletePlan(plan.id_plan)}>
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePlans;