import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useExercises } from '../hooks/useExercises';
import '../styles/CreateExercise.css';

const CreateExercise = () => {
  const { 
    exercises, 
    fetchExercises, 
    createExercise, 
    loading, 
    error, 
    setError 
  } = useExercises();

  const [formData, setFormData] = useState({ name: '', link: '' });

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const showSuccessAlert = (title, message, exerciseName = '') => {
    Swal.fire({
      title,
      html: exerciseName 
        ? `${message}<br><strong>${exerciseName}</strong>`
        : message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      background: '#ffffff',
      iconColor: '#28a745',
      timer: 4000,
      timerProgressBar: true,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  };

  const showWarningAlert = (title, message) => {
    Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc107',
      background: '#ffffff',
      iconColor: '#ffc107'
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showWarningAlert('Nombre requerido', 'El nombre del ejercicio es obligatorio.');
      return false;
    }
    if (formData.name.trim().length < 2) {
      showWarningAlert('Nombre muy corto', 'El nombre debe tener al menos 2 caracteres.');
      return false;
    }
    if (formData.name.trim().length > 100) {
      showWarningAlert('Nombre muy largo', 'El nombre no puede exceder los 100 caracteres.');
      return false;
    }
    if (formData.link && !isValidUrl(formData.link)) {
      showWarningAlert('Enlace inválido', 'Por favor ingresa una URL válida.');
      return false;
    }
    return true;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      Swal.fire({
        title: 'Creando Ejercicio...',
        text: 'Por favor espera mientras creamos el ejercicio',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await createExercise({
        name: formData.name.trim(),
        link: formData.link.trim() || null,
      });

      Swal.close();

      showSuccessAlert(
        '¡Ejercicio Creado!',
        'El ejercicio ha sido creado exitosamente:',
        formData.name
      );

      setFormData({ name: '', link: '' });
      await fetchExercises();

    } catch (error) {
      Swal.close();
      console.error('Error creando ejercicio:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al crear el ejercicio',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  return (
    <div className="CreateExerciseContainer">
      <h2 id="Title-Ejercicios">Crear Ejercicio</h2>

      {error && (
        <div className="warning-message">
          <p>⚠️ {error}</p>
          <button onClick={() => setError(null)} className="dismiss-btn">×</button>
        </div>
      )}

      <div className="form-container">
        <form className="form-group-class" onSubmit={handleCreateExercise}>
          <div className="form-field">
            <label>Nombre del Ejercicio:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Ej: Press de banca, Sentadillas, Flexiones..."
              disabled={loading}
              maxLength={100}
            />
            <div className="character-counter">
              {formData.name.length}/100 caracteres
            </div>
          </div>

          <div className="form-field">
            <label>Enlace de Video Demostrativo (Opcional):</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://youtube.com/ejemplo"
              disabled={loading}
            />
            <div className="helper-text">
              Enlace a YouTube.
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-create-exercise ${loading ? 'loading' : ''}`}
            disabled={loading || !formData.name.trim()}
          >
            {loading ? (
              <>
                Creando Ejercicio...
              </>
            ) : (
              <>
                <FaSave /> Crear Ejercicio
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExercise;