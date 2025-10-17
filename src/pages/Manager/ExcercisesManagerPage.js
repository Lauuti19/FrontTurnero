// pages/ClassesManagerPage.js
import React from 'react';
import TabManager from '../../components/TabManager';
import { useTabManager } from '../../components/useTabManager';
import { exercisesTabConfig } from '../../components/managerConfigs';
import CreateExercise from "../../components/CreateExercise";
import ManageExercises from "../../components/ManageExercises";

const ClassesManagerPage = () => {
  const { activeTab, setActiveTab } = useTabManager('create');

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateExercise />;
      case 'view':
        return <ManageExercises />;
      default:
        return null;
    }
  };

  return (
    <TabManager
      title={exercisesTabConfig.title}
      tabs={exercisesTabConfig.tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </TabManager>
  );
};

export default ClassesManagerPage;