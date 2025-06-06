import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import '../styles/CreateClass.css';

const ModifierPlan = () => {
  const [planes,setPlanes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editedPlan, setEditedPlan] = useState({});

  const [formData, setFormData] = useState({
  name: '',
  description: '',
  price: '',
  totalCredits: '',
  disciplines: []
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
  const fetchPlanes = async () => {
      const res = await fetch(`http://localhost:3001/api/planes`);
      const data = await res.json();
      setPlanes(data.planes);
      console.log(data);
    };
    const fetchDisciplinas = async () => {
      const res = await fetch(`http://localhost:3001/api/disciplinas`);
      const data = await res.json();
      setDisciplinas(data);
      console.log(data);
    };
   
  useEffect(() => {
    fetchDisciplinas();
    fetchPlanes();
  }, []);

    const handleCreatePlan = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/planes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
          alert("✅ Plan creado exitosamente");
          setFormData({
            name: '',
            description: '',
            price: '',
            totalCredits: '',
            disciplines: []
          });
          fetchPlanes(); // <-- volver a cargar los planes desde el backend
      } else {
        alert(data.message || "Error al crear el plan");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(" Error de conexión con el servidor.");
    }
  };
  const handleDeletePlan = async (id) => {
  const confirm = window.confirm("¿Seguro que deseas eliminar este plan?");
  if (!confirm) return;

  try {
    const response = await fetch(`http://localhost:3001/api/planes/delete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
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
      headers: {
        'Content-Type': 'application/json'
      },
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

  return (
    <div className="CreateClassContainer">
      <h1>Crear Planes</h1>

      <form className="form-group-class" onSubmit={(e) => {
        e.preventDefault();
        handleCreatePlan();
      }}>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Descripción:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Monto:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="Ej: 999.99"
        />

        <label>Créditos Totales:</label>
        <input
          type="number"
          name="totalCredits"
          value={formData.totalCredits}
          onChange={handleChange}
          required
        />
        <label>Disciplinas:</label>
<div className="checkbox-group">
  {disciplinas.map((d) => (
    <div key={d.id_disciplina}>
      <label>
        <input
          type="checkbox"
          value={d.id_disciplina}
          checked={formData.disciplines.includes(d.id_disciplina)}
          onChange={(e) => {
            const value = Number(e.target.value);
            setFormData(prev => {
              const selected = prev.disciplines.includes(value)
                ? prev.disciplines.filter(id => id !== value) // quitar si está
                : [...prev.disciplines, value];               // agregar si no está
              return { ...prev, disciplines: selected };
            });
          }}
        />
        {d.disciplina}
      </label>
    </div>
  ))}
</div>



        <button type="submit">Crear Plan</button>
      </form>

      <hr />

       <h2 id='Title-Planes'>Planes Existentes</h2>
      <div>
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
export default ModifierPlan;