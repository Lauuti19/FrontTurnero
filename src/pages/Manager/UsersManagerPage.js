import React, { useState } from 'react';
import RegisterPage from "../RegisterPage";
import '../../styles/ModifyPage.css';

const ClassesManagerPage = () => {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="routine-manager-page">
            <h1>Gestión de Usuarios</h1>
            <div className="tabs">
                <button
                    className={activeTab === 'create' ? 'active' : ''}
                    onClick={() => setActiveTab('create')}
                >
                    Registrar un usuario
                </button>
                <button
                    className={activeTab === 'view' ? 'active' : ''}
                    onClick={() => setActiveTab('view')}
                >
                    Actualizar contraseña de usuario
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'create' && <RegisterPage />}
                {activeTab === 'view' && <RegisterPage />}
            </div>
        </div>
    );
};

export default ClassesManagerPage;