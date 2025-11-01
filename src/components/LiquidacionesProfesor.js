import React, { useEffect, useState } from "react";

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

const LiquidacionesProfesor = () => {
  const [profes, setProfes] = useState([]);
  const [idProfesor, setIdProfesor] = useState("");
  const [periodo, setPeriodo] = useState("2025-08");
  const [rowsPeriodo, setRowsPeriodo] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loadingPeriodo, setLoadingPeriodo] = useState(false);
  const [loadingHist, setLoadingHist] = useState(false);
  const [error, setError] = useState("");

  // cargar profes
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const loadProfes = async () => {
      try {
        const resp = await fetch(`${API_BASE}/usuarios/profes-admins/buscar`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) return;
        const data = await resp.json();
        setProfes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    loadProfes();
  }, []);

  const fetchPeriodo = async () => {
    const token = getToken();
    if (!token || !idProfesor) {
      setError("Seleccioná un profesor.");
      return;
    }
    setLoadingPeriodo(true);
    setError("");
    try {
      const resp = await fetch(
        `${API_BASE}/profesor?id_usuario=${idProfesor}&periodo=${periodo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "Error al obtener liquidaciones del profesor");
      }
      const data = await resp.json();
      setRowsPeriodo(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudieron obtener los datos.");
      setRowsPeriodo([]);
    } finally {
      setLoadingPeriodo(false);
    }
  };

  const fetchHistorial = async () => {
    const token = getToken();
    if (!token || !idProfesor) {
      setError("Seleccioná un profesor.");
      return;
    }
    setLoadingHist(true);
    setError("");
    try {
      const resp = await fetch(
        `${API_BASE}/profesor/historial?id_usuario=${idProfesor}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "Error al obtener historial");
      }
      const data = await resp.json();
      setHistorial(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo obtener el historial.");
      setHistorial([]);
    } finally {
      setLoadingHist(false);
    }
  };

  return (
    <>
      <div className="work-filters">
        <label>
          Profesor
          <select
            value={idProfesor}
            onChange={(e) => setIdProfesor(e.target.value)}
          >
            <option value="">Seleccioná</option>
            {profes.map((p) => (
              <option key={p.id_usuario} value={p.id_usuario}>
                {p.nombre || p.user_name || `Usuario ${p.id_usuario}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Período
          <input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
        </label>
        <button className="btn-primary-work" onClick={fetchPeriodo}>
          Ver período
        </button>
        <button className="btn-secondary-work" onClick={fetchHistorial}>
          Ver historial
        </button>
      </div>

      {error && <div className="work-error">{error}</div>}

      {/* liquidaciones del período */}
      <div className="table-wrapper-work" style={{ marginBottom: "1rem" }}>
        <h4>Liquidaciones del profesor en el período</h4>
        <table className="work-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Período</th>
              <th>Horas pagadas</th>
              <th>Monto ($)</th>
              <th>Fecha liq.</th>
            </tr>
          </thead>
          <tbody>
            {loadingPeriodo ? (
              <tr>
                <td colSpan="5">Cargando...</td>
              </tr>
            ) : rowsPeriodo.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No hay liquidaciones para ese período.
                </td>
              </tr>
            ) : (
              rowsPeriodo.map((r) => (
                <tr key={r.id_liquidacion}>
                  <td>{r.id_liquidacion}</td>
                  <td>{r.periodo}</td>
                  <td>{r.horas_pagadas}</td>
                  <td>$ {Number(r.monto_liquidado).toLocaleString("es-AR")}</td>
                  <td>{r.fecha_liquidacion?.slice(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* historial */}
      <div className="table-wrapper-work">
        <h4>Historial del profesor</h4>
        <table className="work-table">
          <thead>
            <tr>
              <th>Período</th>
              <th>Horas pagadas</th>
              <th>Total liquidado ($)</th>
            </tr>
          </thead>
          <tbody>
            {loadingHist ? (
              <tr>
                <td colSpan="3">Cargando...</td>
              </tr>
            ) : historial.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-state">
                  No hay historial.
                </td>
              </tr>
            ) : (
              historial.map((h) => (
                <tr key={h.periodo}>
                  <td>{h.periodo}</td>
                  <td>{h.horas_pagadas}</td>
                  <td>$ {Number(h.total_liquidado).toLocaleString("es-AR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LiquidacionesProfesor;
