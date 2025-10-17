import { useState } from 'react';

export const useTabManager = (initialTab = 'create') => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  return {
    activeTab,
    setActiveTab,
    // Método helper para cambiar tab
    changeTab: (tabId) => setActiveTab(tabId)
  };
};