import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiWifi, FiWifiOff } from 'react-icons/fi';
import { ErrorBoundary } from 'react-error-boundary';

// Loading Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-base font-medium text-gray-700">Loading content...</p>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiX className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6 text-base leading-relaxed">
        {error.message || 'We encountered an unexpected issue. Please try refreshing the page.'}
      </p>
      <div className="flex space-x-3">
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base"
        >
          Refresh Page
        </button>
        <button
          onClick={resetErrorBoundary}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

// Main Layout Component
const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show online notification
      console.log('Connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      // Show offline notification
      console.log('Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle route changes with proper loading states
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Reduced loading time for better UX

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('resize', handleResize);
    
    // Control body scroll
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Offline Banner */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-4 text-base font-medium z-50 shadow-lg">
            <div className="flex items-center justify-center space-x-3">
              <FiWifiOff className="w-5 h-5" />
              <span>You're currently offline. Some features may be unavailable.</span>
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="sidebar"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6 text-gray-700" />
          ) : (
            <FiMenu className="w-6 h-6 text-gray-700" />
          )}
        </button>

        {/* Sidebar - Fixed dimensions */}
        <aside 
          id="sidebar"
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out lg:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            shadow-xl lg:shadow-none flex-shrink-0 h-screen lg:h-auto
          `}
          aria-label="Main navigation"
        >
          <Sidebar onMobileItemClick={closeMobileMenu} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen w-full lg:w-auto lg:ml-0 transition-all duration-300">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <Navbar 
              onMenuToggle={toggleMobileMenu}
              isOnline={isOnline}
            />
          </header>

          {/* Page Content */}
          <main 
            id="main-content"
            className="flex-1 relative overflow-hidden"
            role="main"
          >
            {/* Loading Overlay */}
            {isLoading && <LoadingSpinner />}
            
            {/* Content Container */}
            <div className={`
              h-full w-full transition-opacity duration-300 ease-in-out
              ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}
            `}>
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Outlet />
                  </ErrorBoundary>
                </Suspense>
              </div>
            </div>
          </main>
        </div>

        {/* Network Status Indicator */}
        <div 
          className="fixed bottom-8 right-8 z-40"
          role="status" 
          aria-live="polite"
          aria-label={isOnline ? "Online" : "Offline"}
        >
          <div 
            className={`
              p-4 rounded-full shadow-lg border-2 transition-all duration-300 transform hover:scale-105
              ${isOnline 
                ? 'bg-white border-green-500 text-green-600 hover:shadow-xl' 
                : 'bg-red-50 border-red-500 text-red-600 animate-pulse'
              }
            `}
            title={isOnline ? "You are online" : "You are offline"}
          >
            {isOnline ? (
              <FiWifi className="w-6 h-6" />
            ) : (
              <FiWifiOff className="w-6 h-6" />
            )}
          </div>
        </div>

        {/* Skip to Content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-blue-600 text-white px-6 py-4 rounded-lg z-50 font-medium text-base shadow-lg transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
      </div>
    </ErrorBoundary>
  );
};

// Performance optimization
export default React.memo(Layout);