import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiEye, FiTag, FiPlay, FiX, FiArrowLeft } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (blog && blog.tags && blog.tags.length > 0) {
      fetchRelatedPosts();
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${slug}`);
      
      if (response.data && response.data.data) {
        setBlog(response.data.data);
      } else if (response.data) {
        setBlog(response.data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      // Get blogs with similar tags
      if (!blog || !blog.tags || blog.tags.length === 0) return;
      
      const tagQueries = blog.tags.slice(0, 2).map(tag => `tag=${tag}`).join('&');
      const response = await api.get(`/blogs?limit=3&${tagQueries}`);
      
      let relatedData = [];
      if (response.data && response.data.data) {
        relatedData = response.data.data.filter(b => b._id !== blog._id);
      } else if (Array.isArray(response.data)) {
        relatedData = response.data.filter(b => b._id !== blog._id);
      }
      
      setRelatedPosts(relatedData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Surafel Ambire - Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta name="keywords" content={blog.tags?.join(', ')} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>

        {/* Hero Section with Cover Image */}
        <div className="relative h-[50vh] min-h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
          {blog.coverImage && (
            <>
              <img 
                src={blog.coverImage} 
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </>
          )}
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center text-white"
              >
                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {blog.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {blog.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiEye className="w-4 h-4" />
                    <span>{blog.views} views</span>
                  </div>
                </div>

                {/* Video Button */}
                {blog.video && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    onClick={() => setShowVideo(true)}
                    className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FiPlay className="w-5 h-5" />
                    <span>Watch Video</span>
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500"
            >
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                {blog.excerpt}
              </p>
            </motion.div>

            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </motion.article>

            {/* Tags Section */}
            {blog.tags && blog.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiTag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tags
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Share this article
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Twitter
                </button>
                <button
                  onClick={() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800/50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedBlog, index) => (
                  <motion.div
                    key={relatedBlog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/blogs/${relatedBlog.slug}`}
                      className="block bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                      {relatedBlog.coverImage && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={relatedBlog.coverImage}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDate(relatedBlog.createdAt)}</span>
                          <span>•</span>
                          <span>{relatedBlog.readTime} min read</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

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
      </div>
    </>
  );
};

export default Blog;