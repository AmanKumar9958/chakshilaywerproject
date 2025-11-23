import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Bell,
  Book,
  FileText,
  Home,
  Search,
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Scale,
  Briefcase,
  Clock,
  AlertCircle,
  Cloud,
  Upload,
  Link2,
  CheckCircle,
} from 'lucide-react';
import CalendarView from './CalenderView';

// --- tiny helpers ---
const clsx = (...s) => s.filter(Boolean).join(' ');
const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const DEMO_MODE = true; // flip to false when your APIs are live

async function api(path, opts = {}) {
  if (DEMO_MODE) {
    // mock responses
    if (path.startsWith('/api/calendar/events')) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0);
      return {
        ok: true,
        json: async () => ({
          events: [
            {
              id: 'evt-1',
              title: 'Submit Criminal Law Assignment',
              start_at: start.toISOString(),
              end_at: end.toISOString(),
              category: 'assignment',
              color: '#1E90FF',
              source: 'internal',
            },
          ],
        }),
      };
    }
    if (path === '/api/assignments' && opts.method === 'POST') {
      return { ok: true, json: async () => ({ ok: true, message: 'Saved (DEMO). Connect Google to sync.' }) };
    }
    if (path === '/api/documents' && opts.method === 'POST') {
      return { ok: true, json: async () => ({ ok: true, file_url: 'https://example.com/demo.pdf' }) };
    }
    if (path === '/api/calendar/import-ics' && opts.method === 'POST') {
      return { ok: true, json: async () => ({ ok: true, imported: 12 }) };
    }
  }
  return fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...opts,
  });
}

