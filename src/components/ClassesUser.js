import React, { useState, useEffect } from 'react';
import '../styles/RegisterUser.css'; 

const ClassesUser = () => {
  const [classes, setClasses] = useState([]);

  const fetchClassesForUser = (userId) => {
    fetch(`http://localhost:3001/api/classes/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setClasses(data);
      })
      .catch((error) => console.error("Error fetching classes:", error));
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log("Usuario del localStorage:", usuario, usuario.id_usuario, usuario.id_rol); 

    if (usuario && usuario.id_usuario) {
      fetchClassesForUser(usuario.id_usuario);
    }
  }, []);

  return (
    <div className="register-user-container">
      <div className="register-user-box">
        <div className="register-user-title">Tus clases disponibles</div>

        <div className="register-user-form">
          {classes.length > 0 ? (
            classes.map((clase) => (
              <div key={clase.id_clase}>
                <div>
                  <strong>Disciplina:</strong> {clase.disciplina}
                </div>
                <div>
                  <strong>Día:</strong> {clase.dia}
                </div>
                <div>
                  <strong>Hora:</strong> {clase.hora}
                </div>
                <div>
                  <strong>Capacidad Máx:</strong> {clase.capacidad_max}
                </div>
                <div>
                  <strong>Disponibles:</strong> {clase.disponibles}
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p>No hay clases disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassesUser;
