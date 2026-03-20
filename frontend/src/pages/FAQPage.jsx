import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMail, FiMessageCircle, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFAQs();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFaqs(faqs);
    } else {
      setFilteredFaqs(faqs.filter(faq => faq.category === selectedCategory));
    }
  }, [selectedCategory, faqs]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/faqs');
      
      if (response.data && response.data.data) {
        setFaqs(response.data.data);
        setFilteredFaqs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/faqs/categories/all');
      if (response.data && response.data.data) {
        setCategories(['all', ...response.data.data]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'general': 'General',
      'technical': 'Technical',
      'pricing': 'Pricing',
      'support': 'Support',
      'other': 'Other',
      'all': 'All Questions'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'from-blue-500 to-cyan-500',
      'technical': 'from-purple-500 to-pink-500',
      'pricing': 'from-green-500 to-emerald-500',
      'support': 'from-orange-500 to-red-500',
      'other': 'from-gray-500 to-slate-500',
      'all': 'from-indigo-500 to-purple-500'
    };
    return colors[category] || 'from-blue-500 to-purple-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'general': '📋',
      'technical': '💻',
      'pricing': '💰',
      'support': '🛠️',
      'other': '❓',
      'all': '🔍'
    };
    return icons[category] || '❓';
  };

  return (
    <>
      <Helmet>
        <title>FAQ | Surafel Ambire - Frequently Asked Questions</title>
        <meta 
          name="description" 
          content="Find answers to frequently asked questions about my services, development process, pricing, and technical expertise." 
        />
        <meta name="keywords" content="FAQ, frequently asked questions, web development questions, developer FAQ" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-2 px-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Got Questions?</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about my services, process, and expertise. 
              Can't find what you're looking for? Feel free to reach out!
            </p>
          </motion.div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${selectedCategory === category
                      ? `bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-lg scale-105`
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span>{getCategoryIcon(category)}</span>
                  {getCategoryLabel(category)}
                  {category !== 'all' && (
                    <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {faqs.filter(f => f.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}

          {/* FAQ Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div
                      onClick={() => toggleFAQ(index)}
                      className={`
                        relative bg-white dark:bg-gray-900 rounded-2xl p-6 
                        border border-gray-200 dark:border-gray-700
                        hover:shadow-xl transition-all duration-300 cursor-pointer
                        ${openIndex === index ? 'shadow-xl' : 'shadow-lg'}
                      `}
                    >
                      {/* Gradient Border on Hover */}
                      <div className={`
                        absolute inset-0 rounded-2xl bg-gradient-to-r ${getCategoryColor(faq.category)} 
                        opacity-0 group-hover:opacity-10 transition-opacity duration-300
                        ${openIndex === index ? 'opacity-10' : ''}
                      `} />

                      {/* Question */}
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`
                          w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(faq.category)} 
                          flex items-center justify-center flex-shrink-0
                          group-hover:scale-110 transition-transform duration-300
                        `}>
                          <span className="text-2xl">{faq.icon || '❓'}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                              {faq.question}
                            </h3>
                            
                            {/* Category Badge (Mobile) */}
                            <span className="md:hidden px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                              {getCategoryLabel(faq.category)}
                            </span>

                            {/* Chevron Icon */}
                            <motion.div
                              animate={{ rotate: openIndex === index ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex-shrink-0"
                            >
                              <FiChevronDown className={`
                                w-5 h-5 text-gray-500 dark:text-gray-400
                                group-hover:text-blue-600 dark:group-hover:text-blue-400
                                transition-colors duration-300
                              `} />
                            </motion.div>
                          </div>

                          {/* Category Badge (Desktop) - Removed views count */}
                          <div className="hidden md:flex items-center gap-2 mt-2">
                            <span className={`
                              px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getCategoryColor(faq.category)} 
                              text-white
                            `}>
                              {getCategoryLabel(faq.category)}
                            </span>
                          </div>

                          {/* Answer */}
                          <AnimatePresence>
                            {openIndex === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCategory !== 'all' 
                  ? `No questions in the ${getCategoryLabel(selectedCategory)} category.`
                  : 'Check back soon for frequently asked questions!'}
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  View All Questions
                </button>
              )}
            </motion.div>
          )}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl" />
              
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-12 border border-gray-200 dark:border-gray-700 shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Still Have Questions?
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Please reach out to me directly. 
                  I'm always happy to help and discuss your project in detail.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    <FiMail className="w-4 h-4" />
                    Contact Me
                  </Link>
                  
                  <a
                    href="mailto:contact@surafeldev.com"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    Send Email
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                    ⚡ Response within 24h
                  </div>
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                    🌍 Available worldwide
                  </div>
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                    💬 Free consultation
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;