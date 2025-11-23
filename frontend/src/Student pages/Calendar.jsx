import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiDownload, FiRefreshCw, FiCheck, FiCalendar } from 'react-icons/fi';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isMobile, setIsMobile] = useState(false);

  const events = [
    { id: 1, title: 'Moot Court Practice', date: new Date(2024, 0, 15), type: 'academic', priority: 'high' },
    { id: 2, title: 'Internship Application Deadline', date: new Date(2024, 0, 20), type: 'career', priority: 'medium' },
    { id: 3, title: 'Contract Law Exam', date: new Date(2024, 0, 25), type: 'exam', priority: 'high' },
    { id: 4, title: 'Legal Research Workshop', date: new Date(2024, 0, 18), type: 'academic', priority: 'low' },
    { id: 5, title: 'Legal Writing Submission', date: new Date(2024, 0, 22), type: 'academic', priority: 'medium' },
    { id: 6, title: 'Career Fair', date: new Date(2024, 0, 28), type: 'career', priority: 'medium' },
    { id: 7, title: 'Supreme Court Hearing Observation', date: new Date(2024, 0, 16), type: 'court', priority: 'high' },
    { id: 8, title: 'Bar Council Meeting', date: new Date(2024, 0, 19), type: 'professional', priority: 'low' },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }, 1500);
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-transparent rounded-lg" />
      );
    }

    // Add cells for each day of the month
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

      const dayClassNames = `
        h-24 p-2 border rounded-lg transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-[#b69d74] bg-[rgba(182,157,116,0.08)] shadow-[0_0_15px_#b69d7440]' 
          : 'border-[rgba(31,40,57,0.15)] hover:border-[#b69d7450] hover:bg-[rgba(182,157,116,0.05)]'
        }
        ${isToday && !isSelected ? 'bg-[rgba(182,157,116,0.05)] border-[#b69d7440]' : ''}
        ${hasHighPriority ? 'ring-1 ring-[#f59e0b30]' : ''}
        flex flex-col relative
      `;

      days.push(
        <div 
          key={day} 
          className={dayClassNames}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-start">
            <span className={`
              text-sm font-medium
              ${isSelected ? 'text-[#b69d74]' : isToday ? 'text-[#1f2839]' : 'text-[#1f2839]'}
              ${hasHighPriority ? 'font-bold' : ''}
            `}>
              {day}
            </span>
            {isToday && (
              <span className="w-2 h-2 bg-[#b69d74] rounded-full" />
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
                  ${event.priority === 'high' ? 'ring-1 ring-white ring-offset-1 ring-offset-[#b69d74]' : ''}
                `}
                title={`${event.title} (${event.priority} priority)`}
              />
            ))}
            {dayEvents.length > (isMobile ? 2 : 3) && (
              <span className="text-xs text-[#6b7280] font-medium">
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
        return <span className="w-2 h-2 bg-[#f59e0b] rounded-full ml-1" title="High Priority" />;
      case 'medium':
        return <span className="w-2 h-2 bg-[#b69d74] rounded-full ml-1" title="Medium Priority" />;
      case 'low':
        return <span className="w-2 h-2 bg-[#6b7280] rounded-full ml-1" title="Low Priority" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5ef]">
      {/* Header Section */}
      <div className="bg-white border-b border-[rgba(31,40,57,0.15)] px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[rgba(182,157,116,0.1)] rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-[#b69d74]" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#1f2839]">Legal Academic Calendar</h1>
                  <p className="text-[#6b7280] mt-1">Sync your personal, institutional & legal ecosystem timelines</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSync}
                disabled={syncStatus === 'syncing'}
                className={`
                  flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                  bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] hover:from-[#b69d74DD] hover:to-[#b69d74BB]
                  text-white shadow-sm hover:shadow-md
                  ${syncStatus === 'syncing' ? 'cursor-not-allowed opacity-90' : ''}
                  ${syncStatus === 'synced' ? 'bg-[#10b981] hover:bg-[#10b981DD]' : ''}
                `}
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
                    Sync Calendar
                  </>
                )}
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 rounded-lg font-medium text-sm 
                         bg-white text-[#1f2839] border border-[rgba(31,40,57,0.15)] 
                         hover:bg-[rgba(255,255,255,0.8)] shadow-sm transition-all duration-200
                         hover:border-[#b69d7450]"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Calendar Section - 2/3 width on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-[rgba(31,40,57,0.15)] shadow-sm p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg bg-[rgba(182,157,116,0.08)] hover:bg-[rgba(182,157,116,0.15)] transition-colors group"
                  >
                    <FiChevronLeft className="w-5 h-5 text-[#1f2839] group-hover:text-[#b69d74]" />
                  </button>
                  
                  <h2 className="text-xl font-semibold text-[#1f2839]">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg bg-[rgba(182,157,116,0.08)] hover:bg-[rgba(182,157,116,0.15)] transition-colors group"
                  >
                    <FiChevronRight className="w-5 h-5 text-[#1f2839] group-hover:text-[#b69d74]" />
                  </button>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-[#6b7280] py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendarDays()}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-[rgba(31,40,57,0.15)]">
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-[#b69d74] rounded-full"></span>
                      <span className="text-[#6b7280]">Academic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-[#f59e0b] rounded-full"></span>
                      <span className="text-[#6b7280]">Exam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-[#10b981] rounded-full"></span>
                      <span className="text-[#6b7280]">Career</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-[#3b82f6] rounded-full"></span>
                      <span className="text-[#6b7280]">Court</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-[#8b5cf6] rounded-full"></span>
                      <span className="text-[#6b7280]">Professional</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Sidebar - 1/3 width on large screens */}
            <div className="space-y-6">
              
              {/* Selected Date Events */}
              <div className="bg-white rounded-xl border border-[rgba(31,40,57,0.15)] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-[#1f2839]">
                    {formatDate(selectedDate)}
                  </h3>
                  {getEventsForSelectedDate().some(event => event.priority === 'high') && (
                    <span className="text-xs bg-[rgba(245,158,11,0.1)] text-[#f59e0b] px-2 py-1 rounded-full border border-[rgba(245,158,11,0.3)]">
                      High Priority
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {getEventsForSelectedDate().length > 0 ? (
                    getEventsForSelectedDate().map(event => (
                      <div 
                        key={event.id} 
                        className="p-3 rounded-lg border border-[rgba(31,40,57,0.15)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(182,157,116,0.05)] transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                              {getEventTypeLabel(event.type)}
                            </span>
                            {getPriorityBadge(event.priority)}
                          </div>
                          <span className="text-sm text-[#6b7280] font-medium">
                            {formatTime(event.date)}
                          </span>
                        </div>
                        <p className="font-medium text-[#1f2839] text-sm mb-1">{event.title}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#6b7280]">
                            {event.date.toLocaleDateString('en-US', { weekday: 'long' })}
                          </span>
                          {event.priority === 'high' && (
                            <span className="text-xs text-[#f59e0b] font-medium">Urgent</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-[rgba(182,157,116,0.08)] rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiCalendar className="w-6 h-6 text-[#b69d74]" />
                      </div>
                      <p className="text-[#6b7280] text-sm">No events scheduled for this date</p>
                      <p className="text-[#6b7280] text-xs mt-1">Perfect time for focused study</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl border border-[rgba(31,40,57,0.15)] shadow-sm p-6">
                <h3 className="font-semibold text-lg text-[#1f2839] mb-4">Upcoming Events</h3>
                
                <div className="space-y-3">
                  {getUpcomingEvents().length > 0 ? (
                    getUpcomingEvents().map(event => {
                      const daysUntil = getDaysUntilEvent(event.date);
                      return (
                        <div 
                          key={event.id} 
                          className="p-3 rounded-lg border border-[rgba(31,40,57,0.15)] hover:bg-[rgba(182,157,116,0.05)] transition-colors group"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                                {getEventTypeLabel(event.type)}
                              </span>
                              {getPriorityBadge(event.priority)}
                            </div>
                            <span className="text-xs text-[#6b7280]">
                              {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="font-medium text-[#1f2839] text-sm mb-1">{event.title}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-[#6b7280]">
                              {event.date.toLocaleDateString('en-US', { weekday: 'short' })} • {formatTime(event.date)}
                            </p>
                            <span className={`text-xs font-medium ${
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
                      <p className="text-[#6b7280] text-sm">No upcoming events scheduled</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-[rgba(31,40,57,0.15)] shadow-sm p-6">
                <h3 className="font-semibold text-lg text-[#1f2839] mb-4">This Week</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[rgba(182,157,116,0.05)] rounded-lg">
                    <div className="text-2xl font-bold text-[#b69d74]">3</div>
                    <div className="text-xs text-[#6b7280]">Academic Events</div>
                  </div>
                  <div className="text-center p-3 bg-[rgba(245,158,11,0.05)] rounded-lg">
                    <div className="text-2xl font-bold text-[#f59e0b]">1</div>
                    <div className="text-xs text-[#6b7280]">High Priority</div>
                  </div>
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