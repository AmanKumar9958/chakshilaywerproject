import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FiBell, FiUser, FiLogOut, FiSettings, FiHome, FiBriefcase, FiFileText, FiFolder,
  FiSearch, FiChevronDown, FiMenu, FiX 
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ collapsed, setCollapsed }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isOnline] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Enhanced color palette with gradients
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    gold: '#b69d74',
    gray: '#6b7280',
    green: '#10b981',
    amber: '#f59e0b',
    white: '#ffffff',
    red: '#ef4444',
    gold05: 'rgba(182, 157, 116, 0.05)',
    gold10: 'rgba(182, 157, 116, 0.10)',
    gold15: 'rgba(182, 157, 116, 0.15)',
    gold20: 'rgba(182, 157, 116, 0.20)',
    gold40: 'rgba(182, 157, 116, 0.40)',
    navy05: 'rgba(31, 40, 57, 0.05)',
    navy10: 'rgba(31, 40, 57, 0.10)',
    navy15: 'rgba(31, 40, 57, 0.15)',
    navy25: 'rgba(31, 40, 57, 0.25)',
  };

  // Enhanced shadows and glows
  const shadows = {
    subtle: `0 2px 12px ${colors.navy05}`,
    medium: `0 4px 20px ${colors.navy10}`,
    large: `0 8px 32px ${colors.navy15}`,
    glow: `0 0 20px ${colors.gold20}`,
    intenseGlow: `0 0 30px ${colors.gold40}`,
    floating: `0 12px 40px ${colors.navy25}`,
  };

  // Navigation structure
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/clerk/dashboard' },
    { id: 'cases', label: 'Cases', icon: FiBriefcase, path: '/clerk/cases' },
    { id: 'calendar', label: 'Calendar', icon: FiUser, path: '/clerk/calendar' },
    { id: 'documents', label: 'Documents', icon: FiFolder, path: '/clerk/documents' },
    { id: 'reports', label: 'General Parties', icon: FiFileText, path: '/clerk/reports' }
  ];

  const toolItems = [
    { id: 'help', label: 'Settings', icon: FiSearch, path: '/clerk/help' }
  ];

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Hearing reminder', message: 'Case #C-2023-4582 in 2 hours', time: '10 mins ago', unread: true, priority: 'high' },
    { id: 2, title: 'New document uploaded', message: 'Client uploaded Agreement.pdf', time: '45 mins ago', unread: true, priority: 'medium' },
    { id: 3, title: 'Court date changed', message: 'Smith v. Jones moved to Dec 5', time: '2 hours ago', unread: false, priority: 'low' }
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Active nav state
  // Dropdown closing logic
  useEffect(() => {
    const allItems = [...navItems, ...toolItems];
    const curr = allItems.find(item => location.pathname.startsWith(item.path));
    if (curr) {
      setActiveNavItem(curr.id);
    }
  }, [location.pathname]);
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

  // Logout action
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, navigate]);

  // Navigation click
  const handleNavClick = (item) => {
    setActiveNavItem(item.id);
    setIsMobileMenuOpen(false);
    navigate(item.path);
  };

  // Sidebar Navigation Item Component
  const SidebarNavItem = ({ item }) => {
    const isActive = activeNavItem === item.id;
    
    return (
      <button
        onClick={() => handleNavClick(item)}
        className="w-full flex items-center px-4 py-3 rounded-xl mb-2 transition-all duration-300 relative group"
        style={{
          color: isActive ? colors.white : colors.navy,
          backgroundColor: isActive ? colors.gold : 'transparent',
          boxShadow: isActive ? shadows.glow : 'none',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = colors.gold10;
            e.currentTarget.style.boxShadow = shadows.subtle;
          }
          setHoveredNav(item.id);
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }
          setHoveredNav(null);
        }}
      >
        <item.icon
          className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
          style={{ 
            color: isActive ? colors.white : colors.gold,
            transform: hoveredNav === item.id ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        <span className="ml-3 font-semibold text-sm whitespace-nowrap">
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen z-50 w-64 transition-all duration-300 border-r flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          backgroundColor: colors.cream,
          borderColor: colors.gold15,
          boxShadow: shadows.medium,
        }}
      >
        {/* Logo Section */}
        <div
          className="flex items-center justify-between border-b p-4"
          style={{ borderColor: colors.gold15 }}
        >
          <div className="flex items-center group cursor-pointer">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, #9c835a)`,
                boxShadow: `0 4px 15px ${colors.gold20}`
              }}
            >
              <span className="text-white font-bold">⚖️</span>
            </div>
            
            <div className="ml-3">
              <h1 className="text-base font-bold" style={{ color: colors.navy }}>
                Chakshi Legal
              </h1>
              <p className="text-xs" style={{ color: colors.gray }}>
                Court Clerk System
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div
          className="p-4 border-b"
          style={{ borderColor: colors.gold15 }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, #9c835a)`,
                  boxShadow: `0 4px 15px ${colors.gold20}`
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: colors.green,
                  borderColor: colors.white,
                  boxShadow: isOnline ? `0 0 8px ${colors.green}` : 'none'
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: colors.navy }}>
                {user?.name || 'User'}
              </p>
              <p className="text-xs truncate" style={{ color: colors.gray }}>
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          {/* Main Navigation */}
          <div className="mb-6">
            <p
              className="px-4 mb-3 text-xs font-bold uppercase tracking-wider"
              style={{ color: colors.gray }}
            >
              Main Menu
            </p>
            {navItems.map(item => (
              <SidebarNavItem key={item.id} item={item} />
            ))}
          </div>

          {/* Divider */}
          <div
            className="my-4 border-t"
            style={{ borderColor: colors.gold15 }}
          />

          {/* Settings Section */}
          <div>
            {/* <p
              className="px-4 mb-3 text-xs font-bold uppercase tracking-wider"
              style={{ color: colors.gray }}
            >
              Settings
            </p> */}
            {toolItems.map(item => (
              <SidebarNavItem key={item.id} item={item} />
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div
          className="border-t p-3"
          style={{ borderColor: colors.gold15 }}
        >
          {/* Online Status */}
          {/* <div
            className="flex items-center mb-3 px-3 py-2 rounded-lg"
            style={{ backgroundColor: colors.gold05 }}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isOnline ? 'animate-pulse' : ''}`}
              style={{
                backgroundColor: isOnline ? colors.green : colors.gray,
                boxShadow: isOnline ? `0 0 8px ${colors.green}` : 'none'
              }}
            />
            <span
              className="ml-2 text-xs font-semibold"
              style={{ color: isOnline ? colors.green : colors.gray }}
            >
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div> */}

          {/* Notifications */}
          <div className="relative mb-3" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center p-3 rounded-xl transition-all duration-300 hover:scale-105 border-2"
              style={{
                color: colors.navy,
                borderColor: showNotifications ? colors.gold : colors.gold10,
                backgroundColor: showNotifications ? colors.gold05 : 'transparent'
              }}
            >
              <div className="relative flex-shrink-0">
                <FiBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundColor: colors.amber,
                      fontSize: '10px'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="ml-3 font-semibold text-sm">Notifications</span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className="absolute bottom-full mb-2 left-0 w-80 bg-white rounded-2xl transition-all duration-300"
                style={{
                  border: `2px solid ${colors.gold20}`,
                  boxShadow: shadows.floating,
                  background: `linear-gradient(145deg, ${colors.white} 0%, ${colors.cream} 100%)`,
                }}
              >
                <div
                  className="px-5 py-4 border-b rounded-t-2xl"
                  style={{
                    borderColor: colors.gold15,
                    background: `linear-gradient(135deg, ${colors.gold05}, ${colors.gold15})`
                  }}
                >
                  <h3 className="font-bold text-base" style={{ color: colors.navy }}>
                    Notifications
                  </h3>
                  <p className="text-xs mt-1 font-medium" style={{ color: colors.gray }}>
                    {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="p-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] mb-2 border-2 cursor-pointer"
                      style={{
                        backgroundColor: notif.unread ? colors.gold05 : 'transparent',
                        borderColor: notif.unread ? colors.gold20 : colors.gold10,
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${notif.unread ? 'animate-pulse' : ''}`}
                          style={{
                            backgroundColor: notif.unread ? colors.amber : colors.gray,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" style={{ color: colors.navy }}>
                            {notif.title}
                          </p>
                          <p className="text-xs mt-1" style={{ color: colors.gray }}>
                            {notif.message}
                          </p>
                          <p className="text-xs mt-1 font-medium" style={{ color: colors.gold }}>
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative mb-3" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center p-3 rounded-xl transition-all duration-300 hover:scale-105 border-2"
              style={{
                borderColor: showUserMenu ? colors.gold : colors.gold10,
                color: colors.navy,
                backgroundColor: showUserMenu ? colors.gold10 : 'transparent',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, #9c835a)`,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="ml-3 text-left flex-1">
                <p className="text-sm font-bold" style={{ color: colors.navy }}>
                  {user?.name?.split(' ')[0] || 'User'}
                </p>
                <p className="text-xs font-medium" style={{ color: colors.gray }}>
                  {user?.role || 'Court Clerk'}
                </p>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div
                className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-2xl"
                style={{
                  border: `2px solid ${colors.gold20}`,
                  boxShadow: shadows.floating,
                  background: `linear-gradient(145deg, ${colors.white} 0%, ${colors.cream} 100%)`,
                }}
              >
                <div
                  className="px-5 py-4 border-b rounded-t-2xl"
                  style={{
                    borderColor: colors.gold15,
                    background: `linear-gradient(135deg, ${colors.gold05}, ${colors.gold15})`
                  }}
                >
                  <h3 className="font-bold text-base" style={{ color: colors.navy }}>
                    Account Menu
                  </h3>
                </div>

                <div className="p-3">
                  <button
                    className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] mb-2 border-2"
                    style={{
                      color: colors.navy,
                      borderColor: colors.gold10,
                    }}
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/clerk/settings');
                    }}
                  >
                    <FiSettings className="w-5 h-5 mr-3" style={{ color: colors.gold }} />
                    <span className="text-sm font-semibold">Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] border-2"
                    style={{
                      color: colors.red,
                      borderColor: '#fee2e2',
                    }}
                  >
                    <FiLogOut className="w-5 h-5 mr-3" />
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg border-2 transition-all duration-300"
        style={{
          backgroundColor: colors.white,
          borderColor: colors.gold20,
          boxShadow: shadows.medium
        }}
      >
        {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Custom Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.gold05};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.gold};
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9c835a;
        }

        /* Focus styles for accessibility */
        button:focus-visible {
          outline: 2px solid ${colors.gold};
          outline-offset: 2px;
        }
      `}</style>

      {/* Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{ boxShadow: shadows.floating }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.gold }} />
            <p className="font-semibold" style={{ color: colors.navy }}>Signing out...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;