import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaSave, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import { classService } from '../services/classService';
import { disciplinaService } from '../services/disciplinaService';
import '../styles/ViewClasses.css';

const ViewClasses = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [clases, setClases] = useState([]);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editedClass, setEditedClass] = useState({});
  const [fechaHoy, setFechaHoy] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  const fetchDisciplinas = useCallback(async () => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const data = await disciplinaService.getDisciplinas(token);
      setDisciplinas(data);
    } catch (error) {
      console.error("Error cargando disciplinas:", error);
      setDisciplinas([]);
    }
  }, [getToken]);

  const fetchClases = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const data = await classService.getClasses(token, fechaHoy);
      setClases(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando clases:", err);
      setError(err.message || 'Error al cargar las clases');
      setClases([]);
    } finally {
      setLoading(false);
    }
  }, [fechaHoy, getToken]);

  useEffect(() => {
    fetchDisciplinas();
    fetchClases();
  }, [fetchDisciplinas, fetchClases]);

  const handleEditClick = (clase) => {
    setEditingClassId(clase.id_clase);
    setEditedClass({
      id_disciplina: clase.id_disciplina,
      id_dia: clase.id_dia,
      hora: clase.hora,
      capacidad_max: clase.capacidad_max
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      await classService.updateClass(token, id, editedClass);

      await Swal.fire({
        icon: 'success',
        title: 'Clase actualizada exitosamente',
        showConfirmButton: false,
        timer: 1500
      });

      setEditingClassId(null);
      await fetchClases();
      
    } catch (error) {
      console.error("Error al editar:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || "Error al guardar cambios"
      });
    }
  };

  const handleDeleteClass = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la clase permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = getToken();
        
        if (!token) {
          throw new Error('No hay token de autenticación disponible');
        }

        await classService.deleteClass(token, id);

        await Swal.fire({
          icon: 'success',
          title: 'Clase eliminada exitosamente',
          showConfirmButton: false,
          timer: 1500
        });

        setClases(prev => prev.filter(c => c.id_clase !== id));
        
      } catch (error) {
        console.error("Error eliminando:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || "Error al eliminar la clase"
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingClassId(null);
    setEditedClass({});
  };

  const getDiaNombre = (idDia) => {
    const dias = {
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado",
      7: "Domingo"
    };
    return dias[idDia] || "";
  };

  const getDisciplinaNombre = (disciplina) => {
    return disciplina.nombre || disciplina.disciplina || disciplina.name || 'Sin nombre';
  };

  const handleEditChange = (field, value) => {
    setEditedClass(prev => ({ 
      ...prev, 
      [field]: field === 'capacidad_max' || field === 'id_dia' || field === 'id_disciplina' 
        ? Number(value) 
        : value 
    }));
  };

  //if (loading) {
  //  return (
  //    <div className="view-classes-container">
  //      <div className="view-classes-box">
  //        <div className="loading-container">
  //          <p>Cargando clases...</p>
  //        </div>
  //      </div>
  //    </div>
  //  );
  //}

  return (
    <div className="view-classes-container">
      <div className="view-classes-box">
        <h2 className="view-classes-title">Gestión de Clases</h2>
        <p className="view-classes-subtitle">
          Visualiza y gestiona las clases del sistema. Selecciona una fecha para filtrar.
        </p>

        <div className="date-filter">
          <div className="date-field">
            <label><FaCalendarAlt /> Fecha a consultar</label>
            <input 
              type="date" 
              value={fechaHoy} 
              onChange={e => setFechaHoy(e.target.value)} 
              className="date-input"
            />
          </div>
        </div>

        {error && (
          <div className="warning-message">
            <p>⚠️ {error}</p>
            <button onClick={fetchClases} className="retry-btn">
              Reintentar
            </button>
          </div>
        )}

        <div className="classes-list">
          {clases.length > 0 ? (
            clases.map((clase) => (
              <div key={clase.id_clase} className="class-card">
                {editingClassId === clase.id_clase ? (
                  <div className="class-edit">
                    <h3>Editando Clase</h3>
                    
                    <div className="form-field">
                      <label>Disciplina</label>
                      <select 
                        value={editedClass.id_disciplina} 
                        onChange={e => handleEditChange('id_disciplina', e.target.value)}
                      >
                        <option value="">Seleccione disciplina</option>
                        {disciplinas.map(disciplina => (
                          <option key={disciplina.id_disciplina || disciplina.id} value={disciplina.id_disciplina || disciplina.id}>
                            {getDisciplinaNombre(disciplina)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-field">
                      <label>Día de la semana</label>
                      <select 
                        value={editedClass.id_dia} 
                        onChange={e => handleEditChange('id_dia', e.target.value)}
                      >
                        <option value="">Seleccione día</option>
                        <option value="1">Lunes</option>
                        <option value="2">Martes</option>
                        <option value="3">Miércoles</option>
                        <option value="4">Jueves</option>
                        <option value="5">Viernes</option>
                        <option value="6">Sábado</option>
                      </select>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-field">
                        <label>Hora</label>
                        <input 
                          type="time" 
                          value={editedClass.hora} 
                          onChange={e => handleEditChange('hora', e.target.value)} 
                        />
                      </div>
                      
                      <div className="form-field">
                        <label>Capacidad</label>
                        <input 
                          type="number" 
                          value={editedClass.capacidad_max} 
                          onChange={e => handleEditChange('capacidad_max', e.target.value)} 
                          min="1"
                          placeholder="20"
                        />
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn-save" 
                        onClick={() => handleSaveEdit(clase.id_clase)}
                      >
                        <FaSave /> Guardar
                      </button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="class-view">
                    <div className="class-header">
                      <h3>{getDisciplinaNombre(clase)}</h3>
                      <span className="class-day">{getDiaNombre(clase.id_dia)}</span>
                    </div>
                    
                    <div className="class-details">
                      <div className="detail-item">
                        <span className="detail-label">Hora:</span>
                        <span className="detail-value">{clase.hora}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Capacidad:</span>
                        <span className="detail-value">{clase.disponibles || clase.capacidad_max} personas</span>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditClick(clase)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteClass(clase.id_clase)}
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-classes">
              <p>No hay clases programadas para la fecha seleccionada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewClasses;