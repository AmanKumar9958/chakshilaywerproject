import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCases: 0,
      activeCases: 0,
      pendingCases: 0
    },
    recentCases: [],
    upcomingHearings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, theme, language, isOnline } = context || {};

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://server.chakshi.com';

  // Professional legal color palette
  const colors = {
    primary: {
      cream: '#f5f5ef',
      navy: '#1f2839',
      gold: '#b69d74',
      gray: '#6b7280'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6'
    },
    gradients: {
      text: 'linear-gradient(135deg, #1f2839, #b69d74)',
      card: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,245,239,0.95))'
    }
  };

  // Legal icons
  const LegalIcons = {
    TotalCases: ({ className = "w-5 h-5", style }) => (
      <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    ActiveCases: ({ className = "w-5 h-5", style }) => (
      <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    PendingCases: ({ className = "w-5 h-5", style }) => (
      <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Hearings: ({ className = "w-5 h-5", style }) => (
      <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    Scale: ({ className = "w-6 h-6", style }) => (
      <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )
  };

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get clerk ID from user (replace with actual user ID)
        const clerkId = user?.id || user?._id || '507f1f77bcf86cd799439011';
        
        console.log('📊 Fetching dashboard data for clerk:', clerkId);

        // Fetch stats
        const statsResponse = await fetch(`${API_BASE_URL}/clerkdashboard/${clerkId}/stats`);
        const statsData = await statsResponse.json();

        // Fetch recent cases
        const casesResponse = await fetch(`${API_BASE_URL}/clerkdashboard/${clerkId}/recent-cases?limit=5`);
        const casesData = await casesResponse.json();

        // Fetch upcoming hearings
        const hearingsResponse = await fetch(`${API_BASE_URL}/clerkdashboard/${clerkId}/upcoming-hearings?limit=5`);
        const hearingsData = await hearingsResponse.json();

        console.log('✅ Dashboard data fetched successfully');

        // Update state
        setDashboardData({
          stats: statsData.success ? statsData.data : { totalCases: 0, activeCases: 0, pendingCases: 0 },
          recentCases: casesData.success ? casesData.data : [],
          upcomingHearings: hearingsData.success ? hearingsData.data : []
        });

      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        
        // Show notification if available
        if (addNotification) {
          addNotification({
            type: 'error',
            message: 'Failed to load dashboard data. Please try again.',
            duration: 5000
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, addNotification]);

  // Refresh Dashboard
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const clerkId = user?.id || user?._id || '507f1f77bcf86cd799439011';
      
      console.log('🔄 Refreshing dashboard...');
      
      const response = await fetch(`${API_BASE_URL}/clerkdashboard/${clerkId}/refresh`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Dashboard refreshed successfully');
        
        // Reload the page data
        window.location.reload();
      }
    } catch (err) {
      console.error('❌ Error refreshing dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'ta') {
      if (hour < 12) return 'सुप्रभात';
      if (hour < 17) return 'नमस्ते';
      return 'शुभ संध्या';
    }
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(language === 'ta' ? 'hi-IN' : 'en-US', options);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return { background: 'rgba(239, 68, 68, 0.15)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.40)' };
      case 'high': return { background: 'rgba(245, 158, 11, 0.15)', text: colors.status.warning, border: 'rgba(245, 158, 11, 0.40)' };
      case 'medium': return { background: 'rgba(59, 130, 246, 0.15)', text: colors.status.info, border: 'rgba(59, 130, 246, 0.40)' };
      case 'low': return { background: 'rgba(16, 185, 129, 0.15)', text: colors.status.success, border: 'rgba(16, 185, 129, 0.40)' };
      default: return { background: 'rgba(107, 114, 128, 0.15)', text: colors.primary.gray, border: 'rgba(107, 114, 128, 0.40)' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen lg:ml-60 lg:pt-0" style={{ backgroundColor: colors.primary.cream }}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary.gold }}></div>
            <p className="text-sm font-medium" style={{ color: colors.primary.gray }}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen lg:ml-60  lg:pt-0" style={{ backgroundColor: colors.primary.cream }}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: colors.primary.navy }}>
              Error Loading Dashboard
            </h2>
            <p className="text-sm mb-4" style={{ color: colors.primary.gray }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{ backgroundColor: colors.primary.gold }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full lg:ml-60" style={{ backgroundColor: colors.primary.cream }}>
    <div className="w-full p-4 md:p-6">
        
        {/* Header Section */}
        <div 
          className="rounded-xl p-5 md:p-6 mb-5"
          style={{
            background: colors.gradients.card,
            border: `2px solid ${colors.primary.gold}40`,
            boxShadow: '0 10px 30px rgba(31, 40, 57, 0.08)'
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{
                  background: colors.gradients.text,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {getGreeting()}, {user?.name || 'Court Clerk'}!
              </h1>
              <p className="text-sm font-medium" style={{ color: colors.primary.gray }}>
                {getCurrentDate()}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              {/* <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: `${colors.primary.gold}10`,
                  color: colors.primary.gold,
                  border: `1px solid ${colors.primary.gold}40`
                }}
              >
                🔄 Refresh
              </button> */}

              <div 
                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2"
                style={{
                  background: colors.gradients.card,
                  borderColor: `${colors.primary.gold}40`
                }}
              >
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary.gold}20` }}>
                  <LegalIcons.Scale style={{ color: colors.primary.gold }} />
                </div>
                <div>
                  {/* <div className="text-sm font-bold" style={{ color: colors.primary.navy }}>Court Active</div> */}
                  {/* <div className="text-xs font-medium" style={{ color: colors.primary.gray }}>
                    {isOnline ? 'System operational' : 'Offline mode'}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Total Cases', value: dashboardData.stats.totalCases, icon: LegalIcons.TotalCases, color: colors.primary.gold },
            { label: 'Active Cases', value: dashboardData.stats.activeCases, icon: LegalIcons.ActiveCases, color: colors.status.success },
            { label: 'Pending Cases', value: dashboardData.stats.pendingCases, icon: LegalIcons.PendingCases, color: colors.status.warning }
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-lg cursor-pointer"
              style={{
                background: colors.gradients.card,
                borderColor: `${colors.primary.navy}20`
              }}
            >
              <div className="flex items-center">
                <div 
                  className="p-3 rounded-lg mr-3"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: colors.primary.navy }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium" style={{ color: colors.primary.gray }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Cases */}
          <div 
            className="rounded-2xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl"
            style={{
              background: colors.gradients.card,
              border: `2px solid ${colors.primary.navy}20`,
              boxShadow: '0 10px 40px rgba(31, 40, 57, 0.08)'
            }}
          >
            <div 
              className="p-5 border-b-2 flex items-center justify-between"
              style={{
                borderColor: `${colors.primary.gold}40`,
                background: `linear-gradient(135deg, ${colors.primary.gold}08, transparent)`
              }}
            >
              <div className="flex items-center">
                <div 
                  className="p-2 rounded-lg mr-3"
                  style={{ backgroundColor: `${colors.primary.gold}15` }}
                >
                  <LegalIcons.TotalCases style={{ color: colors.primary.gold }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: colors.primary.navy }}>
                  {language === 'ta' ? 'हालिया मामले' : 'Recent Cases'}
                </h3>
              </div>
              
              <Link
                to="/clerk/cases"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{
                  color: colors.primary.gold,
                  backgroundColor: `${colors.primary.gold}10`,
                  border: `1px solid ${colors.primary.gold}30`,
                  textDecoration: 'none'
                }}
              >
                View All →
              </Link>
            </div>
            
            <div className="p-4 space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar">
              {dashboardData.recentCases.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: colors.primary.gray }}>
                    No recent cases found
                  </p>
                </div>
              ) : (
                dashboardData.recentCases.map((caseItem) => {
                  const priorityColors = getPriorityColor(caseItem.priority);
                  return (
                    <Link
                      key={caseItem.id}
                      to={`/clerk/case/${caseItem.id}`}
                      className="block rounded-xl p-4 border transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderColor: `${colors.primary.navy}15`,
                        textDecoration: 'none'
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center flex-1 min-w-0">
                          <div 
                            className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                            style={{ backgroundColor: colors.primary.gold }}
                          ></div>
                          <span 
                            className="text-sm font-bold truncate"
                            style={{ color: colors.primary.navy }}
                          >
                            {caseItem.number}
                          </span>
                        </div>
                        
                        <span 
                          className="px-2.5 py-1 text-xs font-bold rounded-full ml-2 flex-shrink-0"
                          style={{
                            backgroundColor: priorityColors.background,
                            color: priorityColors.text,
                            border: `1px solid ${priorityColors.border}`
                          }}
                        >
                          {caseItem.priority}
                        </span>
                      </div>
                      
                      <p 
                        className="text-sm mb-3 truncate"
                        style={{ color: colors.primary.gray }}
                      >
                        {caseItem.title}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: `${colors.primary.navy}10` }}>
                        <div className="flex items-center">
                          <div 
                            className="w-1.5 h-1.5 rounded-full mr-1.5"
                            style={{
                              backgroundColor: caseItem.status === 'Active' ? colors.status.success : colors.status.warning
                            }}
                          ></div>
                          <span 
                            className="text-xs font-semibold"
                            style={{
                              color: caseItem.status === 'Active' ? colors.status.success : colors.status.warning
                            }}
                          >
                            {caseItem.status}
                          </span>
                        </div>
                        
                        <span className="text-xs font-medium" style={{ color: colors.primary.gray }}>
                          {caseItem.lastUpdate}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Hearings */}
          <div 
            className="rounded-2xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl"
            style={{
              background: colors.gradients.card,
              border: `2px solid ${colors.primary.navy}20`,
              boxShadow: '0 10px 40px rgba(31, 40, 57, 0.08)'
            }}
          >
            <div 
              className="p-5 border-b-2 flex items-center justify-between"
              style={{
                borderColor: `${colors.primary.gold}40`,
                background: `linear-gradient(135deg, ${colors.primary.gold}08, transparent)`
              }}
            >
              <div className="flex items-center">
                <div 
                  className="p-2 rounded-lg mr-3"
                  style={{ backgroundColor: `${colors.primary.gold}15` }}
                >
                  <LegalIcons.Hearings style={{ color: colors.primary.gold }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: colors.primary.navy }}>
                  {language === 'ta' ? 'आगामी सुनवाई' : 'Upcoming Hearings'}
                </h3>
              </div>
              
              <Link
                to="/clerk/calendar"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{
                  color: colors.primary.gold,
                  backgroundColor: `${colors.primary.gold}10`,
                  border: `1px solid ${colors.primary.gold}30`,
                  textDecoration: 'none'
                }}
              >
                Calendar →
              </Link>
            </div>
            
            <div className="p-4 space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar">
              {dashboardData.upcomingHearings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: colors.primary.gray }}>
                    No upcoming hearings scheduled
                  </p>
                </div>
              ) : (
                dashboardData.upcomingHearings.map((hearing) => (
                  <div
                    key={hearing.id}
                    className="rounded-xl p-4 border transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      borderColor: `${colors.primary.navy}15`
                    }}
                  >
                    <div className="flex items-start mb-3">
                      <div 
                        className="p-2 rounded-lg mr-3 flex-shrink-0"
                        style={{
                          backgroundColor: `${colors.primary.gold}15`,
                          border: `1px solid ${colors.primary.gold}30`
                        }}
                      >
                        <LegalIcons.Hearings style={{ color: colors.primary.gold, width: '20px', height: '20px' }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm mb-1 truncate" style={{ color: colors.primary.navy }}>
                          {hearing.caseNumber}
                        </div>
                        <div className="text-xs truncate" style={{ color: colors.primary.gray }}>
                          {hearing.title}
                        </div>
                      </div>
                      
                      <span 
                        className="px-2 py-1 text-xs font-bold rounded-full ml-2 flex-shrink-0"
                        style={{
                          backgroundColor: `${colors.status.info}15`,
                          color: colors.status.info,
                          border: `1px solid ${colors.status.info}40`
                        }}
                      >
                        {hearing.date}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div 
                        className="flex items-center px-2 py-1.5 rounded"
                        style={{ backgroundColor: `${colors.primary.gold}08` }}
                      >
                        <svg className="w-3.5 h-3.5 mr-1.5" style={{ color: colors.primary.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold truncate" style={{ color: colors.primary.navy }}>
                          {hearing.time}
                        </span>
                      </div>
                      
                      <div 
                        className="flex items-center px-2 py-1.5 rounded"
                        style={{ backgroundColor: `${colors.primary.gold}08` }}
                      >
                        <svg className="w-3.5 h-3.5 mr-1.5" style={{ color: colors.primary.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-semibold truncate" style={{ color: colors.primary.navy }}>
                          {hearing.court}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: `${colors.primary.navy}10` }}>
                      <div className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1.5" style={{ color: colors.primary.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs font-medium truncate" style={{ color: colors.primary.gray }}>
                          {hearing.judge}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 40, 57, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(182, 157, 116, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(182, 157, 116, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
