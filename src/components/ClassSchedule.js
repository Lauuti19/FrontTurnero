import React, { useState, useEffect } from 'react';
import { FaUsers, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaDumbbell, FaRunning, FaHeart } from 'react-icons/fa';
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
  adminMode = false 
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    if (today.getDay() === 0) {
      today.setDate(today.getDate() + 1);
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
    : usuarioLocal?.id_usuario || usuarioLocal?.id; 

  const [expandedClassId, setExpandedClassId] = useState(null);

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

  const formatDateForAPI = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = formatDateForAPI(currentDate);
      const token = getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      let data;
      if (adminMode && userId) {
        data = await classService.getClassesByUser(token, userId, formattedDate);
      } else {
        data = await classService.getClasses(token, formattedDate);
      }
      
      const clasesFormateadas = data.map(clase => ({
        ...clase,
        hora: clase.hora ? clase.hora.substring(0, 5) : clase.hora
      }));
      
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
  }, [currentDate, userId, adminMode, getToken]);

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    if (newDate.getDay() === 0) {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    if (newDate.getDay() === 0) {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    if (today.getDay() === 0) {
      today.setDate(today.getDate() + 1);
    }
    today.setHours(0, 0, 0, 0);
    setCurrentDate(today);
  };

  const getDisciplineIcon = (disciplina) => {
    const disciplinaLower = disciplina.toLowerCase();
    if (disciplinaLower.includes('funcional') || disciplinaLower.includes('cross')) {
      return <FaRunning className="discipline-icon" />;
    } else if (disciplinaLower.includes('musculación') || disciplinaLower.includes('pesas')) {
      return <FaDumbbell className="discipline-icon" />;
    } else if (disciplinaLower.includes('yoga') || disciplinaLower.includes('pilates')) {
      return <FaHeart className="discipline-icon" />;
    }
    return <FaDumbbell className="discipline-icon" />;
  };

  const getFormattedDate = () => {
    const dayIndex = currentDate.getDay();
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    
    return (
      <div className="schedule-date">
        <FaCalendarAlt className="calendar-icon" />
        <div className="date-content">
          <span className="day-name">{daysOfWeek[adjustedDayIndex]}</span>
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
    return Math.round((1 - disponibles / total) * 100);
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 80) return '#dc2626';
    if (percentage >= 60) return '#f59e0b';
    return '#16a34a';
  };

  // Skeleton loading items
  const renderSkeletonItems = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="class-item skeleton-item">
        <div className="class-main-info">
          <div className="class-icon skeleton-icon"></div>
          
          <div className="class-details">
            <div className="class-discipline skeleton-text skeleton-title"></div>
            <div className="class-meta">
              <div className="class-time skeleton-text skeleton-time"></div>
              <div className="class-trainer skeleton-text skeleton-trainer"></div>
            </div>
            <div className="class-description skeleton-text skeleton-description"></div>
          </div>
          
          <div className="class-capacity">
            <div className="capacity-info">
              <div className="capacity-bar skeleton-bar"></div>
              <div className="capacity-text skeleton-text skeleton-capacity"></div>
            </div>
          </div>
        </div>

        <div className="class-actions skeleton-actions">
          <div className="class-features">
            <div className="feature-tag skeleton-tag"></div>
            <div className="feature-tag skeleton-tag"></div>
            <div className="feature-tag skeleton-tag"></div>
          </div>
          
          <div className="action-buttons">
            {adminMode && (
              <div className="btn-view-users skeleton-button"></div>
            )}
            <div className="skeleton-register-button"></div>
          </div>
        </div>
      </div>
    ));
  };

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
              
              <div className="current-date">
                {getFormattedDate()}
              </div>

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
              const capacityPercentage = getCapacityPercentage(clase.disponibles, clase.total);
              const capacityColor = getCapacityColor(capacityPercentage);

              return (
                <div
                  key={clase.id_clase}
                  className={`class-item ${expandedClassId === clase.id_clase ? "expanded" : ""}`}
                  style={customItemStyle}
                  onClick={() => toggleExpand(clase.id_clase)}
                >
                  <div className="class-main-info">
                    <div className="class-icon">
                      {getDisciplineIcon(clase.disciplina)}
                    </div>
                    
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
                            background: `linear-gradient(90deg, ${capacityColor} ${capacityPercentage}%, #e5e7eb ${capacityPercentage}%)`
                          }}
                        ></div>
                        <span className="capacity-text">
                          {clase.disponibles}/{clase.total} cupos
                        </span>
                      </div>
                      {capacityPercentage >= 80 && (
                        <span className="capacity-alert">¡Últimos cupos!</span>
                      )}
                    </div>
                  </div>

                  <div className={`class-actions ${expandedClassId === clase.id_clase ? "visible" : ""}`}>
                    <div className="class-features">
                      <span className="feature-tag">💪 Intensidad {clase.intensidad || 'Media'}</span>
                      <span className="feature-tag">⏱️ {clase.duracion || '60'} min</span>
                      <span className="feature-tag">🏋️‍♂️ {clase.nivel || 'Todos los niveles'}</span>
                    </div>
                    
                    <div className="action-buttons">
                      {adminMode && (
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
                        </button>
                      )}
                      
                      <RegisterButton
                        classId={clase.id_clase}
                        fecha={formatDateForAPI(currentDate)}
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
                  : 'No hay clases programadas para este día. Revisa otros días.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedClass && (
        <ClassUsersModal
          classId={selectedClass.id_clase}
          fecha={formatDateForAPI(currentDate)}
          onClose={closeUsersModal}
          getToken={getToken}
        />
      )}
    </div>
  );
};

export default ClassSchedule;