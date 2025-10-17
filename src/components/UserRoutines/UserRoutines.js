import React, { useState, useEffect } from 'react';
import './Routines.css';
import { useAuth } from "../../../src/AuthContext.js";

const UserRoutines = () => {
  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const { getUserId } = useAuth();

  useEffect(() => {
    const fetchRoutines = async () => {
      setLoading(true);
      const userId = getUserId();

      if (!userId) {
        setError('No se pudo identificar al usuario');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://backturnero-vvk6.onrender.com/api/routines/user/${userId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al obtener las rutinas');

        if (data.length === 0) {
          setError('No se encontraron rutinas para este usuario.');
          setRoutines([]);
          return;
        }

        setError(null);
        const routinesByDay = data.reduce((acc, routine) => {
          if (!acc[routine.dia]) acc[routine.dia] = [];
          acc[routine.dia].push(routine);
          return acc;
        }, {});
        setRoutines(routinesByDay);
      } catch (error) {
        setError(error.message || 'Hubo un error al obtener las rutinas.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, [getUserId]);

  const openVideoModal = (url) => setVideoUrl(url);
  const closeVideoModal = () => setVideoUrl(null);

  return (
    <div className="routines-container">
      <h2>Mi Rutina de Entrenamiento</h2>
      {error && <p className="mensajeError">{error}</p>}
      {loading && <p>Cargando rutinas...</p>}

      {Object.keys(routines).length > 0 && (
        <div className="routines-grid">
          {Object.entries(routines).map(([day, dayRoutines]) => (
            <div key={day} className="routine-card">
              <div className="routine-header">
                <h3>Día {day} - {dayRoutines[0].rutina_nombre}</h3>
              </div>
              <div className="routine-exercises">
                {dayRoutines.sort((a, b) => a.orden - b.orden).map((exercise) => (
                  <div key={`${day}-${exercise.orden}`} className="exercise-item">
                    <div className="exercise-info">
                      <span className="exercise-order">{exercise.orden}.</span>
                      <span className="exercise-name">{exercise.ejercicio_nombre}</span>
                      <span className="exercise-sets"> - {exercise.rondas} rondas × {exercise.repeticiones} repeticiones</span>
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
            <button className="close-modal" onClick={closeVideoModal}>×</button>
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
