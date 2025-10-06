import React, { useState } from "react";
import Buscador from "./Buscador";
import ClassSchedule from "./ClassSchedule";
import '../styles/AnotarUsuarioAClase.css';
import { useAuth } from '../AuthContext'; // Importar el AuthContext

const AnotarUsuarioAClase = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const { getToken } = useAuth(); // Obtener la función getToken si ClassSchedule la necesita

  console.log("Usuario seleccionado:", usuarioSeleccionado);

  return (
    <div className="anotar-usuario-a-clase">
      <h2>Anotar Alumno</h2>
      <div>
        <Buscador onUsuarioSeleccionado={setUsuarioSeleccionado} />
        
        {usuarioSeleccionado && (
          <div className="usuario-info">
            <p>Seleccionado: <strong>{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido || ''}</strong></p>
            <p>Email: <strong>{usuarioSeleccionado.email}</strong></p>
            <p>DNI: <strong>{usuarioSeleccionado.dni}</strong></p>
          </div>
        )}
        
        {usuarioSeleccionado ? (
          <ClassSchedule 
            userId={usuarioSeleccionado?.id_usuario}
            isEmbedded={true}
            showHeader={false}
            adminMode={true}
            customContainerStyle={{ padding: '10px', backgroundColor: 'transparent' }}
            customItemStyle={{ width: '100%', maxWidth: 'none' }}
            getToken={getToken} // Pasar getToken si ClassSchedule hace peticiones
          />
        ) : (
          <div className="selecciona-usuario-message">
            <p>Por favor, selecciona un usuario para ver las clases disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnotarUsuarioAClase;