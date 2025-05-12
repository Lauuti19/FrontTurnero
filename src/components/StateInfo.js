import React from "react";
import '../styles/StateInfo.css';

const StateInfo = () => {
  const estadoString = localStorage.getItem("usuario");
  const estado = estadoString ? JSON.parse(estadoString) : null;

  let contenido = null;

  if (estado) {
    if (estado.id_estado === 3) {
      contenido = (
        <div className="info-estado">
          <div>
          <h1>¡Tu cuota ha vencido!</h1>
          <h4>Por favor, acercate a renovar el pago de tu cuota o hazlo haciendo click</h4><a>aqui</a>
          </div>
          <div class="contenedor">
            <img src="drakkar" alt="Imagen" class="imagen-difuminada" />
          </div>

        </div>
      );
    } else if (estado.id_estado === 2) {
      contenido = (
        <div  className="info-estado">
          <h1>Tu cuenta ha sido pausada</h1>
          <h4>Acercate a nuestra sede para obtener más información de por qué realizamos este cambio</h4>
        </div>
      );
    }
  }

  return (
    <div className="state-info-container">
      {contenido}
    </div>
  );
};

export default StateInfo;