export default function ChakshiDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [events, setEvents] = useState([]);

  // --- priorities ---
  const [newTask, setNewTask] = useState({ title: '', notes: '', priority: 'medium', dueAt: '' });
  const [priorities, setPriorities] = useState([
    { id: 1, title: 'Complete IPC Section 420 Analysis', subject: 'Criminal Law', priority: 'high', completed: false, dueAt: '2025-10-30T11:00' },
    { id: 2, title: 'Review Contract Law Notes', subject: 'Contract Law', priority: 'medium', completed: false, dueAt: '2025-10-30T16:30' },
    { id: 3, title: 'Prepare Moot Court Arguments', subject: 'Advocacy', priority: 'high', completed: false, dueAt: '2025-10-31T10:00' },
  ]);

  // --- assignments ---
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Constitutional Law Essay', subject: 'Constitutional Law', status: 'pending', dueAt: '2025-10-30T23:59', priority: 'medium', progress: 40 },
    { id: 2, title: 'Criminal Procedure Analysis', subject: 'Criminal Law', status: 'pending', dueAt: '2025-10-30T18:00', priority: 'high', progress: 20 },
  ]);

  const [docs, setDocs] = useState([]);

  const studentName = 'Priya';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Load merged calendar events
  useEffect(() => {
    (async () => {
      const res = await api(`/api/calendar/events?range=today&at=${encodeURIComponent(todayISO())}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    })();
  }, []);

  // Quick stats derived
  const assignmentsNext7 = useMemo(() => {
    const now = new Date();
    const seven = new Date(now);
    seven.setDate(seven.getDate() + 7);
    return assignments.filter(a => new Date(a.dueAt) >= now && new Date(a.dueAt) <= seven).length;
  }, [assignments]);

  const studyHours = 6;
  const gradeAvg = 'A-';

  // Merge Today's priorities
  const todaysAssignments = useMemo(() => {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
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
        id: `assign-${a.id}`,
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

  // --- actions ---
  const addTask = () => {
    if (!newTask.title.trim()) return alert('Please enter a task title');
    setPriorities(prev => [
      ...prev,
      { id: Date.now(), title: newTask.title, priority: newTask.priority, subject: 'General', completed: false, dueAt: newTask.dueAt },
    ]);
    setNewTask({ title: '', notes: '', priority: 'medium', dueAt: '' });
    setActiveModal(null);
  };

  const deleteTask = (id) => setPriorities(prev => prev.filter(t => t.id !== id));
  const toggleTask = (id) => setPriorities(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const markAssignmentComplete = (id) => setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));

  const getPriorityPill = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  // --- assignment modal state ---
  const [assignForm, setAssignForm] = useState({
    title: '', subject: '', dueAt: '', priority: 'medium', notes: '', autoSync: true, file: null,
  });

  async function saveAssignment() {
    if (!assignForm.title.trim() || !assignForm.dueAt) return alert('Title and due date/time are required');

    let file_url = '';
    if (assignForm.file) {
      const fd = new FormData();
      fd.append('file', assignForm.file);
      const up = await fetch('/api/documents', { method: 'POST', body: fd });
      const upj = up.ok ? await up.json() : { ok: false };
      if (!upj.ok) return alert('File upload failed');
      file_url = upj.file_url;
    }

    const payload = {
      title: assignForm.title,
      subject: assignForm.subject,
      due_at: assignForm.dueAt,
      priority: assignForm.priority,
      notes: assignForm.notes,
      auto_sync: !!assignForm.autoSync,
      file_url,
    };

    const res = await api('/api/assignments', { method: 'POST', body: JSON.stringify(payload) });
    if (!res.ok) return alert('Failed to save assignment');
    const out = await res.json();

    // optimistic UI
    setAssignments(prev => [
      {
        id: Date.now(),
        title: assignForm.title,
        subject: assignForm.subject,
        status: 'pending',
        dueAt: assignForm.dueAt,
        priority: assignForm.priority,
        progress: 0,
        file_url,
      },
      ...prev,
    ]);

    alert(out.message || 'Assignment saved');
    setAssignForm({ title: '', subject: '', dueAt: '', priority: 'medium', notes: '', autoSync: true, file: null });
    setActiveModal(null);
  }

  // --- document modal state ---
  const [docForm, setDocForm] = useState({ title: '', type: 'other', isResearch: false, file: null });
  async function saveDocument() {
    if (!docForm.title.trim() || !docForm.file) return alert('Title and file required');
    const fd = new FormData();
    fd.append('file', docForm.file);
    fd.append('title', docForm.title);
    fd.append('doc_type', docForm.type);
    fd.append('is_research', String(!!docForm.isResearch));
    const res = await fetch('/api/documents', { method: 'POST', body: fd });
    const data = res.ok ? await res.json() : { ok: false };
    if (!data.ok) return alert('Upload failed');
    setDocs(prev => [
      { id: Date.now(), title: docForm.title, file_url: data.file_url, doc_type: docForm.type, uploaded_at: new Date().toISOString(), is_research: !!docForm.isResearch },
      ...prev,
    ]);
    setDocForm({ title: '', type: 'other', isResearch: false, file: null });
    setActiveModal(null);
  }

  // --- ICS import ---
  const [icsUrl, setIcsUrl] = useState('');
  async function importICS() {
    if (!icsUrl.trim()) return alert('Paste an ICS feed URL');
    const res = await api('/api/calendar/import-ics', { method: 'POST', body: JSON.stringify({ url: icsUrl }) });
    const out = await res.json();
    alert(out.ok ? `Imported ${out.imported} events` : 'Import failed');
    setActiveModal(null);
  }

  // --- UI ---
  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 font-['Inter',sans-serif]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-stone-200 overflow-hidden flex flex-col shadow-lg`}>
        <div className="p-6 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
              <Scale className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Chakshi</h1>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={Home} text="Dashboard" active />

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Study & Learn Center</div>
          <NavItem icon={FileText} text="My Assignments" onClick={() => setActiveModal('addAssignment')} />
          <NavItem icon={Book} text="My Documents" onClick={() => setActiveModal('addDocument')} />

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Schedule</div>
          <NavItem icon={CalendarIcon} text="Study Calendar" />

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</div>
          <NavItem icon={Search} text="Research Center" />
          <NavItem icon={Briefcase} text="Career & Exam Prep" />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-800 transition">
                <Menu size={24} />
              </button>
              <div>
                <p className="text-sm text-gray-500">{currentDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GoogleSyncButton />
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
          <StatCard label="Active Courses" value={4} />
          <StatCard label="Assignments (next 7 days)" value={assignmentsNext7} />
          <StatCard label="Study Hours (today)" value={studyHours} />
          <StatCard label="Grade Average" value={gradeAvg} />
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
                <div className="flex gap-2">
                  <button onClick={() => setActiveModal('addTask')} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-sm">
                    <Plus size={18} /> Add Priority Task
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {prioritiesForToday.length === 0 && (
                  <div className="text-sm text-gray-500">No tasks for today — add a priority task to stay on top.</div>
                )}
                {prioritiesForToday.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition border border-stone-200">
                    {item.kind === 'task' ? (
                      <input type="checkbox" checked={!!item.completed} onChange={() => toggleTask(Number(String(item.id).replace('task-','')))} className="mt-1 w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer" />
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
                          const tId = Number(String(item.id).replace('task-',''));
                          const t = priorities.find(p=>p.id===tId);
                          if (!t) return;
                          setEditingTask(t);
                          setActiveModal('editTask');
                        }} className="text-blue-600 hover:text-blue-800 transition p-1"><Edit2 size={16} /></button>
                        <button onClick={() => deleteTask(Number(String(item.id).replace('task-','')))} className="text-red-600 hover:text-red-800 transition p-1"><Trash2 size={16} /></button>
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
                <button onClick={() => setActiveModal('addAssignment')} className="px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm">Add Assignment</button>
              </div>

              <div className="space-y-3">
                {todaysAssignments.map(a => (
                  <div key={a.id} className={clsx('p-4 rounded-xl border transition', a.status==='completed' ? 'bg-green-50 border-green-200' : 'bg-white border-stone-200')}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800">{a.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{a.subject}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={clsx('text-xs px-2 py-1 rounded-lg border', getPriorityPill(a.priority))}>{a.priority.toUpperCase()}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {new Date(a.dueAt).toLocaleString()}</span>
                        </div>
                        {/* progress */}
                        <div className="mt-3 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${a.progress || 0}%` }} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 whitespace-nowrap">
                        {a.status === 'pending' && (
                          <button onClick={() => markAssignmentComplete(a.id)} className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">Mark Complete</button>
                        )}
                        <button onClick={() => { setSelectedAssignment(a); setActiveModal('viewAssignment'); }} className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">View</button>
                        <button onClick={() => { setSelectedAssignment(a); setActiveModal('analyseAssignment'); }} className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm">Analyse</button>
                      </div>
                    </div>
                  </div>
                ))}
                {todaysAssignments.length === 0 && (
                  <div className="text-sm text-gray-500">Nothing due today. Great time to get ahead!</div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick actions + Mini Calendar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setActiveModal('addAssignment')} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
                  <Plus size={16} /> Assignment
                </button>
                <button onClick={() => setActiveModal('addDocument')} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-stone-200 text-stone-700 bg-stone-50 hover:bg-stone-100">
                  <Upload size={16} /> Document
                </button>
                <button onClick={() => setActiveModal('icsImport')} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                  <Link2 size={16} /> Import ICS
                </button>
                <a href="/api/auth/google" className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100">
                  <Cloud size={16} /> Connect Google
                </a>
              </div>
            </div>

            {/* Mini Calendar */}
            <MiniCalendarWidget events={events} />
          </div>
        </div>

        {/* Full Calendar */}
        <div className="px-6 pb-10">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800">Study Calendar</h4>
            </div>
            <CalendarView events={events} />
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'addTask' && (
        <Modal title="Add Priority Task" onClose={() => { setActiveModal(null); setNewTask({ title: '', notes: '', priority: 'medium', dueAt: '' }); }}>
          <div className="space-y-4">
            <Field label="Title">
              <input type="text" value={newTask.title} onChange={e=>setNewTask(v=>({ ...v, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Enter task title" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Due Date & Time">
                <input type="datetime-local" value={newTask.dueAt} onChange={e=>setNewTask(v=>({ ...v, dueAt: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
              </Field>
              <Field label="Priority">
                <select value={newTask.priority} onChange={e=>setNewTask(v=>({ ...v, priority: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </Field>
            </div>
            <Field label="Notes (optional)">
              <textarea value={newTask.notes} onChange={e=>setNewTask(v=>({ ...v, notes: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
            </Field>
            <button onClick={addTask} className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition font-semibold shadow-md">Save Task</button>
          </div>
        </Modal>
      )}

      {activeModal === 'editTask' && editingTask && (
        <Modal title="Edit Task" onClose={() => { setActiveModal(null); setEditingTask(null); }}>
          <div className="space-y-4">
            <Field label="Title">
              <input type="text" value={editingTask.title} onChange={e=>setEditingTask(v=>({ ...v, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Due Date & Time">
                <input type="datetime-local" value={editingTask.dueAt} onChange={e=>setEditingTask(v=>({ ...v, dueAt: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
              </Field>
              <Field label="Priority">
                <select value={editingTask.priority} onChange={e=>setEditingTask(v=>({ ...v, priority: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </Field>
            </div>
            <button onClick={() => {
              setPriorities(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
              setActiveModal(null); setEditingTask(null);
            }} className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition font-semibold shadow-md">Update Task</button>
          </div>
        </Modal>
      )}

      {activeModal === 'addAssignment' && (
        <Modal title="Create new assignment" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <Field label="Title*">
              <input type="text" value={assignForm.title} onChange={e=>setAssignForm(v=>({ ...v, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Subject / Course">
                <input type="text" value={assignForm.subject} onChange={e=>setAssignForm(v=>({ ...v, subject: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </Field>
              <Field label="Due Date & Time*">
                <input type="datetime-local" value={assignForm.dueAt} onChange={e=>setAssignForm(v=>({ ...v, dueAt: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Priority">
                <select value={assignForm.priority} onChange={e=>setAssignForm(v=>({ ...v, priority: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </Field>
              <Field label="Upload File (optional)">
                <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setAssignForm(v=>({ ...v, file: e.target.files?.[0] || null }))} className="w-full" />
              </Field>
            </div>
            <Field label="Notes (optional)">
              <textarea value={assignForm.notes} onChange={e=>setAssignForm(v=>({ ...v, notes: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={assignForm.autoSync} onChange={e=>setAssignForm(v=>({ ...v, autoSync: e.target.checked }))} /> Auto-sync to my calendar</label>
            <div className="flex gap-3">
              <button onClick={saveAssignment} className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md">Save</button>
              <button onClick={()=>setActiveModal(null)} className="flex-1 py-3 bg-stone-200 text-stone-800 rounded-xl hover:bg-stone-300 transition font-semibold">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'addDocument' && (
        <Modal title="Upload Document" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <Field label="Title">
              <input type="text" value={docForm.title} onChange={e=>setDocForm(v=>({ ...v, title: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Document Type">
                <select value={docForm.type} onChange={e=>setDocForm(v=>({ ...v, type: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent">
                  <option value="case_law">Case Law</option>
                  <option value="notes">Notes</option>
                  <option value="research">Research</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="File">
                <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setDocForm(v=>({ ...v, file: e.target.files?.[0] || null }))} className="w-full" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={docForm.isResearch} onChange={e=>setDocForm(v=>({ ...v, isResearch: e.target.checked }))} /> Add to Research Notes</label>
            <div className="flex gap-3">
              <button onClick={saveDocument} className="flex-1 py-3 bg-stone-800 text-white rounded-xl hover:bg-black transition font-semibold shadow-md">Save</button>
              <button onClick={()=>setActiveModal(null)} className="flex-1 py-3 bg-stone-200 text-stone-800 rounded-xl hover:bg-stone-300 transition font-semibold">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'icsImport' && (
        <Modal title="Import calendar from ICS feed" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <Field label="ICS Feed URL">
              <input type="url" value={icsUrl} onChange={e=>setIcsUrl(e.target.value)} placeholder="https://example.com/calendar.ics" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </Field>
            <button onClick={importICS} className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold shadow-md">Import</button>
          </div>
        </Modal>
      )}

      {activeModal === 'viewAssignment' && selectedAssignment && (
        <Modal title={selectedAssignment.title} onClose={() => { setActiveModal(null); setSelectedAssignment(null); }}>
          <div className="space-y-4">
            <div className="p-4 bg-stone-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2"><strong>Subject:</strong> {selectedAssignment.subject}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Due:</strong> {new Date(selectedAssignment.dueAt).toLocaleString()}</p>
              <p className="text-sm text-gray-600"><strong>Status:</strong> <span className={clsx('font-semibold', selectedAssignment.status==='completed' ? 'text-green-600' : 'text-amber-600')}>{selectedAssignment.status.toUpperCase()}</span></p>
            </div>
            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <h4 className="font-semibold mb-2">Assignment Details</h4>
              <p className="text-gray-700 text-sm leading-relaxed">This is a placeholder for assignment content. The full assignment description, requirements, and submission guidelines would appear here.</p>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'analyseAssignment' && selectedAssignment && (
        <Modal title={`AI Analysis: ${selectedAssignment.title}`} onClose={() => { setActiveModal(null); setSelectedAssignment(null); }}>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="text-purple-600" size={20} />
                <h4 className="font-semibold text-gray-800">AI-Powered Analysis</h4>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-purple-600 mt-1" /> Key legal concepts identified</li>
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-purple-600 mt-1" /> Relevant case law suggestions</li>
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-purple-600 mt-1" /> Research methodology recommendations</li>
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-purple-600 mt-1" /> Writing structure and argumentation tips</li>
              </ul>
            </div>
            <button className="w-full py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition font-semibold shadow-md">Generate Full Analysis</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function NavItem({ icon: Icon, text, active, onClick }) {
  return (
    <button onClick={onClick} className={clsx('w-full flex items-center gap-3 px-4 py-3 rounded-xl transition', active ? 'bg-amber-100 text-amber-700 font-semibold shadow-sm' : 'text-gray-600 hover:bg-stone-50')}>
      <Icon size={20} />
      <span>{text}</span>
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <X size={24} />
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
    return map;
  }, [events]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-stone-200">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-800">{month.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        <div className="flex gap-2">
          <button className="px-2 py-1 rounded border" onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}>{'<'}</button>
          <button className="px-2 py-1 rounded border" onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>{'>'}</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center">{d}</div>)}
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

function GoogleSyncButton() {
  const [connected, setConnected] = useState(false);
  return connected ? (
    <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
      <CheckCircle size={16} /> Google Connected
    </button>
  ) : (
    <a href="/api/auth/google" className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
      <Cloud size={16} /> Connect Google
    </a>
  );
}
