import React, { useEffect, useState } from "react";
import "./Routines.css";
import { useAuth } from "../../../src/AuthContext.js";
import { useRoutines } from "../../hooks/useRoutines.js";
import { useVideoModal } from "../../hooks/useVideoModal.js";

const UserRoutines = () => {
  const { getUserId, getToken } = useAuth();
  const { userRoutines, loading, error, getRoutinesByUser } = useRoutines();
  const { videoUrl, openVideoModal, closeVideoModal, getEmbedUrl } = useVideoModal();
  const [routinesByDay, setRoutinesByDay] = useState({});

  // 🔹 Obtener rutinas al montar
  useEffect(() => {
    const loadRoutines = async () => {
      const token = getToken();
      const userId = getUserId();
      if (!userId || !token) return;
      const res = await getRoutinesByUser(token, userId);

      // agrupar por día si hay rutinas
      if (res && Array.isArray(res)) {
        const grouped = res.reduce((acc, item) => {
          const day = item.dia || "Sin día";
          if (!acc[day]) acc[day] = [];
          acc[day].push(item);
          return acc;
        }, {});
        setRoutinesByDay(grouped);
      } else {
        setRoutinesByDay({});
      }
    };

    loadRoutines();
  }, [getUserId, getToken, getRoutinesByUser]);

  // 🔹 Renderizado principal
  if (loading) return <p>Cargando rutinas...</p>;
  if (error) return <p className="mensajeError">{error}</p>;
  if (!Object.keys(routinesByDay).length) return <p>No hay rutinas disponibles.</p>;

  return (
    <div className="routines-container">
      <h2>Mi Rutina de Entrenamiento</h2>

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
                      <span className="exercise-order">{exercise.orden}.</span>
                      <span className="exercise-name">{exercise.ejercicio_nombre}</span>
                      <span className="exercise-sets">
                        {" "}
                        - {exercise.rondas || 1} rondas × {exercise.repeticiones || "-"}
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

      {videoUrl && (
        <div className="video-modal">
          <div className="video-modal-content">
            <button className="close-modal" onClick={closeVideoModal}>
              ×
            </button>
            <iframe
              src={getEmbedUrl(videoUrl)}
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
