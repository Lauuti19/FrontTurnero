// pages/Manager/RoutineManagerPage.js
import React from "react";
import TabManager from "../../components/TabManager";
import { useTabManager } from "../../components/useTabManager";
import { routinesTabConfig } from "../../components/managerConfigs";
import CreateRoutine from "../../components/CreateRoutine";
import SearchRoutines from '../../components/SearchRoutines'
import ViewRoutines from "../../components/ViewRoutines"; // 🔹 Nueva pestaña

const RoutineManagerPage = () => {
  const { activeTab, setActiveTab } = useTabManager("create");

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateRoutine />;
      case "assign":
        return <SearchRoutines mode="assign" />;
      case "user":
        return <SearchRoutines mode="view" />;
      case "viewRoutines": 
        return <ViewRoutines />;
      default:
        return <CreateRoutine />;
    }
  };

  return (
    <TabManager
      title={routinesTabConfig.title}
      tabs={[
        { id: "create", label: "Crear rutina" },
        { id: "assign", label: "Asignar a usuario" },
        { id: "user", label: "Ver por usuario" },
        { id: "viewRoutines", label: "Ver rutinas" }, // 🔹 Nueva pestaña
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </TabManager>
  );
};

export default RoutineManagerPage;
