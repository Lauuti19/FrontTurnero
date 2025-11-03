import React, { useState } from "react";
import LiquidacionesPeriodo from "./LiquidacionesPeriodo";
import LiquidacionesRango from "./LiquidacionesRango";
import LiquidacionesProfesor from "./LiquidacionesProfesor";
import PreLiquidacionForm from "./PreLiquidacionForm";
import { FaPlus } from "react-icons/fa";

const WorkHoursLiquidaciones = () => {
  // arranca en período
  const [activeTab, setActiveTab] = useState("periodo");
  const [showPre, setShowPre] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "periodo":
        return <LiquidacionesPeriodo />;
      case "rango":
        return <LiquidacionesRango />;
      case "profesor":
        return <LiquidacionesProfesor />;
      default:
        return (
          <div className="empty-state" style={{ padding: "2rem", textAlign: "center" }}>
            <p>Seleccioná una opción para ver las liquidaciones.</p>
          </div>
        );
    }
  };

  return (
    <div className="work-section wh-liquidaciones">
      {/* header con + */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>Liquidaciones</h2>
        <button
          className="btn-secondary-work"
          onClick={() => setShowPre(true)}
          title="Nueva Liquidación"
        >
          <FaPlus /> Liquidar
        </button>
      </div>

      {/* sub tabs */}
      <div className="tabs-work" style={{ marginBottom: "1rem" }}>
        <button
          className={activeTab === "periodo" ? "active" : ""}
          onClick={() => setActiveTab("periodo")}
        >
          Por período
        </button>
        <button
          className={activeTab === "rango" ? "active" : ""}
          onClick={() => setActiveTab("rango")}
        >
          Por rango
        </button>
        <button
          className={activeTab === "profesor" ? "active" : ""}
          onClick={() => setActiveTab("profesor")}
        >
          Por profesor
        </button>
      </div>

      {renderContent()}

      {showPre && <PreLiquidacionForm onClose={() => setShowPre(false)} />}
    </div>
  );
};

export default WorkHoursLiquidaciones;
