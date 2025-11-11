// components/managerComponents/GestionContent.jsx
import React from 'react';
import GestionUsuarios from './gestionUsuarios';
import GestionEjercicios from './gestionEjercicios';
import GestionRutinas from './gestionRutinas';
import GestionClases from './gestionClases';
import AnotarUsuarioAClase from '../AnotarUsuarioAClase';

const GestionContent = ({ section, subsection, searchTerm, currentDate }) => {
  // Renderizar contenido basado en la sección y subsección
  const renderContent = () => {
    // Sección de Clases con subsecciones
    if (section === 'clases') {
      switch (subsection) {
        case 'todas':
          return <GestionClases searchTerm={searchTerm} currentDate={currentDate} />;
        case 'anotar-usuario':
          return <AnotarUsuarioAClase />;
        default:
          return <GestionClases searchTerm={searchTerm} currentDate={currentDate} />;
      }
    }

    // Otras secciones principales
    switch (section) {
      case 'usuarios':
        return <GestionUsuarios searchTerm={searchTerm} />;
      case 'ejercicios':
        return <GestionEjercicios searchTerm={searchTerm} />;
      case 'rutinas':
        return <GestionRutinas searchTerm={searchTerm} />;
      case 'planes':
        return <div>Gestión de Planes - En desarrollo</div>;
      case 'disciplinas':
        return <div>Gestión de Disciplinas - En desarrollo</div>;
      case 'cuotas':
        return <div>Gestión de Cuotas - En desarrollo</div>;
      default:
        return <div>Selecciona una sección</div>;
    }
  };

  return (
    <div className="gestion-content">
      {renderContent()}
    </div>
  );
};

export default GestionContent;