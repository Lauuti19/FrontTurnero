import React, { useEffect, useState, useCallback } from 'react';
import { FaPlusCircle, FaDumbbell, FaCalendarDay, FaClock, FaUsers } from 'react-icons/fa';
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
  const { getDisciplinas } = useDisciplines();
  const { createClass } = useClasses();

  const fetchDisciplinas = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const data = await getDisciplinas(token);
      setDisciplinas(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando disciplinas:", err);
      setError(err.message || 'Error al cargar las disciplinas');
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, getDisciplinas]);

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
        confirmButtonColor: '#1a1a1a'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      await createClass(token, formData);

      await Swal.fire({
        icon: 'success',
        title: '¡Clase creada!',
        text: 'La clase se ha creado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        background: '#ffffff',
        iconColor: '#ffd700'
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
        title: 'Error al crear clase',
        text: error.message || "Ha ocurrido un error al crear la clase",
        confirmButtonColor: '#1a1a1a'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDisciplinaNombre = (disciplina) => {
    return disciplina.nombre || disciplina.disciplina || disciplina.name || 'Sin nombre';
  };

  const isFormValid = formData.id_disciplina && formData.id_dia && formData.hora && formData.capacidad_max;

  const diasSemana = [
    { value: '1', label: 'Lunes' },
    { value: '2', label: 'Martes' },
    { value: '3', label: 'Miércoles' },
    { value: '4', label: 'Jueves' },
    { value: '5', label: 'Viernes' },
    { value: '6', label: 'Sábado' }
  ];

  return (
    <div className="create-class-container">
      <div className="create-class-box">
        <div className="create-class-header">
          <div className="create-class-icon-container">
            <FaPlusCircle className="create-class-icon" />
          </div>
          <div className="create-class-title-content">
            <h1>Crear Nueva Clase</h1>
            <p>Completa la información para programar una nueva clase</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <div className="error-text">
                <p>{error}</p>
                <button onClick={fetchDisciplinas} className="retry-btn">
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        <form className="create-class-form" onSubmit={handleCreateClass}>
          <div className="form-grid">
            <div className="form-field">
              <div className="field-header">
                <FaDumbbell className="field-icon" />
                <label>Disciplina</label>
              </div>
              <select 
                name="id_disciplina" 
                value={formData.id_disciplina} 
                onChange={handleChange} 
                required
                disabled={loading || isSubmitting}
                className="form-select"
              >
                <option value="">Selecciona una disciplina</option>
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
              <div className="field-header">
                <FaCalendarDay className="field-icon" />
                <label>Día de la semana</label>
              </div>
              <select 
                name="id_dia" 
                value={formData.id_dia} 
                onChange={handleChange} 
                required
                disabled={isSubmitting}
                className="form-select"
              >
                <option value="">Selecciona un día</option>
                {diasSemana.map((dia) => (
                  <option key={dia.value} value={dia.value}>
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <div className="field-header">
                <FaClock className="field-icon" />
                <label>Hora de la clase</label>
              </div>
              <input 
                type="time" 
                name="hora" 
                value={formData.hora} 
                onChange={handleChange} 
                required 
                disabled={isSubmitting}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <div className="field-header">
                <FaUsers className="field-icon" />
                <label>Capacidad máxima</label>
              </div>
              <input 
                type="number" 
                name="capacidad_max" 
                value={formData.capacidad_max} 
                onChange={handleChange} 
                required 
                placeholder="Ej: 20" 
                min="1"
                disabled={isSubmitting}
                className="form-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`create-class-btn ${isSubmitting ? 'loading' : ''} ${!isFormValid ? 'disabled' : ''}`}
            disabled={isSubmitting || loading || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <div className="btn-spinner"></div>
                Creando clase...
              </>
            ) : (
              <>
                <FaPlusCircle className="btn-icon" />
                Crear Clase
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;