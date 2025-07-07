import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import '../styles/CreateClass.css';

const CreateExercise = () => {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    link: ''
  });

  const fetchExercises = async () => {
    const res = await fetch(`http://localhost:3001/api/exercises`);
    const data = await res.json();
    setExercises(data);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateExercise = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/exercises/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Ejercicio creado exitosamente");
        setFormData({
          name: '',
          link: ''
        });
        fetchExercises();
      } else {
        alert(data.message || "Error al crear el ejercicio");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="CreateClassContainer">
      <h1>Crear Ejercicio</h1>

      <form className="form-group-class" onSubmit={e => {
        e.preventDefault();
        handleCreateExercise();
      }}>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Link de ejemplo corto:</label>
        <input
          type="text"
          name="link"
          value={formData.link}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">
          <FaSave /> Crear Ejercicio
        </button>
      </form>
    </div>
  );
};

export default CreateExercise;