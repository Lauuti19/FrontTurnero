import React, { useState, useEffect } from 'react';
import '../styles/ClassSchedule.css';
import ClassUsersModal from '../components/ClassUsersModal.js';
import { FaUsers } from 'react-icons/fa';
import RegisterButton from '../components/RegisterButton'; 

//mapeo de las clases pero de profe, osea todas

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const ClassSchedule = ({ userId: propUserId }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
  const userId = usuarioLocal?.id_rol === 1 ? propUserId : usuarioLocal?.id;
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

  useEffect(() => {
  const fetchClasses = async () => {
    setLoading(true);
    const formattedDate = formatDateForAPI(currentDate);
    const res = await fetch(`http://localhost:3001/api/classes/all?fecha=${formattedDate}`);
    const data = await res.json();
    setClasses(data);
    setLoading(false);
  };

  fetchClasses();
}, [currentDate]);


  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
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
              const porcentaje = Math.round((1 - clase.disponibles / clase.total) * 100);
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);
              /*const esPasada = currentDate < hoy;*/

              return (
                <div
                  key={clase.id_clase}
                  className={`Class-Schedule-item ${expandedClassId === clase.id_clase ? "expanded" : ""}`}
                  style={{
                    background: `linear-gradient(90deg, #fbf106 ${porcentaje}%, #27272a ${porcentaje}%)`
                  }}
                  onClick={() => toggleExpand(clase.id_clase)} // 👈 click para expandir/colapsar
                >
                  <div className='Contenido-Map-Clases1'>
                    <h1>{clase.disciplina}</h1>
                    <h1>-</h1>
                    <h1 id='Horario'>{clase.hora}</h1>
                  </div>

                  {/* Esto solo se muestra si está expandido o si no es mobile */}
                  <div className={`Contenido-Map-Clases2 ${expandedClassId === clase.id_clase ? "visible" : ""}`}>
                    <button
                      className="boton-ver-anotados"
                      title="Ver anotados"
                      onClick={(e) => {
                        e.stopPropagation(); // evita que cierre el acordeón al hacer click
                        openUsersModal(clase);
                      }}
                    ><FaUsers />
                    </button>
                    <RegisterButton
                      classId={clase.id_clase}
                      fecha={formatDateForAPI(currentDate)}
                      hora={clase.hora}
                      disciplina={clase.disciplina}
                      userId={userId}
                      disabled={clase.inscripto}
                      onSuccess={() => {
                        console.log('Inscripción exitosa');
                      }}
                    />
                    <h3>Lugares disponibles: {clase.disponibles}</h3>
                  </div>
                </div>

              );
            })
          ) : (
            <p>No hay clases para este día.</p>
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

export default ClassSchedule;