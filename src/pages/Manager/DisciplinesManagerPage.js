// pages/Manager/ExercisesManagerPage.js
import React from 'react';
import TabManager from '../../components/TabManager';
import { useTabManager } from '../../components/useTabManager';
import { disciplinesTabConfig } from '../../components/managerConfigs';
import CreateDisciplines from "../../components/CreateDisciplines";
import ManageDisciplines from "../../components/ManageDisciplines";

const ExercisesManagerPage = () => {
    const { activeTab, setActiveTab } = useTabManager('create');

    const renderContent = () => {
        switch (activeTab) {
            case 'create':
                return <CreateDisciplines />;
            case 'view':
                return <ManageDisciplines />;
            default:
                return null;
        }
    };

    return (
        <TabManager
            title={disciplinesTabConfig.title}
            tabs={disciplinesTabConfig.tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {renderContent()}
        </TabManager>
    );
};

export default ExercisesManagerPage;