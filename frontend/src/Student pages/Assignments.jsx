import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  FiClock, FiCheckCircle, FiAlertCircle, FiSearch, FiFilter, FiCalendar,
  FiDownload, FiPlus, FiEdit3, FiTrash2, FiEye, FiStar, FiBookOpen,
  FiTrendingUp, FiTarget, FiMoreVertical, FiArchive, FiVideo, FiFileText,
  FiMic, FiAward, FiUpload, FiX
} from 'react-icons/fi';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Legal-themed color palette
const colors = {
  background: '#f5f5ef',
  text: {
    primary: '#1f2839',
    secondary: '#6b7280',
    accent: '#b69d74'
  },
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
  processing: '#b69d74',
  overlay: {
    light: 'rgba(255, 255, 255, 0.06)',
    medium: 'rgba(255, 255, 255, 0.08)',
    golden: {
      light: 'rgba(182, 157, 116, 0.08)',
      medium: 'rgba(182, 157, 116, 0.12)',
      dark: 'rgba(182, 157, 116, 0.15)'
    }
  },
  border: {
    light: 'rgba(182, 157, 116, 0.40)',
    medium: 'rgba(182, 157, 116, 0.50)',
    navy: 'rgba(31, 40, 57, 0.15)'
  }
};

const Assignments = () => {
  // State Management
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // ✅ SIMPLE STATE
  const [activeTab, setActiveTab] = useState('active');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    professor: '',
    dueDate: '',
    priority: 'medium',
    points: 100,
    description: '',
    estimatedTime: '',
    assignmentType: 'case-analysis',
    bloomLevel: 'knowledge',
    submissionType: 'document'
  });

  const modalRef = useRef(null);
  const bloomLevels = ['knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation'];

  // Fetch assignments
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`);
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setAssignments(data.data || []);
    } catch (error) {
      console.error('Error:', error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Computed values
  const getTabAssignments = () => {
    switch (activeTab) {
      case 'active': return assignments.filter(a => a.status !== 'completed' && a.status !== 'draft');
      case 'completed': return assignments.filter(a => a.status === 'completed');
      case 'drafts': return assignments.filter(a => a.status === 'draft');
      default: return assignments;
    }
  };

  const filteredAssignments = getTabAssignments().filter(assignment => 
    assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.course?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === 'completed').length,
    pending: assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => a.status === 'in-progress').length,
    drafts: assignments.filter(a => a.status === 'draft').length,
    avgProgress: 0
  };

  // Utility functions
  const getStatusColor = (status) => {
    const colors_map = {
      'completed': { text: colors.success, bg: `${colors.success}20` },
      'in-progress': { text: colors.processing, bg: `${colors.processing}20` },
      'pending': { text: colors.warning, bg: `${colors.warning}20` },
      'draft': { text: colors.text.secondary, bg: `${colors.text.secondary}20` }
    };
    return colors_map[status] || colors_map['draft'];
  };

  const getPriorityColor = (priority) => {
    const colors_map = {
      'high': { text: '#dc2626', bg: '#fef2f2' },
      'medium': { text: colors.warning, bg: `${colors.warning}20` },
      'low': { text: colors.success, bg: `${colors.success}20` }
    };
    return colors_map[priority] || colors_map['medium'];
  };

  const getBloomLevelColor = (level) => {
    const bloomColors = {
      knowledge: colors.info,
      comprehension: '#8b5cf6',
      application: colors.success,
      analysis: colors.warning,
      synthesis: colors.processing,
      evaluation: '#ec4899'
    };
    return bloomColors[level] || colors.text.secondary;
  };

  const getAssignmentTypeIcon = (type) => {
    const icons = {
      'case-analysis': FiFileText,
      'comparative-research': FiTrendingUp,
      'video-submission': FiVideo,
      'drafting-exercise': FiEdit3,
      'knowledge-check': FiAward
    };
    return icons[type] || FiBookOpen;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilDue = (dueDate) => {
    if (!dueDate) return { text: 'No due date', color: colors.text.secondary };
    const diffDays = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: 'Overdue', color: '#dc2626' };
    if (diffDays === 0) return { text: 'Due today', color: '#dc2626' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: colors.warning };
    return { text: `${diffDays} days left`, color: colors.success };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.course || !newAssignment.dueDate) {
      alert('Please fill all required fields');
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAssignment, status: 'pending', progress: 0 })
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      alert('Assignment created successfully!');
      await fetchAssignments();
      setShowUploadModal(false);
      setNewAssignment({
        title: '', course: '', professor: '', dueDate: '', priority: 'medium',
        points: 100, description: '', estimatedTime: '', assignmentType: 'case-analysis',
        bloomLevel: 'knowledge', submissionType: 'document'
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create assignment');
    } finally {
      setUploading(false);
    }
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await fetch(`${API_BASE_URL}/assignments/${id}`, { method: 'DELETE' });
      alert('Assignment deleted!');
      await fetchAssignments();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.text.accent }}></div>
        <span className="ml-2" style={{ color: colors.text.secondary }}>Loading...</span>
      </div>
    );
  }

  console.log('🎨 CURRENT VIEW MODE:', viewMode); // ✅ Debug log

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>Assignments</h1>
            <p style={{ color: colors.text.secondary }}>Manage all your legal assignments</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg"
            style={{ background: `linear-gradient(135deg, ${colors.text.accent}, ${colors.text.accent}DD)` }}
          >
            <FiUpload className="w-4 h-4 mr-2" />
            Upload Assignment
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-1 rounded-lg p-1" style={{ backgroundColor: colors.overlay.light }}>
          {[
            { key: 'active', label: 'Active', count: stats.total - stats.drafts },
            { key: 'completed', label: 'Completed', count: stats.completed },
            { key: 'drafts', label: 'Drafts', count: stats.drafts }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md"
              style={{ 
                backgroundColor: activeTab === tab.key ? colors.overlay.golden.medium : 'transparent',
                color: activeTab === tab.key ? colors.text.primary : colors.text.secondary
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: FiBookOpen, color: colors.processing },
            { label: 'Completed', value: stats.completed, icon: FiCheckCircle, color: colors.success },
            { label: 'In Progress', value: stats.inProgress, icon: FiClock, color: colors.info },
            { label: 'Pending', value: stats.pending, icon: FiAlertCircle, color: colors.warning }
          ].map((stat, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: `1px solid ${colors.border.light}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Search & Toggle */}
        <div className="rounded-lg p-4 mb-6 bg-white shadow-sm" style={{ border: `1px solid ${colors.border.light}` }}>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-2.5 h-4 w-4" style={{ color: colors.text.secondary }} />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-50"
                style={{ border: `1px solid ${colors.border.navy}` }}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ✅ THE FIX: SIMPLE TOGGLE BUTTONS */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => {
                  console.log('🔴 TABLE CLICKED');
                  setViewMode('table');
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{ 
                  backgroundColor: viewMode === 'table' ? colors.text.accent : 'transparent',
                  color: viewMode === 'table' ? 'white' : colors.text.primary,
                  border: `2px solid ${viewMode === 'table' ? colors.text.accent : colors.border.light}`
                }}
              >
                📊 Table
              </button>
              <button
                onClick={() => {
                  console.log('🟢 GRID CLICKED');
                  setViewMode('grid');
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{ 
                  backgroundColor: viewMode === 'grid' ? colors.text.accent : 'transparent',
                  color: viewMode === 'grid' ? 'white' : colors.text.primary,
                  border: `2px solid ${viewMode === 'grid' ? colors.text.accent : colors.border.light}`
                }}
              >
                🎨 Grid
              </button>
            </div>
          </div>
        </div>

        {/* ✅ DEBUG BOX */}
        <div className="bg-yellow-100 border-2 border-yellow-500 rounded p-3 mb-4">
          <strong>DEBUG:</strong> viewMode = <span className="bg-yellow-300 px-2 py-1 rounded font-mono">{viewMode}</span>
        </div>

        {/* Content */}
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <FiBookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: colors.text.accent }} />
            <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
            <button onClick={() => setShowUploadModal(true)} className="px-4 py-2 text-white rounded-lg" style={{ backgroundColor: colors.text.accent }}>
              Upload Assignment
            </button>
          </div>
        ) : (
          <div>
            {/* ✅ TABLE VIEW */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-lg border-4 border-green-500 overflow-hidden">
                <div className="bg-green-100 p-3 text-center font-bold text-green-800">
                  📊 TABLE VIEW ACTIVE
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Assignment</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAssignments.map((assignment) => {
                      const statusColors = getStatusColor(assignment.status);
                      const timeInfo = getTimeUntilDue(assignment.dueDate);
                      return (
                        <tr key={assignment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <h4 className="text-sm font-semibold">{assignment.title}</h4>
                          </td>
                          <td className="px-6 py-4 text-sm">{assignment.course}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm" style={{ color: timeInfo.color }}>{formatDate(assignment.dueDate)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 text-xs rounded" style={{ color: statusColors.text, backgroundColor: statusColors.bg }}>
                              {assignment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <button className="p-2 hover:bg-blue-50 rounded"><FiEye className="w-4 h-4" /></button>
                              <button className="p-2 hover:bg-gray-100 rounded"><FiEdit3 className="w-4 h-4" /></button>
                              <button onClick={() => deleteAssignment(assignment._id)} className="p-2 hover:bg-red-50 rounded">
                                <FiTrash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ✅ GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="border-4 border-blue-500 rounded-lg p-4">
                <div className="bg-blue-100 p-3 text-center font-bold text-blue-800 mb-4 rounded">
                  🎨 GRID VIEW ACTIVE
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAssignments.map((assignment) => {
                    const statusColors = getStatusColor(assignment.status);
                    const TypeIcon = getAssignmentTypeIcon(assignment.assignmentType);
                    return (
                      <div key={assignment._id} className="bg-white rounded-lg border p-5 hover:shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                          <TypeIcon className="w-6 h-6" style={{ color: colors.text.accent }} />
                          <span className="px-2 py-1 text-xs rounded" style={{ color: statusColors.text, backgroundColor: statusColors.bg }}>
                            {assignment.status}
                          </span>
                        </div>
                        <h3 className="font-bold mb-1">{assignment.title}</h3>
                        <p className="text-sm mb-2" style={{ color: colors.text.secondary }}>{assignment.course}</p>
                        <p className="text-xs" style={{ color: colors.text.secondary }}>{formatDate(assignment.dueDate)}</p>
                        <div className="mt-4 flex justify-end space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded"><FiEdit3 className="w-4 h-4" /></button>
                          <button onClick={() => deleteAssignment(assignment._id)} className="p-2 hover:bg-red-50 rounded">
                            <FiTrash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div ref={modalRef} className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Upload New Assignment</h2>
              <button onClick={() => setShowUploadModal(false)}><FiX className="w-6 h-6" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
                  <input required name="title" value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Course *</label>
                    <input required name="course" value={newAssignment.course} onChange={(e) => setNewAssignment({...newAssignment, course: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Professor</label>
                    <input name="professor" value={newAssignment.professor} onChange={(e) => setNewAssignment({...newAssignment, professor: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Due Date *</label>
                    <input required type="datetime-local" name="dueDate" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Priority</label>
                    <select name="priority" value={newAssignment.priority} onChange={(e) => setNewAssignment({...newAssignment, priority: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" disabled={uploading} className="flex-1 px-4 py-2 text-white rounded-lg" style={{ backgroundColor: colors.text.accent }}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
