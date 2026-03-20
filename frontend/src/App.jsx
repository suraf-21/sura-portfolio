import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Project from './pages/Project'; // Import Project detail page
import Blogs from './pages/Blogs';
import Blog from './pages/Blog';
import FAQPage from './pages/FAQPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import Login from './admin/pages/Login';
import AdminDashboard from './admin/pages/AdminDashboard';
import ManageProjects from './admin/pages/ManageProjects';
import ManageBlogs from './admin/pages/ManageBlogs';
import AdminMessages from './admin/pages/AdminMessages';
import AdminFAQs from './admin/pages/AdminFAQs';
import PrivateRoute from './admin/components/PrivateRoute';

// Styles
import './styles/globals.css';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: 'green',
                      secondary: 'black',
                    },
                  },
                  error: {
                    duration: 4000,
                    style: {
                      background: '#ef4444',
                      color: '#fff',
                    },
                  },
                }}
              />
              
              {/* Navbar is shown on all pages except admin login */}
              <Navbar />
              
              <main className="pt-16">
                <Routes>
                  {/* ===== PUBLIC ROUTES ===== */}
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<Project />} /> {/* NEW: Project detail page */}
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blogs/:slug" element={<Blog />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* ===== ADMIN ROUTES ===== */}
                  {/* Public Admin Route */}
                  <Route path="/admin/login" element={<Login />} />

                  {/* Protected Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <PrivateRoute>
                        <AdminDashboard />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/projects" 
                    element={
                      <PrivateRoute>
                        <ManageProjects />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/blogs" 
                    element={
                      <PrivateRoute>
                        <ManageBlogs />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/messages" 
                    element={
                      <PrivateRoute>
                        <AdminMessages />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/faqs" 
                    element={
                      <PrivateRoute>
                        <AdminFAQs />
                      </PrivateRoute>
                    } 
                  />

                  {/* ===== 404 ROUTE ===== */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              {/* Footer is shown on all pages except admin routes */}
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;