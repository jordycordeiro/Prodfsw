"use client";

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AdminTabsProps {
  tabs: Tab[];
}

const AdminTabs: React.FC<AdminTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-content ${activeTab === tab.id ? 'active' : ''}`}
          id={tab.id}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default AdminTabs;
