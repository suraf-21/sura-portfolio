import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const ViewsChart = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }

      const response = await api.get(`/views/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const viewsByDay = stats?.charts?.viewsByDay || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h3>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="mt-2 md:mt-0 px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="year">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time Chart */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Views Over Time
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={viewsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#D1D5DB' }}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Total Views"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="uniqueCount"
                name="Unique Visitors"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Stats */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Devices
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats?.charts?.deviceStats || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {(stats?.charts?.deviceStats || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Browser Stats */}
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Top Browsers
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.charts?.browserStats || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="_id" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Country Stats */}
        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Top Countries
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.charts?.countryStats || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="_id" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Most Viewed Projects
          </h4>
          <div className="space-y-3">
            {stats?.topContent?.projects?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.project?.title || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.count} views
                  </p>
                </div>
                <span className="text-2xl">🏆</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Most Viewed Blogs
          </h4>
          <div className="space-y-3">
            {stats?.topContent?.blogs?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.blog?.title || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.count} views
                  </p>
                </div>
                <span className="text-2xl">📝</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewsChart;