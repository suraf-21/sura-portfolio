import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiDownload, FiGithub, FiLinkedin, FiTwitter, FiArrowRight, FiCode, FiLayers, FiUsers, FiBriefcase, FiBook } from 'react-icons/fi';

const Home = () => {
  // ========== HERO SECTION DATA ==========
  const socialLinks = [
    { icon: <FiGithub />, url: 'https://github.com/suraf-21', label: 'GitHub' },
    { icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/surafeldev', label: 'LinkedIn' },
    { icon: <FiTwitter />, url: 'https://twitter.com', label: 'Twitter' },
  ];

  // ========== ABOUT SECTION DATA ==========
  const features = [
    {
      icon: <FiCode />,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code following best practices.'
    },
    {
      icon: <FiLayers />,
      title: 'Modern Stack',
      description: 'Proficient in MERN stack, TypeScript, and modern development tools.'
    },
    {
      icon: <FiUsers />,
      title: 'Team Player',
      description: 'Collaborating effectively in agile teams to deliver exceptional products.'
    }
  ];

  // ========== SKILLS SECTION DATA ==========
  const skills = {
    technical: [
      { name: 'JavaScript', level: 95, icon: '🚀', category: 'frontend' },
      { name: 'TypeScript', level: 88, icon: '📘', category: 'frontend' },
      { name: 'React', level: 90, icon: '⚛️', category: 'frontend' },
      { name: 'Node.js', level: 88, icon: '🟢', category: 'backend' },
      { name: 'MongoDB', level: 85, icon: '🍃', category: 'database' },
      { name: 'Express.js', level: 87, icon: '⚡', category: 'backend' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨', category: 'frontend' },
      { name: 'Git', level: 90, icon: '📌', category: 'tools' },
      { name: 'Docker', level: 80, icon: '🐳', category: 'devops' },
      { name: 'Postman', level: 85, icon: '📬', category: 'tools' },
    ],
    soft: [
      { title: 'Problem Solving', description: 'Analytical thinking and creative solutions' },
      { title: 'Team Collaboration', description: 'Effective communication and teamwork' },
      { title: 'Adaptability', description: 'Quick learning and embracing new technologies' },
      { title: 'Time Management', description: 'Efficient task prioritization' },
    ]
  };

  // ========== TIMELINE DATA ==========
  const experience = [
    {
      year: '2026 - Present',
      title: 'Full Stack Developer',
      company: 'Freelance / SurafelDev',
      description: 'Creating modern web applications with MERN stack and TypeScript',
      type: 'experience'
    },
    {
      year: '2025',
      title: 'Backend Developer Intern',
      company: 'Ethronics (AI & Robotics Company)',
      description: 'Internship experience in backend development, building APIs with Node.js and Express.js.',
      type: 'experience'
    },
    {
      year: '2022 - present',
      degree: 'BSc Computer Science',
      institution: 'Arsi University',
      description: 'Specialized in Software Development',
      type: 'education'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Surafel Ambire - Full Stack Developer | Portfolio</title>
        <meta 
          name="description" 
          content="Professional Full Stack Developer specializing in MERN stack, TypeScript, React, Node.js, and modern web development. View my projects and experience." 
        />
        <meta name="keywords" content="Full Stack Developer, MERN, TypeScript, React, Node.js, Portfolio" />
        <meta property="og:title" content="Surafel Ambire - Full Stack Developer" />
        <meta property="og:description" content="Professional Full Stack Developer Portfolio" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-gray-900 dark:to-gray-900" />
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  Hi, I'm{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Surafel Ambire
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-medium">
                  Full-Stack Web Developer | MERN 
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                  I craft elegant digital experiences with modern technologies including TypeScript, React, and Node.js.
                  Passionate about type-safe code, scalable architecture, and user-centric design.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/surafel-cv.pdf"
                  download
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  <FiDownload className="w-5 h-5" />
                  Download CV
                </motion.a>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/projects"
                    className="inline-flex items-center px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    View Projects
                  </Link>
                </motion.div>
              </div>

              <div className="flex gap-4 pt-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto w-80 h-80 md:w-96 md:h-96">
                {/* Outer glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl" />
                
                {/* Main profile container */}
                <div className="absolute inset-4 md:inset-6 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                  {/* Profile image that fills the entire container */}
                  <img 
                    src="/profile.png" 
                    alt="Surafel Ambire - Full-Stack Developer" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Tech Badges - MERN Stack at 4 Corners */}
                {/* Top Left: React */}
                <motion.div
                  animate={{ y: [0, -8, 0], x: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 z-10"
                >
                  <span className="text-white font-bold text-xs">React</span>
                </motion.div>
                
                {/* Top Right: Express */}
                <motion.div
                  animate={{ y: [0, -8, 0], x: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                  className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 z-10"
                >
                  <span className="text-white font-bold text-xs">Express</span>
                </motion.div>
                
                {/* Bottom Left: Node.js */}
                <motion.div
                  animate={{ y: [0, 8, 0], x: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                  className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 z-10"
                >
                  <span className="text-white font-bold text-xs">Node</span>
                </motion.div>
                
                {/* Bottom Right: MongoDB */}
                <motion.div
                  animate={{ y: [0, 8, 0], x: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.9 }}
                  className="absolute -bottom-4 -right-4 w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 z-10"
                >
                  <span className="text-white font-bold text-xs">MongoDB</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT SECTION ========== */}
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  About <span className="text-blue-600 dark:text-blue-400">Me</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm a passionate Full Stack Developer with 2+ years of experience building 
                web applications that solve real-world problems. My expertise lies in the 
                MERN stack with TypeScript, but I'm always excited to learn new technologies and frameworks.
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I believe in writing clean, type-safe, maintainable code and creating intuitive user 
                experiences. When I'm not coding, you can find me contributing to open-source 
                projects, writing technical blogs, or exploring new tech trends.
              </p>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium group"
              >
                View My Projects
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <div className="text-white text-xl">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="md:col-span-2"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { value: '20+', label: 'Projects' },
                      { value: '2+', label: 'Years Exp' },
                      { value: '100%', label: 'Satisfaction' },
                      { value: '24/7', label: 'Availability' }
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== SKILLS SECTION ========== */}
      <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              My <span className="text-blue-600 dark:text-blue-400">Skills</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A collection of technical expertise and soft skills I've developed over years of experience.
            </p>
          </motion.div>

          {/* Soft Skills */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Soft Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.soft.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white text-xl">💡</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {skill.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {skill.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technical Skills */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['frontend', 'backend', 'database', 'tools', 'devops'].map((category) => {
                const categorySkills = skills.technical.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 capitalize">
                        {category} Skills
                      </h4>
                      <div className="space-y-6">
                        {categorySkills.map((skill) => (
                          <div key={skill.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{skill.icon}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {skill.name}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {skill.level}%
                              </span>
                            </div>
                            
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== TIMELINE SECTION ========== */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Journey & <span className="text-blue-600 dark:text-blue-400">Experience</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              My professional journey through education and career milestones.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

              {experience.map((item, index) => (
                <motion.div
                  key={`${item.type}-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative mb-12"
                >
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-4 border-white dark:border-gray-900 z-10 flex items-center justify-center">
                    {item.type === 'education' ? (
                      <FiBook className="w-4 h-4 text-white" />
                    ) : (
                      <FiBriefcase className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'}`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                        item.type === 'education' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        {item.year}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {item.type === 'education' ? item.degree : item.title}
                      </h3>
                      
                      <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
                        {item.type === 'education' ? item.institution : item.company}
                      </p>
                      
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                      
                      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {item.type === 'education' ? 'Education' : 'Experience'}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;