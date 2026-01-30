import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Bell,
  Plus,
  Edit2,
  Trash2,
  Clock,
  AlertCircle,
  Upload,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Legal/Court Theme Colors
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
    danger: '#ef4444'
  },
  golden: {
    light: 'rgba(182, 157, 116, 0.08)',
    medium: 'rgba(182, 157, 116, 0.12)',
    dark: 'rgba(182, 157, 116, 0.15)'
  },
  border: {
    light: 'rgba(182, 157, 116, 0.40)',
    navy: 'rgba(31, 40, 57, 0.15)'
  }
};

const clsx = (...s) => s.filter(Boolean).join(' ');
const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

function ChakshiDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const [newTask, setNewTask] = useState({ title: '', notes: '', priority: 'medium', dueAt: '' });
  const [priorities, setPriorities] = useState([
    { id: 1, title: 'Complete IPC Section 420 Analysis', subject: 'Criminal Law', priority: 'high', completed: false, dueAt: '2025-11-30T11:00' },
    { id: 2, title: 'Review Contract Law Notes', subject: 'Contract Law', priority: 'medium', completed: false, dueAt: '2025-11-30T16:30' },
  ]);

  const studentName = 'Priya';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    fetchDocuments();
    fetchAssignments();
    fetchCalendarEvents();
  }, []);

  // ============= FETCH FUNCTIONS =============
  async function fetchDocuments() {
    setLoadingDocs(true);
    try {
      const url = `${API_BASE_URL}/student/documents`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocs(data.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocs(false);
    }
  }

  async function fetchAssignments() {
    setLoadingAssignments(true);
    try {
      const url = `${API_BASE_URL}/assignments`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      const normalized = list.map(a => ({
        ...a,
        dueAt: a.dueAt || a.dueDate
      }));
      setAssignments(normalized);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoadingAssignments(false);
    }
  }

  async function fetchCalendarEvents() {
    try {
      const url = `${API_BASE_URL}/calendar/events?range=today&at=${encodeURIComponent(todayISO())}`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  }

  async function deleteDocument(docId) {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const url = `${API_BASE_URL}/student/documents/${docId}`;
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete document');
      setDocs(prev => prev.filter(d => d._id !== docId));
      alert('Document deleted successfully');
    } catch (error) {
      alert('Failed to delete document');
    }
  }

  async function deleteAssignment(assignmentId) {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      const url = `${API_BASE_URL}/assignments/${assignmentId}`;
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete assignment');
      setAssignments(prev => prev.filter(a => a._id !== assignmentId));
      alert('Assignment deleted successfully');
    } catch (error) {
      alert('Failed to delete assignment');
    }
  }

  const assignmentsNext7 = useMemo(() => {
    const now = new Date();
    const seven = new Date(now);
    seven.setDate(seven.getDate() + 7);
    return assignments.filter(a => {
      const dueDate = new Date(a.dueAt);
      return dueDate >= now && dueDate <= seven;
    }).length;
  }, [assignments]);

  const todaysAssignments = useMemo(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    return assignments.filter(a => {
      const d = new Date(a.dueAt);
      return d >= start && d <= end;
    });
  }, [assignments]);

  const prioritiesForToday = useMemo(() => {
    const all = [
      ...priorities.map(t => ({
        id: `task-${t.id}`,
        kind: 'task',
        title: t.title,
        subject: t.subject || 'General',
        priority: t.priority,
        dueAt: t.dueAt,
        completed: t.completed,
      })),
      ...todaysAssignments.map(a => ({
        id: `assign-${a._id}`,
        kind: 'assignment',
        title: a.title,
        subject: a.subject,
        priority: a.priority || 'medium',
        dueAt: a.dueAt,
        completed: a.status === 'completed',
      })),
    ];
    const pOrder = { high: 0, medium: 1, low: 2 };
    return all.sort((a, b) => (pOrder[a.priority] - pOrder[b.priority]) || (new Date(a.dueAt) - new Date(b.dueAt)));
  }, [priorities, todaysAssignments]);

  const addTask = () => {
    if (!newTask.title.trim()) return alert('Please enter a task title');
    const task = { 
      id: Date.now(), 
      title: newTask.title, 
      priority: newTask.priority, 
      subject: 'General', 
      completed: false, 
      dueAt: newTask.dueAt 
    };
    setPriorities(prev => [...prev, task]);
    setNewTask({ title: '', notes: '', priority: 'medium', dueAt: '' });
    setActiveModal(null);
  };

  const deleteTask = (id) => {
    setPriorities(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setPriorities(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const markAssignmentComplete = async (id) => {
    try {
      const url = `${API_BASE_URL}/assignments/${id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'completed' })
      });
      if (!res.ok) throw new Error('Failed to update assignment');
      setAssignments(prev => prev.map(a => a._id === id ? { ...a, status: 'completed' } : a));
      alert('Assignment marked as completed!');
    } catch (error) {
      alert('Failed to update assignment');
    }
  };

  const getPriorityPill = (priority) => {
    const styles = {
      high: { bg: 'rgba(239, 68, 68, 0.15)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.40)' },
      medium: { bg: colors.golden.light, text: colors.text.accent, border: colors.border.light },
      low: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.40)' }
    };
    return styles[priority] || styles.medium;
  };

  const [assignForm, setAssignForm] = useState({
    title: '', subject: '', dueAt: '', priority: 'medium', notes: '', file: null,
  });

  async function saveAssignment() {
    if (!assignForm.title.trim() || !assignForm.dueAt) {
      return alert('Title and due date/time are required');
    }
    try {
      const formData = new FormData();
      formData.append('title', assignForm.title);
      formData.append('subject', assignForm.subject);
      formData.append('dueAt', assignForm.dueAt);
      formData.append('priority', assignForm.priority);
      formData.append('notes', assignForm.notes);
      if (assignForm.file) formData.append('file', assignForm.file);

      const res = await fetch(`${API_BASE_URL}/student/assignments`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to save assignment');
      const data = await res.json();
      setAssignments(prev => [data.data, ...prev]);
      alert(data.message || 'Assignment saved successfully!');
      setAssignForm({ title: '', subject: '', dueAt: '', priority: 'medium', notes: '', file: null });
      setActiveModal(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  const [docForm, setDocForm] = useState({ title: '', type: 'Notes', file: null });

  async function saveDocument() {
    if (!docForm.title.trim() || !docForm.file) {
      return alert('Title and file required');
    }
    try {
      const fd = new FormData();
      fd.append('file', docForm.file);
      fd.append('title', docForm.title);
      fd.append('documentType', docForm.type);

      const res = await fetch(`${API_BASE_URL}/student/documents/upload`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setDocs(prev => [data.data, ...prev]);
      alert(data.message || 'Document uploaded successfully!');
      setDocForm({ title: '', type: 'other', file: null });
      setActiveModal(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  return (
    <div className="min-h-screen lg:ml-60 lg:pl-4" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header 
        className="border-b sticky top-0 z-10 shadow-sm"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: colors.border.navy
        }}
      >
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm" style={{ color: colors.text.secondary }}>{currentDate}</p>
            <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Welcome back, {studentName}! 👋
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 pl-4" style={{ borderLeft: `1px solid ${colors.border.navy}` }}>
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: colors.text.primary }}>{studentName}</p>
                <p className="text-xs" style={{ color: colors.text.secondary }}>Law Student</p>
              </div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md"
                style={{ background: `linear-gradient(135deg, ${colors.text.accent}, #9d8464)` }}
              >
                {studentName[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Today's priority" value={prioritiesForToday.length} />
        <StatCard label="Assignments (next 7 days)" value={assignmentsNext7} />
        
        {/* Add Document Button */}
        <button
          onClick={() => setActiveModal('addDocument')}
          className="rounded-2xl p-4 shadow-md border-2 transition-all group"
          style={{
            backgroundColor: 'white',
            borderColor: colors.border.navy
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.border.light}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border.navy}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs mb-1" style={{ color: colors.text.secondary }}>Quick Action</div>
              <div className="text-lg font-bold" style={{ color: colors.text.primary }}>Add Document</div>
            </div>
            <Upload style={{ color: colors.text.accent }} size={24} />
          </div>
        </button>

        {/* Add Assignment Button */}
        <button
          onClick={() => setActiveModal('addAssignment')}
          className="rounded-2xl p-4 shadow-md border-2 transition-all group"
          style={{
            backgroundColor: 'white',
            borderColor: colors.border.navy
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.border.light}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border.navy}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs mb-1" style={{ color: colors.text.secondary }}>Quick Action</div>
              <div className="text-lg font-bold" style={{ color: colors.text.primary }}>Add Assignment</div>
            </div>
            <Plus style={{ color: colors.text.accent }} size={24} />
          </div>
        </button>
      </div>

      {/* Content grid */}
      <div className="px-6 pb-8 grid lg:grid-cols-3 gap-6">
        {/* Left: priorities + assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Priorities */}
          <div 
            className="rounded-2xl p-6 shadow-md border-2"
            style={{ 
              backgroundColor: 'white',
              borderColor: colors.border.navy
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl grid place-items-center"
                  style={{ backgroundColor: colors.golden.light }}
                >
                  <AlertCircle style={{ color: colors.text.accent }} size={20} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                  Today's Priorities
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal('addTask')} 
                className="flex items-center gap-2 px-4 py-2 text-white rounded-xl transition shadow-sm"
                style={{ background: `linear-gradient(135deg, ${colors.text.accent}, #9d8464)` }}
              >
                <Plus size={18} /> Add Priority Task
              </button>
            </div>

            <div className="space-y-3">
              {prioritiesForToday.length === 0 && (
                <div className="text-sm" style={{ color: colors.text.secondary }}>
                  No tasks for today — add a priority task to stay on top.
                </div>
              )}
              {prioritiesForToday.map(item => {
                const priorityStyle = getPriorityPill(item.priority);
                return (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-3 p-4 rounded-xl transition border-2"
                    style={{
                      backgroundColor: colors.golden.light,
                      borderColor: colors.border.navy
                    }}
                  >
                    {item.kind === 'task' ? (
                      <input 
                        type="checkbox" 
                        checked={!!item.completed} 
                        onChange={() => toggleTask(Number(String(item.id).replace('task-', '')))} 
                        className="mt-1 w-5 h-5 rounded cursor-pointer" 
                        style={{ accentColor: colors.text.accent }}
                      />
                    ) : (
                      <div className="mt-1 w-5 h-5 rounded border grid place-items-center" style={{ borderColor: colors.border.navy, color: colors.text.secondary }}>⎯</div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className="font-medium" style={{ color: colors.text.primary }}>{item.title}</p>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs px-2 py-1 rounded-lg font-semibold"
                            style={{
                              backgroundColor: priorityStyle.bg,
                              color: priorityStyle.text,
                              border: `1px solid ${priorityStyle.border}`
                            }}
                          >
                            {item.priority.toUpperCase()}
                          </span>
                          {item.dueAt && (
                            <span className="text-xs flex items-center gap-1" style={{ color: colors.text.secondary }}>
                              <Clock size={12} /> {new Date(item.dueAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>{item.subject}</p>
                    </div>
                    {item.kind === 'task' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const tId = Number(String(item.id).replace('task-', ''));
                            const t = priorities.find(p => p.id === tId);
                            if (!t) return;
                            setEditingTask(t);
                            setActiveModal('editTask');
                          }} 
                          className="transition p-1"
                          style={{ color: colors.text.accent }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteTask(Number(String(item.id).replace('task-', '')))} 
                          className="transition p-1"
                          style={{ color: colors.status.danger }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assignments Due Today */}
          <div 
            className="rounded-2xl p-6 shadow-md border-2"
            style={{ 
              backgroundColor: 'white',
              borderColor: colors.border.navy
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl grid place-items-center"
                  style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                >
                  <FileText style={{ color: '#3b82f6' }} size={20} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                  Assignments Due Today
                </h3>
              </div>
             <button
  onClick={() => setActiveModal('addAssignment')} 
  className="px-3 py-2 text-white rounded-xl text-sm transition shadow-sm hover:shadow-md"
  style={{ background: `linear-gradient(135deg, ${colors.text.accent}, #9d8464)` }}
>
  Add Assignment
</button>

            </div>

            <div className="space-y-3">
              {loadingAssignments ? (
                <div className="text-center py-4" style={{ color: colors.text.secondary }}>Loading...</div>
              ) : todaysAssignments.map(a => {
                const priorityStyle = getPriorityPill(a.priority);
                return (
                  <div 
                    key={a._id} 
                    className="p-4 rounded-xl border-2 transition"
                    style={{
                      backgroundColor: a.status === 'completed' ? 'rgba(16, 185, 129, 0.08)' : 'white',
                      borderColor: a.status === 'completed' ? 'rgba(16, 185, 129, 0.40)' : colors.border.navy
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h5 className="font-semibold" style={{ color: colors.text.primary }}>{a.title}</h5>
                        <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>{a.subject}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span 
                            className="text-xs px-2 py-1 rounded-lg font-semibold"
                            style={{
                              backgroundColor: priorityStyle.bg,
                              color: priorityStyle.text,
                              border: `1px solid ${priorityStyle.border}`
                            }}
                          >
                            {a.priority.toUpperCase()}
                          </span>
                          <span className="text-xs flex items-center gap-1" style={{ color: colors.text.secondary }}>
                            <Clock size={12} /> {new Date(a.dueAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.golden.light }}>
                          <div 
                            className="h-full transition-all"
                            style={{ 
                              width: `${a.progress || 0}%`,
                              background: `linear-gradient(90deg, ${colors.text.accent}, #9d8464)`
                            }} 
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 whitespace-nowrap">
                        {a.status === 'pending' && (
                          <button 
                            onClick={() => markAssignmentComplete(a._id)} 
                            className="px-3 py-1 text-white rounded-lg text-sm"
                            style={{ backgroundColor: colors.status.success }}
                          >
                            Mark Complete
                          </button>
                        )}
                        <button 
                          onClick={() => deleteAssignment(a._id)} 
                          className="px-3 py-1 text-white rounded-lg text-sm"
                          style={{ backgroundColor: colors.status.danger }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {todaysAssignments.length === 0 && !loadingAssignments && (
                <div className="text-sm" style={{ color: colors.text.secondary }}>
                  Nothing due today. Great time to get ahead!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Mini Calendar */}
        <div className="space-y-6">
          <MiniCalendarWidget events={events} />
        </div>
      </div>

      {/* Documents Section */}
      <div className="px-6 pb-8">
        <div 
          className="rounded-2xl p-6 shadow-md border-2"
          style={{ 
            backgroundColor: 'white',
            borderColor: colors.border.navy
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>Recent Documents</h3>
           <button 
  onClick={() => setActiveModal('addDocument')} 
  className="flex items-center gap-2 px-4 py-2 text-white rounded-xl transition shadow-md hover:shadow-lg"
  style={{ background: `linear-gradient(135deg, ${colors.text.accent}, #9d8464)` }}
>
  <Plus size={18} /> Upload Document
</button>
          </div>

          {loadingDocs ? (
            <div className="text-center py-8" style={{ color: colors.text.secondary }}>Loading documents...</div>
          ) : docs.length === 0 ? (
            <div className="text-center py-8" style={{ color: colors.text.secondary }}>No documents uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {docs.map(doc => (
                <div 
                  key={doc._id} 
                  className="p-4 rounded-xl border-2 transition"
                  style={{
                    backgroundColor: colors.golden.light,
                    borderColor: colors.border.navy
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold truncate" style={{ color: colors.text.primary }}>{doc.title}</h4>
                      <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>{doc.documentType}</p>
                    </div>
                    <button 
                      onClick={() => deleteDocument(doc._id)} 
                      style={{ color: colors.status.danger }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                    onClick={() => window.open(`${API_BASE_URL}/student/documents/view/${doc._id}`, '_blank')}
                    className="flex-1 px-3 py-2 text-white rounded-lg text-sm text-center font-semibold transition shadow-sm hover:shadow-md"
                    style={{ background: `linear-gradient(135deg, ${colors.text.accent}, #9d8464)` }}
                  >
                    View
                  </button>
                    <a
    href={`${API_BASE_URL}/student/documents/download/${doc._id}`}
    download
    className="flex-1 px-3 py-2 rounded-lg text-sm text-center font-semibold transition border-2 shadow-sm hover:shadow-md"
    style={{ 
      backgroundColor: 'white',
      color: colors.text.primary,
      borderColor: colors.border.navy
    }}
  >
    Download
  </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'addTask' && (
        <Modal title="Add Priority Task" onClose={() => { 
          setActiveModal(null); 
          setNewTask({ title: '', notes: '', priority: 'medium', dueAt: '' }); 
        }}>
          <div className="space-y-4">
            <Field label="Title">
              <input 
                type="text" 
                value={newTask.title} 
                onChange={e => setNewTask(v => ({ ...v, title: e.target.value }))} 
                className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                style={{ borderColor: colors.border.navy }}
                onFocus={(e) => e.target.style.borderColor = colors.border.light}
                onBlur={(e) => e.target.style.borderColor = colors.border.navy}
                placeholder="Enter task title" 
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Due Date & Time">
                <input 
                  type="datetime-local" 
                  value={newTask.dueAt} 
                  onChange={e => setNewTask(v => ({ ...v, dueAt: e.target.value }))} 
                  className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                  style={{ borderColor: colors.border.navy }}
                  onFocus={(e) => e.target.style.borderColor = colors.border.light}
                  onBlur={(e) => e.target.style.borderColor = colors.border.navy}
                />
              </Field>
              <Field label="Priority">
                <select 
                  value={newTask.priority} 
                  onChange={e => setNewTask(v => ({ ...v, priority: e.target.value }))} 
                  className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                  style={{ borderColor: colors.border.navy }}
                  onFocus={(e) => e.target.style.borderColor = colors.border.light}
                  onBlur={(e) => e.target.style.borderColor = colors.border.navy}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </Field>
            </div>
            <button 
              onClick={addTask} 
              className="w-full py-3 text-white rounded-xl transition font-semibold"
              style={{ background: `linear-gradient(135deg, ${colors.text.accent}, #9d8464)` }}
            >
              Save Task
            </button>
          </div>
        </Modal>
      )}

      {activeModal === 'addAssignment' && (
        <Modal title="Add New Assignment" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <Field label="Title">
              <input 
                type="text" 
                value={assignForm.title} 
                onChange={e => setAssignForm(v => ({ ...v, title: e.target.value }))} 
                className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                style={{ borderColor: colors.border.navy }}
              />
            </Field>
            <Field label="Subject">
              <input 
                type="text" 
                value={assignForm.subject} 
                onChange={e => setAssignForm(v => ({ ...v, subject: e.target.value }))} 
                className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                style={{ borderColor: colors.border.navy }}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Due Date & Time">
                <input 
                  type="datetime-local" 
                  value={assignForm.dueAt} 
                  onChange={e => setAssignForm(v => ({ ...v, dueAt: e.target.value }))} 
                  className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                  style={{ borderColor: colors.border.navy }}
                />
              </Field>
              <Field label="Priority">
                <select 
                  value={assignForm.priority} 
                  onChange={e => setAssignForm(v => ({ ...v, priority: e.target.value }))} 
                  className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                  style={{ borderColor: colors.border.navy }}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </Field>
            </div>
            <Field label="Notes (Optional)">
              <textarea 
                value={assignForm.notes} 
                onChange={e => setAssignForm(v => ({ ...v, notes: e.target.value }))} 
                className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                style={{ borderColor: colors.border.navy }}
                rows={3} 
              />
            </Field>
            <Field label="Attachment (Optional)">
              <input 
                type="file" 
                onChange={e => setAssignForm(v => ({ ...v, file: e.target.files[0] }))} 
                className="w-full px-4 py-2 border-2 rounded-xl"
                style={{ borderColor: colors.border.navy }}
              />
            </Field>
            <button 
              onClick={saveAssignment} 
              className="w-full py-3 text-white rounded-xl"
              style={{ backgroundColor: '#3b82f6' }}
            >
              Save Assignment
            </button>
          </div>
        </Modal>
      )}

      {activeModal === 'addDocument' && (
        <Modal title="Upload Document" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <Field label="Title">
              <input 
                type="text" 
                value={docForm.title} 
                onChange={e => setDocForm(v => ({ ...v, title: e.target.value }))} 
                className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                style={{ borderColor: colors.border.navy }}
              />
            </Field>
            <Field label="Type">
              <select 
                value={docForm.type} 
                onChange={e => setDocForm(v => ({ ...v, type: e.target.value }))}
                className="w-full px-4 py-2 border-2 rounded-xl focus:outline-none"
                style={{ borderColor: colors.border.navy }}
              >
                <option value="Notes">Notes</option>
                <option value="Assignment">Assignment</option>
                <option value="Research">Research</option>
                <option value="Certificate">Certificate</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="File">
              <input 
                type="file" 
                onChange={e => setDocForm(v => ({ ...v, file: e.target.files[0] }))} 
                className="w-full px-4 py-2 border-2 rounded-xl"
                style={{ borderColor: colors.border.navy }}
              />
            </Field>
            <button 
              onClick={saveDocument} 
              className="w-full py-3 text-white rounded-xl"
              style={{ background: `linear-gradient(135deg, ${colors.text.primary}, #2d3a4f)` }}
            >
              Upload
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============= HELPER COMPONENTS =============

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div 
          className="p-6 border-b flex justify-between items-center"
          style={{ borderColor: colors.border.navy }}
        >
          <h3 className="text-xl font-semibold" style={{ color: colors.text.primary }}>{title}</h3>
          <button 
            onClick={onClose} 
            className="text-2xl"
            style={{ color: colors.text.secondary }}
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div 
      className="rounded-2xl p-4 shadow-md border-2"
      style={{ 
        backgroundColor: 'white',
        borderColor: colors.border.navy
      }}
    >
      <div className="text-xs" style={{ color: colors.text.secondary }}>{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color: colors.text.primary }}>{value}</div>
    </div>
  );
}

function MiniCalendarWidget({ events }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const days = useMemo(() => {
    const start = new Date(month);
    const firstDay = new Date(start.getFullYear(), start.getMonth(), 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(start.getFullYear(), start.getMonth(), d));
    return arr;
  }, [month]);

  const eventMap = useMemo(() => {
    const map = new Map();
    events.forEach(e => {
      const key = new Date(e.start_at).toDateString();
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [events]);

  return (
    <div 
      className="rounded-2xl p-4 shadow-md border-2"
      style={{ 
        backgroundColor: 'white',
        borderColor: colors.border.navy
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold" style={{ color: colors.text.primary }}>
          {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <div className="flex gap-2">
          <button 
            className="px-2 py-1 rounded border"
            style={{ borderColor: colors.border.navy }}
            onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          >
            {'<'}
          </button>
          <button 
            className="px-2 py-1 rounded border"
            style={{ borderColor: colors.border.navy }}
            onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          >
            {'>'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs mb-1" style={{ color: colors.text.secondary }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div 
            key={i} 
            className="h-16 rounded border p-1 text-xs relative"
            style={{ borderColor: colors.border.navy }}
          >
            {d && (
              <>
                <div style={{ color: colors.text.secondary }}>{d.getDate()}</div>
                {eventMap.get(d.toDateString()) && (
                  <div 
                    className="absolute bottom-1 right-1 text-[10px] px-1 rounded"
                    style={{
                      backgroundColor: colors.golden.light,
                      color: colors.text.accent
                    }}
                  >
                    {eventMap.get(d.toDateString())}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChakshiDashboard;
