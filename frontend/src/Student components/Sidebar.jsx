import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiHome,
  FiBook, 
  FiClipboard,
  FiBookmark,
  FiUsers,
  FiAward,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiCalendar,
  FiTrendingUp,
  FiTarget,
  FiMessageSquare
} from 'react-icons/fi';

const navigationItems = [
  {
    title: 'Overview',
    items: [
      { 
        to: '/student/dashboard', 
        label: 'Dashboard', 
        icon: FiHome,
        badge: null
      },
      { 
        to: '/student/calendar', 
        label: 'Calendar', 
        icon: FiCalendar,
        badge: '3'
      },
      { 
        to: '/student/progress', 
        label: 'Progress', 
        icon: FiBarChart2,
        badge: null
      },
    ]
  },
  {
    title: 'Learning',
    items: [
      { 
        to: '/student/courses', 
        label: 'Courses', 
        icon: FiBook,
        badge: '2'
      },
      { 
        to: '/student/assignments', 
        label: 'Assignments', 
        icon: FiClipboard,
        badge: '5'
      },
      { 
        to: '/student/library', 
        label: 'Library', 
        icon: FiBookmark,
        badge: null
      },
      { 
        to: '/student/exam-prep', 
        label: 'Exam Prep', 
        icon: FiTarget,
        badge: null
      },
    ]
  },
  {
    title: 'Community',
    items: [
      { 
        to: '/student/moot-court', 
        label: 'Moot Court', 
        icon: FiAward,
        badge: null
      },
      { 
        to: '/student/study-groups', 
        label: 'Study Groups', 
        icon: FiUsers,
        badge: '1'
      },
      { 
        to: '/student/discussions', 
        label: 'Discussions', 
        icon: FiMessageSquare,
        badge: '12'
      },
    ]
  }
];

export default function Sidebar() {
  const [userProgress] = useState({
    coursesCompleted: 12,
    totalCourses: 20,
    currentGPA: 3.8
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const getProgressPercentage = () => {
    return Math.round((userProgress.coursesCompleted / userProgress.totalCourses) * 100);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header - Matches Layout dimensions */}
      <div className="p-6 border-b border-gray-200 flex items-center min-h-[80px]">
        <div className="bg-blue-600 p-3 rounded-xl mr-4 flex-shrink-0">
          <span className="text-white font-bold text-xl">LD</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LegalDesk</h1>
          <p className="text-sm text-gray-600 mt-1">Student Portal</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Course Progress</span>
            <FiTrendingUp className="w-4 h-4 text-green-600" />
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Completed</span>
              <span>{userProgress.coursesCompleted}/{userProgress.totalCourses}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900">{userProgress.currentGPA}</div>
              <div className="text-gray-600 text-xs">GPA</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900">#15</div>
              <div className="text-gray-600 text-xs">Rank</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      to={item.to}
                      key={item.to}
                      className={({isActive}) => 
                        `flex items-center rounded-lg px-3 py-3 transition-all duration-200 group ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700 shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <IconComponent 
                        size="20" 
                        className="flex-shrink-0 mr-3"
                      />
                      
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || user?.email?.split('@')[0] || 'Student'}
            </p>
            <p className="text-xs text-gray-600">3L Student • Online</p>
          </div>
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => navigate('/student/profile')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors duration-200 font-medium"
          >
            View Profile
          </button>
          <button 
            onClick={() => navigate('/student/settings')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors duration-200 flex items-center font-medium"
          >
            <FiSettings size="16" className="mr-2" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}