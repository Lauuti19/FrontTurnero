// components/RoutineComponents.js
import React from 'react';

// Componente de carga
export const LoadingState = () => (
  <div className="routines-loading">
    <div className="loading-spinner"></div>
    <p>Cargando rutinas...</p>
  </div>
);

// Componente de error
export const ErrorState = ({ message }) => (
  <div className="routines-error">
    <p>{message}</p>
  </div>
);

// Componente de estado vacío
export const EmptyState = () => (
  <div className="routines-empty">
    <p>No tienes rutinas asignadas</p>
  </div>
);

// Componente de ejercicio individual
export const ExerciseItem = ({ exercise, onVideoClick }) => (
  <div className="exercise-item">
    <div className="exercise-info">
      <span className="exercise-order">{exercise.orden}.</span>
      <span className="exercise-name">{exercise.ejercicio_nombre}</span>
      <span className="exercise-sets">
        - {exercise.rondas} rondas × {exercise.repeticiones} repeticiones
      </span>
    </div>
    {exercise.link && (
      <button 
        className="video-button"
        onClick={() => onVideoClick(exercise.link)}
        title="Ver demostración"
        aria-label={`Ver video de ${exercise.ejercicio_nombre}`}
      >
        📹
      </button>
    )}
  </div>
);

// Componente de tarjeta de rutina por día
export const RoutineCard = ({ day, dayRoutines, onVideoClick }) => {
  const sortedExercises = dayRoutines.sort((a, b) => a.orden - b.orden);
  const routineName = dayRoutines[0]?.rutina_nombre || 'Rutina';

  return (
    <div className="routine-card">
      <div className="routine-header">
        <h3>Día {day} - {routineName}</h3>
      </div>
      <div className="routine-exercises">
        {sortedExercises.map((exercise) => (
          <ExerciseItem 
            key={`${day}-${exercise.orden}`} 
            exercise={exercise} 
            onVideoClick={onVideoClick}
          />
        ))}
      </div>
    </div>
  );
};

// Componente del modal de video
export const VideoModal = ({ videoUrl, getEmbedUrl, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="video-modal" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="close-modal" 
          onClick={onClose}
          aria-label="Cerrar video"
        >
          ×
        </button>
        <iframe 
          src={getEmbedUrl(videoUrl)} 
          title="Video demostración" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};