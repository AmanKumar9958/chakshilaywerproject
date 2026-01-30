import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  FiClock, FiCheckCircle, FiAlertCircle, FiSearch, FiFilter, FiCalendar,
  FiDownload, FiPlus, FiEdit3, FiTrash2, FiEye, FiStar, FiBookOpen,
  FiTrendingUp, FiTarget, FiMoreVertical, FiArchive, FiVideo,
  FiFileText, FiMic, FiAward, FiUpload, FiX
} from 'react-icons/fi';

// API Configuration
const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || ''}/api`;

// Legal-themed color palette
const colors = {
  background: '#f5f5ef',
  text: {
    primary: '#1f2839',
    secondary: '#6b7280',
    accent: '#b69d74'
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    processing: '#b69d74'
  },
  overlay: {
    light: 'rgba(255, 255, 255, 0.06)',
    medium: 'rgba(255, 255, 255, 0.08)'
  },
  golden: {
    light: 'rgba(182, 157, 116, 0.08)',
    medium: 'rgba(182, 157, 116, 0.12)',
    dark: 'rgba(182, 157, 116, 0.15)'
  },
  border: {
    light: 'rgba(182, 157, 116, 0.40)',
    medium: 'rgba(182, 157, 116, 0.50)',
    navy: 'rgba(31, 40, 57, 0.15)'
  }
};

const Assignments = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [starredAssignments, setStarredAssignments] = useState(new Set());

  // Assignment Form State - UPDATED: Removed assignmentType and submissionType
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: 'General',
    dueDate: '',
    priority: 'medium',
    description: '',
    estimatedTime: ''
  });

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Assignments Data (loaded from API)
  const [assignments, setAssignments] = useState([]);

  const normalizeAssignment = (assignment) => ({
    ...assignment,
    id: assignment.id || assignment._id,
    dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 10) : assignment.dueDate
  });

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/assignments`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data.map(normalizeAssignment) : [];
      setAssignments(list);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Get assignments by tab
  const getTabAssignments = useMemo(() => {
    if (activeTab === 'all') return assignments;
    if (activeTab === 'upcoming') return assignments.filter(a => a.status === 'pending');
    if (activeTab === 'in-progress') return assignments.filter(a => a.status === 'in-progress');
    if (activeTab === 'completed') return assignments.filter(a => a.status === 'completed');
    if (activeTab === 'overdue') {
      const now = new Date();
      return assignments.filter(a => 
        a.status !== 'completed' && new Date(a.dueDate) < now
      );
    }
    return assignments;
  }, [activeTab, assignments]);

  // Filtered and sorted assignments
  const filteredAssignments = useMemo(() => {
    let filtered = getTabAssignments.filter(assignment => {
      const matchesSearch = assignment.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || assignment.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [getTabAssignments, searchQuery, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Priority Colors
  const getPriorityColor = (priority) => {
    const colorMap = {
      high: { bg: 'rgba(239, 68, 68, 0.15)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.40)' },
      medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.40)' },
      low: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.40)' }
    };
    return colorMap[priority] || colorMap.medium;
  };

  // Status Colors
  const getStatusColor = (status) => {
    const colorMap = {
      pending: { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.40)' },
      'in-progress': { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.40)' },
      completed: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.40)' },
      overdue: { bg: 'rgba(239, 68, 68, 0.15)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.40)' }
    };
    return colorMap[status] || colorMap.pending;
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: newAssignment.title,
        course: newAssignment.course || 'General',
        dueDate: newAssignment.dueDate,
        priority: newAssignment.priority,
        description: newAssignment.description,
        estimatedTime: newAssignment.estimatedTime
      };

      const res = await fetch(`${API_BASE_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to create assignment');
      }

      const created = normalizeAssignment(data.data);
      setAssignments((prev) => [created, ...prev]);
      setShowNewAssignmentModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert(error.message || 'Failed to create assignment');
    }
  };

  // Reset Form
  const resetForm = () => {
    setNewAssignment({
      title: '',
      course: 'General',
      dueDate: '',
      priority: 'medium',
      description: '',
      estimatedTime: ''
    });
    setUploadedFile(null);
    setUploadProgress(0);
  };

  // Toggle Star
  const toggleStar = (id) => {
    const newStarred = new Set(starredAssignments);
    if (newStarred.has(id)) {
      newStarred.delete(id);
    } else {
      newStarred.add(id);
    }
    setStarredAssignments(newStarred);
  };

  return (
    <div className="min-h-screen lg:ml-60 pt-16 lg:pt-0" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text.primary }}>
              Assignments
            </h1>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Manage and track your legal assignments
            </p>
          </div>
          
          <button
            onClick={() => setShowNewAssignmentModal(true)}
            className="px-4 py-2 rounded-lg font-semibold text-white flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
            style={{ background: `linear-gradient(135deg, ${colors.text.accent}, ${colors.text.accent}DD)` }}
          >
            <FiPlus /> New Assignment
          </button>
        </div>

        {/* Stats Cards - UPDATED: Removed "In Progress" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Total', count: assignments.length, icon: <FiFileText />, color: colors.text.accent },
            { label: 'Pending', count: assignments.filter(a => a.status === 'pending').length, icon: <FiClock />, color: colors.status.warning },
            { label: 'Completed', count: assignments.filter(a => a.status === 'completed').length, icon: <FiCheckCircle />, color: colors.status.success }
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: colors.border.navy
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: colors.text.primary }}>
                    {stat.count}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <div style={{ color: stat.color, fontSize: '24px' }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b" style={{ borderColor: colors.border.navy }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
            { key: 'overdue', label: 'Overdue' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 font-semibold border-b-2 transition-colors"
              style={{
                color: activeTab === tab.key ? colors.text.accent : colors.text.secondary,
                borderColor: activeTab === tab.key ? colors.text.accent : 'transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.text.secondary }} />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-60"
              style={{
                backgroundColor: 'white',
                borderColor: colors.border.navy,
                color: colors.text.primary
              }}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg border-2 font-semibold flex items-center gap-2 transition-colors"
            style={{
              borderColor: colors.border.navy,
              color: colors.text.primary,
              backgroundColor: showFilters ? colors.golden.light : 'white'
            }}
          >
            <FiFilter /> Filters
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className="px-3 py-2 rounded-lg border-2 transition-colors"
              style={{
                borderColor: colors.border.navy,
                backgroundColor: viewMode === 'table' ? colors.golden.light : 'white',
                color: colors.text.primary
              }}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="px-3 py-2 rounded-lg border-2 transition-colors"
              style={{
                borderColor: colors.border.navy,
                backgroundColor: viewMode === 'grid' ? colors.golden.light : 'white',
                color: colors.text.primary
              }}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Filters Panel - UPDATED: Removed "Type" filter */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border-2" style={{ borderColor: colors.border.navy, backgroundColor: 'white' }}>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: colors.border.navy }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: colors.border.navy }}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Assignments List */}
        {viewMode === 'table' ? (
          <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: colors.border.navy, backgroundColor: 'white' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.golden.light }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.primary }}>
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.primary }}>
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.primary }}>
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.primary }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.primary }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment) => {
                    const priorityColors = getPriorityColor(assignment.priority);
                    const statusColors = getStatusColor(assignment.status);
                    
                    return (
                      <tr 
                        key={assignment.id}
                        className="border-b transition-colors hover:bg-opacity-50"
                        style={{ borderColor: colors.border.navy }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleStar(assignment.id)}
                              className="focus:outline-none"
                            >
                              <FiStar
                                className={starredAssignments.has(assignment.id) ? 'fill-current' : ''}
                                style={{ color: starredAssignments.has(assignment.id) ? colors.status.warning : colors.text.secondary }}
                              />
                            </button>
                            <div>
                              <h4 className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                                {assignment.title}
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm" style={{ color: colors.text.secondary }}>
                            <FiCalendar className="mr-2" />
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 text-xs font-medium rounded-full capitalize"
                            style={{
                              backgroundColor: priorityColors.bg,
                              color: priorityColors.text,
                              border: `1px solid ${priorityColors.border}`
                            }}
                          >
                            {assignment.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 text-xs font-medium rounded-full capitalize"
                            style={{
                              backgroundColor: statusColors.bg,
                              color: statusColors.text,
                              border: `1px solid ${statusColors.border}`
                            }}
                          >
                            {assignment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors" style={{ color: colors.text.accent }}>
                              <FiEye />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors" style={{ color: colors.text.accent }}>
                              <FiEdit3 />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors" style={{ color: '#dc2626' }}>
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssignments.map((assignment) => {
              const priorityColors = getPriorityColor(assignment.priority);
              const statusColors = getStatusColor(assignment.status);
              
              return (
                <div
                  key={assignment.id}
                  className="rounded-xl p-5 border-2 transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: 'white',
                    borderColor: colors.border.navy
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <button onClick={() => toggleStar(assignment.id)}>
                      <FiStar
                        className={starredAssignments.has(assignment.id) ? 'fill-current' : ''}
                        style={{ color: starredAssignments.has(assignment.id) ? colors.status.warning : colors.text.secondary }}
                      />
                    </button>
                    <span
                      className="px-2 py-1 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: priorityColors.bg,
                        color: priorityColors.text,
                        border: `1px solid ${priorityColors.border}`
                      }}
                    >
                      {assignment.priority}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2" style={{ color: colors.text.primary }}>
                    {assignment.title}
                  </h3>

                  <p className="text-sm mb-3 line-clamp-2" style={{ color: colors.text.secondary }}>
                    {assignment.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm" style={{ color: colors.text.secondary }}>
                      <FiCalendar className="mr-1" />
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <span
                      className="px-2 py-1 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        border: `1px solid ${statusColors.border}`
                      }}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t" style={{ borderColor: colors.border.navy }}>
                    <button className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-colors" style={{ backgroundColor: colors.golden.light, color: colors.text.accent }}>
                      View
                    </button>
                    <button className="px-3 py-2 rounded-lg border-2 transition-colors" style={{ borderColor: colors.border.navy, color: colors.text.primary }}>
                      <FiEdit3 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* New Assignment Modal - UPDATED: Removed Assignment Type and Submission Type */}
        {showNewAssignmentModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setShowNewAssignmentModal(false)}
          >
            <div
              className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: 'white' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 p-6 border-b flex items-center justify-between" style={{ backgroundColor: colors.golden.light, borderColor: colors.border.navy }}>
                <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                  New Assignment
                </h2>
                <button
                  onClick={() => setShowNewAssignmentModal(false)}
                  className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                  style={{ color: colors.text.primary }}
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: colors.border.navy }}
                    placeholder="Enter assignment title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Course <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAssignment.course}
                    onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: colors.border.navy }}
                    placeholder="e.g., Contract Law"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none"
                      style={{ borderColor: colors.border.navy }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                      Priority
                    </label>
                    <select
                      value={newAssignment.priority}
                      onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none"
                      style={{ borderColor: colors.border.navy }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={newAssignment.estimatedTime}
                    onChange={(e) => setNewAssignment({ ...newAssignment, estimatedTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none"
                    style={{ borderColor: colors.border.navy }}
                    placeholder="e.g., 3 hours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Description
                  </label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none resize-none"
                    style={{ borderColor: colors.border.navy }}
                    placeholder="Enter assignment details..."
                  />
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.text.primary }}>
                    Upload Assignment File (PDF/JPG)
                  </label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-opacity-60"
                    style={{ borderColor: colors.border.light }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {uploadedFile ? (
                      <div>
                        <FiCheckCircle size={48} className="mx-auto mb-2" style={{ color: colors.status.success }} />
                        <p className="font-semibold" style={{ color: colors.text.primary }}>
                          {uploadedFile.name}
                        </p>
                        {uploadProgress < 100 && (
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%`, backgroundColor: colors.status.success }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <FiUpload size={48} className="mx-auto mb-2" style={{ color: colors.text.secondary }} />
                        <p style={{ color: colors.text.secondary }}>
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
                          PDF, JPG, PNG (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewAssignmentModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 rounded-lg font-semibold border-2 transition-colors"
                    style={{ borderColor: colors.border.navy, color: colors.text.primary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${colors.text.accent}, ${colors.text.accent}DD)` }}
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
