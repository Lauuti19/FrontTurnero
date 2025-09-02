import React, { useState, useEffect } from 'react';
import '../styles/ClassSchedule.css';
import { useAuth } from "../AuthContext";
import ClassUsersModal from './ClassUsersModal';
import { FaUsers } from 'react-icons/fa';
import { FiUser } from "react-icons/fi";
import RegisterButton from './RegisterButton';
import {useNavigate} from 'react-router-dom';

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const ClassesUser = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [classAttendees, setClassAttendees] = useState({});
  const navigate = useNavigate();

  const { getUserId } = useAuth();

  const toggleExpand = async (id) => {
    if (expandedClassId !== id) {
      await fetchClassAttendees(id);
    }
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

  const formatDateForAPI = (date) => date.toISOString().split("T")[0];

  const fetchClasses = async () => {
    setLoading(true);
    const formattedDate = formatDateForAPI(currentDate);
    const userId = getUserId();

    if (!userId) {
      console.error("No se encontró el id del usuario en localStorage");
      setClasses([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/classes/by-user?userId=${userId}&fecha=${formattedDate}`);
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error('Error al obtener las clases:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassAttendees = async (classId) => {
    try {
      const formattedDate = formatDateForAPI(currentDate);
      const res = await fetch(`http://localhost:3001/api/classes/attendees?classId=${classId}&fecha=${formattedDate}`);
      const data = await res.json();
      
      // Actualizar el estado con los usuarios de esta clase
      setClassAttendees(prev => ({
        ...prev,
        [classId]: data
      }));
    } catch (error) {
      console.error('Error al obtener los anotados:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [currentDate, getUserId()]);

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    do {
      newDate.setDate(newDate.getDate() - 1);
    } while (newDate.getDay() === 0);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    do {
      newDate.setDate(newDate.getDate() + 1);
    } while (newDate.getDay() === 0);
    setCurrentDate(newDate);
  };

  // Función para mobile: manejar el click en el botón de ver anotados
  const handleMobileUsersClick = (e, clase) => {
    e.stopPropagation();
    openUsersModal(clase);
  };

  // Función para desktop: manejar el click en el botón de ver anotados
  const handleDesktopUsersClick = (e, clase) => {
    e.stopPropagation();
    toggleExpand(clase.id_clase);
    openUsersModal(clase);
  };

  const formattedDay = (
    <div className="clase-fecha-mobile">
      <span className="fecha-dia">{daysOfWeek[currentDate.getDay()]}</span>
      <div className="fecha-numeros">
        <span className="fecha-numero">
          {String(currentDate.getDate()).padStart(2, '0')}
        </span>
        <span className="guion-fecha">-</span>
        <span className="fecha-numero">
          {String(currentDate.getMonth() + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );

  return (
    <div className="ClassSchedule-container">
      <div className="ClassSchedule-container-box">
        <div className="ClassSchedule-container-title">
          <button className="botonDias" onClick={handlePreviousDay}>◀</button>
          <span className='Fecha'>{formattedDay}</span>
          <button className="botonDias" onClick={handleNextDay}>▶</button>
        </div>
        <div className="Class-Schedule-form">
          {loading ? (
            <p>Cargando clases...</p>
          ) : classes.length > 0 ? (
            classes.map((clase) => {
              const porcentaje = Math.round((1 - clase.disponibles / 20) * 100);
              const ahora = new Date();
              ahora.setSeconds(0, 0);

              const [horaClase, minutosClase] = clase.hora.split(":").map(Number);
              const claseDateTime = new Date(currentDate);
              claseDateTime.setHours(horaClase, minutosClase, 0, 0);

              const diferenciaEnMinutos = (claseDateTime - ahora) / (1000 * 60);
              const esPasada = claseDateTime < ahora;
              const esMuyCerca = diferenciaEnMinutos < 30;

              let disabledReason = "";
              if (esPasada) {
                disabledReason = "Finalizada";
              } else if (esMuyCerca) {
                disabledReason = "Por Iniciar";
              }

              const desactivarRegistro = esPasada || esMuyCerca;

              return (
                <div
                  key={clase.id_clase}
                  className={`Class-Schedule-item ${expandedClassId === clase.id_clase ? "expanded" : ""}`}
                  style={{
                    background: `linear-gradient(90deg, #fbf106 ${porcentaje}%, #27272a ${porcentaje}%)`
                  }}
                  onClick={() => toggleExpand(clase.id_clase)}
                >
                  <div className='Contenido-Map-Clases1'>
                    <h1>{clase.disciplina}</h1>
                    <h1>-</h1>
                    <h1 id='Horario'>{clase.hora}</h1>
                  </div>
                  <div className={`Contenido-Map-Clases2 ${expandedClassId === clase.id_clase ? "visible" : ""}`}>
                    {/* Lista de usuarios anotados */}
                    {expandedClassId === clase.id_clase && classAttendees[clase.id_clase] && (
                      <div className="attendees-container">
                        <h4>Anotados:</h4>
                        <div className="attendees-list">
                          {classAttendees[clase.id_clase].map((user, index) => (
                            <div key={index} className="user-badge">
                              <FiUser className="user-icon" />
                              <span className="user-name">{user.nombre} {user.apellido}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      className="boton-ver-anotados"
                      title="Ver anotados"
                      onClick={(e) => {
                        if (window.innerWidth <= 768) {
                          handleMobileUsersClick(e, clase);
                        } else {
                          handleDesktopUsersClick(e, clase);
                        }
                      }}
                    >
                      <FaUsers />
                    </button>
                    <div title={esPasada ? "La clase ya terminó" : esMuyCerca ? "Falta menos de 30 minutos" : ""}>
                      <RegisterButton 
                        key={`${clase.id_clase}-${formatDateForAPI(currentDate)}-${getUserId()}`}
                        classId={clase.id_clase}
                        fecha={formatDateForAPI(currentDate)}
                        hora={clase.hora}
                        disciplina={clase.disciplina}
                        userId={getUserId()}
                        onSuccess={fetchClasses}
                        disabled={desactivarRegistro}
                        disabledReason={disabledReason}
                      />
                    </div>
                    <h3>Lugares disponibles: {clase.disponibles}</h3>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No tienes clases disponibles para el dia de hoy.</p>
          )}
        </div>
      </div>

      {showModal && selectedClass && (
        <ClassUsersModal
          classId={selectedClass.id_clase}
          fecha={formatDateForAPI(currentDate)}
          onClose={closeUsersModal}
        />
      )}
    </div>
  );
};

export default ClassesUser;