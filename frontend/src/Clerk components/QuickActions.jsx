import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, theme, language } = context || {};

  // State management
  const [recentActions, setRecentActions] = useState([]);
  const [favoriteActions, setFavoriteActions] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredAction, setHoveredAction] = useState(null);

  // Professional Icons Component
  const Icon = ({ name, className = "h-6 w-6" }) => {
    const icons = {
      'case': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      'search': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      'hearing': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      'sms': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      'report': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      'bulk': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      'star': (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      ),
      'time': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'all': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      'calendar': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      'communication': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    };

    return icons[name] || null;
  };

  // Enhanced default actions with professional icons
  const defaultActions = [
    {
      id: 'new-case',
      name: language === 'ta' ? 'नया मामला जोड़ें' : 'Add New Case',
      description: language === 'ta' ? 'नया केस रिकॉर्ड बनाएं' : 'Create a new case record',
      icon: 'case',
      category: 'Cases',
      shortcut: 'Ctrl+N',
      action: () => navigate('/clerk/cases/new'),
      color: 'from-[#b69d74] to-[#b69d74DD]',
      bgColor: 'rgba(182, 157, 116, 0.08)',
      iconColor: '#b69d74'
    },
    {
      id: 'quick-search',
      name: language === 'ta' ? 'केस खोजें' : 'Search Cases',
      description: language === 'ta' ? 'केस नंबर या पार्टी नाम से खोजें' : 'Search by case number or party name',
      icon: 'search',
      category: 'Search',
      shortcut: 'Ctrl+F',
      action: () => {
        const searchTerm = window.prompt(language === 'ta' ? 'खोज शब्द दर्ज करें:' : 'Enter search term:');
        if (searchTerm) {
          navigate(`/clerk/cases?search=${encodeURIComponent(searchTerm)}`);
        }
      },
      color: 'from-[#3b82f6] to-[#3b82f6DD]',
      bgColor: 'rgba(59, 130, 246, 0.08)',
      iconColor: '#3b82f6'
    },
    {
      id: 'today-hearings',
      name: language === 'ta' ? 'आज की सुनवाई' : "Today's Hearings",
      description: language === 'ta' ? 'आज की अनुसूचित सुनवाई देखें' : 'View scheduled hearings for today',
      icon: 'hearing',
      category: 'Calendar',
      shortcut: 'Ctrl+H',
      action: () => navigate('/clerk/calendar?date=today'),
      color: 'from-[#10b981] to-[#10b981DD]',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      iconColor: '#10b981'
    },
    {
      id: 'send-sms',
      name: language === 'ta' ? 'SMS भेजें' : 'Send SMS',
      description: language === 'ta' ? 'क्लाइंट्स को SMS अलर्ट भेजें' : 'Send SMS alerts to clients',
      icon: 'sms',
      category: 'Communication',
      shortcut: 'Ctrl+M',
      action: () => navigate('/clerk/sms'),
      color: 'from-[#f59e0b] to-[#f59e0bDD]',
      bgColor: 'rgba(245, 158, 11, 0.08)',
      iconColor: '#f59e0b'
    },
    {
      id: 'generate-report',
      name: language === 'ta' ? 'रिपोर्ट जेनरेट करें' : 'Generate Report',
      description: language === 'ta' ? 'केस स्टेटस रिपोर्ट बनाएं' : 'Create case status report',
      icon: 'report',
      category: 'Reports',
      shortcut: 'Ctrl+R',
      action: () => {
        addNotification?.({
          type: 'info',
          message: language === 'ta' ? 'रिपोर्ट जेनरेशन शुरू हो गई है...' : 'Report generation started...'
        });
        setTimeout(() => {
          addNotification?.({
            type: 'success',
            message: language === 'ta' ? 'रिपोर्ट तैयार है!' : 'Report ready for download!'
          });
        }, 3000);
      },
      color: 'from-[#8b5cf6] to-[#8b5cf6DD]',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      iconColor: '#8b5cf6'
    },
    {
      id: 'bulk-update',
      name: language === 'ta' ? 'बल्क अपडेट' : 'Bulk Update',
      description: language === 'ta' ? 'मल्टिपल केसेस अपडेट करें' : 'Update multiple cases at once',
      icon: 'bulk',
      category: 'Cases',
      shortcut: 'Ctrl+B',
      action: () => navigate('/clerk/bulk-operations'),
      color: 'from-[#ef4444] to-[#ef4444DD]',
      bgColor: 'rgba(239, 68, 68, 0.08)',
      iconColor: '#ef4444'
    }
  ];

  // Enhanced categories with icons
  const categories = [
    { key: 'all', name: language === 'ta' ? 'सभी' : 'All', icon: 'all' },
    { key: 'Cases', name: language === 'ta' ? 'मामले' : 'Cases', icon: 'case' },
    { key: 'Communication', name: language === 'ta' ? 'संचार' : 'Communication', icon: 'communication' },
    { key: 'Reports', name: language === 'ta' ? 'रिपोर्ट्स' : 'Reports', icon: 'report' },
    { key: 'Calendar', name: language === 'ta' ? 'कैलेंडर' : 'Calendar', icon: 'calendar' }
  ];

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('clerk-recent-actions');
    if (saved) {
      try {
        setRecentActions(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent actions:', e);
      }
    }

    const favorites = localStorage.getItem('clerk-favorite-actions');
    if (favorites) {
      try {
        setFavoriteActions(new Set(JSON.parse(favorites)));
      } catch (e) {
        console.error('Error loading favorite actions:', e);
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

      const action = defaultActions.find(a => {
        const keys = a.shortcut.toLowerCase().split('+');
        const isCtrl = keys.includes('ctrl') && (event.ctrlKey || event.metaKey);
        const isShift = keys.includes('shift') && event.shiftKey;
        const key = keys[keys.length - 1];
        
        return isCtrl && 
               (keys.includes('shift') ? isShift : !event.shiftKey) &&
               event.key.toLowerCase() === key;
      });

      if (action) {
        event.preventDefault();
        executeAction(action);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [defaultActions]);

  // Execute action with enhanced feedback
  const executeAction = (action) => {
    try {
      const newRecent = [
        { ...action, executedAt: new Date().toISOString() },
        ...recentActions.filter(a => a.id !== action.id).slice(0, 7)
      ];
      setRecentActions(newRecent);
      localStorage.setItem('clerk-recent-actions', JSON.stringify(newRecent));

      action.action();
      
      addNotification?.({
        type: 'success',
        message: `${action.name} ${language === 'ta' ? 'सफलतापूर्वक चलाया गया' : 'executed successfully'}`
      });
    } catch (error) {
      console.error('Error executing action:', error);
      addNotification?.({
        type: 'error',
        message: language === 'ta' ? 'कार्य निष्पादित करने में विफल' : 'Failed to execute action'
      });
    }
  };

  // Toggle favorite with animation feedback
  const toggleFavorite = (actionId, event) => {
    event.stopPropagation();
    const newFavorites = new Set(favoriteActions);
    if (newFavorites.has(actionId)) {
      newFavorites.delete(actionId);
    } else {
      newFavorites.add(actionId);
    }
    setFavoriteActions(newFavorites);
    localStorage.setItem('clerk-favorite-actions', JSON.stringify([...newFavorites]));
  };

  // Filter actions
  const filteredActions = defaultActions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f5f5ef] p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1f2839] mb-4 bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
            {language === 'ta' ? 'त्वरित कार्य' : 'Quick Actions'}
          </h1>
          <p className="text-lg text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
            {language === 'ta' 
              ? 'अपने दैनिक कार्यों को तेजी से पूरा करने के लिए स्मार्ट शॉर्टकट' 
              : 'Smart shortcuts to complete your daily tasks faster'}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-[#b69d7440] shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="search" className="h-5 w-5 text-[#b69d74]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-[#b69d7440] rounded-xl text-[#1f2839] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all duration-300"
                placeholder={language === 'ta' ? 'कार्य खोजें...' : 'Search actions...'}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.key
                      ? 'bg-[#b69d74] text-white shadow-lg transform scale-105'
                      : 'bg-white/80 text-[#1f2839] border border-[#b69d7440] hover:bg-[#b69d74] hover:text-white hover:shadow-md'
                  }`}
                >
                  <Icon name={category.icon} className="h-4 w-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Favorite Actions Section */}
        {favoriteActions.size > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#b69d74] to-[#b69d74DD] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#1f2839] flex items-center gap-2">
                <Icon name="star" className="h-6 w-6 text-[#b69d74]" />
                {language === 'ta' ? 'पसंदीदा कार्य' : 'Favorite Actions'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultActions
                .filter(action => favoriteActions.has(action.id))
                .map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    onExecute={executeAction}
                    onHover={setHoveredAction}
                    isHovered={hoveredAction === action.id}
                    language={language}
                    Icon={Icon}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Recent Actions Section */}
        {recentActions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#3b82f6] to-[#3b82f6DD] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#1f2839] flex items-center gap-2">
                <Icon name="time" className="h-6 w-6 text-[#3b82f6]" />
                {language === 'ta' ? 'हाल के कार्य' : 'Recent Actions'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentActions.slice(0, 6).map((recentAction) => {
                const action = defaultActions.find(a => a.id === recentAction.id);
                return action ? (
                  <ActionCard
                    key={`recent-${action.id}`}
                    action={action}
                    isFavorite={favoriteActions.has(action.id)}
                    onToggleFavorite={toggleFavorite}
                    onExecute={executeAction}
                    onHover={setHoveredAction}
                    isHovered={hoveredAction === action.id}
                    language={language}
                    Icon={Icon}
                    executedAt={recentAction.executedAt}
                  />
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* All Actions Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-[#10b981] to-[#10b981DD] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#1f2839]">
              {language === 'ta' ? 'सभी कार्य' : 'All Actions'}
            </h2>
            <span className="bg-[#b69d74] text-white px-3 py-1 rounded-full text-sm font-medium">
              {filteredActions.length}
            </span>
          </div>
          
          {filteredActions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  isFavorite={favoriteActions.has(action.id)}
                  onToggleFavorite={toggleFavorite}
                  onExecute={executeAction}
                  onHover={setHoveredAction}
                  isHovered={hoveredAction === action.id}
                  language={language}
                  Icon={Icon}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#b69d7440]">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#b69d7420] to-[#b69d7410] rounded-full flex items-center justify-center">
                <Icon name="search" className="h-12 w-12 text-[#b69d74]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1f2839] mb-2">
                {language === 'ta' ? 'कोई कार्य नहीं मिला' : 'No actions found'}
              </h3>
              <p className="text-[#6b7280] max-w-md mx-auto">
                {language === 'ta' 
                  ? 'अलग खोज मानदंड के साथ प्रयास करें या एक अलग श्रेणी चुनें'
                  : 'Try different search criteria or select a different category'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Action Card Component with theme-consistent buttons
const ActionCard = ({ action, isFavorite, onToggleFavorite, onExecute, onHover, isHovered, language, Icon, executedAt }) => {
  return (
    <div
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#b69d7440] hover:border-[#b69d7460] transition-all duration-500 hover:shadow-2xl hover:transform hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => onHover?.(action.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onExecute(action)}
      style={{
        background: isHovered ? action.bgColor : 'rgba(255, 255, 255, 0.8)',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(182, 157, 116, 0.25)' : '0 4px 6px -1px rgba(31, 40, 57, 0.1)'
      }}
    >
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#b69d7405] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div 
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 border border-[#b69d7440]"
          style={{ color: action.iconColor }}
        >
          <Icon name={action.icon} className="h-7 w-7" />
        </div>
        <button
          onClick={(e) => onToggleFavorite(action.id, e)}
          className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
            isFavorite 
              ? 'text-[#b69d74] bg-[#b69d7410] shadow-md' 
              : 'text-[#6b7280] bg-white/60 hover:bg-[#b69d7410] hover:text-[#b69d74]'
          }`}
        >
          <Icon name="star" className="h-5 w-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="relative">
        <h3 className="font-bold text-[#1f2839] text-lg mb-2 leading-tight group-hover:text-[#b69d74] transition-colors duration-300">
          {action.name}
        </h3>
        <p className="text-[#6b7280] text-sm leading-relaxed mb-4">
          {action.description}
        </p>

        {executedAt && (
          <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-3">
            <Icon name="time" className="h-3 w-3" />
            {language === 'ta' ? 'अंतिम बार:' : 'Last used:'} {new Date(executedAt).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between pt-4 border-t border-[#b69d7420]">
        <kbd className="px-3 py-1.5 bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] text-white text-xs rounded-lg font-mono shadow-md transform group-hover:scale-105 transition-transform">
          {action.shortcut}
        </kbd>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExecute(action);
          }}
          className="px-4 py-2 bg-gradient-to-r from-[#1f2839] to-[#1f2839DD] text-white text-sm font-medium rounded-lg hover:from-[#b69d74] hover:to-[#b69d74DD] transform group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {language === 'ta' ? 'चलाएं' : 'Run'}
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#b69d7410] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default QuickActions;