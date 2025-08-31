// src/pages/CashMovementsPage.js
import React, { useState } from "react";
import "../styles/CashMovements.css";
import CashMovementsToday from "../components/CashMovementsToday";
import CashMovementsByRange from "../components/CashMovementsByRange";
import CashMovementsAll from "../components/CashMovementsAll";

const CashMovementsPage = () => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="cash-page-container">
      <div className="cash-page-box">
        <h1 className="cash-page-title">Movimientos de Caja</h1>

        {/* Solapas */}
        <div className="tabs">
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
      </div>
    </div>
  );
};

export default CashMovementsPage;
