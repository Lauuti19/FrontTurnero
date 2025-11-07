import React, { useEffect, useState, useCallback } from "react";
import "./Routines.css";
import { useAuth } from "../../../src/AuthContext.js";
import { useRoutines } from "../../hooks/useRoutines.js";
import { useVideoModal } from "../../hooks/useVideoModal.js";
import { FaExclamationTriangle, FaInfoCircle, FaDumbbell, FaSpinner } from "react-icons/fa";

const UserRoutines = () => {
  const { getUserId, getToken } = useAuth();
  const { userRoutines, loading, error, getRoutinesByUser } = useRoutines();
  const { videoUrl, openVideoModal, closeVideoModal, getEmbedUrl } = useVideoModal();
  const [routinesByDay, setRoutinesByDay] = useState({});
  const [displayError, setDisplayError] = useState("");

  // ✅ Función para manejar errores específicos de rutinas
  const handleRoutinesError = useCallback((errorMessage) => {
    if (!errorMessage) return { type: 'info', message: "" };

    const lowerError = errorMessage.toLowerCase();
    
    // ✅ Errores de autenticación
    if (lowerError.includes('token') || 
        lowerError.includes('auth') || 
        lowerError.includes('no autorizado') ||
        lowerError.includes('unauthorized')) {
      return {
        type: 'error',
        message: "Sesión expirada. Por favor, volvé a iniciar sesión."
      };
    }
    
    // ✅ Errores de conexión
    if (lowerError.includes('network') || 
        lowerError.includes('conexión') || 
        lowerError.includes('fetch') ||
        lowerError.includes('failed to fetch')) {
      return {
        type: 'error',
        message: "Error de conexión. Verificá tu internet e intentá nuevamente."
      };
    }
    
    // ✅ No hay rutinas disponibles
    if (lowerError.includes('no hay rutinas') || 
        lowerError.includes('rutinas no encontradas') ||
        lowerError.includes('no se encontraron rutinas')) {
      return {
        type: 'info',
        message: "No tenés rutinas asignadas en este momento. Consultá con tu entrenador."
      };
    }
    
    // ✅ Error genérico
    return {
      type: 'error',
      message: errorMessage || "Ocurrió un error al cargar las rutinas. Intentá nuevamente."
    };
  }, []);

  // ✅ Efecto para manejar errores
  useEffect(() => {
    if (error) {
      const errorInfo = handleRoutinesError(error);
      setDisplayError(errorInfo);
    } else {
      setDisplayError("");
    }
  }, [error, handleRoutinesError]);

  // 🔹 Obtener rutinas al montar
  useEffect(() => {
    const loadRoutines = async () => {
      const token = getToken();
      const userId = getUserId();
      if (!userId || !token) {
        setDisplayError({
          type: 'error',
          message: "No se pudo identificar tu usuario. Por favor, volvé a iniciar sesión."
        });
        return;
      }
      
      try {
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
          setDisplayError({
            type: 'info',
            message: "No tenés rutinas asignadas en este momento. Consultá con tu entrenador."
          });
        }
      } catch (err) {
        console.error("Error loading routines:", err);
        // El error ya está manejado por el hook useRoutines
      }
    };

    loadRoutines();
  }, [getUserId, getToken, getRoutinesByUser]);

  // ✅ Función para reintentar carga
  const handleRetry = async () => {
    setDisplayError("");
    const token = getToken();
    const userId = getUserId();
    if (!userId || !token) return;
    
    await getRoutinesByUser(token, userId);
  };

  // 🔹 Renderizado de loading
  if (loading) {
    return (
      <div className="routines-container loading-state">
        <div className="loading-content">
          <h3>Cargando tu rutina...</h3>
          <p>Estamos preparando tu plan de entrenamiento</p>
        </div>
      </div>
    );
  }

  // 🔹 Renderizado cuando no hay rutinas (sin error)
  if (!loading && !displayError && !Object.keys(routinesByDay).length) {
    return (
      <div className="routines-container no-routines-state">
        <div className="no-routines-content">
          <FaDumbbell className="no-routines-icon" />
          <h3>No tenés rutinas asignadas</h3>
          <p>Consultá con tu entrenador para que te asigne un plan de entrenamiento personalizado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="routines-container">
      <h2>Mi Rutina de Entrenamiento</h2>

      {/* ✅ Mensajes de error/información */}
      {displayError && (
        <div className={`info-message ${displayError.type === 'error' ? 'error-type' : 'info-type'}`}>
          <div className="message-icon">
            {displayError.type === 'error' ? <FaExclamationTriangle /> : <FaInfoCircle />}
          </div>
          <div className="message-content">
            <p>{displayError.message}</p>
            {displayError.type === 'error' && (
              <button onClick={handleRetry} className="retry-btn" disabled={loading}>
                {loading ? 'Reintentando...' : 'Reintentar'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Grid de rutinas solo si hay datos y no hay error */}
      {!displayError && Object.keys(routinesByDay).length > 0 && (
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
      )}

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