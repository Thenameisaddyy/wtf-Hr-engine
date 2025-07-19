import React from 'react';
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Target,
  TrendingUp,
  Database,
  Bell
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'leads', label: 'New Leads', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'targets', label: 'Sales Targets', icon: Target },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'api-config', label: 'API Config', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`
      ${collapsed ? 'w-20' : 'w-72'} 
      min-h-screen bg-white dark:bg-gray-900 border-r border-red-100 dark:border-gray-700 
      transition-all duration-300 ease-in-out shadow-xl
    `}>
      {/* Logo Section */}
      <div className="p-6 border-b border-red-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className={`${collapsed ? 'hidden' : 'block'} transition-opacity duration-300`}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              WTF HR
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sales Engine</p>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <div className="h-0.5 bg-red-600 rounded transition-all duration-300"></div>
              <div className="h-0.5 bg-red-600 rounded transition-all duration-300"></div>
              <div className="h-0.5 bg-red-600 rounded transition-all duration-300"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-xl
                transition-all duration-300 ease-in-out group
                ${isActive 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600'
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-6' : 'group-hover:scale-110'}`} />
              <span className={`
                ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                font-medium transition-all duration-300 whitespace-nowrap overflow-hidden
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`absolute bottom-6 left-3 right-3 ${collapsed ? 'hidden' : 'block'}`}>
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">System Online</span>
            </div>
            <p className="text-xs opacity-75">Last sync: 2 min ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;