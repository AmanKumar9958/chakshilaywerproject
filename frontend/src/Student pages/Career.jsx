import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiWifi, FiWifiOff } from 'react-icons/fi';
import { ErrorBoundary } from 'react-error-boundary';

// Import your separate components
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Loading Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-[#f5f5ef] bg-opacity-90 flex items-center justify-center z-50">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-12 h-12 border-4 border-[#b69d7420] border-t-[#b69d74] rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-[#6b7280]">Loading content...</p>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#f5f5ef] px-4">
    <div className="max-w-md w-full bg-white rounded-lg border border-[#b69d7440] p-6 text-center shadow-lg" style={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(6px)'
    }}>
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiX className="w-6 h-6 text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-[#1f2839] mb-2">Something went wrong</h2>
      <p className="text-[#6b7280] mb-4 text-sm">
        {error.message || 'We encountered an unexpected issue. Please try refreshing the page.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="w-full bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] text-white py-2 px-4 rounded-md hover:from-[#b69d74DD] hover:to-[#b69d74BB] transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl"
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

  // Handle route changes with better loading state management
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle escape key and body scroll with improved cleanup
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
    
    // Control body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-[#f5f5ef] flex flex-col lg:flex-row">
        {/* Offline Banner */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#f59e0b] to-[#f59e0bDD] text-white text-center py-2 text-sm font-medium z-50 shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <FiWifiOff className="w-4 h-4" />
              <span>You're currently offline. Some features may be unavailable.</span>
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-[#1f2839] bg-opacity-50 z-40"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-[#b69d7440] hover:bg-[#b69d7408] transition-all duration-300 group"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(6px)'
          }}
        >
          {isMobileMenuOpen ? (
            <FiX className="w-5 h-5 text-[#1f2839] group-hover:text-[#b69d74] transition-colors" />
          ) : (
            <FiMenu className="w-5 h-5 text-[#1f2839] group-hover:text-[#b69d74] transition-colors" />
          )}
        </button>

        {/* Sidebar - Fixed width of 280px */}
        <aside 
          className={`
            fixed lg:sticky top-0 left-0 z-40 w-72 h-screen bg-white border-r border-[#b69d7440]
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex-shrink-0 shadow-lg
          `}
          aria-label="Sidebar"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(6px)'
          }}
        >
          <Sidebar onMobileItemClick={closeMobileMenu} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
          {/* Header */}
          <header 
            className="sticky top-0 z-30 border-b border-[#b69d7440] shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(6px)'
            }}
          >
            <Navbar onMenuToggle={toggleMobileMenu} />
          </header>

          {/* Page Content */}
          <main 
            id="main-content"
            className="flex-1 relative overflow-auto bg-[#f5f5ef]"
          >
            {/* Loading Overlay */}
            {isLoading && <LoadingSpinner />}
            
            {/* Content Container */}
            <div className={`h-full transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <ErrorBoundary 
                  FallbackComponent={ErrorFallback}
                  onReset={() => window.location.reload()}
                >
                  <Outlet />
                </ErrorBoundary>
              </div>
            </div>
          </main>
        </div>

        {/* Network Status Indicator */}
        <div className="fixed bottom-4 right-4 z-40">
          <div 
            className={`
              p-2 rounded-full shadow-md border transition-all duration-300 group
              ${isOnline 
                ? 'bg-white border-[#10b981] text-[#10b981] hover:bg-[#10b98110]' 
                : 'bg-[#f59e0b10] border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b20]'
              }
            `}
            title={isOnline ? 'Online' : 'Offline'}
            aria-live="polite"
            style={{
              background: isOnline 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(245, 158, 11, 0.08)',
              backdropFilter: 'blur(6px)'
            }}
          >
            {isOnline ? (
              <FiWifi className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <FiWifiOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
          </div>
        </div>

        {/* Skip to Content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] text-white px-3 py-2 rounded-md z-50 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Skip to main content
        </a>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(Layout);