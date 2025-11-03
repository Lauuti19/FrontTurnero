import React, { useEffect, useState } from "react";

const CASH_BASE =
  process.env.REACT_APP_CASH_URL || "https://backturnero-vvk6.onrender.com/api/cash";

const CashDistribucionByCaja = () => {
  const [cajas, setCajas] = useState([]);
  const [selectedCaja, setSelectedCaja] = useState("");
  const [loadingCajas, setLoadingCajas] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dist, setDist] = useState([]);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("token");

  // traer cajas
  useEffect(() => {
    const fetchCajas = async () => {
      setLoadingCajas(true);
      try {
        let res = await fetch(`${CASH_BASE}/cajas?solo_activas=1`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        let data = await res.json();

        if (!res.ok || (data?.cajas && data.cajas.length === 0)) {
          res = await fetch(`${CASH_BASE}/cajas/todas`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          data = await res.json();
        }

        if (!res.ok) throw new Error(data?.error || "No se pudieron obtener las cajas");

        const rows = Array.isArray(data) ? data : data.cajas || [];
        setCajas(rows);
        if (rows.length > 0) {
          const first = rows[0];
          setSelectedCaja(first.id_caja || first.id_caja_mensual || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCajas(false);
      }
    };

    fetchCajas();
  }, []);

  const handleFetch = async () => {
    if (!selectedCaja) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${CASH_BASE}/distribucion/by-caja?id_caja=${selectedCaja}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo obtener la distribución");
      setDist(data.distribucion || []);
    } catch (err) {
      setError(err.message);
      setDist([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="admins-subtitle" style={{ marginBottom: "1rem" }}>
        Distribución de ganancias por caja
      </h2>

      <div className="admin-form" style={{ marginBottom: "1rem" }}>
        <div className="form-group" style={{ maxWidth: 250 }}>
          <label>Caja mensual</label>
          <select
            value={selectedCaja}
            onChange={(e) => setSelectedCaja(e.target.value)}
            disabled={loadingCajas}
          >
            {loadingCajas && <option>Cargando cajas...</option>}
            {!loadingCajas && cajas.length === 0 && (
              <option value="">No hay cajas</option>
            )}
            {!loadingCajas &&
              cajas.map((caja) => {
                const id =
                  caja.id_caja || caja.id_caja_mensual || caja.id || caja.idCaja;
                const label =
                  caja.periodo || caja.mes || caja.descripcion || `Caja ${id}`;
                return (
                  <option key={id} value={id}>
                    {label} 
                  </option>
                );
              })}
          </select>
        </div>
        <div className="admin-form-actions">
          <button
            className="btn-admin-save"
            onClick={handleFetch}
            disabled={loading || !selectedCaja}
          >
            {loading ? "Buscando..." : "Ver distribución"}
          </button>
        </div>
      </div>

      {loading && <div className="admins-loading">Cargando...</div>}
      {error && <div className="admins-error">{error}</div>}

      {!loading && !error && dist.length > 0 && (
        <>
          <div className="admins-cards">
            {dist.map((d) => (
              <div key={d.id_distribucion} className="admins-card">
                <div className="admins-card-title">{d.dueño}</div>
                <div className="admins-card-value">
                  ${Number(d.monto_distribuido).toFixed(2)}
                </div>
                <div className="admins-card-sub">
                  {d.porcentaje_accion}% del total
                </div>
              </div>
            ))}
          </div>

          <div className="admins-table-wrap">
            <table className="admins-table">
              <thead>
                <tr>
                  <th>Dueño</th>
                  <th>Porcentaje</th>
                  <th>Monto distribuido</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {dist.map((d) => (
                  <tr key={d.id_distribucion}>
                    <td>{d.dueño}</td>
                    <td>{d.porcentaje_accion}%</td>
                    <td>${Number(d.monto_distribuido).toFixed(2)}</td>
                    <td>
                      {new Date(d.fecha_distribucion).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !error && dist.length === 0 && (
        <div className="admins-empty">
          No hay distribución para esa caja todavía.
        </div>
      )}
    </>
  );
};

export default CashDistribucionByCaja;
