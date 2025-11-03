import React, { useState, useEffect } from "react";
import "./Routines.css";
import { useAuth } from "../../../src/AuthContext.js";

const UserRoutines = () => {
  const [routinesByDay, setRoutinesByDay] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const { getUserId, getToken } = useAuth();

  useEffect(() => {
    const fetchRoutines = async () => {
      setLoading(true);
      const userId = getUserId && getUserId();
      // primero probamos del context, si no, del localStorage
      const tokenFromCtx = getToken ? getToken() : null;
      const token = tokenFromCtx || localStorage.getItem("token");

      if (!userId) {
        setError("No se pudo identificar al usuario.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://backturnero-vvk6.onrender.com/api/routines/user/${userId}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error || data?.message || "Error al obtener las rutinas."
          );
        }

        // el SP suele devolver array plano de ejercicios de la rutina activa
        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data[0])
          ? data[0]
          : [];

        if (!raw.length) {
          setError("No se encontraron rutinas para este usuario.");
          setRoutinesByDay({});
          return;
        }

        // agrupar por día
        const grouped = raw.reduce((acc, item) => {
          const dia = item.dia ?? "Sin día";
          if (!acc[dia]) acc[dia] = [];
          acc[dia].push(item);
          return acc;
        }, {});

        setError(null);
        setRoutinesByDay(grouped);
      } catch (err) {
        console.error("Error fetching routines:", err);
        setError(err.message || "Hubo un error al obtener las rutinas.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, [getUserId, getToken]);

  const openVideoModal = (url) => setVideoUrl(url);
  const closeVideoModal = () => setVideoUrl(null);

  return (
    <div className="routines-container">
      <h2>Mi Rutina de Entrenamiento</h2>

      {error && <p className="mensajeError">{error}</p>}
      {loading && <p>Cargando rutinas...</p>}

      {!loading && !error && Object.keys(routinesByDay).length > 0 && (
        <div className="routines-grid">
          {Object.entries(routinesByDay).map(([day, dayRoutines]) => (
            <div key={day} className="routine-card">
              <div className="routine-header">
                <h3>
                  Día {day} - {dayRoutines[0]?.rutina_nombre || "Rutina"}
                </h3>
              </div>
              <div className="routine-exercises">
                {dayRoutines
                  .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                  .map((exercise) => (
                    <div
                      key={`${day}-${exercise.id_ejercicio}-${exercise.orden}`}
                      className="exercise-item"
                    >
                      <div className="exercise-info">
                        <span className="exercise-order">
                          {exercise.orden}.
                        </span>
                        <span className="exercise-name">
                          {exercise.ejercicio_nombre}
                        </span>
                        <span className="exercise-sets">
                          {" "}
                          - {exercise.rondas || 1} rondas ×{" "}
                          {exercise.repeticiones || "-"}
                        </span>
                      </div>
                      {exercise.link && (
                        <button
                          className="video-button"
                          onClick={() => openVideoModal(exercise.link)}
                          title="Ver demostración"
                        >
                          📹
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {videoUrl && (
        <div className="video-modal">
          <div className="video-modal-content">
            <button className="close-modal" onClick={closeVideoModal}>
              ×
            </button>
            <iframe
              src={videoUrl.replace("watch?v=", "embed/")}
              title="Video demostración"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoutines;
