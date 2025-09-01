import React, { useState } from 'react';
import ModifierClass from '../../components/ModifierClass';
import ViewClasses from "../../components/GetClasses";
import AnotarUsuarioAClase from '../../components/AnotarUsuarioAClase';
import './ClassesManagerPage.css';

const ClassesManagerPage = () => {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="classes-manager-container">
            <div className="classes-manager-content">
                <h2 className="classes-manager-title">Gestión de Clases</h2>
                
                <div className="classes-tabs">
                    <button
                        className={`classes-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Crear Clase
                    </button>
                    <button
                        className={`classes-tab-btn ${activeTab === 'view' ? 'active' : ''}`}
                        onClick={() => setActiveTab('view')}
                    >
                        Ver Clases Hoy
                    </button>
                    <button
                        className={`classes-tab-btn ${activeTab === 'anotar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('anotar')}
                    >
                        Anotar Alumno
                    </button>
                </div>
                
                <div className="classes-tab-content">
                    {activeTab === 'create' && <ModifierClass />}
                    {activeTab === 'view' && <ViewClasses />}
                    {activeTab === 'anotar' && <AnotarUsuarioAClase />}
                </div>
            </div>
        </div>
    );
};

export default ClassesManagerPage;