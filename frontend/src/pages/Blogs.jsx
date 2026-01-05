import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BlogCard from '../components/shared/BlogCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blogs');
      
      // Handle API response - check if it's an array or has data property
      let blogsData = [];
      
      if (response.data) {
        // Check if response has data array (our backend format)
        if (response.data.data && Array.isArray(response.data.data)) {
          blogsData = response.data.data;
        } 
        // Check if response is directly an array
        else if (Array.isArray(response.data)) {
          blogsData = response.data;
        }
        // Check if response has results array
        else if (response.data.results && Array.isArray(response.data.results)) {
          blogsData = response.data.results;
        }
        // Check if response has blogs array
        else if (response.data.blogs && Array.isArray(response.data.blogs)) {
          blogsData = response.data.blogs;
        }
      }
      
      console.log('Fetched blogs:', blogsData.length);
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog | Surafel Ambire - Technical Insights</title>
        <meta 
          name="description" 
          content="Read technical articles, tutorials, and insights about web development, programming, and technology trends." 
        />
        <meta name="keywords" content="web development blog, programming tutorials, tech insights, software development" />
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
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              My <span className="text-blue-600 dark:text-blue-400">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Sharing knowledge, insights, and experiences about web development, 
              programming best practices, and the latest tech trends.
            </p>
          </motion.div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && blogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back soon for new articles and insights!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;