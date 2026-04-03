import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Add Link import
import ProjectCard from '../components/shared/ProjectCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  
  // Updated categories to match your new schema
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'ai-powered', name: 'AI Agents' },
    { id: 'automation', name: 'Desktop App' },
    { id: 'other', name: 'Other' }
  ];

  // Helper function to get category icon (optional)
  const getCategoryIcon = (categoryId) => {
    const icons = {
      'frontend': '🎨',
      'fullstack': '⚡',
      'ai-powered': '🤖',
      'automation': '💻',
      'other': '📦',
      'all': '🔍'
    };
    return icons[categoryId] || '📁';
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (category === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === category));
    }
  }, [category, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      
      // Handle API response - check if it's an array or has data property
      let projectsData = [];
      
      if (response.data) {
        // Check if response has data array (our backend format)
        if (response.data.data && Array.isArray(response.data.data)) {
          projectsData = response.data.data;
        } 
        // Check if response is directly an array
        else if (Array.isArray(response.data)) {
          projectsData = response.data;
        }
        // Check if response has results array
        else if (response.data.results && Array.isArray(response.data.results)) {
          projectsData = response.data.results;
        }
        // Check if response has projects array
        else if (response.data.projects && Array.isArray(response.data.projects)) {
          projectsData = response.data.projects;
        }
      }
      
      console.log('Fetched projects:', projectsData.length);
      setProjects(projectsData);
      setFilteredProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Get category display name for empty state message
  const getCategoryDisplayName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <>
      <Helmet>
        <title>Projects | Surafel Ambire - Full Stack Developer</title>
        <meta 
          name="description" 
          content="Browse through my portfolio of web development, AI-powered applications, and automation projects built with modern technologies." 
        />
        <meta name="keywords" content="React projects, Node.js projects, AI projects, automation tools, full stack development portfolio" />
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
              My <span className="text-blue-600 dark:text-blue-400">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A collection of my work showcasing expertise in frontend development, full-stack applications,
              AI-powered solutions, and desktop applications.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  category === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span>{getCategoryIcon(cat.id)}</span>
                {cat.name}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
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
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {category === 'all' 
                  ? "No projects have been added yet. Check back soon!" 
                  : `No projects found in the ${getCategoryDisplayName(category)} category. Try another category.`}
              </p>
              {category !== 'all' && (
                <button
                  onClick={() => setCategory('all')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  View All Projects
                </button>
              )}
            </motion.div>
          )}

          {/* Project Stats (Optional) */}
          {!loading && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm"
            >
              Showing {filteredProjects.length} of {projects.length} projects
              {category !== 'all' && ` in ${getCategoryDisplayName(category)}`}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;