import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const FAQForm = ({ faq, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    icon: '❓',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  const iconOptions = [
    '❓', '💻', '💰', '🛠️', '🚀', '📋', '🤝', '⏱️', '🔒', '📱', '🌐', '⚡', '💡', '🎯', '📊', '🔧'
  ];

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'general',
        icon: faq.icon || '❓',
        isActive: faq.isActive !== undefined ? faq.isActive : true
      });
    }
  }, [faq]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (faq) {
        await api.put(`/faqs/${faq._id}`, formData);
        toast.success('FAQ updated successfully');
      } else {
        await api.post('/faqs', formData);
        toast.success('FAQ created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {faq ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Question *
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="What is your development process?"
            />
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Answer *
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
              placeholder="I follow an agile methodology with clear phases..."
            />
          </div>

          {/* Category and Icon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="pricing">Pricing</option>
                <option value="support">Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Icon
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>
                    {icon} - {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Active (visible on the FAQ page)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (faq ? 'Update FAQ' : 'Create FAQ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQForm;