import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import '../styles/CreateClass.css';

const ManagePlans = () => {
  const [planes, setPlanes] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editedPlan, setEditedPlan] = useState({});

  const fetchPlanes = async () => {
    const res = await fetch(`http://localhost:3001/api/planes`);
    const data = await res.json();
    setPlanes(data.planes);
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

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
      const response = await fetch(`http://localhost:3001/api/planes/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: id,
          name: editedPlan.name,
          description: editedPlan.description,
          price: editedPlan.price,
          totalCredits: editedPlan.totalCredits
        })
      });

      if (response.ok) {
        setEditingPlanId(null);
        fetchPlanes();
      } else {
        alert("Error al guardar cambios");
      }
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  const handleDeletePlan = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este plan?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://localhost:3001/api/planes/delete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: id })
      });

      if (response.ok) {
        setPlanes(prev => prev.filter(p => p.id_plan !== id));
      } else {
        alert("Error al eliminar el plan");
      }
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <div className="CreateClassContainer">
      <h2 id='Title-Planes'>Planes</h2>
      <div className="plans-list">
        {planes.map((p) => (
          <div key={p.id_plan} className="plan-item">
            {editingPlanId === p.id_plan ? (
              <>
                <input
                  type="text"
                  value={editedPlan.name}
                  onChange={e => setEditedPlan(prev => ({ ...prev, name: e.target.value }))}
                />
                <textarea
                  value={editedPlan.description}
                  onChange={e => setEditedPlan(prev => ({ ...prev, description: e.target.value }))}
                />
                <input
                  type="number"
                  value={editedPlan.price}
                  onChange={e => setEditedPlan(prev => ({ ...prev, price: e.target.value }))}
                />
                <input
                  type="number"
                  value={editedPlan.totalCredits}
                  onChange={e => setEditedPlan(prev => ({ ...prev, totalCredits: e.target.value }))}
                />
                <button onClick={() => handleSaveEdit(p.id_plan)}><FaSave /></button>
              </>
            ) : (
              <>
                <h3>{p.nombre}</h3>
                <p>Descripción: {p.descripcion}</p>
                <p>Precio: ${p.monto}</p>
                <p>Créditos: {p.creditos_total}</p>
                <button onClick={() => handleEditClick(p)}><FaEdit /></button>
              </>
            )}
            <button onClick={() => handleDeletePlan(p.id_plan)}><FaTrash /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePlans;