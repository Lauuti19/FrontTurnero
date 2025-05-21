import React, { useState, useEffect } from 'react';
import '../styles/ClassSchedule.css';

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const ClassSchedule = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDateForAPI = (date) => {
    return date.toISOString().split("T")[0]; 
  };

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const formattedDate = formatDateForAPI(currentDate);

      try {
        const res = await fetch(`http://localhost:3001/api/classes/all?fecha=${formattedDate}`);
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
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);
              const esPasada = currentDate < hoy;

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
                      className={`botonReservar${esPasada ? " no-disponible" : ""}`}
                      disabled={esPasada}
                      style={esPasada ? { cursor: "not-allowed", background: "#bdbdbd", color: "#fff" } : {}}
                    >
                      <h3>{esPasada ? "No disponible" : "Anotarse"}</h3>
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
