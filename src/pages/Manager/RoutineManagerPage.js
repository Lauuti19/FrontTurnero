// pages/Manager/RoutineManagerPage.js
import React from "react";
import TabManager from "../../components/TabManager";
import { useTabManager } from "../../components/useTabManager";
import { routinesTabConfig } from "../../components/managerConfigs";
import CreateRoutine from "../../components/CreateRoutine";
import SearchRoutines from "../../components/SearchRoutines"; // lo vamos a usar como "asignar"

const RoutineManagerPage = () => {
  // arranca en create ahora
  const { activeTab, setActiveTab } = useTabManager("create"); 

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        // ahora crea PLANTILLAS, no busca usuario
        return <CreateRoutine />;
      case "assign":
        // este va a buscar usuario y asignar rutina existente
        return <SearchRoutines mode="assign" />;
      case "view":
      default:
        // modo lectura / ver rutinas de un usuario
        return <SearchRoutines mode="view" />;
    }
  };

  return (
    <TabManager
      title={routinesTabConfig.title}
      tabs={[
        { id: "create", label: "Crear rutina" },
        { id: "assign", label: "Asignar a usuario" },
        { id: "view", label: "Ver por usuario" },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </TabManager>
  );
};

export default RoutineManagerPage;
