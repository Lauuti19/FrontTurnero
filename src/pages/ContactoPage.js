import React from "react";
import '../styles/ContactoPage.css'; // Asegúrate de tener este archivo CSS creado

const ContactoPage = () => {
  return (
    <div className="contacto-page-container">
      <div className="contacto-welcome-box">
        <div className="contacto-welcome-title">Contactanos</div>
        <div className="contacto-welcome-text">
          <p>Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros.</p>
          <p>Estamos aquí para ayudarte.</p>
        </div>
        <h4>numero de ejemplo +54 2364 112233</h4>
      </div>
    </div>
  );
}
export default ContactoPage;