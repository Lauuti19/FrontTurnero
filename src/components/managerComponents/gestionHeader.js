// components/managerComponents/gestionHeader.jsx
import React from 'react';

const GestionHeader = ({ sections, selectedSection, onSectionChange }) => {
  const getSectionTitle = (section) => {
    const titles = {
      clases: 'Clases',
      planes: 'Planes',
      disciplinas: 'Disciplinas',
      usuarios: 'Usuarios',
      rutinas: 'Rutinas',
      cuotas: 'Cuotas',
      ejercicios: 'Ejercicios'
    };
    return titles[section] || section;
  };

  return (
    <div className="gestion-header">
      <h1>Gestión</h1>
      <nav className="gestion-nav">
        {sections.map(section => (
          <button
            key={section}
            className={`gestion-nav-item ${
              selectedSection === section ? 'active' : ''
            }`}
            onClick={() => onSectionChange(section)}
          >
            {getSectionTitle(section)}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default GestionHeader;