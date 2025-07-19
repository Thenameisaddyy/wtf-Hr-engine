import React from 'react';
import StatsCards from './StatsCards';
import LeadsTable from './LeadsTable';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, Clock, Users, Target, RefreshCw, AlertCircle } from 'lucide-react';

const DashboardMain = ({ stats, leads, loading, error, onRefresh }) => {
  // Generate mock recent activity based on real leads data
  const generateRecentActivity = (leadsData) => {
    if (!leadsData || leadsData.length === 0) return [];
    
    const activities = [];
    const recentLeads = leadsData.slice(0, 3);
    
    recentLeads.forEach((lead, index) => {
      const activityTypes = {
        'new': { action: 'New lead added', type: 'new' },
        'contacted': { action: 'Lead contacted', type: 'qualified' },
        'qualified': { action: 'Lead qualified', type: 'qualified' },
        'converted': { action: 'Lead converted', type: 'converted' },
        'lost': { action: 'Lead marked as lost', type: 'lost' }
      };
      
      const activity = activityTypes[lead.status] || activityTypes['new'];
      
      activities.push({
        id: index + 1,
        action: activity.action,
        lead: lead.name,
        timestamp: `${Math.floor(Math.random() * 60)} minutes ago`,
        type: activity.type
      });
    });
    
    return activities;
  };

  const recentActivity = generateRecentActivity(leads);

  const getActivityIcon = (type) => {
    const icons = {
      'new': Users,
      'qualified': Target,
      'converted': TrendingUp,
      'lost': AlertCircle
    };
    const Icon = icons[type] || Users;
    return <Icon className="w-4 h-4" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      'new': 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      'qualified': 'text-green-600 bg-green-100 dark:bg-green-900/20',
      'converted': 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
      'lost': 'text-red-600 bg-red-100 dark:bg-red-900/20'
    };
    return colors[type] || 'text-gray-600 bg-gray-100 dark:bg-gray-800';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={onRefresh} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time data from Google Sheets • Auto-refresh every 5 minutes
          </p>
        </div>
        <Button 
          onClick={onRefresh} 
          disabled={loading}
          variant="outline" 
          className="hover:bg-red-50 border-red-200"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leads Table */}
        <div className="lg:col-span-2">
          <LeadsTable leads={leads} loading={loading} />
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
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
                {loading ? (
                  // Loading skeleton
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Activity will appear when leads are updated
                    </p>
                  </div>
                )}
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
                <button 
                  onClick={onRefresh}
                  disabled={loading}
                  className="w-full p-3 text-left rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 disabled:opacity-50"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Refresh Google Sheets</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Fetch latest data from your sheet</div>
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