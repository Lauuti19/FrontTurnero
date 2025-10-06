// SearchRoutines.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Buscador from './Buscador'; // Importar el componente Buscador

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
            const response = await fetch(`https://backturnero.onrender.com/api/routines/user/${userId}`);
            const data = await response.json();
            
            if (data.length > 0) {
                const routinesByDay = data.reduce((acc, routine) => {
                    if (!acc[routine.dia]) {
                        acc[routine.dia] = [];
                    }
                    acc[routine.dia].push(routine);
                    return acc;
                }, {});
                
                setUserRoutines(routinesByDay);
            } else {
                setUserRoutines({});
                setMessage('No se encontraron rutinas para este usuario');
            }
        } catch (error) {
            console.error('Error obteniendo rutinas:', error);
            setMessage('Error al obtener rutinas');
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

    const openVideoModal = (url) => {
        setVideoUrl(url);
    };

    const closeVideoModal = () => {
        setVideoUrl(null);
    };

    return (
        <div className="search-routines-container">
            <h2>Buscar Rutinas de Usuarios</h2>
            
            <div className="search-section">
                <div className="search-box">
                    <Buscador 
                        onUsuarioSeleccionado={handleUserSelect}
                        placeholder="Buscar usuario por nombre"
                    />
                </div>
            </div>

            {selectedUser && (
                <div className="user-routines-section">
                    <h3>Rutinas de {selectedUser.nombre} {selectedUser.apellido || ''}</h3>
                    
                    {loading ? (
                        <p>Cargando rutinas...</p>
                    ) : Object.keys(userRoutines).length > 0 ? (
                        <div className="routines-grid">
                            {Object.entries(userRoutines).map(([day, dayRoutines]) => (
                                <div key={day} className="routine-card">
                                    <div className="routine-header">
                                        <h4>Día {day} - {dayRoutines[0].rutina_nombre}</h4>
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
                    ) : (
                        <p>No se encontraron rutinas para este usuario.</p>
                    )}
                </div>
            )}
            
            {message && <div className="message">{message}</div>}
            
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

export default SearchRoutines;