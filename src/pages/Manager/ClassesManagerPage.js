// pages/Manager/ClassesManagerPage.js
import React from 'react';
import TabManager from '../../components/TabManager';
import { useTabManager } from '../../components/useTabManager';
import { classesTabConfig } from '../../components/managerConfigs';
import ModifierClass from '../../components/ModifierClass';
import ViewClasses from "../../components/GetClasses";
import AnotarUsuarioAClase from '../../components/AnotarUsuarioAClase';

const ClassesManagerPage = () => {
    const { activeTab, setActiveTab } = useTabManager('create');

    const renderContent = () => {
        switch (activeTab) {
            case 'create':
                return <ModifierClass />;
            case 'view':
                return <ViewClasses />;
            case 'anotar':
                return <AnotarUsuarioAClase />;
            default:
                return null;
        }
    };

    return (
        <TabManager
            title={classesTabConfig.title}
            tabs={classesTabConfig.tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {renderContent()}
        </TabManager>
    );
};

export default ClassesManagerPage;