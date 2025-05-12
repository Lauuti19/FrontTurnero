import React, { useState, useEffect } from 'react';
import '../styles/RegisterUser.css'; // Asegúrate de que el CSS esté correctamente importado

const ClassSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  
  // Declarar daysOfWeek fuera de useEffect
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Llamada a la API cuando el índice del día cambia
    fetchClassesForDay(daysOfWeek[currentDayIndex]);
  }, [currentDayIndex]); // Solo depende de currentDayIndex

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
    setCurrentDayIndex((prevIndex) => (prevIndex === 0 ? 6 : prevIndex - 1));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex === 6 ? 0 : prevIndex + 1));
  };

  return (
    <div className="register-user-container">
      <div className="register-user-box">
        <div className="register-user-title">
          <button className="botonDias" onClick={handlePreviousDay}>&lt;</button>
          <span>{daysOfWeek[currentDayIndex]}</span>
          <button className="botonDias" onClick={handleNextDay}>&gt;</button>
        </div>

        <div className="register-user-form">
          {classes.length > 0 ? (
            classes.map((clase) => (
              <div key={clase.id_clase}>
                <div>
                  <strong>Disciplina:</strong> {clase.disciplina}
                </div>
                <div>
                  <strong>Hora:</strong> {clase.hora}
                </div>
                <div>
                  <strong>Capacidad Max:</strong> {clase.capacidad_max}
                </div>
                <div>
                  <strong>Disponibles:</strong> {clase.disponibles}
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p>No hay clases para este día.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;
