import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardMain from './DashboardMain';
import ApiConfig from './ApiConfig';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0,
    lostLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leads from backend
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/leads`);
      setLeads(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Failed to fetch leads data');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats({
        totalLeads: response.data.total_leads,
        newLeads: response.data.new_leads,
        qualifiedLeads: response.data.qualified_leads,
        convertedLeads: response.data.converted_leads,
        lostLeads: response.data.lost_leads
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        lostLeads: 0
      });
    }
  };

  // Refresh data from Google Sheets
  const refreshData = async () => {
    try {
      setLoading(true);
      await axios.post(`${API}/refresh-data`);
      await Promise.all([fetchLeads(), fetchStats()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

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
        return (
          <DashboardMain 
            stats={stats} 
            leads={leads} 
            loading={loading} 
            error={error}
            onRefresh={refreshData}
          />
        );
      case 'leads':
        return (
          <DashboardMain 
            stats={stats} 
            leads={leads} 
            loading={loading} 
            error={error}
            onRefresh={refreshData}
          />
        );
      case 'api-config':
        return (
          <ApiConfig 
            onDataUpdated={() => {
              fetchLeads();
              fetchStats();
            }}
          />
        );
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
        return (
          <DashboardMain 
            stats={stats} 
            leads={leads} 
            loading={loading} 
            error={error}
            onRefresh={refreshData}
          />
        );
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