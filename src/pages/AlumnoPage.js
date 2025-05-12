import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const AlumnoPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.id_rol !== 3) {
      navigate("/"); 
    }
  }, []);

  return (
    <div>
      <h1>Bienvenido, Alumno</h1>
    </div>
  );
};

export default AlumnoPage;
