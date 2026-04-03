import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiPlay, FiX, FiArrowLeft, FiTag } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (project && project.technologies && project.technologies.length > 0) {
      fetchRelatedProjects();
    }
  }, [project]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      
      if (response.data && response.data.data) {
        setProject(response.data.data);
      } else if (response.data) {
        setProject(response.data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProjects = async () => {
    try {
      if (!project || !project.technologies || project.technologies.length === 0) return;
      
      // Get projects with similar technologies (first 2 techs)
      const techQueries = project.technologies.slice(0, 2).map(tech => `technology=${tech}`).join('&');
      const response = await api.get(`/projects?limit=3&${techQueries}`);
      
      let relatedData = [];
      if (response.data && response.data.data) {
        relatedData = response.data.data.filter(p => p._id !== project._id);
      } else if (Array.isArray(response.data)) {
        relatedData = response.data.filter(p => p._id !== project._id);
      }
      
      setRelatedProjects(relatedData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related projects:', error);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'frontend': 'Frontend',
      'fullstack': 'Full Stack',
      'ai-powered': 'AI Agents',
      'automation': 'Desktop App',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'frontend': 'from-blue-500 to-cyan-500',
      'fullstack': 'from-purple-500 to-pink-500',
      'ai-powered': 'from-green-500 to-emerald-500',
      'automation': 'from-orange-500 to-red-500',
      'other': 'from-gray-500 to-slate-500'
    };
    return colors[category] || 'from-blue-500 to-purple-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | Surafel Ambire - Projects</title>
        <meta name="description" content={project.description} />
        <meta name="keywords" content={project.technologies?.join(', ')} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.description} />
        {project.image && <meta property="og:image" content={project.image} />}
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        {/* Hero Section with Project Image */}
        <div className="relative h-[50vh] min-h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
          {project.image && (
            <>
              <img 
                src={project.image} 
                alt={project.title}
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
                {/* Category Badge */}
                <div className="flex justify-center mb-4">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(project.category)} text-white`}>
                    {getCategoryLabel(project.category)}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {project.title}
                </h1>

                {/* Technologies */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-white/20 backdrop-blur-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Video Button */}
                {project.video && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    onClick={() => setShowVideo(true)}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FiPlay className="w-5 h-5" />
                    <span>Watch Demo Video</span>
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Project
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </motion.div>

            {/* Project Details Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              {/* Technologies Used */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiTag className="w-5 h-5 text-blue-500" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Links */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Project Links
                </h3>
                <div className="space-y-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiGithub className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300">View Source Code</span>
                    <FiExternalLink className="w-4 h-4 ml-auto text-gray-500" />
                  </a>
                  
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <FiExternalLink className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Share this project
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
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

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800/50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Similar Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject, index) => (
                  <motion.div
                    key={relatedProject._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/projects/${relatedProject._id}`}
                      className="block bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                      {relatedProject.image && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={relatedProject.image}
                            alt={relatedProject.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {relatedProject.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {relatedProject.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {relatedProject.technologies?.slice(0, 3).map((tech) => (
                            <span key={tech} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                              {tech}
                            </span>
                          ))}
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
                  src={project.video}
                  controls
                  autoPlay
                  className="w-full rounded-lg"
                  poster={project.image}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Project;