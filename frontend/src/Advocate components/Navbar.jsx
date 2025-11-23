import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const Navbar = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Removed unused toolsExpanded state since Tools section is always expanded
  
  const notifications = [
    { id: 1, text: 'Hearing reminder for Case #C-2023-4582', time: '10 mins ago', read: false },
    { id: 2, text: 'New document uploaded by client', time: '45 mins ago', read: false },
    { id: 3, text: 'Court date changed for Smith v. Jones', time: '2 hours ago', read: true }
  ];
  
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  const colors = {
    background: '#f5f5ef',
    textPrimary: '#1f2839',
    textSecondary: '#6b7280',
    accent: '#b69d74',
    border: 'rgba(31, 40, 57, 0.15)',
    hover: 'rgba(182, 157, 116, 0.08)',
    active: 'rgba(182, 157, 116, 0.12)',
    shadow: '0 1px 3px 0 rgba(31, 40, 57, 0.1), 0 1px 2px 0 rgba(31, 40, 57, 0.06)',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    cardBackground: 'rgba(255, 255, 255, 0.03)',
  };

  const navItems = {
    core: [
      { name: 'Dashboard', path: '/advocate/dashboard', icon: '📊' },
      { name: 'Cases', path: '/advocate/cases', icon: '⚖️' },
      { name: 'Clients', path: '/advocate/clients', icon: '👥' },
      { name: 'Documents', path: '/advocate/documents', icon: '📄' },
    ],
    tools: [
      { name: 'Contract Analysis', path: '/advocate/contractcomparison', icon: '📑' },
      { name: 'Research', path: '/advocate/research', icon: '🔍' },
      { name: 'Simulation', path: '/advocate/simulation', icon: '⚙️' },
    ],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      [searchRef, notificationsRef, profileRef].forEach(ref => {
        if (ref.current && !ref.current.contains(event.target)) {
          if (ref === searchRef) setSearchOpen(false);
          if (ref === notificationsRef) setNotificationsOpen(false);
          if (ref === profileRef) setProfileOpen(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAllContent = useCallback((query) => {
    if (!query.trim()) return [];
    
    const mockData = [
      { title: 'Smith v. Jones Corporation', category: 'Case', id: 'C-2023-001' },
      { title: 'John Smith', category: 'Client', id: 'CL-001' },
      { title: 'Contract Agreement.pdf', category: 'Document', id: 'DOC-001' }
    ];

    return mockData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      const results = searchAllContent(query);
      setSearchResults(results);
      setSearchOpen(true);
    } else {
      setSearchResults([]);
      setSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      navigate('/advocate/search', { state: { query: searchQuery } });
      setSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    setIsLoggingOut(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      logout();
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <button
        onClick={() => navigate(item.path)}
        className="w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg transition-all duration-200"
        style={{
          color: isActive ? colors.accent : colors.textPrimary,
          backgroundColor: isActive ? colors.active : 'transparent',
          borderLeft: isActive ? `3px solid ${colors.accent}` : '3px solid transparent',
          fontWeight: isActive ? '600' : '500',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = colors.hover;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <span className="text-xl">{item.icon}</span>
        <span className="text-sm">{item.name}</span>
      </button>
    );
  };

  return (
    <>
      {isLoggingOut && <LoadingOverlay message="Signing out..." />}
      
      {/* Fixed Sidebar - Properly positioned with exact dimensions */}
      <aside 
        style={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          width: '288px', // Matches ml-72 (72 * 4px = 288px)
          height: '100vh',
          backgroundColor: colors.background,
          borderRight: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
          zIndex: 1000,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo Header */}
        <div className="p-4 border-b" style={{ borderColor: colors.border, flexShrink: 0 }}>
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/advocate/dashboard')}
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}DD)`
              }}
            >
              <span className="text-white font-bold">CL</span>
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                Chakshi Legal
              </h1>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Professional Suite
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b" style={{ borderColor: colors.border, flexShrink: 0 }} ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 transition-all"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {searchOpen && searchResults.length > 0 && (
            <div 
              className="absolute mt-1 w-64 border rounded-lg shadow-lg z-50"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                boxShadow: `0 10px 25px ${colors.textPrimary}15`,
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              <div className="py-2">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer transition-colors"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => {
                      navigate(`/advocate/${result.category.toLowerCase()}s/${result.id}`);
                      setSearchOpen(false);
                    }}
                  >
                    <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                      {result.title}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {result.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items - Scrollable Middle Section */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6" style={{ minHeight: 0 }}>
          {/* Core Section */}
          <div>
            <h3 
              className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.textSecondary }}
            >
              Core
            </h3>
            <div className="space-y-1">
              {navItems.core.map(item => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>

          {/* Tools Section - Always Expanded */}
          <div>
            <h3 
              className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.textSecondary }}
            >
              Tools
            </h3>
            <div className="space-y-1">
              {navItems.tools.map(item => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 
              className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.textSecondary }}
            >
              Settings
            </h3>
            <NavItem item={{ name: 'Settings', path: '/advocate/settings', icon: '⚙️' }} />
          </div>
        </div>

        {/* Bottom Section - Notifications & Profile */}
        <div className="border-t p-3 space-y-2" style={{ borderColor: colors.border, flexShrink: 0 }}>
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="w-full flex items-center justify-start space-x-3 px-3 py-2 rounded-lg transition-colors relative"
              style={{ color: colors.textPrimary }}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span className="text-xl relative">
                🔔
                {unreadCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: colors.warning, fontSize: '10px' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </span>
              <span className="text-sm">Notifications</span>
            </button>

            {notificationsOpen && (
              <div 
                className="absolute bottom-full mb-2 left-0 w-80 border rounded-lg shadow-lg z-50"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  boxShadow: `0 10px 25px ${colors.textPrimary}15`
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      Notifications
                    </h3>
                    <span className="text-xs" style={{ color: colors.textSecondary }}>
                      {unreadCount} unread
                    </span>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className="p-4 border-b cursor-pointer transition-colors last:border-b-0"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: notification.read ? 'transparent' : `${colors.accent}08`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : `${colors.accent}08`;
                      }}
                    >
                      <p className="text-sm mb-1 font-medium" style={{ color: colors.textPrimary }}>
                        {notification.text}
                      </p>
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        {notification.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              className="w-full flex items-center justify-start space-x-3 px-3 py-2 rounded-lg transition-colors border"
              style={{
                borderColor: colors.border,
                color: colors.textPrimary
              }}
              onClick={() => setProfileOpen(!profileOpen)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.hover;
                e.currentTarget.style.borderColor = colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}DD)`
                }}
              >
                {user ? user.name?.charAt(0) || user.email?.charAt(0) : 'U'}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {user ? user.name?.split(' ')[0] : 'User'}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {user?.role || 'Legal Professional'}
                </p>
              </div>
              <span 
                className={`text-xs transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                style={{ color: colors.accent }}
              >
                ▼
              </span>
            </button>

            {profileOpen && (
              <div 
                className="absolute bottom-full mb-2 left-0 w-56 border rounded-lg shadow-lg z-50"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  boxShadow: `0 10px 25px ${colors.textPrimary}15`
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                
                <div className="py-2">
                  <button 
                    onClick={() => { setProfileOpen(false); navigate('/advocate/profile'); }}
                    className="flex items-center w-full px-4 py-2 text-sm transition-colors text-left"
                    style={{ color: colors.textPrimary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => { setProfileOpen(false); navigate('/advocate/settings'); }}
                    className="flex items-center w-full px-4 py-2 text-sm transition-colors text-left"
                    style={{ color: colors.textPrimary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Account Settings
                  </button>
                </div>

                <div className="border-t py-2" style={{ borderColor: colors.border }}>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm transition-colors text-left"
                    style={{ color: colors.warning }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.warning}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
