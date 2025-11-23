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

const clsx = (...s) => s.filter(Boolean).join(' ');
const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  console.log('📅 Today ISO:', d.toISOString());
  return d.toISOString();
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
console.log('🔗 API Base URL:', API_BASE_URL);

function ChakshiDashboard() {
  console.log('🎨 ChakshiDashboard component mounted');
  
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
    console.log('🚀 useEffect: Fetching initial data...');
    fetchDocuments();
    fetchAssignments();
    fetchCalendarEvents();
  }, []);

  // ============= FETCH FUNCTIONS =============

  async function fetchDocuments() {
    console.log('📄 fetchDocuments: Starting...');
    setLoadingDocs(true);
    try {
      const url = `${API_BASE_URL}/student/documents`;
      console.log('📄 Fetching from URL:', url);
      
      const res = await fetch(url, {
        credentials: 'include'
      });
      
      console.log('📄 Response status:', res.status);
      console.log('📄 Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('📄 ERROR: Response not OK:', errorText);
        throw new Error('Failed to fetch documents');
      }
      
      const data = await res.json();
      console.log('📄 SUCCESS: Documents fetched:', data);
      console.log('📄 Number of documents:', data.data?.length || 0);
      
      setDocs(data.data || []);
    } catch (error) {
      console.error('📄 CATCH ERROR:', error);
      console.error('📄 Error message:', error.message);
      console.error('📄 Error stack:', error.stack);
    } finally {
      setLoadingDocs(false);
      console.log('📄 fetchDocuments: Completed');
    }
  }

  async function fetchAssignments() {
    console.log('📝 fetchAssignments: Starting...');
    setLoadingAssignments(true);
    try {
      const url = `${API_BASE_URL}/student/assignments`;
      console.log('📝 Fetching from URL:', url);
      
      const res = await fetch(url, {
        credentials: 'include'
      });
      
      console.log('📝 Response status:', res.status);
      console.log('📝 Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('📝 ERROR: Response not OK:', errorText);
        throw new Error('Failed to fetch assignments');
      }
      
      const data = await res.json();
      console.log('📝 SUCCESS: Assignments fetched:', data);
      console.log('📝 Number of assignments:', data.data?.length || 0);
      
      setAssignments(data.data || []);
    } catch (error) {
      console.error('📝 CATCH ERROR:', error);
      console.error('📝 Error message:', error.message);
      console.error('📝 Error stack:', error.stack);
    } finally {
      setLoadingAssignments(false);
      console.log('📝 fetchAssignments: Completed');
    }
  }

  async function fetchCalendarEvents() {
    console.log('📅 fetchCalendarEvents: Starting...');
    try {
      const url = `${API_BASE_URL}/student/calendar/events?range=today&at=${encodeURIComponent(todayISO())}`;
      console.log('📅 Fetching from URL:', url);
      
      const res = await fetch(url, {
        credentials: 'include'
      });
      
      console.log('📅 Response status:', res.status);
      console.log('📅 Response ok:', res.ok);
      
      if (res.ok) {
        const data = await res.json();
        console.log('📅 SUCCESS: Events fetched:', data);
        console.log('📅 Number of events:', data.events?.length || 0);
        setEvents(data.events || []);
      } else {
        console.warn('📅 Calendar events fetch failed (non-critical)');
      }
    } catch (error) {
      console.error('📅 CATCH ERROR:', error);
      console.error('📅 Error message:', error.message);
    }
  }

  // ============= DELETE FUNCTIONS =============

  async function deleteDocument(docId) {
    console.log('🗑️ deleteDocument: Starting for ID:', docId);
    
    if (!window.confirm('Are you sure you want to delete this document?')) {
      console.log('🗑️ User cancelled deletion');
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/student/documents/${docId}`;
      console.log('🗑️ DELETE request to:', url);
      
      const res = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      console.log('🗑️ Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('🗑️ ERROR:', errorText);
        throw new Error('Failed to delete document');
      }
      
      console.log('🗑️ SUCCESS: Document deleted');
      setDocs(prev => {
        const updated = prev.filter(d => d._id !== docId);
        console.log('🗑️ Updated docs count:', updated.length);
        return updated;
      });
      alert('Document deleted successfully');
    } catch (error) {
      console.error('🗑️ CATCH ERROR:', error);
      alert('Failed to delete document');
    }
  }

  async function deleteAssignment(assignmentId) {
    console.log('🗑️ deleteAssignment: Starting for ID:', assignmentId);
    
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      console.log('🗑️ User cancelled deletion');
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/student/assignments/${assignmentId}`;
      console.log('🗑️ DELETE request to:', url);
      
      const res = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      console.log('🗑️ Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('🗑️ ERROR:', errorText);
        throw new Error('Failed to delete assignment');
      }
      
      console.log('🗑️ SUCCESS: Assignment deleted');
      setAssignments(prev => {
        const updated = prev.filter(a => a._id !== assignmentId);
        console.log('🗑️ Updated assignments count:', updated.length);
        return updated;
      });
      alert('Assignment deleted successfully');
    } catch (error) {
      console.error('🗑️ CATCH ERROR:', error);
      alert('Failed to delete assignment');
    }
  }

  // ============= COMPUTED VALUES =============

  const assignmentsNext7 = useMemo(() => {
    const now = new Date();
    const seven = new Date(now);
    seven.setDate(seven.getDate() + 7);
    const filtered = assignments.filter(a => {
      const dueDate = new Date(a.dueAt);
      return dueDate >= now && dueDate <= seven;
    });
    console.log('📊 Assignments in next 7 days:', filtered.length);
    return filtered.length;
  }, [assignments]);

  const todaysAssignments = useMemo(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const filtered = assignments.filter(a => {
      const d = new Date(a.dueAt);
      return d >= start && d <= end;
    });
    console.log('📊 Today\'s assignments:', filtered.length);
    return filtered;
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
    const sorted = all.sort((a, b) => (pOrder[a.priority] - pOrder[b.priority]) || (new Date(a.dueAt) - new Date(b.dueAt)));
    console.log('📊 Total priorities for today:', sorted.length);
    return sorted;
  }, [priorities, todaysAssignments]);

  // ============= TASK FUNCTIONS =============

  const addTask = () => {
    console.log('➕ addTask: New task data:', newTask);
    
    if (!newTask.title.trim()) {
      console.warn('➕ ERROR: Task title is empty');
      return alert('Please enter a task title');
    }
    
    const task = { 
      id: Date.now(), 
      title: newTask.title, 
      priority: newTask.priority, 
      subject: 'General', 
      completed: false, 
      dueAt: newTask.dueAt 
    };
    
    console.log('➕ Creating task:', task);
    
    setPriorities(prev => {
      const updated = [...prev, task];
      console.log('➕ Updated priorities count:', updated.length);
      return updated;
    });
    
    setNewTask({ title: '', notes: '', priority: 'medium', dueAt: '' });
    setActiveModal(null);
    console.log('➕ Task added successfully');
  };

  const deleteTask = (id) => {
    console.log('🗑️ deleteTask: ID:', id);
    setPriorities(prev => {
      const updated = prev.filter(t => t.id !== id);
      console.log('🗑️ Updated priorities count:', updated.length);
      return updated;
    });
  };

  const toggleTask = (id) => {
    console.log('✅ toggleTask: ID:', id);
    setPriorities(prev => prev.map(t => {
      if (t.id === id) {
        console.log('✅ Toggling task:', t.title, 'completed:', !t.completed);
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const markAssignmentComplete = async (id) => {
    console.log('✅ markAssignmentComplete: Starting for ID:', id);
    
    try {
      const url = `${API_BASE_URL}/student/assignments/${id}`;
      console.log('✅ PUT request to:', url);
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'completed' })
      });
      
      console.log('✅ Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('✅ ERROR:', errorText);
        throw new Error('Failed to update assignment');
      }
      
      const data = await res.json();
      console.log('✅ SUCCESS:', data);
      
      setAssignments(prev => prev.map(a => {
        if (a._id === id) {
          console.log('✅ Marking assignment as completed:', a.title);
          return { ...a, status: 'completed' };
        }
        return a;
      }));
      
      alert('Assignment marked as completed!');
    } catch (error) {
      console.error('✅ CATCH ERROR:', error);
      alert('Failed to update assignment');
    }
  };

  const getPriorityPill = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  // ============= ASSIGNMENT FORM =============

  const [assignForm, setAssignForm] = useState({
    title: '', subject: '', dueAt: '', priority: 'medium', notes: '', file: null,
  });

  async function saveAssignment() {
    console.log('💾 saveAssignment: Starting...');
    console.log('💾 Form data:', assignForm);
    
    if (!assignForm.title.trim() || !assignForm.dueAt) {
      console.warn('💾 ERROR: Missing required fields');
      return alert('Title and due date/time are required');
    }

    try {
      const formData = new FormData();
      formData.append('title', assignForm.title);
      formData.append('subject', assignForm.subject);
      formData.append('dueAt', assignForm.dueAt);
      formData.append('priority', assignForm.priority);
      formData.append('notes', assignForm.notes);
      
      if (assignForm.file) {
        console.log('💾 Attaching file:', assignForm.file.name);
        formData.append('file', assignForm.file);
      }

      const url = `${API_BASE_URL}/student/assignments`;
      console.log('💾 POST request to:', url);

      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      console.log('💾 Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('💾 ERROR:', errorData);
        throw new Error(errorData.message || 'Failed to save assignment');
      }

      const data = await res.json();
      console.log('💾 SUCCESS:', data);
      
      setAssignments(prev => {
        const updated = [data.data, ...prev];
        console.log('💾 Updated assignments count:', updated.length);
        return updated;
      });
      
      alert(data.message || 'Assignment saved successfully!');
      
      setAssignForm({ title: '', subject: '', dueAt: '', priority: 'medium', notes: '', file: null });
      setActiveModal(null);
    } catch (error) {
      console.error('💾 CATCH ERROR:', error);
      console.error('💾 Error message:', error.message);
      alert(`Error: ${error.message}`);
    }
  }

  // ============= DOCUMENT FORM =============

  const [docForm, setDocForm] = useState({ title: '', type: 'Notes', file: null });

  async function saveDocument() {
    console.log('📤 saveDocument: Starting...');
    console.log('📤 Form data:', docForm);
    
    if (!docForm.title.trim() || !docForm.file) {
      console.warn('📤 ERROR: Missing required fields');
      return alert('Title and file required');
    }

    try {
      const fd = new FormData();
      fd.append('file', docForm.file);
      fd.append('title', docForm.title);
      fd.append('documentType', docForm.type);

      console.log('📤 File details:', {
        name: docForm.file.name,
        size: docForm.file.size,
        type: docForm.file.type
      });

      const url = `${API_BASE_URL}/student/documents/upload`;
      console.log('📤 POST request to:', url);

      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });

      console.log('📤 Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('📤 ERROR:', errorData);
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await res.json();
      console.log('📤 SUCCESS:', data);
      
      setDocs(prev => {
        const updated = [data.data, ...prev];
        console.log('📤 Updated docs count:', updated.length);
        return updated;
      });
      
      alert(data.message || 'Document uploaded successfully!');
      setDocForm({ title: '', type: 'other', file: null });
      setActiveModal(null);

    } catch (error) {
      console.error('📤 CATCH ERROR:', error);
      console.error('📤 Error message:', error.message);
      alert(`Error: ${error.message}`);
    }
  }

  // Log modal changes
  useEffect(() => {
    console.log('🪟 Active modal changed to:', activeModal);
  }, [activeModal]);

  // Log state changes
  useEffect(() => {
    console.log('📊 State update - Docs:', docs.length, 'Assignments:', assignments.length);
  }, [docs, assignments]);

  return (
    <div className="min-h-screen lg:ml-72 lg:pl-4 bg-gradient-to-br from-amber-50 via-white to-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-gray-500">{currentDate}</p>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {studentName}! 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{studentName}</p>
                <p className="text-xs text-gray-500">Law Student</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
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
          onClick={() => {
            console.log('🖱️ Add Document button clicked');
            setActiveModal('addDocument');
          }}
          className="bg-white rounded-2xl p-4 shadow-md border border-stone-200 hover:shadow-lg hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs text-gray-500 mb-1">Quick Action</div>
              <div className="text-lg font-bold text-gray-800 group-hover:text-amber-600 transition">Add Document</div>
            </div>
            <Upload className="text-amber-500 group-hover:scale-110 transition-transform" size={24} />
          </div>
        </button>

        {/* Add Assignment Button */}
        <button
          onClick={() => {
            console.log('🖱️ Add Assignment button clicked');
            setActiveModal('addAssignment');
          }}
          className="bg-white rounded-2xl p-4 shadow-md border border-stone-200 hover:shadow-lg hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs text-gray-500 mb-1">Quick Action</div>
              <div className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">Add Assignment</div>
            </div>
            <Plus className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
          </div>
        </button>
      </div>

      {/* Content grid */}
      <div className="px-6 pb-8 grid lg:grid-cols-3 gap-6">
        {/* Left: priorities + assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Priorities */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl grid place-items-center">
                  <AlertCircle className="text-amber-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Today's Priorities</h3>
              </div>
              <button onClick={() => {
                console.log('🖱️ Add Priority Task button clicked');
                setActiveModal('addTask');
              }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-sm">
                <Plus size={18} /> Add Priority Task
              </button>
            </div>

            <div className="space-y-3">
              {prioritiesForToday.length === 0 && (
                <div className="text-sm text-gray-500">No tasks for today — add a priority task to stay on top.</div>
              )}
              {prioritiesForToday.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition border border-stone-200">
                  {item.kind === 'task' ? (
                    <input type="checkbox" checked={!!item.completed} onChange={() => toggleTask(Number(String(item.id).replace('task-', '')))} className="mt-1 w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer" />
                  ) : (
                    <div className="mt-1 w-5 h-5 rounded border border-stone-300 grid place-items-center text-stone-400">⎯</div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-gray-800 font-medium">{item.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={clsx('text-xs px-2 py-1 rounded-lg border', getPriorityPill(item.priority))}>{item.priority.toUpperCase()}</span>
                        {item.dueAt && <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {new Date(item.dueAt).toLocaleString()}</span>}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.subject}</p>
                  </div>
                  {item.kind === 'task' && (
                    <div className="flex gap-2">
                      <button onClick={() => {
                        console.log('🖱️ Edit task button clicked');
                        const tId = Number(String(item.id).replace('task-', ''));
                        const t = priorities.find(p => p.id === tId);
                        if (!t) return;
                        setEditingTask(t);
                        setActiveModal('editTask');
                      }} className="text-blue-600 hover:text-blue-800 transition p-1"><Edit2 size={16} /></button>
                      <button onClick={() => deleteTask(Number(String(item.id).replace('task-', '')))} className="text-red-600 hover:text-red-800 transition p-1"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assignments Due Today */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl grid place-items-center">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Assignments Due Today</h3>
              </div>
              <button onClick={() => {
                console.log('🖱️ Add Assignment (inline) button clicked');
                setActiveModal('addAssignment');
              }} className="px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm">Add Assignment</button>
            </div>

            <div className="space-y-3">
              {loadingAssignments ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : todaysAssignments.map(a => (
                <div key={a._id} className={clsx('p-4 rounded-xl border transition', a.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-stone-200')}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800">{a.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{a.subject}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={clsx('text-xs px-2 py-1 rounded-lg border', getPriorityPill(a.priority))}>{a.priority.toUpperCase()}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {new Date(a.dueAt).toLocaleString()}</span>
                      </div>
                      <div className="mt-3 h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${a.progress || 0}%` }} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 whitespace-nowrap">
                      {a.status === 'pending' && (
                        <button onClick={() => markAssignmentComplete(a._id)} className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">Mark Complete</button>
                      )}
                      <button onClick={() => deleteAssignment(a._id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {todaysAssignments.length === 0 && !loadingAssignments && (
                <div className="text-sm text-gray-500">Nothing due today. Great time to get ahead!</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Mini Calendar Only */}
        <div className="space-y-6">
          <MiniCalendarWidget events={events} />
        </div>
      </div>

      {/* Documents Section */}
      <div className="px-6 pb-8">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Documents</h3>
            <button onClick={() => {
              console.log('🖱️ Upload Document button clicked');
              setActiveModal('addDocument');
            }} className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-xl hover:bg-black transition">
              <Plus size={18} /> Upload Document
            </button>
          </div>

          {loadingDocs ? (
            <div className="text-center py-8 text-gray-500">Loading documents...</div>
          ) : docs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No documents uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {docs.map(doc => {
                console.log('📄 Rendering document:', doc);
                return (
                  <div key={doc._id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 truncate">{doc.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{doc.documentType}</p>
                      </div>
                      <button onClick={() => deleteDocument(doc._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const viewUrl = `${API_BASE_URL}/student/documents/view/${doc._id}`;
                          console.log('👁️ Opening document view:', viewUrl);
                          window.open(viewUrl, '_blank');
                        }}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm text-center"
                      >
                        View
                      </button>
                      <a
                        href={`${API_BASE_URL}/student/documents/download/${doc._id}`}
                        download
                        onClick={() => console.log('⬇️ Downloading document:', doc._id)}
                        className="flex-1 px-3 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 text-sm text-center"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'addTask' && (
        <Modal title="Add Priority Task" onClose={() => { 
          console.log('🪟 Closing addTask modal');
          setActiveModal(null); 
          setNewTask({ title: '', notes: '', priority: 'medium', dueAt: '' }); 
        }}>
          <div className="space-y-4">
            <Field label="Title">
              <input type="text" value={newTask.title} onChange={e => {
                console.log('⌨️ Task title changed:', e.target.value);
                setNewTask(v => ({ ...v, title: e.target.value }));
              }} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="Enter task title" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Due Date & Time">
                <input type="datetime-local" value={newTask.dueAt} onChange={e => {
                  console.log('📅 Task due date changed:', e.target.value);
                  setNewTask(v => ({ ...v, dueAt: e.target.value }));
                }} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500" />
              </Field>
              <Field label="Priority">
                <select value={newTask.priority} onChange={e => {
                  console.log('🎯 Task priority changed:', e.target.value);
                  setNewTask(v => ({ ...v, priority: e.target.value }));
                }} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </Field>
            </div>
            <button onClick={addTask} className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition font-semibold">Save Task</button>
          </div>
        </Modal>
      )}

      {activeModal === 'addAssignment' && (
        <Modal title="Add New Assignment" onClose={() => {
          console.log('🪟 Closing addAssignment modal');
          setActiveModal(null);
        }}>
          <div className="space-y-4">
            <Field label="Title">
              <input type="text" value={assignForm.title} onChange={e => {
                console.log('⌨️ Assignment title changed:', e.target.value);
                setAssignForm(v => ({ ...v, title: e.target.value }));
              }} className="w-full px-4 py-2 border rounded-xl" />
            </Field>
            <Field label="Subject">
              <input type="text" value={assignForm.subject} onChange={e => {
                console.log('⌨️ Assignment subject changed:', e.target.value);
                setAssignForm(v => ({ ...v, subject: e.target.value }));
              }} className="w-full px-4 py-2 border rounded-xl" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Due Date & Time">
                <input type="datetime-local" value={assignForm.dueAt} onChange={e => {
                  console.log('📅 Assignment due date changed:', e.target.value);
                  setAssignForm(v => ({ ...v, dueAt: e.target.value }));
                }} className="w-full px-4 py-2 border rounded-xl" />
              </Field>
              <Field label="Priority">
                <select value={assignForm.priority} onChange={e => {
                  console.log('🎯 Assignment priority changed:', e.target.value);
                  setAssignForm(v => ({ ...v, priority: e.target.value }));
                }} className="w-full px-4 py-2 border rounded-xl">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </Field>
            </div>
            <Field label="Notes (Optional)">
              <textarea value={assignForm.notes} onChange={e => {
                console.log('⌨️ Assignment notes changed');
                setAssignForm(v => ({ ...v, notes: e.target.value }));
              }} className="w-full px-4 py-2 border rounded-xl" rows={3} />
            </Field>
            <Field label="Attachment (Optional)">
              <input type="file" onChange={e => {
                const file = e.target.files[0];
                console.log('📎 Assignment file selected:', file?.name);
                setAssignForm(v => ({ ...v, file }));
              }} className="w-full px-4 py-2 border rounded-xl" />
            </Field>
            <button onClick={saveAssignment} className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600">Save Assignment</button>
          </div>
        </Modal>
      )}

      {activeModal === 'addDocument' && (
        <Modal title="Upload Document" onClose={() => {
          console.log('🪟 Closing addDocument modal');
          setActiveModal(null);
        }}>
          <div className="space-y-4">
            <Field label="Title">
              <input type="text" value={docForm.title} onChange={e => {
                console.log('⌨️ Document title changed:', e.target.value);
                setDocForm(v => ({ ...v, title: e.target.value }));
              }} className="w-full px-4 py-2 border rounded-xl" />
            </Field>
            <Field label="Type">
             <select value={docForm.type} onChange={e => setDocForm(v => ({ ...v, type: e.target.value }))}>
  <option value="Notes">Notes</option>
  <option value="Assignment">Assignment</option>
  <option value="Research">Research</option>
  <option value="Certificate">Certificate</option>
  <option value="Other">Other</option>
</select>

            </Field>
            <Field label="File">
              <input type="file" onChange={e => {
                const file = e.target.files[0];
                console.log('📎 Document file selected:', file?.name);
                setDocForm(v => ({ ...v, file }));
              }} className="w-full px-4 py-2 border rounded-xl" />
            </Field>
            <button onClick={saveDocument} className="w-full py-3 bg-stone-800 text-white rounded-xl hover:bg-black">Upload</button>
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
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-stone-200">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-800 mt-1">{value}</div>
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
    console.log('📅 Calendar event map:', Object.fromEntries(map));
    return map;
  }, [events]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-stone-200">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-800">{month.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        <div className="flex gap-2">
          <button className="px-2 py-1 rounded border" onClick={() => {
            console.log('📅 Previous month');
            setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
          }}>{'<'}</button>
          <button className="px-2 py-1 rounded border" onClick={() => {
            console.log('📅 Next month');
            setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));
          }}>{'>'}</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div key={i} className="h-16 rounded border border-stone-200 p-1 text-xs relative">
            {d && (
              <>
                <div className="text-stone-600">{d.getDate()}</div>
                {eventMap.get(d.toDateString()) && (
                  <div className="absolute bottom-1 right-1 text-[10px] px-1 rounded bg-amber-100 text-amber-700">
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
