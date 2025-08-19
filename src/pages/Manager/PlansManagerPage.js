import React, { useState } from 'react';
import ModifierPlan from "../../components/ModifierPlan";
import ManagePlans from "../../components/ManagePlans";
import '../../styles/ModifyPage.css';

const PlansManagerPage = () => {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="routine-manager-page">
            <h1>Gestión de Planes</h1>
            <div className="tabs">
                <button
                    className={activeTab === 'create' ? 'active' : ''}
                    onClick={() => setActiveTab('create')}
                >
                    Crear Plan
                </button>
                <button
                    className={activeTab === 'modify' ? 'active' : ''}
                    onClick={() => setActiveTab('modify')}
                >
                    Modificar/Ver Planes
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'create' && <ModifierPlan mode="create" />}
                {activeTab === 'modify' && <ManagePlans/>}
            </div>
        </div>
    );
};

export default PlansManagerPage;