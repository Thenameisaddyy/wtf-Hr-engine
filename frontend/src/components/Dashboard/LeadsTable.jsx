import React, { useState } from 'react';
import { Phone, MapPin, Clock, MoreHorizontal, Eye, Edit2, Trash2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const LeadsTable = ({ leads, loading }) => {
  const [selectedLeads, setSelectedLeads] = useState([]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { color: 'bg-blue-500', label: 'New' },
      'contacted': { color: 'bg-yellow-500', label: 'Contacted' },
      'qualified': { color: 'bg-green-500', label: 'Qualified' },
      'converted': { color: 'bg-purple-500', label: 'Converted' },
      'lost': { color: 'bg-red-500', label: 'Lost' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig['new'];
    return (
      <Badge className={`${config.color} text-white hover:opacity-80 transition-opacity duration-200`}>
        {config.label}
      </Badge>
    );
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.toString().replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hrs ago`;
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    } catch {
      return 'Unknown';
    }
  };

  const LoadingSkeleton = () => (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="py-4 px-2">
        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
          <div className="space-y-2">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </td>
      <td className="py-4 px-4">
        <div className="w-28 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </td>
      <td className="py-4 px-4">
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
      </td>
      <td className="py-4 px-4">
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </td>
    </tr>
  );

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            New Leads
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hover:bg-red-50 border-red-200">
              Export
            </Button>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              Add Lead
            </Button>
          </div>
        </div>
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {leads.length} leads from Google Sheets
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads(leads.map((_, index) => index));
                      } else {
                        setSelectedLeads([]);
                      }
                    }}
                    disabled={loading}
                  />
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Name</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Contact</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Gym</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Added</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, index) => <LoadingSkeleton key={index} />)
              ) : leads.length > 0 ? (
                leads.map((lead, index) => (
                  <tr 
                    key={lead.user_id || index} 
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-red-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 group"
                  >
                    <td className="py-4 px-2">
                      <input 
                        type="checkbox" 
                        checked={selectedLeads.includes(index)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads([...selectedLeads, index]);
                          } else {
                            setSelectedLeads(selectedLeads.filter(i => i !== index));
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {lead.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {lead.name || 'Unknown Name'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {lead.user_id?.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-mono">
                          {formatPhoneNumber(lead.phone_number)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {lead.gym_name || 'Unknown Gym'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatTimeAgo(lead.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center space-x-2">
                            <Edit2 className="w-4 h-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No leads found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Configure your API in the API Config section to start fetching leads
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsTable;