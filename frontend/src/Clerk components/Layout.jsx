import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import Modal from './Modal';
import ToastNotifications from './ToastNotifications';

const Layout = () => {
  const [theme, setTheme] = useState(localStorage.getItem('clerk-theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('clerk-language') || 'en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  // Handle online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  // Handle theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clerk-theme', theme);
  }, [theme]);

  // Handle language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('clerk-language', language);
  }, [language]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger global search
        document.getElementById('global-search')?.focus();
      }

      // Escape to close modal
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [showModal]);

  // Add notification function
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  // Remove notification function
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Modal functions
  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <div className={`clerk-layout min-h-screen bg-gray-50 dark:bg-gray-900 ${theme} ${language}`}>
      {/* Main Layout Container */}
      <div className="flex flex-col min-h-screen">
        {/* Header/Navbar */}
        <Navbar 
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          isOnline={isOnline}
          user={user}
          notifications={notifications}
          addNotification={addNotification}
        />

        {/* Scrollable Main Content Area */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Breadcrumb Trail - Hidden on mobile, shown on tablet and up */}
         <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 hidden sm:block">

            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user?.name || 'Clerk Dashboard'}
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Main Content */}
          <main className="flex-1 w-full overflow-auto">
            <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 mx-auto">
              {/* Connection Status Banner */}
              {!isOnline && (
                <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        You're currently offline. Some features may be limited.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className="animate-fade-in w-full min-h-[400px]">
                <Outlet context={{ 
                  addNotification, 
                  openModal, 
                  closeModal, 
                  theme, 
                  language, 
                  isOnline 
                }} />
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer theme={theme} language={language} />
      </div>

      {/* Modal Container */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          content={modalContent}
          theme={theme}
        />
      )}

      {/* Toast Notifications */}
      <ToastNotifications
        notifications={notifications}
        removeNotification={removeNotification}
        theme={theme}
      />

      {/* Loading Overlay for Global Actions */}
      <div id="loading-overlay" className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-gray-100">Processing...</span>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .clerk-layout {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom scrollbar */
        .clerk-layout ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .clerk-layout ::-webkit-scrollbar-track {
          background: rgba(156, 163, 175, 0.1);
          border-radius: 4px;
        }
        
        .clerk-layout ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }
        
        .clerk-layout ::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }

        /* Focus styles for accessibility */
        .clerk-layout *:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Dark mode transitions */
        .clerk-layout * {
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        }

        /* Ensure proper scrolling behavior */
        html, body {
          height: 100%;
          overflow: auto;
        }
      `}</style>
    </div>
  );
};

export default Layout;