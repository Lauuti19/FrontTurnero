// pages/Manager/UsersManagerPage.js
import React from 'react';
import TabManager from '../../components/TabManager';
import { useTabManager } from '../../components/useTabManager';
import { usersTabConfig } from '../../components/managerConfigs';
import RegisterUser from '../../components/RegisterUser';
import UpdatePassword from '../../components/UpdatePassword';

const UsersManagerPage = () => {
    const { activeTab, setActiveTab } = useTabManager('create');

    const renderContent = () => {
        switch (activeTab) {
            case 'create':
                return <RegisterUser />;
            case 'view':
                return <UpdatePassword />;
            default:
                return null;
        }
    };

    return (
        <TabManager
            title={usersTabConfig.title}
            tabs={usersTabConfig.tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {renderContent()}
        </TabManager>
    );
};

export default UsersManagerPage;