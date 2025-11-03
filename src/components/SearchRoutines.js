// components/SearchRoutines.js
import React, { useState, useEffect } from "react";
import { FaSearch, FaDumbbell, FaPlay, FaTimes } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import Buscador from "./Buscador";
import "../styles/SearchRoutines.css";

const SearchRoutines = ({ mode = "assign" }) => {
  const { getToken } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoutines, setUserRoutines] = useState({});
  const [allRoutines, setAllRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState("");
  const [message, setMessage] = useState("");
  const [loadingUserRoutines, setLoadingUserRoutines] = useState(false);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  // traer TODAS las plantillas de rutinas
  useEffect(() => {
    const fetchAllRoutines = async () => {
      try {
        const ctxToken = getToken ? getToken() : null;
        const token = ctxToken || localStorage.getItem("token");
        const res = await fetch("https://backturnero-vvk6.onrender.com/api/routines", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const data = await res.json();
        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data[0])
          ? data[0]
          : [];
        setAllRoutines(raw);
      } catch (error) {
        console.error("Error obteniendo rutinas base:", error);
        setAllRoutines([]);
      }
    };
    fetchAllRoutines();
  }, [getToken]);

  const fetchUserRoutines = async (userId) => {
    setLoadingUserRoutines(true);
    setMessage("");
    try {
      const ctxToken = getToken ? getToken() : null;
      const token = ctxToken || localStorage.getItem("token");

      const response = await fetch(
        `https://backturnero-vvk6.onrender.com/api/routines/user/${userId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await response.json();

      const raw = Array.isArray(data)
        ? data
        : Array.isArray(data[0])
        ? data[0]
        : [];

      if (raw.length > 0) {
        const routinesByDay = raw.reduce((acc, routine) => {
          if (!acc[routine.dia]) acc[routine.dia] = [];
          acc[routine.dia].push(routine);
          return acc;
        }, {});
        setUserRoutines(routinesByDay);
      } else {
        setUserRoutines({});
        setMessage("No se encontraron rutinas para este usuario.");
      }
    } catch (error) {
      console.error("Error obteniendo rutinas:", error);
      setMessage("Error al obtener rutinas.");
      setUserRoutines({});
    } finally {
      setLoadingUserRoutines(false);
    }
  };

  const handleUserSelect = (user) => {
    if (user) {
      setSelectedUser(user);
      fetchUserRoutines(user.id_usuario);
    } else {
      setSelectedUser(null);
      setUserRoutines({});
      setMessage("");
    }
  };

  const assignRoutineToUser = async () => {
    if (!selectedUser || !selectedRoutineId) {
      setMessage("Seleccioná un usuario y una rutina.");
      return;
    }

    try {
      setLoadingAssign(true);
      const ctxToken = getToken ? getToken() : null;
      const token = ctxToken || localStorage.getItem("token");
      const res = await fetch("https://backturnero-vvk6.onrender.com/api/routines/assign", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_rutina: selectedRoutineId,
          id_usuario: selectedUser.id_usuario,
          unica_activa: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data?.error || data?.message || "No se pudo asignar la rutina"
        );
      }
      setMessage("Rutina asignada correctamente.");
      // refrescar
      fetchUserRoutines(selectedUser.id_usuario);
    } catch (error) {
      console.error("Error asignando rutina:", error);
      setMessage(error.message || "Error al asignar rutina.");
    } finally {
      setLoadingAssign(false);
    }
  };

  const openVideoModal = (url) => setVideoUrl(url);
  const closeVideoModal = () => setVideoUrl(null);

  // 👇 acá el cambio: siempre “Día N”
  const getDayName = (dayNumber) => {
    return `Día ${dayNumber}`;
  };

  return (
    <div className="search-routines-container">
      <div className="search-routines-box">
        <h2 className="search-routines-title">
          {mode === "assign"
            ? "Asignar rutinas a usuarios"
            : "Buscar rutinas de usuarios"}
        </h2>
        <p className="search-routines-subtitle">
          {mode === "assign"
            ? "Elegí un usuario y asigná una de las rutinas que ya creaste."
            : "Encuentra y visualiza las rutinas asignadas a cada usuario del sistema."}
        </p>

        {/* Buscar usuario */}
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

        {/* Selector de rutina base (solo en modo assign) */}
        {mode === "assign" && selectedUser && (
          <div className="assign-section">
            <label>Rutina a asignar</label>
            <select
              value={selectedRoutineId}
              onChange={(e) => setSelectedRoutineId(e.target.value)}
            >
              <option value="">Seleccioná una rutina...</option>
              {allRoutines.map((r) => (
                <option key={r.id_rutina} value={r.id_rutina}>
                  {r.nombre} ({r.usuarios_asignados || 0} usuarios)
                </option>
              ))}
            </select>
            <button
              className="assign-btn"
              onClick={assignRoutineToUser}
              disabled={loadingAssign}
            >
              {loadingAssign ? "Asignando..." : "Asignar rutina"}
            </button>
          </div>
        )}

        {/* Rutinas del usuario seleccionado */}
        {selectedUser && (
          <div className="user-routines-section">
            <div className="user-header">
              <div className="user-info">
                <h3>
                  Rutinas de {selectedUser.nombre}{" "}
                  {selectedUser.apellido || ""}
                </h3>
                <p className="user-email">{selectedUser.email}</p>
              </div>
            </div>

            {loadingUserRoutines ? (
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
                        <h4 className="routine-day">
                          {getDayName(parseInt(day))}
                        </h4>
                        <p className="routine-name">
                          {dayRoutines[0].rutina_nombre}
                        </p>
                      </div>
                    </div>

                    <div className="routine-exercises">
                      {dayRoutines
                        .sort((a, b) => a.orden - b.orden)
                        .map((exercise) => (
                          <div
                            key={`${day}-${exercise.orden}`}
                            className="exercise-item"
                          >
                            <div className="exercise-main">
                              <span className="exercise-order">
                                {exercise.orden}.
                              </span>
                              <div className="exercise-details">
                                <span className="exercise-name">
                                  {exercise.ejercicio_nombre}
                                </span>
                                <span className="exercise-sets">
                                  {exercise.rondas} rondas ×{" "}
                                  {exercise.repeticiones} reps
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
                <p>{message || "No se encontraron rutinas para este usuario."}</p>
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
                  src={videoUrl.replace("watch?v=", "embed/")}
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
