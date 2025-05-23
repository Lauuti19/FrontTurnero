import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfesorPage = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.id_rol !== 2) {
      navigate("/");
    } else {
      setNombreUsuario(usuario.nombre);
    }
  }, [navigate]);

  return (
    <div>
      <h1>Bienvenido, {nombreUsuario}</h1>
    </div>
  );
};

export default ProfesorPage;
