import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed, theme, language, user }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [badges, setBadges] = useState({
    cases: 12,
    notifications: 3,
    sms: 8,
    offline: 2
  });
  const location = useLocation();

  // Navigation menu items
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      nameTA: 'முகப்பு',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      path: '/clerk/dashboard',
      badge: null
    },
    {
      id: 'cases',
      name: 'Cases',
      nameTA: 'வழக்குகள்',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/clerk/cases',
      badge: badges.cases,
      submenu: [
        { id: 'all-cases', name: 'All Cases', nameTA: 'அனைத்து வழக்குகள்', path: '/clerk/cases' },
        { id: 'active-cases', name: 'Active Cases', nameTA: 'செயலில் உள்ள வழக்குகள்', path: '/clerk/cases?status=active' },
        { id: 'pending-cases', name: 'Pending Cases', nameTA: 'நிலுவையில் உள்ள வழக்குகள்', path: '/clerk/cases?status=pending' },
        { id: 'closed-cases', name: 'Closed Cases', nameTA: 'முடிக்கப்பட்ட வழக்குகள்', path: '/clerk/cases?status=closed' }
      ]
    },
    {
      id: 'calendar',
      name: 'Calendar',
      nameTA: 'நாட்காட்டி',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: '/clerk/calendar',
      badge: null
    },
    {
      id: 'documents',
      name: 'Documents',
      nameTA: 'ஆவணங்கள்',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      path: '/clerk/documents',
      badge: null
    },
    {
      id: 'sms-log',
      name: 'SMS Log',
      nameTA: 'SMS பதிவு',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      path: '/clerk/sms-log',
      badge: badges.sms
    },
    {
      id: 'quick-actions',
      name: 'Quick Actions',
      nameTA: 'விரைவு செயல்கள்',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      path: '/clerk/quick-actions',
      badge: null
    },
    {
      id: 'fake-case-checker',
      name: 'Fraud Detection',
      nameTA: 'மோசடி கண்டறிதல்',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      path: '/clerk/fake-case-checker',
      badge: null
    },
    {
      id: 'reports',
      name: 'Reports',
      nameTA: 'அறிக்கைகள்',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/clerk/reports',
      badge: null,
      submenu: [
        { id: 'case-reports', name: 'Case Reports', nameTA: 'வழக்கு அறிக்கைகள்', path: '/clerk/reports/cases' },
        { id: 'monthly-reports', name: 'Monthly Reports', nameTA: 'மாதாந்திர அறிக்கைகள்', path: '/clerk/reports/monthly' },
        { id: 'analytics', name: 'Analytics', nameTA: 'பகுப்பாய்வு', path: '/clerk/reports/analytics' },
        { id: 'custom-reports', name: 'Custom Reports', nameTA: 'தனிப்பயன் அறிக்கைகள்', path: '/clerk/reports/custom' }
      ]
    },
    {
      id: 'integrations',
      name: 'Integrations',
      nameTA: 'ஒருங்கிணைப்புகள்',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: '/clerk/integrations',
      badge: null
    },
    {
      id: 'offline-mode',
      name: 'Offline Mode',
      nameTA: 'ஆஃப்லைன் பயன்முறை',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      path: '/clerk/offline-mode',
      badge: badges.offline
    }
  ];

  // Bottom menu items
  const bottomMenuItems = [
    {
      id: 'settings',
      name: 'Settings',
      nameTA: 'அமைப்புகள்',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/clerk/settings',
      badge: null
    },
    {
      id: 'help',
      name: 'Help & Support',
      nameTA: 'உதவி மற்றும் ஆதரவு',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/clerk/help',
      badge: null
    }
  ];

  // Check if current path matches menu item
  const isActiveItem = (itemPath) => {
    return location.pathname === itemPath || location.pathname.startsWith(itemPath + '/');
  };

  // Handle submenu toggle
  const toggleSubmenu = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  // Add to recent items
  const addToRecent = (item) => {
    const recent = recentItems.filter(r => r.id !== item.id);
    recent.unshift(item);
    setRecentItems(recent.slice(0, 5));
  };

  // Update recent items when location changes
  useEffect(() => {
    const currentItem = [...menuItems, ...bottomMenuItems].find(item => 
      isActiveItem(item.path)
    );
    if (currentItem) {
      addToRecent(currentItem);
    }
  }, [location.pathname]);

  const MenuItem = ({ item, isBottom = false }) => {
    const isActive = isActiveItem(item.path);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isSubmenuOpen = activeSubmenu === item.id;

    return (
      <div className="relative">
        <Link
          to={item.path}
          onClick={() => {
            if (hasSubmenu) {
              toggleSubmenu(item.id);
            }
            addToRecent(item);
          }}
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          }`}
          title={collapsed ? (language === 'ta' ? item.nameTA : item.name) : ''}
        >
          <div className={`flex-shrink-0 transition-colors duration-200 ${
            isActive ? 'text-blue-600 dark:text-blue-400' : ''
          }`}>
            {item.icon}
          </div>
          
          {!collapsed && (
            <>
              <span className="ml-3 flex-1">
                {language === 'ta' ? item.nameTA : item.name}
              </span>
              
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              
              {hasSubmenu && (
                <svg
                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                    isSubmenuOpen ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </>
          )}
        </Link>

        {/* Submenu */}
        {hasSubmenu && isSubmenuOpen && !collapsed && (
          <div className="mt-1 ml-8 space-y-1">
            {item.submenu.map((subItem) => (
              <Link
                key={subItem.id}
                to={subItem.path}
                className={`group flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  isActiveItem(subItem.path)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="h-2 w-2 bg-current rounded-full opacity-50"></div>
                <span className="ml-3">
                  {language === 'ta' ? subItem.nameTA : subItem.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 lg:z-10 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {language === 'ta' ? 'சக்ஷி' : 'Chakshi'}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'ta' ? 'न्यायालय क्लर्क' : 'Court Clerk'}
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Recent Items */}
          {!collapsed && recentItems.length > 0 && (
            <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                {language === 'ta' ? 'சமீபத்திய' : 'Recent'}
              </h3>
              <div className="space-y-1">
                {recentItems.slice(0, 3).map((item) => (
                  <Link
                    key={`recent-${item.id}`}
                    to={item.path}
                    className="group flex items-center px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                      {item.icon}
                    </div>
                    <span className="ml-3 truncate">
                      {language === 'ta' ? item.nameTA : item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Quick Actions (when collapsed) */}
          {collapsed && (
            <div className="px-3 py-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {/* Add quick case entry */}}
                className="w-full p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={language === 'ta' ? 'புதிய வழக்கு' : 'New Case'}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              <button
                onClick={() => {/* Add quick search */}}
                className="w-full p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={language === 'ta' ? 'तुरंत खोज' : 'Quick Search'}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
            {bottomMenuItems.map((item) => (
              <MenuItem key={item.id} item={item} isBottom={true} />
            ))}
          </div>

          {/* User Info (when not collapsed) */}
          {!collapsed && user && (
            <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {language === 'ta' ? 'न्यायालय क्लर्क' : 'Court Clerk'}
                  </p>
                </div>
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom styles for smooth animations */}
      <style jsx>{`
        .clerk-sidebar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .clerk-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        
        .clerk-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .clerk-sidebar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        
        .clerk-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </>
  );
};

export default Sidebar;