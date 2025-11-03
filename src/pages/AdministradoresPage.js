// src/pages/AdministradoresPage.js
import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import CashAccionesManager from "../components/CashAccionesManager";
import CashDistribucionByCaja from "../components/CashDistribucionByCaja";
import CashCerrarCaja from "../components/CashCerrarCaja";
import "../styles/AdministradoresPage.css";

const AdministradoresPage = () => {
  const [activeTab, setActiveTab] = useState("acciones");

  return (
    <div className="admins-page-container">
      <div className="admins-header">
        <div className="admins-title-wrap">
          <FaUserShield className="admins-icon" />
          <div>
            <h1 className="admins-title">Administradores / Acciones de Caja</h1>
            <p className="admins-subtitle">
              Gestioná las participaciones desde un solo lugar.
            </p>
          </div>
        </div>
      </div>

      <div className="admins-tabs">
        <button
          className={activeTab === "acciones" ? "active" : ""}
          onClick={() => setActiveTab("acciones")}
        >
          Acciones
        </button>
        <button
          className={activeTab === "distCaja" ? "active" : ""}
          onClick={() => setActiveTab("distCaja")}
        >
          Distribución por caja
        </button>
        <button
          className={activeTab === "cerrarCaja" ? "active" : ""}
          onClick={() => setActiveTab("cerrarCaja")}
        >
          Cerrar caja
        </button>
      </div>

      {activeTab === "acciones" && (
        <div className="admins-section">
          <CashAccionesManager />
        </div>
      )}

      {activeTab === "distCaja" && (
        <div className="admins-section">
          <CashDistribucionByCaja />
        </div>
      )}

      {activeTab === "cerrarCaja" && (
        <div className="admins-section">
          <CashCerrarCaja />
        </div>
      )}
    </div>
  );
};

export default AdministradoresPage;
