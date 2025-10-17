import React from 'react';
import '../styles/TabManager.css';

const TabManager = ({ 
  title, 
  tabs, 
  activeTab, 
  onTabChange, 
  children 
}) => {
  console.log('Active tab:', activeTab);
  return (
    <div className="tab-manager-container">
      <div className="tab-manager-content">
        <h2 className="tab-manager-title">{title}</h2>
        
        <div className="tab-manager-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-manager-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="tab-manager-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TabManager;