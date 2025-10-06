import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext"; 
import "./registermovement.css";

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

  // Obtener productos al montar (solo si es ingreso o egreso con productos)
  useEffect(() => {
    if (type === "Ingreso" || (type === "Egreso" && egresoMode === "productos")) {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      fetch("https://backturnero.onrender.com/api/products/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setProducts(data.productos || []))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [type, egresoMode]);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const addDetail = () => {
    setDetails([...details, { id_producto: "", cantidad: 1 }]);
  };

  const removeDetail = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const id_usuario = getUserId();

    // 👉 Egreso general sin productos
    if (type === "Egreso" && egresoMode === "general") {
      const payload = {
        metodo_pago: paymentMethod.toLowerCase(), 
        id_usuario,
        concepto: concept,
        monto: parseFloat(amount),
        pagado: paid ? 1 : 0,
      };

      fetch("https://backturnero.onrender.com/api/cash-movements/egreso", {
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

    } else {
      // 👉 Ingreso o Egreso con productos
      const payload = {
        type,
        payment_method: paymentMethod,
        concept,
        user_id: id_usuario,
        details,
        paid: paid ? 1 : 0,
      };

      fetch("https://backturnero.onrender.com/api/cash-movements/register", {
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
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box-cash">
        <div className="modal-header">
          <h2>Registrar Movimiento</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="cash-movement-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Movimiento</label>
              <div className="type-toggle">
                <button 
                  type="button"
                  className={`toggle-btn ${type === "Ingreso" ? "active" : ""}`}
                  onClick={() => setType("Ingreso")}
                >
                  Ingreso
                </button>
                <button 
                  type="button"
                  className={`toggle-btn ${type === "Egreso" ? "active" : ""}`}
                  onClick={() => setType("Egreso")}
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

          {/* 👉 Selector de modo cuando es egreso */}
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

          {/* 👉 Campo monto solo para egresos generales */}
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

          {/* 👉 Sección productos para ingresos o egresos con productos */}
          {(type === "Ingreso" || (type === "Egreso" && egresoMode === "productos")) && (
            <div className="products-section">
              <div className="section-header">
                <h3>Productos</h3>
                <button type="button" className="btn-add-product" onClick={addDetail}>
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
