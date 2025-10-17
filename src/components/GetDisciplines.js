import React, { useEffect, useState } from 'react';
import '../styles/CreateClass.css';

const ViewDisciplines = () => {
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    fetch('https://backturnero-vvk6.onrender.com/api/disciplinas')
      .then(res => res.json())
      .then(data => setDisciplinas(data));
  }, []);

  return (
    <div className="CreateClassContainer">
      <h1>Disciplinas existentes</h1>
      <div className="checkbox-group">
        {disciplinas.map((d) => (
          <div key={d.id_disciplina}>
            <h3>{d.disciplina}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDisciplines;