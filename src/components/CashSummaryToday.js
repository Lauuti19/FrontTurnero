import React, { useEffect, useState } from "react";

const CashSummaryToday = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token de usuario.");
      setLoading(false);
      return;
    }

    fetch("https://backturnero.onrender.com/api/cash-movements/summary/today", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el resumen de hoy.");
        return res.json();
      })
      .then((data) => setSummary(data.summary))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando resumen de hoy...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <>
    <div className="cash-card card--ingresos" aria-live="polite">
      <div className="card-title">Ingresos de hoy</div>
      <div className="card-value">
        ${parseFloat(summary.total_ingresos).toLocaleString()}
      </div>
      <div className="card-sub">Entradas registradas en el día</div>
    </div>

    <div className="cash-card card--egresos" aria-live="polite">
      <div className="card-title">Egresos de hoy</div>
      <div className="card-value">
        ${parseFloat(summary.total_egresos).toLocaleString()}
      </div>
      <div className="card-sub">Salidas registradas en el día</div>
    </div>

    <div className="cash-card card--saldo" aria-live="polite">
      <div className="card-title">Saldo del día</div>
      <div className="card-value">
        ${parseFloat(summary.saldo_dia).toLocaleString()}
      </div>
      <div className="card-sub">Ingresos − Egresos (hoy)</div>
    </div>
  </>
);

};

export default CashSummaryToday;
