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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const caseManagementRef = useRef(null);
  const toolsRef = useRef(null);
  const analyticsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Color palette from Hero component
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    gold: '#b69d74',
    gray: '#6b7280',
    green: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    gold05: 'rgba(182, 157, 116, 0.05)',
    gold10: 'rgba(182, 157, 116, 0.10)',
    gold15: 'rgba(182, 157, 116, 0.15)',
    gold20: 'rgba(182, 157, 116, 0.20)',
    navy05: 'rgba(31, 40, 57, 0.05)',
    navy10: 'rgba(31, 40, 57, 0.10)',
    navy15: 'rgba(31, 40, 57, 0.15)',
  };

  // Mock notifications
  const mockNotifications = [
    { id: 1, text: 'Hearing reminder for Case #C-2023-4582', time: '10 mins ago', read: false },
    { id: 2, text: 'New document uploaded by client', time: '45 mins ago', read: false },
    { id: 3, text: 'Court date changed for Smith v. Jones', time: '2 hours ago', read: true }
  ];

  // Search data
  const searchableItems = [
    { id: 1, title: 'Dashboard', type: 'dashboard', url: '/clerk/dashboard', category: 'Analytics' },
    { id: 2, title: 'Case Management', type: 'module', url: '/clerk/cases', category: 'Cases' },
    { id: 3, title: 'Court Calendar', type: 'scheduling', url: '/clerk/calendar', category: 'Cases' },
    { id: 4, title: 'Document Manager', type: 'documents', url: '/clerk/documents', category: 'Cases' },
    { id: 5, title: 'SMS Logs', type: 'communication', url: '/clerk/sms-log', category: 'Tools' },
    { id: 6, title: 'Quick Actions', type: 'actions', url: '/clerk/quick-actions', category: 'Tools' },
    { id: 7, title: 'Fraud Detection', type: 'security', url: '/clerk/fraud-detection', category: 'Analytics' },
    { id: 8, title: 'Reports', type: 'reports', url: '/clerk/reports', category: 'Analytics' },
    { id: 9, title: 'Integrations', type: 'integrations', url: '/clerk/integrations', category: 'Tools' },
    { id: 10, title: 'Settings', type: 'settings', url: '/clerk/settings', category: 'System' },
  ];

  // Navigation items
  const caseManagementItems = [
    { 
      name: 'All Cases', 
      path: '/clerk/cases', 
      description: 'Manage complete case portfolio',
      count: '12 Active'
    },
    { 
      name: 'Court Calendar', 
      path: '/clerk/calendar', 
      description: 'Judicial schedules & hearings',
      count: '3 Today'
    },
    { 
      name: 'Documents', 
      path: '/clerk/documents', 
      description: 'Secure document repository',
      count: '48 Files'
    }
  ];

  const toolsItems = [
    { 
      name: 'Quick Actions', 
      path: '/clerk/quick-actions', 
      description: 'Frequent legal operations',
      badge: 'Fast'
    },
    { 
      name: 'SMS Logs', 
      path: '/clerk/sms-log', 
      description: 'Client & court messaging',
      count: '12 New'
    },
    { 
      name: 'Integrations', 
      path: '/clerk/integrations', 
      description: 'Third-party legal services'
    }
  ];

  const analyticsItems = [
    { 
      name: 'Dashboard', 
      path: '/clerk/dashboard', 
      description: 'Performance overview',
      badge: 'Live'
    },
    { 
      name: 'Fraud Detection', 
      path: '/clerk/fraud-detection', 
      description: 'AI-powered security analysis',
      badge: 'AI'
    },
    { 
      name: 'Reports', 
      path: '/clerk/reports', 
      description: 'Case analytics & insights',
      badge: 'Data'
    }
  ];

  // Effects
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, [mockNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = [
        { ref: searchRef, setter: setShowSearchResults },
        { ref: notificationRef, setter: setShowNotifications },
        { ref: userMenuRef, setter: setShowUserMenu },
        { ref: caseManagementRef, setter: setShowCaseManagementMenu },
        { ref: toolsRef, setter: setShowToolsMenu },
        { ref: analyticsRef, setter: setShowAnalyticsMenu },
        { ref: mobileMenuRef, setter: setMobileMenuOpen }
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Clean Professional Dropdown Component
  const ProfessionalDropdown = ({ items, isOpen, onClose, title }) => (
    <div 
      className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border transition-all duration-300 transform ${
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`}
      style={{
        borderColor: colors.gold20,
        boxShadow: `0 20px 40px ${colors.navy10}`
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: colors.gold10 }}>
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{items.length} specialized tools</p>
      </div>
      
      {/* Items */}
      <div className="p-2">
        {items.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 group border ${
              isActivePath(item.path) 
                ? 'border-blue-200 bg-blue-50' 
                : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium text-sm ${
                  isActivePath(item.path) ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {item.name}
                </span>
                {(item.count || item.badge) && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.badge 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.count || item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 ${
              isActivePath(item.path) ? 'text-blue-500' : 'text-gray-400'
            }`}>
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  // Navigation Button Component
  const NavButton = ({ item, mobile = false }) => (
    <button
      onClick={() => mobile ? (navigate(item.path), setMobileMenuOpen(false)) : navigate(item.path)}
      className={`transition-all duration-200 ${
        mobile 
          ? 'w-full px-4 py-3 rounded-lg text-left border backdrop-blur-sm' 
          : 'px-3 py-2 rounded-md text-sm font-medium border border-transparent'
      }`}
      style={{
        color: isActivePath(item.path) ? colors.gold : colors.navy,
        backgroundColor: isActivePath(item.path) ? colors.gold10 : 'transparent',
        borderColor: mobile ? colors.gold10 : 'transparent',
        fontWeight: isActivePath(item.path) ? '600' : '500',
      }}
      onMouseEnter={(e) => {
        if (!mobile && !isActivePath(item.path)) {
          e.target.style.backgroundColor = colors.gold05;
          e.target.style.borderColor = colors.gold10;
        }
      }}
      onMouseLeave={(e) => {
        if (!mobile && !isActivePath(item.path)) {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.borderColor = 'transparent';
        }
      }}
    >
      <span>{item.name}</span>
    </button>
  );

  return (
    <>
      <nav 
        className="sticky top-0 z-50 border-b backdrop-blur-sm"
        style={{ 
          backgroundColor: colors.cream,
          borderColor: colors.gold10,
          boxShadow: isScrolled ? `0 4px 20px ${colors.navy05}` : 'none'
        }}
      >
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Brand */}
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/clerk/dashboard')}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, #9c835a)`
                }}
              >
                <span className="text-white font-bold text-sm">CL</span>
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: colors.navy }}>
                  Chakshi Legal
                </h1>
                <p className="text-xs" style={{ color: colors.gray }}>
                  Court Clerk System
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1">
              {/* Dashboard - Direct Link */}
              <NavButton item={{ name: 'Dashboard', path: '/clerk/dashboard' }} />

              {/* Case Management */}
              <div className="relative" ref={caseManagementRef}>
                <button
                  onClick={() => setShowCaseManagementMenu(!showCaseManagementMenu)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium border border-transparent transition-all duration-200 ${
                    isActivePath('/clerk/cases') || isActivePath('/clerk/calendar') || isActivePath('/clerk/documents')
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                  style={{
                    background: isActivePath('/clerk/cases') || isActivePath('/clerk/calendar') || isActivePath('/clerk/documents')
                      ? `linear-gradient(135deg, ${colors.gold}, #9c835a)`
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/clerk/cases') && !isActivePath('/clerk/calendar') && !isActivePath('/clerk/documents')) {
                      e.target.style.backgroundColor = colors.gold05;
                      e.target.style.borderColor = colors.gold10;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/clerk/cases') && !isActivePath('/clerk/calendar') && !isActivePath('/clerk/documents')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'transparent';
                    }
                  }}
                >
                  Case Management
                  <svg className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                    showCaseManagementMenu ? 'rotate-180' : ''
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ProfessionalDropdown 
                  items={caseManagementItems}
                  isOpen={showCaseManagementMenu}
                  onClose={() => setShowCaseManagementMenu(false)}
                  title="Case Management"
                />
              </div>

              {/* Legal Tools */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => setShowToolsMenu(!showToolsMenu)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium border border-transparent transition-all duration-200 ${
                    isActivePath('/clerk/quick-actions') || isActivePath('/clerk/sms-log') || isActivePath('/clerk/integrations')
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                  style={{
                    background: isActivePath('/clerk/quick-actions') || isActivePath('/clerk/sms-log') || isActivePath('/clerk/integrations')
                      ? `linear-gradient(135deg, ${colors.gold}, #9c835a)`
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/clerk/quick-actions') && !isActivePath('/clerk/sms-log') && !isActivePath('/clerk/integrations')) {
                      e.target.style.backgroundColor = colors.gold05;
                      e.target.style.borderColor = colors.gold10;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/clerk/quick-actions') && !isActivePath('/clerk/sms-log') && !isActivePath('/clerk/integrations')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'transparent';
                    }
                  }}
                >
                  Legal Tools
                  <svg className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                    showToolsMenu ? 'rotate-180' : ''
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ProfessionalDropdown 
                  items={toolsItems}
                  isOpen={showToolsMenu}
                  onClose={() => setShowToolsMenu(false)}
                  title="Legal Tools"
                />
              </div>

              {/* Analytics */}
              <div className="relative" ref={analyticsRef}>
                <button
                  onClick={() => setShowAnalyticsMenu(!showAnalyticsMenu)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium border border-transparent transition-all duration-200 ${
                    isActivePath('/clerk/fraud-detection') || isActivePath('/clerk/reports')
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                  style={{
                    background: isActivePath('/clerk/fraud-detection') || isActivePath('/clerk/reports')
                      ? `linear-gradient(135deg, ${colors.gold}, #9c835a)`
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/clerk/fraud-detection') && !isActivePath('/clerk/reports')) {
                      e.target.style.backgroundColor = colors.gold05;
                      e.target.style.borderColor = colors.gold10;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/clerk/fraud-detection') && !isActivePath('/clerk/reports')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'transparent';
                    }
                  }}
                >
                  Analytics
                  <svg className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                    showAnalyticsMenu ? 'rotate-180' : ''
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ProfessionalDropdown 
                  items={analyticsItems}
                  isOpen={showAnalyticsMenu}
                  onClose={() => setShowAnalyticsMenu(false)}
                  title="Analytics"
                />
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-xl mx-8" ref={searchRef}>
            <div className="relative">
              <div className="relative">
                <input
                  id="global-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search cases, documents, tools..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-[#b69d74] focus:border-transparent"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderColor: showSearchResults ? colors.gold : colors.gray,
                    color: colors.navy
                  }}
                />
                
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Search Results */}
              {showSearchResults && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-xl border max-h-80 overflow-y-auto">
                  <div className="p-3 border-b">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900">Search Results</span>
                      <span className="text-xs text-gray-500">{searchResults.length} found</span>
                    </div>
                  </div>
                  <div className="py-1">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSearchNavigation(item)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#b69d74] flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">{item.title}</div>
                          <div className="text-xs text-gray-500 flex items-center space-x-2">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span className="capitalize">{item.type}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button 
              className="xl:hidden p-2 rounded-md transition-colors text-sm font-medium border border-transparent"
              style={{ color: colors.navy }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.gold05;
                e.target.style.borderColor = colors.gold10;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'transparent';
              }}
            >
              Menu
            </button>

            {/* Status */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full" style={{ backgroundColor: colors.gold05 }}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <span className="text-sm" style={{ color: colors.navy }}>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative p-2 rounded-md transition-colors text-sm font-medium border border-transparent"
                style={{ color: colors.navy }}
                onClick={() => setShowNotifications(!showNotifications)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.gold05;
                  e.target.style.borderColor = colors.gold10;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'transparent';
                }}
              >
                Notifications
                {unreadCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: colors.amber }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 border rounded-lg shadow-lg z-40 bg-white">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                      <span className="text-xs text-gray-500">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map(notification => (
                      <div 
                        key={notification.id}
                        className="p-4 border-b cursor-pointer transition-colors"
                        style={{
                          borderColor: colors.gold10,
                          backgroundColor: notification.read ? 'transparent' : colors.gold05
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.gold05;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = notification.read ? 'transparent' : colors.gold05;
                        }}
                      >
                        <p className="text-sm mb-1 font-medium text-gray-900">
                          {notification.text}
                        </p>
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={userMenuRef}>
              <button 
                className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors border"
                style={{
                  borderColor: colors.gold10,
                  color: colors.navy
                }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.gold05;
                  e.target.style.borderColor = colors.gold;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = colors.gold10;
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gold}, #9c835a)`
                  }}
                >
                  {user ? user.name?.charAt(0) || user.email?.charAt(0) : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold" style={{ color: colors.navy }}>
                    {user ? user.name?.split(' ')[0] : 'User'}
                  </p>
                  <p className="text-xs" style={{ color: colors.gray }}>
                    {user?.role || 'Court Clerk'}
                  </p>
                </div>
                <span 
                  className={`text-xs transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  style={{ color: colors.gold }}
                >
                  ▼
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 border rounded-lg shadow-lg z-40 bg-white">
                  <div className="p-4 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs truncate text-gray-600">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <button 
                      onClick={() => navigate('/clerk/settings')}
                      className="flex items-center w-full px-4 py-2 text-sm transition-colors text-left hover:bg-gray-100"
                      style={{ color: colors.navy }}
                    >
                      Settings
                    </button>
                    <button 
                      onClick={() => navigate('/clerk/help')}
                      className="flex items-center w-full px-4 py-2 text-sm transition-colors text-left hover:bg-gray-100"
                      style={{ color: colors.navy }}
                    >
                      Help & Support
                    </button>
                  </div>

                  <div className="border-t py-2">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm transition-colors text-left hover:bg-red-50"
                      style={{ color: colors.amber }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="xl:hidden absolute top-16 left-0 right-0 z-40 border-b shadow-lg bg-white"
          style={{
            borderColor: colors.gold10,
          }}
        >
          <div className="px-6 py-4 space-y-1">
            {/* Core Navigation */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                Core
              </h3>
              <div className="space-y-1">
                <NavButton item={{ name: 'Dashboard', path: '/clerk/dashboard' }} mobile />
                {caseManagementItems.map(item => (
                  <NavButton key={item.path} item={item} mobile />
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                Tools
              </h3>
              <div className="space-y-1">
                {toolsItems.map(item => (
                  <NavButton key={item.path} item={item} mobile />
                ))}
              </div>
            </div>

            {/* Analytics */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
                Analytics
              </h3>
              <div className="space-y-1">
                {analyticsItems.map(item => (
                  <NavButton key={item.path} item={item} mobile />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;