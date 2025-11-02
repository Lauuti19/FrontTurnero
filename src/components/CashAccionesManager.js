import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPen } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const CASH_BASE =
  process.env.REACT_APP_CASH_URL || "http://localhost:3001/api/cash";
const USERS_BASE =
  process.env.REACT_APP_USERS_URL || "http://localhost:3001/api/usuarios";

const CashAccionesManager = () => {
  const [acciones, setAcciones] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [createData, setCreateData] = useState({
    id_usuario: "",
    porcentaje_accion: "",
    fecha_inicio: new Date().toISOString().slice(0, 10),
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    porcentaje_accion: "",
    fecha_inicio: "",
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoadingAdmins(true);
      try {
        const res = await fetch(`${USERS_BASE}/admins/buscar`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken() ? `Bearer ${getToken()}` : undefined,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "No se pudieron cargar admins");
        const rows = Array.isArray(data)
          ? data
          : data.usuarios || data.admins || [];
        setAdmins(rows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAdmins(false);
      }
    };
    fetchAdmins();
  }, []);

  const normalizeAcciones = (data) => {
    if (data && Array.isArray(data.acciones)) return data.acciones;
    if (Array.isArray(data)) return Array.isArray(data[0]) ? data[0] : data;
    return [];
  };

  const fetchAcciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${CASH_BASE}/activas`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudieron obtener las acciones");
      const rows = normalizeAcciones(data);
      setAcciones(rows);
    } catch (err) {
      setError(err.message);
      setAcciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcciones();
  }, []);

  const openModal = () => {
    setCreateData({
      id_usuario: "",
      porcentaje_accion: "",
      fecha_inicio: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${CASH_BASE}/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          id_usuario: Number(createData.id_usuario),
          porcentaje: Number(createData.porcentaje_accion),
          fecha_inicio: createData.fecha_inicio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo crear la acción");
      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "Acción creada",
        text: "La nueva acción se agregó correctamente ✅",
        timer: 1800,
        showConfirmButton: false,
      });
      await fetchAcciones();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const startEdit = (accion) => {
    setEditingId(accion.id_usuario);
    setEditData({
      porcentaje_accion:
        accion.porcentaje_accion ??
        accion.porcentaje ??
        accion.total_porcentaje ??
        "",
      fecha_inicio: accion.fecha_inicio
        ? accion.fecha_inicio.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    });
  };

  const saveEdit = async (id_usuario) => {
    try {
      const res = await fetch(`${CASH_BASE}/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          id_usuario: Number(id_usuario),
          porcentaje: Number(editData.porcentaje_accion),
          fecha_inicio: editData.fecha_inicio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo actualizar la acción");

      Swal.fire({
        icon: "success",
        title: "Acción actualizada",
        text: "Los cambios se guardaron correctamente ✅",
        timer: 1800,
        showConfirmButton: false,
      });
      setEditingId(null);
      await fetchAcciones();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const cancelEdit = () => setEditingId(null);

  const deleteAccion = async (accion) => {
    const confirm = await Swal.fire({
      title: "¿Desactivar acción?",
      text: `¿Querés desactivar la acción de ${accion.nombre || "este usuario"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${CASH_BASE}/desactivar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          id_usuario: Number(accion.id_usuario),
          fecha_fin: new Date().toISOString().slice(0, 10),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo desactivar la acción");

      Swal.fire({
        icon: "success",
        title: "Acción desactivada",
        text: "La acción fue desactivada correctamente 🗑️",
        timer: 1800,
        showConfirmButton: false,
      });
      await fetchAcciones();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="acciones-manager">
      <div className="acciones-header-inline">
        <h2 className="admins-subtitle" style={{ marginBottom: 0 }}>
          Acciones activas
        </h2>
        <button className="btn-admin-primary" onClick={openModal}>
          <FaPlus style={{ marginRight: 6 }} /> Nueva acción
        </button>
      </div>

      {loading && <div className="admins-loading">Cargando acciones...</div>}
      {error && <div className="admins-error">{error}</div>}

      {!loading && !error && acciones.length === 0 && (
        <div className="admins-empty">No hay acciones activas.</div>
      )}

      {!loading && !error && acciones.length > 0 && (
        <div className="acciones-list">
          {acciones.map((acc) => (
            <div key={acc.id_accion || acc.id_usuario} className="accion-item-card">
              <div className="accion-left">
                <label>Administrador</label>
                <div className="accion-name">
                  {acc.nombre || `Usuario ${acc.id_usuario}`}{" "}
                  <span className="accion-id">#{acc.id_usuario}</span>
                </div>
              </div>

              <div className="accion-field">
                <label>Porcentaje</label>
                {editingId === acc.id_usuario ? (
                  <input
                    type="number"
                    value={editData.porcentaje_accion}
                    onChange={(e) =>
                      setEditData((p) => ({
                        ...p,
                        porcentaje_accion: e.target.value,
                      }))
                    }
                    min="0"
                    max="100"
                  />
                ) : (
                  <div className="accion-value">
                    {acc.porcentaje_accion ||
                      acc.porcentaje ||
                      acc.total_porcentaje}
                    %
                  </div>
                )}
              </div>

              <div className="accion-field">
                <label>Fecha inicio</label>
                {editingId === acc.id_usuario ? (
                  <input
                    type="date"
                    value={editData.fecha_inicio}
                    onChange={(e) =>
                      setEditData((p) => ({
                        ...p,
                        fecha_inicio: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <div className="accion-value">
                    {acc.fecha_inicio ? acc.fecha_inicio.slice(0, 10) : "-"}
                  </div>
                )}
              </div>

              <div className="accion-actions">
                {editingId === acc.id_usuario ? (
                  <>
                    <button
                      className="btn-admin-save"
                      onClick={() => saveEdit(acc.id_usuario)}
                    >
                      Guardar
                    </button>
                    <button className="btn-admin-cancel" onClick={cancelEdit}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-icon"
                      onClick={() => startEdit(acc)}
                      title="Editar"
                    >
                      <FaPen />
                    </button>
                    <button
                      className="btn-icon-danger"
                      onClick={() => deleteAccion(acc)}
                      title="Eliminar / desactivar"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="admins-modal-backdrop">
          <div className="admins-modal">
            <h3>Nueva acción</h3>
            <form onSubmit={handleCreate} className="admin-form" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label>Administrador</label>
                <select
                  value={createData.id_usuario}
                  onChange={(e) =>
                    setCreateData((p) => ({ ...p, id_usuario: e.target.value }))
                  }
                  required
                >
                  <option value="">-- seleccionar --</option>
                  {admins.map((ad) => (
                    <option key={ad.id_usuario} value={ad.id_usuario}>
                      {ad.nombre || ad.email || `Usuario ${ad.id_usuario}`} (id: {ad.id_usuario})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Porcentaje (%)</label>
                <input
                  type="number"
                  value={createData.porcentaje_accion}
                  onChange={(e) =>
                    setCreateData((p) => ({
                      ...p,
                      porcentaje_accion: e.target.value,
                    }))
                  }
                  required
                  min="0"
                  max="100"
                  placeholder="Ej: 55"
                />
              </div>
              <div className="form-group">
                <label>Fecha inicio</label>
                <input
                  type="date"
                  value={createData.fecha_inicio}
                  onChange={(e) =>
                    setCreateData((p) => ({
                      ...p,
                      fecha_inicio: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="btn-admin-save">
                  Crear
                </button>
                <button
                  type="button"
                  className="btn-admin-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashAccionesManager;
