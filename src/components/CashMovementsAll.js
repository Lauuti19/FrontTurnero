// src/components/CashMovementsAll.js
import React, { useEffect, useState } from "react";

const CashMovementsAll = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/cash-movements/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los movimientos.");
        return res.json();
      })
      .then((data) => setMovements(data.movements || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="cash-section">
      <h2>Todos los Movimientos</h2>

      {movements.length === 0 ? (
        <p>No hay movimientos registrados.</p>
      ) : (
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

export default CashMovementsAll;
