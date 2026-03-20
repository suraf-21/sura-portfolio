import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BlogCard from '../components/shared/BlogCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('all');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blogs?published=true');
      
      // Handle API response
      let blogsData = [];
      
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          blogsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          blogsData = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          blogsData = response.data.results;
        } else if (response.data.blogs && Array.isArray(response.data.blogs)) {
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

  const fetchTags = async () => {
    try {
      const response = await api.get('/blogs/tags/all');
      
      if (response.data && response.data.data) {
        setAllTags(['all', ...response.data.data]);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const filteredBlogs = selectedTag === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.tags && blog.tags.includes(selectedTag));

  return (
    <>
      <Helmet>
        <title>Blog | Surafel Ambire - Technical Insights & Tutorials</title>
        <meta 
          name="description" 
          content="Read technical articles, tutorials, and insights about web development, programming, and technology trends." 
        />
        <meta name="keywords" content="web development blog, programming tutorials, tech insights, software development, React, Node.js" />
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

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-12"
            >
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {tag === 'all' ? 'All Posts' : `#${tag}`}
                </button>
              ))}
            </motion.div>
          )}

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
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredBlogs.length === 0 && (
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
                {selectedTag !== 'all' 
                  ? `No posts found with tag "${selectedTag}". Try another tag.`
                  : 'Check back soon for new articles and insights!'}
              </p>
              {selectedTag !== 'all' && (
                <button
                  onClick={() => setSelectedTag('all')}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  View All Posts
                </button>
              )}
            </motion.div>
          )}

          {/* Blog Stats */}
          {!loading && blogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm"
            >
              Showing {filteredBlogs.length} of {blogs.length} blog posts
              {selectedTag !== 'all' && ` tagged with "${selectedTag}"`}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;