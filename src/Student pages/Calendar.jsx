import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiDownload, FiRefreshCw, FiCheck, FiCalendar, FiAlertCircle } from 'react-icons/fi';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

  // Color palette matching sidebar
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
    lightGray: '#f9fafb'
  };

  // Check if Google Calendar is connected
  useEffect(() => {
    const checkConnection = () => {
      const accessToken = localStorage.getItem('google_calendar_access_token');
      setIsConnected(!!accessToken);
      return !!accessToken;
    };

    const loadEvents = async () => {
      if (checkConnection()) {
        await fetchGoogleCalendarEvents();
      } else {
        // Load mock events if not connected
        setEvents([
          { id: 1, title: 'Moot Court Practice', date: new Date(2024, 0, 15), type: 'academic', priority: 'high' },
          { id: 2, title: 'Internship Application Deadline', date: new Date(2024, 0, 20), type: 'career', priority: 'medium' },
          { id: 3, title: 'Contract Law Exam', date: new Date(2024, 0, 25), type: 'exam', priority: 'high' },
          { id: 4, title: 'Legal Research Workshop', date: new Date(2024, 0, 18), type: 'academic', priority: 'low' },
          { id: 5, title: 'Legal Writing Submission', date: new Date(2024, 0, 22), type: 'academic', priority: 'medium' },
          { id: 6, title: 'Career Fair', date: new Date(2024, 0, 28), type: 'career', priority: 'medium' },
          { id: 7, title: 'Supreme Court Hearing Observation', date: new Date(2024, 0, 16), type: 'court', priority: 'high' },
          { id: 8, title: 'Bar Council Meeting', date: new Date(2024, 0, 19), type: 'professional', priority: 'low' },
        ]);
      }
      setLoading(false);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Connect to Google Calendar
  const handleConnectGoogle = async () => {
    try {
      const response = await fetch(`${API_URL}/calendar/auth/google`);
      const data = await response.json();
      
      if (data.success && data.url) {
        // Open Google OAuth popup
        const authWindow = window.open(
          data.url,
          'Google Calendar Auth',
          'width=600,height=700,left=200,top=100'
        );

        // Listen for auth success message
        const handleMessage = (event) => {
          if (event.data.type === 'GOOGLE_CALENDAR_AUTH_SUCCESS') {
            const { access_token, refresh_token } = event.data.tokens;
            localStorage.setItem('google_calendar_access_token', access_token);
            if (refresh_token) {
              localStorage.setItem('google_calendar_refresh_token', refresh_token);
            }
            setIsConnected(true);
            window.removeEventListener('message', handleMessage);
            
            // Fetch events after connection
            fetchGoogleCalendarEvents();
          }
        };

        window.addEventListener('message', handleMessage);
      }
    } catch (error) {
      console.error('Google Calendar connection error:', error);
      setError('Failed to connect to Google Calendar');
    }
  };

  // Fetch Google Calendar Events
  const fetchGoogleCalendarEvents = async () => {
    const accessToken = localStorage.getItem('google_calendar_access_token');
    if (!accessToken) {
      setError('Not authenticated with Google Calendar');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get events for current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await fetch(
        `${API_URL}/calendar/events?timeMin=${startOfMonth.toISOString()}&timeMax=${endOfMonth.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        // Transform Google Calendar events to our format
        const transformedEvents = data.events.map((event, index) => ({
          id: event.id || index,
          title: event.summary || 'No Title',
          date: new Date(event.start.dateTime || event.start.date),
          type: categorizeEventType(event.summary),
          priority: determinePriority(event),
          description: event.description,
          location: event.location,
          googleEventId: event.id
        }));

        setEvents(transformedEvents);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
      setError('Failed to fetch calendar events');
      
      // If auth error, clear tokens
      if (error.message.includes('401') || error.message.includes('authentication')) {
        localStorage.removeItem('google_calendar_access_token');
        localStorage.removeItem('google_calendar_refresh_token');
        setIsConnected(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Categorize event type based on title/description
  const categorizeEventType = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('exam') || lowerTitle.includes('test')) return 'exam';
    if (lowerTitle.includes('career') || lowerTitle.includes('job') || lowerTitle.includes('interview')) return 'career';
    if (lowerTitle.includes('court') || lowerTitle.includes('hearing')) return 'court';
    if (lowerTitle.includes('meeting') || lowerTitle.includes('conference')) return 'professional';
    return 'academic';
  };

  // Determine priority based on event details
  const determinePriority = (event) => {
    const title = event.summary?.toLowerCase() || '';
    if (title.includes('urgent') || title.includes('exam') || title.includes('court')) return 'high';
    if (title.includes('important') || title.includes('deadline')) return 'medium';
    return 'low';
  };

  // Sync with Google Calendar
  const handleSync = async () => {
    if (!isConnected) {
      await handleConnectGoogle();
      return;
    }

    setSyncStatus('syncing');
    
    try {
      await fetchGoogleCalendarEvents();
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  // Export calendar data
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

  const navigateMonth = async (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    
    // Fetch events for new month if connected
    if (isConnected) {
      await fetchGoogleCalendarEvents();
    }
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
            {isToday && (
              <span className="w-2 h-2 bg-[#b69d74] rounded-full animate-pulse" />
            )}
          </div>
          
          <div className="mt-1 flex flex-wrap gap-1 justify-center">
            {dayEvents.slice(0, isMobile ? 2 : 3).map(event => (
              <span 
                key={event.id} 
                className={`
                  w-2 h-2 rounded-full
                  ${event.type === 'exam' ? 'bg-[#f59e0b]' :
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

  if (loading) {
    return (
      <div className="min-h-screen lg:ml-60 pt-16 lg:pt-0 flex items-center justify-center" style={{ background: colors.cream }}>
        <div className="text-center">
          <FiRefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: colors.golden }} />
          <p className="text-lg font-semibold" style={{ color: colors.navy }}>Loading Calendar...</p>
        </div>
      </div>
    );
  }

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
                  {isConnected ? 'Synced with Google Calendar' : 'Manage your schedule and deadlines'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {!isConnected && (
              <button
                onClick={handleConnectGoogle}
                className="flex items-center px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-all duration-200 hover:shadow-md text-white"
                style={{
                  background: `linear-gradient(135deg, #4285f4, #357ae8)`
                }}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                Connect Google Calendar
              </button>
            )}
            
            <button
              onClick={handleSync}
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
                  {isConnected ? 'Sync' : 'Connect to Sync'}
                </>
              )}
            </button>
            
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

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
            <FiAlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
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
                      {event.location && (
                        <p className="text-xs mb-1" style={{ color: colors.gray }}>
                          📍 {event.location}
                        </p>
                      )}
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
                This Month
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg"
                  style={{ background: 'rgba(182, 157, 116, 0.1)' }}
                >
                  <div className="text-2xl font-bold" style={{ color: colors.golden }}>
                    {events.filter(e => e.date.getMonth() === currentDate.getMonth()).length}
                  </div>
                  <div className="text-xs" style={{ color: colors.gray }}>Total Events</div>
                </div>
                <div className="text-center p-3 rounded-lg"
                  style={{ background: 'rgba(245, 158, 11, 0.1)' }}
                >
                  <div className="text-2xl font-bold text-[#f59e0b]">
                    {events.filter(e => e.priority === 'high' && e.date.getMonth() === currentDate.getMonth()).length}
                  </div>
                  <div className="text-xs" style={{ color: colors.gray }}>Urgent</div>
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
