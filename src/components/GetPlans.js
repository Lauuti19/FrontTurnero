import React, { useEffect, useState } from 'react';
import '../styles/CreateClass.css';

const ViewPlans = () => {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    fetch('https://backturnero.onrender.com/api/planes')
      .then(res => res.json())
      .then(data => setPlanes(data.planes));
  }, []);

  return (
    <div className="CreateClassContainer">
      <h2 id='Title-Planes'>Planes Existentes</h2>
      <div>
        {planes.map((p) => (
          <div key={p.id_plan} className="plan-item">
            <h3>{p.nombre}</h3>
            <p>Descripción: {p.descripcion}</p>
            <p>Precio: ${p.monto}</p>
            <p>Créditos: {p.creditos_total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPlans;