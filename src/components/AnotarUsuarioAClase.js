import React, { useState } from "react";
import Buscador from "./Buscador";
import ClassSchedule from "./ClassSchedule";
import '../styles/AnotarUsuarioAClase.css';

const AnotarUsuarioAClase = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  return (
    <div className="anotar-usuario-a-clase">
      <h1>Anotar Usuario a Clase</h1>
      <div>
        <Buscador onUsuarioSeleccionado={setUsuarioSeleccionado} />
        <ClassSchedule userId={usuarioSeleccionado?.id_usuario} />
      </div>
    </div>
  );
};

export default AnotarUsuarioAClase;