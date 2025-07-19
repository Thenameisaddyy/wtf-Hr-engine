import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  Globe,
  Key,
  Settings
} from 'lucide-react';

const ApiConfig = () => {
  const [apiUrl, setApiUrl] = useState('https://opensheet.elk.sh/1RsvlpFEVERK8myvdbQnlbt6yB2uz6gPHe9PqDpIbEdw/Sheet1');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const { toast } = useToast();

  const testConnection = async () => {
    if (!apiUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock API test - in real implementation this would make actual API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setIsConnected(true);
      setLastSync(new Date().toLocaleString());
      toast({
        title: "Success!",
        description: "API connection established successfully",
      });
    } catch (error) {
      setIsConnected(false);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to the API. Please check the URL.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyApiUrl = () => {
    navigator.clipboard.writeText(apiUrl);
    toast({
      title: "Copied!",
      description: "API URL copied to clipboard",
    });
  };

  const syncData = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please test the API connection first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock sync - in real implementation this would fetch fresh data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLastSync(new Date().toLocaleString());
      toast({
        title: "Data Synced",
        description: "Successfully synced latest lead data",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to sync data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
          <Database className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            API Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your Google Sheets API to fetch lead data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-red-600" />
              <span>API Endpoint</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-url" className="text-sm font-medium">
                Google Sheets API URL
              </Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="api-url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="Enter your Google Sheets API URL"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyApiUrl}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: https://opensheet.elk.sh/SHEET_ID/SHEET_NAME
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                onClick={testConnection} 
                disabled={isLoading}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>

              {isConnected && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>

            {isConnected && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">API Connected Successfully</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                  Ready to fetch lead data from your Google Sheet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-red-600" />
              <span>Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Last Sync
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lastSync || 'Never synced'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={syncData}
                disabled={!isConnected || isLoading}
                className="hover:bg-red-50 border-red-200"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Expected Data Format
              </h4>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <code className="text-xs text-blue-800 dark:text-blue-300">
                  {JSON.stringify({
                    "name ": "Lead Name",
                    "phone number ": "1234567890", 
                    "gym name ": "Gym Name",
                    "status ": "new"
                  }, null, 2)}
                </code>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ensure your Google Sheet has these column headers (with trailing spaces as shown)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-red-600" />
            <span>Setup Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Google Sheets Setup
              </h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Create a new Google Sheet or use existing one</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Make sure column headers match: "name ", "phone number ", "gym name ", "status "</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Make the sheet publicly viewable</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Use opensheet.elk.sh service to create API URL</span>
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                API Integration
              </h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Enter your API URL in the field above</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Click "Test Connection" to verify</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Use "Sync Now" to fetch latest data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Data will appear in the "New Leads" section</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiConfig;