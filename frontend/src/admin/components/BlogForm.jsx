import React, { useState, useEffect } from 'react';
import { FiX, FiVideo, FiImage } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BlogForm = ({ blog, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    tags: [],
    readTime: 5,
    published: true
  });
  
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        slug: blog.slug,
        tags: blog.tags || [],
        readTime: blog.readTime || 5,
        published: blog.published || true
      });
      
      if (blog.coverImage) {
        setCoverImagePreview(blog.coverImage);
      }
      
      if (blog.video) {
        setVideoPreview(blog.video);
      }
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video size should be less than 50MB');
        return;
      }
      
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!coverImageFile && !blog?.coverImage) {
      toast.error('Please select a cover image');
      return;
    }
    
    setLoading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append files if selected
      if (coverImageFile) {
        formDataToSend.append('coverImage', coverImageFile);
      }
      
      if (videoFile) {
        formDataToSend.append('video', videoFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };

      if (blog) {
        await api.put(`/blogs/${blog._id}`, formDataToSend, config);
        toast.success('Blog updated successfully');
      } else {
        await api.post('/blogs', formDataToSend, config);
        toast.success('Blog created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {blog ? 'Edit Blog Post' : 'Add New Blog Post'}
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="How to Build a Modern Web App"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="how-to-build-a-modern-web-app"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cover Image *
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
              {coverImagePreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={coverImagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Video (Optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FiVideo className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Click to upload video (optional)
                  </p>
                  <p className="text-xs text-gray-400">MP4, WebM up to 50MB</p>
                </div>
              </div>
              {videoPreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  <video 
                    src={videoPreview} 
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
              placeholder="A brief summary of your blog post..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="10"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none font-mono"
              placeholder="Write your blog content here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Read Time (minutes) *
              </label>
              <input
                type="number"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="Add tag (press Enter)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Publish immediately
            </label>
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

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
              {loading ? `Uploading... ${uploadProgress}%` : (blog ? 'Update Blog' : 'Create Blog')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;