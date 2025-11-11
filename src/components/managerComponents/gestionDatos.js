// components/managerComponents/GestionDatos.jsx
import React from 'react';
import { useGestionContent } from '../../hooks/otherHooks/useGestionContent';

const GestionDatos = ({ section, subsection, searchTerm, currentDate }) => {
  const { renderContent } = useGestionContent();

  return (
    <div className="gestion-datos">
      <div className="gestion-datos-content">
        {renderContent(section, subsection, searchTerm, currentDate)}
      </div>
    </div>
  );
};

export default GestionDatos;