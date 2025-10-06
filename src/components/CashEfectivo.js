import React, { useEffect, useState } from "react";

const CashEfectivo = () => {
  const [efectivo, setEfectivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token de usuario.");
      setLoading(false);
      return;
    }

    fetch("https://backturnero.onrender.com/api/cash-movements/summary/efectivo", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el efectivo disponible.");
        return res.json();
      })
      .then((data) => setEfectivo(data.efectivo))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando efectivo disponible...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
    <div className="cash-card card--efectivo" aria-live="polite">
        <div className="card-title">Efectivo disponible</div>
        <div className="card-value">
        ${parseFloat(efectivo).toLocaleString()}
        </div>
        <div className="card-sub">Monto físico esperado en caja</div>
    </div>
    );

};

export default CashEfectivo;
