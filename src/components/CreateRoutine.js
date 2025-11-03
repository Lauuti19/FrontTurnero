import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSave, FaDumbbell } from "react-icons/fa";
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
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAvailableExercises = async () => {
      try {
        const ctxToken = getToken ? getToken() : null;
        const token = ctxToken || localStorage.getItem("token");
        if (!token) throw new Error("No hay token de autenticación disponible");

        const data = await exerciseService.getExercises(token);
        setAvailableExercises(data);
      } catch (error) {
        console.error("Error obteniendo ejercicios:", error);
        setAvailableExercises([]);
      }
    };
    fetchAvailableExercises();
  }, [getToken]);

  const addDay = () => setDayCount((prev) => prev + 1);

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
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Mostramos “Día 1”, “Día 2”, etc.
  const getDayName = (dayNumber) => {
    return `Día ${dayNumber}`;
  };

  const isFormValid =
    routineName.trim().length > 0 &&
    exercises.length > 0 &&
    exercises.every((e) => e.id_ejercicio);

  const createRoutineTemplate = async () => {
    if (!isFormValid) {
      setMessage("Completá el nombre y al menos un ejercicio.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
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
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Error al crear la rutina");
      }

      Swal.fire({
        icon: "success",
        title: "Rutina creada",
        text: "La plantilla se creó correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      setRoutineName("");
      setExercises([]);
      setDayCount(1);
      setMessage("Rutina creada exitosamente");
    } catch (error) {
      console.error("Error creando rutina:", error);
      setMessage(error.message || "Error al crear la rutina");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al crear la rutina",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-routine-container">
      <div className="create-routine-box">
        <h2 className="create-routine-title">Crear plantilla de rutina</h2>
        <p className="create-routine-subtitle">
          Primero armá la rutina (días y ejercicios). Después la vas a poder asignar a los usuarios.
        </p>

        <div className="form-field">
          <label>Nombre de la rutina</label>
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="Ej: Full Body 3 días, Piernas, Espalda..."
            disabled={loading}
          />
        </div>

        <div className="days-container">
          {[...Array(dayCount)].map((_, i) => {
            const day = i + 1;
            const dayExercises = exercises.filter((e) => e.dia === day);

            return (
              <div key={day} className="day-section">
                <div className="day-header">
                  <h4>
                    <FaDumbbell /> {getDayName(day)}
                  </h4>
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
                            onChange={(e) =>
                              updateExercise(
                                exercises.indexOf(exercise),
                                "id_ejercicio",
                                e.target.value
                              )
                            }
                            disabled={loading}
                          >
                            <option value="">Seleccionar ejercicio</option>
                            {availableExercises.map((exo) => (
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
                              min="1"
                              value={exercise.rondas}
                              onChange={(e) =>
                                updateExercise(
                                  exercises.indexOf(exercise),
                                  "rondas",
                                  e.target.value
                                )
                              }
                              disabled={loading}
                            />
                          </div>
                          <div className="form-field">
                            <label>Repeticiones</label>
                            <input
                              type="text"
                              value={exercise.repeticiones}
                              onChange={(e) =>
                                updateExercise(
                                  exercises.indexOf(exercise),
                                  "repeticiones",
                                  e.target.value
                                )
                              }
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeExercise(exercises.indexOf(exercise))}
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
                  <FaPlus /> Añadir ejercicio
                </button>
              </div>
            );
          })}
        </div>

        <div className="action-buttons">
          <button className="add-day-btn" onClick={addDay} disabled={loading}>
            <FaPlus /> Añadir día
          </button>

          <button
            className="save-btn"
            onClick={createRoutineTemplate}
            disabled={loading || !isFormValid}
          >
            <FaSave /> {loading ? "Creando..." : "Crear rutina"}
          </button>
        </div>

        {message && <p className="routine-message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateRoutine;
