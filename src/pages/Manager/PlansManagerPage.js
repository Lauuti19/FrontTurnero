// pages/PlansManagerPage.js
import React from 'react';
import TabManager from '../../components/TabManager';
import { useTabManager } from '../../components/useTabManager';
import { plansTabConfig } from '../../components/managerConfigs';
import ModifierPlan from "../../components/ModifierPlan";
import ManagePlans from "../../components/ManagePlans";

const PlansManagerPage = () => {
  const { activeTab, setActiveTab } = useTabManager('create');

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <ModifierPlan mode="create" />;
      case 'modify':
        return <ManagePlans />;
      default:
        return null;
    }
  };

  return (
    <TabManager
      title={plansTabConfig.title}
      tabs={plansTabConfig.tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </TabManager>
  );
};

export default PlansManagerPage;