import React, { useState } from "react";
import { useUserMovements } from "../hooks/useUserMovements";

const formatFecha = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const UserMovements = () => {
  const [meses, setMeses] = useState(6);
  const { movs, loading, error } = useUserMovements(meses);

  if (loading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Cargando movimientos…</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );

  return (
    <>
      <div className="date-filters">
        <label>Últimos meses:</label>
        <select
          value={meses}
          onChange={(e) => setMeses(Number(e.target.value))}
          className="select-months"
        >
          <option value={3}>3 meses</option>
          <option value={6}>6 meses</option>
          <option value={12}>12 meses</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="cash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Tipo</th>
              <th>Método</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {movs.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    No hay movimientos registrados.
                  </div>
                </td>
              </tr>
            ) : (
              movs.map((m) => (
                <tr key={m.id_movimiento}>
                  <td>{m.id_movimiento}</td>
                  <td>{formatFecha(m.fecha)}</td>
                  <td>{m.concepto || "-"}</td>
                  <td>{m.tipo_pago || "-"}</td>
                  <td>{m.metodo_pago || "-"}</td>
                  <td>${Number(m.monto || 0).toLocaleString("es-AR")}</td>
                  <td>
                    <span
                      className={`cash-type-badge ${
                        m.pagado === 1 ? "ingreso" : "egreso"
                      }`}
                    >
                      {m.pagado === 1 ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserMovements;
