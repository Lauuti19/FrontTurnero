// src/pages/WorkHoursPage.js
import React, { useState, useEffect } from "react";
import "../styles/WorkHours.css";
import { FaClock, FaUserCheck, FaMoneyCheckAlt } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import WorkHoursPactadas from "../components/WorkHoursPactadas";
import WorkHoursAsistencias from "../components/WorkHoursAsistencias";
import WorkHoursTrabajadas from "../components/WorkHoursTrabajadas";
import WorkHoursLiquidaciones from "../components/WorkHoursLiquidaciones";

const WorkHoursPage = () => {
  const [activeTab, setActiveTab] = useState("pactadas");
  const { token } = useAuth() || {};

  useEffect(() => {

  }, []);

  return (
    <div className="work-page-container">
      <div className="work-page-header">
        <div className="work-title">
          <FaClock className="work-icon" />
          <h1 className="work-page-title">Horas y liquidaciones</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-work">
        <button
          className={activeTab === "pactadas" ? "active" : ""}
          onClick={() => setActiveTab("pactadas")}
        >
          Horas pactadas
        </button>
        <button
          className={activeTab === "asistencias" ? "active" : ""}
          onClick={() => setActiveTab("asistencias")}
        >
          Asistencias / Check
        </button>
        <button
          className={activeTab === "trabajadas" ? "active" : ""}
          onClick={() => setActiveTab("trabajadas")}
        >
          Horas trabajadas
        </button>
        <button
          className={activeTab === "liquidaciones" ? "active" : ""}
          onClick={() => setActiveTab("liquidaciones")}
        >
          Liquidaciones
        </button>
      </div>

      {/* Contenido por tab */}
      {activeTab === "pactadas" && <WorkHoursPactadas token={token} />}
      {activeTab === "asistencias" && <WorkHoursAsistencias token={token} />}
      {activeTab === "trabajadas" && <WorkHoursTrabajadas token={token} />}
      {activeTab === "liquidaciones" && <WorkHoursLiquidaciones token={token} />}
    </div>
  );
};

export default WorkHoursPage;
