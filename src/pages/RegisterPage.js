import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterUser from "../components/RegisterUser";

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.id_rol !== 1) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <RegisterUser />
    </div>
  );
};

export default RegisterPage;
