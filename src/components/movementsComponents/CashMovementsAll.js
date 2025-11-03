// src/components/CashMovementsAll.js
import React, { useEffect, useState } from "react";

const CashMovementsAll = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Función auxiliar para obtener las fechas del mes actual
  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDate = (date) => date.toISOString().split("T")[0];
    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const { startDate, endDate } = getCurrentMonthRange();

    const url = `https://backturnero-vvk6.onrender.com/api/cash-movements/by-date-range?start_date=${startDate}&end_date=${endDate}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los movimientos mensuales.");
        return res.json();
      })
      .then((data) => setMovements(data.movements || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Cargando movimientos...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    );

  return (
    <div className="cash-section">
      <h2>Movimientos del Mes</h2>

      {movements.length === 0 ? (
        <p>No hay movimientos registrados para este mes.</p>
      ) : (
        <div className="table-wrapper">
          <table className="cash-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Productos</th>
                <th>Pago?</th>
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

export default CashMovementsAll;
