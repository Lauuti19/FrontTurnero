import React, { useState, useCallback, useEffect } from 'react';
import {
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaDumbbell,
  FaRunning,
  FaHeart,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../styles/ClassSchedule.css';
import ClassUsersModal from './ClassUsersModal';
import RegistrationManager from './RegisterButtonFiles/RegistrationManager';
import SkeletonLoader from './SkeletonLoader';
import { useAuth } from '../AuthContext';
import { useClassSchedule } from '../hooks/otherHooks/useClassSchedule';
import { classService } from '../services/classService';
import { disciplineService } from '../services/disciplinaService';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const ClassSchedule = ({
  userId: propUserId,
  isEmbedded = false,
  showHeader = true,
  customContainerStyle = {},
  customItemStyle = {},
  adminMode = false,
  customTitle = 'Horario de Clases',
  customSubtitle = 'Entrena con nosotros',
  forceStudentSchedule = false,   // NUEVO
  ignoreTimeRestrictions = false  // NUEVO
}) => {
  const { getToken } = useAuth();

  const [expandedClassId, setExpandedClassId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [displayError, setDisplayError] = useState('');
  const [disciplines, setDisciplines] = useState([]);

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
    // si estoy gestionando a un alumno y quiero sus clases por plan,
    // fuerzo adminMode = false en el hook
    adminMode: forceStudentSchedule ? false : adminMode,
    getToken
  });

  // Normaliza/embellece mensajes de error
  const handleScheduleError = useCallback((rawError) => {
    if (!rawError) {
      return { type: 'info', message: '', showAlert: false };
    }

    let message = typeof rawError === 'string' ? rawError : (rawError.message || '');

    // Intento parsear JSON si vino como string serializado
    try {
      if (typeof rawError === 'string' && rawError.includes('{')) {
        const obj = JSON.parse(rawError);
        message = obj.error || obj.message || message;
      }
    } catch {
      // dejo el mensaje como está
    }

    const lower = message.toLowerCase();

    // Casos especiales más amigables (créditos, cuotas, etc.)
    if (
      lower.includes('no hay cuotas válidas') ||
      lower.includes('cuotas válidas') ||
      lower.includes('créditos') ||
      lower.includes('creditos') ||
      lower.includes('cuota') ||
      lower.includes('pago') ||
      lower.includes('suscripción') ||
      lower.includes('suscripcion')
    ) {
      return {
        type: 'info',
        message:
          'No tenés clases disponibles para este día con tu plan actual. Si creés que es un error, consultá en recepción o con un profesor.',
        showAlert: false
      };
    }

    if (
      lower.includes('network') ||
      lower.includes('conexión') ||
      lower.includes('conexion') ||
      lower.includes('fetch') ||
      lower.includes('failed to fetch')
    ) {
      return {
        type: 'error',
        message: 'Hubo un problema de conexión al cargar las clases. Probá de nuevo en unos segundos.',
        showAlert: false
      };
    }

    return {
      type: 'error',
      message: message || 'Ocurrió un error al cargar las clases.',
      showAlert: false
    };
  }, []);

  useEffect(() => {
    if (error) {
      const parsed = handleScheduleError(error);
      setDisplayError(parsed.message);

      if (parsed.showAlert) {
        Swal.fire({
          icon: parsed.type === 'info' ? 'info' : 'error',
          title: parsed.type === 'info' ? 'Información' : 'Error',
          text: parsed.message,
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      setDisplayError('');
    }
  }, [error, handleScheduleError]);

  const getFormattedDate = () => {
    const dayIndex = currentDate.getDay();
    const adjusted = dayIndex === 0 ? 6 : dayIndex - 1;

    return (
      <div className="schedule-date">
        <FaCalendarAlt className="calendar-icon" />
        <div className="date-content">
          <span className="day-name">{daysOfWeek[adjusted]}</span>
          <div className="date-numbers">
            <span className="date-day">
              {String(currentDate.getDate()).padStart(2, '0')}
            </span>
            <span className="date-separator">/</span>
            <span className="date-month">
              {String(currentDate.getMonth() + 1).padStart(2, '0')}
            </span>
            <span className="date-separator">/</span>
            <span className="date-year">{currentDate.getFullYear()}</span>
          </div>
        </div>
      </div>
    );
  };

  // Usuario actual (si no se pasó userId por props)
  const usuarioLocal = (() => {
    try {
      return JSON.parse(localStorage.getItem('usuario'));
    } catch {
      return null;
    }
  })();

  const userId =
    propUserId != null ? propUserId : usuarioLocal?.id_usuario || usuarioLocal?.id;

  const getClassType = (clase) =>
    clase && (clase.tipo === 'especial' || clase.is_especial) ? 'especial' : 'normal';

  const getDisciplineIcon = (disciplina) => {
    const name = (disciplina || '').toLowerCase();

    if (name.includes('funcional') || name.includes('cross') || name.includes('hiit')) {
      return <FaRunning />;
    }

    if (name.includes('yoga') || name.includes('stretch') || name.includes('pilates')) {
      return <FaHeart />;
    }

    // default
    return <FaDumbbell />;
  };

  const toggleExpand = (id_clase) => {
    setExpandedClassId((prev) => (prev === id_clase ? null : id_clase));
  };

  const openUsersModal = (clase) => {
    setSelectedClass(clase);
    setShowModal(true);
  };

  const closeUsersModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  // ===== Helpers para edición / borrado =====

  const loadDisciplinesIfNeeded = useCallback(async () => {
    if (!adminMode) return [];
    if (disciplines.length > 0) return disciplines;

    try {
      const token = await getToken();
      const data = await disciplineService.getDisciplinas(token);
      const list = Array.isArray(data) ? data : [];
      setDisciplines(list);
      return list;
    } catch (err) {
      console.error('Error cargando disciplinas:', err);
      Swal.fire('Error', 'No se pudieron cargar las disciplinas.', 'error');
      return [];
    }
  }, [adminMode, disciplines, getToken]);

  const openEditClassModal = async (clase) => {
    if (!adminMode) return;

    const classType = getClassType(clase);

    const list = await loadDisciplinesIfNeeded();
    if (!list || list.length === 0) return;

    const currentDiscipline = list.find(
      (d) =>
        d.disciplina?.toLowerCase() === clase.disciplina?.toLowerCase() ||
        d.nombre?.toLowerCase() === clase.disciplina?.toLowerCase()
    );

    const initialDisciplineId =
      currentDiscipline?.id_disciplina ?? list[0]?.id_disciplina ?? '';

    const total =
      clase.capacidad_total ??
      clase.capacidad_max ??
      clase.cupo_maximo ??
      clase.cupos_totales ??
      0;

    const { value: formValues } = await Swal.fire({
      title: `Editar clase ${classType === 'especial' ? 'especial / feriado' : 'normal'}`,
      html: `
        <div style="display:flex;flex-direction:column;gap:8px;text-align:left;">
          <label style="font-size:0.9rem;">Disciplina</label>
          <select id="swal-disciplina" class="swal2-input" style="margin:0;">
            ${list
              .map(
                (d) => `
              <option value="${d.id_disciplina}" ${
                  d.id_disciplina === initialDisciplineId ? 'selected' : ''
                }>
                ${d.disciplina || d.nombre}
              </option>
            `
              )
              .join('')}
          </select>

          <label style="font-size:0.9rem;margin-top:8px;">Hora</label>
          <input id="swal-hora" type="time" class="swal2-input" value="${clase.hora || ''}" style="margin:0;">

          <label style="font-size:0.9rem;margin-top:8px;">Capacidad máxima</label>
          <input id="swal-capacidad" type="number" min="1" class="swal2-input"
                 value="${total || ''}" style="margin:0;">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
    const disciplinaSelect = document.getElementById('swal-disciplina');
    const horaInput = document.getElementById('swal-hora');
    const capacidadInput = document.getElementById('swal-capacidad');

    if (!disciplinaSelect || !horaInput || !capacidadInput) {
      Swal.showValidationMessage('Error interno en el formulario.');
      return null;
    }

    const disciplinaId = disciplinaSelect.value;
    const hora = horaInput.value;
    const capacidad = capacidadInput.value;

    if (!disciplinaId || !hora) {
      Swal.showValidationMessage('Disciplina y hora son obligatorias.');
      return null;
    }

    return {
      disciplinaId: Number(disciplinaId),
      hora,
      capacidad: capacidad ? Number(capacidad) : null,
    };
  },

    });

    if (!formValues) return;

    try {
      const token = await getToken();

      if (classType === 'normal') {
        // día de la semana: Lunes = 1 ... Sábado = 6 (según tu SP GetClassesByDay)
        const dayIndex = currentDate.getDay(); // 0=Domingo, 1=Lunes...
        const adjusted = dayIndex === 0 ? 6 : dayIndex - 1; // 0..5
        const id_dia = adjusted + 1;

        await classService.updateClass(token, clase.id_clase, {
          id_disciplina: formValues.disciplinaId,
          id_dia,
          hora: formValues.hora,
          capacidad_max: formValues.capacidad,
        });
      } else {
        // Especial / feriado: usamos id_clase_especial si existe, o id_original, o id_clase
        const specialId =
          clase.id_clase_especial || clase.id_original || clase.id_clase;

        await classService.updateSpecialClass(token, specialId, {
          id_disciplina: formValues.disciplinaId,
          hora: formValues.hora,
          capacidad_max: formValues.capacidad,
        });
      }

      await Swal.fire('OK', 'Clase actualizada correctamente.', 'success');
      refetch();
    } catch (err) {
      console.error('Error actualizando clase:', err);
      Swal.fire('Error', 'No se pudo actualizar la clase.', 'error');
    }
  };

  const openDeleteClassConfirm = async (clase) => {
    if (!adminMode) return;

    const classType = getClassType(clase);

    const result = await Swal.fire({
      title: 'Eliminar clase',
      text: `¿Seguro que querés eliminar esta clase ${
        classType === 'especial' ? 'especial / feriado' : 'normal'
      } de ${clase.disciplina} a las ${clase.hora} Hs?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const token = await getToken();

      if (classType === 'normal') {
        await classService.deleteClass(token, clase.id_clase);
      } else {
        const specialId =
          clase.id_clase_especial || clase.id_original || clase.id_clase;
        await classService.deleteSpecialClass(token, specialId);
      }

      await Swal.fire('OK', 'Clase eliminada correctamente.', 'success');
      refetch();
    } catch (err) {
      console.error('Error eliminando clase:', err);
      Swal.fire('Error', 'No se pudo eliminar la clase.', 'error');
    }
  };

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <div className="schedule-header">
        <div className="schedule-title">
          <h2>{customTitle}</h2>
          {customSubtitle && <p>{customSubtitle}</p>}
        </div>

        <div className="date-navigation">
          <button
            className="nav-btn"
            onClick={handlePreviousDay}
            disabled={loading}
            type="button"
          >
            <FaChevronLeft />
          </button>
          <div className="current-date">{getFormattedDate()}</div>
          <button
            className="nav-btn"
            onClick={handleNextDay}
            disabled={loading}
            type="button"
          >
            <FaChevronRight />
          </button>
        </div>

        <button
          className="today-btn"
          onClick={handleToday}
          disabled={loading}
          type="button"
        >
          Hoy
        </button>
      </div>
    );
  };

  const renderInfoMessage = () => {
    if (!displayError) return null;

    const parsed = handleScheduleError(error);
    const isError = parsed.type === 'error';

    return (
      <div
        className={`class-schedule-info-message ${
          isError ? 'error-type' : 'info-type'
        }`}
      >
        <div className="class-schedule-message-icon">
          {isError ? <FaExclamationTriangle /> : <FaInfoCircle />}
        </div>
        <div className="class-schedule-message-content">
          <p>{parsed.message}</p>
          <button
            type="button"
            className="class-schedule-retry-btn"
            onClick={refetch}
            disabled={loading}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  };

  const renderNoClasses = () => {
    if (loading || error || (classes && classes.length > 0)) return null;

    return (
      <div className="no-classes">
        <div className="no-classes-icon">
          <FaInfoCircle />
        </div>
        <h3>No hay clases para este día</h3>
        <p>
          Probá cambiar la fecha o consultá en recepción si pensás que debería
          haber clases disponibles.
        </p>
      </div>
    );
  };

  const renderClasses = () => {
    if (!classes || classes.length === 0) return null;

    return (
      <div className="classes-list">
        {classes.map((clase) => {
          const isExpanded = expandedClassId === clase.id_clase;
          const classType = getClassType(clase);

          const total =
            clase.capacidad_total ??
            clase.capacidad_max ??
            clase.cupo_maximo ??
            clase.cupos_totales ??
            0;

          const disponibles =
            clase.cupos_disponibles ??
            clase.cupo_disponible ??
            clase.disponibles ??
            (total && clase.anotados != null ? total - clase.anotados : 0);

          const percentage =
            total > 0 ? getCapacityPercentage(disponibles, total) : 0;

          const capacityColor = getCapacityColor(percentage);

          const classFullDate = formattedDate;

          return (
            <div
              key={clase.id_clase}
              className={`class-item ${isExpanded ? 'expanded' : ''}`}
              style={customItemStyle}
            >
              <div
                className="class-main-info"
                onClick={() => toggleExpand(clase.id_clase)}
              >
                <div className="class-icon">{getDisciplineIcon(clase.disciplina)}</div>

                <div className="class-details">
                  <h3 className="class-discipline">{clase.disciplina}</h3>
                  <div className="class-meta">
                    <span className="class-time">{clase.hora} Hs</span>
                  </div>
                </div>

                <div className="class-capacity">
                  <div className="capacity-info">
                    <div className="capacity-bar">
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: capacityColor,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    {total > 0 && (
                      <span className="capacity-text">
                        {total - disponibles} / {total} ocupados
                      </span>
                    )}
                  </div>
                </div>

                <div className="expand-icon">
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {isExpanded && (
                <div className="class-expanded-content">
                  <div className="class-action-buttons">
                    <button
                      type="button"
                      className="btn-view-users"
                      onClick={(e) => {
                        e.stopPropagation();
                        openUsersModal(clase);
                      }}
                    >
                      <FaUsers /> Ver anotados
                    </button>

                    {adminMode && (
                      <>
                        <button
                          type="button"
                          className="btn-edit-class"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditClassModal(clase);
                          }}
                        >
                          Editar clase
                        </button>

                        <button
                          type="button"
                          className="btn-delete-class"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteClassConfirm(clase);
                          }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}

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
                      ignoreTimeRestrictions={ignoreTimeRestrictions}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`class-schedule-container ${isEmbedded ? 'embedded' : ''}`}
      style={customContainerStyle}
    >
      <div className="class-schedule-box">
        {renderHeader()}

        {renderInfoMessage()}

        {loading && (
          <div className="class-schedule-skeleton">
            <SkeletonLoader type="card" count={3} height="90px" />
          </div>
        )}

        {!loading && renderNoClasses()}

        {!loading && renderClasses()}
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
