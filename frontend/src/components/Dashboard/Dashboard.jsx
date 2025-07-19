import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardMain from './DashboardMain';
import ApiConfig from './ApiConfig';
import { mockLeads, mockStats } from '../../mock/mockData';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [leads, setLeads] = useState(mockLeads);
  const [stats, setStats] = useState(mockStats);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Set dark mode from system preference on mount
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Render active component
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardMain stats={stats} leads={leads} />;
      case 'leads':
        return <DashboardMain stats={stats} leads={leads} />;
      case 'api-config':
        return <ApiConfig />;
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">Coming Soon - Advanced analytics and reporting</p>
            </div>
          </div>
        );
      case 'targets':
        return (
          <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sales Targets</h3>
              <p className="text-gray-600 dark:text-gray-400">Set and track your sales goals</p>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Performance Metrics</h3>
              <p className="text-gray-600 dark:text-gray-400">Track team and individual performance</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
              <p className="text-gray-600 dark:text-gray-400">Manage your notification preferences</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Settings</h3>
              <p className="text-gray-600 dark:text-gray-400">Configure your dashboard preferences</p>
            </div>
          </div>
        );
      default:
        return <DashboardMain stats={stats} leads={leads} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="flex bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {renderActiveComponent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;