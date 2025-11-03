import React, { useState } from "react";

const API_BASE = "https://backturnero-vvk6.onrender.com/api";

const getToken = () => {
  try {
    const raw = localStorage.getItem("token");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    return parsed.token || parsed.accessToken || parsed.jwt || null;
  } catch {
    return localStorage.getItem("token");
  }
};

const LiquidacionesPeriodo = () => {
  const [periodo, setPeriodo] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [resumen, setResumen] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      setError("No hay token en localStorage.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // resumen
      const r1 = await fetch(
        `${API_BASE}/cerradas?periodo=${periodo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!r1.ok) {
        const txt = await r1.text();
        throw new Error(txt || "Error al obtener resumen");
      }
      const data1 = await r1.json();

      // detalle
      const r2 = await fetch(
        `${API_BASE}/detalle?periodo=${periodo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!r2.ok) {
        const txt = await r2.text();
        throw new Error(txt || "Error al obtener detalle");
      }
      const data2 = await r2.json();

      setResumen(Array.isArray(data1) ? data1 : []);
      setDetalle(Array.isArray(data2) ? data2 : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo obtener la información.");
      setResumen([]);
      setDetalle([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="work-filters">
        <label>
          Período
          <input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
        </label>
        <button className="btn-primary-work" onClick={fetchData}>
          Ver período
        </button>
      </div>

      {error && <div className="work-error">{error}</div>}

      {/* RESUMEN */}
      <div className="table-wrapper-work" style={{ marginBottom: "1rem" }}>
        <h4>Resumen del período</h4>
        <table className="work-table">
          <thead>
            <tr>
              <th>Período</th>
              <th>Cant. liquidaciones</th>
              <th>Total horas pagadas</th>
              <th>Total liquidado ($)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Cargando...</td>
              </tr>
            ) : resumen.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No hay datos para este período.
                </td>
              </tr>
            ) : (
              resumen.map((r) => (
                <tr key={r.periodo}>
                  <td>{r.periodo}</td>
                  <td>{r.cantidad_liquidaciones}</td>
                  <td>{r.total_horas_pagadas}</td>
                  <td>$ {Number(r.total_liquidado).toLocaleString("es-AR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETALLE */}
      <div className="table-wrapper-work">
        <h4>Detalle de liquidaciones</h4>
        <table className="work-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profesor</th>
              <th>Período</th>
              <th>Horas pagadas</th>
              <th>Monto ($)</th>
              <th>Fecha liquidación</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Cargando...</td>
              </tr>
            ) : detalle.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No hay detalle para este período.
                </td>
              </tr>
            ) : (
              detalle.map((d) => (
                <tr key={d.id_liquidacion}>
                  <td>{d.id_liquidacion}</td>
                  <td>{d.profesor}</td>
                  <td>{d.periodo}</td>
                  <td>{d.horas_pagadas}</td>
                  <td>$ {Number(d.monto_liquidado).toLocaleString("es-AR")}</td>
                  <td>{d.fecha_liquidacion?.slice(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LiquidacionesPeriodo;
