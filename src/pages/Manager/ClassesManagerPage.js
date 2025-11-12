// pages/Manager/ClassesManagerPage.js
import React from 'react';
import TabManager from '../../components/TabManager';
import { useTabManager } from '../../components/useTabManager';
import ModifierClass from '../../components/ModifierClass';
import ClassSchedule from '../../components/ClassSchedule';
import AnotarUsuarioAClase from '../../components/AnotarUsuarioAClase';
import './ClassesManagerPage.css';

const ClassesManagerPage = () => {
  const { activeTab, setActiveTab } = useTabManager('create');

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <ModifierClass />;

      case 'view':
        // Ver todas las clases del día y gestionarlas directo en el horario
        return (
          <ClassSchedule
            adminMode={true}
            ignoreTimeRestrictions={true}
            customTitle="Clases del día"
            customSubtitle="Todas las clases del gimnasio para la fecha seleccionada"
          />
        );

      case 'anotar':
        // Flujo especial: primero elegir usuario, después anotar
        return <AnotarUsuarioAClase />;

      default:
        return null;
    }
  };

  const tabConfig = [
    { id: 'create', label: 'Crear / Editar Clases' },
    { id: 'view', label: 'Ver Clases del Día' },
    { id: 'anotar', label: 'Anotar Usuario' },
  ];

  return (
    <div className="classes-manager-container">
      <TabManager
        title="Gestion de Clases"
        tabs={tabConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </TabManager>
    </div>
  );
};

export default ClassesManagerPage;
