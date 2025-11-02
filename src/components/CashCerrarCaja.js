// src/components/CashCerrarCaja.js
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CASH_MOV_BASE =
  process.env.REACT_APP_CASH_MOV_URL ||
  "https://backturnero-vvk6.onrender.com/api/cash-movements";

const CashCerrarCaja = () => {
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  });

  const [caja, setCaja] = useState(null);
  const [egresos, setEgresos] = useState([]);
  const [ingresosDetalle, setIngresosDetalle] = useState([]);
  const [loadingCaja, setLoadingCaja] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingIngresos, setLoadingIngresos] = useState(false);
  const [error, setError] = useState(null);

  // liquidaciones cerradas
  const [liquidaciones, setLiquidaciones] = useState(null);
  const [loadingLiquidaciones, setLoadingLiquidaciones] = useState(false);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [modalCaja, setModalCaja] = useState(null);
  const [modalAhorros, setModalAhorros] = useState("");
  const [modalObs, setModalObs] = useState("");

  const token = localStorage.getItem("token");

  // ---------- fetchers ----------
  const fetchCaja = async (per) => {
    setLoadingCaja(true);
    try {
      const res = await fetch(
        `${CASH_MOV_BASE}/caja/activa?periodo=${per}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo obtener la caja");

      const cajaNormalizada = Array.isArray(data.caja)
        ? data.caja[0] || null
        : data.caja || null;

      setCaja(cajaNormalizada);
    } catch (err) {
      console.error(err);
      setCaja(null);
    } finally {
      setLoadingCaja(false);
    }
  };

  const fetchEgresos = async (per) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${CASH_MOV_BASE}/egresos/by-period?periodo=${per}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "No se pudieron obtener los egresos");
      setEgresos(Array.isArray(data.egresos) ? data.egresos : []);
    } catch (err) {
      setError(err.message);
      setEgresos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngresosDetalle = async (per) => {
    setLoadingIngresos(true);
    try {
      const res = await fetch(
        `${CASH_MOV_BASE}/summary/by-period?periodo=${per}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error || "No se pudo obtener el detalle de ingresos"
        );
      setIngresosDetalle(Array.isArray(data.totals) ? data.totals : []);
    } catch (err) {
      console.error(err);
      setIngresosDetalle([]);
    } finally {
      setLoadingIngresos(false);
    }
  };

  // 🔹 liquidaciones cerradas (normaliza array u objeto)
  const fetchLiquidaciones = async (per) => {
    setLoadingLiquidaciones(true);
    try {
      const res = await fetch(
        `https://backturnero-vvk6.onrender.com/api/liquidaciones/cerradas?periodo=${per}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error || "No se pudieron obtener las liquidaciones"
        );

      // puede venir como:
      // [{...}]  ó  {...}  ó  { liquidaciones: [...] }
      let liq = null;

      if (Array.isArray(data)) {
        liq = data[0] || null;
      } else if (Array.isArray(data?.liquidaciones)) {
        liq = data.liquidaciones[0] || null;
      } else {
        liq = data;
      }

      setLiquidaciones(liq);
    } catch (err) {
      console.error(err);
      setLiquidaciones(null);
    } finally {
      setLoadingLiquidaciones(false);
    }
  };

  // cargar todo cuando cambia período
  useEffect(() => {
    fetchCaja(periodo);
    fetchEgresos(periodo);
    fetchIngresosDetalle(periodo);
    fetchLiquidaciones(periodo);
  }, [periodo]);

  // ---------- modal ----------
  const openCloseModal = async () => {
    try {
      const res = await fetch(
        `${CASH_MOV_BASE}/caja/activa?periodo=${periodo}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const cajaNormalizada = Array.isArray(data.caja)
        ? data.caja[0] || null
        : data.caja || null;

      setModalCaja(cajaNormalizada);
      setModalAhorros(
        cajaNormalizada?.ahorros != null ? Number(cajaNormalizada.ahorros) : ""
      );
      setModalObs(cajaNormalizada?.observaciones || "");
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setModalCaja(null);
      setModalAhorros("");
      setModalObs("");
      setShowModal(true);
    }
  };

  const confirmarCerrarCaja = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Cerrar caja?",
      text: `Se va a cerrar la caja del período ${periodo}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0f766e",
    });

    if (!isConfirmed) return;

    try {
      const body = {
        periodo,
        ahorros: modalAhorros ? Number(modalAhorros) : 0,
        observaciones: modalObs || null,
      };

      const res = await fetch(`${CASH_MOV_BASE}/caja/cerrar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "No se pudo cerrar la caja");

      await Swal.fire({
        title: "Caja cerrada",
        text: "Se cerró la caja correctamente.",
        icon: "success",
      });

      setShowModal(false);
      // recargar datos del período actual
      fetchCaja(periodo);
      fetchEgresos(periodo);
      fetchIngresosDetalle(periodo);
      fetchLiquidaciones(periodo);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo cerrar la caja.",
        icon: "error",
      });
    }
  };

  const totalEgresosTabla = egresos.reduce(
    (acc, eg) => acc + Number(eg.monto || 0),
    0
  );

  const formatFecha = (fecha) => {
    if (!fecha) return "Sin cierre";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admins-close-box">
      <h2>Cerrar caja mensual</h2>

      {/* filtro */}
      <div
        className="admin-form"
        style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
      >
        <input
          type="month"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="admin-month-input"
        />
        {/* sacamos el botón Recargar */}
        <button onClick={openCloseModal} className="btn-admin-save">
          Cerrar caja
        </button>
      </div>

      {/* cards */}
      <div
        className="admins-cards"
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        {/* CAJA DEL PERIODO */}
        <div className="admins-card" style={{ flex: "1 1 250px" }}>
          <div className="admins-card-title">CAJA DEL PERÍODO</div>
          <div className="admins-card-value">{periodo}</div>
          {loadingCaja ? (
            <div className="admins-card-sub">Cargando...</div>
          ) : caja ? (
            <>
              <div className="admins-card-sub">
                Ingresos: ${Number(caja.total_ingresos || 0).toFixed(2)} ·
                Egresos: ${Number(caja.total_egresos || 0).toFixed(2)}
              </div>
              <div className="admins-card-sub">
                Cierre: {formatFecha(caja.fecha_cierre)}
              </div>
              <div className="admins-card-sub">
                Estado: {caja.activa ? "Activa" : "Cerrada"}
              </div>
            </>
          ) : (
            <div className="admins-card-sub">
              (No hay caja creada todavía para este mes)
            </div>
          )}
        </div>

        {/* EGRESOS */}
        <div className="admins-card" style={{ flex: "1 1 250px" }}>
          <div className="admins-card-title">EGRESOS DEL PERÍODO</div>
          <div className="admins-card-value">
            ${totalEgresosTabla.toFixed(2)}
          </div>
          <div className="admins-card-sub">
            {egresos.length} movimiento{egresos.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* INGRESOS x MÉTODO */}
        <div className="admins-card" style={{ flex: "1 1 250px" }}>
          <div className="admins-card-title">INGRESOS POR MÉTODO</div>
          {loadingIngresos ? (
            <div className="admins-card-sub">Cargando...</div>
          ) : ingresosDetalle.length === 0 ? (
            <div className="admins-card-sub">Sin ingresos</div>
          ) : (
            <ul style={{ marginTop: "0.5rem" }}>
              {ingresosDetalle.map((row, idx) => (
                <li key={idx}>
                  {row.metodo_pago}: $
                  {Number(row.total_ingresos || 0).toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* LIQUIDACIONES */}
        <div className="admins-card" style={{ flex: "1 1 250px" }}>
          <div className="admins-card-title">LIQUIDACIONES</div>
          {loadingLiquidaciones ? (
            <div className="admins-card-sub">Cargando...</div>
          ) : !liquidaciones ? (
            <div className="admins-card-sub">Sin datos</div>
          ) : (
            <>
              <div className="admins-card-sub">
                Cantidad: {liquidaciones.cantidad_liquidaciones || 0}
              </div>
              <div className="admins-card-sub">
                Horas pagadas: {liquidaciones.total_horas_pagadas || 0}
              </div>
              <div className="admins-card-value">
                ${Number(liquidaciones.total_liquidado || 0).toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* listado de egresos */}
      <h3 style={{ marginTop: "2rem" }}>Egresos del mes</h3>

      {loading ? (
        <div className="admins-loading">Cargando...</div>
      ) : error ? (
        <div className="admins-error">{error}</div>
      ) : egresos.length === 0 ? (
        <div className="admins-empty">
          No hay egresos registrados en este período.
        </div>
      ) : (
        <div className="admins-table-wrap" style={{ marginTop: "1rem" }}>
          <table className="admins-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Método</th>
                <th>Monto</th>
                <th>Registró</th>
              </tr>
            </thead>
            <tbody>
              {egresos.map((eg) => (
                <tr key={eg.id_movimiento}>
                  <td>{new Date(eg.fecha).toLocaleDateString("es-AR")}</td>
                  <td>{eg.concepto}</td>
                  <td>{eg.metodo_pago}</td>
                  <td>${Number(eg.monto || 0).toFixed(2)}</td>
                  <td>{eg.usuario_nombre || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CIERRE DE CAJA */}
      {showModal && (
        <div className="admins-modal-backdrop">
          <div className="admins-modal" style={{ maxWidth: 580 }}>
            <h3>Cerrar caja {periodo}</h3>
            <p style={{ fontSize: "0.8rem", marginBottom: "1rem" }}>
              Revisá los datos antes de confirmar.
            </p>
            <div className="admin-form" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label>Ingresos</label>
                <input
                  type="text"
                  disabled
                  value={
                    modalCaja
                      ? Number(modalCaja.total_ingresos || 0).toFixed(2)
                      : "0.00"
                  }
                />
              </div>
              <div className="form-group">
                <label>Egresos</label>
                <input
                  type="text"
                  disabled
                  value={
                    modalCaja
                      ? Number(modalCaja.total_egresos || 0).toFixed(2)
                      : "0.00"
                  }
                />
              </div>
              <div className="form-group">
                <label>Ahorros (opcional)</label>
                <input
                  type="number"
                  min="0"
                  value={modalAhorros}
                  onChange={(e) => setModalAhorros(e.target.value)}
                  placeholder="15000"
                />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Observaciones</label>
                <textarea
                  rows={3}
                  value={modalObs}
                  onChange={(e) => setModalObs(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    padding: "0.5rem 0.6rem",
                  }}
                  placeholder="Cierre noviembre – se guardó 15k"
                />
              </div>
            </div>
            <div className="admin-form-actions" style={{ marginTop: "1rem" }}>
              <button
                className="btn-admin-save"
                onClick={confirmarCerrarCaja}
                disabled={modalCaja && modalCaja.fecha_cierre}
              >
                {modalCaja && modalCaja.fecha_cierre
                  ? "Ya está cerrada"
                  : "Confirmar cierre"}
              </button>
              <button
                className="btn-admin-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
            {modalCaja && modalCaja.fecha_cierre && (
              <p style={{ marginTop: "0.7rem", color: "#b45309" }}>
                Esta caja ya tiene fecha de cierre: {formatFecha(modalCaja.fecha_cierre)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CashCerrarCaja;
