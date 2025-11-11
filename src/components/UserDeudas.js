// src/components/UserDeudas.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getFullUserData } from "../services/userService";
import { getUserDeudas } from "../services/deudasService";

const formatFecha = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const UserDeudas = () => {
  const { getToken, getUserId } = useAuth();
  const [deudas, setDeudas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeudas = async () => {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        setError("Faltan credenciales del usuario.");
        setLoading(false);
        return;
      }

      try {
        // opcional: trae info completa del usuario
        await getFullUserData(token, userId);

        // ahora usamos el service en vez de hacer fetch directo
        const data = await getUserDeudas(token, userId);
        setDeudas(data.deudas || data || []);
      } catch (err) {
        setError(err.message || "Error al obtener las deudas.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeudas();
  }, [getToken, getUserId]);

  if (loading)
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Cargando deudas…</p>
      </div>
    );

  if (error)
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );

  const totalPendiente = deudas
    .filter((d) => d.pagado === 0)
    .reduce((acc, d) => acc + Number(d.monto || 0), 0);

  return (
    <>
      <div className="cash-cards">
        <div className="cash-card card--egresos">
          <p className="card-title">Total pendiente</p>
          <p className="card-value">
            $
            {totalPendiente.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="cash-card card--saldo">
          <p className="card-title">Deudas registradas</p>
          <p className="card-value">{deudas.length}</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="cash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Plan</th>
              <th>Método</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {deudas.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    No tenés deudas pendientes 🎉
                  </div>
                </td>
              </tr>
            ) : (
              deudas.map((d) => (
                <tr key={d.id_movimiento}>
                  <td>{d.id_movimiento}</td>
                  <td>{formatFecha(d.fecha)}</td>
                  <td>{d.concepto || "-"}</td>
                  <td>{d.plan_nombre || "-"}</td>
                  <td>{d.metodo_pago || "-"}</td>
                  <td>${Number(d.monto || 0).toLocaleString("es-AR")}</td>
                  <td>
                    <span
                      className={`cash-type-badge ${
                        d.pagado === 0 ? "egreso" : "ingreso"
                      }`}
                    >
                      {d.pagado === 0 ? "Pendiente" : "Pagado"}
                    </span>
                  </td>
                  <td>{d.productos_detalle || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserDeudas;
