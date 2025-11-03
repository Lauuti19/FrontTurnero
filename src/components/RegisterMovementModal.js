import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import "./registermovement.css";

const API_BASE = "https://backturnero-vvk6.onrender.com"; // cambialo si hace falta

const RegisterMovementModal = ({ onClose, onSuccess }) => {
  const { getUserId } = useAuth();

  const [products, setProducts] = useState([]);
  const [type, setType] = useState("Ingreso"); // Ingreso | Egreso
  const [egresoMode, setEgresoMode] = useState("general"); // general | productos
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [concept, setConcept] = useState("");
  const [details, setDetails] = useState([{ id_producto: "", cantidad: 1 }]);
  const [paid, setPaid] = useState(true);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 👉 NUEVO (solo aplica a ingresos)
  const [useOtherUser, setUseOtherUser] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearchingUser, setIsSearchingUser] = useState(false);

  // cargar productos
  useEffect(() => {
    if (type === "Ingreso" || (type === "Egreso" && egresoMode === "productos")) {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      fetch(`${API_BASE}/api/products/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setProducts(data.productos || []))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [type, egresoMode]);

  // buscar usuarios (solo si está activo y es INGRESO)
  useEffect(() => {
    if (type !== "Ingreso") return;
    if (!useOtherUser) return;

    const token = localStorage.getItem("token");
    if (!userQuery || userQuery.trim().length < 2) {
      setUserResults([]);
      return;
    }

    setIsSearchingUser(true);
    fetch(
      `${API_BASE}/api/usuarios/buscar?nombre=${encodeURIComponent(userQuery)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.usuarios || [];
        setUserResults(arr);
      })
      .catch((err) => console.error("Error buscando usuario:", err))
      .finally(() => setIsSearchingUser(false));
  }, [userQuery, useOtherUser, type]);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const addDetail = () => {
    setDetails([...details, { id_producto: "", cantidad: 1 }]);
  };

  const removeDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const loggedUserId = getUserId();


    const finalUserId =
      type === "Ingreso" && useOtherUser && selectedUser
        ? selectedUser.id_usuario
        : loggedUserId;

    // === EGRESO GENERAL ===
    if (type === "Egreso" && egresoMode === "general") {
      const payload = {
        metodo_pago: paymentMethod.toLowerCase(),
        id_usuario: loggedUserId, // 👈 fuerza que sea el profe/admin
        concepto: concept,
        monto: parseFloat(amount),
        pagado: paid ? 1 : 0,
      };

      fetch(`${API_BASE}/api/cash-movements/egreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al registrar egreso");
          return res.json();
        })
        .then(() => {
          onSuccess();
          onClose();
        })
        .catch((err) => alert(err.message))
        .finally(() => setIsLoading(false));

      return;
    }

    // === INGRESO o EGRESO CON PRODUCTOS ===
    const payload = {
      type,
      payment_method: paymentMethod,
      concept,
      user_id: type === "Egreso" ? loggedUserId : finalUserId, // 👈 acá también
      details,
      paid: paid ? 1 : 0,
    };

    fetch(`${API_BASE}/api/cash-movements/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al registrar movimiento");
        return res.json();
      })
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch((err) => alert(err.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box-cash">
        <div className="modal-header">
          <h2>Registrar Movimiento</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cash-movement-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Movimiento</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${type === "Ingreso" ? "active" : ""}`}
                  onClick={() => {
                    setType("Ingreso");
                    // al pasar a ingreso podemos volver a usar el selector de usuario
                  }}
                >
                  Ingreso
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${type === "Egreso" ? "active" : ""}`}
                  onClick={() => {
                    setType("Egreso");
                    // al pasar a egreso limpiamos selección de alumno
                    setUseOtherUser(false);
                    setSelectedUser(null);
                    setUserResults([]);
                    setUserQuery("");
                  }}
                >
                  Egreso
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Método de Pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-select"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          {/* solo para INGRESO mostramos “registrar para otro usuario” */}
          {type === "Ingreso" && (
            <div className="form-group checkbox-paid">
              <label>
                <input
                  type="checkbox"
                  checked={useOtherUser}
                  onChange={(e) => {
                    setUseOtherUser(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedUser(null);
                      setUserResults([]);
                      setUserQuery("");
                    }
                  }}
                />
                <span className="checkbox-label">
                  Registrar para otro usuario
                </span>
              </label>
            </div>
          )}

          {type === "Ingreso" && useOtherUser && (
            <div className="form-group">
              <label>Buscar usuario</label>
              <input
                type="text"
                value={userQuery}
                onChange={(e) => {
                  setUserQuery(e.target.value);
                  setSelectedUser(null);
                }}
                placeholder="Escribí el nombre..."
                className="form-input"
              />
              {isSearchingUser && <p>Buscando...</p>}
              {!isSearchingUser && userResults.length > 0 && (
                <div className="user-results-box">
                  {userResults.map((u) => (
                    <div
                      key={u.id_usuario}
                      className={`user-result-item ${
                        selectedUser &&
                        selectedUser.id_usuario === u.id_usuario
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => setSelectedUser(u)}
                    >
                      <strong>{u.nombre}</strong>{" "}
                      <span style={{ fontSize: "0.8rem", color: "#555" }}>
                        ({u.email})
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {selectedUser && (
                <p className="selected-user-chip">
                  Registrando para: <strong>{selectedUser.nombre}</strong>
                </p>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Concepto</label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Describe el movimiento"
              required
              className="form-input"
            />
          </div>

          <div className="form-group checkbox-paid">
            <label>
              <input
                type="checkbox"
                checked={paid}
                onChange={(e) => setPaid(e.target.checked)}
              />
              <span className="checkbox-label">Pagado</span>
            </label>
          </div>

          {type === "Egreso" && (
            <div className="form-group">
              <label>Tipo de egreso</label>
              <select
                value={egresoMode}
                onChange={(e) => setEgresoMode(e.target.value)}
                className="form-select"
              >
                <option value="general">General (ej: alquiler, luz)</option>
                <option value="productos">Con productos (compra)</option>
              </select>
            </div>
          )}

          {type === "Egreso" && egresoMode === "general" && (
            <div className="form-group">
              <label>Monto del egreso</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
                className="form-input"
              />
            </div>
          )}

          {(type === "Ingreso" || (type === "Egreso" && egresoMode === "productos")) && (
            <div className="products-section">
              <div className="section-header">
                <h3>Productos</h3>
                <button
                  type="button"
                  className="btn-add-product"
                  onClick={addDetail}
                >
                  + Agregar producto
                </button>
              </div>

              {details.map((detail, i) => (
                <div key={i} className="product-detail-row">
                  <select
                    value={detail.id_producto}
                    onChange={(e) =>
                      handleDetailChange(i, "id_producto", e.target.value)
                    }
                    required
                    className="form-select product-select"
                  >
                    <option value="">Seleccione un producto</option>
                    {products.map((prod) => (
                      <option key={prod.id_producto} value={prod.id_producto}>
                        {prod.nombre}
                      </option>
                    ))}
                  </select>

                  <div className="quantity-control">
                    <label>Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={detail.cantidad}
                      onChange={(e) =>
                        handleDetailChange(i, "cantidad", e.target.value)
                      }
                      className="quantity-input"
                    />
                  </div>

                  {details.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-product"
                      onClick={() => removeDetail(i)}
                      title="Eliminar producto"
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Procesando..." : "Guardar Movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMovementModal;
