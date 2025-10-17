import React, { useState } from 'react';
import { FaSave, FaDumbbell } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { disciplinaService } from '../services/disciplinaService';
import { useAuth } from '../AuthContext';
import '../styles/CreateDiscipline.css';

const CreateDiscipline = () => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Por favor ingresa un nombre para la disciplina.',
      });
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      await disciplinaService.createDisciplina(token, {
        name: formData.name.trim()
      });

      await Swal.fire({
        icon: 'success',
        title: 'Disciplina creada exitosamente',
        showConfirmButton: false,
        timer: 1500
      });

      setFormData({ name: '' });
      
    } catch (error) {
      console.error('Error creando disciplina:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al crear la disciplina'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-discipline-container">
      <div className="create-discipline-box">
        <h2 className="create-discipline-title">Crear Nueva Disciplina</h2>
        <p className="create-discipline-subtitle">
          Agrega una nueva disciplina al sistema para organizar las clases y actividades.
        </p>

        <form className="create-discipline-form" onSubmit={handleCreateDiscipline}>
          <div className="form-field">
            <label>
              <FaDumbbell className="field-icon" />
              Nombre de la disciplina
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: CrossFit, Pilates, Open Box..."
              disabled={loading}
              className="discipline-input"
            />
          </div>

          <button 
            type="submit" 
            className="create-discipline-btn"
            disabled={loading || !formData.name.trim()}
          >
            <FaSave className="btn-icon" />
            {loading ? 'Creando disciplina...' : 'Crear Disciplina'}
          </button>
        </form>

        <div className="discipline-tips">
          <h4>💡 Consejos para nombrar disciplinas:</h4>
          <ul>
            <li>Usa nombres descriptivos y reconocibles</li>
            <li>Mantén la consistencia en el formato</li>
            <li>Evita nombres demasiado largos</li>
            <li>Considera agrupar disciplinas similares</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscipline;