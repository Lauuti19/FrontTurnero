import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import '../styles/CreateClass.css';

const CreateDiscipline = () => {
  const [formData, setFormData] = useState({ name: '' });

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/disciplinas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        alert("✅ Disciplina creada exitosamente");
        setFormData({ name: '' });
      } else {
        alert(data.message || "Error al crear la disciplina");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="CreateClassContainer">
      <h2 id="Title-Planes">Crear Disciplina</h2>
      <form className="form-group-class" onSubmit={handleCreateDiscipline}>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Nombre de la disciplina"
        />
        <button type="submit" className="create-discipline-btn">
          <FaSave /> Crear Disciplina
        </button>
      </form>
    </div>
  );
};

export default CreateDiscipline;