// components/GestionPage.jsx
import React, { useState } from 'react';
import GestionHeader from '../components/managerComponents/gestionHeader';
import GestionHeaderContent from '../components/managerComponents/gestionHeaderContent';
import GestionDatos from '../components/managerComponents/gestionDatos';
import GestionClases from '../components/managerComponents/gestionClases';
import AnotarUsuarioAClase from '../components/AnotarUsuarioAClase'; // ✅ Importar el nuevo componente
import '../styles/GestionPage.css';

const GestionPage = () => {
  const [selectedSection, setSelectedSection] = useState('clases');
  const [selectedSubsection, setSelectedSubsection] = useState('todas'); // 'todas', 'por-usuario', 'anotar-usuario'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const sections = [
    'clases',
    'planes', 
    'disciplinas',
    'usuarios',
    'rutinas',
    'cuotas',
    'ejercicios'
  ];

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    if (section === 'clases') {
      setSelectedSubsection('todas');
    }
  };

  const renderContent = () => {
    if (selectedSection === 'clases') {
      return (
        <div className="clases-subsection">
          <div className="subsection-content">
            {selectedSubsection === 'todas' ? (
              <GestionClases />
            ) : (
              <AnotarUsuarioAClase />
            )}
          </div>
        </div>
      );
    }

    return (
      <GestionDatos 
        section={selectedSection}
        data={[]} 
        loading={false}
        onDataUpdate={() => {}}
      />
    );
  };

  return (
    <div className="gestion-page">
      <GestionHeader 
        sections={sections}
        selectedSection={selectedSection}
        onSectionChange={handleSectionChange}
      />
      
      <GestionHeaderContent 
        section={selectedSection}
        subsection={selectedSubsection}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onSubsectionChange={setSelectedSubsection}
      />
      
      {renderContent()}
    </div>
  );
};

export default GestionPage;