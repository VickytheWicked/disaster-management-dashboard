import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function Analytics() {
  const [resourcesData, setResourcesData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);

  const fetchAnalyticsData = async () => {
    try {
      const resourcesResponse = await fetch('http://localhost:5000/api/analytics/resources');
      if (!resourcesResponse.ok) {
        throw new Error('Failed to fetch resources analytics');
      }
      const resources = await resourcesResponse.json();
      setResourcesData(resources);

      const alertsResponse = await fetch('http://localhost:5000/api/analytics/alerts');
      if (!alertsResponse.ok) {
        throw new Error('Failed to fetch alerts analytics');
      }
      const alerts = await alertsResponse.json();
      setAlertsData(alerts);

      const volunteerResponse = await fetch('http://localhost:5000/api/analytics/volunteers');
      if (!volunteerResponse.ok) {
        throw new Error('Failed to fetch volunteer analytics');
      }
      const volunteers = await volunteerResponse.json();
      setVolunteerData(volunteers);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleDownloadReport = (reportType: string) => {
    toast.success(`${reportType} report downloaded successfully`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-100 mb-2">Analytics & Reports</h1>
          <p className="text-gray-400">
            Monitor resource trends, volunteer activity, and system performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="7days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* Resource Trends Chart */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-100">Resource Inventory Trends</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('Resource Trends')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={resourcesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="category" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f3f4f6',
                }}
              />
              <Legend />
              <Bar dataKey="quantity" fill="#3b82f6" name="Quantity" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts Distribution Chart */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-100">Alerts Distribution</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('Alerts Distribution')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#f3f4f6',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Alerts"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Volunteer Activity Chart */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-100">Volunteer Activity</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport('Volunteer Activity')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={volunteerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#f3f4f6',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Volunteers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Downloadable Reports */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-100">Downloadable Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleDownloadReport('Monthly Summary')}
              className="flex items-center space-x-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center border border-blue-700">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-100">Monthly Summary</p>
                <p className="text-gray-400">October 2025</p>
              </div>
              <Download className="w-5 h-5 text-gray-500" />
            </button>

            <button
              onClick={() => handleDownloadReport('Resource Inventory')}
              className="flex items-center space-x-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center border border-green-700">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-100">Resource Inventory</p>
                <p className="text-gray-400">Current Stock</p>
              </div>
              <Download className="w-5 h-5 text-gray-500" />
            </button>

            <button
              onClick={() => handleDownloadReport('Volunteer Report')}
              className="flex items-center space-x-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-700">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-100">Volunteer Report</p>
                <p className="text-gray-400">Activity Log</p>
              </div>
              <Download className="w-5 h-5 text-gray-500" />
            </button>

            <button
              onClick={() => handleDownloadReport('Alert History')}
              className="flex items-center space-x-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-orange-900/50 rounded-lg flex items-center justify-center border border-orange-900/50">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-100">Alert History</p>
                <p className="text-gray-400">All Communications</p>
              </div>
              <Download className="w-5 h-5 text-gray-500" />
            </button>

            <button
              onClick={() => handleDownloadReport('Financial Report')}
              className="flex items-center space-x-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center border border-red-700">
                <FileText className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-100">Financial Report</p>
                <p className="text-gray-400">Budget & Expenses</p>
              </div>
              <Download className="w-5 h-5 text-gray-500" />
            </button>

            <button
              onClick={() => handleDownloadReport('Annual Report')}
              className="flex items-center space-x-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-teal-900/50 rounded-lg flex items-center justify-center border border-teal-700">
                <FileText className="w-6 h-6 text-teal-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-100">Annual Report</p>
                <p className="text-gray-400">2024 Summary</p>
              </div>
              <Download className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
