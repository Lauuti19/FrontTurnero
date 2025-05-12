import RegisterUser from "../components/RegisterUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.id_rol !== 1) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <h1>Bienvenido, Administrador</h1>
      <RegisterUser></RegisterUser>
    </div>
  );
};

export default AdminPage;