import React, { useState, useEffect, useMemo } from 'react';
import {
  FaUsers, FaChevronLeft, FaChevronRight, FaCalendarAlt,
  FaDumbbell, FaRunning, FaHeart
} from 'react-icons/fa';
import '../styles/ClassSchedule.css';
import ClassUsersModal from '../components/ClassUsersModal';
import RegisterButton from '../components/RegisterButton';
import { useAuth } from '../AuthContext';
import { classService } from '../services/classService';

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const ClassSchedule = ({
  userId: propUserId,
  isEmbedded = false,
  showHeader = true,
  customContainerStyle = {},
  customItemStyle = {},
  adminMode = false,
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    if (today.getDay() === 0) {
      today.setDate(today.getDate() + 1); // saltear domingo
    }
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const { getToken } = useAuth();

  const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
  const userId = propUserId !== null && propUserId !== undefined
    ? propUserId
    : (usuarioLocal?.id_usuario || usuarioLocal?.id);

  const [expandedClassId, setExpandedClassId] = useState(null);

  const formattedDate = useMemo(
    () => currentDate.toISOString().split('T')[0],
    [currentDate]
  );

  const toggleExpand = (id) => {
    setExpandedClassId(expandedClassId === id ? null : id);
  };

  const openUsersModal = (clase) => {
    setSelectedClass(clase);
    setShowModal(true);
  };

  const closeUsersModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const getDisciplineIcon = (disciplina) => {
    const d = (disciplina || '').toLowerCase();
    if (d.includes('funcional') || d.includes('cross')) return <FaRunning className="discipline-icon" />;
    if (d.includes('musculación') || d.includes('pesas')) return <FaDumbbell className="discipline-icon" />;
    if (d.includes('yoga') || d.includes('pilates')) return <FaHeart className="discipline-icon" />;
    return <FaDumbbell className="discipline-icon" />;
  };

  const getFormattedDate = () => {
    const dayIndex = currentDate.getDay();
    const adjusted = dayIndex === 0 ? 6 : dayIndex - 1;
    return (
      <div className="schedule-date">
        <FaCalendarAlt className="calendar-icon" />
        <div className="date-content">
          <span className="day-name">{daysOfWeek[adjusted]}</span>
          <div className="date-numbers">
            <span className="date-day">{String(currentDate.getDate()).padStart(2, '0')}</span>
            <span className="date-separator">/</span>
            <span className="date-month">{String(currentDate.getMonth() + 1).padStart(2, '0')}</span>
            <span className="date-separator">/</span>
            <span className="date-year">{currentDate.getFullYear()}</span>
          </div>
        </div>
      </div>
    );
  };

  const getCapacityPercentage = (disponibles, total) => {
    const t = Number(total) > 0 ? Number(total) : 20;
    const d = Math.max(0, Number(disponibles) || 0);
    return Math.round((1 - d / t) * 100);
  };

  const getCapacityColor = (p) => {
    if (p >= 80) return '#dc2626';
    if (p >= 60) return '#f59e0b';
    return '#16a34a';
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) throw new Error('No hay token de autenticación disponible');

      let data;
      if (adminMode && userId) {
        data = await classService.getClassesByUser(token, userId, formattedDate);
      } else {
        data = await classService.getClasses(token, formattedDate);
      }

      const clasesFormateadas = (Array.isArray(data) ? data : []).map((c) => {
        const total = Number(c.capacidad_max ?? c.total ?? 20);
        const disponibles = Number(c.disponibles ?? 0);
        return {
          ...c,
          hora: c.hora ? String(c.hora).substring(0, 5) : c.hora,
          total,
          inscriptos: Math.max(0, total - disponibles),
        };
      });

      setClasses(clasesFormateadas);
    } catch (err) {
      console.error('Error cargando clases:', err);
      setError(err.message || 'Error al cargar las clases');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, userId, adminMode, getToken]);

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    if (newDate.getDay() === 0) newDate.setDate(newDate.getDate() - 1);
    newDate.setHours(0, 0, 0, 0);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    if (newDate.getDay() === 0) newDate.setDate(newDate.getDate() + 1);
    newDate.setHours(0, 0, 0, 0);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    if (today.getDay() === 0) today.setDate(today.getDate() + 1);
    today.setHours(0, 0, 0, 0);
    setCurrentDate(today);
  };

  const renderSkeletonItems = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="class-item skeleton-item">
        <div className="class-main-info">
          <div className="class-icon skeleton-icon" />
          <div className="class-details">
            <div className="class-discipline skeleton-text skeleton-title" />
            <div className="class-meta">
              <div className="class-time skeleton-text skeleton-time" />
              <div className="class-trainer skeleton-text skeleton-trainer" />
            </div>
            <div className="class-description skeleton-text skeleton-description" />
          </div>
          <div className="class-capacity">
            <div className="capacity-info">
              <div className="capacity-bar skeleton-bar" />
              <div className="capacity-text skeleton-text skeleton-capacity" />
            </div>
          </div>
        </div>
        <div className="class-actions skeleton-actions">
          <div className="class-features">
            <div className="feature-tag skeleton-tag" />
            <div className="feature-tag skeleton-tag" />
            <div className="feature-tag skeleton-tag" />
          </div>
          <div className="action-buttons">
            <div className="btn-view-users skeleton-button" />
            <div className="skeleton-register-button" />
          </div>
        </div>
      </div>
    ));

  return (
    <div
      className={`class-schedule-container ${isEmbedded ? 'embedded' : ''}`}
      style={customContainerStyle}
    >
      <div className="class-schedule-box">
        {showHeader && (
          <div className="schedule-header">
            <div className="schedule-title">
              <h2>Horario de Clases</h2>
              <p>Entrena con nosotros</p>
            </div>

            <div className="date-navigation">
              <button
                className="nav-btn prev-btn"
                onClick={handlePreviousDay}
                title="Día anterior"
                disabled={loading}
              >
                <FaChevronLeft />
              </button>

              <div className="current-date">{getFormattedDate()}</div>

              <button
                className="nav-btn next-btn"
                onClick={handleNextDay}
                title="Día siguiente"
                disabled={loading}
              >
                <FaChevronRight />
              </button>
            </div>

            <button
              className="today-btn"
              onClick={handleToday}
              title="Ir a hoy"
              disabled={loading}
            >
              Hoy
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={fetchClasses} className="retry-btn">
              Reintentar
            </button>
          </div>
        )}

        <div className="classes-list">
          {loading ? (
            renderSkeletonItems()
          ) : classes.length > 0 ? (
            classes.map((clase) => {
              const total = Number(clase.total) || 20;
              const disponibles = Number(clase.disponibles) || 0;
              const capacityPercentage = getCapacityPercentage(disponibles, total);
              const capacityColor = getCapacityColor(capacityPercentage);

              return (
                <div
                  key={clase.id_clase}
                  className={`class-item ${expandedClassId === clase.id_clase ? 'expanded' : ''}`}
                  style={customItemStyle}
                  onClick={() => toggleExpand(clase.id_clase)}
                >
                  <div className="class-main-info">
                    <div className="class-icon">{getDisciplineIcon(clase.disciplina)}</div>

                    <div className="class-details">
                      <h3 className="class-discipline">{clase.disciplina}</h3>
                      <div className="class-meta">
                        <span className="class-time">{clase.hora} Hs</span>
                        <span className="class-trainer">Con {clase.entrenador || 'Nuestro equipo'}</span>
                      </div>
                      <p className="class-description">
                        {clase.descripcion || 'Clase grupal de alta intensidad'}
                      </p>
                    </div>

                    <div className="class-capacity">
                      <div className="capacity-info">
                        <div
                          className="capacity-bar"
                          style={{
                            background: `linear-gradient(90deg, ${capacityColor} ${capacityPercentage}%, #e5e7eb ${capacityPercentage}%)`,
                          }}
                        />
                        <span className="capacity-text">
                          {disponibles}/{total} cupos
                        </span>
                      </div>
                      {capacityPercentage >= 80 && <span className="capacity-alert">¡Últimos cupos!</span>}
                    </div>
                  </div>

                  <div className={`class-actions ${expandedClassId === clase.id_clase ? 'visible' : ''}`}>
                    <div className="class-features">
                      <span className="feature-tag">💪 Intensidad {clase.intensidad || 'Media'}</span>
                      <span className="feature-tag">⏱️ {clase.duracion || '60'} min</span>
                      <span className="feature-tag">🏋️‍♂️ {clase.nivel || 'Todos los niveles'}</span>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="btn-view-users"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUsersModal(clase);
                        }}
                        title="Ver alumnos anotados"
                      >
                        <FaUsers />
                        <span>Ver alumnos</span>
                        <span className="badge">{clase.inscriptos ?? 0}</span>
                      </button>

                      <RegisterButton
                        classId={clase.id_clase}
                        classType={clase.tipo === 'especial' ? 'especial' : 'normal'}
                        specialClassOriginalId={clase.id_original}
                        fecha={formattedDate}
                        hora={clase.hora}
                        disciplina={clase.disciplina}
                        userId={userId}
                        disabled={clase.inscripto || clase.disponibles === 0}
                        onSuccess={fetchClasses}
                        getToken={getToken}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-classes">
              <div className="no-classes-icon">🏋️‍♂️</div>
              <h3>No hay clases programadas</h3>
              <p>
                {adminMode && userId
                  ? 'El usuario no tiene clases para este día'
                  : 'No hay clases programadas para este día. Revisa otros días.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 👇 acá va el modal, fuera del return de la lista */}
      {showModal && selectedClass && (
        <ClassUsersModal
          classId={selectedClass.id_clase}
          classType={selectedClass.is_especial ? 'especial' : 'normal'}
          fecha={formattedDate}
          onClose={closeUsersModal}
          getToken={getToken}
        />
      )}
    </div>
  );
};

export default ClassSchedule;
