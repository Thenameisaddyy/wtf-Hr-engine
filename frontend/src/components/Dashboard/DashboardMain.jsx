import React from 'react';
import StatsCards from './StatsCards';
import LeadsTable from './LeadsTable';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, Clock, Users, Target } from 'lucide-react';
import { mockRecentActivity } from '../../mock/mockData';

const DashboardMain = ({ stats, leads }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'new': Users,
      'qualified': Target,
      'converted': TrendingUp
    };
    const Icon = icons[type] || Users;
    return <Icon className="w-4 h-4" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      'new': 'text-blue-600 bg-blue-100',
      'qualified': 'text-green-600 bg-green-100',
      'converted': 'text-purple-600 bg-purple-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leads Table */}
        <div className="lg:col-span-2">
          <LeadsTable leads={leads} />
        </div>
        
        {/* Recent Activity */}
        <div className="space-y-6">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Recent Activity
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.lead}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-3 text-left rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Add New Lead</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Manually add a potential customer</div>
                </button>
                <button className="w-full p-3 text-left rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Import CSV</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Bulk import leads from file</div>
                </button>
                <button className="w-full p-3 text-left rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Generate Report</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Export performance metrics</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;