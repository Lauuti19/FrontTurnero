// src/pages/CashMovementsPage.js
import React, { useState } from "react";
import "../styles/CashMovements.css";
import { FaCashRegister } from "react-icons/fa";
import CashMovementsToday from "../components/CashMovementsToday";
import CashMovementsByRange from "../components/CashMovementsByRange";
import CashMovementsAll from "../components/CashMovementsAll";
import RegisterMovementModal from "../components/RegisterMovementModal";
import ProductsManager from "../components/ProductsManager";

const CashMovementsPage = () => {
  const [activeTab, setActiveTab] = useState("today"); // today | range | all | products
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="cash-page-container">
      <div className="cash-page-header">
        <div className="cash-title">
          <FaCashRegister id="icon-cash" />
          <h1 className="cash-page-title">Movimientos de Caja</h1>
        </div>
        <div className="header-buttons">
          <button className="btn-add-movement" onClick={() => setShowModal(true)}>
            ＋
          </button>
          <button
            className={`btn-products ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Productos
          </button>
        </div>
      </div>

      {/* Tabs */}
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
          Por rango
        </button>
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          Mensuales
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Productos
        </button>
      </div>

      {/* Content */}
      {activeTab === "today" && <CashMovementsToday />}
      {activeTab === "range" && <CashMovementsByRange />}
      {activeTab === "all" && <CashMovementsAll />}
      {activeTab === "products" && <ProductsManager />}

      {showModal && (
        <RegisterMovementModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CashMovementsPage;