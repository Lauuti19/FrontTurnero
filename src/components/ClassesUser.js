import React, { useState, useEffect } from 'react';
import '../styles/ClassSchedule.css';
import { useAuth } from "../AuthContext";
import ClassUsersModal from './ClassUsersModal';
import { FaUsers } from 'react-icons/fa';
import RegisterButton from './RegisterButton';
import {useNavigate} from 'react-router-dom';


//Mapeo de las clases 


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
  const navigate = useNavigate();
  


  const { getUserId } = useAuth();

  const openUsersModal = (clase) => {
    setSelectedClass(clase);
    setShowModal(true);
  };

  const closeUsersModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const formatDateForAPI = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
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

    fetchClasses();
  }, [currentDate, getUserId]);

  const handlePreviousDay = () => {
  const newDate = new Date(currentDate);
  do {
    newDate.setDate(newDate.getDate() - 1);
  } while (newDate.getDay() === 0); // 0 es domingo
  setCurrentDate(newDate);
};

const handleNextDay = () => {
  const newDate = new Date(currentDate);
  do {
    newDate.setDate(newDate.getDate() + 1);
  } while (newDate.getDay() === 0); // 0 es para que se saltee el domingod
  setCurrentDate(newDate);
};


  const formattedDay = (
    <>
      {daysOfWeek[currentDate.getDay()]}{" "}
      <span className="fecha-numero">
        {String(currentDate.getDate()).padStart(2, '0')}
      </span>
      <span className="guion-fecha">-</span>
      <span className="fecha-numero">
        {String(currentDate.getMonth() + 1).padStart(2, '0')}
      </span>
    </>
  );

  return (
    <div className="ClassSchedule-container">
      <div className="ClassSchedule-container-box">
        <div className="ClassSchedule-container-title">
          <button className="botonDias" onClick={handlePreviousDay}>◀</button>
          <span>{formattedDay}</span>
          <button className="botonDias" onClick={handleNextDay}>▶</button>
        </div>
        <div className="Class-Schedule-form">
          {loading ? (
            <p>Cargando clases...</p>
          ) : classes.length > 0 ? (
            classes.map((clase) => {
              const porcentaje = Math.round((1 - clase.disponibles / 20) * 100);
              const ahora = new Date();
              ahora.setSeconds(0, 0); // Limpiamos milisegundos

              // Creamos un Date de la clase con fecha y hora combinadas
              const [horaClase, minutosClase] = clase.hora.split(":").map(Number);
              const claseDateTime = new Date(currentDate);
              claseDateTime.setHours(horaClase, minutosClase, 0, 0);

              // Restamos diferencia en milisegundos
              const diferenciaEnMinutos = (claseDateTime - ahora) / (1000 * 60);

              // Reglas:
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
                  className="Class-Schedule-item"
                  style={{
                    background: `linear-gradient(90deg, #fbf106 ${porcentaje}%, #27272a ${porcentaje}%)`
                  }}
                >
                  <div className='Contenido-Map-Clases1'>
                    <h1>{clase.disciplina}</h1>
                    <h1>-</h1>
                    <h1 id='Horario'>{clase.hora}</h1>
                  </div>
                  <div className='Contenido-Map-Clases2'>
                    <button
                      className="boton-ver-anotados"
                      title="Ver anotados"
                      onClick={() => openUsersModal(clase)}
                    >
                      <FaUsers />
                    </button>
                    <div  title={esPasada ? "La clase ya terminó" : esMuyCerca ? "Falta menos de 30 minutos" : ""}>
                      <RegisterButton classname="botonrsv"
                        classId={clase.id_clase}
                        fecha={formatDateForAPI(currentDate)}
                        hora={clase.hora}
                        disciplina={clase.disciplina}
                        userId={getUserId()}
                        onSuccess={() => navigate(0)}
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
