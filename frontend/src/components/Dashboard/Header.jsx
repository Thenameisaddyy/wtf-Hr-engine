import React from 'react';
import { Sun, Moon, Search, Bell, User } from 'lucide-react';
import { Switch } from '../ui/switch';

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-red-100 dark:border-gray-700 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Search Section */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search leads, gyms, or phone numbers..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 
                       bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                       transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-3">
            <Sun className={`w-5 h-5 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              className="data-[state=checked]:bg-red-600"
            />
            <Moon className={`w-5 h-5 transition-colors duration-300 ${darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-gray-800 transition-colors duration-200">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Sales Manager</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@wtfhr.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;