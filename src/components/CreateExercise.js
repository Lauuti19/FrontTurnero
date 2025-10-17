import React, { useEffect, useState } from 'react';
import { FaSave, FaDumbbell } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { exerciseService } from '../services/exerciseService';
import { useAuth } from '../AuthContext';
import '../styles/CreateExercise.css';

const CreateExercise = () => {
  const { getToken } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    link: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExercises = async () => {
    try {
      setFetchLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const data = await exerciseService.getExercises(token);
      setExercises(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando ejercicios:', err);
      setError(err.message || 'Error al cargar los ejercicios');
      setExercises([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre requerido',
        text: 'El nombre del ejercicio es obligatorio.',
      });
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      await exerciseService.createExercise(token, {
        name: formData.name.trim(),
        link: formData.link.trim()
      });

      await Swal.fire({
        icon: 'success',
        title: 'Ejercicio creado exitosamente',
        showConfirmButton: false,
        timer: 1500
      });

      // Resetear formulario y recargar lista
      setFormData({
        name: '',
        link: ''
      });
      await fetchExercises();
      
    } catch (error) {
      console.error("Error creando ejercicio:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || "Error al crear el ejercicio"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderExercisesList = () => {
    if (fetchLoading) {
      return (
        <div className="loading-exercises">
          <p>Cargando ejercicios existentes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="warning-message">
          <p>⚠️ No se pudieron cargar los ejercicios: {error}</p>
          <button onClick={fetchExercises} className="retry-btn">
            Reintentar
          </button>
        </div>
      );
    }

    if (exercises.length === 0) {
      return (
        <div className="no-exercises">
          <p>No hay ejercicios creados aún.</p>
        </div>
      );
    }

    return (
      <div className="existing-exercises">
        <h3>Ejercicios existentes ({exercises.length})</h3>
        <div className="exercises-list">
          {exercises.slice(0, 5).map((exercise) => (
            <div key={exercise.id_ejercicio} className="exercise-item">
              <div className="exercise-info">
                <FaDumbbell className="exercise-icon" />
                <span className="exercise-name">{exercise.nombre}</span>
              </div>
              {exercise.link && (
                <a 
                  href={exercise.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="exercise-link"
                  title="Ver video demostrativo"
                >
                  📹
                </a>
              )}
            </div>
          ))}
          {exercises.length > 5 && (
            <p className="more-exercises">... y {exercises.length - 5} ejercicios más</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="create-exercise-container">
      <div className="create-exercise-box">
        <h2 className="create-exercise-title">Crear Nuevo Ejercicio</h2>
        <p className="create-exercise-subtitle">
          Agrega un nuevo ejercicio al sistema para utilizarlo en las rutinas.
        </p>

        <form className="create-exercise-form" onSubmit={handleCreateExercise}>
          <div className="form-field">
            <label>Nombre del ejercicio</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Press de banca, Sentadillas, Flexiones..."
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label>Enlace de video demostrativo (opcional)</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://youtube.com/ejemplo o https://vimeo.com/ejemplo"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="create-exercise-btn"
            disabled={loading || !formData.name.trim()}
          >
            <FaSave className="btn-icon" />
            {loading ? 'Creando ejercicio...' : 'Crear Ejercicio'}
          </button>
        </form>

        {/* Sección de ejercicios existentes */}
        <div className="exercises-section">
          {renderExercisesList()}
        </div>
      </div>
    </div>
  );
};

export default CreateExercise;