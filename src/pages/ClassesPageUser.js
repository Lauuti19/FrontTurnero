import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClassesUser from "../components/ClassesUser";

const ClassesPageUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.id_rol !== 3) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <ClassesUser />
    </div>
  );
};

export default ClassesPageUser;
