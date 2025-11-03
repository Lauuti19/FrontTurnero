// components/ClassSchedule.jsx (refactorizado y corregido)
import React, { useState } from 'react';
import {
  FaUsers, FaChevronLeft, FaChevronRight, FaCalendarAlt,
  FaDumbbell, FaRunning, FaHeart
} from 'react-icons/fa';
import '../styles/ClassSchedule.css';
import ClassUsersModal from './ClassUsersModal';
import RegistrationManager from './RegisterButtonFiles/RegistrationManager';
import SkeletonLoader from './SkeletonLoader';
import { useAuth } from '../AuthContext';
import { useClassSchedule } from '../hooks/otherHooks/useClassSchedule';

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const ClassSchedule = ({
  userId: propUserId,
  isEmbedded = false,
  showHeader = true,
  customContainerStyle = {},
  customItemStyle = {},
  adminMode = false,
}) => {
  const { getToken } = useAuth();
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const {
    currentDate,
    classes,
    loading,
    error,
    formattedDate,
    handlePreviousDay,
    handleNextDay,
    handleToday,
    refetch,
    getCapacityPercentage,
    getCapacityColor
  } = useClassSchedule({
    userId: propUserId,
    adminMode,
    getToken
  });

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

  // CORRECCIÓN: Usar != null para incluir 0 como valor válido
  const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
  const userId = propUserId != null ? propUserId : (usuarioLocal?.id_usuario || usuarioLocal?.id);

  // CORRECCIÓN: Función unificada para determinar el tipo de clase
  const getClassType = (clase) => {
    return (clase.tipo === 'especial' || clase.is_especial) ? 'especial' : 'normal';
  };

  // CORRECCIÓN: Función unificada para obtener el ID original
  const getClassOriginalId = (clase) => {
    return clase.id_original || clase.specialClassOriginalId;
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
            <button onClick={refetch} className="retry-btn">
              Reintentar
            </button>
          </div>
        )}

        <div className="classes-list">
          {loading ? (
            <SkeletonLoader 
              type="class-item" 
              count={4}
              className="class-schedule-skeleton"
            />
          ) : classes.length > 0 ? (
            classes.map((clase) => {
              const total = Number(clase.total) || 20;
              const disponibles = Number(clase.disponibles) || 0;
              const capacityPercentage = getCapacityPercentage(disponibles, total);
              const capacityColor = getCapacityColor(capacityPercentage);
              const classType = getClassType(clase);

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
                      </div>
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
                    <div className="classes-action-buttons">
                      <button
                        className="btn-view-users"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUsersModal(clase);
                        }}
                        title="Ver Anotados anotados"
                      >
                        <FaUsers />
                        <span>Ver Anotados</span>
                      </button>

                      <RegistrationManager
                        classId={clase.id_clase}
                        classType={classType}
                        specialClassOriginalId={getClassOriginalId(clase)}
                        fecha={formattedDate}
                        hora={clase.hora}
                        disciplina={clase.disciplina}
                        userId={userId}
                        disabled={clase.inscripto || clase.disponibles === 0}
                        disabledReason={clase.inscripto ? "Ya estás anotado" : "No hay cupos disponibles"}
                        onSuccess={refetch}
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

      {showModal && selectedClass && (
        <ClassUsersModal
          classId={selectedClass.id_clase}
          classType={getClassType(selectedClass)}
          fecha={formattedDate}
          onClose={closeUsersModal}
          getToken={getToken}
        />
      )}
    </div>
  );
};

export default ClassSchedule;