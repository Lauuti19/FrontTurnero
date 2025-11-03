// src/pages/UserCashMovementsPage.jsx
import React, { useState } from "react";
import "../styles/CashMovements.css";
import { FaCashRegister } from "react-icons/fa";
import UserMovements from "../components/UserMovements";
import UserDeudas from "../components/UserDeudas";

const UserCashMovementsPage = () => {
  const [activeTab, setActiveTab] = useState("movimientos");

  return (
    <div className="cash-page-container">
      <div className="cash-page-header">
        <div className="cash-title">
          <FaCashRegister id="icon-cash" />
          <h1 className="cash-page-title">Mis Movimientos</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-cash">
        <button
          className={activeTab === "movimientos" ? "active" : ""}
          onClick={() => setActiveTab("movimientos")}
        >
          Movimientos
        </button>
        <button
          className={activeTab === "deudas" ? "active" : ""}
          onClick={() => setActiveTab("deudas")}
        >
          Deudas
        </button>
      </div>

      {activeTab === "movimientos" && <UserMovements />}
      {activeTab === "deudas" && <UserDeudas />}
    </div>
  );
};

export default UserCashMovementsPage;
