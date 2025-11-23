import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import Modal from './Modal';
import ToastNotifications from './ToastNotifications';

const Layout = () => {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('clerk-theme') || 'light'
  );
  const [language, setLanguage] = useState(() => 
    localStorage.getItem('clerk-language') || 'en'
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        type: 'success',
        title: 'Back Online',
        message: 'Your connection has been restored.'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        type: 'warning',
        title: 'Offline Mode',
        message: 'You are currently offline. Some features may be limited.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clerk-theme', theme);
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#f5f5ef');
    }
  }, [theme]);

  // Handle language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('clerk-language', language);
  }, [language]);

  // Handle route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      if (e.key === 'Escape' && showModal) {
        closeModal();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        addNotification({
          type: 'info',
          title: 'Keyboard Shortcuts',
          message: 'Ctrl+K: Search • Ctrl+/: Help • Escape: Close modal'
        });
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [showModal]);

  // Add notification function
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { 
      ...notification, 
      id,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    const duration = notification.type === 'error' ? 8000 : 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  // Remove notification function
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Modal functions
  const openModal = useCallback((content) => {
    setModalContent(content);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalContent(null);
    document.body.style.overflow = 'unset';
  }, []);

  // Global loading handler
  const setGlobalLoading = useCallback((loading) => {
    setIsLoading(loading);
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.toggle('hidden', !loading);
    }
  }, []);

  return (
    <div className="clerk-layout min-h-screen bg-[#f5f5ef] transition-colors duration-300">
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
          openModal={openModal}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Breadcrumb Trail - UPDATED: Reduced padding for more width */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-[rgba(31,40,57,0.15)] py-3 hidden sm:block">
            <nav className="flex px-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li className="flex items-center">
                  <span className="text-[#6b7280] hover:text-[#1f2839] transition-colors cursor-default">
                    Clerk Dashboard
                  </span>
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="ml-2 text-[#1f2839] font-medium">
                    {location.pathname.split('/').pop() || 'Home'}
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Main Content - UPDATED: Full width */}
          <main className="flex-1 w-full">
            <div className="w-full">
              {/* Connection Status Banner */}
              {!isOnline && (
                <div className="mx-4 mt-4 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 backdrop-blur-sm animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">
                          Offline Mode
                        </h3>
                        <p className="text-sm text-amber-700 mt-1">
                          You're currently offline. Some features may be limited.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-amber-500 rounded-full animate-ping mr-2"></div>
                      <span className="text-xs text-amber-600 font-medium">OFFLINE</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="animate-fade-in-up">
                  <Outlet context={{ 
                    addNotification, 
                    openModal, 
                    closeModal, 
                    setGlobalLoading,
                    theme, 
                    language, 
                    isOnline 
                  }} />
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer theme={theme} language={language} />
      </div>

      {/* Modal Container */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        content={modalContent}
        theme={theme}
      />

      {/* Toast Notifications */}
      <ToastNotifications
        notifications={notifications}
        removeNotification={removeNotification}
        theme={theme}
      />

      {/* Loading Overlay */}
      <div 
        id="loading-overlay" 
        className="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300"
      >
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-[rgba(31,40,57,0.15)] transform transition-transform duration-300 scale-95 hover:scale-100">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b69d74]"></div>
            <div>
              <p className="text-[#1f2839] font-semibold">Processing...</p>
              <p className="text-[#6b7280] text-sm mt-1">Please wait a moment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .clerk-layout {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5ef;
          height: 100vh;
          overflow-y: auto;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .clerk-layout * {
          overflow: visible !important;
        }

        .clerk-layout main,
        .clerk-layout .flex-1,
        .clerk-layout .overflow-auto,
        .clerk-layout .overflow-hidden {
          overflow: visible !important;
        }

        .clerk-layout *:focus-visible {
          outline: 2px solid #b69d74;
          outline-offset: 2px;
          border-radius: 4px;
        }

        .clerk-layout * {
          transition: all 0.2s ease-in-out;
        }

        .golden-glow {
          box-shadow: 0 0 15px rgba(182, 157, 116, 0.4);
        }

        .golden-glow-strong {
          box-shadow: 0 0 25px rgba(182, 157, 116, 0.5);
        }

        @supports not (backdrop-filter: blur(10px)) {
          .backdrop-blur-sm {
            background-color: rgba(245, 245, 239, 0.95);
          }
        }

        .clerk-layout ::selection {
          background: rgba(182, 157, 116, 0.3);
          color: #1f2839;
        }

        .clerk-layout ::-moz-selection {
          background: rgba(182, 157, 116, 0.3);
          color: #1f2839;
        }

        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: auto;
        }

        body {
          overflow-y: scroll;
        }
      `}</style>

      {/* Inline styles for dynamic color properties */}
      <style jsx global>{`
        :root {
          --primary-bg: #f5f5ef;
          --primary-text: #1f2839;
          --accent-color: #b69d74;
          --secondary-text: #6b7280;
          --success-color: #10b981;
          --warning-color: #f59e0b;
          --info-color: #3b82f6;
        }

        .bg-primary { background-color: #f5f5ef; }
        .bg-accent { background-color: #b69d74; }
        .text-primary { color: #1f2839; }
        .text-accent { color: #b69d74; }
        .text-secondary { color: #6b7280; }
        .border-accent { border-color: #b69d74; }
        .border-primary { border-color: #1f2839; }

        .bg-gradient-golden {
          background: linear-gradient(135deg, #b69d74, rgba(182, 157, 116, 0.87), rgba(182, 157, 116, 0.73));
        }

        .bg-gradient-cream {
          background: linear-gradient(135deg, rgba(182, 157, 116, 0.12), rgba(182, 157, 116, 0.08));
        }

        .text-success { color: #10b981; }
        .text-warning { color: #f59e0b; }
        .text-info { color: #3b82f6; }
        .bg-success { background-color: #10b981; }
        .bg-warning { background-color: #f59e0b; }
        .bg-info { background-color: #3b82f6; }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(182, 157, 116, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(182, 157, 116, 0.4);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(182, 157, 116, 0.6);
        }

        html {
          scrollbar-width: thin;
          scrollbar-color: rgba(182, 157, 116, 0.4) rgba(182, 157, 116, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Layout;
