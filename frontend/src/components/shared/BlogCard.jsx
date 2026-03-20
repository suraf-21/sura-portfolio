import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiArrowRight, FiPlay, FiX } from 'react-icons/fi';
import api from '../../services/api'; // Changed from '../services/api' to '../../services/api'

const BlogCard = ({ blog }) => {
  const [showVideo, setShowVideo] = useState(false);

  // Add blog view tracking
  useEffect(() => {
    const trackView = async () => {
      try {
        await api.post(`/views/blog/${blog._id}`);
        console.log('✅ Blog view tracked:', blog.title);
      } catch (error) {
        // Silently fail - don't show errors to user
        console.log('ℹ️ Blog view tracking skipped:', error.message);
      }
    };

    trackView();
  }, [blog._id, blog.title]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
        className="group"
      >
        <Link to={`/blogs/${blog.slug}`}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 h-full">
            {/* Blog Image with Video Overlay */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              {blog.coverImage ? (
                <img 
                  src={blog.coverImage} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-gray-500 dark:text-gray-400">Blog Image</p>
                  </div>
                </div>
              )}
              
              {/* Video Button */}
              {blog.video && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowVideo(true);
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                  aria-label="Play video"
                >
                  <FiPlay className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Blog Content */}
            <div className="p-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {blog.tags?.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                </div>
              </div>

              {/* Read More */}
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all">
                <span>Read More</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
              <video
                src={blog.video}
                controls
                autoPlay
                className="w-full rounded-lg"
                poster={blog.coverImage}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogCard;