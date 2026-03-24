// src/pages/Payments/PaymentSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="MiCuotaPage">
      <h1 className="MiCuotaTitle">Pago aprobado ✅</h1>

      <div className="MiCuotaCard">
        <p className="MiCuotaInfo">
          Tu pago fue procesado correctamente. Tus créditos se van a acreditar
          automáticamente cuando recibamos la confirmación de Mercado Pago.
        </p>

        <div className="MiCuotaResumen" style={{ marginTop: 18 }}>
          <div>
            <span>Estado:</span>
            <strong>Aprobado</strong>
          </div>
          <div>
            <span>Próximo paso:</span>
            <strong>¡Ya podés volver a ver tu cuota!</strong>
          </div>
        </div>

        <div className="MiCuotaActions" style={{ marginTop: 18 }}>
          <Link to="/mi-cuota">
            <button className="MiCuotaPrimaryBtn">
              Volver a Mi Cuota
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
