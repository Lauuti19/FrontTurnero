// CreateRoutine.js
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../FrontTurnero/src/AuthContext.js";



const CreateRoutine = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userRoutines, setUserRoutines] = useState({});
    const [routineName, setRoutineName] = useState('');
    const [exercises, setExercises] = useState([]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [dayCount, setDayCount] = useState(1);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length > 2) {
                searchUsers();
            }
        }, 300);
        
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const searchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/usuarios/buscar?nombre=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error buscando usuarios:', error);
            setMessage('Error al buscar usuarios');
        }
    };

    const fetchUserRoutines = async (userId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/routines/user/${userId}`);
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
                setMessage('Este usuario ya tiene rutinas. Puedes añadir días adicionales.');
                
                const maxDay = Math.max(...Object.keys(routinesByDay).map(Number));
                setDayCount(maxDay);
            } else {
                setUserRoutines({});
                setDayCount(1);
            }
        } catch (error) {
            console.error('Error obteniendo rutinas:', error);
            setMessage('Error al obtener rutinas del usuario');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/exercises');
                const data = await response.json();
                setAvailableExercises(data);
            } catch (error) {
                console.error('Error obteniendo ejercicios:', error);
            }
        };
        fetchExercises();
    }, []);

    const addExercise = (day) => {
        setExercises([...exercises, {
            id_ejercicio: '',
            dia: day,
            orden: exercises.filter(e => e.dia === day).length + 1,
            rondas: 3,
            repeticiones: '10'
        }]);
    };

    const updateExercise = (index, field, value) => {
        const updatedExercises = [...exercises];
        updatedExercises[index][field] = value;
        setExercises(updatedExercises);
    };

    const removeExercise = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const createRoutine = async () => {
        if (!selectedUser || !routineName || exercises.length === 0) {
            setMessage('Complete todos los campos');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/routines/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser.id_usuario,
                    routineName,
                    exercises
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Rutina creada exitosamente');
                fetchUserRoutines(selectedUser.id_usuario);
                setRoutineName('');
                setExercises([]);
            } else {
                throw new Error(data.message || 'Error al crear rutina');
            }
        } catch (error) {
            console.error('Error creando rutina:', error);
            setMessage(error.message);
        }
    };

    const addDay = () => {
        setDayCount(dayCount + 1);
    };

    const openVideoModal = (url) => {
        setVideoUrl(url);
    };

    const closeVideoModal = () => {
        setVideoUrl(null);
    };

    return (
        <div className="create-routine-container">
            <h2>Crear Nueva Rutina</h2>
            
            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar usuario por nombre"
                    />
                </div>
                
                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map(user => (
                            <div 
                                key={user.id_usuario} 
                                className={`user-result ${selectedUser?.id_usuario === user.id_usuario ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedUser(user);
                                    fetchUserRoutines(user.id_usuario);
                                }}
                            >
                                {user.nombre} {user.apellido} 
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedUser && Object.keys(userRoutines).length > 0 && (
                <div className="existing-routines">
                    <h3>Rutinas existentes de {selectedUser.nombre}</h3>
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
                </div>
            )}

            {selectedUser && (
                <div className="routine-form">
                    <h3>{
                        Object.keys(userRoutines).length > 0 
                            ? 'Añadir días adicionales a la rutina' 
                            : 'Crear nueva rutina'
                    }</h3>
                    
                    <div className="form-group">
                        <label>Dia de:</label>
                        <input
                            type="text"
                            value={routineName}
                            onChange={(e) => setRoutineName(e.target.value)}
                            placeholder={
                                Object.keys(userRoutines).length > 0
                                    ? 'Ej: Full Body, Piernas, etc.'
                                    : 'Ej: Full Body, Piernas, etc.'
                            }
                        />
                    </div>

                    {[...Array(dayCount)].map((_, dayIndex) => {
                        const dayNumber = dayIndex + 1;
                        const dayExercises = exercises.filter(e => e.dia === dayNumber);
                        
                        if (userRoutines[dayNumber]) return null;
                        
                        return (
                            <div key={dayNumber} className="day-section">
                                <h4>Día {dayNumber}</h4>
                                
                                {dayExercises.map((exercise, exIndex) => {
                                    const globalIndex = exercises.findIndex(e => 
                                        e.dia === dayNumber && e.orden === exercise.orden
                                    );
                                    
                                    return (
                                        <div key={`${dayNumber}-${exIndex}`} className="exercise-item">
                                            <select
                                                value={exercise.id_ejercicio}
                                                onChange={(e) => updateExercise(globalIndex, 'id_ejercicio', e.target.value)}
                                            >
                                                <option value="">Seleccione ejercicio</option>
                                                {availableExercises.map(ex => (
                                                    <option key={ex.id_ejercicio} value={ex.id_ejercicio}>
                                                        {ex.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            
                                            <input
                                                type="number"
                                                value={exercise.rondas}
                                                onChange={(e) => updateExercise(globalIndex, 'rondas', parseInt(e.target.value))}
                                                min="1"
                                            />
                                            
                                            <input
                                                type="text"
                                                value={exercise.repeticiones}
                                                onChange={(e) => updateExercise(globalIndex, 'repeticiones', e.target.value)}
                                            />
                                            
                                            <button 
                                                className="remove-btn"
                                                onClick={() => removeExercise(globalIndex)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    );
                                })}
                                
                                <button 
                                    className="add-exercise-btn"
                                    onClick={() => addExercise(dayNumber)}
                                >
                                    + Añadir Ejercicio
                                </button>
                            </div>
                        );
                    })}
                    
                    <button className="add-day-btn" onClick={addDay}>
                        + Añadir Día
                    </button>
                    
                    <div className="action-buttons">
                        <button className="save-btn" onClick={createRoutine}>
                            {Object.keys(userRoutines).length > 0 ? 'Actualizar Rutina' : 'Crear Rutina'}
                        </button>
                    </div>
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

export default CreateRoutine;