import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

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

const PreLiquidacionForm = ({ onClose }) => {
  const [profes, setProfes] = useState([]);
  const [idUsuario, setIdUsuario] = useState("");
  const [periodo, setPeriodo] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // datos que trae el back
  const [pre, setPre] = useState(null);
  const [horasPagadas, setHorasPagadas] = useState("");

  // cargar profes una vez
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    (async () => {
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
    })();
  }, []);

  // ⚡ traer pre-liquidación automáticamente cuando cambie profe o período
  useEffect(() => {
    const fetchPre = async () => {
      const token = getToken();
      if (!token) {
        setError("No hay token.");
        return;
      }
      if (!idUsuario) {
        // si borró el profe, limpio
        setPre(null);
        setHorasPagadas("");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const url = `${API_BASE}/workhours/pre-liquidacion?id_usuario=${idUsuario}&periodo=${periodo}`;
        const resp = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(txt || "No se pudo obtener la pre-liquidación");
        }
        const data = await resp.json();
        setPre(data);

        // proponer horas a pagar
        const h = data?.horas_trabajadas ? Number(data.horas_trabajadas) : 0;
        setHorasPagadas(h ? h : "");

      } catch (err) {
        console.error(err);
        setError(err.message || "No se pudo obtener la pre-liquidación.");
        setPre(null);
        setHorasPagadas("");
      } finally {
        setLoading(false);
      }
    };

    fetchPre();
  }, [idUsuario, periodo]);

  const handleLiquidar = async () => {
    const token = getToken();
    if (!token) {
      Swal.fire("Error", "No hay token.", "error");
      return;
    }
    if (!idUsuario || !periodo) {
      Swal.fire("Error", "Seleccioná profesor y período.", "error");
      return;
    }
    if (!horasPagadas) {
      Swal.fire("Error", "Indicá las horas a pagar.", "error");
      return;
    }
    // si ya está liquidado, avisamos y seguimos solo si quiere
    if (pre?.liquidado) {
      const res = await Swal.fire({
        title: "Ya está liquidado",
        text: "Este período ya figura como liquidado. ¿Querés liquidar igual?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, liquidar igual",
        cancelButtonText: "Cancelar",
      });
      if (!res.isConfirmed) return;
    }

    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE}/workhours/liquidar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: Number(idUsuario),
          periodo: periodo,
          horas_pagadas: Number(horasPagadas),
        }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "No se pudo liquidar");
      }

      Swal.fire("Listo", "Profesor liquidado correctamente.", "success");
      onClose && onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "No se pudo liquidar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          minWidth: "380px",
          maxWidth: "520px",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h3>Nueva liquidación</h3>
          <button onClick={onClose} className="btn-secondary-work">
            Cerrar
          </button>
        </div>

        {error && <div className="work-error">{error}</div>}

        {/* form selector */}
        <div className="work-form" style={{ marginBottom: "1rem" }}>
          <label>
            Profesor
            <select
              value={idUsuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              disabled={loading}
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
              disabled={loading}
            />
          </label>
        </div>

        {/* info traída */}
        {loading && <p>Cargando pre-liquidación...</p>}

        {pre && !loading && (
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <p>
              <strong>Profesor:</strong>{" "}
              {profes.find((p) => p.id_usuario === Number(idUsuario))?.nombre ||
                pre.id_usuario}
            </p>
            <p>
              <strong>Período:</strong> {pre.periodo}
            </p>
            <p>
              <strong>Horas pactadas:</strong>{" "}
              {pre.horas_pactadas !== null ? pre.horas_pactadas : "—"}
            </p>
            <p>
              <strong>Tarifa:</strong>{" "}
              {pre.tarifa !== null ? `$ ${Number(pre.tarifa).toLocaleString("es-AR")}` : "—"}
            </p>
            <p>
              <strong>Horas trabajadas:</strong> {pre.horas_trabajadas}
            </p>
            <p>
              <strong>Total estimado:</strong>{" "}
              {pre.total !== null ? `$ ${Number(pre.total).toLocaleString("es-AR")}` : "—"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {pre.liquidado ? "YA LIQUIDADO" : "Pendiente"}
            </p>
          </div>
        )}

        {/* completar horas y liquidar */}
        <div className="work-form">
          <label>
            Liquidar <em>horas pagadas</em>
            <input
              type="number"
              min="0"
              step="0.01"
              value={horasPagadas}
              onChange={(e) => setHorasPagadas(e.target.value)}
              disabled={loading || !idUsuario}
            />
          </label>
          <button
            type="button"
            className="btn-primary-work"
            onClick={handleLiquidar}
            disabled={loading || !idUsuario}
          >
            {loading ? "Liquidando..." : "Liquidar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreLiquidacionForm;
