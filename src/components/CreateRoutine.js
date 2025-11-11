import React, { useState, useEffect } from "react";
import { FaPlus,FaMinus, FaTrash, FaSave, FaDumbbell, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import { exerciseService } from "../services/exerciseService";
import "../styles/CreateRoutine.css";

const CreateRoutine = () => {
  const { getToken } = useAuth();
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [dayCount, setDayCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (title, message, routineName = '') => {
    Swal.fire({
      title: title,
      html: routineName 
        ? `${message}<br><strong>${routineName}</strong>`
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
    const fetchAvailableExercises = async () => {
      try {
        setFetchLoading(true);
        setError("");
        const ctxToken = getToken ? getToken() : null;
        const token = ctxToken || localStorage.getItem("token");
        if (!token) throw new Error("No hay token de autenticación disponible");

        const data = await exerciseService.getExercises(token);
        setAvailableExercises(data);
      } catch (error) {
        console.error("Error obteniendo ejercicios:", error);
        const errorMsg = error.message || "Error al cargar los ejercicios disponibles";
        setError(errorMsg);
        showErrorAlert('Error al cargar ejercicios', errorMsg);
        setAvailableExercises([]);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchAvailableExercises();
  }, [getToken]);

  const addDay = () => setDayCount((prev) => prev + 1);
  const removeDay = () => setDayCount((prev) => prev - 1);

  const addExercise = (day) => {
    setExercises((prev) => [
      ...prev,
      {
        id_ejercicio: "",
        dia: day,
        orden: prev.filter((e) => e.dia === day).length + 1,
        rondas: 3,
        repeticiones: "10",
      },
    ]);
  };

  const updateExercise = (index, field, value) => {
    setExercises((prev) => {
      const clone = [...prev];
      clone[index][field] = value;
      return clone;
    });
  };

  const removeExercise = (index) => {
    Swal.fire({
      title: '¿Eliminar ejercicio?',
      text: 'Esta acción eliminará el ejercicio de la rutina.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      background: '#ffffff',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setExercises((prev) => prev.filter((_, i) => i !== index));
      }
    });
  };

  const getDayName = (dayNumber) => {
    return `Día ${dayNumber}`;
  };

  const validateForm = () => {
    if (!routineName.trim()) {
      showWarningAlert('Nombre requerido', 'Por favor ingresa un nombre para la rutina.');
      return false;
    }

    if (routineName.trim().length < 2) {
      showWarningAlert('Nombre muy corto', 'El nombre debe tener al menos 2 caracteres.');
      return false;
    }

    if (exercises.length === 0) {
      showWarningAlert('Ejercicios requeridos', 'Debes agregar al menos un ejercicio a la rutina.');
      return false;
    }

    const hasEmptyExercises = exercises.some(e => !e.id_ejercicio);
    if (hasEmptyExercises) {
      showWarningAlert('Ejercicios incompletos', 'Todos los ejercicios deben tener un tipo seleccionado.');
      return false;
    }

    return true;
  };

  const createRoutineTemplate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Mostrar alerta de carga
      Swal.fire({
        title: 'Creando Rutina...',
        text: 'Por favor espera mientras creamos la plantilla de rutina',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const ctxToken = getToken ? getToken() : null;
      const token = ctxToken || localStorage.getItem("token");
      if (!token) throw new Error("No hay token de autenticación disponible");

      const res = await fetch("https://backturnero-vvk6.onrender.com/api/routines/create-template", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routineName: routineName.trim(),
          exercises,
        }),
      });

      const data = await res.json();
      
      // Cerrar alerta de carga
      Swal.close();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Error al crear la rutina");
      }

      showSuccessAlert(
        '¡Rutina Creada!', 
        'La plantilla de rutina ha sido creada exitosamente:',
        routineName
      );

      // Resetear formulario
      setRoutineName("");
      setExercises([]);
      setDayCount(1);
      
    } catch (error) {
      // Cerrar alerta de carga si existe
      Swal.close();
      
      console.error("Error creando rutina:", error);
      const errorMsg = error.message || "Error al crear la rutina";
      setError(errorMsg);
      showErrorAlert('Error al crear rutina', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getTotalExercises = () => {
    return exercises.length;
  };

  const getExercisesByDay = (day) => {
    return exercises.filter((e) => e.dia === day);
  };

  const getExerciseName = (exerciseId) => {
    const exercise = availableExercises.find(exo => exo.id_ejercicio === exerciseId);
    return exercise ? exercise.nombre : 'Ejercicio no encontrado';
  };

  if (fetchLoading) {
    return (
      <div className="CreateRoutineContainer">
        <div className="loading-message">
          <FaSpinner className="spinner" />
          <p>Cargando ejercicios disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="CreateRoutineContainer">
      <h2 id="Title-Rutinas">Crear Plantilla de Rutina</h2>

      {error && (
        <div className="warning-message">
          <p>⚠️ {error}</p>
          <button onClick={() => setError("")} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      <form className="form-group-class" onSubmit={(e) => { e.preventDefault(); createRoutineTemplate(); }}>
        <div className="form-field">
          <label>Nombre de la Rutina:</label>
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="Ej: Full Body 3 días, Rutina Piernas, Entrenamiento Espalda..."
            disabled={loading}
            maxLength={50}
          />
          <div className="character-counter">
            {routineName.length}/50 caracteres
          </div>
        </div>

        <div className="days-container">
          {[...Array(dayCount)].map((_, i) => {
            const day = i + 1;
            const dayExercises = getExercisesByDay(day);

            return (
              <div key={day} className="day-section">
                <div className="day-header">
                  <h3>
                    {getDayName(day)}
                  </h3>
                  <span className="exercise-count">
                    {dayExercises.length} ejercicio{dayExercises.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="exercises-list">
                  {dayExercises.map((exercise, index) => {
                    const globalIndex = exercises.findIndex(e => e === exercise);
                    return (
                      <div key={globalIndex} className="exercise-item">
                        <div className="exercise-content">
                          <div className="form-group">
                            <label>Ejercicio:</label>
                            <select
                              value={exercise.id_ejercicio}
                              onChange={(e) =>
                                updateExercise(globalIndex, "id_ejercicio", e.target.value)
                              }
                              disabled={loading}
                              className="exercise-select"
                            >
                              <option value="">Seleccionar ejercicio</option>
                              {availableExercises.map((exo) => (
                                <option key={exo.id_ejercicio} value={exo.id_ejercicio}>
                                  {exo.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="exercise-settings">
                            <div className="form-group">
                              <label>Rondas:</label>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={exercise.rondas}
                                onChange={(e) =>
                                  updateExercise(globalIndex, "rondas", parseInt(e.target.value) || 1)
                                }
                                disabled={loading}
                              />
                            </div>
                            <div className="form-group">
                              <label>Repeticiones:</label>
                              <input
                                type="text"
                                value={exercise.repeticiones}
                                onChange={(e) =>
                                  updateExercise(globalIndex, "repeticiones", e.target.value)
                                }
                                placeholder="Ej: 10, 8-12, 15"
                                disabled={loading}
                                maxLength={20}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn-remove-exercise"
                          onClick={() => removeExercise(globalIndex)}
                          disabled={loading}
                          title="Eliminar ejercicio"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="btn-add-exercise"
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
            type="button"
            className="btn-add-day"
            onClick={addDay}
            disabled={loading}
          >
            <FaPlus /> Añadir Día
          </button>
          <button
            type="button"
            className="btn-add-day"
            onClick={removeDay}
            disabled={loading}
          >
            <FaMinus /> Eliminar Día
          </button>

          <button
            type="submit"
            className={`btn-create-routine ${loading ? 'loading' : ''}`}
            disabled={loading || !routineName.trim() || exercises.length === 0}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Creando Rutina...
              </>
            ) : (
              <>
                <FaSave />
                Crear Rutina
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
};

export default CreateRoutine;