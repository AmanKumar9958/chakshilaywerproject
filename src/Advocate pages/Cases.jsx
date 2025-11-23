import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Calendar, 
  Upload, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  Share2, 
  Bell, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Brain,
  Gavel,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
  Star,
  Target,
  BookOpen,
  MessageSquare,
  History,
  Zap,
  Shield,
  Activity,
  PieChart,
  BarChart3,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Award,
  Scale
} from 'lucide-react';
import Swal from 'sweetalert2';
import CaseDetailView from './CaseDetailView'; // Import the separate component

const Cases = () => {
  // Color Palette
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
    green: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    red: '#ef4444'
  };

  const [selectedCase, setSelectedCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('hearing_date');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [clientSearch, setClientSearch] = useState('');

  const [cases, setCases] = useState([
    {
      id: 'CIV/2024/001',
      title: 'Property Dispute - Residential Complex',
      court: 'High Court of Madras',
      stage: 'Evidence Phase',
      status: 'active',
      client: 'M/s Greenfield Properties',
      oppositeParty: 'Chennai Development Authority',
      nextHearing: '2024-10-15',
      caseStrength: 85,
      priority: 'high',
      createdDate: '2024-01-15',
      lastUpdated: '2024-10-08',
      caseValue: '₹2.5 Cr',
      judge: 'Justice R. Mahadevan',
      courtNumber: 'Court No. 15',
      advocate: 'Senior Advocate K.R. Subramanian',
      juniorAdvocates: ['Adv. Priya Sharma', 'Adv. Rajesh Kumar'],
      description: 'Dispute regarding land acquisition and compensation for residential complex development project.',
      timeline: [
        { stage: 'Plaint Filed', date: '2024-01-15', status: 'completed', description: 'Initial petition filed against CDA' },
        { stage: 'Summons Issued', date: '2024-01-25', status: 'completed', description: 'Court summons served to respondent' },
        { stage: 'Written Statement', date: '2024-02-15', status: 'completed', description: 'Respondent filed written statement' },
        { stage: 'Evidence Phase', date: '2024-03-01', status: 'active', description: 'Document evidence submission ongoing' },
        { stage: 'Arguments', date: '2024-11-15', status: 'pending', description: 'Final arguments scheduled' },
        { stage: 'Judgment', date: 'TBD', status: 'pending', description: 'Court judgment awaited' }
      ],
      documents: [
        { type: 'Plaint', name: 'Original Petition.pdf', date: '2024-01-15', size: '2.4 MB', status: 'verified' },
        { type: 'Evidence', name: 'Survey Settlement Records.pdf', date: '2024-03-10', size: '5.8 MB', status: 'verified' },
        { type: 'Court Order', name: 'Interim Order.pdf', date: '2024-09-20', size: '1.2 MB', status: 'new' },
        { type: 'Correspondence', name: 'Client Communication.pdf', date: '2024-10-05', size: '800 KB', status: 'draft' }
      ],
      hearings: [
        { date: '2024-01-25', outcome: 'Summons issued', judge: 'Justice R. Mahadevan', remarks: 'Matter admitted, summons to be served within 30 days' },
        { date: '2024-02-28', outcome: 'Pleadings complete', judge: 'Justice R. Mahadevan', remarks: 'Written statement filed, matter posted for evidence' },
        { date: '2024-09-20', outcome: 'Interim relief granted', judge: 'Justice R. Mahadevan', remarks: 'Status quo to be maintained pending final disposal' }
      ],
      expenses: {
        courtFees: 15000,
        advocateFees: 150000,
        travel: 8500,
        documentation: 12000,
        misc: 5000,
        total: 190500
      },
      relatedCases: ['CIV/2023/445', 'CIV/2024/067'],
      aiInsights: {
        strengthFactors: ['Strong documentary evidence', 'Favorable precedents', 'Clear title documents'],
        riskFactors: ['Lengthy litigation process', 'Government party involvement'],
        recommendedStrategy: 'Focus on settlement negotiations while maintaining strong litigation stance'
      }
    },
    {
      id: 'CRIM/2024/089',
      title: 'Economic Offences - Financial Fraud',
      court: 'Sessions Court',
      stage: 'Trial',
      status: 'active',
      client: 'State Bank of India',
      oppositeParty: 'Accused: Mr. Rajesh Agarwal & Others',
      nextHearing: '2024-10-12',
      caseStrength: 92,
      priority: 'high',
      createdDate: '2024-02-20',
      lastUpdated: '2024-10-07',
      caseValue: '₹5.2 Cr',
      judge: 'Additional Sessions Judge III',
      courtNumber: 'Court No. 8',
      advocate: 'Public Prosecutor',
      timeline: [
        { stage: 'FIR Registration', date: '2024-02-20', status: 'completed' },
        { stage: 'Charge Sheet Filed', date: '2024-04-15', status: 'completed' },
        { stage: 'Framing of Charges', date: '2024-05-20', status: 'completed' },
        { stage: 'Trial Proceedings', date: '2024-06-01', status: 'active' },
        { stage: 'Final Arguments', date: 'TBD', status: 'pending' },
        { stage: 'Judgment', date: 'TBD', status: 'pending' }
      ],
      expenses: { total: 85000 }
    },
    {
      id: 'FAM/2024/156',
      title: 'Matrimonial Dispute - Custody Case',
      court: 'Family Court',
      stage: 'Mediation',
      status: 'settled',
      client: 'Mrs. Kavitha Sundaram',
      oppositeParty: 'Mr. Sundaram Krishnan',
      nextHearing: 'N/A',
      caseStrength: 78,
      priority: 'medium',
      createdDate: '2024-03-10',
      lastUpdated: '2024-09-15',
      caseValue: 'N/A',
      settledDate: '2024-09-15',
      timeline: [
        { stage: 'Petition Filed', date: '2024-03-10', status: 'completed' },
        { stage: 'Mediation Ordered', date: '2024-04-05', status: 'completed' },
        { stage: 'Settlement Reached', date: '2024-09-15', status: 'completed' }
      ],
      expenses: { total: 45000 }
    }
  ]);

  const fileUploadRef = useRef();

  useEffect(() => {
    fetch('http://localhost:4000/api/cases')
      .then(res => res.json())
      .then(data => setCases(data.data))
      .catch(err => console.error('Error fetching cases:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/api/clients')
      .then((res) => res.json())
      .then((data) => {
        const clientList = Array.isArray(data) ? data : data.data || [];
        setClients(clientList);
        setFilteredClients(clientList);
      })
      .catch((err) => console.error('Error fetching clients:', err));
  }, []);

  // Filter and search
  const filteredCases = cases.filter(caseItem => {
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'hearing_date':
        return new Date(a.nextHearing) - new Date(b.nextHearing);
      case 'case_strength':
        return b.caseStrength - a.caseStrength;
      case 'created_date':
        return new Date(b.createdDate) - new Date(a.createdDate);
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: `${colors.blue}15`, text: colors.blue, border: `${colors.blue}40` };
      case 'won': return { bg: `${colors.green}15`, text: colors.green, border: `${colors.green}40` };
      case 'lost': return { bg: `${colors.red}15`, text: colors.red, border: `${colors.red}40` };
      case 'settled': return { bg: `${colors.golden}15`, text: colors.golden, border: `${colors.golden}40` };
      case 'archived': return { bg: `${colors.gray}15`, text: colors.gray, border: `${colors.gray}40` };
      default: return { bg: `${colors.gray}15`, text: colors.gray, border: `${colors.gray}40` };
    }
  };

  const getStrengthColor = (strength) => {
    if (strength >= 80) return colors.green;
    if (strength >= 60) return colors.golden;
    if (strength >= 40) return colors.amber;
    return colors.red;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return colors.red;
      case 'medium': return colors.amber;
      case 'low': return colors.green;
      default: return colors.gray;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === 'TBD') return dateString;
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleFileUpload = async (files) => {
    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (selectedCase && files.length > 0) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `${files.length} document(s) uploaded successfully to ${selectedCase.id}`,
        type: 'success',
        timestamp: new Date()
      }]);
    }
    
    setIsUploading(false);
  };

  const handleCaseEdit = (caseItem) => {
    setEditingCase(caseItem);
    setShowNewCaseModal(true);
  };

  const handleNewCase = () => {
    setEditingCase(null);
    setShowNewCaseModal(true);
  };

  const handleSubmitCase = async (e, formData) => {
    e.preventDefault();

    try {
      const method = editingCase ? 'PUT' : 'POST';
      const url = editingCase
        ? `http://localhost:4000/api/cases/${editingCase._id}`
        : 'http://localhost:4000/api/cases';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success) {
        if (data.message.includes("E11000")) {
          Swal.fire({
            icon: "error",
            title: "Duplicate Case Number",
            text: "This case number already exists. Please choose a different one.",
            confirmButtonColor: "#d33",
          });
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Something went wrong",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: editingCase ? "Case Updated Successfully" : "Case Created Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      if (editingCase) {
        setCases((prev) =>
          prev.map((c) => (c._id === editingCase._id ? data.data : c))
        );
      } else {
        setCases((prev) => [data.data, ...prev]);
      }

      setShowNewCaseModal(false);
      setEditingCase(null);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: error.message,
      });
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const CaseCard = ({ caseItem }) => {
    const statusStyle = getStatusColor(caseItem.status);
    
    return (
      <div 
        className="rounded-lg p-6 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
          backdropFilter: 'blur(6px)',
          border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
          boxShadow: `0 0 15px rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
        }}
        onClick={() => setSelectedCase(caseItem)}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold" style={{color: colors.navy}}>
                {caseItem.id}
              </h3>
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium border"
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.text,
                  borderColor: statusStyle.border
                }}
              >
                {caseItem.status.toUpperCase()}
              </span>
              <div 
                className="w-2 h-2 rounded-full"
                style={{background: getPriorityColor(caseItem.priority)}}
              ></div>
            </div>
            <p className="text-sm mb-1" style={{color: colors.navy}}>
              {caseItem.title}
            </p>
            <p className="text-xs" style={{color: colors.gray}}>
              {caseItem.court} • {caseItem.stage}
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-2">
              <Brain className="w-4 h-4" style={{color: colors.golden}} />
              <span className="text-sm font-medium" style={{color: getStrengthColor(caseItem.caseStrength)}}>
                {caseItem.caseStrength}%
              </span>
            </div>
            {/* <p className="text-xs" style={{color: colors.gray}}>
              Strength Score
            </p> */}
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-medium mb-1" style={{color: colors.gray}}>Client</p>
            <p className="text-sm" style={{color: colors.navy}}>{caseItem.client}</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{color: colors.gray}}>Opposite Party</p>
            <p className="text-sm" style={{color: colors.navy}}>{caseItem.oppositeParty}</p>
          </div>
        </div>

        {/* Next Hearing & Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{color: colors.golden}} />
            <div>
              <p className="text-xs" style={{color: colors.gray}}>Next Hearing</p>
              <p className="text-sm font-medium" style={{color: colors.navy}}>
                {formatDate(caseItem.nextHearing)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-lg transition-colors"
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                color: colors.golden
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCase(caseItem);
              }}
              title="View Case Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              className="p-2 rounded-lg transition-colors"
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                color: colors.golden
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCaseEdit(caseItem);
              }}
              title="Edit Case"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              className="p-2 rounded-lg transition-colors"
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                color: colors.golden
              }}
              onClick={(e) => {
                e.stopPropagation();
                fileUploadRef.current?.click();
              }}
              title="Upload Document"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen ml-72" style={{background: colors.cream}}>
      {/* Header */}
      <div className="sticky top-0 z-30 p-6" style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.10))`,
        backdropFilter: 'blur(6px)',
        borderBottom: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
      }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{color: colors.navy}}>
              Cases Repository
            </h1>
            <p style={{color: colors.gray}}>
              Manage all your legal cases and track progress
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                color: 'white'
              }}
              onClick={handleNewCase}
            >
              <Plus className="w-4 h-4" />
              New Case
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: colors.golden}} />
            <input
              type="text"
              placeholder="Search cases, clients, case numbers..."
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none transition-all"
              style={{
                background: `rgba(255, 255, 255, 0.06)`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                color: colors.navy,
                backdropFilter: 'blur(6px)'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = colors.golden}
              onBlur={(e) => e.target.style.borderColor = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg focus:outline-none transition-all"
              style={{
                background: `rgba(255, 255, 255, 0.06)`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                color: colors.navy,
                backdropFilter: 'blur(6px)'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="settled">Settled</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg focus:outline-none transition-all"
              style={{
                background: `rgba(255, 255, 255, 0.06)`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                color: colors.navy,
                backdropFilter: 'blur(6px)'
              }}
            >
              <option value="hearing_date">Next Hearing</option>
              <option value="case_strength">Case Strength</option>
              <option value="created_date">Created Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(sortedCases || []).map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>

        {sortedCases.length === 0 && (
          <div className="text-center py-12">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
              }}
            >
              <Scale className="w-8 h-8" style={{color: colors.golden}} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{color: colors.navy}}>
              No cases found
            </h3>
            <p style={{color: colors.gray}}>
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first case'
              }
            </p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input 
        ref={fileUploadRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.png"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300"
            style={{
              background: notification.type === 'success' 
                ? `linear-gradient(135deg, ${colors.green}20, ${colors.green}10)`
                : notification.type === 'error'
                ? `linear-gradient(135deg, ${colors.red}20, ${colors.red}10)`
                : `linear-gradient(135deg, ${colors.blue}20, ${colors.blue}10)`,
              border: `1px solid ${
                notification.type === 'success' 
                  ? colors.green + '40'
                  : notification.type === 'error'
                  ? colors.red + '40'
                  : colors.blue + '40'
              }`
            }}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium pr-2" style={{color: colors.navy}}>
                {notification.message}
              </p>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                style={{color: colors.gray}}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Case Modal */}
     {/* New Case Modal */}
{showNewCaseModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-6" style={{
      background: colors.cream,
      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
    }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{color: colors.navy}}>
          {editingCase ? 'Edit Case' : 'New Case'}
        </h2>
        <button
          onClick={() => setShowNewCaseModal(false)}
          className="p-2 rounded-lg transition-colors"
          style={{
            background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
            color: colors.golden
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form className="space-y-4" onSubmit={(e) => {
        const formData = {
          caseNumber: e.target.caseNumber.value,
          court: e.target.court.value,
          caseTitle: e.target.caseTitle.value,
          clientName: e.target.clientName.value,
          oppositeParty: e.target.oppositeParty.value,
          status: e.target.status.value // Added status field
        };
        handleSubmitCase(e, formData);
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
              Case Number *
            </label>
            <input
              name="caseNumber"
              type="text"
              className="w-full p-3 rounded-lg border focus:outline-none transition-all"
              style={{
                background: `rgba(255, 255, 255, 0.03)`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                color: colors.navy
              }}
              placeholder="e.g., CIV/2024/001"
              defaultValue={editingCase?.caseNumber || editingCase?.id || ''}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
              Court *
            </label>
            <select
              name="court"
              className="w-full p-3 rounded-lg border focus:outline-none transition-all"
              style={{
                background: `rgba(255, 255, 255, 0.03)`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                color: colors.navy
              }}
              defaultValue={editingCase?.court || ''}
              required
            >
              <option value="">Select Court</option>
              <option value="High Court of Madras">High Court of Madras</option>
              <option value="Sessions Court">Sessions Court</option>
              <option value="Family Court">Family Court</option>
              <option value="District Court">District Court</option>
              <option value="Supreme Court">Supreme Court</option>
              <option value="Consumer Court">Consumer Court</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
            Case Title *
          </label>
          <input
            name="caseTitle"
            type="text"
            className="w-full p-3 rounded-lg border focus:outline-none transition-all"
            style={{
              background: `rgba(255, 255, 255, 0.03)`,
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
              color: colors.navy
            }}
            placeholder="Brief description of the case"
            defaultValue={editingCase?.caseTitle || editingCase?.title || ''}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={{ position: 'relative' }}>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
              Client Name *
            </label>

            <input
              name="clientName"
              type="text"
              value={clientSearch}
              onChange={(e) => {
                const value = e.target.value;
                setClientSearch(value);
                setFilteredClients(
                  clients.filter((c) =>
                    c.clientName?.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
              className="w-full p-3 rounded-lg border focus:outline-none transition-all"
              style={{
                background: `rgba(255, 255, 255, 0.03)`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                color: colors.navy
              }}
              placeholder="Search or select client"
              required
            />

            {clientSearch && filteredClients.length > 0 && (
              <ul
                className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-auto shadow-lg"
                style={{
                  borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.3)`
                }}
              >
                {filteredClients.map((client) => (
                  <li
                    key={client._id}
                    onClick={() => {
                      setClientSearch(client.clientName);
                      setFilteredClients([]);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {client.clientName} – <span className="text-gray-500">{client.companyName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
              Opposite Party *
            </label>
            <input
              name="oppositeParty"
              type="text"
              className="w-full p-3 rounded-lg border focus:outline-none transition-all"
              style={{
                background: `rgba(255, 255, 255, 0.03)`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                color: colors.navy
              }}
              placeholder="Respondent or defendant name"
              defaultValue={editingCase?.oppositeParty || ''}
              required
            />
          </div>
        </div>

        {/* NEW STATUS FIELD */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
            Case Status *
          </label>
          <select
            name="status"
            className="w-full p-3 rounded-lg border focus:outline-none transition-all"
            style={{
              background: `rgba(255, 255, 255, 0.03)`,
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
              color: colors.navy
            }}
            defaultValue={editingCase?.status || 'active'}
            required
          >
            <option value="active">Active</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="settled">Settled</option>
            <option value="archived">Archived</option>
          </select>
          <p className="text-xs mt-1" style={{color: colors.gray}}>
            Select the current status of the case
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setShowNewCaseModal(false);
              setClientSearch('');
              setFilteredClients([]);
            }}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              background: `rgba(${parseInt(colors.gray.slice(1, 3), 16)}, ${parseInt(colors.gray.slice(3, 5), 16)}, ${parseInt(colors.gray.slice(5, 7), 16)}, 0.10)`,
              color: colors.gray
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
              color: 'white'
            }}
          >
            {editingCase ? 'Update Case' : 'Create Case'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Case Detail View - Now using separate component */}
      {selectedCase && (
        <CaseDetailView 
          selectedCase={selectedCase} 
          onClose={() => setSelectedCase(null)} 
        />
      )}
    </div>
  );
};

export default Cases;
