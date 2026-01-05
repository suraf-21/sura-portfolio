import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Skills from '../components/home/Skills';
import Timeline from '../components/home/Timeline';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Surafel Ambire- Full Stack Developer | Portfolio</title>
        <meta 
          name="description" 
          content="Professional Full Stack Developer specializing in MERN stack, React, Node.js, and modern web development. View my projects and experience." 
        />
        <meta name="keywords" content="Full Stack Developer, MERN, React, Node.js, Portfolio" />
        <meta property="og:title" content="Surafel Ambire - Full Stack Developer" />
        <meta property="og:description" content="Professional Full Stack Developer Portfolio" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Hero />
      <About />
      <Skills />
      <Timeline />
    </>
  );
};

export default Home;  // Make sure this is default export