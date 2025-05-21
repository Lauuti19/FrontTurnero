import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassesUser from "../components/ClassesUser";
import '../styles/AlumnoPage.css';


const AlumnoPage = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.id_rol !== 3) {
      navigate("/");
    } else {
      setNombreUsuario(usuario.nombre);
    }
  }, [navigate]);

  return (
    <div className="alumno-page-container">
      <div className="alumno-welcome-box">
        <div className="alumno-welcome-title">Bienvenido de nuevo</div>
        <div className="alumno-welcome-name">{nombreUsuario}</div>
        <div className="alumno-welcome-text">
          Aquí podrás ver tus ejercicios, clases, progreso y mucho más.
        </div>
      </div>
      <div>
        <ClassesUser />
      </div>
      
    </div>
  );
};

export default AlumnoPage;
