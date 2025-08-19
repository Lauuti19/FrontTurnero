import React, { useState } from 'react';
import CreateDisciplines from "../../components/CreateDisciplines";
import ManageDisciplines from "../../components/ManageDisciplines";
import '../../styles/ModifyPage.css';

const ClassesManagerPage = () => {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="routine-manager-page">
            <h1>Gestión de Disciplinas</h1>
            <div className="tabs">
                <button
                    className={activeTab === 'create' ? 'active' : ''}
                    onClick={() => setActiveTab('create')}
                >
                    Crear Disciplina
                </button>
                <button
                    className={activeTab === 'view' ? 'active' : ''}
                    onClick={() => setActiveTab('view')}
                >
                    Modificar/Ver Disciplinas
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'create' && <CreateDisciplines />}
                {activeTab === 'view' && <ManageDisciplines />}
            </div>
        </div>
    );
};

export default ClassesManagerPage;