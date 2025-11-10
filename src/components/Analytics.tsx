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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, FileText, Calendar } from 'lucide-react';
import { resourceTrendData, volunteerActivityData, alertsDistribution } from '../data/mockData';
import { toast } from 'sonner@2.0.3';

export function Analytics() {
  const handleDownloadReport = (reportType: string) => {
    toast.success(`${reportType} report downloaded successfully`);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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
            <LineChart data={resourceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
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
                dataKey="water"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Water"
              />
              <Line
                type="monotone"
                dataKey="food"
                stroke="#10b981"
                strokeWidth={2}
                name="Food"
              />
              <Line
                type="monotone"
                dataKey="medical"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Medical"
              />
              <Line
                type="monotone"
                dataKey="shelter"
                stroke="#ef4444"
                strokeWidth={2}
                name="Shelter"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
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
              <BarChart data={volunteerActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
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
                <Bar dataKey="active" fill="#3b82f6" name="Active" />
                <Bar dataKey="deployed" fill="#10b981" name="Deployed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
              <PieChart>
                <Pie
                  data={alertsDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {alertsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-100">Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-900/50">
              <p className="text-gray-400 mb-1">Response Time</p>
              <p className="text-gray-100 mb-1">2.3 hours</p>
              <p className="text-green-400">-15% from last month</p>
            </div>
            <div className="p-4 bg-green-950/30 rounded-lg border border-green-900/50">
              <p className="text-gray-400 mb-1">Resource Utilization</p>
              <p className="text-gray-100 mb-1">87%</p>
              <p className="text-green-400">+5% from last month</p>
            </div>
            <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-900/50">
              <p className="text-gray-400 mb-1">Volunteer Satisfaction</p>
              <p className="text-gray-100 mb-1">4.6/5.0</p>
              <p className="text-green-400">+0.2 from last month</p>
            </div>
            <div className="p-4 bg-orange-950/30 rounded-lg border border-orange-900/50">
              <p className="text-gray-400 mb-1">Alert Delivery Rate</p>
              <p className="text-gray-100 mb-1">98.5%</p>
              <p className="text-green-400">+1.2% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <div className="flex-shrink-0 w-12 h-12 bg-orange-900/50 rounded-lg flex items-center justify-center border border-orange-700">
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
