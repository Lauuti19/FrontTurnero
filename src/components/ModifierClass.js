import React, { useEffect, useState, useCallback } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import '../styles/CreateClasses.css';
import { useAuth } from '../AuthContext'; // Importar el AuthContext

const CreateClass = ({ onClassCreated }) => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [formData, setFormData] = useState({
    id_disciplina: '',
    id_dia: '',
    hora: '',
    capacidad_max: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth(); // Obtener la función getToken

  const fetchDisciplinas = useCallback(async () => {
    try {
      const token = getToken(); // Obtener el token
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      const res = await fetch(`https://backturnero.onrender.com/api/disciplinas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Asegurarse de que data sea un array
      let disciplinasArray = [];
      
      if (Array.isArray(data)) {
        disciplinasArray = data;
      } else if (data.disciplinas && Array.isArray(data.disciplinas)) {
        disciplinasArray = data.disciplinas;
      } else if (data.data && Array.isArray(data.data)) {
        disciplinasArray = data.data;
      }
      
      setDisciplinas(disciplinasArray);
    } catch (error) {
      console.error("Error fetching disciplines:", error);
      setDisciplinas([]); // Siempre mantener como array
    }
  }, [getToken]); // Agregar getToken como dependencia

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
      const token = getToken(); // Obtener token para la creación de clase
      if (!token) {
        alert("No hay token de autenticación disponible");
        return;
      }

      const response = await fetch("https://backturnero.onrender.com/api/classes/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
            {/* Verificación segura y uso de propiedades correctas */}
            {disciplinas.length > 0 ? (
              disciplinas.map((d) => (
                <option key={d.id_disciplina || d.id} value={d.id_disciplina || d.id}>
                  {d.nombre || d.disciplina || d.name} {/* Probar diferentes nombres de propiedad */}
                </option>
              ))
            ) : (
              <option disabled>No hay disciplinas disponibles</option>
            )}
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