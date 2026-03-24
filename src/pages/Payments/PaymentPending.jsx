// src/pages/Payments/PaymentPending.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PaymentPending() {
  return (
    <div className="MiCuotaPage">
      <h1 className="MiCuotaTitle">Pago pendiente ⏳</h1>

      <div className="MiCuotaCard">
        <p className="MiCuotaInfo">
          Tu pago quedó en estado pendiente. Esto puede pasar, por ejemplo, si
          el medio de pago todavía no lo confirmó.
        </p>

        <p className="MiCuotaInfo">
          Si el pago se aprueba más tarde, el sistema lo va a registrar cuando
          reciba la notificación de Mercado Pago.
        </p>

        <div className="MiCuotaActions">
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
