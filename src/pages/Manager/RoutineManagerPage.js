import React, { useState } from 'react';
import SearchRoutines from '../../components/SearchRoutines.js';
import CreateRoutine from '../../components/CreateRoutine.js';
import '../../styles/ModifyPage.css';

const RoutineManagerPage = () => {
    const [activeTab, setActiveTab] = useState('search');

    return (
        <div className="routine-manager-page">
            <h1>Gestión de Rutinas</h1>
            
            <div className="tabs">
                <button 
                    className={activeTab === 'search' ? 'active' : ''}
                    onClick={() => setActiveTab('search')}
                >
                    Buscar rutinas de usuarios
                </button>
                <button 
                    className={activeTab === 'create' ? 'active' : ''}
                    onClick={() => setActiveTab('create')}
                >
                    Crear rutina a usuario
                </button>
            </div>
            
            <div className="tab-content">
                {activeTab === 'search' ? <SearchRoutines /> : <CreateRoutine />}
            </div>
        </div>
    );
};

export default RoutineManagerPage;