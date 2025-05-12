import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfesorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.id_rol !== 2) {
      navigate("/"); // Redirige a login o inicio si no es alumno
    }
  }, []);

  return (
    <div>
      <h1>Bienvenido, Profesor</h1>
    </div>
  );
};

export default ProfesorPage;