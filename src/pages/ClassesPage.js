import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClassSchedule from "../components/ClassSchedule";

const ClassesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.id_rol !== 2) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <ClassSchedule />
    </div>
  );
};

export default ClassesPage;
