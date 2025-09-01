import React, { useState } from "react";
import Buscador from "./Buscador";
import ClassSchedule from "./ClassSchedule";
import '../styles/AnotarUsuarioAClase.css';

const AnotarUsuarioAClase = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  console.log("Usuario seleccionado:", usuarioSeleccionado);

  return (
    <div className="anotar-usuario-a-clase">
      <h2>Anotar Alumno</h2>
      <div>
        <Buscador onUsuarioSeleccionado={setUsuarioSeleccionado} />
        
        {usuarioSeleccionado && (
          <div className="usuario-info">
            <p>Seleccionado: <strong>{usuarioSeleccionado.nombre}</strong></p>
          </div>
        )}
        
        <ClassSchedule 
          userId={usuarioSeleccionado?.id_usuario}
          isEmbedded={true}
          showHeader={false}
          adminMode={true} // ← Nueva prop para modo administrador
          customContainerStyle={{ padding: '10px', backgroundColor: 'transparent' }}
          customItemStyle={{ width: '100%', maxWidth: 'none' }}
        />
      </div>
    </div>
  );
};

export default AnotarUsuarioAClase;