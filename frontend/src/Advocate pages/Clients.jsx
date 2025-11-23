import React, { useState, useRef } from 'react';
import { Star, FileText, CreditCard, MessageSquare, Video, Upload, Download, Users, TrendingUp, Award, DollarSign, Phone, Mail, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Eye, Edit, Plus, Search, Filter, X, Send, Paperclip, Bell, Building2, Handshake, User2, Briefcase, MoreHorizontal, TrendingDown, Minus, Trash2, History, ArrowRight, BarChart3, UserCheck, Globe } from 'lucide-react';

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showCommunicationHub, setShowCommunicationHub] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [messageText, setMessageText] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileUploadRef = useRef(null);

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

  // Enhanced client data with comprehensive information
  const [clients] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar Sharma',
      company: 'Sharma Industries Pvt Ltd',
      email: 'rajesh.sharma@sharmaindustries.com',
      phone: '+91 98765 43210',
      address: '123, Industrial Area, Phase-I, Chandigarh - 160002',
      status: 'Active',
      type: 'Corporate',
      rating: 5,
      totalCases: 8,
      activeCases: 3,
      completedCases: 5,
      totalBilled: 1250000,
      outstandingDues: 85000,
      lastContact: '2024-10-08',
      joinDate: '2022-03-15',
      notes: 'Premium corporate client with excellent payment track record and strong compliance protocols',
      avatar: null,
      idProofs: [
        { type: 'Corporate Registration', number: 'CIN: L12345MH2019PTC654321', verified: true },
        { type: 'Tax Registration', number: 'GSTIN: 07ABCDE1234F1ZZ', verified: true },
        { type: 'Professional License', number: 'PL-2024-001234', verified: true }
      ],
      documents: [
        { name: 'Certificate of Incorporation', type: 'PDF', uploadDate: '2024-01-15', size: '2.3 MB' },
        { name: 'Board Resolution Authorization', type: 'PDF', uploadDate: '2024-03-20', size: '1.1 MB' },
        { name: 'Legal Representation Agreement', type: 'PDF', uploadDate: '2024-05-10', size: '0.8 MB' }
      ],
      paymentHistory: [
        { date: '2024-09-15', amount: 150000, method: 'Wire Transfer', status: 'Completed', invoice: 'INV-2024-001' },
        { date: '2024-08-10', amount: 200000, method: 'Corporate Cheque', status: 'Completed', invoice: 'INV-2024-002' },
        { date: '2024-07-05', amount: 75000, method: 'Electronic Transfer', status: 'Completed', invoice: 'INV-2024-003' }
      ],
      communications: [
        { date: '2024-10-08', type: 'Strategic Consultation', subject: 'Litigation Strategy & Risk Assessment', status: 'Completed' },
        { date: '2024-10-05', type: 'Executive Call', subject: 'Case Progress & Timeline Review', duration: '45 min', status: 'Completed' },
        { date: '2024-10-02', type: 'Legal Advisory', subject: 'Compliance Documentation Requirements', status: 'Delivered' }
      ],
      cases: [
        { id: 'CIV/2024/001', title: 'Commercial Contract Dispute - Supply Chain Agreement', status: 'Active', court: 'High Court of Commerce' },
        { id: 'CIV/2024/015', title: 'Corporate Asset Acquisition Matter', status: 'Active', court: 'National Company Law Tribunal' },
        { id: 'CIV/2023/088', title: 'Employment & Labor Relations Dispute', status: 'Successfully Resolved', court: 'Industrial Relations Court' }
      ],
      insights: {
        successRate: 92,
        avgCaseDuration: 6.8,
        totalRevenue: 1250000,
        referralsProvided: 5,
        clientSatisfactionIndex: 4.9
      }
    },
    {
      id: 2,
      name: 'Dr. Priya Malhotra',
      company: 'Independent Professional',
      email: 'dr.priya.malhotra@healthcare.com',
      phone: '+91 87654 32109',
      address: '456, Green Park Extension, New Delhi - 110016',
      status: 'Active',
      type: 'Individual',
      rating: 4,
      totalCases: 3,
      activeCases: 1,
      completedCases: 2,
      totalBilled: 450000,
      outstandingDues: 25000,
      lastContact: '2024-10-07',
      joinDate: '2023-01-10',
      notes: 'Distinguished medical professional requiring specialized legal advisory services with focus on healthcare compliance',
      avatar: null,
      idProofs: [
        { type: 'Professional License', number: 'MCI-REG-2019-001234', verified: true },
        { type: 'Tax Registration', number: 'PAN: XYZNM5678P', verified: true },
        { type: 'Identity Verification', number: 'AADHAAR: 9876-5432-1098', verified: true }
      ],
      documents: [
        { name: 'Professional Qualification Certificate', type: 'PDF', uploadDate: '2024-02-10', size: '1.2 MB' },
        { name: 'Healthcare Practice License', type: 'PDF', uploadDate: '2024-04-15', size: '3.5 MB' }
      ],
      paymentHistory: [
        { date: '2024-09-20', amount: 50000, method: 'UPI', status: 'Completed', invoice: 'INV-2024-045' },
        { date: '2024-07-15', amount: 75000, method: 'Bank Transfer', status: 'Completed', invoice: 'INV-2024-022' }
      ],
      communications: [
        { date: '2024-10-07', type: 'Video Call', subject: 'Case Progress Review', duration: '45 min', status: 'Completed' },
        { date: '2024-10-03', type: 'Message', subject: 'Document Query', status: 'Replied' }
      ],
      cases: [
        { id: 'FAM/2024/012', title: 'Divorce Proceedings', status: 'Active', court: 'Family Court' },
        { id: 'FAM/2023/089', title: 'Child Custody Matter', status: 'Completed', court: 'Family Court' }
      ],
      insights: {
        successRate: 95,
        avgCaseDuration: 6.2,
        totalRevenue: 450000,
        referralsGiven: 1,
        satisfactionScore: 4.9
      }
    },
    {
      id: 3,
      name: 'Amit Agarwal',
      company: 'Agarwal Enterprises',
      email: 'amit@agarwalenterprises.com',
      phone: '+91 76543 21098',
      address: '789, Business District, Gurgaon - 122001',
      status: 'Inactive',
      type: 'Partnership',
      rating: 4,
      totalCases: 12,
      activeCases: 0,
      completedCases: 12,
      totalBilled: 2800000,
      outstandingDues: 0,
      lastContact: '2024-08-15',
      joinDate: '2021-11-20',
      notes: 'Commercial law specialist, completed all matters successfully',
      avatar: null,
      idProofs: [
        { type: 'Aadhaar', number: '5432-1098-7654', verified: true },
        { type: 'PAN', number: 'PQRST9012U', verified: true }
      ],
      documents: [
        { name: 'Partnership Deed', type: 'PDF', uploadDate: '2021-12-01', size: '4.2 MB' },
        { name: 'NOC Certificate', type: 'PDF', uploadDate: '2024-06-10', size: '0.9 MB' }
      ],
      paymentHistory: [
        { date: '2024-08-10', amount: 300000, method: 'Bank Transfer', status: 'Completed', invoice: 'INV-2024-028' },
        { date: '2024-06-15', amount: 250000, method: 'Cheque', status: 'Completed', invoice: 'INV-2024-015' }
      ],
      communications: [
        { date: '2024-08-15', type: 'Meeting', subject: 'Final Case Closure', status: 'Completed' },
        { date: '2024-08-10', type: 'Call', subject: 'Payment Confirmation', duration: '15 min', status: 'Completed' }
      ],
      cases: [
        { id: 'COM/2023/045', title: 'Partnership Dissolution', status: 'Completed', court: 'Commercial Court' },
        { id: 'COM/2022/123', title: 'Contract Breach Case', status: 'Completed', court: 'High Court' }
      ],
      insights: {
        successRate: 92,
        avgCaseDuration: 10.3,
        totalRevenue: 2800000,
        referralsGiven: 5,
        satisfactionScore: 4.7
      }
    }
  ]);

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const metrics = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'Active').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalBilled, 0),
    avgRating: (clients.reduce((sum, c) => sum + c.rating, 0) / clients.length).toFixed(1)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return colors.green;
      case 'Inactive': return colors.red;
      case 'Pending': return colors.amber;
      default: return colors.gray;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Active': return `${colors.green}15`;
      case 'Inactive': return `${colors.red}15`;
      case 'Pending': return `${colors.amber}15`;
      default: return `${colors.gray}15`;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Corporate': return <Building2 className="w-4 h-4" />;
      case 'Partnership': return <Handshake className="w-4 h-4" />;
      case 'Individual': return <User2 className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  // Notification and interaction handlers
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => dismissNotification(notification.id), 5000);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setActiveTab('overview');
  };

  const handleEditClient = (client) => {
    addNotification('Client editing functionality ready', 'info');
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      addNotification('Professional communication delivered successfully', 'success');
      setMessageText('');
    }
  };

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            addNotification('Legal documents processed and uploaded to client repository', 'success');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  return (
    <div 
  className="min-h-screen" 
  style={{ 
    marginLeft: '288px',
    background: colors.cream 
  }}
>


      {/* Header */}
      <header className="border-b p-4 sm:p-6 shadow-sm" style={{ 
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))`,
        borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.20)`
      }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{
              background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
            }}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: colors.navy }}>
                Client Relationship Management
              </h1>
              <p className="mt-1 text-sm" style={{ color: colors.gray }}>
                Enterprise client portfolio and engagement analytics
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                color: colors.golden,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.20)`
              }}
              onClick={() => setShowInsights(true)}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
            <button 
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                color: colors.golden,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.20)`
              }}
              onClick={() => setShowCommunicationHub(true)}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Client Communications Center
            </button>
            <button 
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
              style={{
                background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
              }}
              onClick={() => setShowNewClientModal(true)}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Onboard New Client
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Client Portfolio', value: metrics.totalClients, icon: <Users className="w-5 h-5" />, change: '+12%', color: colors.blue },
            { label: 'Active Engagements', value: metrics.activeClients, icon: <CheckCircle className="w-5 h-5" />, change: '+8%', color: colors.green },
            { label: 'Revenue Generated', value: `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`, icon: <DollarSign className="w-5 h-5" />, change: '+15%', color: colors.golden },
            { label: 'Client Satisfaction', value: metrics.avgRating, icon: <Star className="w-5 h-5" />, change: '+0.2', color: colors.amber }
          ].map((metric, index) => (
            <div key={index} className="p-4 rounded-lg backdrop-blur-sm transition-all hover:scale-105" style={{
              background: `rgba(255, 255, 255, 0.03)`,
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <div className="flex justify-between items-center mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  background: `rgba(${parseInt(metric.color.slice(1, 3), 16)}, ${parseInt(metric.color.slice(3, 5), 16)}, ${parseInt(metric.color.slice(5, 7), 16)}, 0.15)`,
                  color: metric.color
                }}>
                  {metric.icon}
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                  background: `${colors.green}15`,
                  color: colors.green
                }}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: colors.navy }}>{metric.value}</h3>
              <p className="text-sm" style={{ color: colors.gray }}>{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Controls Section */}
        <div className="rounded-lg backdrop-blur-sm p-4 sm:p-6 mb-6" style={{
          background: `rgba(255, 255, 255, 0.03)`,
          border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        }}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold" style={{ color: colors.navy }}>Client Portfolio Management</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4" style={{ color: colors.gray }} />
                </div>
                <input
                  type="text"
                  placeholder="Search client portfolio..."
                  className="pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 w-full text-sm transition-all"
                  style={{
                    background: `rgba(255, 255, 255, 0.03)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                    color: colors.navy
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select 
                className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 text-sm transition-all"
                style={{
                  background: `rgba(255, 255, 255, 0.03)`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                  color: colors.navy
                }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Client Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredClients.map((client) => {
              const statusColor = getStatusColor(client.status);
              const statusBgColor = getStatusBgColor(client.status);
              
              return (
                <div 
                  key={client.id} 
                  className="p-4 rounded-lg backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: `rgba(255, 255, 255, 0.03)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                  }}
                >
                  {/* Client Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-lg" style={{
                        background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                      }}>
                        {getTypeIcon(client.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: colors.navy }}>{client.name}</h3>
                        {client.company && (
                          <p className="text-sm" style={{ color: colors.gray }}>{client.company}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < client.rating ? 'fill-current' : ''}`}
                              style={{ color: i < client.rating ? colors.amber : colors.gray + '40' }}
                            />
                          ))}
                          <span className="text-xs ml-1" style={{ color: colors.gray }}>{client.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: statusBgColor,
                          color: statusColor
                        }}
                      >
                        {client.status}
                      </span>
                      {client.outstandingDues > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                          background: `${colors.amber}15`,
                          color: colors.amber
                        }}>
                          ₹{(client.outstandingDues / 1000).toFixed(0)}K due
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.gray }}>
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.gray }}>
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.gray }}>
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="grid grid-cols-4 gap-2 mb-4 p-3 rounded-lg" style={{
                    background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
                  }}>
                    <div className="text-center">
                      <div className="font-semibold" style={{ color: colors.navy }}>{client.totalCases}</div>
                      <div className="text-xs" style={{ color: colors.gray }}>Total</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold" style={{ color: colors.green }}>{client.activeCases}</div>
                      <div className="text-xs" style={{ color: colors.gray }}>Active</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold" style={{ color: colors.blue }}>{client.completedCases}</div>
                      <div className="text-xs" style={{ color: colors.gray }}>Done</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold" style={{ color: colors.golden }}>
                        ₹{(client.totalBilled / 100000).toFixed(1)}L
                      </div>
                      <div className="text-xs" style={{ color: colors.gray }}>Billed</div>
                    </div>
                  </div>

                  {/* Quick Insights */}
                  <div className="flex items-center justify-between mb-4 text-xs" style={{ color: colors.gray }}>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{client.insights?.successRate || 0}% success rate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Last: {new Date(client.lastContact).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-white"
                      style={{
                        background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                      }}
                      onClick={() => handleViewClient(client)}
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      View Client Profile
                    </button>
                    <button 
                      className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{
                        background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                        color: colors.golden,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.20)`
                      }}
                      onClick={() => handleEditClient(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{
                        background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.10)`,
                        color: colors.blue,
                        border: `1px solid rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.20)`
                      }}
                      onClick={() => {
                        setSelectedClient(client);
                        setShowCommunicationHub(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-3xl rounded-full" style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
              }}>
                <Users className="w-8 h-8" style={{ color: colors.golden }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.navy }}>No clients found</h3>
              <p className="mb-4 text-sm" style={{ color: colors.gray }}>
                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first client'}
              </p>
              <button 
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-white"
                style={{
                  background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                }}
                onClick={() => setShowNewClientModal(true)}
              >
                Add First Client
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Client View Modal */}
      {selectedClient && !showCommunicationHub && !showInsights && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg" style={{
            background: colors.cream,
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b" style={{
              borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl" style={{
                  background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                }}>
                  {getTypeIcon(selectedClient.type)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.navy }}>{selectedClient.name}</h2>
                  {selectedClient.company && (
                    <p className="text-lg" style={{ color: colors.gray }}>{selectedClient.company}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getStatusBgColor(selectedClient.status),
                        color: getStatusColor(selectedClient.status)
                      }}
                    >
                      {selectedClient.status}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < selectedClient.rating ? 'fill-current' : ''}`}
                          style={{ color: i < selectedClient.rating ? colors.amber : colors.gray + '40' }}
                        />
                      ))}
                      <span className="text-sm ml-1" style={{ color: colors.gray }}>{selectedClient.rating}.0</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                  color: colors.golden
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-6 pb-0">
              {[
                { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
                { id: 'cases', label: 'Cases', icon: <FileText className="w-4 h-4" /> },
                { id: 'documents', label: 'Documents', icon: <Upload className="w-4 h-4" /> },
                { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'communication', label: 'Communication', icon: <MessageSquare className="w-4 h-4" /> },
                { id: 'insights', label: 'Insights', icon: <TrendingUp className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`}
                  style={{
                    background: activeTab === tab.id 
                      ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                      : `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                    color: activeTab === tab.id ? 'white' : colors.golden
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5" style={{ color: colors.golden }} />
                          <span style={{ color: colors.gray }}>{selectedClient.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5" style={{ color: colors.golden }} />
                          <span style={{ color: colors.gray }}>{selectedClient.phone}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 mt-0.5" style={{ color: colors.golden }} />
                          <span style={{ color: colors.gray }}>{selectedClient.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* ID Proofs */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>ID Verification</h3>
                      <div className="space-y-3">
                        {selectedClient.idProofs?.map((proof, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{
                            background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
                          }}>
                            <div>
                              <div className="font-medium" style={{ color: colors.navy }}>{proof.type}</div>
                              <div className="text-sm" style={{ color: colors.gray }}>{proof.number}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" style={{ color: proof.verified ? colors.green : colors.gray }} />
                              <span className="text-xs" style={{ color: proof.verified ? colors.green : colors.gray }}>
                                {proof.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Cases', value: selectedClient.totalCases, color: colors.blue },
                      { label: 'Active Cases', value: selectedClient.activeCases, color: colors.green },
                      { label: 'Success Rate', value: `${selectedClient.insights?.successRate || 0}%`, color: colors.golden },
                      { label: 'Outstanding', value: `₹${(selectedClient.outstandingDues / 1000).toFixed(0)}K`, color: selectedClient.outstandingDues > 0 ? colors.amber : colors.green }
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-4 rounded-lg" style={{
                        background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.10)`
                      }}>
                        <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-sm" style={{ color: colors.gray }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: colors.navy }}>Notes</h3>
                    <div className="p-4 rounded-lg" style={{
                      background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                    }}>
                      <p style={{ color: colors.gray }}>{selectedClient.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cases' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Associated Cases</h3>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
                      style={{
                        background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                      }}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      New Ca
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedClient.cases?.map((caseItem, index) => (
                      <div key={index} className="flex justify-between items-center p-4 rounded-lg" style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}>
                        <div>
                          <h4 className="font-medium" style={{ color: colors.navy }}>{caseItem.id}</h4>
                          <p className="text-sm" style={{ color: colors.gray }}>{caseItem.title}</p>
                          <p className="text-xs" style={{ color: colors.gray }}>{caseItem.court}</p>
                        </div>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: getStatusBgColor(caseItem.status),
                            color: getStatusColor(caseItem.status)
                          }}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Document Repository</h3>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
                      style={{
                        background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                      }}
                      onClick={() => fileUploadRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      Upload Document
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedClient.documents?.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center p-4 rounded-lg" style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}>
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8" style={{ color: colors.golden }} />
                          <div>
                            <h4 className="font-medium" style={{ color: colors.navy }}>{doc.name}</h4>
                            <p className="text-sm" style={{ color: colors.gray }}>{doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg transition-colors" style={{
                          background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.10)`,
                          color: colors.blue
                        }}>
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Payment History</h3>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: colors.gray }}>Outstanding Amount</div>
                      <div className="text-xl font-bold" style={{ 
                        color: selectedClient.outstandingDues > 0 ? colors.amber : colors.green 
                      }}>
                        ₹{selectedClient.outstandingDues.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {selectedClient.paymentHistory?.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center p-4 rounded-lg" style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}>
                        <div>
                          <h4 className="font-medium" style={{ color: colors.navy }}>₹{payment.amount.toLocaleString()}</h4>
                          <p className="text-sm" style={{ color: colors.gray }}>{payment.method} • {payment.invoice}</p>
                          <p className="text-xs" style={{ color: colors.gray }}>{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${colors.green}15`,
                            color: colors.green
                          }}
                        >
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'communication' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Communication History</h3>
                  <div className="space-y-3">
                    {selectedClient.communications?.map((comm, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg" style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                          background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.15)`
                        }}>
                          {comm.type === 'Meeting' && <Users className="w-5 h-5" style={{ color: colors.blue }} />}
                          {comm.type === 'Call' && <Phone className="w-5 h-5" style={{ color: colors.blue }} />}
                          {comm.type === 'Email' && <Mail className="w-5 h-5" style={{ color: colors.blue }} />}
                          {comm.type === 'Message' && <MessageSquare className="w-5 h-5" style={{ color: colors.blue }} />}
                          {comm.type === 'Video Call' && <Video className="w-5 h-5" style={{ color: colors.blue }} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium" style={{ color: colors.navy }}>{comm.subject}</h4>
                          <p className="text-sm" style={{ color: colors.gray }}>
                            {comm.type} • {new Date(comm.date).toLocaleDateString()}
                            {comm.duration && ` • ${comm.duration}`}
                          </p>
                        </div>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${colors.green}15`,
                            color: colors.green
                          }}
                        >
                          {comm.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Business Intelligence & Performance Analytics</h3>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-6 rounded-lg" style={{
                      background: `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.10)`
                    }}>
                      <Award className="w-8 h-8 mx-auto mb-3" style={{ color: colors.green }} />
                      <div className="text-3xl font-bold mb-1" style={{ color: colors.green }}>
                        {selectedClient.insights?.successRate || 0}%
                      </div>
                      <div className="text-sm" style={{ color: colors.gray }}>Success Rate</div>
                    </div>
                    
                    <div className="text-center p-6 rounded-lg" style={{
                      background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                    }}>
                      <DollarSign className="w-8 h-8 mx-auto mb-3" style={{ color: colors.golden }} />
                      <div className="text-3xl font-bold mb-1" style={{ color: colors.golden }}>
                        ₹{((selectedClient.insights?.totalRevenue || 0) / 100000).toFixed(1)}L
                      </div>
                      <div className="text-sm" style={{ color: colors.gray }}>Total Revenue</div>
                    </div>
                    
                    <div className="text-center p-6 rounded-lg" style={{
                      background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.10)`
                    }}>
                      <Users className="w-8 h-8 mx-auto mb-3" style={{ color: colors.blue }} />
                      <div className="text-3xl font-bold mb-1" style={{ color: colors.blue }}>
                        {selectedClient.insights?.referralsGiven || 0}
                      </div>
                      <div className="text-sm" style={{ color: colors.gray }}>Referrals Given</div>
                    </div>
                  </div>

                  {/* Additional Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                    }}>
                      <h4 className="font-medium mb-2" style={{ color: colors.navy }}>Average Case Duration</h4>
                      <div className="text-2xl font-bold" style={{ color: colors.golden }}>
                        {selectedClient.insights?.avgCaseDuration || 0} months
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg" style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                    }}>
                      <h4 className="font-medium mb-2" style={{ color: colors.navy }}>Satisfaction Score</h4>
                      <div className="text-2xl font-bold" style={{ color: colors.amber }}>
                        {selectedClient.insights?.satisfactionScore || 0}/5.0
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Client Communications Center Modal */}
      {showCommunicationHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg" style={{
            background: colors.cream,
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center p-6 border-b" style={{
              borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <h2 className="text-xl font-bold" style={{ color: colors.navy }}>Client Communications Center</h2>
              <button
                onClick={() => setShowCommunicationHub(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                  color: colors.golden
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors" style={{
                  background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.10)`,
                  color: colors.blue
                }}>
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-sm font-medium">Secure Message</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors" style={{
                  background: `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.10)`,
                  color: colors.green
                }}>
                  <Video className="w-6 h-6" />
                  <span className="text-sm font-medium">Video Update</span>
                </button>
                
                <button 
                  className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors" 
                  style={{
                    background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                    color: colors.golden
                  }}
                  onClick={() => fileUploadRef.current?.click()}
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm font-medium">Share Document</span>
                </button>
                
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors" style={{
                  background: `rgba(${parseInt(colors.amber.slice(1, 3), 16)}, ${parseInt(colors.amber.slice(3, 5), 16)}, ${parseInt(colors.amber.slice(5, 7), 16)}, 0.10)`,
                  color: colors.amber
                }}>
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Request Payment</span>
                </button>
              </div>

              {/* Message Composer */}
              <div className="space-y-3">
                <h3 className="font-medium" style={{ color: colors.navy }}>Client Communication</h3>
                <div className="space-y-3">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Compose professional communication..."
                    className="w-full p-3 rounded-lg resize-none focus:outline-none transition-all"
                    style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                      color: colors.navy,
                      minHeight: '100px'
                    }}
                  />
                  <div className="flex justify-between items-center">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors" style={{
                      background: `rgba(${parseInt(colors.gray.slice(1, 3), 16)}, ${parseInt(colors.gray.slice(3, 5), 16)}, ${parseInt(colors.gray.slice(5, 7), 16)}, 0.10)`,
                      color: colors.gray
                    }}>
                      <Paperclip className="w-4 h-4" />
                      Attach
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
                      style={{
                        background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                      }}
                    >
                      <Send className="w-4 h-4" />
                      Send Communication
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Input */}
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
    </div>
  );
};

export default ClientsPage;