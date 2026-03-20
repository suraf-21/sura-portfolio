import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <FiGithub />, url: 'https://github.com/suraf-21', label: 'GitHub' },
    { icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/surafeldev', label: 'LinkedIn' },
    { icon: <FiTwitter />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FiMail />, url: 'mailto:ambiresurafel@gmail.com', label: 'Email' },
  ];

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
             SurafelDev
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Full Stack Developer crafting digital experiences with modern technologies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Technologies
            </h3>
            <ul className="space-y-2">
              {['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', ].map((tech) => (
                <li key={tech}>
                  <span className="text-gray-600 dark:text-gray-400">
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400">
               contact@sura21dev.com
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                +251 93 481 0156
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                 Ethiopia
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} SurafelDev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;