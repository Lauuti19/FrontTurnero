import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaDumbbell, FaPlay, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import Buscador from './Buscador';
import { routineService } from '../services/routineService';
import { exerciseService } from '../services/exerciseService';
import '../styles/CreateRoutine.css';

const CreateRoutine = () => {
  const { getToken } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoutines, setUserRoutines] = useState({});
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [dayCount, setDayCount] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingRoutines, setFetchingRoutines] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const fetchUserRoutines = async (userId) => {
    try {
      setFetchingRoutines(true);
      setMessage('');
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const data = await routineService.getUserRoutines(token, userId);

      if (data.length > 0) {
        const routinesByDay = data.reduce((acc, routine) => {
          if (!acc[routine.dia]) acc[routine.dia] = [];
          acc[routine.dia].push(routine);
          return acc;
        }, {});
        setUserRoutines(routinesByDay);
        const maxDay = Math.max(...Object.keys(routinesByDay).map(Number));
        setDayCount(maxDay);
        setMessage('Este usuario ya tiene rutinas. Puedes añadir días adicionales.');
      } else {
        setUserRoutines({});
        setDayCount(1);
      }
    } catch (error) {
      console.error('Error obteniendo rutinas:', error);
      setMessage(error.message || 'Error al obtener rutinas del usuario');
      setUserRoutines({});
    } finally {
      setFetchingRoutines(false);
    }
  };

  const fetchAvailableExercises = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const data = await exerciseService.getExercises(token);
      setAvailableExercises(data);
    } catch (error) {
      console.error('Error obteniendo ejercicios:', error);
      setAvailableExercises([]);
    }
  };

  useEffect(() => {
    fetchAvailableExercises();
  }, []);

  const handleUserSelect = (user) => {
    if (user) {
      setSelectedUser(user);
      fetchUserRoutines(user.id_usuario);
      setRoutineName('');
      setExercises([]);
    } else {
      setSelectedUser(null);
      setUserRoutines({});
      setRoutineName('');
      setExercises([]);
      setMessage('');
    }
  };

  const addExercise = (day) => {
    setExercises([...exercises, {
      id_ejercicio: '',
      dia: day,
      orden: exercises.filter(e => e.dia === day).length + 1,
      rondas: 3,
      repeticiones: '10'
    }]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const createRoutine = async () => {
    if (!selectedUser || !routineName.trim() || exercises.length === 0) {
      setMessage('Complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      await routineService.createRoutine(token, {
        userId: selectedUser.id_usuario,
        routineName: routineName.trim(),
        exercises
      });

      await Swal.fire({
        icon: 'success',
        title: 'Rutina creada exitosamente',
        showConfirmButton: false,
        timer: 1500
      });

      setMessage('Rutina creada exitosamente');
      await fetchUserRoutines(selectedUser.id_usuario);
      setRoutineName('');
      setExercises([]);
      
    } catch (error) {
      console.error('Error creando rutina:', error);
      setMessage(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al crear la rutina'
      });
    } finally {
      setLoading(false);
    }
  };

  const addDay = () => setDayCount(dayCount + 1);
  const openVideoModal = (url) => setVideoUrl(url);
  const closeVideoModal = () => setVideoUrl(null);

  const getDayName = (dayNumber) => {
    const days = {
      1: 'Lunes',
      2: 'Martes', 
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
      7: 'Domingo'
    };
    return days[dayNumber] || `Día ${dayNumber}`;
  };

  const isFormValid = selectedUser && routineName.trim() && exercises.length > 0;

  return (
    <div className="create-routine-container">
      <div className="create-routine-box">
        <h2 className="create-routine-title">Crear Rutina de Entrenamiento</h2>
        <p className="create-routine-subtitle">
          Diseña rutinas personalizadas para los usuarios del sistema.
        </p>

        <div className="search-section">
          <div className="search-header">
            <span>Buscar usuario</span>
          </div>
          <Buscador 
            onUsuarioSeleccionado={handleUserSelect}
            placeholder="Buscar por nombre o email..."
          />
        </div>

        {selectedUser && (
          <div className="user-section">
            <div className="user-info">
              <h3>Usuario seleccionado</h3>
              <div className="user-details">
                <span className="user-name">{selectedUser.nombre} {selectedUser.apellido || ''}</span>
                <span className="user-email">{selectedUser.email}</span>
              </div>
            </div>

            {fetchingRoutines ? (
              <div className="loading-container">
                <p>Cargando rutinas existentes...</p>
              </div>
            ) : Object.keys(userRoutines).length > 0 ? (
              <div className="existing-routines">
                <h3>Rutinas existentes</h3>
                <div className="routines-grid">
                  {Object.entries(userRoutines).map(([day, dayRoutines]) => (
                    <div key={day} className="routine-card">
                      <div className="routine-header">
                        <FaDumbbell className="routine-icon" />
                        <div className="routine-info">
                          <h4 className="routine-day">{getDayName(parseInt(day))}</h4>
                          <p className="routine-name">{dayRoutines[0].rutina_nombre}</p>
                        </div>
                      </div>
                      <div className="routine-exercises">
                        {dayRoutines.sort((a, b) => a.orden - b.orden).map((exercise, i) => (
                          <div key={i} className="exercise-item">
                            <div className="exercise-main">
                              <span className="exercise-order">{exercise.orden}.</span>
                              <div className="exercise-details">
                                <span className="exercise-name">{exercise.ejercicio_nombre}</span>
                                <span className="exercise-sets">
                                  {exercise.rondas} rondas × {exercise.repeticiones} reps
                                </span>
                              </div>
                            </div>
                            {exercise.link && (
                              <button 
                                className="video-btn" 
                                onClick={() => openVideoModal(exercise.link)}
                                title="Ver demostración"
                              >
                                <FaPlay />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="routine-form">
              <h3>{Object.keys(userRoutines).length > 0 ? 'Añadir días adicionales' : 'Crear nueva rutina'}</h3>
              
              <div className="form-field">
                <label>Nombre de la rutina</label>
                <input 
                  type="text"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  placeholder="Ej: Full Body, Rutina Piernas, Entrenamiento Espalda..."
                  required
                  disabled={loading}
                />
              </div>

              <div className="days-container">
                {[...Array(dayCount)].map((_, i) => {
                  const day = i + 1;
                  if (userRoutines[day]) return null;
                  const dayExercises = exercises.filter(e => e.dia === day);
                  
                  return (
                    <div key={day} className="day-section">
                      <div className="day-header">
                        <h4>{getDayName(day)}</h4>
                        <span className="exercise-count">{dayExercises.length} ejercicios</span>
                      </div>
                      
                      <div className="exercises-list">
                        {dayExercises.map((exercise, idx) => (
                          <div key={idx} className="exercise-form">
                            <div className="exercise-fields">
                              <div className="form-field">
                                <label>Ejercicio</label>
                                <select 
                                  value={exercise.id_ejercicio} 
                                  onChange={(e) => updateExercise(idx, 'id_ejercicio', e.target.value)}
                                  required
                                  disabled={loading}
                                >
                                  <option value="">Seleccionar ejercicio</option>
                                  {availableExercises.map(exo => (
                                    <option key={exo.id_ejercicio} value={exo.id_ejercicio}>
                                      {exo.nombre}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="form-row">
                                <div className="form-field">
                                  <label>Rondas</label>
                                  <input 
                                    type="number" 
                                    value={exercise.rondas} 
                                    onChange={(e) => updateExercise(idx, 'rondas', e.target.value)} 
                                    placeholder="3" 
                                    min="1" 
                                    required
                                    disabled={loading}
                                  />
                                </div>
                                
                                <div className="form-field">
                                  <label>Repeticiones</label>
                                  <input 
                                    type="text" 
                                    value={exercise.repeticiones} 
                                    onChange={(e) => updateExercise(idx, 'repeticiones', e.target.value)} 
                                    placeholder="10" 
                                    required
                                    disabled={loading}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <button 
                              className="remove-btn" 
                              onClick={() => removeExercise(idx)}
                              title="Eliminar ejercicio"
                              disabled={loading}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        className="add-exercise-btn" 
                        onClick={() => addExercise(day)}
                        disabled={loading}
                      >
                        <FaPlus /> Añadir Ejercicio
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="action-buttons">
                <button 
                  className="add-day-btn" 
                  onClick={addDay}
                  disabled={loading}
                >
                  <FaPlus /> Añadir Día
                </button>
                
                <button 
                  className="save-btn" 
                  onClick={createRoutine}
                  disabled={loading || !isFormValid}
                >
                  <FaSave /> 
                  {loading ? ' Creando...' : (Object.keys(userRoutines).length > 0 ? ' Actualizar Rutina' : ' Crear Rutina')}
                </button>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="message-container">
            <p className="routine-message">{message}</p>
          </div>
        )}

        {videoUrl && (
          <div className="video-modal">
            <div className="video-modal-content">
              <div className="modal-header">
                <h3>Video Demostración</h3>
                <button className="close-modal" onClick={closeVideoModal}>
                  <FaTimes />
                </button>
              </div>
              <div className="video-container">
                <iframe 
                  src={videoUrl.replace("watch?v=", "embed/")} 
                  title="Video demostración del ejercicio" 
                  frameBorder="0" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRoutine;