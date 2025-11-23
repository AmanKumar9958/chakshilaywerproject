import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  Users,
  BarChart3,
  Target,
  ArrowRight,
  Plus,
  Bell,
  Search,
  User,
  Menu,
  X
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('✅ Student Dashboard component rendered!', { user: user?.email, timestamp: new Date().toISOString() });
  }, [user]);

  // Hero.js Color Palette
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
    green: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6'
  };

  const stats = [
    { 
      title: 'Active Courses', 
      value: '8', 
      icon: FileText,
      change: '+2 this semester',
      trend: 'up',
      breakdown: '6 ongoing, 2 new'
    },
    { 
      title: 'Assignments Due', 
      value: '5', 
      icon: Calendar,
      change: '2 this week',
      trend: 'neutral',
      breakdown: 'Next 7 days'
    },
    { 
      title: 'Study Hours', 
      value: '32', 
      icon: Users,
      change: '+8 this week',
      trend: 'up',
      breakdown: 'Weekly average'
    },
    { 
      title: 'Grade Average', 
      value: '85%', 
      icon: TrendingUp,
      change: '+3% this month',
      trend: 'up',
      breakdown: 'Current GPA: 3.4'
    }
  ];

  const recentActivities = [
    { 
      activity: 'Court Order received in Civil Suit No. 245/2024', 
      time: '2 hours ago',
      type: 'court_order',
      status: 'new',
      priority: 'high'
    },
    { 
      activity: 'Client consultation completed - Property Dispute', 
      time: '4 hours ago',
      type: 'meeting',
      status: 'completed',
      priority: 'medium'
    },
    { 
      activity: 'Counter-affidavit filed in High Court', 
      time: '1 day ago',
      type: 'filing',
      status: 'filed',
      priority: 'high'
    },
    { 
      activity: 'New client message - Contract Review', 
      time: '1 day ago',
      type: 'message',
      status: 'unread',
      priority: 'medium'
    },
    { 
      activity: 'Cause list updated - 3 cases scheduled', 
      time: '2 days ago',
      type: 'notification',
      status: 'info',
      priority: 'low'
    }
  ];

  const upcomingTasks = [
    { 
      task: 'High Court Hearing - Writ Petition', 
      dueDate: 'Today 2:30 PM',
      priority: 'high',
      details: 'Court No. 15, Justice Sharma',
      type: 'hearing'
    },
    { 
      task: 'Client Meeting - M/s ABC Industries', 
      dueDate: 'Tomorrow 11:00 AM',
      priority: 'medium',
      details: 'Contract negotiation discussion',
      type: 'meeting'
    },
    { 
      task: 'File Reply in Sessions Court', 
      dueDate: 'Friday',
      priority: 'high',
      details: 'Criminal Case No. 156/2024',
      type: 'filing'
    },
    { 
      task: 'Evidence Collection - Property Case', 
      dueDate: 'Next Week',
      priority: 'medium',
      details: 'Site inspection and documentation',
      type: 'task'
    }
  ];

  const achievements = [
    { name: 'Case Win Streak', earned: true, count: '5 consecutive wins' },
    { name: 'Client Satisfaction', earned: true, count: '4.8/5 rating' },
    { name: 'Revenue Milestone', earned: true, count: '₹10L+ this year' },
    { name: 'Court Excellence', earned: false, count: 'Supreme Court case' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return `bg-red-50 text-red-700 border border-red-200`;
      case 'medium': return `bg-yellow-50 text-yellow-700 border border-yellow-200`;
      case 'low': return `bg-green-50 text-green-700 border border-green-200`;
      default: return `bg-blue-50 text-blue-700 border border-blue-200`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': 
      case 'filed': return `bg-green-50 text-green-700 border border-green-200`;
      case 'new': 
      case 'unread': return `background: linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10); color: ${colors.navy}; border: 1px solid ${colors.golden}40`;
      case 'info': return `bg-blue-50 text-blue-700 border border-blue-200`;
      default: return `background: rgba(107, 114, 128, 0.1); color: ${colors.gray}; border: 1px solid rgba(107, 114, 128, 0.2)`;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'court_order': return <FileText className="w-4 h-4" style={{color: colors.amber}} />;
      case 'meeting': return <Users className="w-4 h-4" style={{color: colors.blue}} />;
      case 'filing': return <CheckCircle className="w-4 h-4" style={{color: colors.green}} />;
      case 'message': return <Bell className="w-4 h-4" style={{color: colors.golden}} />;
      case 'notification': return <Clock className="w-4 h-4" style={{color: colors.gray}} />;
      case 'hearing': return <Calendar className="w-4 h-4" style={{color: colors.amber}} />;
      case 'task': return <Target className="w-4 h-4" style={{color: colors.navy}} />;
      default: return <FileText className="w-4 h-4" style={{color: colors.gray}} />;
    }
  };

  return (
    <div className="min-h-screen" style={{background: colors.cream}}>
      {/* Header */}
      <header className="border-b sticky top-0 z-30 h-16" style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.10))`,
        backdropFilter: 'blur(6px)',
        borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
      }}>
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md transition-colors"
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.08)`,
                color: colors.navy
              }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
              }}>
                <Award className="w-5 h-5" style={{color: 'white'}} />
              </div>
              <span className="font-bold text-lg hidden sm:block" style={{
                background: `linear-gradient(135deg, ${colors.navy}, ${colors.golden})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                LegalPro
              </span>
            </div>
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: colors.golden}} />
              <input
                type="text"
                placeholder="Search cases, clients..."
                className="pl-10 pr-4 py-2 w-64 rounded-lg focus:outline-none transition-all"
                style={{
                  background: `rgba(255, 255, 255, 0.06)`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                  color: colors.navy,
                  backdropFilter: 'blur(6px)'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.golden}
                onBlur={(e) => e.target.style.borderColor = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-md transition-colors" style={{
              background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.08)`,
              color: colors.navy
            }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{background: colors.amber}}></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
              }}>
                <User className="w-4 h-4" style={{color: colors.golden}} />
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium" style={{color: colors.navy}}>
                  Adv. {user?.name || 'Legal Professional'}
                </p>
                <p className="text-xs" style={{color: colors.gray}}>Senior Advocate</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden p-4" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.10))`,
          backdropFilter: 'blur(6px)',
          borderBottom: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        }}>
          <nav className="space-y-2">
            {['Dashboard', 'Cases', 'Clients', 'Calendar', 'Documents', 'Reports', 'Settings'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-3 py-2 rounded-lg transition-colors font-medium"
                style={{
                  color: colors.navy,
                  background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
                }}
                onMouseEnter={(e) => e.target.style.background = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.12)`}
                onMouseLeave={(e) => e.target.style.background = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{color: colors.navy}}>
            Welcome back, {user ? user.name || user.email.split('@')[0] : 'Student'}
          </h1>
          <p style={{color: colors.gray}}>
            Your student dashboard - track courses, assignments, and academic progress
          </p>
          <div className="flex items-center gap-2 text-sm mt-2" style={{color: colors.gray}}>
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="rounded-lg p-4 transition-all duration-200 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                backdropFilter: 'blur(6px)',
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                boxShadow: `0 0 15px rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.20)`
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
                }}>
                  <stat.icon className="w-5 h-5" style={{color: colors.golden}} />
                </div>
                <div className="flex items-center gap-1 text-xs" style={{color: colors.gray}}>
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-1" style={{color: colors.navy}}>
                  {stat.value}
                </h3>
                <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>
                  {stat.title}
                </p>
                <p className="text-xs" style={{color: colors.golden}}>
                  {stat.breakdown}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Today's Priorities */}
          <div className="lg:col-span-2">
            <div className="rounded-lg p-6" style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
              backdropFilter: 'blur(6px)',
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold" style={{color: colors.navy}}>Today's Priorities</h2>
                <button className="flex items-center gap-1 text-sm transition-colors" style={{color: colors.golden}}>
                  View Calendar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {upcomingTasks.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      background: `linear-gradient(135deg, ${colors.golden}15, ${colors.golden}08)`
                    }}>
                      {getTypeIcon(item.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{color: colors.navy}}>
                        {item.task}
                      </p>
                      <p className="text-xs" style={{color: colors.gray}}>
                        {item.details}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <p className="text-xs mt-1" style={{color: colors.gray}}>
                        {item.dueDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="rounded-lg p-6" style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
              backdropFilter: 'blur(6px)',
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold" style={{color: colors.navy}}>Quick Actions</h2>
                <Plus className="w-5 h-5" style={{color: colors.golden}} />
              </div>
              
              <div className="space-y-3">
                {[
                  { title: 'Add New Case', icon: FileText, description: 'Register new case' },
                  { title: 'Upload Document', icon: Award, description: 'OCR scan & file' },
                  { title: 'Schedule Meeting', icon: Calendar, description: 'Client consultation' },
                  { title: 'Generate Draft', icon: BookOpen, description: 'Legal document' }
                ].map((action, index) => (
                  <button 
                    key={index}
                    className="w-full p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] text-left"
                    style={{
                      background: `linear-gradient(135deg, ${colors.golden}08, ${colors.golden}05)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${colors.golden}15, ${colors.golden}10)`;
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${colors.golden}08, ${colors.golden}05)`;
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                        background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}15)`
                      }}>
                        <action.icon className="w-4 h-4" style={{color: colors.golden}} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{color: colors.navy}}>
                          {action.title}
                        </p>
                        <p className="text-xs" style={{color: colors.gray}}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          {/* Recent Activity Feed */}
          <div className="rounded-lg p-6" style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
            backdropFilter: 'blur(6px)',
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold" style={{color: colors.navy}}>Recent Activity Feed</h2>
              <BarChart3 className="w-5 h-5" style={{color: colors.golden}} />
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    background: `rgba(255, 255, 255, 0.03)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    background: `linear-gradient(135deg, ${colors.golden}15, ${colors.golden}08)`
                  }}>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{color: colors.navy}}>
                      {item.activity}
                    </p>
                    <p className="text-xs" style={{color: colors.gray}}>
                      {item.time}
                    </p>
                  </div>
                  
                  <div>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        ...(item.status === 'new' || item.status === 'unread' 
                          ? {
                              background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`,
                              color: colors.navy,
                              border: `1px solid ${colors.golden}40`
                            }
                          : {
                              background: `rgba(16, 185, 129, 0.1)`,
                              color: colors.green,
                              border: `1px solid rgba(16, 185, 129, 0.2)`
                            }
                        )
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Progress Tracker */}
          <div className="rounded-lg p-6" style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
            backdropFilter: 'blur(6px)',
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold" style={{color: colors.navy}}>Case Progress</h2>
              <Target className="w-5 h-5" style={{color: colors.golden}} />
            </div>
            
            <div className="space-y-4">
              {/* Overall Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{color: colors.navy}}>Monthly Target</span>
                  <span className="text-sm font-semibold" style={{color: colors.navy}}>85%</span>
                </div>
                <div className="w-full rounded-full h-2 overflow-hidden" style={{background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}}>
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: '85%',
                      background: `linear-gradient(90deg, ${colors.golden}, ${colors.golden}CC)`
                    }}
                  ></div>
                </div>
              </div>

              {/* Case Type Progress */}
              {[
                { type: 'Civil Cases', progress: 90, color: colors.golden },
                { type: 'Criminal Cases', progress: 75, color: colors.amber },
                { type: 'Corporate Law', progress: 85, color: colors.blue },
                { type: 'Family Law', progress: 65, color: colors.green }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium" style={{color: colors.gray}}>{item.type}</span>
                    <span className="text-xs font-semibold" style={{color: colors.navy}}>{item.progress}%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 overflow-hidden" style={{background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`}}>
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${item.progress}%`,
                        background: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Achievements */}
        <div className="rounded-lg p-6 mb-8" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
          backdropFilter: 'blur(6px)',
          border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        }}>
          <h2 className="text-lg font-semibold mb-4" style={{color: colors.navy}}>Professional Achievements</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: achievement.earned 
                    ? `linear-gradient(135deg, ${colors.golden}15, ${colors.golden}08)`
                    : `rgba(107, 114, 128, 0.05)`,
                  border: achievement.earned 
                    ? `1px solid ${colors.golden}40`
                    : `1px solid rgba(107, 114, 128, 0.15)`
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{
                    background: achievement.earned 
                      ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                      : `rgba(107, 114, 128, 0.10)`,
                    color: achievement.earned ? 'white' : colors.gray
                  }}>
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium mb-1" style={{
                    color: achievement.earned ? colors.navy : colors.gray
                  }}>
                    {achievement.name}
                  </span>
                  <span className="text-xs" style={{
                    color: achievement.earned ? colors.golden : colors.gray
                  }}>
                    {achievement.count}
                  </span>
                  {achievement.earned && (
                    <CheckCircle className="w-3 h-3 mt-1" style={{color: colors.green}} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;