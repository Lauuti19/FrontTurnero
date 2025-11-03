import React, { useState, useEffect } from "react";
import { FaDumbbell, FaPlay } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import "../styles/SearchRoutines.css"; // usa los mismos estilos

const ViewRoutines = () => {
  const { getToken } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  // obtener todas las rutinas
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = getToken ? getToken() : localStorage.getItem("token");
        const res = await fetch("https://backturnero-vvk6.onrender.com/api/routines", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const raw = Array.isArray(data) ? data : Array.isArray(data[0]) ? data[0] : [];
        setRoutines(raw);
      } catch (err) {
        console.error("Error al obtener rutinas:", err);
        setError("Error al cargar rutinas.");
      }
    };
    fetchRoutines();
  }, [getToken]);

  // obtener detalle
  const fetchRoutineDetail = async (id) => {
    setLoading(true);
    setError(null);
    setDetails([]);
    try {
      const token = getToken ? getToken() : localStorage.getItem("token");
      const res = await fetch(`https://backturnero-vvk6.onrender.com/api/routines/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const raw = Array.isArray(data) ? data : Array.isArray(data[0]) ? data[0] : [];
      setDetails(raw);
    } catch (err) {
      console.error("Error al obtener detalle de rutina:", err);
      setError("Error al obtener el detalle de la rutina.");
    } finally {
      setLoading(false);
    }
  };

  // agrupar por día
  const groupedByDay = details.reduce((acc, ex) => {
    if (!acc[ex.dia]) acc[ex.dia] = [];
    acc[ex.dia].push(ex);
    return acc;
  }, {});

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedRoutine(id);
    if (id) fetchRoutineDetail(id);
  };

  const openVideoModal = (url) => setVideoUrl(url);
  const closeVideoModal = () => setVideoUrl(null);

  return (
    <div className="search-routines-container">
      <div className="search-routines-box">
        <h2 className="search-routines-title">Ver rutinas creadas</h2>
        <p className="search-routines-subtitle">
          Seleccioná una rutina para ver sus ejercicios y estructura.
        </p>

        <div className="assign-section">
          <label>Seleccionar rutina</label>
          <select value={selectedRoutine} onChange={handleSelect}>
            <option value="">-- Elegir rutina --</option>
            {routines.map((r) => (
              <option key={r.id_rutina} value={r.id_rutina}>
                {r.nombre} ({r.usuarios_asignados} usuarios)
              </option>
            ))}
          </select>
        </div>

        {loading && <p>Cargando detalle...</p>}
        {error && <p className="mensajeError">{error}</p>}

        {!loading && details.length > 0 && (
          <div className="routines-grid">
            {Object.entries(groupedByDay).map(([day, exercises]) => (
              <div key={day} className="routine-card">
                <div className="routine-header">
                  <FaDumbbell className="routine-icon" />
                  <div className="routine-info">
                    <h4 className="routine-day">Día {day}</h4>
                    <p className="routine-name">{exercises[0].rutina_nombre}</p>
                  </div>
                </div>

                <div className="routine-exercises">
                  {exercises
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
                              {exercise.rondas} rondas × {exercise.repeticiones} reps
                            </span>
                          </div>
                        </div>
                        {exercise.link && (
                          <button
                            className="video-btn"
                            onClick={() => openVideoModal(exercise.link)}
                            title="Ver demostración"
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
    </div>
  );
};

export default ViewRoutines;
