import React, { useState, useEffect } from 'react';
import '../styles/ClassSchedule.css'; 
import CTAButton from './CTAButton';

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const ClassSchedule = () => {
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClassesForDay(daysOfWeek[currentDate.getDay()]);
  }, [currentDate]);

  const fetchClassesForDay = (day) => {
    fetch('http://localhost:3001/api/classes')
      .then(response => response.json())
      .then(data => {
        const filteredClasses = data.filter(clase => clase.dia === day);
        setClasses(filteredClasses);
      })
      .catch(error => console.error('Error fetching classes:', error));
  };

  const handlePreviousDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  const formattedDay = (
    <>
      {daysOfWeek[currentDate.getDay()]}{" "}
      <span className="fecha-numero">
        {currentDate.getDate().toString().padStart(2, '0')}
      </span>
      <span className="guion-fecha">-</span>
      <span className="fecha-numero">
        {(currentDate.getMonth() + 1).toString().padStart(2, '0')}
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
          {classes.length > 0 ? (
            classes.map((clase) => {
              const totalLugares = 20;
              const ocupacion = 1 - (clase.disponibles / totalLugares);
              const porcentaje = Math.round(ocupacion * 100);

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
                    <button className="botonReservar">
                      <h3>Anotarse</h3>
                    </button>
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
    </div>
  );
};

export default ClassSchedule;
