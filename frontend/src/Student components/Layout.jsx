import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiWifi, FiWifiOff } from 'react-icons/fi';
import { ErrorBoundary } from 'react-error-boundary';

// Import your separate components
// import Sidebar from './Sidebar'; // Adjust path as needed
import Navbar from './Navbar';   // Adjust path as needed

// Loading Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-600">Loading content...</p>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiX className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Something went wrong</h2>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        {error.message || 'We encountered an unexpected issue. Please try refreshing the page.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        Try again
      </button>
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
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    setIsMobileMenuOpen(false);
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
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
        {/* Offline Banner */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-3 text-sm font-medium z-50 shadow-lg">
            <div className="flex items-center justify-center space-x-2 px-4">
              <FiWifiOff className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">You're currently offline. Some features may be unavailable.</span>
            </div>
          </div>
        )}

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <FiX className="w-5 h-5 text-gray-700" />
          ) : (
            <FiMenu className="w-5 h-5 text-gray-700" />
          )}
        </button>

        {/* Sidebar
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          shadow-xl lg:shadow-none
        `}>
          <Sidebar />
        </aside> */}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 w-full"> {/* Changed min-h-screen to min-h-0 and added w-full */}
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm w-full">
            <Navbar />
          </header>

          {/* Page Content */}
          <main className="flex-1 relative overflow-hidden" id="main-content"> {/* Changed overflow-auto to overflow-hidden */}
            <div className="absolute inset-0 overflow-y-auto"> {/* Added overflow-y-auto here */}
              {/* Loading Overlay */}
              {isLoading && <LoadingSpinner />}
              
              {/* Content Area */}
              <div className={`h-full transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
                <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full mx-auto"> {/* Added w-full max-w-full and adjusted padding */}
                  <Suspense fallback={<LoadingSpinner />}>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <Outlet />
                    </ErrorBoundary>
                  </Suspense>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Network Status Indicator */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className={`
            p-3 rounded-full shadow-lg border transition-all duration-300
            ${isOnline 
              ? 'bg-white border-green-200 text-green-600 hover:shadow-xl' 
              : 'bg-red-50 border-red-200 text-red-600 animate-pulse'
            }
          `}>
            {isOnline ? (
              <FiWifi className="w-5 h-5" />
            ) : (
              <FiWifiOff className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Skip to Content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-3 rounded-lg z-50 font-medium text-sm shadow-lg transition-transform hover:scale-105"
        >
          Skip to main content
        </a>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(Layout);