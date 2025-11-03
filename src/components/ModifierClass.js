import React, { useEffect, useState, useCallback } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import { useClasses } from '../hooks';
import { useDisciplines } from '../hooks';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  const fetchDisciplinas = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const data = await useDisciplines.getDisciplinas(token);
      setDisciplinas(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando disciplinas:", err);
      setError(err.message || 'Error al cargar las disciplinas');
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchDisciplinas();
  }, [fetchDisciplinas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacidad_max' || name === 'id_dia' || name === 'id_disciplina' 
        ? Number(value) 
        : value 
    }));
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    
    if (!formData.id_disciplina || !formData.id_dia || !formData.hora || !formData.capacidad_max) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      await useClasses.createClass(token, formData);

      await Swal.fire({
        icon: 'success',
        title: 'Clase creada exitosamente',
        showConfirmButton: false,
        timer: 1500
      });

      setFormData({ 
        id_disciplina: '', 
        id_dia: '', 
        hora: '', 
        capacidad_max: '' 
      });
      
      if (onClassCreated) onClassCreated();
      
    } catch (error) {
      console.error("Error creando clase:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || "Error al crear la clase"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDisciplinaNombre = (disciplina) => {
    return disciplina.nombre || disciplina.disciplina || disciplina.name || 'Sin nombre';
  };

  const isFormValid = formData.id_disciplina && formData.id_dia && formData.hora && formData.capacidad_max;

  return (
    <div className="create-class-container">
      <div className="create-class-box">
        <h2 className="create-class-title">Crear Nueva Clase</h2>
        <p className="create-class-subtitle">
          Completa la información para crear una nueva clase en el sistema.
        </p>

        {error && (
          <div className="warning-message">
            <p>⚠️ {error}</p>
            <button onClick={fetchDisciplinas} className="retry-btn">
              Reintentar
            </button>
          </div>
        )}

        <form className="create-class-form" onSubmit={handleCreateClass}>
          <div className="form-field">
            <label>Disciplina</label>
            <select 
              name="id_disciplina" 
              value={formData.id_disciplina} 
              onChange={handleChange} 
              required
              disabled={loading || isSubmitting}
            >
              <option value="">Seleccione una disciplina</option>
              {disciplinas.length > 0 ? (
                disciplinas.map((disciplina) => (
                  <option key={disciplina.id_disciplina || disciplina.id} value={disciplina.id_disciplina || disciplina.id}>
                    {getDisciplinaNombre(disciplina)}
                  </option>
                ))
              ) : (
                <option disabled>
                  {loading ? 'Cargando disciplinas...' : 'No hay disciplinas disponibles'}
                </option>
              )}
            </select>
          </div>

          <div className="form-field">
            <label>Día de la semana</label>
            <select 
              name="id_dia" 
              value={formData.id_dia} 
              onChange={handleChange} 
              required
              disabled={isSubmitting}
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
            <label>Hora de la clase</label>
            <input 
              type="time" 
              name="hora" 
              value={formData.hora} 
              onChange={handleChange} 
              required 
              disabled={isSubmitting}
            />
          </div>

          <div className="form-field">
            <label>Capacidad máxima</label>
            <input 
              type="number" 
              name="capacidad_max" 
              value={formData.capacidad_max} 
              onChange={handleChange} 
              required 
              placeholder="Ej: 20" 
              min="1"
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="create-class-btn"
            disabled={isSubmitting || loading || !isFormValid}
          >
            <FaPlusCircle className="btn-icon" />
            {isSubmitting ? 'Creando clase...' : 'Crear Clase'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;