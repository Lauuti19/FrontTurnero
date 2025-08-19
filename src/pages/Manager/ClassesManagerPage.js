import React, { useState } from 'react';
import ModifierClass from '../../components/ModifierClass';
import ViewClasses from "../../components/GetClasses";
import AnotarUsuarioAClase from '../../components/AnotarUsuarioAClase';
import '../../styles/ModifyPage.css';

const ClassesManagerPage = () => {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="routine-manager-page">
            <h1>Gestión de Clases</h1>
            <div className="tabs">
                <button
                    className={activeTab === 'create' ? 'active' : ''}
                    onClick={() => setActiveTab('create')}
                >
                    Crear Clase
                </button>
                <button
                    className={activeTab === 'view' ? 'active' : ''}
                    onClick={() => setActiveTab('view')}
                >
                    Ver Clases Hoy
                </button>
                <button
                    className={activeTab === 'anotar' ? 'active' : ''}
                    onClick={() => setActiveTab('anotar')}
                >
                    Anotar Alumno a Clase
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'create' && <ModifierClass />}
                {activeTab === 'view' && <ViewClasses />}
                {activeTab === 'anotar' && <AnotarUsuarioAClase />}
            </div>
        </div>
    );
};

export default ClassesManagerPage;