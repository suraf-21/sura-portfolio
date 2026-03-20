import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // Add Link import
import { FiGithub, FiExternalLink, FiPlay, FiX } from 'react-icons/fi';
import api from '../../services/api';

const ProjectCard = ({ project }) => {
  const [showVideo, setShowVideo] = useState(false);

  // Add project view tracking
  useEffect(() => {
    const trackView = async () => {
      try {
        await api.post(`/views/project/${project._id}`);
        console.log('✅ Project view tracked:', project.title);
      } catch (error) {
        // Silently fail - don't show errors to user
        console.log('ℹ️ Project view tracking skipped:', error.message);
      }
    };

    trackView();
  }, [project._id, project.title]);

  const getCategoryLabel = (category) => {
    const labels = {
      'frontend': 'Frontend',
      'fullstack': 'Full Stack',
      'ai-powered': 'AI Powered',
      'automation': 'Automation',
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
        {/* Wrap the entire card content with Link, except the video button */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
          {/* Project Image with Video Overlay */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <Link to={`/projects/${project._id}`}>
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🚀</div>
                    <p className="text-gray-500 dark:text-gray-400">Project Image</p>
                  </div>
                </div>
              )}
            </Link>
            
            {/* Category Badge - Keep it clickable to filter? Currently just display */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(project.category)} text-white`}>
                {getCategoryLabel(project.category)}
              </span>
            </div>

            {/* Video Button - Keep separate so it doesn't trigger the Link */}
            {project.video && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVideo(true);
                }}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors z-10"
                aria-label="Play video"
              >
                <FiPlay className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Project Content */}
          <div className="p-6">
            <Link to={`/projects/${project._id}`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
            </Link>
            
            <Link to={`/projects/${project._id}`}>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {project.description}
              </p>
            </Link>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies && project.technologies.slice(0, 4).map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
              {project.technologies && project.technologies.length > 4 && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            {/* Links - Keep these separate as they open external URLs */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent triggering the parent Link
                className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FiGithub className="w-5 h-5" />
                <span className="text-sm font-medium">Code</span>
              </a>
              
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering the parent Link
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <span>Live Demo</span>
                  <FiExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
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
    </>
  );
};

export default ProjectCard;