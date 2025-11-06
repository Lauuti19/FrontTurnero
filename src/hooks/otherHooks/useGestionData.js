import { useState } from 'react';

export const useGestionData = () => {
  const [selectedSection, setSelectedSection] = useState('clases');
  const [selectedSubsection, setSelectedSubsection] = useState('todas');
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

  // Subsections disponibles para cada sección
  const subsectionsMap = {
    clases: ['todas', 'anotar-usuario'],
    planes: ['planes'],
    disciplinas: ['disciplinas'],
    usuarios: ['usuarios'],
    rutinas: ['rutinas'],
    cuotas: ['cuotas'],
    ejercicios: ['ejercicios']
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    // Resetear a la primera subsección disponible
    const availableSubsections = subsectionsMap[section] || [section];
    setSelectedSubsection(availableSubsections[0]);
  };

  return {
    // Estados
    selectedSection,
    selectedSubsection,
    searchTerm,
    currentDate,
    sections,
    subsections: subsectionsMap[selectedSection] || [],
    
    // Setters
    setSearchTerm,
    setCurrentDate,
    setSelectedSubsection,
    
    // Handlers
    handleSectionChange
  };
};