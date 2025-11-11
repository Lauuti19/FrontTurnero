import React, { useState } from "react";
import Buscador from "./Buscador";
import ClassSchedule from "./ClassSchedule";
import "../styles/AnotarUsuarioAClase.css";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaUserFriends,
} from "react-icons/fa";

const AnotarUsuarioAClase = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  return (
    <div className="anotar-usuario-a-clase">
      <div className="anotar-header">
        <div className="anotar-title-container">
          <div className="anotar-icon">
            <FaUserPlus />
          </div>
          <div className="anotar-title-content">
            <h2>Anotar usuario a clase</h2>
            <p>
              Busca un usuario y anotalo a una de sus clases disponibles. Los
              profesores pueden anotar incluso sobre la hora o luego de la clase.
            </p>
          </div>
        </div>
      </div>

      <div className="anotar-content">
        <div className="anotar-left">
          <Buscador onUsuarioSeleccionado={setUsuarioSeleccionado} />

          {usuarioSeleccionado && (
            <div className="usuario-info-card">
              <div className="usuario-info-header">
                <FaUser className="usuario-info-icon" />
                <h3>Usuario seleccionado</h3>
              </div>
              <div className="usuario-info-grid">
                <div className="info-item">
                  <FaUser className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Nombre completo</span>
                    <span className="info-value">
                      {usuarioSeleccionado.nombre}{" "}
                      {usuarioSeleccionado.apellido || ""}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <span className="info-value">
                      {usuarioSeleccionado.email}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <FaIdCard className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">DNI</span>
                    <span className="info-value">
                      {usuarioSeleccionado.dni}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="anotar-right">
          <div className="clases-section">
            {usuarioSeleccionado ? (
              <ClassSchedule
                userId={usuarioSeleccionado?.id_usuario}
                isEmbedded={true}
                showHeader={true}
                customTitle="Clases del usuario seleccionado"
                customSubtitle="Elegí el día y anotalo en su clase"
                adminMode={true}
                forceStudentSchedule={true}
                ignoreTimeRestrictions={true}
                customContainerStyle={{
                  padding: "0",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                customItemStyle={{
                  width: "100%",
                  maxWidth: "none",
                  margin: "12px 0",
                }}
              />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaUserFriends />
                </div>
                <h3>Selecciona un usuario</h3>
                <p>
                  Busca y selecciona un usuario para ver las clases disponibles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnotarUsuarioAClase;
