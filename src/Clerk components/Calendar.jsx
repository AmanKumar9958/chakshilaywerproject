import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiDownload, FiRefreshCw, FiCheck, FiCalendar } from 'react-icons/fi';

const Calendar = () => {
  const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || ''}/api`;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isMobile, setIsMobile] = useState(false);
  
  // Google Calendar States
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
    lightGray: '#f9fafb'
  };

  const localEvents = [
    { id: 1, title: 'Moot Court Practice', date: new Date(2025, 0, 15), type: 'academic', priority: 'high' },
    { id: 2, title: 'Internship Application Deadline', date: new Date(2025, 0, 20), type: 'career', priority: 'medium' },
    { id: 3, title: 'Contract Law Exam', date: new Date(2025, 0, 25), type: 'exam', priority: 'high' },
    { id: 4, title: 'Legal Research Workshop', date: new Date(2025, 0, 18), type: 'academic', priority: 'low' },
    { id: 5, title: 'Legal Writing Submission', date: new Date(2025, 0, 22), type: 'academic', priority: 'medium' },
    { id: 6, title: 'Career Fair', date: new Date(2025, 0, 28), type: 'career', priority: 'medium' },
    { id: 7, title: 'Supreme Court Hearing Observation', date: new Date(2025, 0, 16), type: 'court', priority: 'high' },
    { id: 8, title: 'Bar Council Meeting', date: new Date(2025, 0, 19), type: 'professional', priority: 'low' },
  ];

  // Combine local and Google events
  const events = [...localEvents, ...googleEvents];

  // ============= GOOGLE CALENDAR FUNCTIONS =============

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/auth/google`);
      const data = await response.json();
      
      // Open Google OAuth in same window
      window.location.href = data.url || data.authUrl;
    } catch (error) {
      console.error('Google login error:', error);
      alert('Failed to connect to Google Calendar');
    }
  };

  const checkGoogleAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/events`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsGoogleAuthenticated(true);
        const data = await response.json();
        
        // Convert Google events to our format
        const formattedEvents = data.events.map(event => ({
          id: `google-${event.id}`,
          title: event.summary,
          date: new Date(event.start.dateTime || event.start.date),
          type: 'google',
          priority: 'medium',
          source: 'google',
          googleEventId: event.id
        }));
        
        setGoogleEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Not authenticated with Google');
    }
  };

  const syncToGoogle = async (event) => {
    if (!isGoogleAuthenticated) {
      alert('Please connect to Google Calendar first');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/calendar/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          summary: event.title,
          description: `Type: ${event.type}\nPriority: ${event.priority}`,
          start: event.date.toISOString(),
          end: new Date(event.date.getTime() + 60*60*1000).toISOString(),
          location: 'Academic Calendar'
        })
      });
      
      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  };

  const syncAllToGoogle = async () => {
    if (!isGoogleAuthenticated) {
      alert('Please connect to Google Calendar first');
      return;
    }

    setSyncStatus('syncing');
    setSyncing(true);
    let successCount = 0;
    
    try {
      for (const event of localEvents) {
        const success = await syncToGoogle(event);
        if (success) successCount++;
      }
      
      setSyncStatus('synced');
      alert(`✓ Successfully synced ${successCount}/${localEvents.length} events to Google Calendar!`);
      await checkGoogleAuth();
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Bulk sync error:', error);
      alert('Some events failed to sync');
      setSyncStatus('idle');
    } finally {
      setSyncing(false);
    }
  };

  const refreshGoogleEvents = async () => {
    setSyncStatus('syncing');
    try {
      await checkGoogleAuth();
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Refresh error:', error);
      setSyncStatus('idle');
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Check Google authentication on mount
    checkGoogleAuth();
    
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      checkGoogleAuth();
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSync = () => {
    if (isGoogleAuthenticated) {
      refreshGoogleEvents();
    } else {
      handleGoogleLogin();
    }
  };

  const handleExport = () => {
    const calendarData = {
      events: events.map(event => ({
        ...event,
        date: event.date.toISOString()
      }))
    };
    const blob = new Blob([JSON.stringify(calendarData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-calendar-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDaysUntilEvent = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);
    const diffTime = eventDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-transparent rounded-lg" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events.filter(event => 
        event.date.getDate() === day && 
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
      );
      
      const isSelected = selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      const isToday = new Date().getDate() === day && 
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      const hasHighPriority = dayEvents.some(event => event.priority === 'high');
      const hasGoogleEvent = dayEvents.some(event => event.source === 'google');

      days.push(
        <div 
          key={day} 
          className={`
            h-24 p-2 border rounded-lg transition-all duration-200 cursor-pointer flex flex-col relative
            ${isSelected 
              ? 'border-[#b69d74] bg-[rgba(182,157,116,0.1)] shadow-md' 
              : 'border-[rgba(182,157,116,0.2)] hover:border-[#b69d74] hover:bg-[rgba(182,157,116,0.05)]'
            }
            ${isToday && !isSelected ? 'bg-[rgba(182,157,116,0.08)] border-[#b69d74]' : ''}
            ${hasHighPriority ? 'ring-2 ring-[#f59e0b] ring-opacity-20' : ''}
          `}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-start">
            <span className={`
              text-sm font-semibold
              ${isSelected ? 'text-[#b69d74]' : isToday ? 'text-[#b69d74]' : 'text-[#1f2839]'}
            `}>
              {day}
            </span>
            <div className="flex gap-1">
              {isToday && (
                <span className="w-2 h-2 bg-[#b69d74] rounded-full animate-pulse" />
              )}
              {hasGoogleEvent && (
                <svg className="w-3 h-3 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.7 12h-7.2v2.7h4.7c-.5 2.1-2.4 3.5-4.7 3.5-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2c1.2 0 2.4.4 3.3 1.2l2-2c-1.5-1.4-3.4-2.2-5.3-2.2-4.4 0-8 3.6-8 8s3.6 8 8 8c4.1 0 7.5-2.9 7.5-8 0-.5 0-1-.1-1.5z"/>
                </svg>
              )}
            </div>
          </div>
          
          <div className="mt-1 flex flex-wrap gap-1 justify-center">
            {dayEvents.slice(0, isMobile ? 2 : 3).map(event => (
              <span 
                key={event.id} 
                className={`
                  w-2 h-2 rounded-full
                  ${event.source === 'google' ? 'bg-[#4285F4]' :
                    event.type === 'exam' ? 'bg-[#f59e0b]' :
                    event.type === 'career' ? 'bg-[#10b981]' : 
                    event.type === 'court' ? 'bg-[#3b82f6]' :
                    event.type === 'professional' ? 'bg-[#8b5cf6]' : 'bg-[#b69d74]'
                  }
                  ${event.priority === 'high' ? 'ring-1 ring-white' : ''}
                `}
                title={`${event.title} (${event.priority} priority)`}
              />
            ))}
            {dayEvents.length > (isMobile ? 2 : 3) && (
              <span className="text-xs font-medium" style={{ color: colors.gray }}>
                +{dayEvents.length - (isMobile ? 2 : 3)}
              </span>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const getEventsForSelectedDate = () => {
    return events.filter(event => 
      event.date.getDate() === selectedDate.getDate() && 
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
  };

  const getEventTypeColor = (type) => {
    if (type === 'google') {
      return 'bg-[rgba(66,133,244,0.1)] text-[#4285F4] border-[rgba(66,133,244,0.3)]';
    }
    switch (type) {
      case 'exam': 
        return 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border-[rgba(245,158,11,0.3)]';
      case 'career': 
        return 'bg-[rgba(16,185,129,0.1)] text-[#10b981] border-[rgba(16,185,129,0.3)]';
      case 'court': 
        return 'bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.3)]';
      case 'professional': 
        return 'bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] border-[rgba(139,92,246,0.3)]';
      case 'academic': 
        return 'bg-[rgba(182,157,116,0.1)] text-[#b69d74] border-[rgba(182,157,116,0.3)]';
      default: 
        return 'bg-[rgba(107,114,128,0.1)] text-[#6b7280] border-[rgba(107,114,128,0.3)]';
    }
  };

  const getEventTypeLabel = (type) => {
    if (type === 'google') return 'Google';
    switch (type) {
      case 'exam': return 'Exam';
      case 'career': return 'Career';
      case 'court': return 'Court';
      case 'professional': return 'Professional';
      case 'academic': return 'Academic';
      default: return 'Event';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="w-2 h-2 bg-[#f59e0b] rounded-full ml-1 animate-pulse" title="High Priority" />;
      case 'medium':
        return <span className="w-2 h-2 bg-[#b69d74] rounded-full ml-1" title="Medium Priority" />;
      case 'low':
        return <span className="w-2 h-2 bg-[#6b7280] rounded-full ml-1" title="Low Priority" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen lg:ml-60 pt-16 lg:pt-0" style={{ background: colors.cream }}>
      {/* Header Section */}
      <div className="backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-6 mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderBottom: `1px solid rgba(182, 157, 116, 0.2)`
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(182, 157, 116, 0.15)' }}
              >
                <FiCalendar className="w-5 h-5" style={{ color: colors.golden }} />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: colors.navy }}>
                  Academic Calendar
                </h1>
                <p className="mt-1" style={{ color: colors.gray }}>
                  Manage your schedule and deadlines
                  {isGoogleAuthenticated && (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      ✓ Google Synced
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {!isGoogleAuthenticated ? (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md bg-white border border-gray-300"
                style={{ color: colors.navy }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Connect Google
              </button>
            ) : (
              <>
                <button
                  onClick={refreshGoogleEvents}
                  disabled={syncStatus === 'syncing'}
                  className={`
                    flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 text-white shadow-sm hover:shadow-md
                    ${syncStatus === 'syncing' ? 'cursor-not-allowed opacity-90' : ''}
                    ${syncStatus === 'synced' ? 'bg-[#10b981] hover:bg-[#10b981DD]' : ''}
                  `}
                  style={{
                    background: syncStatus === 'synced' ? '#10b981' : `linear-gradient(135deg, ${colors.golden}, #c8b090)`
                  }}
                >
                  {syncStatus === 'syncing' ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : syncStatus === 'synced' ? (
                    <>
                      <FiCheck className="w-4 h-4 mr-2" />
                      Synced
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </>
                  )}
                </button>
                
                <button
                  onClick={syncAllToGoogle}
                  disabled={syncing}
                  className="flex items-center px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md bg-[#4285F4] text-white disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
                  </svg>
                  {syncing ? 'Syncing All...' : 'Sync All to Google'}
                </button>
              </>
            )}
            
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-all duration-200 hover:shadow-md"
              style={{
                background: 'white',
                color: colors.navy,
                border: `1px solid rgba(182, 157, 116, 0.3)`
              }}
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="rounded-xl p-6 shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: `1px solid rgba(182, 157, 116, 0.2)`
              }}
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ background: 'rgba(182, 157, 116, 0.1)' }}
                >
                  <FiChevronLeft className="w-5 h-5" style={{ color: colors.golden }} />
                </button>
                
                <h2 className="text-xl font-bold" style={{ color: colors.navy }}>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ background: 'rgba(182, 157, 116, 0.1)' }}
                >
                  <FiChevronRight className="w-5 h-5" style={{ color: colors.golden }} />
                </button>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold py-2" style={{ color: colors.gray }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4" style={{ borderTop: `1px solid rgba(182, 157, 116, 0.2)` }}>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#4285F4] rounded-full"></span>
                    <span style={{ color: colors.gray }}>Google Calendar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#b69d74] rounded-full"></span>
                    <span style={{ color: colors.gray }}>Academic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#f59e0b] rounded-full"></span>
                    <span style={{ color: colors.gray }}>Exam</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#10b981] rounded-full"></span>
                    <span style={{ color: colors.gray }}>Career</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#3b82f6] rounded-full"></span>
                    <span style={{ color: colors.gray }}>Court</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#8b5cf6] rounded-full"></span>
                    <span style={{ color: colors.gray }}>Professional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="space-y-6">
            
            {/* Selected Date Events */}
            <div className="rounded-xl p-6 shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: `1px solid rgba(182, 157, 116, 0.2)`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: colors.navy }}>
                  {formatDate(selectedDate)}
                </h3>
                {getEventsForSelectedDate().some(event => event.priority === 'high') && (
                  <span className="text-xs px-2 py-1 rounded-full border"
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: '#f59e0b',
                      borderColor: 'rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    High Priority
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {getEventsForSelectedDate().length > 0 ? (
                  getEventsForSelectedDate().map(event => (
                    <div 
                      key={event.id} 
                      className="p-3 rounded-lg border transition-all hover:scale-[1.02]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderColor: 'rgba(182, 157, 116, 0.2)'
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getEventTypeColor(event.type)}`}>
                            {getEventTypeLabel(event.type)}
                          </span>
                          {getPriorityBadge(event.priority)}
                        </div>
                        <span className="text-sm font-medium" style={{ color: colors.gray }}>
                          {formatTime(event.date)}
                        </span>
                      </div>
                      <p className="font-semibold text-sm mb-1" style={{ color: colors.navy }}>
                        {event.title}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: colors.gray }}>
                          {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                        {event.priority === 'high' && (
                          <span className="text-xs text-[#f59e0b] font-semibold">Urgent</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(182, 157, 116, 0.1)' }}
                    >
                      <FiCalendar className="w-6 h-6" style={{ color: colors.golden }} />
                    </div>
                    <p className="text-sm" style={{ color: colors.gray }}>
                      No events scheduled
                    </p>
                    <p className="text-xs mt-1" style={{ color: colors.gray }}>
                      Perfect for focused study
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-xl p-6 shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: `1px solid rgba(182, 157, 116, 0.2)`
              }}
            >
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.navy }}>
                Upcoming Events
              </h3>
              
              <div className="space-y-3">
                {getUpcomingEvents().length > 0 ? (
                  getUpcomingEvents().map(event => {
                    const daysUntil = getDaysUntilEvent(event.date);
                    return (
                      <div 
                        key={event.id} 
                        className="p-3 rounded-lg border transition-all hover:scale-[1.02]"
                        style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderColor: 'rgba(182, 157, 116, 0.2)'
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getEventTypeColor(event.type)}`}>
                              {getEventTypeLabel(event.type)}
                            </span>
                            {getPriorityBadge(event.priority)}
                          </div>
                          <span className="text-xs" style={{ color: colors.gray }}>
                            {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="font-semibold text-sm mb-1" style={{ color: colors.navy }}>
                          {event.title}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs" style={{ color: colors.gray }}>
                            {event.date.toLocaleDateString('en-US', { weekday: 'short' })} • {formatTime(event.date)}
                          </p>
                          <span className={`text-xs font-semibold ${
                            daysUntil === 0 ? 'text-[#f59e0b]' : 
                            daysUntil <= 3 ? 'text-[#b69d74]' : 'text-[#6b7280]'
                          }`}>
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil}d`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm" style={{ color: colors.gray }}>
                      No upcoming events
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl p-6 shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: `1px solid rgba(182, 157, 116, 0.2)`
              }}
            >
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.navy }}>
                This Week
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg"
                  style={{ background: 'rgba(182, 157, 116, 0.1)' }}
                >
                  <div className="text-2xl font-bold" style={{ color: colors.golden }}>{localEvents.length}</div>
                  <div className="text-xs" style={{ color: colors.gray }}>Local Events</div>
                </div>
                <div className="text-center p-3 rounded-lg"
                  style={{ background: 'rgba(66, 133, 244, 0.1)' }}
                >
                  <div className="text-2xl font-bold text-[#4285F4]">{googleEvents.length}</div>
                  <div className="text-xs" style={{ color: colors.gray }}>Google Events</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
