import React, { useState, useRef } from 'react';
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

const Cases = () => {
  // Hero.js Color Palette
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

  const [activeView, setActiveView] = useState('list'); // list, detail, timeline
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('hearing_date');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [caseNotes, setCaseNotes] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileUploadRef = useRef();

  // Mock case data with comprehensive information
  const cases = [
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
  ];

  // Filter and search functions
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

  // Functional handlers
  const handleFileUpload = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Add uploaded files to selected case documents
    if (selectedCase && files.length > 0) {
      const newDocuments = Array.from(files).map((file, index) => ({
        type: file.type.includes('pdf') ? 'Evidence' : 'Correspondence',
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'new'
      }));
      
      // Update case documents (in real app, this would update state/database)
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `${files.length} document(s) uploaded successfully to ${selectedCase.id}`,
        type: 'success',
        timestamp: new Date()
      }]);
    }
    
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleCaseEdit = (caseItem) => {
    setEditingCase(caseItem);
    setShowNewCaseModal(true);
  };

  const handleCaseView = (caseItem) => {
    setSelectedCase(caseItem);
    setActiveView('detail');
  };

  const handleSetReminder = (caseItem) => {
    const reminderDate = prompt('Enter reminder date (YYYY-MM-DD):');
    if (reminderDate) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `Reminder set for ${caseItem.id} on ${reminderDate}`,
        type: 'info',
        timestamp: new Date()
      }]);
    }
  };

  const handleShareWithClient = (caseItem) => {
    // Generate shareable link
    const shareLink = `${window.location.origin}/client-portal/${caseItem.id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `Client portal link copied to clipboard for ${caseItem.id}`,
        type: 'success',
        timestamp: new Date()
      }]);
    });
  };

  const handleExportCase = (caseItem) => {
    // Export case data as JSON
    const caseData = {
      ...caseItem,
      exportDate: new Date().toISOString(),
      exportedBy: 'Current User'
    };
    
    const blob = new Blob([JSON.stringify(caseData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseItem.id.replace('/', '-')}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `Case ${caseItem.id} exported successfully`,
      type: 'success',
      timestamp: new Date()
    }]);
  };

  const handleBulkUpload = () => {
    setShowBulkUpload(true);
  };

  const handleNewCase = () => {
    setEditingCase(null);
    setShowNewCaseModal(true);
  };

  const updateCaseNotes = (caseId, notes) => {
    setCaseNotes(prev => ({
      ...prev,
      [caseId]: notes
    }));
    
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `Notes updated for case ${caseId}`,
      type: 'info',
      timestamp: new Date()
    }]);
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
        onClick={() => {
          setSelectedCase(caseItem);
          setActiveView('detail');
        }}
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
            <p className="text-xs" style={{color: colors.gray}}>
              Strength Score
            </p>
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
                handleCaseView(caseItem);
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

  const CaseTimeline = ({ timeline }) => {
    return (
      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: item.status === 'completed' 
                    ? `linear-gradient(135deg, ${colors.green}, ${colors.green}DD)`
                    : item.status === 'active'
                    ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                    : `rgba(${parseInt(colors.gray.slice(1, 3), 16)}, ${parseInt(colors.gray.slice(3, 5), 16)}, ${parseInt(colors.gray.slice(5, 7), 16)}, 0.20)`
                }}
              >
                {item.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : item.status === 'active' ? (
                  <Clock className="w-4 h-4 text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full" style={{background: colors.gray}}></div>
                )}
              </div>
              {index < timeline.length - 1 && (
                <div 
                  className="w-0.5 h-8 mt-2"
                  style={{
                    background: item.status === 'completed' 
                      ? colors.green 
                      : `rgba(${parseInt(colors.gray.slice(1, 3), 16)}, ${parseInt(colors.gray.slice(3, 5), 16)}, ${parseInt(colors.gray.slice(5, 7), 16)}, 0.30)`
                  }}
                ></div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium" style={{color: colors.navy}}>
                  {item.stage}
                </h4>
                <span className="text-xs" style={{color: colors.gray}}>
                  {formatDate(item.date)}
                </span>
              </div>
              <p className="text-sm" style={{color: colors.gray}}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (activeView === 'detail' && selectedCase) {
    return (
     <div className="min-h-screen ml-72" style={{background: colors.cream}}>
        {/* Header */}
        <div className="sticky top-0 z-30 p-6" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.10))`,
          backdropFilter: 'blur(6px)',
          borderBottom: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('list')}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                  color: colors.golden
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold" style={{color: colors.navy}}>
                  {selectedCase.id}
                </h1>
                <p style={{color: colors.gray}}>{selectedCase.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                  color: 'white'
                }}
              >
                Generate Report
              </button>
              <button 
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                  color: colors.golden
                }}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'timeline', label: 'Timeline', icon: Activity },
              { id: 'documents', label: 'Documents', icon: Folder },
              { id: 'hearings', label: 'Hearings', icon: Calendar },
              { id: 'notes', label: 'Notes', icon: MessageSquare },
              { id: 'expenses', label: 'Expenses', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
                style={{
                  background: activeTab === tab.id 
                    ? `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}15)`
                    : 'transparent',
                  color: activeTab === tab.id ? colors.navy : colors.gray,
                  border: activeTab === tab.id 
                    ? `1px solid ${colors.golden}40`
                    : '1px solid transparent'
                }}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Case Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Case Details */}
                <div className="rounded-lg p-6" style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  backdropFilter: 'blur(6px)',
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}>
                  <h3 className="text-lg font-semibold mb-4" style={{color: colors.navy}}>
                    Case Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>Court</p>
                      <p style={{color: colors.navy}}>{selectedCase.court}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>Stage</p>
                      <p style={{color: colors.navy}}>{selectedCase.stage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>Judge</p>
                      <p style={{color: colors.navy}}>{selectedCase.judge}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>Court Number</p>
                      <p style={{color: colors.navy}}>{selectedCase.courtNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>Case Value</p>
                      <p style={{color: colors.navy}}>{selectedCase.caseValue}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>Next Hearing</p>
                      <p style={{color: colors.navy}}>{formatDate(selectedCase.nextHearing)}</p>
                    </div>
                  </div>
                </div>

                {/* Parties Information */}
                <div className="rounded-lg p-6" style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  backdropFilter: 'blur(6px)',
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}>
                  <h3 className="text-lg font-semibold mb-4" style={{color: colors.navy}}>
                    Parties Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2" style={{color: colors.gray}}>Petitioner/Client</p>
                      <p style={{color: colors.navy}}>{selectedCase.client}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2" style={{color: colors.gray}}>Respondent/Opposite Party</p>
                      <p style={{color: colors.navy}}>{selectedCase.oppositeParty}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2" style={{color: colors.gray}}>Senior Advocate</p>
                      <p style={{color: colors.navy}}>{selectedCase.advocate}</p>
                    </div>
                    {selectedCase.juniorAdvocates && (
                      <div>
                        <p className="text-sm font-medium mb-2" style={{color: colors.gray}}>Junior Advocates</p>
                        <div className="space-y-1">
                          {selectedCase.juniorAdvocates.map((advocate, index) => (
                            <p key={index} style={{color: colors.navy}}>{advocate}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Case Strength */}
                <div className="rounded-lg p-6" style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  backdropFilter: 'blur(6px)',
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5" style={{color: colors.golden}} />
                    <h3 className="text-lg font-semibold" style={{color: colors.navy}}>
                      AI Case Analysis
                    </h3>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${getStrengthColor(selectedCase.caseStrength)}20, ${getStrengthColor(selectedCase.caseStrength)}10)`,
                        border: `2px solid ${getStrengthColor(selectedCase.caseStrength)}40`
                      }}
                    >
                      <span 
                        className="text-xl font-bold"
                        style={{color: getStrengthColor(selectedCase.caseStrength)}}
                      >
                        {selectedCase.caseStrength}%
                      </span>
                    </div>
                    <p className="text-sm" style={{color: colors.gray}}>Case Strength Score</p>
                  </div>

                  {selectedCase.aiInsights && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2" style={{color: colors.green}}>
                          Strength Factors
                        </p>
                        <ul className="text-xs space-y-1" style={{color: colors.gray}}>
                          {selectedCase.aiInsights.strengthFactors.map((factor, index) => (
                            <li key={index}>• {factor}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2" style={{color: colors.amber}}>
                          Risk Factors
                        </p>
                        <ul className="text-xs space-y-1" style={{color: colors.gray}}>
                          {selectedCase.aiInsights.riskFactors.map((factor, index) => (
                            <li key={index}>• {factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg p-6" style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  backdropFilter: 'blur(6px)',
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}>
                  <h3 className="text-lg font-semibold mb-4" style={{color: colors.navy}}>
                    Quick Actions
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { icon: Upload, label: 'Upload Document', color: colors.blue, action: () => fileUploadRef.current?.click() },
                      { icon: Bell, label: 'Set Reminder', color: colors.amber, action: () => handleSetReminder(selectedCase) },
                      { icon: Share2, label: 'Share with Client', color: colors.green, action: () => handleShareWithClient(selectedCase) },
                      { icon: Download, label: 'Export Case File', color: colors.golden, action: () => handleExportCase(selectedCase) }
                    ].map((action, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left"
                        style={{
                          background: `rgba(${parseInt(action.color.slice(1, 3), 16)}, ${parseInt(action.color.slice(3, 5), 16)}, ${parseInt(action.color.slice(5, 7), 16)}, 0.10)`,
                          color: colors.navy
                        }}
                        onClick={action.action}
                      >
                        <action.icon className="w-4 h-4" style={{color: action.color}} />
                        <span className="text-sm font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="max-w-4xl">
              <div className="rounded-lg p-6" style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                backdropFilter: 'blur(6px)',
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
              }}>
                <h3 className="text-lg font-semibold mb-6" style={{color: colors.navy}}>
                  Case Timeline
                </h3>
                <CaseTimeline timeline={selectedCase.timeline} />
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: colors.navy}}>
                  Documents Vault
                </h3>
                <button 
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                    color: 'white'
                  }}
                  onClick={() => fileUploadRef.current?.click()}
                >
                  Upload Document
                </button>
                <input 
                  ref={fileUploadRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </div>

              <div className="grid gap-4">
                {selectedCase.documents.map((doc, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                      backdropFilter: 'blur(6px)',
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
                        }}
                      >
                        <FileText className="w-5 h-5" style={{color: colors.golden}} />
                      </div>
                      <div>
                        <p className="font-medium" style={{color: colors.navy}}>{doc.name}</p>
                        <p className="text-sm" style={{color: colors.gray}}>
                          {doc.type} • {doc.size} • {formatDate(doc.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: doc.status === 'verified' 
                            ? `${colors.green}15` 
                            : doc.status === 'new'
                            ? `${colors.blue}15`
                            : `${colors.amber}15`,
                          color: doc.status === 'verified' 
                            ? colors.green 
                            : doc.status === 'new'
                            ? colors.blue
                            : colors.amber
                        }}
                      >
                        {doc.status}
                      </span>
                      <button 
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                          color: colors.golden
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hearings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{color: colors.navy}}>
                Hearing History
              </h3>
              
              <div className="space-y-4">
                {selectedCase.hearings.map((hearing, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                      backdropFilter: 'blur(6px)',
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium" style={{color: colors.navy}}>
                          {formatDate(hearing.date)}
                        </p>
                        <p className="text-sm" style={{color: colors.gray}}>
                          {hearing.judge}
                        </p>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          background: `${colors.golden}15`,
                          color: colors.golden
                        }}
                      >
                        {hearing.outcome}
                      </span>
                    </div>
                    <p style={{color: colors.navy}}>{hearing.remarks}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: colors.navy}}>
                  Case Notes & Strategy
                </h3>
                <button 
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                    color: 'white'
                  }}
                  onClick={() => updateCaseNotes(selectedCase.id, caseNotes[selectedCase.id] || '')}
                >
                  Save Notes
                </button>
              </div>

              <div className="rounded-lg p-6" style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                backdropFilter: 'blur(6px)',
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                      Strategy Notes
                    </label>
                    <textarea
                      className="w-full p-4 rounded-lg border resize-none focus:outline-none transition-all"
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                        color: colors.navy,
                        minHeight: '200px'
                      }}
                      placeholder="Add your case strategy, key points, next steps..."
                      value={caseNotes[selectedCase.id] || ''}
                      onChange={(e) => setCaseNotes(prev => ({
                        ...prev,
                        [selectedCase.id]: e.target.value
                      }))}
                      onFocus={(e) => e.target.style.borderColor = colors.golden}
                      onBlur={(e) => e.target.style.borderColor = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}
                    />
                  </div>

                  {selectedCase.aiInsights && (
                    <div>
                      <h4 className="text-sm font-medium mb-3" style={{color: colors.navy}}>
                        AI Recommended Strategy
                      </h4>
                      <div className="p-4 rounded-lg" style={{
                        background: `linear-gradient(135deg, ${colors.golden}10, ${colors.golden}05)`,
                        border: `1px solid ${colors.golden}30`
                      }}>
                        <p style={{color: colors.navy}}>
                          {selectedCase.aiInsights.recommendedStrategy}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{color: colors.green}}>
                        Alternative Arguments
                      </h4>
                      <ul className="text-sm space-y-1" style={{color: colors.gray}}>
                        <li>• Constitutional validity challenge</li>
                        <li>• Procedural irregularity defense</li>
                        <li>• Statutory interpretation argument</li>
                        <li>• Precedent-based reasoning</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{color: colors.blue}}>
                        Related Judgments
                      </h4>
                      <ul className="text-sm space-y-1" style={{color: colors.gray}}>
                        <li>• ABC vs XYZ (2023) 1 SCC 123</li>
                        <li>• State vs Citizens (2022) AIR SC 456</li>
                        <li>• Land Acquisition Case (2021) 3 SCC 789</li>
                        <li>• Development Rights (2020) 2 SCC 234</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && selectedCase.expenses && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{color: colors.navy}}>
                Expense Tracking
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(selectedCase.expenses).map(([key, value]) => {
                  if (key === 'total') return null;
                  return (
                    <div 
                      key={key}
                      className="p-4 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                        backdropFilter: 'blur(6px)',
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}
                    >
                      <p className="text-sm font-medium mb-2" style={{color: colors.gray}}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </p>
                      <p className="text-xl font-bold" style={{color: colors.navy}}>
                        ₹{value.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div 
                className="p-6 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`,
                  border: `1px solid ${colors.golden}40`
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold" style={{color: colors.navy}}>
                    Total Expenses
                  </span>
                  <span className="text-2xl font-bold" style={{color: colors.navy}}>
                    ₹{selectedCase.expenses.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                color: colors.golden,
                border: `1px solid ${colors.golden}40`
              }}
              onClick={handleBulkUpload}
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </button>
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                color: 'white'
              }}
              onClick={handleNewCase}
            >
              <Plus className="w-4 h-4 mr-2" />
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
          {sortedCases.map((caseItem) => (
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
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="w-full max-w-2xl rounded-lg p-6" style={{
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

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                    Case Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                    style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                      color: colors.navy
                    }}
                    placeholder="e.g., CIV/2024/001"
                    defaultValue={editingCase?.id || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                    Court
                  </label>
                  <select
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                    style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                      color: colors.navy
                    }}
                    defaultValue={editingCase?.court || ''}
                  >
                    <option value="">Select Court</option>
                    <option value="High Court of Madras">High Court of Madras</option>
                    <option value="Sessions Court">Sessions Court</option>
                    <option value="Family Court">Family Court</option>
                    <option value="District Court">District Court</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                  Case Title
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                  style={{
                    background: `rgba(255, 255, 255, 0.03)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                    color: colors.navy
                  }}
                  placeholder="Brief description of the case"
                  defaultValue={editingCase?.title || ''}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                    style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                      color: colors.navy
                    }}
                    placeholder="Client or petitioner name"
                    defaultValue={editingCase?.client || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                    Opposite Party
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                    style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                      color: colors.navy
                    }}
                    placeholder="Respondent or defendant name"
                    defaultValue={editingCase?.oppositeParty || ''}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
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
                  onClick={(e) => {
                    e.preventDefault();
                    setNotifications(prev => [...prev, {
                      id: Date.now(),
                      message: editingCase ? 'Case updated successfully' : 'New case created successfully',
                      type: 'success',
                      timestamp: new Date()
                    }]);
                    setShowNewCaseModal(false);
                  }}
                >
                  {editingCase ? 'Update Case' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="w-full max-w-lg rounded-lg p-6" style={{
            background: colors.cream,
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{color: colors.navy}}>
                Bulk Upload Cases
              </h2>
              <button
                onClick={() => setShowBulkUpload(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                  color: colors.golden
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed rounded-lg transition-colors" style={{
                borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.30)`,
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
              }}>
                <Upload className="w-12 h-12 mx-auto mb-4" style={{color: colors.golden}} />
                <p className="text-lg font-medium mb-2" style={{color: colors.navy}}>
                  Drop your case files here
                </p>
                <p className="text-sm" style={{color: colors.gray}}>
                  or click to browse files
                </p>
                <p className="text-xs mt-2" style={{color: colors.gray}}>
                  Supports: PDF, DOC, DOCX, ZIP
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{color: colors.navy}}>
                      Uploading...
                    </span>
                    <span className="text-sm" style={{color: colors.gray}}>
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}}>
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${uploadProgress}%`,
                        background: `linear-gradient(90deg, ${colors.golden}, ${colors.golden}CC)`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    background: `rgba(${parseInt(colors.gray.slice(1, 3), 16)}, ${parseInt(colors.gray.slice(3, 5), 16)}, ${parseInt(colors.gray.slice(5, 7), 16)}, 0.10)`,
                    color: colors.gray
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                    color: 'white'
                  }}
                  onClick={() => {
                    setNotifications(prev => [...prev, {
                      id: Date.now(),
                      message: 'Bulk upload initiated - processing files...',
                      type: 'info',
                      timestamp: new Date()
                    }]);
                    setShowBulkUpload(false);
                  }}
                >
                  Start Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;