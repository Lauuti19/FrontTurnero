import React, { useEffect, useState } from 'react';
import '../styles/CreateClass.css';

const ViewExercises = () => {
  const [exercises, setExercises] = useState([]);

   const fetchExercises = async () => {
      const res = await fetch(`http://localhost:3001/api/exercises`);
      const data = await res.json();
      setExercises(data);
    };
  
    useEffect(() => {
      fetchExercises();
    }, []);

  return (
    <div className="CreateClassContainer">
      <label>Ejercicios existentes:</label>
      <div className="checkbox-group">
        {exercises.map((e) => (
          <div key={e.id_ejercicio}>
            <h3>{e.nombre}</h3>
            {e.link && <a href={e.link} target="_blank" rel="noopener noreferrer">{e.link}</a>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewExercises;