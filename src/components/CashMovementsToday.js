import React, { useEffect, useState } from "react";
import CashSummaryToday from "./CashSummaryToday";
import CashEfectivo from "./CashEfectivo";

const CashMovementsToday = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No se encontró el token de usuario.");
      setLoading(false);
      return;
    }

    // Decodificar el role desde el token (campo: id_rol)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.id_rol); // 1 = admin, 2 = profe (ejemplo)
    } catch (err) {
      console.error("Error al decodificar el token", err);
    }

    fetch("https://backturnero.onrender.com/api/cash-movements/today", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los movimientos de hoy.");
        return res.json();
      })
      .then((data) => setMovements(data.movements || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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


  return (
    
    <div className="cash-section">
      <h2>Movimientos de Hoy</h2>

      {movements.length === 0 ? (
        <p>No hay movimientos registrados hoy.</p>
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
                  <td>{mov.paid === 1 ? "✅" : "❌"}</td>
                  <td>{mov.payment_method}</td>
                  <td>{mov.user_name}</td>
                  <td>${parseFloat(mov.total_amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {/* Tarjetas resumen (grilla) */}
<div className="cash-cards">
  {role === 1 && <CashSummaryToday />}  
  <CashEfectivo />                      
</div>
    </div>
  );
};

export default CashMovementsToday;
