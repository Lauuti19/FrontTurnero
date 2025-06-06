import React, { useState } from "react";
import ModifierClass from "../components/ModifierClass";
import ModifierPlan from "../components/ModifierPlan";
import RegisterPage from "./RegisterPage";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../styles/ModifyPage.css"; 

const CreatePage = () => {
  const components = [
    { name: "Clases", component: <ModifierClass /> },
    { name: "Planes", component: <ModifierPlan /> },
    { name: "Usuarios", component: <RegisterPage /> }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? components.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === components.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="CreatePageContainer">
      <div className="SliderHeader">
        <button className="nav-button" onClick={handlePrevious}>
          <FaArrowLeft />
        </button>

        <h2>{components[currentIndex].name}</h2>

        <button className="nav-button" onClick={handleNext}>
          <FaArrowRight />
        </button>
      </div>

      <div className="SliderContent">
        {components[currentIndex].component}
      </div>
    </div>
  );
};

export default CreatePage;
