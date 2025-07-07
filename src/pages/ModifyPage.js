import React, { useState } from "react";
import ModifierClass from "../components/ModifierClass";
import ViewClasses from "../components/GetClasses";
import ModifierPlan from "../components/ModifierPlan";
import ManagePlans from "../components/ManagePlans";
import ViewPlans from "../components/GetPlans";
import ViewExercises from "../components/GetExercises";
import RegisterPage from "./RegisterPage";
import AnotarUsuarioAClase from "../components/AnotarUsuarioAClase";
import CreateDisciplines from "../components/CreateDisciplines";
import ViewDisciplines from "../components/GetDisciplines";
import ManageDisciplines from "../components/ManageDisciplines";
import RegistrarCuota from "../components/RegistrarCuota";
import CreateExercise from "../components/CreateExercise";
import ManageExercises from "../components/ManageExercises";
import { FaChevronDown, FaChevronUp, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../styles/ModifyPage.css"; 



const CreatePage = () => {
  const [currentComponent, setCurrentComponent] = useState(<RegistrarCuota />); // Componente inicial
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { 
      name: "Clases", 
      component: null,
      subItems: [
        { name: "Crear Clase", component: <ModifierClass mode="create" /> },
        { name: "Ver Clases Hoy", component: <ViewClasses mode="view" /> },
        { name: "Anotar Alumno", component: <AnotarUsuarioAClase mode="register" /> }
      ]
    },
    { 
      name: "Planes", 
      component: <ModifierPlan/>,
      subItems: [
        { name: "Crear Plan", component: <ModifierPlan mode="create" /> },
        { name: "Actualizar/Eliminar Plan", component: <ManagePlans mode="update" /> },
        { name: "Ver Planes", component: <ViewPlans mode="view" /> }
      ]
    },
    { 
      name: "Discplinas", 
      component: <ModifierPlan/>,
      subItems: [
        { name: "Crear Disciplina", component: <CreateDisciplines mode="create" /> },
        { name: "Actualizar/Eliminar Disciplina", component: <ManageDisciplines mode="update" /> },
        { name: "Ver Disciplinas", component: <ViewDisciplines mode="view" /> }
      ]
    },
    { 
      name: "Usuarios", 
      component: <ModifierPlan/>,
      subItems: [
        { name: "Crear Usuarios", component: <RegisterPage mode="create" /> },
        { name: "Actualizar Clave", component: <ModifierClass mode="create" /> },
        { name: "Editar/Eliminar Rutina", component: <ModifierClass mode="create" /> },
      ]
    },
    { 
      name: "Cuotas", 
      component: <RegistrarCuota />,
      subItems: []
    },
    { 
      name: "Ejercicios", 
      component: <ModifierPlan/>,
      subItems: [
        { name: "Crear Ejercicio", component: <CreateExercise mode="create" /> },
        { name: "Actualizar/Eliminar Ejercicio", component: <ManageExercises mode="update" /> },
        { name: "Ver Ejercicios", component: <ViewExercises mode="view" /> }
      ]
    },
  ];

  const handleMainItemClick = (index) => {
    const item = menuItems[index];
    if (item.subItems.length === 0) {
      setCurrentComponent(item.component);
    }
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  // Para móvil
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatComponents = menuItems.flatMap(item => 
    item.subItems.length > 0 ? item.subItems : [{ name: item.name, component: item.component }]
  );

  return (
    <div className="CreatePageContainer">
      <div className="sidebar-desktop">
        {menuItems.map((item, index) => (
          <div key={index} className={`sidebar-group ${expandedMenu === index ? 'active' : ''}`}>
            <button
              className="sidebar-item"
              onClick={() => handleMainItemClick(index)}
            >
              {item.name}
              {item.subItems.length > 0 && (
                expandedMenu === index ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />
              )}
            </button>
            
            <div className="submenu">
              {item.subItems.map((subItem, subIndex) => (
                <button
                  key={subIndex}
                  className="submenu-item"
                  onClick={() => setCurrentComponent(subItem.component)}
                >
                  {subItem.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="content-wrapper">
        {/* Versión móvil */}
        <div className="SliderHeader mobile-only">
          <button className="nav-button" onClick={() => setCurrentIndex(prev => (prev === 0 ? flatComponents.length - 1 : prev - 1))}>
            <FaArrowLeft />
          </button>
          <h2>{flatComponents[currentIndex].name}</h2>
          <button className="nav-button" onClick={() => setCurrentIndex(prev => (prev === flatComponents.length - 1 ? 0 : prev + 1))}>
            <FaArrowRight />
          </button>
        </div>

        <div className="SliderContent">
          {currentComponent || flatComponents[currentIndex].component}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;