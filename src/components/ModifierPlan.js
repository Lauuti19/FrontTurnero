import React, { useEffect, useState } from 'react';
import '../styles/CreatePlans.css';
import { useDisciplines } from '../hooks';
import { usePlans } from '../hooks';
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';

const CreatePlan = () => {
  const { getToken } = useAuth();

  const { getDisciplinas } = useDisciplines();
  const { createPlan } = usePlans();

  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    totalCredits: '',
    disciplines: []
  });

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (title, message, planName = '') => {
    Swal.fire({
      title: title,
      html: planName 
        ? `${message}<br><strong>"${planName}"</strong>`
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

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        setLoading(true);
        const token = getToken();

        if (!token) throw new Error('No hay token de autenticación disponible');

        const data = await getDisciplinas(token);
        setDisciplinas(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error cargando disciplinas:', err);
        const errorMsg = err.message || 'Error al cargar las disciplinas';
        setError(errorMsg);
        showErrorAlert('Error al cargar disciplinas', errorMsg);
        setDisciplinas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplinas();
  }, [getToken, getDisciplinas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDisciplineChange = (e) => {
    const value = Number(e.target.value);
    setFormData(prev => {
      const selected = prev.disciplines.includes(value)
        ? prev.disciplines.filter(id => id !== value)
        : [...prev.disciplines, value];
      return { ...prev, disciplines: selected };
    });
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      showWarningAlert('Nombre requerido', 'Por favor ingresa un nombre para el plan');
      return;
    }

    if (!formData.description.trim()) {
      showWarningAlert('Descripción requerida', 'Por favor ingresa una descripción para el plan');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      showWarningAlert('Precio inválido', 'Por favor ingresa un precio válido mayor a 0');
      return;
    }

    if (!formData.totalCredits || parseInt(formData.totalCredits) <= 0) {
      showWarningAlert('Créditos inválidos', 'Por favor ingresa una cantidad válida de créditos mayor a 0');
      return;
    }

    if (formData.disciplines.length === 0) {
      showWarningAlert('Disciplinas requeridas', 'Por favor selecciona al menos una disciplina');
      return;
    }

    try {
      setSubmitLoading(true);
      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      // Mostrar alerta de carga
      Swal.fire({
        title: 'Creando Plan...',
        text: 'Por favor espera mientras creamos tu plan',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Preparar datos para enviar
      const planData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        totalCredits: parseInt(formData.totalCredits),
        disciplines: formData.disciplines
      };

      await createPlan(token, planData);

      // Cerrar alerta de carga
      Swal.close();

      // Mostrar alerta de éxito
      showSuccessAlert(
        '¡Plan Creado Exitosamente!', 
        'El plan ha sido creado correctamente:',
        formData.name
      );

      // Resetear formulario
      setFormData({
        name: '',
        description: '',
        price: '',
        totalCredits: '',
        disciplines: []
      });

    } catch (error) {
      // Cerrar alerta de carga si existe
      Swal.close();
      
      console.error('Error creando plan:', error);
      const errorMsg = error.message || "Error al crear el plan";
      setError(errorMsg);
      showErrorAlert('Error al crear plan', errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error && disciplinas.length === 0) {
    return (
      <div className="CreateClassContainer">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRetry} className="btn-create-plan">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Contador de disciplinas seleccionadas
  const selectedDisciplinesCount = formData.disciplines.length;

  return (
    <div className="CreateClassContainer">
      <h2 id="Title-Planes">Crear Plan</h2>

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

      <form className="form-group-class" onSubmit={handleCreatePlan}>
        <div className="form-field">
          <label>Nombre del Plan:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Plan Premium Mensual"
            disabled={submitLoading}
          />
        </div>

        <div className="form-field">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe los beneficios y características del plan..."
            rows="4"
            disabled={submitLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Precio ($):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Ej: 999.99"
              min="0"
              step="0.01"
              disabled={submitLoading}
            />
          </div>

          <div className="form-field">
            <label>Créditos Totales:</label>
            <input
              type="number"
              name="totalCredits"
              value={formData.totalCredits}
              onChange={handleChange}
              required
              placeholder="Ej: 20"
              min="1"
              disabled={submitLoading}
            />
          </div>
        </div>

        <div className="form-field">
          <label>
            Disciplinas:
            {selectedDisciplinesCount > 0 && (
              <span className="selection-counter">
                ({selectedDisciplinesCount} seleccionada{selectedDisciplinesCount !== 1 ? 's' : ''})
              </span>
            )}
          </label>
          <p className="helper-text">Puedes elegir más de una disciplina</p>
          
          <div className="checkbox-group">
            {loading ? (
              <div className="loading-disciplines">
                <p>Cargando disciplinas...</p>
              </div>
            ) : disciplinas.length > 0 ? (
              disciplinas.map((d) => (
                <div key={d.id_disciplina} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`discipline-${d.id_disciplina}`}
                    value={d.id_disciplina}
                    checked={formData.disciplines.includes(d.id_disciplina)}
                    onChange={handleDisciplineChange}
                    className="checkbox-input"
                    disabled={submitLoading}
                  />
                  <label htmlFor={`discipline-${d.id_disciplina}`} className="checkbox-label">
                    {d.disciplina}
                  </label>
                </div>
              ))
            ) : (
              <div className="no-disciplines">
                <p>No hay disciplinas disponibles</p>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn-create-plan ${submitLoading ? 'loading' : ''}`}
          disabled={submitLoading || loading}
        >
          {submitLoading ? (
            <>
              <div className="btn-spinner"></div>
              Creando Plan...
            </>
          ) : (
            'Crear Plan'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;