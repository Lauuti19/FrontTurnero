import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import WorkHoursPactadasForm from "./WorkHoursPactadasForm";

const API_BASE = "https://backturnero-vvk6.onrender.com/api";

// helper del token
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

const WorkHoursPactadas = () => {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadHoras = async () => {
    const token = getStoredToken();
    if (!token) {
      setError("No hay token en el localStorage.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const resp = await fetch(`${API_BASE}/workhours/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "Error al obtener horas pactadas");
      }
      const data = await resp.json();
      setHoras(Array.isArray(data?.horas) ? data.horas : []);
    } catch (err) {
      console.error("Error cargando horas pactadas:", err);
      setError(err.message || "No se pudieron cargar las horas pactadas.");
      setHoras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoras();
  }, []);

  const handleCreated = () => {
    setShowForm(false);
    loadHoras();
  };

  // EDITAR
  const handleEdit = async (row) => {
    const { id_pactado, work_hours, rate } = row;
    const { value: formValues } = await Swal.fire({
      title: `Editar horas de ${row.user_name || "usuario"}`,
      html: `
        <label style="display:block;text-align:left;margin-bottom:4px;">Horas pactadas</label>
        <input id="swal-hours" type="number" min="0" value="${work_hours}" class="swal2-input" style="width:100%;margin:0 0 10px 0;" />
        <label style="display:block;text-align:left;margin-bottom:4px;">Valor hora</label>
        <input id="swal-rate" type="number" min="0" step="0.01" value="${rate}" class="swal2-input" style="width:100%;margin:0;" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const hoursEl = document.getElementById("swal-hours");
        const rateEl = document.getElementById("swal-rate");
        const h = hoursEl?.value;
        const r = rateEl?.value;
        if (!h || !r) {
          Swal.showValidationMessage("Completá horas y valor hora");
          return false;
        }
        return { h, r };
      },
    });

    if (!formValues) return; // canceló

    const token = getStoredToken();
    if (!token) {
      Swal.fire("Error", "No hay token en localStorage", "error");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/workhours/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_pactado,
          work_hours: Number(formValues.h),
          rate: Number(formValues.r),
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "No se pudo actualizar");
      }

      Swal.fire("Actualizado", "Las horas pactadas fueron actualizadas.", "success");
      loadHoras();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "No se pudo actualizar", "error");
    }
  };

  // ELIMINAR (soft)
  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: "¿Borrar horas pactadas?",
      text: `Se dará de baja el registro de ${row.user_name || "usuario"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const token = getStoredToken();
    if (!token) {
      Swal.fire("Error", "No hay token en localStorage", "error");
      return;
    }

    try {
      const resp = await fetch(
        `${API_BASE}/workhours/delete/${row.id_pactado}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || "No se pudo borrar");
      }

      Swal.fire("Borrado", "El registro fue dado de baja.", "success");
      loadHoras();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "No se pudo borrar", "error");
    }
  };

  return (
    <div className="work-section wh-pactadas">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>Horas pactadas</h2>
        <button
          className="btn-secondary-work"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Nueva
        </button>
      </div>

      {error && <div className="work-error">{error}</div>}

      <div className="table-wrapper-work">
        <table className="work-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Horas pactadas</th>
              <th>Valor hora</th>
              <th style={{ width: 130 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Cargando...</td>
              </tr>
            ) : horas.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No hay horas pactadas.
                </td>
              </tr>
            ) : (
              horas.map((h) => (
                <tr key={h.id_pactado}>
                  <td>{h.user_name || `Usuario ${h.id_usuario}`}</td>
                  <td>{h.work_hours}</td>
                  <td>$ {Number(h.rate).toLocaleString("es-AR")}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(h)}
                      style={{ marginRight: ".35rem" }}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(h)}
                      title="Borrar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <WorkHoursPactadasForm
          onClose={() => setShowForm(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default WorkHoursPactadas;
