import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiChevronUp, FiChevronDown, FiCopy } from 'react-icons/fi';
// Remove this line: import AdminSidebar from './AdminSidebar';
import FAQForm from './FAQForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/faqs');
      
      if (response.data && response.data.data) {
        setFaqs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setSelectedFAQ(faq);
    setShowForm(true);
  };

  const handleDelete = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await api.delete(`/faqs/${faqId}`);
      toast.success('FAQ deleted successfully');
      fetchFAQs();
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  const handleToggleActive = async (faqId, currentStatus) => {
    try {
      await api.put(`/faqs/${faqId}`, { isActive: !currentStatus });
      toast.success(`FAQ ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchFAQs();
    } catch (error) {
      toast.error('Failed to update FAQ status');
    }
  };

  const handleFormSuccess = () => {
    fetchFAQs();
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    const newFaqs = [...faqs];
    [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
    
    try {
      await api.put('/faqs/reorder', { 
        items: newFaqs.map((faq, idx) => ({ _id: faq._id, order: idx }))
      });
      setFaqs(newFaqs);
      toast.success('FAQ reordered successfully');
    } catch (error) {
      toast.error('Failed to reorder FAQs');
    }
  };

  const handleMoveDown = async (index) => {
    if (index === faqs.length - 1) return;
    
    const newFaqs = [...faqs];
    [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
    
    try {
      await api.put('/faqs/reorder', { 
        items: newFaqs.map((faq, idx) => ({ _id: faq._id, order: idx }))
      });
      setFaqs(newFaqs);
      toast.success('FAQ reordered successfully');
    } catch (error) {
      toast.error('Failed to reorder FAQs');
    }
  };

  const handleDuplicate = async (faq) => {
    try {
      const newFAQ = {
        question: `${faq.question} (Copy)`,
        answer: faq.answer,
        category: faq.category,
        icon: faq.icon,
        isActive: false
      };
      
      await api.post('/faqs', newFAQ);
      toast.success('FAQ duplicated successfully');
      fetchFAQs();
    } catch (error) {
      toast.error('Failed to duplicate FAQ');
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'general': 'General',
      'technical': 'Technical',
      'pricing': 'Pricing',
      'support': 'Support',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'technical': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'pricing': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'support': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredFAQs = filter === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === filter);

  return (
    <>
      <Helmet>
        <title>Manage FAQs | Admin Panel</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage FAQs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Add, edit, and organize frequently asked questions
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            {/* Category Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="pricing">Pricing</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>

            <button
              onClick={() => {
                setSelectedFAQ(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <FiPlus className="w-5 h-5" />
              Add New FAQ
            </button>
          </div>
        </div>

        {/* FAQs Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                      <motion.tr
                        key={faq._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          !faq.isActive ? 'opacity-60' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                                index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                              }`}
                            >
                              <FiChevronUp className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <button
                              onClick={() => handleMoveDown(index)}
                              disabled={index === filteredFAQs.length - 1}
                              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                                index === filteredFAQs.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                              }`}
                            >
                              <FiChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                              {faq.icon || '❓'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {faq.question}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {faq.answer.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(faq.category)}`}>
                            {getCategoryLabel(faq.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(faq._id, faq.isActive)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                              faq.isActive
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                            }`}
                          >
                            {faq.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <FiEye className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {faq.views || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDuplicate(faq)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              title="Duplicate"
                            >
                              <FiCopy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(faq)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(faq._id)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500 dark:text-gray-400">
                          <div className="text-4xl mb-4">❓</div>
                          <p className="text-lg">No FAQs found</p>
                          <p className="text-sm mt-2">Create your first FAQ to get started</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Form Modal */}
      {showForm && (
        <FAQForm
          faq={selectedFAQ}
          onClose={() => {
            setShowForm(false);
            setSelectedFAQ(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
};

export default ManageFAQs;