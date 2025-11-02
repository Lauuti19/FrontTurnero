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

const WorkHoursAsistencias = () => {
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [profes, setProfes] = useState([]);
  const [idProfesor, setIdProfesor] = useState("");
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar lista de profesores
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

  // Cargar asistencias por periodo
  const loadAsistencias = async () => {
    const token = getStoredToken();
    if (!token) {
      setError("No hay token en el localStorage.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const url = `${API_BASE}/workhours/asistencias?periodo=${periodo}`;
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "Error al obtener asistencias");
      }
      const data = await resp.json();
      let lista = Array.isArray(data?.asistencias) ? data.asistencias : [];

      if (idProfesor) {
        lista = lista.filter((a) => a.id_usuario === Number(idProfesor));
      }

      setAsistencias(lista);
    } catch (err) {
      console.error("Error cargando asistencias:", err);
      setError(err.message || "No se pudieron cargar las asistencias.");
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAsistencias();
  }, [periodo, idProfesor]);

  return (
    <div className="work-section wh-asistencias">
      <h2>Asistencias Profes</h2>

      <div className="work-filters">
        <label>
          Período
          <input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
        </label>

        <label>
          Profesor
          <select
            value={idProfesor}
            onChange={(e) => setIdProfesor(e.target.value)}
          >
            <option value="">Todos</option>
            {profes.map((p) => (
              <option key={p.id_usuario} value={p.id_usuario}>
                {p.nombre || p.user_name || `Usuario ${p.id_usuario}`}
              </option>
            ))}
          </select>
        </label>

        <button className="btn-primary-work" onClick={loadAsistencias}>
          Buscar
        </button>
      </div>

      {error && <div className="work-error">{error}</div>}

      <div className="table-wrapper-work">
        <table className="work-table">
          <thead>
            <tr>
              <th>Profesor</th>
              <th>Fecha</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Horas total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Cargando...</td>
              </tr>
            ) : asistencias.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No hay asistencias registradas para este período.
                </td>
              </tr>
            ) : (
              asistencias.map((a) => (
                <tr key={a.id_asistencia}>
                  <td>{a.nombre || `Usuario ${a.id_usuario}`}</td>
                  <td>{a.fecha}</td>
                  <td>{a.check_in}</td>
                  <td>{a.check_out}</td>
                  <td>{a.horas_total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkHoursAsistencias;
