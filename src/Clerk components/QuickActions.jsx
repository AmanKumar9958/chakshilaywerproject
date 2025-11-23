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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredAction, setHoveredAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Professional Icons Component
  const Icon = ({ name, className = "h-5 w-5" }) => {
    const icons = {
      'case': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      'search': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      'hearing': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      'sms': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      'report': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      'bulk': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      'star': (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      ),
      'time': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'all': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      'calendar': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      'communication': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    };

    return icons[name] || null;
  };

  // Default actions with optimized design
  const defaultActions = [
    {
      id: 'new-case',
      name: language === 'ta' ? 'नया मामला जोड़ें' : 'Add New Case',
      description: language === 'ta' ? 'नया केस रिकॉर्ड बनाएं' : 'Create a new case record',
      icon: 'case',
      category: 'Cases',
      shortcut: 'Ctrl+N',
      action: () => navigate('/clerk/cases/new'),
      bgColor: 'rgba(182, 157, 116, 0.08)',
      iconColor: '#b69d74'
    },
    {
      id: 'today-hearings',
      name: language === 'ta' ? 'आज की सुनवाई' : "Today's Hearings",
      description: language === 'ta' ? 'आज की अनुसूचित सुनवाई देखें' : 'View scheduled hearings for today',
      icon: 'hearing',
      category: 'Calendar',
      shortcut: 'Ctrl+H',
      action: () => navigate('/clerk/calendar?date=today'),
      bgColor: 'rgba(182, 157, 116, 0.06)',
      iconColor: '#b69d74'
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
      bgColor: 'rgba(182, 157, 116, 0.06)',
      iconColor: '#b69d74'
    },
    {
      id: 'bulk-update',
      name: language === 'ta' ? 'बल्क अपडेट' : 'Bulk Update',
      description: language === 'ta' ? 'मल्टिपल केसेस अपडेट करें' : 'Update multiple cases at once',
      icon: 'bulk',
      category: 'Cases',
      shortcut: 'Ctrl+B',
      action: () => navigate('/clerk/bulk-operations'),
      bgColor: 'rgba(182, 157, 116, 0.06)',
      iconColor: '#b69d74'
    }
  ];

  // Categories
  const categories = [
    { key: 'all', name: language === 'ta' ? 'सभी' : 'All', icon: 'all' },
    { key: 'Cases', name: language === 'ta' ? 'मामले' : 'Cases', icon: 'case' },
    { key: 'Communication', name: language === 'ta' ? 'संचार' : 'Communication', icon: 'communication' },
    { key: 'Reports', name: language === 'ta' ? 'रिपोर्ट्स' : 'Reports', icon: 'report' },
    { key: 'Calendar', name: language === 'ta' ? 'कैलेंडर' : 'Calendar', icon: 'calendar' }
  ];

  // Load data from localStorage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      setIsLoading(false);
    };

    loadData();
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

  // Execute action
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

  // Toggle favorite
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
    <div className="min-h-screen bg-[#f5f5ef] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1f2839] mb-3 bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
            {language === 'ta' ? 'त्वरित कार्य' : 'Quick Actions'}
          </h1>
          <p className="text-[#6b7280] max-w-2xl mx-auto">
            {language === 'ta' 
              ? 'अपने दैनिक कार्यों को तेजी से पूरा करने के लिए स्मार्ट शॉर्टकट' 
              : 'Smart shortcuts to complete your daily tasks faster'}
          </p>
        </div>

        {/* Category Filter (compact) */}
        <div className="bg-white/80 rounded-xl p-4 mb-6 border border-[#b69d7420] shadow-sm">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category.key
                    ? 'bg-[#b69d74] text-white shadow-sm'
                    : 'bg-white text-[#1f2839] border border-[#b69d7420] hover:bg-[#b69d7410]'
                }`}
              >
                <Icon name={category.icon} className="h-3.5 w-3.5" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Actions - Compact */}
        {favoriteActions.size > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="star" className="h-5 w-5 text-[#b69d74]" />
              <h2 className="text-lg font-semibold text-[#1f2839]">
                {language === 'ta' ? 'पसंदीदा कार्य' : 'Favorite Actions'}
              </h2>
              <span className="text-xs text-[#b69d74] bg-[#b69d7410] px-2 py-1 rounded-full">
                {favoriteActions.size}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Recent Actions - Compact */}
        {recentActions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="time" className="h-5 w-5 text-[#b69d74]" />
              <h2 className="text-lg font-semibold text-[#1f2839]">
                {language === 'ta' ? 'हाल के कार्य' : 'Recent Actions'}
              </h2>
              <span className="text-xs text-[#b69d74] bg-[#b69d7410] px-2 py-1 rounded-full">
                {recentActions.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* All Actions - Compact */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-[#1f2839]">
              {language === 'ta' ? 'सभी कार्य' : 'All Actions'}
            </h2>
            <span className="text-xs bg-[#b69d74] text-white px-2 py-1 rounded-full">
              {filteredActions.length}
            </span>
          </div>
          
          {filteredActions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="text-center py-12 bg-white/80 rounded-xl border border-[#b69d7420]">
              <div className="w-16 h-16 mx-auto mb-3 bg-[#b69d7410] rounded-full flex items-center justify-center">
                <Icon name="search" className="h-8 w-8 text-[#b69d74]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1f2839] mb-2">
                {language === 'ta' ? 'कोई कार्य नहीं मिला' : 'No actions found'}
              </h3>
              <p className="text-[#6b7280] text-sm max-w-md mx-auto mb-4">
                {language === 'ta' 
                  ? 'अलग खोज मानदंड के साथ प्रयास करें'
                  : 'Try different search criteria'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-[#b69d74] text-white text-sm rounded-lg hover:bg-[#b69d74DD] transition-colors"
              >
                {language === 'ta' ? 'सभी कार्य दिखाएं' : 'Show All Actions'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact Action Card Component
const ActionCard = ({ action, isFavorite, onToggleFavorite, onExecute, onHover, isHovered, language, Icon, executedAt }) => {
  return (
    <div
      className="group relative bg-white rounded-xl p-4 border border-[#b69d7420] hover:border-[#b69d7440] transition-all duration-300 hover:shadow-md cursor-pointer"
      onMouseEnter={() => onHover?.(action.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onExecute(action)}
      style={{
        background: isHovered ? action.bgColor : 'white'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-lg bg-[#b69d7410] flex items-center justify-center border border-[#b69d7420]"
          style={{ color: action.iconColor }}
        >
          <Icon name={action.icon} className="h-5 w-5" />
        </div>
        <button
          onClick={(e) => onToggleFavorite(action.id, e)}
          className={`p-1.5 rounded-lg transition-colors ${
            isFavorite 
              ? 'text-[#b69d74] bg-[#b69d7410]' 
              : 'text-[#6b7280] hover:text-[#b69d74] hover:bg-[#b69d7410]'
          }`}
        >
          <Icon name="star" className="h-4 w-4" />
        </button>
      </div>
      
      {/* Content */}
      <div className="mb-4">
        <h3 className="font-semibold text-[#1f2839] text-sm mb-2 leading-tight group-hover:text-[#b69d74] transition-colors">
          {action.name}
        </h3>
        <p className="text-[#6b7280] text-xs leading-relaxed">
          {action.description}
        </p>

        {executedAt && (
          <div className="flex items-center gap-1 text-[#6b7280] text-xs mt-2">
            <Icon name="time" className="h-3 w-3" />
            {language === 'ta' ? 'अंतिम बार:' : 'Last used:'} {new Date(executedAt).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#b69d7410]">
        <kbd className="px-2 py-1 bg-[#f5f5ef] text-[#b69d74] text-xs rounded border border-[#b69d7420] font-mono">
          {action.shortcut}
        </kbd>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExecute(action);
          }}
          className="px-3 py-1.5 bg-[#b69d74] text-white text-xs rounded hover:bg-[#b69d74DD] transition-colors font-medium"
        >
          {language === 'ta' ? 'चलाएं' : 'Run'}
        </button>
      </div>
    </div>
  );
};

export default QuickActions;