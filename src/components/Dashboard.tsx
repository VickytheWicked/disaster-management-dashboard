import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Package, Users, Bell, AlertTriangle } from 'lucide-react';

export function Dashboard() {
  const [count, setCount] = useState(0);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [lowStockResources, setLowStockResources] = useState([]);
  const [totalResources, setTotalResources] = useState(0);
  const [recentAlertsCount, setRecentAlertsCount] = useState(0);
  const [lowStockItemsCount, setLowStockItemsCount] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const volunteerResponse = await fetch('http://localhost:5000/api/user/volunteer');
      if (!volunteerResponse.ok) {
        throw new Error('No response');
      }
      const volunteerData = await volunteerResponse.json();
      setCount(volunteerData.volunteerCount);

      const alertsResponse = await fetch('http://localhost:5000/api/alerts');
      if (!alertsResponse.ok) {
        throw new Error('Failed to fetch alerts');
      }
      const alertsData = await alertsResponse.json();
      setRecentAlerts(alertsData.slice(0, 3));
      setRecentAlertsCount(alertsData.length);

      const resourcesResponse = await fetch('http://localhost:5000/api/resources');
      if (!resourcesResponse.ok) {
        throw new Error('Failed to fetch resources');
      }
      const resourcesData = await resourcesResponse.json();
      setTotalResources(resourcesData.length);
      const lowStock = resourcesData.filter((r: any) => r.quantity < 100);
      setLowStockResources(lowStock.slice(0, 4));
      setLowStockItemsCount(lowStock.length);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Resources',
      value: totalResources,
      icon: Package,
      color: 'bg-blue-500',
      /*  trend: '+12% from last month',   */
    },
    {
      title: 'Total Volunteers',
      value: count,
      icon: Users,
      color: 'bg-green-500',
      /*    trend: '+8 new this week',    */
    },
    {
      title: 'Recent Alerts',
      value: recentAlertsCount,
      icon: Bell,
      color: 'bg-purple-500',
      /*    trend: '3 unread',      */
    },
    {
      title: 'Low Stock Items',
      value: lowStockItemsCount,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      /*    trend: 'Requires attention',   */
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-100 mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">
          Welcome back! Here's what's happening with your disaster relief operations today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-gray-800 bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-gray-300">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-gray-100 mb-1">{stat.value}</div>
                {/*                <p className="text-gray-400">{stat.trend}</p>    */}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-100">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex-shrink-0 mt-1">
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-100">{alert.title}</p>
                    <Badge
                      variant={alert.status === 'Sent' ? 'default' : 'secondary'}
                      className={alert.status === 'Sent' ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-gray-800 text-gray-300'}
                    >
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400 mb-1">{alert.message}</p>
                  <p className="text-gray-500">{alert.timestamp}</p>
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No recent alerts
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Warnings */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-100">Low Stock Warnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockResources.map((resource) => (
              <div key={resource.id} className="flex items-start space-x-3 p-3 bg-orange-950/30 rounded-lg border border-orange-900/50">
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-100">{resource.name}</p>
                    <Badge variant="outline" className="border-orange-700 text-orange-300">
                      {resource.quantity} {resource.unit}
                    </Badge>
                  </div>
                  <p className="text-gray-400">Location: {resource.location}</p>
                  <p className="text-gray-400">Category: {resource.category}</p>
                </div>
              </div>
            ))}
            {lowStockResources.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                All resources adequately stocked
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-100">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-950/30 hover:bg-blue-950/50 rounded-lg border border-blue-900/50 transition-colors">
              <Package className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-gray-100">Add Resource</p>
            </button>
            <button className="p-4 bg-green-950/30 hover:bg-green-950/50 rounded-lg border border-green-900/50 transition-colors">
              <Users className="w-6 h-6 text-green-400 mb-2" />
              <p className="text-gray-100">Add Volunteer</p>
            </button>
            <button className="p-4 bg-purple-950/30 hover:bg-purple-950/50 rounded-lg border border-purple-900/50 transition-colors">
              <Bell className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-gray-100">Send Alert</p>
            </button>
            <button className="p-4 bg-orange-950/30 hover:bg-orange-950/50 rounded-lg border border-orange-900/50 transition-colors">
              <AlertTriangle className="w-6 h-6 text-orange-400 mb-2" />
              <p className="text-gray-100">View Reports</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
