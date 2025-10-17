import React, { useState, useEffect } from 'react';
import { FaSearch, FaDumbbell, FaPlay, FaTimes } from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import Buscador from './Buscador';
import '../styles/SearchRoutines.css';

const SearchRoutines = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoutines, setUserRoutines] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const fetchUserRoutines = async (userId) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`https://backturnero-vvk6.onrender.com/api/routines/user/${userId}`);
      const data = await response.json();

      if (data.length > 0) {
        const routinesByDay = data.reduce((acc, routine) => {
          if (!acc[routine.dia]) acc[routine.dia] = [];
          acc[routine.dia].push(routine);
          return acc;
        }, {});
        setUserRoutines(routinesByDay);
      } else {
        setUserRoutines({});
        setMessage('No se encontraron rutinas para este usuario.');
      }
    } catch (error) {
      console.error('Error obteniendo rutinas:', error);
      setMessage('Error al obtener rutinas.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    if (user) {
      setSelectedUser(user);
      fetchUserRoutines(user.id_usuario);
    } else {
      setSelectedUser(null);
      setUserRoutines({});
      setMessage('');
    }
  };

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

  return (
    <div className="search-routines-container">
      <div className="search-routines-box">
        <h2 className="search-routines-title">Buscar Rutinas de Usuarios</h2>
        <p className="search-routines-subtitle">
          Encuentra y visualiza las rutinas asignadas a cada usuario del sistema.
        </p>

        <div className="search-section">
          <div className="search-header">
            <FaSearch className="search-icon" />
            <span>Buscar usuario</span>
          </div>
          <Buscador 
            onUsuarioSeleccionado={handleUserSelect}
            placeholder="Buscar por nombre o email..."
          />
        </div>

        {selectedUser && (
          <div className="user-routines-section">
            <div className="user-header">
              <div className="user-info">
                <h3>Rutinas de {selectedUser.nombre} {selectedUser.apellido || ''}</h3>
                <p className="user-email">{selectedUser.email}</p>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <p>Cargando rutinas...</p>
              </div>
            ) : Object.keys(userRoutines).length > 0 ? (
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
                      {dayRoutines
                        .sort((a, b) => a.orden - b.orden)
                        .map((exercise) => (
                          <div key={`${day}-${exercise.orden}`} className="exercise-item">
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
                                title="Ver demostración en video"
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
            ) : (
              <div className="no-routines">
                <p>No se encontraron rutinas para este usuario.</p>
              </div>
            )}
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
                  src={videoUrl.replace('watch?v=', 'embed/')}
                  title="Video demostración del ejercicio"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

export default SearchRoutines;