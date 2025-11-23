import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({
  theme,
  setTheme,
  language,
  setLanguage,
  isOnline,
  user,
  notifications,
  addNotification
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCaseManagementMenu, setShowCaseManagementMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showAnalyticsMenu, setShowAnalyticsMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const caseManagementRef = useRef(null);
  const toolsRef = useRef(null);
  const analyticsRef = useRef(null);

  // Color palette from Hero component
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    gold: '#b69d74',
    darkGold: '#9c835a',
    lightGold: '#d4b98a',
    gray: '#6b7280',
    green: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    
    // Transparency variations
    gold05: 'rgba(182, 157, 116, 0.05)',
    gold08: 'rgba(182, 157, 116, 0.08)',
    gold10: 'rgba(182, 157, 116, 0.10)',
    gold15: 'rgba(182, 157, 116, 0.15)',
    gold20: 'rgba(182, 157, 116, 0.20)',
    gold40: 'rgba(182, 157, 116, 0.40)',
    navy05: 'rgba(31, 40, 57, 0.05)',
    navy10: 'rgba(31, 40, 57, 0.10)',
    navy15: 'rgba(31, 40, 57, 0.15)',
    
    // Gradients
    goldGradient: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
    subtleGold: 'linear-gradient(135deg, #b69d7420, #b69d7410)',
    creamGradient: 'linear-gradient(135deg, #f5f5ef, #f8f8f2)',
  };

  // Search data
  const searchableItems = [
    { id: 1, title: 'Case Management', type: 'module', url: '/clerk/cases', category: 'Cases' },
    { id: 2, title: 'Judicial Dashboard', type: 'dashboard', url: '/clerk/dashboard', category: 'Analytics' },
    { id: 3, title: 'SMS Communications', type: 'communication', url: '/clerk/sms-log', category: 'Tools' },
    { id: 4, title: 'Quick Actions Panel', type: 'actions', url: '/clerk/quick-actions', category: 'Tools' },
    { id: 5, title: 'Court Calendar', type: 'scheduling', url: '/clerk/calendar', category: 'Cases' },
    { id: 6, title: 'Document Management', type: 'documents', url: '/clerk/documents', category: 'Cases' },
  // Fraud Detection removed
    { id: 8, title: 'Legal Reports', type: 'reports', url: '/clerk/reports', category: 'Analytics' },
  ];

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsScrolled(window.scrollY > 10), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fixed scroll issue - removed fixed positioning
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = searchableItems
        .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchNavigation = (item) => {
    navigate(item.url);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = [
        { ref: searchRef, setter: setShowSearchResults },
        { ref: notificationRef, setter: setShowNotifications },
        { ref: userMenuRef, setter: setShowUserMenu },
        { ref: caseManagementRef, setter: setShowCaseManagementMenu },
        { ref: toolsRef, setter: setShowToolsMenu },
        { ref: analyticsRef, setter: setShowAnalyticsMenu }
      ];
      
      refs.forEach(({ ref, setter }) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setter(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation items with enhanced structure
  const caseManagementItems = [
    { 
      name: 'All Cases', 
      path: '/clerk/cases', 
      description: 'Manage complete case portfolio',
      status: '12 Active',
      color: '#10b981'
    },
    { 
      name: 'New Case File', 
      path: '/clerk/cases/new', 
      description: 'Initiate new legal proceeding',
      status: 'Quick Start',
      color: '#3b82f6'
    },
    { 
      name: 'Court Calendar', 
      path: '/clerk/calendar', 
      description: 'Judicial schedules & hearings',
      status: '3 Today',
      color: '#f59e0b'
    },
    { 
      name: 'Document Vault', 
      path: '/clerk/documents', 
      description: 'Secure document repository',
      status: '24/7 Access',
      color: '#6b7280'
    }
  ];

  const toolsItems = [
    { 
      name: 'Quick Actions', 
      path: '/clerk/quick-actions', 
      description: 'Frequent legal operations',
      status: 'Fast Track',
      color: '#10b981'
    },
    { 
      name: 'SMS Communications', 
      path: '/clerk/sms-log', 
      description: 'Client & court messaging',
      status: '12 New',
      color: '#3b82f6'
    },
    { 
      name: 'System Integrations', 
      path: '/clerk/integrations', 
      description: 'Third-party legal services',
      status: 'API Ready',
      color: '#f59e0b'
    }
  ];

  const analyticsItems = [
    // Fraud Detection removed
    { 
      name: 'Legal Reports', 
      path: '/clerk/reports', 
      description: 'Case analytics & insights',
      status: 'Data Ready',
      color: '#3b82f6'
    },
    { 
      name: 'Judicial Dashboard', 
      path: '/clerk/dashboard', 
      description: 'Performance overview',
      status: 'Live Data',
      color: '#b69d74'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Innovative Dropdown Component - Card Stack Design
  const CardStackDropdown = ({ items, isOpen, onClose, title }) => (
    <div 
      className={`absolute top-full left-0 mt-3 w-96 transform transition-all duration-500 ease-out ${
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
      }`}
    >
      <div 
        className="rounded-2xl overflow-hidden"
        style={{
          background: colors.cream,
          boxShadow: `0 25px 50px ${colors.navy15}, 0 0 0 1px ${colors.gold15}`
        }}
      >
        {/* Header with subtle pattern */}
        <div 
          className="p-6 border-b relative overflow-hidden"
          style={{ borderColor: colors.gold10 }}
        >
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              background: `linear-gradient(45deg, transparent 48%, ${colors.gold} 50%, transparent 52%)`,
              backgroundSize: '20px 20px'
            }}
          ></div>
          <div className="relative">
            <h3 className="text-lg font-bold" style={{ color: colors.navy }}>
              {title}
            </h3>
            <p className="text-sm mt-1" style={{ color: colors.gray }}>
              {items.length} specialized tools
            </p>
          </div>
        </div>
        
        {/* Card Stack Layout */}
        <div className="p-4 space-y-3">
          {items.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`block p-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 relative overflow-hidden group ${
                isActivePath(item.path)
                  ? 'border-[#b69d74] bg-white shadow-lg'
                  : 'border-transparent bg-white hover:border-[#b69d7410] hover:shadow-md'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isOpen ? `slideInUp 0.5s ease-out ${index * 100}ms both` : 'none',
                transform: `translateY(${index * 2}px)`,
                zIndex: items.length - index
              }}
            >
              {/* Accent bar */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300 group-hover:w-2"
                style={{ background: item.color }}
              ></div>
              
              <div className="pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div 
                    className="font-semibold text-sm transition-colors group-hover:text-[#1f2839]"
                    style={{ color: colors.navy }}
                  >
                    {item.name}
                  </div>
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${item.color}15`,
                      color: item.color
                    }}
                  >
                    {item.status}
                  </div>
                </div>
                <div 
                  className="text-xs leading-relaxed transition-colors"
                  style={{ color: colors.gray }}
                >
                  {item.description}
                </div>
                
                {/* Progress indicator */}
                <div className="mt-3 flex items-center space-x-2">
                  <div 
                    className="h-1 rounded-full flex-1 transition-all duration-500 group-hover:scale-105"
                    style={{ background: colors.gold05 }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-1000 group-hover:bg-[#b69d74]"
                      style={{ 
                        background: item.color,
                        width: isActivePath(item.path) ? '100%' : '70%'
                      }}
                    ></div>
                  </div>
                  <div 
                    className="text-xs transition-colors group-hover:text-[#b69d74]"
                    style={{ color: colors.gray }}
                  >
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Search Results
  const SearchResultItem = ({ item, index }) => (
    <button
      onClick={() => handleSearchNavigation(item)}
      className="w-full p-4 text-left transition-all duration-300 hover:scale-105 group border-b last:border-b-0"
      style={{ 
        borderColor: colors.gold05,
        animationDelay: `${index * 50}ms`,
        animation: showSearchResults ? `slideInUp 0.3s ease-out ${index * 50}ms both` : 'none'
      }}
    >
      <div className="flex items-start space-x-4">
        <div 
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-150"
          style={{ background: colors.gold }}
        ></div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-1">
            <div 
              className="font-medium text-sm group-hover:text-[#b69d74] transition-colors"
              style={{ color: colors.navy }}
            >
              {item.title}
            </div>
            <span 
              className="px-2 py-1 rounded-full text-xs capitalize transition-colors"
              style={{
                background: colors.gold08,
                color: colors.darkGold
              }}
            >
              {item.type}
            </span>
          </div>
          <div 
            className="text-xs transition-colors"
            style={{ color: colors.gray }}
          >
            {item.category} • Press Enter to navigate
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        background: isScrolled ? colors.cream : colors.cream,
        boxShadow: isScrolled ? `0 4px 20px ${colors.navy05}` : 'none',
        borderBottom: `1px solid ${isScrolled ? colors.gold10 : 'transparent'}`
      }}
    >
      <div className="px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Section - Brand & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Elegant Brand Logo */}
            <Link 
              to="/clerk/dashboard" 
              className="flex items-center space-x-4 group"
            >
              <div 
                className="relative p-3 rounded-2xl transition-all duration-500 group-hover:scale-110"
                style={{
                  background: colors.goldGradient,
                  boxShadow: `0 4px 15px ${colors.gold15}`
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>

              <div className="hidden lg:block">
                <h1 
                  className="text-2xl font-bold bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent"
                >
                  Chakshi
                </h1>
                <p 
                  className="text-sm font-medium tracking-wide"
                  style={{ color: colors.gray }}
                >
                  Judicial Excellence
                </p>
              </div>
            </Link>

            {/* Innovative Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {/* Case Management */}
              <div className="relative" ref={caseManagementRef}>
                <button
                  onClick={() => setShowCaseManagementMenu(!showCaseManagementMenu)}
                  className={`flex items-center px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                    isActivePath('/clerk/cases') || isActivePath('/clerk/calendar') || isActivePath('/clerk/documents')
                      ? 'text-white'
                      : 'text-[#1f2839]'
                  }`}
                  style={{
                    background: isActivePath('/clerk/cases') || isActivePath('/clerk/calendar') || isActivePath('/clerk/documents')
                      ? colors.goldGradient
                      : colors.gold05,
                    boxShadow: isActivePath('/clerk/cases') || isActivePath('/clerk/calendar') || isActivePath('/clerk/documents')
                      ? `0 4px 15px ${colors.gold20}`
                      : `0 2px 8px ${colors.navy05}`
                  }}
                >
                  <span className="relative z-10">Case Portfolio</span>
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full ${
                      showCaseManagementMenu ? 'translate-x-full' : '-translate-x-full'
                    }`}
                  ></div>
                </button>
                
                <CardStackDropdown 
                  items={caseManagementItems} 
                  isOpen={showCaseManagementMenu}
                  onClose={() => setShowCaseManagementMenu(false)}
                  title="Case Management Suite"
                />
              </div>

              {/* Legal Tools */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => setShowToolsMenu(!showToolsMenu)}
                  className={`flex items-center px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                    isActivePath('/clerk/quick-actions') || isActivePath('/clerk/sms-log') || isActivePath('/clerk/integrations')
                      ? 'text-white'
                      : 'text-[#1f2839]'
                  }`}
                  style={{
                    background: isActivePath('/clerk/quick-actions') || isActivePath('/clerk/sms-log') || isActivePath('/clerk/integrations')
                      ? colors.goldGradient
                      : colors.gold05,
                    boxShadow: isActivePath('/clerk/quick-actions') || isActivePath('/clerk/sms-log') || isActivePath('/clerk/integrations')
                      ? `0 4px 15px ${colors.gold20}`
                      : `0 2px 8px ${colors.navy05}`
                  }}
                >
                  <span className="relative z-10">Legal Tools</span>
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full ${
                      showToolsMenu ? 'translate-x-full' : '-translate-x-full'
                    }`}
                  ></div>
                </button>
                
                <CardStackDropdown 
                  items={toolsItems} 
                  isOpen={showToolsMenu}
                  onClose={() => setShowToolsMenu(false)}
                  title="Legal Tools & Utilities"
                />
              </div>

              {/* Analytics */}
              <div className="relative" ref={analyticsRef}>
                <button
                  onClick={() => setShowAnalyticsMenu(!showAnalyticsMenu)}
                  className={`flex items-center px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                    isActivePath('/clerk/reports') || isActivePath('/clerk/dashboard')
                      ? 'text-white'
                      : 'text-[#1f2839]'
                  }`}
                  style={{
                    background: isActivePath('/clerk/reports') || isActivePath('/clerk/dashboard')
                      ? colors.goldGradient
                      : colors.gold05,
                    boxShadow: isActivePath('/clerk/reports') || isActivePath('/clerk/dashboard')
                      ? `0 4px 15px ${colors.gold20}`
                      : `0 2px 8px ${colors.navy05}`
                  }}
                >
                  <span className="relative z-10">Analytics</span>
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full ${
                      showAnalyticsMenu ? 'translate-x-full' : '-translate-x-full'
                    }`}
                  ></div>
                </button>
                
                <CardStackDropdown 
                  items={analyticsItems} 
                  isOpen={showAnalyticsMenu}
                  onClose={() => setShowAnalyticsMenu(false)}
                  title="Judicial Analytics"
                />
              </div>
            </nav>
          </div>

          {/* Center Section - Elegant Search */}
          <div className="flex-1 max-w-xl mx-8" ref={searchRef}>
            <div className="relative">
              <div className="relative">
                <input
                  id="global-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search legal documents, cases, tools..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300 focus:scale-105 font-medium"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderColor: showSearchResults ? colors.gold : colors.gold10,
                    color: colors.navy,
                    boxShadow: `0 2px 12px ${colors.navy05}`
                  }}
                />
                
                <div 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
                  style={{ color: showSearchResults ? colors.gold : colors.gray }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Enhanced Search Results */}
              {showSearchResults && (
                <div 
                  className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden border transform transition-all duration-300"
                  style={{
                    background: colors.cream,
                    borderColor: colors.gold15,
                    boxShadow: `0 20px 40px ${colors.navy10}`
                  }}
                >
                  <div 
                    className="px-6 py-4 border-b"
                    style={{ borderColor: colors.gold10 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm" style={{ color: colors.navy }}>
                        Quick Search
                      </div>
                      <div 
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          background: colors.gold08,
                          color: colors.darkGold
                        }}
                      >
                        {searchResults.length} results
                      </div>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((item, index) => (
                      <SearchResultItem key={item.id} item={item} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Minimal Controls */}
          <div className="flex items-center space-x-3">
            {/* Status Indicator */}
            <div 
              className="flex items-center space-x-2 px-4 py-2 rounded-2xl border transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                borderColor: colors.gold10
              }}
            >
              <div 
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isOnline ? 'bg-green-500' : 'bg-amber-500'
                }`}
              ></div>
              <div className="text-sm font-medium" style={{ color: colors.navy }}>
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-2xl transition-all duration-300 hover:scale-105 border group"
                style={{
                  background: colors.gold05,
                  borderColor: showUserMenu ? colors.gold : colors.gold10
                }}
                aria-label="User menu"
              >
                <div 
                  className="w-8 h-8 rounded-2xl flex items-center justify-center text-white font-bold transition-all duration-300 group-hover:rotate-12"
                  style={{
                    background: colors.goldGradient
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div className="hidden lg:block text-left">
                  <div className="text-sm font-semibold" style={{ color: colors.navy }}>
                    {user?.name || 'Court Clerk'}
                  </div>
                  <div className="text-xs" style={{ color: colors.gray }}>
                    Judicial System
                  </div>
                </div>
              </button>

              {/* Enhanced User Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden border transform transition-all duration-300"
                  style={{
                    background: colors.cream,
                    borderColor: colors.gold15,
                    boxShadow: `0 20px 40px ${colors.navy10}`
                  }}
                >
                  <div 
                    className="p-6 border-b text-center"
                    style={{ borderColor: colors.gold10 }}
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold mx-auto mb-3"
                      style={{
                        background: colors.goldGradient,
                        boxShadow: `0 4px 15px ${colors.gold20}`
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="font-semibold" style={{ color: colors.navy }}>
                      {user?.name || 'Court Clerk'}
                    </div>
                    <div className="text-sm mt-1" style={{ color: colors.gray }}>
                      {user?.email || 'clerk@judiciary.gov'}
                    </div>
                  </div>

                  <div className="p-4">
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 rounded-xl transition-all duration-300 hover:scale-105 text-center font-medium"
                      style={{
                        background: colors.gold08,
                        color: colors.darkGold
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;