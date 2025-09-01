import React, { useEffect, useState, useCallback } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import '../styles/CreateClasses.css';

const CreateClass = ({ onClassCreated }) => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [formData, setFormData] = useState({
    id_disciplina: '',
    id_dia: '',
    hora: '',
    capacidad_max: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDisciplinas = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/disciplinas`);
      const data = await res.json();
      setDisciplinas(data);
    } catch (error) {
      console.error("Error fetching disciplines:", error);
    }
  }, []);

  useEffect(() => {
    fetchDisciplinas();
  }, [fetchDisciplinas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:3001/api/classes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Clase creada exitosamente");
        setFormData({ id_disciplina: '', id_dia: '', hora: '', capacidad_max: '' });
        if (onClassCreated) onClassCreated();
      } else {
        alert(data.message || "Error al crear la clase");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-class-container">
      <h2 className="create-class-title">Crear Nueva Clase</h2>
      
      <form className="create-class-form" onSubmit={handleCreateClass}>
        <div className="form-field">
          <label htmlFor="id_disciplina">Disciplina:</label>
          <select 
            id="id_disciplina"
            name="id_disciplina" 
            value={formData.id_disciplina} 
            onChange={handleChange} 
            required
          >
            <option value="">Seleccione una disciplina</option>
            {disciplinas.map((d) => (
              <option key={d.id_disciplina} value={d.id_disciplina}>
                {d.disciplina}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="id_dia">Día:</label>
          <select 
            id="id_dia"
            name="id_dia" 
            value={formData.id_dia} 
            onChange={handleChange} 
            required
          >
            <option value="">Seleccione un día</option>
            <option value="1">Lunes</option>
            <option value="2">Martes</option>
            <option value="3">Miércoles</option>
            <option value="4">Jueves</option>
            <option value="5">Viernes</option>
            <option value="6">Sábado</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="hora">Hora:</label>
          <input 
            id="hora"
            type="time" 
            name="hora" 
            value={formData.hora} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-field">
          <label htmlFor="capacidad_max">Capacidad Máxima:</label>
          <input 
            id="capacidad_max"
            type="number" 
            name="capacidad_max" 
            value={formData.capacidad_max} 
            onChange={handleChange} 
            required 
            placeholder="Ej: 20" 
            min="1"
          />
        </div>

        <button 
          type="submit" 
          className="create-class-btn"
          disabled={isSubmitting}
        >
          <FaPlusCircle className="btn-icon" />
          {isSubmitting ? 'Creando...' : 'Crear Clase'}
        </button>
      </form>
    </div>
  );
};

export default CreateClass;