import React, { useEffect, useState } from 'react';
import '../styles/CreateClass.css';

const CreatePlan = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    totalCredits: '',
    disciplines: []
  });

  useEffect(() => {
    fetch('https://backturnero.onrender.com/api/disciplinas')
      .then(res => res.json())
      .then(data => setDisciplinas(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDisciplineChange = (e) => {
    const value = Number(e.target.value);
    setFormData(prev => {
      const selected = prev.disciplines.includes(value)
        ? prev.disciplines.filter(id => id !== value)
        : [...prev.disciplines, value];
      return { ...prev, disciplines: selected };
    });
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://backturnero.onrender.com/api/planes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      } else {
        alert(data.message || "Error al crear el plan");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="CreateClassContainer">
      <h2 id="Title-Planes">Crear Plan</h2>
      <form className="form-group-class" onSubmit={handleCreatePlan}>
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
            <div key={d.id_disciplina} className="checkbox-item">
              <input
                type="checkbox"
                id={`discipline-${d.id_disciplina}`}
                value={d.id_disciplina}
                checked={formData.disciplines.includes(d.id_disciplina)}
                onChange={handleDisciplineChange}
                className="checkbox-input"
              />
              <label htmlFor={`discipline-${d.id_disciplina}`} className="checkbox-label">
                {d.disciplina}
              </label>
            </div>
          ))}
        </div>
        
        <button type="submit" className="create-plan-btn">Crear Plan</button>
      </form>
    </div>
  );
};

export default CreatePlan;