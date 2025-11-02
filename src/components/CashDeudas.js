import React, { useEffect, useState } from "react";

const CashDeudas = () => {
  const [deudas, setDeudas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/deudas/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener las deudas.");
        return res.json();
      })
      .then((data) => setDeudas(data.deudas || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Cargando deudas...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );

  if (deudas.length === 0)
    return (
      <div className="empty-state">
        <p>No hay deudas registradas.</p>
      </div>
    );

  return (
    <div className="cash-section">
      <h2>Deudas registradas</h2>

      <div className="table-wrapper">
        <table className="cash-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Cant. Deudas</th>
              <th>Total ($)</th>
              <th>Vencido ($)</th>
              <th>Último Vencimiento</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {deudas.map((d, index) => (
              <tr key={index}>
                <td>{d.nombre}</td>
                <td>{d.email}</td>
                <td>{d.cantidad_deudas}</td>
                <td>{Number(d.total_deuda).toLocaleString("es-AR")}</td>
                <td
                  style={{
                    color:
                      parseFloat(d.deuda_vencida) > 0 ? "#e74c3c" : "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  {Number(d.deuda_vencida).toLocaleString("es-AR")}
                </td>
                <td>{d.ultimo_vencimiento || "-"}</td>
                <td>{d.detalle_deudas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashDeudas;
