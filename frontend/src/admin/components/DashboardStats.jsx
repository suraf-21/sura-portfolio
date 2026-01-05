import React from 'react';
import { FiEye, FiMessageSquare, FiFolder, FiFileText } from 'react-icons/fi';

const DashboardStats = () => {
  const stats = [
    {
      icon: <FiEye />,
      label: 'Total Views',
      value: '1,234',
      change: '+12%',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FiMessageSquare />,
      label: 'Messages',
      value: '45',
      change: '+5%',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FiFolder />,
      label: 'Projects',
      value: '24',
      change: '+3%',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FiFileText />,
      label: 'Blog Posts',
      value: '18',
      change: '+8%',
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
              <div className="text-white text-xl">
                {stat.icon}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {stat.change}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;