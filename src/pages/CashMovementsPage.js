// src/pages/CashMovementsPage.js
import React, { useState } from "react";
import "../styles/CashMovements.css";
import CashMovementsToday from "../components/CashMovementsToday";
import CashMovementsByRange from "../components/CashMovementsByRange";
import CashMovementsAll from "../components/CashMovementsAll";
import RegisterMovementModal from "../components/RegisterMovementModal";

const CashMovementsPage = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState(null);

  return (
    <div className="cash-page-container">
      <div className="cash-page-box">
        <div className="cash-page-header">
          <h1 className="cash-page-title">Movimientos de Caja</h1>
          <button className="btn-add-movement" onClick={() => setShowModal(true)}>
            ＋
          </button>
        </div>
        {/* Solapas mejoradas */}
        <div className="tabs-cash">
          <button
            className={activeTab === "today" ? "active" : ""}
            onClick={() => setActiveTab("today")}
          >
            Hoy
          </button>
          <button
            className={activeTab === "range" ? "active" : ""}
            onClick={() => setActiveTab("range")}
          >
            Por Rango
          </button>
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            Todos
          </button>
        </div>


        {/* Contenido dinámico */}
        {activeTab === "today" && <CashMovementsToday />}
        {activeTab === "range" && <CashMovementsByRange />}
        {activeTab === "all" && <CashMovementsAll />}
        
        {showModal && (
          <RegisterMovementModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              // Aquí podrías refrescar la lista de movimientos
              setActiveTab("all");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CashMovementsPage;
