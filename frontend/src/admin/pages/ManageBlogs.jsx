import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import AdminSidebar from '../components/AdminSidebar';
import BlogForm from '../components/BlogForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blogs');
      
      // Check if response has data array
      if (response.data && response.data.data) {
        // Backend returns { success: true, data: [...] }
        setBlogs(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Backend returns array directly
        setBlogs(response.data);
      } else {
        console.error('Unexpected API response:', response.data);
        toast.error('Unexpected response format from server');
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setShowForm(true);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await api.delete(`/blogs/${blogId}`);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const handleFormSuccess = () => {
    fetchBlogs();
  };

  return (
    <>
      <Helmet>
        <title>Manage Blogs | Admin Panel</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AdminSidebar />
        
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Manage Blog Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Add, edit, or remove blog posts from your portfolio
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedBlog(null);
                setShowForm(true);
              }}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <FiPlus className="w-5 h-5" />
              Add New Blog Post
            </button>
          </div>

          {/* Blogs Table */}
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
                        Blog Post
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Read Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {blogs && blogs.length > 0 ? (
                      blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {blog.title ? blog.title.charAt(0) : 'B'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {blog.title || 'Untitled Blog'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {blog.excerpt ? `${blog.excerpt.substring(0, 60)}...` : 'No excerpt'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {blog.tags && blog.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {blog.tags && blog.tags.length > 3 && (
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                                  +{blog.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {blog.readTime || 5} min
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              blog.published
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            }`}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(blog)}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              {blog.slug && (
                                <a
                                  href={`/blogs/${blog.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                  <FiEye className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDelete(blog._id)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                            <div className="text-4xl mb-4">📝</div>
                            <p className="text-lg">No blog posts found</p>
                            <p className="text-sm mt-2">Create your first blog post to get started</p>
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
      </div>

      {/* Blog Form Modal */}
      {showForm && (
        <BlogForm
          blog={selectedBlog}
          onClose={() => {
            setShowForm(false);
            setSelectedBlog(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
};

export default ManageBlogs;