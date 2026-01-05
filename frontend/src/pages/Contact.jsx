import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';
import ContactForm from '../components/shared/ContactForm';

const Contact = () => {
  const contactInfo = [
    {
      icon: <FiMail />,
      title: 'Email',
      value: 'contact@surafeldev.com',
      link: 'mailto:contact@devportfolio.com'
    },
   {
  icon: <FiPhone />,
  title: 'Phone',
  value: '+251 93 481 0156',   
  link: 'tel:+251934810156'   
},
    {
      icon: <FiMapPin />,
      title: 'Location',
      value: 'Ethiopia',
      link: '#'
    },
    {
      icon: <FiGlobe />,
      title: 'Website',
      value: 'www.SurafelDev.com',
      link: 'https://SurafelDev.com'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact | Surafel Ambire - Get in Touch</title>
        <meta 
          name="description" 
          content="Get in touch for project inquiries, collaborations, or just to say hello. I'm always open to interesting opportunities." 
        />
        <meta name="keywords" content="contact developer, hire developer, project inquiry, web development" />
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
              Get in <span className="text-blue-600 dark:text-blue-400">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have a project in mind? Want to collaborate? Feel free to reach out. 
              I'm always open to discussing new opportunities and ideas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <a
                      key={info.title}
                      href={info.link}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <div className="text-white text-xl">
                          {info.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {info.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Working Hours */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Working Hours
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                      <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                      <span className="font-medium text-gray-900 dark:text-white">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                      <span className="font-medium text-gray-900 dark:text-white">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;