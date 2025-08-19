import React, { useState } from 'react';
import CreateExercise from "../../components/CreateExercise";
import ManageExercises from "../../components/ManageExercises";
import '../../styles/ModifyPage.css';

const ClassesManagerPage = () => {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="routine-manager-page">
            <h1>Gestión de Ejercicios</h1>
            <div className="tabs">
                <button
                    className={activeTab === 'create' ? 'active' : ''}
                    onClick={() => setActiveTab('create')}
                >
                    Crear Ejercicio
                </button>
                <button
                    className={activeTab === 'view' ? 'active' : ''}
                    onClick={() => setActiveTab('view')}
                >
                    Modificar/Ver ejercicios
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'create' && <CreateExercise />}
                {activeTab === 'view' && <ManageExercises />}
            </div>
        </div>
    );
};

export default ClassesManagerPage;