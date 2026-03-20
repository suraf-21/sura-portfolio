import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiLayout, FiFolder, FiFileText, FiMail, FiLogOut, FiHome,
  FiHelpCircle // Add this icon
} from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/stats');
      if (response.data && response.data.data) {
        setUnreadCount(response.data.data.unread || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FiLayout />, label: 'Dashboard' },
    { path: '/admin/projects', icon: <FiFolder />, label: 'Projects' },
    { path: '/admin/blogs', icon: <FiFileText />, label: 'Blogs' },
    { path: '/admin/messages', icon: <FiMail />, label: 'Messages', badge: unreadCount },
    { path: '/admin/faqs', icon: <FiHelpCircle />, label: 'FAQs' }, // Add FAQ link
    { path: '/', icon: <FiHome />, label: 'View Site' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link to="/admin/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <div className="text-lg">{item.icon}</div>
            <span className="font-medium">{item.label}</span>
            
            {/* Badge for unread messages */}
            {item.badge > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
        >
          <FiLogOut className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;