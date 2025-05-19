import React from "react";
import '../styles/DisciplinasPage.css'; // Asegúrate de tener este archivo CSS creado

const DisciplinasPage = () => {
  return (
    <div className="disciplinas-page-container">
      <div className="disciplinas-welcome-box">
        <div className="disciplinas-welcome-title">Bienvenido a la página de disciplinas</div>
        <div className="disciplinas-welcome-text">
        <p>Si eres un alumno, podrás ver las disciplinas que has elegido.</p>
        <p>Si eres un profesor, podrás ver las disciplinas que enseñas.</p>
        <p>Si eres un administrador, podrás ver todas las disciplinas y gestionar su información.</p>
        </div>
    </div>
    </div>
  );
}
export default DisciplinasPage;