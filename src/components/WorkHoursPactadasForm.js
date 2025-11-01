import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:3001/api";

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

const WorkHoursPactadasForm = ({ onClose, onCreated }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    const loadUsers = async () => {
      try {
        const resp = await fetch(
          `${API_BASE}/usuarios/profes-admins/buscar`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resp.ok) return;
        const data = await resp.json();
        setUsuarios(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getStoredToken();
    if (!token) {
      setError("No hay token.");
      return;
    }

    if (!userId || !hours || !rate) {
      setError("Completá todos los campos.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const resp = await fetch(`${API_BASE}/workhours/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: Number(userId),
          work_hours: Number(hours),
          rate: rate,
        }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "No se pudo crear el registro");
      }
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo crear el registro");
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
          minWidth: "360px",
          maxWidth: "480px",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Nueva hora pactada</h3>

        {error && <div className="work-error">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="work-form"
          style={{ marginBottom: 0 }}
        >
          <label style={{ width: "100%" }}>
            Usuario
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccioná</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.nombre || u.user_name || u.full_name || `Usuario ${u.id_usuario}`}
                </option>
              ))}
            </select>
          </label>

          <label>
            Horas
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              min="0"
              disabled={loading}
            />
          </label>

          <label>
            Valor hora
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              min="0"
              step="0.01"
              disabled={loading}
            />
          </label>

          <div style={{ display: "flex", gap: ".75rem" }}>
            <button
              type="submit"
              className="btn-primary-work"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              className="btn-secondary-work"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkHoursPactadasForm;
