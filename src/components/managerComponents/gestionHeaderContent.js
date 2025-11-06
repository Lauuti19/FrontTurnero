// components/managerComponents/gestionHeaderContent.jsx
import React from 'react';

const GestionHeaderContent = ({ 
  section, 
  subsection, 
  subsections = [],
  searchTerm, 
  onSearchChange, 
  currentDate, 
  onDateChange, 
  onSubsectionChange 
}) => {
  return (
    <div className="gestion-header-content">
      {/* Selector de Subsecciones */}
      {subsections.length > 1 && (
        <div className="subsection-selector">
          {subsections.map((sub) => (
            <button
              key={sub}
              className={`subsection-btn ${subsection === sub ? 'active' : ''}`}
              onClick={() => onSubsectionChange(sub)}
            >
              {sub === 'todas' ? 'Todas las Clases' : 
               sub === 'anotar-usuario' ? 'Anotar Usuario' : 
               sub.charAt(0).toUpperCase() + sub.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Barra de búsqueda (mostrar en todas las secciones excepto anotar-usuario) */}
      {subsection !== 'anotar-usuario' && (
        <div className="search-container">
          <input
            type="text"
            placeholder={`Buscar en ${section}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {/* Selector de fecha (solo para clases) */}
      {section === 'clases' && subsection === 'todas' && (
        <div className="date-selector">
          <label>Fecha: </label>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default GestionHeaderContent;