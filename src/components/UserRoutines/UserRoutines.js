import React, { useEffect } from 'react';
import { useAuth } from "../../../src/AuthContext.js";
import { useRoutines } from '../../hooks/useRoutines.js';
import { useVideoModal } from '../../hooks/useVideoModal.js';
import { 
  LoadingState, 
  ErrorState, 
  EmptyState, 
  RoutineCard, 
  VideoModal 
} from './RoutineComponente.js';
import './Routines.css';

const UserRoutines = () => {
  const { getUserId, getToken } = useAuth();
  const userId = getUserId();
  const token = getToken();

  const { 
    userRoutines, 
    loading, 
    error, 
    getRoutinesByUser 
  } = useRoutines();

  const { videoUrl, openVideoModal, closeVideoModal, getEmbedUrl } = useVideoModal();

  // 🔹 Cargar rutinas cuando se monta el componente
  useEffect(() => {
    if (userId && token) {
      getRoutinesByUser(token, userId);
    }
  }, [userId, token, getRoutinesByUser]);

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!userRoutines || userRoutines.length === 0) return <EmptyState />;

    // Agrupar rutinas por día si vienen con campo "dia"
    const groupedRoutines = userRoutines.reduce((acc, routine) => {
      const day = routine.dia || "Sin día asignado";
      if (!acc[day]) acc[day] = [];
      acc[day].push(routine);
      return acc;
    }, {});

    return (
      <div className="routines-grid">
        {Object.entries(groupedRoutines).map(([day, dayRoutines]) => (
          <RoutineCard 
            key={day}
            day={day} 
            dayRoutines={dayRoutines} 
            onVideoClick={openVideoModal}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="routines-container">
      <header className="routines-header">
        <h2>Mi Rutina de Entrenamiento</h2>
        <p className="routines-subtitle">Sigue tu plan de entrenamiento personalizado</p>
      </header>

      <main className="routines-content">
        {renderContent()}
      </main>

      <VideoModal 
        videoUrl={videoUrl}
        getEmbedUrl={getEmbedUrl}
        onClose={closeVideoModal}
      />
    </div>
  );
};

export default UserRoutines;
