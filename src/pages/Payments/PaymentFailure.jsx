// src/pages/Payments/PaymentFailure.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PaymentFailure() {
  return (
    <div className="MiCuotaPage">
      <h1 className="MiCuotaTitle">Pago rechazado ❌</h1>

      <div className="MiCuotaCard">
        <p className="MiCuotaInfo">
          El pago no pudo completarse o fue rechazado por el medio de pago.
        </p>

        <p className="MiCuotaInfo">
          Podés intentar nuevamente elegir un plan y generar otro pago desde
          la sección Mi Cuota.
        </p>

        <div className="MiCuotaActions">
          <Link to="/mi-cuota">
            <button className="MiCuotaPrimaryBtn">
              Volver a intentar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
