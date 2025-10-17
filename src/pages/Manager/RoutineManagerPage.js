// pages/Manager/RoutineManagerPage.js
import React from 'react';
import TabManager from '../../components/TabManager';
import { useTabManager } from '../../components/useTabManager';
import { routinesTabConfig } from '../../components/managerConfigs';
import SearchRoutines from '../../components/SearchRoutines';
import CreateRoutine from '../../components/CreateRoutine';

const RoutineManagerPage = () => {
  const { activeTab, setActiveTab } = useTabManager('view'); // Cambiado de 'search' a 'view'

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateRoutine />;
      case 'view':  
        return <SearchRoutines />;
      default:
        return null;
    }
  };

  return (
    <TabManager
      title={routinesTabConfig.title}
      tabs={routinesTabConfig.tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </TabManager>
  );
};

export default RoutineManagerPage;