import React, { useEffect, useState } from "react";

const API_BASE = "https://backturnero-vvk6.onrender.com/api";

const getStoredToken = () => {
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

const WorkHoursTrabajadas = () => {
  const [profes, setProfes] = useState([]);
  const [idUsuario, setIdUsuario] = useState("");
  const [modo, setModo] = useState("periodo"); // "periodo" | "rango"
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [desde, setDesde] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [hasta, setHasta] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-28`;
  });
  const [horas, setHoras] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // cargar profes
  useEffect(() => {
    const token = getStoredToken();
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
        console.error("Error cargando profes:", err);
      }
    };
    loadProfes();
  }, []);

  const fetchHoras = async () => {
    const token = getStoredToken();
    if (!token) {
      setError("No hay token en localStorage.");
      return;
    }
    if (!idUsuario) {
      setError("Seleccioná un profesor.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      let url = "";

      if (modo === "periodo") {
        url = `${API_BASE}/workhours/worked-hours?id_usuario=${idUsuario}&periodo=${periodo}`;
      } else {
        url = `${API_BASE}/workhours/worked-hours-range?id_usuario=${idUsuario}&desde=${desde}&hasta=${hasta}`;
      }

      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "Error al obtener horas trabajadas");
      }

      const data = await resp.json();
      setHoras(data?.horas_trabajadas ?? "0.00");
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudieron obtener las horas.");
      setHoras("0.00");
    } finally {
      setLoading(false);
    }
  };

  // opcional: que busque solo al cambiar filtros
  useEffect(() => {
    // solo si tenemos usuario seleccionado
    if (idUsuario) {
      fetchHoras();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUsuario, periodo, modo, desde, hasta]);

  return (
    <div className="work-section wh-trabajadas">
      <h2>Horas trabajadas</h2>

      <div className="work-filters">
        <label>
          Profesor
          <select
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value)}
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
          Modo
          <select value={modo} onChange={(e) => setModo(e.target.value)}>
            <option value="periodo">Por período (YYYY-MM)</option>
            <option value="rango">Por rango de fechas</option>
          </select>
        </label>

        {modo === "periodo" ? (
          <label>
            Período
            <input
              type="month"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            />
          </label>
        ) : (
          <>
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
          </>
        )}

        <button className="btn-primary-work" onClick={fetchHoras}>
          Consultar
        </button>
      </div>

      {error && <div className="work-error">{error}</div>}

      {/* resultado */}
      <div className="work-card">
        <h4>Resultado</h4>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <p style={{ fontSize: "1.4rem", fontWeight: "700" }}>
            {Number(horas).toFixed(2)} hs
          </p>
        )}
        {modo === "periodo" ? (
          <p style={{ color: "#6b7280" }}>
            Período: <strong>{periodo}</strong>
          </p>
        ) : (
          <p style={{ color: "#6b7280" }}>
            Desde <strong>{desde}</strong> hasta <strong>{hasta}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkHoursTrabajadas;
