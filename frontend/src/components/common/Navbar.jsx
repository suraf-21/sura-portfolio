import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/blogs', label: 'Blog' },
    { path: '/faq', label: 'FAQ' }, // Add FAQ link
    { path: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Surafeldev
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  location.pathname === item.path
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side - Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <FiMenu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;