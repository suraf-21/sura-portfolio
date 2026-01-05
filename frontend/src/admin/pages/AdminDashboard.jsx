import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '../components/AdminSidebar';
import DashboardStats from '../components/DashboardStats';
import ViewsChart from '../components/ViewsChart';

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | Admin Panel</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AdminSidebar />
        
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back! Here's what's happening with your portfolio.
            </p>
          </div>

          {/* Stats Cards */}
          <DashboardStats />

          {/* Charts and Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <ViewsChart />
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  { action: 'New message received', time: '2 minutes ago', color: 'blue' },
                  { action: 'Project "E-Commerce" updated', time: '1 hour ago', color: 'green' },
                  { action: 'New blog post published', time: '3 hours ago', color: 'purple' },
                  { action: 'Profile viewed 50 times', time: '1 day ago', color: 'yellow' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full bg-${activity.color}-500`} />
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left">
                <div className="text-blue-500 text-2xl mb-2">+</div>
                <h4 className="font-medium text-gray-900 dark:text-white">Add Project</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Create a new project showcase
                </p>
              </button>
              
              <button className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-left">
                <div className="text-purple-500 text-2xl mb-2">📝</div>
                <h4 className="font-medium text-gray-900 dark:text-white">Write Blog</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Create a new blog post
                </p>
              </button>
              
              <button className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-green-500 dark:hover:border-green-500 transition-colors text-left">
                <div className="text-green-500 text-2xl mb-2">📊</div>
                <h4 className="font-medium text-gray-900 dark:text-white">View Analytics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Check detailed analytics report
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;