import React, { useState } from "react";

const API_BASE = "http://localhost:3001/api";

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

const LiquidacionesRango = () => {
  const [desde, setDesde] = useState("2025-08-01");
  const [hasta, setHasta] = useState("2025-10-31");
  const [rows, setRows] = useState([]);
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
      const resp = await fetch(
        `${API_BASE}/workhours/liquidaciones?desde=${desde}&hasta=${hasta}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "Error al obtener liquidaciones por rango");
      }
      const data = await resp.json();
      setRows(Array.isArray(data?.liquidaciones) ? data.liquidaciones : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo obtener la información.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="work-filters">
        <label>
          Desde
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </label>
        <label>
          Hasta
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </label>
        <button className="btn-primary-work" onClick={fetchData}>
          Buscar
        </button>
      </div>

      {error && <div className="work-error">{error}</div>}

      <div className="table-wrapper-work">
        <h4>Liquidaciones en el rango</h4>
        <table className="work-table">
          <thead>
            <tr>
              <th>Profesor</th>
              <th>Período</th>
              <th>Horas pactadas</th>
              <th>Horas trabajadas</th>
              <th>Horas pagadas</th>
              <th>Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Cargando...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No hay liquidaciones en ese rango.
                </td>
              </tr>
            ) : (
              rows.map((l) => (
                <tr key={l.id_liquidacion}>
                  <td>{l.profesor || `Usuario ${l.id_usuario}`}</td>
                  <td>{l.periodo}</td>
                  <td>{l.horas_pactadas}</td>
                  <td>{l.horas_trabajadas}</td>
                  <td>{l.horas_pagadas}</td>
                  <td>$ {Number(l.total).toLocaleString("es-AR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LiquidacionesRango;
