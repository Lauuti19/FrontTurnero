import React, { useEffect, useState } from 'react';
import '../styles/CreateClass.css';
import { useDisciplines } from '../hooks';
import { usePlans } from '../hooks';
import { useAuth } from '../AuthContext';

const CreatePlan = () => {
  const { getToken } = useAuth();
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

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        if (!token) {
          throw new Error('No hay token de autenticación disponible');
        }

        // PASA EL TOKEN al servicio
        const data = await useDisciplines.getDisciplinas(token);
        setDisciplinas(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando disciplinas:', err);
        setError(err.message || 'Error al cargar las disciplinas');
        setDisciplinas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplinas();
  }, [getToken]); // Añade getToken como dependencia

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
    if (formData.disciplines.length === 0) {
      alert('Por favor selecciona al menos una disciplina');
      return;
    }

    try {
      setSubmitLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      // Usar el servicio de planes con autenticación
      await usePlans.createPlan(token, formData);
      
      alert("✅ Plan creado exitosamente");
      
      // Resetear formulario
      setFormData({
        name: '',
        description: '',
        price: '',
        totalCredits: '',
        disciplines: []
      });
      
    } catch (error) {
      console.error('Error creando plan:', error);
      alert(error.message || "Error al crear el plan");
    } finally {
      setSubmitLoading(false);
    }
  };

  //if (loading) {
  //  return (
  //    <div className="CreateClassContainer">
  //      <p>Cargando disciplinas...</p>
  //    </div>
  //  );
  //}

  if (error && disciplinas.length === 0) {
    return (
      <div className="CreateClassContainer">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="CreateClassContainer">
      <h2 id="Title-Planes">Crear Plan</h2>
      
      {error && (
        <div className="warning-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      <form className="form-group-class" onSubmit={handleCreatePlan}>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <label>Descripción:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        
        <label>Monto:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="Ej: 999.99"
        />
        
        <label>Créditos Totales:</label>
        <input
          type="number"
          name="totalCredits"
          value={formData.totalCredits}
          onChange={handleChange}
          required
        />
        
        <label>Disciplinas:</label>
        <div className="checkbox-group">
          {disciplinas.length > 0 ? (
            disciplinas.map((d) => (
              <div key={d.id_disciplina} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`discipline-${d.id_disciplina}`}
                  value={d.id_disciplina}
                  checked={formData.disciplines.includes(d.id_disciplina)}
                  onChange={handleDisciplineChange}
                  className="checkbox-input"
                />
                <label htmlFor={`discipline-${d.id_disciplina}`} className="checkbox-label">
                  {d.disciplina}
                </label>
              </div>
            ))
          ) : (
            <p>No hay disciplinas disponibles</p>
          )}
        </div>
        
        <button 
          type="submit" 
          className="create-plan-btn"
          disabled={submitLoading}
        >
          {submitLoading ? 'Creando...' : 'Crear Plan'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;