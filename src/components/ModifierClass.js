import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import '../styles/CreateClass.css';

const CreateClass = ({ onClassCreated }) => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [formData, setFormData] = useState({
    id_disciplina: '',
    id_dia: '',
    hora: '',
    capacidad_max: ''
  });

  const fetchDisciplinas = useCallback(async () => {
    const res = await fetch(`http://localhost:3001/api/disciplinas`);
    const data = await res.json();
    setDisciplinas(data);
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
    }
  };

  return (
    <div className="CreateClassContainer">
      <h1>Crear Clases</h1>
      <form className="form-group-class" onSubmit={handleCreateClass}>
        <label>Disciplina:</label>
        <select name="id_disciplina" value={formData.id_disciplina} onChange={handleChange} required>
          <option value="">Seleccione una disciplina</option>
          {disciplinas.map((d) => (
            <option key={d.id_disciplina} value={d.id_disciplina}>
              {d.disciplina}
            </option>
          ))}
        </select>
        <label>Día:</label>
        <select name="id_dia" value={formData.id_dia} onChange={handleChange} required>
          <option value="">Seleccione un día</option>
          <option value="1">Lunes</option>
          <option value="2">Martes</option>
          <option value="3">Miércoles</option>
          <option value="4">Jueves</option>
          <option value="5">Viernes</option>
          <option value="6">Sábado</option>
        </select>
        <label>Hora:</label>
        <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
        <label>Capacidad Máxima:</label>
        <input type="number" name="capacidad_max" value={formData.capacidad_max} onChange={handleChange} required placeholder='Ej: 20' />
        <button type="submit">Crear Clase</button>
      </form>
    </div>
  );
};

export default CreateClass;