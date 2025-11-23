import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiHome,
  FiBook,
  FiFileText,
  FiCalendar,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiBarChart2,
  FiSearch,
  FiStar,
  FiChevronDown,
  FiMenu,
  FiX,
  FiFolder // ✅ ADDED: Icon for My Documents
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Navigation items with icons - ✅ UPDATED: Added My Documents
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/student/dashboard', premium: false },
    { id: 'assignments', label: 'Assignments', icon: FiFileText, path: '/student/assignments', premium: false },
    { id: 'calendar', label: 'Calendar', icon: FiCalendar, path: '/student/calendar', premium: false },
    { id: 'research', label: 'Research', icon: FiSearch, path: '/student/research', premium: false },
    { id: 'mydocuments', label: 'Documents', icon: FiFolder, path: '/student/mydocuments', premium: false } // ✅ NEW
  ];

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
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set active nav item based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => currentPath.startsWith(item.path)) || navItems[0];
    setActiveNavItem(activeItem.id);
  }, [location.pathname]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  const handleNavClick = (item) => {
    setActiveNavItem(item.id);
    navigate(item.path);
    setIsMobileMenuOpen(false);
  };

  const markNotificationAsRead = useCallback((id) => {
    console.log('Marking notification as read:', id);
  }, []);

  // Premium badge component
  const PremiumBadge = () => (
    <div className="ml-auto">
      <FiStar className="w-3 h-3 text-yellow-500" />
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white shadow-lg border border-[rgba(182,157,116,0.3)]"
      >
        {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-60 z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, #f5f5ef 0%, #f8f7f2 50%, #f5f5ef 100%)',
          borderRight: '2px solid rgba(182, 157, 116, 0.3)'
        }}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-[rgba(182,157,116,0.3)]">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
            ⚖️ LawHub
          </h1>
          <p className="text-xs text-[#6b7280] mt-1">Student Portal</p>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-[rgba(182,157,116,0.2)]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#b69d74] to-[#c8b090] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1f2839] truncate">
                {user?.name || 'Student'}
              </p>
              <p className="text-xs text-[#6b7280] truncate">
                {user?.email || 'student@law.edu'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-[#1f2839] hover:bg-[rgba(182,157,116,0.1)]'
                }`}
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, #b69d74, #c8b090)' 
                    : 'transparent'
                }}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.premium && <PremiumBadge />}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-[rgba(182,157,116,0.2)] p-4 space-y-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-[#1f2839] hover:bg-[rgba(182,157,116,0.1)] transition-all duration-300 relative"
            >
              <FiBell className="w-5 h-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-[rgba(182,157,116,0.2)] max-h-80 overflow-y-auto z-[60]">
                <div className="p-3 border-b border-[rgba(31,40,57,0.1)]">
                  <h3 className="font-bold text-sm">Notifications</h3>
                </div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 border-b border-[rgba(31,40,57,0.05)] hover:bg-[rgba(182,157,116,0.05)] cursor-pointer"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <p className="font-semibold text-sm text-[#1f2839]">{notification.title}</p>
                    <p className="text-xs text-[#6b7280] mt-1">{notification.message}</p>
                    <p className="text-xs text-[#b69d74] mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          {/* <button
            onClick={() => navigate('/student/settings')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-[#1f2839] hover:bg-[rgba(182,157,116,0.1)] transition-all duration-300"
          >
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </button> */}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(Navbar);
