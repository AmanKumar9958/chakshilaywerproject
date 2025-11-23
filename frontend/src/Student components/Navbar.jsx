import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FiBell, 
  FiSearch, 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiHelpCircle,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCommand,
  FiHome,
  FiBook,
  FiFileText,
  FiCalendar,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiBarChart2,
  FiPlay,
  FiStar,
  FiZap,
  FiMenu
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../../src/Student components/Navbar';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [expandedGroups, setExpandedGroups] = useState(['main']);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const sidebarRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: 'Assignment Due Soon',
      message: 'Contract Law Assignment due in 2 days',
      time: '2 hours ago',
      unread: true,
      priority: 'high'
    },
    {
      id: 2,
      title: 'New Course Material',
      message: 'Criminal Law lecture notes uploaded',
      time: '4 hours ago',
      unread: true,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Exam Schedule',
      message: 'Mid-term exams start next week',
      time: '1 day ago',
      unread: false,
      priority: 'low'
    }
  ];

  const searchSuggestions = [
    { icon: '📚', text: 'Constitutional Law', type: 'course', trending: true },
    { icon: '📝', text: 'Contract Analysis', type: 'assignment', trending: false },
    { icon: '👥', text: 'Study Groups', type: 'group', trending: true },
    { icon: '📅', text: 'Upcoming Exams', type: 'calendar', trending: false },
    { icon: '📊', text: 'Performance Analytics', type: 'analytics', trending: true }
  ];

  // Navigation items grouped by category
  const navGroups = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/student/dashboard', premium: false },
        { id: 'courses', label: 'Courses', icon: FiBook, path: '/student/courses', premium: true },
        { id: 'assignments', label: 'Assignments', icon: FiFileText, path: '/student/assignments', premium: false },
        { id: 'calendar', label: 'Calendar', icon: FiCalendar, path: '/student/calendar', premium: false }
      ]
    },
    {
      id: 'learning',
      label: 'Learning',
      items: [
        { id: 'examprep', label: 'Exam Prep', icon: FiBookOpen, path: '/student/examprep', premium: true },
        { id: 'library', label: 'Library', icon: FiAward, path: '/student/library', premium: false },
        { id: 'research', label: 'Research', icon: FiSearch, path: '/student/research', premium: false }
      ]
    },
    {
      id: 'career',
      label: 'Career & Growth',
      items: [
        { id: 'career', label: 'Career', icon: FiBriefcase, path: '/student/career', premium: true },
        { id: 'analytics', label: 'Analytics', icon: FiBarChart2, path: '/student/analytics', premium: false }
      ]
    }
  ];

  // Responsive: close sidebar on mobile when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Responsive: check window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set active nav item based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    navGroups.forEach(group => {
      const activeItem = group.items.find(item => currentPath.startsWith(item.path));
      if (activeItem) {
        setActiveNavItem(activeItem.id);
        setExpandedGroups(prev => [...new Set([...prev, group.id])]);
      }
    });
  }, [location.pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
        setIsSearchFocused(true);
        setShowSearchSuggestions(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowSearchSuggestions(false);
        setIsSearchFocused(false);
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setShowSearchSuggestions(false);
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNavClick = (item) => {
    console.log('🔍 Student Nav Click:', { itemId: item.id, path: item.path, currentLocation: location.pathname });
    setActiveNavItem(item.id);
    navigate(item.path);
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const markNotificationAsRead = useCallback((id) => {
    console.log('Marking notification as read:', id);
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    console.log('Marking all notifications as read');
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Premium badge component
  const PremiumBadge = () => (
    <div className="absolute -top-1 -right-1">
      <div className="relative">
        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-ping"></div>
      </div>
    </div>
  );

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl bg-white shadow-lg border border-[rgba(182,157,116,0.3)] hover:bg-gradient-to-r hover:from-[#b69d74] hover:to-[#c8b090] hover:text-white transition-all duration-300"
      >
        {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#f5f5ef] via-[#f8f7f2] to-[#f5f5ef] border-r border-[rgba(182,157,116,0.3)] z-50 transition-all duration-300 flex flex-col ${sidebarWidth} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Animated border gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#b69d74] to-transparent opacity-50"></div>

        {/* Header Section */}
        <div className="flex-shrink-0 p-4 border-b border-[rgba(182,157,116,0.3)]">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#b69d74] via-[#c8b090] to-[#b69d74] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">⚖️</span>
                </div>
                <div>
                  <h1 className="font-bold text-[#1f2839] text-lg">Law Portal</h1>
                  <p className="text-xs text-[#6b7280]">Student Dashboard</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-[#b69d74] via-[#c8b090] to-[#b69d74] rounded-xl flex items-center justify-center shadow-lg mx-auto">
                <span className="text-white font-bold text-lg">⚖️</span>
              </div>
            )}
            
            {/* Collapse Toggle - Desktop Only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-[rgba(182,157,116,0.1)] transition-all duration-300 group"
            >
              {isCollapsed ? (
                <FiChevronRight className="w-4 h-4 text-[#b69d74] group-hover:scale-110 transition-transform" />
              ) : (
                <FiChevronLeft className="w-4 h-4 text-[#b69d74] group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          {!isCollapsed && (
            <div className="mt-4 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="text"
                    placeholder="Search... (⌘K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setShowSearchSuggestions(true);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(182,157,116,0.2)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <FiX className="w-4 h-4 text-[#6b7280] hover:text-[#1f2839]" />
                    </button>
                  )}
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-[rgba(182,157,116,0.2)] z-[60] max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {searchSuggestions
                      .filter(s => s.text.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(suggestion.text);
                            setShowSearchSuggestions(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm hover:bg-gradient-to-r hover:from-[rgba(182,157,116,0.05)] hover:to-[rgba(200,176,144,0.08)] rounded-lg transition-all duration-300"
                        >
                          <span className="text-lg">{suggestion.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="text-[#1f2839] font-medium">{suggestion.text}</p>
                            <p className="text-xs text-[#6b7280]">{suggestion.type}</p>
                          </div>
                          {suggestion.trending && (
                            <FiZap className="w-3 h-3 text-[#b69d74]" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collapsed Search Icon */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="mt-4 w-full p-2.5 rounded-xl hover:bg-[rgba(182,157,116,0.1)] transition-all duration-300 flex items-center justify-center group"
            >
              <FiSearch className="w-5 h-5 text-[#b69d74] group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.id}>
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider hover:text-[#b69d74] transition-colors duration-300"
                >
                  <span>{group.label}</span>
                  <FiChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                    expandedGroups.includes(group.id) ? 'rotate-180' : ''
                  }`} />
                </button>
              )}
              
              {(expandedGroups.includes(group.id) || isCollapsed) && (
                <div className="space-y-1 mt-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNavItem === item.id;
                    
                    return (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => handleNavClick(item)}
                          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            isActive 
                              ? 'text-white shadow-lg transform scale-[1.02]' 
                              : 'text-[#1f2839] hover:transform hover:scale-[1.02]'
                          }`}
                          title={isCollapsed ? item.label : ''}
                        >
                          {/* Animated background */}
                          <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-br from-[#b69d74] via-[#c8b090] to-[#b69d74] shadow-lg shadow-[#b69d74]/30'
                              : 'bg-transparent group-hover:bg-gradient-to-br group-hover:from-[rgba(182,157,116,0.1)] group-hover:via-[rgba(200,176,144,0.15)] group-hover:to-[rgba(182,157,116,0.1)]'
                          }`}></div>
                          
                          {/* Glow effect */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#b69d74] to-transparent opacity-20 blur-sm"></div>
                          )}
                          
                          <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0 relative z-10 transition-transform duration-300 ${
                            isActive ? 'transform scale-110' : 'group-hover:transform group-hover:scale-110'
                          }`} />
                          
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left whitespace-nowrap relative z-10">{item.label}</span>
                              {item.premium && <FiStar className="w-3 h-3 text-yellow-500 flex-shrink-0 relative z-10" />}
                            </>
                          )}
                          
                          {item.premium && isCollapsed && <PremiumBadge />}
                        </button>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-[#1f2839] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[60] pointer-events-none">
                            {item.label}
                            {item.premium && <FiStar className="inline-block w-3 h-3 text-yellow-500 ml-2" />}
                            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-[#1f2839]"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section - User & Actions */}
        <div className="flex-shrink-0 border-t border-[rgba(182,157,116,0.3)] p-3 space-y-2">
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl hover:bg-[rgba(182,157,116,0.1)] transition-all duration-300 group`}
              title={isCollapsed ? 'Notifications' : ''}
            >
              <div className="relative">
                <FiBell className="w-5 h-5 text-[#1f2839] group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#10b981] to-emerald-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[10px] animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <span className="flex-1 text-left text-sm font-medium text-[#1f2839]">Notifications</span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'left-0'} bottom-full mb-2 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[rgba(182,157,116,0.2)] z-[80]`}>
                <div className="p-4 border-b border-[rgba(31,40,57,0.1)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#1f2839] text-lg">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-sm bg-gradient-to-r from-[#b69d74] to-[#c8b090] text-white px-3 py-1 rounded-lg font-medium transition-all duration-300 hover:transform hover:scale-105"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-[rgba(31,40,57,0.05)] last:border-b-0 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[rgba(182,157,116,0.05)] hover:to-[rgba(200,176,144,0.08)] ${
                          notification.unread ? 'bg-[rgba(182,157,116,0.08)]' : ''
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold text-[#1f2839] text-sm">{notification.title}</p>
                              {notification.priority === 'high' && (
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                              )}
                            </div>
                            <p className="text-[#6b7280] text-sm mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-[#b69d74] text-xs font-medium">{notification.time}</p>
                              {notification.unread && (
                                <span className="text-xs bg-gradient-to-r from-[#b69d74] to-[#c8b090] text-white px-2 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <FiBell className="w-12 h-12 text-[#6b7280] mx-auto mb-3" />
                      <p className="text-[#6b7280] text-sm">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          {!isCollapsed && (
            <button
              onClick={() => navigate('/student/settings')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(182,157,116,0.1)] transition-all duration-300 group"
            >
              <FiSettings className="w-5 h-5 text-[#1f2839] group-hover:scale-110 transition-transform" />
              <span className="flex-1 text-left text-sm font-medium text-[#1f2839]">Settings</span>
            </button>
          )}

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-xl hover:bg-[rgba(182,157,116,0.1)] transition-all duration-300 group`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#b69d74] via-[#c8b090] to-[#b69d74] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-[#1f2839] truncate">
                    {user?.name || user?.email?.split('@')[0] || 'Student'}
                  </p>
                  <p className="text-xs text-[#6b7280] truncate">Law Student</p>
                </div>
              )}
              {!isCollapsed && (
                <FiChevronDown className={`w-4 h-4 text-[#6b7280] transition-transform duration-300 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              )}
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'left-0'} bottom-full mb-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[rgba(182,157,116,0.2)] z-[70]`}>
                <div className="p-4 border-b border-[rgba(31,40,57,0.1)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#b69d74] via-[#c8b090] to-[#b69d74] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1f2839] text-sm truncate">
                        {user?.name || user?.email?.split('@')[0] || 'Student'}
                      </p>
                      <p className="text-[#6b7280] text-xs truncate">{user?.email || 'student@law.edu'}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate('/student/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 text-sm text-[#1f2839] hover:bg-gradient-to-r hover:from-[rgba(182,157,116,0.05)] hover:to-[rgba(200,176,144,0.08)] rounded-xl transition-all duration-300"
                  >
                    <FiUser className="w-4 h-4 text-[#b69d74]" />
                    <span className="font-medium">Profile</span>
                  </button>
                </div>
                <div className="p-2 border-t border-[rgba(31,40,57,0.1)]">
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(182, 157, 116, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(182, 157, 116, 0.5);
        }
      `}</style>
    </>
  );
};

export default React.memo(Navbar);
