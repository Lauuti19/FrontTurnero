// src/components/CashMovementsByRange.js
import React, { useState } from "react";

const CashMovementsByRange = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // En CashMovementsToday.js, CashMovementsByRange.js y CashMovementsAll.js
// Reemplazar los estados de carga y vacío:

    if (loading) return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Cargando movimientos...</p>
      </div>
    );

    if (error) return (
      <div className="error-state">
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    );
  const fetchByRange = () => {
    const token = localStorage.getItem("token");

    if (!startDate || !endDate) {
      setError("Debe seleccionar ambas fechas.");
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `https://backturnero.onrender.com/api/cash-movements/by-date-range?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener movimientos por rango.");
        return res.json();
      })
      .then((data) => setMovements(data.movements || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="cash-section">
      <h2>Movimientos por Rango</h2>

      {/* Filtros */}
      <div className="date-filters">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchByRange}>Buscar</button>
      </div>

      {loading && <p>Cargando movimientos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {movements.length > 0 && (
        <div className="table-wrapper">
          <table className="cash-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Productos</th>
                <th>Pago? </th>                
                <th>Método de Pago</th>
                <th>Usuario</th>
                <th>Total Movimiento</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mov, i) => (
                <tr key={i}>
                  <td>{new Date(mov.date).toLocaleString("es-AR")}</td>
                  <td>
                    <span
                      className={`cash-type-badge ${
                        mov.type === "ingreso" ? "ingreso" : "egreso"
                      }`}
                    >
                      {mov.type}
                    </span>
                  </td>
                  <td>{mov.concept}</td>
                  <td style={{ whiteSpace: "pre-line" }}>
                    {mov.productos
                        ? mov.productos.split("\n").map((prod, idx) => (
                            <div key={idx}>{prod}</div>
                        ))
                        : ""}
                    </td>
                  <td>
                {mov.paid === 1 ? (
                  <span style={{ color: "green" }}>✅</span>
                ) : (
                  <span style={{ color: "red" }}>❌</span>
                )}
                  </td>

                  <td>{mov.payment_method}</td>
                  <td>{mov.user_name}</td>
                  <td>${parseFloat(mov.total_amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CashMovementsByRange;
