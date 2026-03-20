import React, { useState, useEffect } from 'react';
import { FiEye, FiMessageSquare, FiFolder, FiFileText, FiUsers, FiGlobe } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/views/stats');
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      icon: <FiEye />,
      label: 'Total Views',
      value: stats?.totals?.all?.toLocaleString() || '0',
      subValue: `${stats?.totals?.uniqueVisitors || 0} unique visitors`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FiUsers />,
      label: 'Profile Views',
      value: stats?.totals?.profile?.toLocaleString() || '0',
      subValue: 'Profile page views',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <FiFolder />,
      label: 'Project Views',
      value: stats?.totals?.projects?.toLocaleString() || '0',
      subValue: 'All project views',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FiFileText />,
      label: 'Blog Views',
      value: stats?.totals?.blogs?.toLocaleString() || '0',
      subValue: 'All blog views',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: <FiGlobe />,
      label: 'Countries',
      value: stats?.charts?.countryStats?.length || '0',
      subValue: 'Different countries',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FiMessageSquare />,
      label: 'Messages',
      value: '45', // This would come from messages API
      subValue: 'Contact form submissions',
      color: 'from-red-500 to-pink-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {stat.subValue}
              </div>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
              <div className="text-white text-xl">
                {stat.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;