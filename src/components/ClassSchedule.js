// components/ClassSchedule.jsx (modificado)
import React, { useState, useCallback, useEffect } from 'react';
import {
  FaUsers, FaChevronLeft, FaChevronRight, FaCalendarAlt,
  FaDumbbell, FaRunning, FaHeart, FaChevronDown, FaChevronUp,
  FaExclamationTriangle, FaInfoCircle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
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
  customTitle = "Horario de Clases",
  customSubtitle = "Entrena con nosotros"
}) => {
  const { getToken } = useAuth();
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [displayError, setDisplayError] = useState("");

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

  // ✅ Función para mostrar SweetAlert de éxito
  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      background: '#ffffff',
      iconColor: '#28a745',
      timer: 4000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  };

  // ✅ Función para manejar errores específicos del horario de clases
  const handleScheduleError = useCallback((errorMessage) => {
    if (!errorMessage) return "";
    
    // Intentar parsear si es un objeto JSON
    let parsedMessage = errorMessage;
    try {
      if (typeof errorMessage === 'string' && errorMessage.includes('{')) {
        const errorObj = JSON.parse(errorMessage);
        parsedMessage = errorObj.error || errorObj.message || errorMessage;
      }
    } catch (e) {
      // Si falla el parseo, usar el mensaje original
    }

    const lowerError = parsedMessage.toLowerCase();
    
    // ✅ Errores de cuotas/creditos - MOSTRAR COMO MENSAJE AMIGABLE
    if (lowerError.includes('no hay cuotas válidas') || 
        lowerError.includes('cuotas válidas') ||
        lowerError.includes('créditos') ||
        lowerError.includes('creditos') ||
        lowerError.includes('cuota') ||
        lowerError.includes('pago') ||
        lowerError.includes('suscripción') ||
        lowerError.includes('suscripcion')) {
      return {
        type: 'info',
        message: "No posees clases disponibles en este momento. Si creés que es un error, comunicate con algún profesor o acercate al gimnasio.",
        showAlert: false
      };
    }
    
    // Errores de conexión/red
    if (lowerError.includes('network') || 
        lowerError.includes('conexión') || 
        lowerError.includes('fetch') ||
        lowerError.includes('failed to fetch')) {
      return {
        type: 'error',
        message: "Error de conexión. Verificá tu internet e intentá nuevamente.",
        showAlert: true
      };
    }
    
    // Errores de autenticación
    if (lowerError.includes('token') || 
        lowerError.includes('auth') || 
        lowerError.includes('no autorizado') ||
        lowerError.includes('unauthorized')) {
      return {
        type: 'error',
        message: "Sesión expirada. Por favor, volvé a iniciar sesión.",
        showAlert: true
      };
    }
    
    // Errores de servidor
    if (lowerError.includes('server') || 
        lowerError.includes('servidor') || 
        lowerError.includes('internal server error')) {
      return {
        type: 'error',
        message: "Error temporal del servidor. Intentá nuevamente en unos minutos.",
        showAlert: true
      };
    }
    
    // Errores de datos no encontrados
    if (lowerError.includes('not found') || 
        lowerError.includes('no encontrado') ||
        lowerError.includes('no hay clases')) {
      return {
        type: 'info',
        message: "No se encontraron clases para esta fecha.",
        showAlert: false
      };
    }
    
    // Error genérico
    return {
      type: 'error',
      message: parsedMessage || "Ocurrió un error inesperado. Intentá nuevamente.",
      showAlert: true
    };
  }, []);

  // ✅ Efecto para manejar errores del hook
  useEffect(() => {
    if (error) {
      const errorInfo = handleScheduleError(error);
      setDisplayError(errorInfo);
      
      // Mostrar SweetAlert solo para errores críticos que lo requieran
      if (errorInfo.showAlert) {
        Swal.fire({
          title: "Error al cargar horario",
          text: errorInfo.message,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545',
          background: '#ffffff',
          iconColor: '#dc3545',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
      }
    } else {
      setDisplayError("");
    }
  }, [error, handleScheduleError]);

  // ✅ Función para manejar reintento con feedback
  const handleRetry = async () => {
    try {
      setDisplayError("");
      await refetch();
      showSuccessAlert("¡Éxito!", "Horario actualizado correctamente");
    } catch (error) {
      // El error ya se maneja en el useEffect
      console.error("Error al reintentar:", error);
    }
  };

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

  // Función para crear la fecha completa de la clase
  const getClassFullDate = (horaClase) => {
    if (!horaClase) return null;
    
    // Crear fecha con la fecha actual + hora de la clase
    const [hours, minutes] = horaClase.split(':');
    const classDate = new Date(currentDate);
    classDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return classDate.toISOString();
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

  // Obtener usuario local
  const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
  const userId = propUserId != null ? propUserId : (usuarioLocal?.id_usuario || usuarioLocal?.id);

  // Función unificada para determinar el tipo de clase
  const getClassType = (clase) => {
    return (clase.tipo === 'especial' || clase.is_especial) ? 'especial' : 'normal';
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
              <h2>{customTitle}</h2>
              <p>{customSubtitle}</p>
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

        {/* ✅ Mensajes de error/información mejorados */}
        {displayError && (
          <div className={`info-message ${displayError.type === 'error' ? 'error-type' : 'info-type'}`}>
            <div className="message-icon">
              {displayError.type === 'error' ? <FaExclamationTriangle /> : <FaInfoCircle />}
            </div>
            <div className="message-content">
              <p>{displayError.message}</p>
              {displayError.type === 'error' && !displayError.message.includes("No se encontraron clases") && (
                <button onClick={handleRetry} className="retry-btn" disabled={loading}>
                  {loading ? 'Reintentando...' : 'Reintentar'}
                </button>
              )}
            </div>
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
              const isExpanded = expandedClassId === clase.id_clase;
              const classFullDate = getClassFullDate(clase.hora);

              return (
                <div
                  key={clase.id_clase}
                  className={`class-item ${isExpanded ? 'expanded' : ''}`}
                  style={customItemStyle}
                >
                  {/* Header de la clase - Siempre visible */}
                  <div 
                    className="class-main-info"
                    onClick={() => toggleExpand(clase.id_clase)}
                  >
                    <div className="class-icon">
                      {getDisciplineIcon(clase.disciplina)}
                    </div>

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
                      </div>
                      <span className="class-available">
                          {disponibles}/{total} cupos
                      </span>
                    </div>

                    <div className="expand-icon">
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>

                  {/* Contenido expandible - Solo visible cuando está expandido */}
                  {isExpanded && (
                    <div className="class-expanded-content">
                      <div className="class-action-buttons">
                        <button
                          className="btn-view-users"
                          onClick={() => openUsersModal(clase)}
                          title="Ver usuarios anotados"
                        >
                          <FaUsers />
                          <span>Ver Anotados</span>
                        </button>
                          <RegistrationManager
                            classId={clase.id_clase}
                            classType={classType}
                            fecha={classFullDate}
                            hora={clase.hora}
                            getToken={getToken}
                            userId={userId}
                            isAdmin={adminMode}
                            onRegistrationChange={refetch}
                            classInfo={{
                              disciplina: clase.disciplina,
                              hora: clase.hora,
                              id_clase: clase.id_clase
                            }}
                          />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            !displayError && ( // Solo mostrar "no hay clases" si no hay error
              <div className="no-classes">
                <div className="no-classes-icon">🏋️‍♂️</div>
                <h3>No hay clases programadas</h3>
                <p>
                  {adminMode && userId
                    ? 'El usuario no tiene clases para este día'
                    : 'No hay clases programadas para este día. Revisá otros días.'}
                </p>
              </div>
            )
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