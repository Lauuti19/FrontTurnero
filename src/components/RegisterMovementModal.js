// src/components/RegisterMovementModal.js
import React, { useState, useEffect } from "react";
import "./registermovement.css";

const RegisterMovementModal = ({ onClose, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [type, setType] = useState("Ingreso");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [concept, setConcept] = useState("");
  const [details, setDetails] = useState([{ id_producto: "", cantidad: 1 }]);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener productos al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    fetch("http://localhost:3001/api/products/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.productos || []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

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

    const payload = {
      type,
      payment_method: paymentMethod,
      concept,
      user_id: 6, // ⚠️ aquí podrías obtener el id del usuario logueado si lo guardas
      details,
    };

    fetch("http://localhost:3001/api/cash-movements/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al registrar el movimiento");
        return res.json();
      })
      .then(() => {
        onSuccess(); // refrescar lista en padre
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
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
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