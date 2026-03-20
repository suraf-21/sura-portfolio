import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiClock, FiCheckCircle, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages');
      
      if (response.data && response.data.data) {
        setMessages(response.data.data);
      } else if (Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId, currentStatus) => {
    try {
      await api.put(`/messages/${messageId}`, { read: !currentStatus });
      toast.success(`Message marked as ${!currentStatus ? 'read' : 'unread'}`);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const handleMarkAsReplied = async (messageId, currentStatus) => {
    try {
      await api.put(`/messages/${messageId}`, { replied: !currentStatus });
      toast.success(`Message marked as ${!currentStatus ? 'replied' : 'not replied'}`);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update reply status');
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/messages/${messageId}`);
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.read;
    if (filter === 'read') return message.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;
  const readCount = messages.filter(m => m.read).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage contact form submissions
          </p>
        </div>
        
        {/* Filter Buttons */}
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'read'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Read ({readCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg border ${
                  !message.read 
                    ? 'border-yellow-500 dark:border-yellow-600' 
                    : 'border-gray-200 dark:border-gray-700'
                } overflow-hidden`}
              >
                {/* Message Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        !message.read 
                          ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <FiUser className={`w-6 h-6 ${
                          !message.read 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {message.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <a 
                            href={`mailto:${message.email}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {message.email}
                          </a>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            <FiClock className="inline mr-1" />
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex gap-2">
                      {!message.read && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                          New
                        </span>
                      )}
                      {message.replied && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          Replied
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                    Subject: {message.subject}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>

                {/* Message Actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleMarkAsRead(message._id, message.read)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          message.read
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                        }`}
                      >
                        {message.read ? <FiEyeOff /> : <FiEye />}
                        {message.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      
                      <button
                        onClick={() => handleMarkAsReplied(message._id, message.replied)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          message.replied
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                        }`}
                      >
                        <FiCheckCircle />
                        {message.replied ? 'Not Replied' : 'Replied'}
                      </button>

                      <button
                        onClick={() => handleDelete(message._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>

                    <a
                      href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <FiMail />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No messages found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter !== 'all' 
                  ? `No ${filter} messages to display.` 
                  : 'Messages from the contact form will appear here.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageMessages;