import React from 'react';
import { useLeads } from '../contexts/LeadContext';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Mail, 
  Globe,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { stats, leads } = useLeads();

  // Process data for charts
  const statusData = [
    { name: 'New', value: stats.new || 0, color: '#10B981' },
    { name: 'Contacted', value: stats.contacted || 0, color: '#F59E0B' },
    { name: 'Qualified', value: stats.qualified || 0, color: '#3B82F6' },
    { name: 'Converted', value: stats.converted || 0, color: '#8B5CF6' },
    { name: 'Closed', value: stats.closed || 0, color: '#6B7280' }
  ];

  // Industry breakdown
  const industryData = leads.reduce((acc, lead) => {
    const industry = lead.industry || 'Unknown';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});

  const industryChartData = Object.entries(industryData)
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Geographic breakdown
  const geoData = leads.reduce((acc, lead) => {
    const location = `${lead.city || 'Unknown'}, ${lead.state || 'Unknown'}`;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const geoChartData = Object.entries(geoData)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Monthly trend (mock data for demo)
  const monthlyTrend = [
    { month: 'Jan', leads: 45, conversions: 8 },
    { month: 'Feb', leads: 52, conversions: 12 },
    { month: 'Mar', leads: 48, conversions: 10 },
    { month: 'Apr', leads: 61, conversions: 15 },
    { month: 'May', leads: 55, conversions: 13 },
    { month: 'Jun', leads: 67, conversions: 18 }
  ];

  const conversionRate = stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track your lead generation performance and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
              <p className="text-sm text-green-600">+2.3% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-blue-600">2 new this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">24%</p>
              <p className="text-sm text-green-600">+5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Lead Status Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Lead Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Lead Generation</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#3B82F6" name="Leads Generated" />
                <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Industries */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Industries</h2>
          <div className="space-y-3">
            {industryChartData.length > 0 ? (
              industryChartData.map((item, index) => (
                <div key={item.industry} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count} leads</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / industryChartData[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-8 h-8 mx-auto mb-2" />
                <p>No industry data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Locations */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Locations</h2>
          <div className="space-y-3">
            {geoChartData.length > 0 ? (
              geoChartData.map((item, index) => (
                <div key={item.location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count} leads</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / geoChartData[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-8 h-8 mx-auto mb-2" />
                <p>No location data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Export Analytics</h2>
          <div className="flex space-x-2">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Lead Data</h3>
            <p className="text-sm text-gray-600 mb-3">Export all lead information with analytics</p>
            <button className="btn-primary text-sm">Export Leads</button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Campaign Reports</h3>
            <p className="text-sm text-gray-600 mb-3">Detailed campaign performance metrics</p>
            <button className="btn-primary text-sm">Export Campaigns</button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Analytics Summary</h3>
            <p className="text-sm text-gray-600 mb-3">High-level analytics and insights</p>
            <button className="btn-primary text-sm">Export Summary</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;



