import React, { useState } from 'react';
import { FaSave, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useDisciplines } from '../hooks';
import { useAuth } from '../AuthContext';
import '../styles/CreateDiscipline.css';

const CreateDiscipline = () => {
  const { getToken } = useAuth();
  const { createDiscipline } = useDisciplines();
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (title, message, disciplineName = '') => {
    Swal.fire({
      title: title,
      html: disciplineName 
        ? `${message}<br><strong>"${disciplineName}"</strong>`
        : message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      background: '#ffffff',
      iconColor: '#28a745',
      timer: 4000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  };

  // Función para mostrar alertas de error
  const showErrorAlert = (title, errorMessage) => {
    Swal.fire({
      title: title,
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545',
      background: '#ffffff',
      showClass: {
        popup: 'animate__animated animate__headShake'
      }
    });
  };

  // Función para mostrar advertencias
  const showWarningAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc107',
      background: '#ffffff',
      iconColor: '#ffc107'
    });
  };

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showWarningAlert('Nombre requerido', 'Por favor ingresa un nombre para la disciplina.');
      return;
    }

    // Validar longitud del nombre
    if (formData.name.trim().length < 2) {
      showWarningAlert('Nombre muy corto', 'El nombre debe tener al menos 2 caracteres.');
      return;
    }

    if (formData.name.trim().length > 50) {
      showWarningAlert('Nombre muy largo', 'El nombre no puede exceder los 50 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      // Mostrar alerta de carga
      Swal.fire({
        title: 'Creando Disciplina...',
        text: 'Por favor espera mientras creamos la disciplina',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await createDiscipline(token, {
        name: formData.name.trim()
      });

      // Cerrar alerta de carga
      Swal.close();

      // Mostrar alerta de éxito
      showSuccessAlert(
        '¡Disciplina Creada Exitosamente!', 
        'La disciplina ha sido creada correctamente:',
        formData.name
      );

      // Resetear formulario
      setFormData({ name: '' });
      setError(null);
      
    } catch (error) {
      // Cerrar alerta de carga si existe
      Swal.close();
      
      console.error('Error creando disciplina:', error);
      const errorMsg = error.message || 'Error al crear la disciplina';
      setError(errorMsg);
      showErrorAlert('Error al crear disciplina', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="CreateClassContainer">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <p>Lo sentimos, Prueba nuevamente</p>
          <button onClick={handleRetry} className="btn-retry-discipline">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="CreateClassContainer">
      <h2 id="Title-Disciplinas">Crear Disciplina</h2>

      {error && (
        <div className="warning-message">
          <p>⚠️ {error}</p>
          <button 
            onClick={() => setError(null)} 
            className="dismiss-btn"
          >
            ×
          </button>
        </div>
      )}

      <form className="form-group-class" onSubmit={handleCreateDiscipline}>
        <div className="form-field">
          <label>Nombre de la Disciplina:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: CrossFit, Pilates, Open Box, Yoga, Musculación..."
            disabled={loading}
            maxLength={50}
          />
          <div className="character-counter">
            {formData.name.length}/50 caracteres
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn-create-discipline ${loading ? 'loading' : ''}`}
          disabled={loading || !formData.name.trim()}
        >
          {loading ? (
            <>
              Creando Disciplina...
            </>
          ) : (
            <>
              Crear Disciplina
            </>
          )}
        </button>
      </form>

      <div className="discipline-tips">
        <div className="tips-header">
          <h4>Consejos para nombrar disciplinas</h4>
        </div>
        <div className="tips-content">
          <div className="tip-item">
            <FaCheckCircle className="tip-icon" />
            <span>Usa nombres descriptivos y reconocibles</span>
          </div>
          <div className="tip-item">
            <FaCheckCircle className="tip-icon" />
            <span>Mantén la consistencia en el formato</span>
          </div>
          <div className="tip-item">
            <FaCheckCircle className="tip-icon" />
            <span>Evita nombres demasiado largos o complejos</span>
          </div>
          <div className="tip-item">
            <FaCheckCircle className="tip-icon" />
            <span>Considera agrupar disciplinas similares</span>
          </div>
          <div className="tip-item">
            <FaCheckCircle className="tip-icon" />
            <span>Usa mayúsculas solo donde sea necesario</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscipline;