import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, openModal, theme, language, isOnline } = context || {};

  // State management
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [auditLog, setAuditLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [permissions, setPermissions] = useState({
    canEdit: true,
    canDelete: false,
    canUpload: true,
    canNotify: true
  });

  // Mock case data
  const mockCaseData = {
    id: parseInt(id),
    number: '2023/CRL/001',
    title: 'State vs John Doe',
    status: 'Active',
    priority: 'High',
    court: 'District Court I',
    caseType: 'Criminal',
    filingDate: '2023-01-15',
    nextHearing: '2023-12-25',
    hearingTime: '10:00 AM',
    judge: 'Hon. Justice Smith',
    parties: [
      { id: 1, name: 'State', type: 'Petitioner', advocate: 'Public Prosecutor', contact: '+91-9876543210' },
      { id: 2, name: 'John Doe', type: 'Respondent', advocate: 'Adv. Kumar', contact: '+91-9876543211' }
    ],
    description: 'Criminal case involving theft charges against the accused John Doe.',
    caseHistory: [
      { date: '2023-01-15', event: 'Case filed', details: 'FIR filed at Station House', by: 'Police' },
      { date: '2023-01-20', event: 'First hearing', details: 'Case admitted for hearing', by: 'Court' },
      { date: '2023-02-15', event: 'Evidence submitted', details: 'CCTV footage submitted', by: 'Prosecution' },
      { date: '2023-03-10', event: 'Witness statement', details: 'Key witness testimony recorded', by: 'Court' }
    ],
    acts: ['IPC Section 378', 'IPC Section 380'],
    attachments: [
      { id: 1, name: 'FIR Copy.pdf', type: 'application/pdf', size: '2.5 MB', uploadedBy: 'Police', uploadedAt: '2023-01-15' },
      { id: 2, name: 'CCTV Evidence.mp4', type: 'video/mp4', size: '45.2 MB', uploadedBy: 'Prosecution', uploadedAt: '2023-02-15' }
    ]
  };

  // Track if data has been loaded to prevent duplicate notifications
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load case data
  useEffect(() => {
    const loadCaseData = async () => {
      // Prevent multiple loads
      if (dataLoaded || loading) return;
      
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setCaseData(mockCaseData);
          setFormData(mockCaseData);
          setDocuments(mockCaseData.attachments);
          setLoading(false);
          setDataLoaded(true);
          
          // Simulate websocket connection
          setWebsocketConnected(isOnline);
          
          // Only show notification on initial load
          if (!dataLoaded) {
            addNotification?.({
              type: 'success',
              message: `Case ${mockCaseData.number} loaded successfully`
            });
          }
        }, 1000);
      } catch (error) {
        console.error('Error loading case data:', error);
        setLoading(false);
        addNotification?.({
          type: 'error',
          message: 'Failed to load case data'
        });
      }
    };

    if (id && !dataLoaded) {
      loadCaseData();
    }
  }, [id, isOnline, addNotification, dataLoaded, loading]);

  // Real-time updates via WebSocket simulation
  useEffect(() => {
    if (!websocketConnected || !dataLoaded) return;

    const interval = setInterval(() => {
      // Simulate real-time case updates
      const updateTypes = ['document_added', 'status_changed', 'hearing_scheduled', 'note_added'];
      const randomUpdate = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      if (Math.random() > 0.95) { // 5% chance every interval
        const newLogEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: randomUpdate,
          user: 'System',
          details: `Real-time update: ${randomUpdate}`,
          ip: '192.168.1.1'
        };
        
        setAuditLog(prev => [newLogEntry, ...prev].slice(0, 50));
        
        addNotification?.({
          type: 'info',
          message: `Case updated: ${randomUpdate.replace('_', ' ')}`
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [websocketConnected, addNotification, dataLoaded]);

  // Handle form submission
  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate form data
      if (!formData.title?.trim()) {
        throw new Error('Case title is required');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCaseData({ ...caseData, ...formData });
      setEditMode(false);
      
      // Add to audit log
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action: 'case_updated',
        user: user?.name || 'Unknown User',
        details: `Case details updated`,
        ip: '192.168.1.100'
      };
      setAuditLog(prev => [logEntry, ...prev]);
      
      addNotification?.({
        type: 'success',
        message: 'Case updated successfully'
      });
    } catch (error) {
      console.error('Error saving case:', error);
      addNotification?.({
        type: 'error',
        message: error.message || 'Failed to save case'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (files) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const fileId = Date.now() + Math.random();
      
      // Start upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      try {
        // Simulate file upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
        
        // Add document to list
        const newDoc = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          uploadedBy: user?.name || 'Current User',
          uploadedAt: new Date().toISOString().split('T')[0]
        };
        
        setDocuments(prev => [...prev, newDoc]);
        
        // Remove from progress tracking
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        
        // Add to audit log
        const logEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: 'document_uploaded',
          user: user?.name || 'Unknown User',
          details: `Document "${file.name}" uploaded`,
          ip: '192.168.1.100'
        };
        setAuditLog(prev => [logEntry, ...prev]);
        
        addNotification?.({
          type: 'success',
          message: `Document "${file.name}" uploaded successfully`
        });
      } catch (error) {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        
        addNotification?.({
          type: 'error',
          message: `Failed to upload "${file.name}"`
        });
      }
    }
  }, [user, addNotification]);

  // Handle file drop
  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && permissions.canUpload) {
      handleFileUpload(files);
    }
  }, [handleFileUpload, permissions.canUpload]);

  // Prevent default drag behavior
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Send notification to parties
  const sendNotification = async (type, message) => {
    if (!permissions.canNotify) {
      addNotification?.({
        type: 'error',
        message: 'You do not have permission to send notifications'
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const notification = {
        id: Date.now(),
        type,
        message,
        sentAt: new Date().toISOString(),
        sentBy: user?.name || 'Unknown User',
        recipients: caseData.parties.map(p => p.name)
      };
      
      setNotifications(prev => [notification, ...prev]);
      
      // Add to audit log
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action: 'notification_sent',
        user: user?.name || 'Unknown User',
        details: `${type} notification sent: ${message}`,
        ip: '192.168.1.100'
      };
      setAuditLog(prev => [logEntry, ...prev]);
      
      addNotification?.({
        type: 'success',
        message: `${type} notification sent to all parties`
      });
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: 'Failed to send notification'
      });
    }
  };

  // Reset data when component unmounts or id changes
  useEffect(() => {
    return () => {
      setDataLoaded(false);
      setCaseData(null);
      setLoading(true);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b69d74]"></div>
        <span className="ml-3 text-[#6b7280] font-medium">
          {language === 'ta' ? 'मामले की जानकारी लोड हो रही है...' : 'Loading case details...'}
        </span>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#b69d7410] rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1f2839] mb-3">
          {language === 'ta' ? 'मामला नहीं मिला' : 'Case not found'}
        </h3>
        <p className="text-[#6b7280] mb-6 max-w-md mx-auto">
          {language === 'ta' ? 'यह मामला मौजूद नहीं है या आपको इसे देखने का अधिकार नहीं है।' : 'This case does not exist or you do not have permission to view it.'}
        </p>
        <Link
          to="/clerk/cases"
          className="inline-flex items-center px-6 py-3 bg-[#b69d74] text-white font-medium rounded-lg hover:bg-[#b69d74dd] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {language === 'ta' ? 'मामलों की सूची पर वापस जाएं' : 'Back to cases'}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5ef]" onDrop={handleFileDrop} onDragOver={handleDragOver}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#b69d7420] p-8 mb-8 transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <Link
                  to="/clerk/cases"
                  className="group flex items-center text-[#6b7280] hover:text-[#b69d74] transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {language === 'ta' ? 'वापस' : 'Back'}
                </Link>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-[#1f2839] bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
                    {caseData.number}
                  </h1>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                    caseData.status === 'Active' ? 'bg-[#10b98120] text-[#10b981] border border-[#10b98140]' :
                    caseData.status === 'Pending' ? 'bg-[#f59e0b20] text-[#f59e0b] border border-[#f59e0b40]' :
                    'bg-[#6b728020] text-[#6b7280] border border-[#6b728040]'
                  }`}>
                    {caseData.status}
                  </span>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                    caseData.priority === 'Critical' ? 'bg-[#ef444420] text-[#ef4444] border border-[#ef444440]' :
                    caseData.priority === 'High' ? 'bg-[#f59e0b20] text-[#f59e0b] border border-[#f59e0b40]' :
                    caseData.priority === 'Medium' ? 'bg-[#b69d7420] text-[#b69d74] border border-[#b69d7440]' :
                    'bg-[#10b98120] text-[#10b981] border border-[#10b98140]'
                  }`}>
                    {caseData.priority}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                {editMode ? (
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 text-lg border-2 border-[#b69d7440] rounded-xl bg-white text-[#1f2839] focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                    placeholder="Enter case title..."
                  />
                ) : (
                  <p className="text-xl text-[#1f2839] font-medium leading-relaxed">
                    {caseData.title}
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{caseData.court}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{caseData.judge}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Filed: {new Date(caseData.filingDate).toLocaleDateString()}</span>
                </div>
                {websocketConnected && (
                  <div className="flex items-center space-x-2 text-[#10b981]">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Updates</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6 lg:mt-0">
              {editMode ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setEditMode(false)}
                    disabled={saving}
                    className="px-6 py-3 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-[#b69d7405] hover:border-[#b69d7460] disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {language === 'ta' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74dd] border border-transparent rounded-xl hover:from-[#b69d74dd] hover:to-[#b69d74bb] disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center"
                  >
                    {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                    {language === 'ta' ? 'सेव करें' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {permissions.canEdit && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-3 text-sm font-semibold text-[#1f2839] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-[#b69d7408] hover:border-[#b69d7460] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {language === 'ta' ? 'संपादित करें' : 'Edit'}
                    </button>
                  )}

                  <button
                    onClick={() => sendNotification('SMS', 'Case update notification')}
                    disabled={!permissions.canNotify}
                    className="px-6 py-3 text-sm font-semibold text-[#10b981] bg-[#10b98110] border-2 border-[#10b98140] rounded-xl hover:bg-[#10b98115] disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {language === 'ta' ? 'सूचना भेजें' : 'Notify'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#b69d7420] overflow-hidden mb-8">
          <div className="border-b border-[#b69d7410]">
            <nav className="flex -mb-px">
              {[
                { key: 'overview', label: language === 'ta' ? 'अवलोकन' : 'Overview', icon: '📋' },
                { key: 'documents', label: language === 'ta' ? 'दस्तावेज़' : 'Documents', icon: '📄' },
                { key: 'history', label: language === 'ta' ? 'इतिहास' : 'History', icon: '🕒' },
                { key: 'parties', label: language === 'ta' ? 'पार्टियां' : 'Parties', icon: '👥' },
                { key: 'hearings', label: language === 'ta' ? 'सुनवाई' : 'Hearings', icon: '⚖️' },
                { key: 'audit', label: language === 'ta' ? 'ऑडिट लॉग' : 'Audit Log', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-5 px-4 text-sm font-semibold border-b-2 transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'border-[#b69d74] text-[#b69d74] bg-[#b69d7405]'
                      : 'border-transparent text-[#6b7280] hover:text-[#b69d74] hover:bg-[#b69d7403]'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Case Information */}
                  <div className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border border-[#b69d7410]">
                    <h3 className="text-xl font-semibold text-[#1f2839] mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {language === 'ta' ? 'मामले की जानकारी' : 'Case Information'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: language === 'ta' ? 'मामला संख्या' : 'Case Number', value: caseData.number },
                        { label: language === 'ta' ? 'मामले का प्रकार' : 'Case Type', value: caseData.caseType },
                        { label: language === 'ta' ? 'न्यायालय' : 'Court', value: caseData.court },
                        { label: language === 'ta' ? 'न्यायाधीश' : 'Judge', value: caseData.judge }
                      ].map((field, index) => (
                        <div key={index} className="space-y-2">
                          <label className="block text-sm font-medium text-[#6b7280]">
                            {field.label}
                          </label>
                          <p className="text-[#1f2839] font-medium bg-[#b69d7405] p-3 rounded-xl border border-[#b69d7410]">
                            {field.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Description */}
                  <div className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border border-[#b69d7410]">
                    <h3 className="text-xl font-semibold text-[#1f2839] mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      {language === 'ta' ? 'विवरण' : 'Description'}
                    </h3>
                    {editMode ? (
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl bg-white text-[#1f2839] focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300 resize-none"
                        placeholder="Enter case description..."
                      />
                    ) : (
                      <p className="text-[#1f2839] leading-relaxed bg-[#b69d7405] p-4 rounded-xl border border-[#b69d7410]">
                        {caseData.description}
                      </p>
                    )}
                  </div>

                  {/* Acts & Sections */}
                  <div className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border border-[#b69d7410]">
                    <h3 className="text-xl font-semibold text-[#1f2839] mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {language === 'ta' ? 'अधिनियम और धाराएं' : 'Acts & Sections'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {caseData.acts.map((act, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#b69d7410] to-[#b69d7408] text-[#b69d74] border border-[#b69d7440] rounded-xl transition-all duration-300 hover:from-[#b69d7415] hover:to-[#b69d7410] hover:border-[#b69d7460]"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Next Hearing */}
                  {caseData.nextHearing && (
                    <div className="bg-gradient-to-br from-[#b69d7410] to-[#b69d7405] rounded-2xl p-6 border border-[#b69d7440]">
                      <h4 className="font-semibold text-[#1f2839] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {language === 'ta' ? 'अगली सुनवाई' : 'Next Hearing'}
                      </h4>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#1f2839] mb-1">
                          {new Date(caseData.nextHearing).toLocaleDateString()}
                        </p>
                        <p className="text-lg text-[#b69d74] font-semibold">{caseData.hearingTime}</p>
                        <div className="mt-4 p-3 bg-white rounded-xl border border-[#b69d7420]">
                          <p className="text-sm text-[#6b7280]">
                            {language === 'ta' ? 'न्यायालय में उपस्थित रहें' : 'Be present at the court'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border border-[#b69d7410]">
                    <h4 className="font-semibold text-[#1f2839] mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {language === 'ta' ? 'त्वरित आंकड़े' : 'Quick Stats'}
                    </h4>
                    <div className="space-y-4">
                      {[
                        { label: language === 'ta' ? 'दस्तावेज़' : 'Documents', value: documents.length, color: '#b69d74' },
                        { label: language === 'ta' ? 'पार्टियां' : 'Parties', value: caseData.parties.length, color: '#10b981' },
                        { label: language === 'ta' ? 'सुनवाई' : 'Hearings', value: caseData.caseHistory.length, color: '#3b82f6' }
                      ].map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#b69d7405] rounded-xl border border-[#b69d7410]">
                          <span className="text-[#6b7280] text-sm font-medium">{stat.label}</span>
                          <span className="text-lg font-bold" style={{ color: stat.color }}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* File Upload */}
                  {permissions.canUpload && (
                    <div className="border-3 border-dashed border-[#b69d7440] rounded-2xl p-8 text-center transition-all duration-300 hover:border-[#b69d7460] hover:bg-[#b69d7405] group">
                      <svg className="mx-auto h-12 w-12 text-[#b69d74] mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="block text-lg font-semibold text-[#1f2839] mb-2">
                            {language === 'ta' ? 'फ़ाइलें अपलोड करें' : 'Upload Files'}
                          </span>
                          <span className="block text-sm text-[#6b7280] mb-4">
                            {language === 'ta' ? 'फ़ाइलें यहाँ खींचें या क्लिक करें' : 'Drop files here or click to upload'}
                          </span>
                          <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#b69d74] to-[#b69d74dd] text-white font-semibold rounded-xl hover:from-[#b69d74dd] hover:to-[#b69d74bb] transition-all duration-300 transform group-hover:-translate-y-0.5">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {language === 'ta' ? 'फ़ाइलें चुनें' : 'Choose Files'}
                          </span>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-[#1f2839] flex items-center">
                    <svg className="w-6 h-6 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {language === 'ta' ? 'दस्तावेज़' : 'Documents'} 
                    <span className="ml-2 px-3 py-1 text-sm bg-[#b69d7410] text-[#b69d74] rounded-full font-medium">
                      {documents.length}
                    </span>
                  </h3>
                  {permissions.canUpload && (
                    <label htmlFor="doc-upload" className="cursor-pointer px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74dd] border border-transparent rounded-xl hover:from-[#b69d74dd] hover:to-[#b69d74bb] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {language === 'ta' ? 'अपलोड करें' : 'Upload'}
                      <input
                        id="doc-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      />
                    </label>
                  )}
                </div>

                {/* Upload Progress */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-[#1f2839]">
                      {language === 'ta' ? 'अपलोड प्रगति' : 'Upload Progress'}
                    </h4>
                    {Object.entries(uploadProgress).map(([fileId, progress]) => (
                      <div key={fileId} className="bg-white p-4 rounded-xl border border-[#b69d7420]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-[#6b7280]">
                            {language === 'ta' ? 'अपलोड हो रहा है...' : 'Uploading...'}
                          </span>
                          <span className="text-sm font-bold text-[#b69d74]">{progress}%</span>
                        </div>
                        <div className="w-full bg-[#b69d7410] rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#b69d74] to-[#b69d74cc] h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-gradient-to-br from-white to-[#b69d7403] p-5 rounded-xl border border-[#b69d7420] hover:border-[#b69d7440] transition-all duration-300 group hover:shadow-md">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#b69d7410] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#1f2839] truncate max-w-[120px]">{doc.name}</h4>
                            <p className="text-xs text-[#6b7280]">{doc.size}</p>
                          </div>
                        </div>
                        <button className="text-[#6b7280] hover:text-[#b69d74] transition-colors duration-300 opacity-0 group-hover:opacity-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-xs text-[#6b7280] space-y-1">
                        <p><strong>{language === 'ta' ? 'अपलोडकर्ता:' : 'Uploaded by:'}</strong> {doc.uploadedBy}</p>
                        <p><strong>{language === 'ta' ? 'तारीख:' : 'Date:'}</strong> {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-3 mt-4">
                        <button className="text-xs font-medium text-[#b69d74] hover:text-[#b69d74dd] transition-colors duration-300">
                          {language === 'ta' ? 'डाउनलोड' : 'Download'}
                        </button>
                        <button className="text-xs font-medium text-[#3b82f6] hover:text-[#3b82f6dd] transition-colors duration-300">
                          {language === 'ta' ? 'देखें' : 'View'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {documents.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#b69d7410] rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-[#6b7280] text-lg">
                      {language === 'ta' ? 'कोई दस्तावेज़ अपलोड नहीं किए गए हैं' : 'No documents uploaded yet'}
                    </p>
                    <p className="text-[#6b7280] text-sm mt-2">
                      {language === 'ta' ? 'दस्तावेज़ अपलोड करने के लिए ऊपर दिए गए बटन पर क्लिक करें' : 'Click the upload button above to add documents'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#1f2839] flex items-center">
                  <svg className="w-6 h-6 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {language === 'ta' ? 'मामले का इतिहास' : 'Case History'}
                </h3>
                <div className="space-y-4">
                  {caseData.caseHistory.map((event, index) => (
                    <div key={index} className="bg-gradient-to-br from-white to-[#b69d7403] p-5 rounded-xl border-l-4 border-[#b69d74] border border-[#b69d7410] hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-[#1f2839] text-lg">{event.event}</h4>
                        <span className="text-sm font-medium text-[#b69d74] bg-[#b69d7410] px-3 py-1 rounded-full">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#6b7280] mb-2 leading-relaxed">{event.details}</p>
                      <p className="text-xs text-[#b69d74] font-medium">
                        {language === 'ta' ? 'द्वारा:' : 'By:'} {event.by}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parties Tab */}
            {activeTab === 'parties' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#1f2839] flex items-center">
                  <svg className="w-6 h-6 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {language === 'ta' ? 'पार्टियां' : 'Parties'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseData.parties.map((party) => (
                    <div key={party.id} className="bg-gradient-to-br from-white to-[#b69d7403] p-6 rounded-xl border border-[#b69d7410] hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-[#1f2839]">{party.name}</h4>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          party.type === 'Petitioner' 
                            ? 'bg-[#10b98120] text-[#10b981] border border-[#10b98140]'
                            : 'bg-[#b69d7420] text-[#b69d74] border border-[#b69d7440]'
                        }`}>
                          {party.type}
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[#6b7280]"><strong>{language === 'ta' ? 'वकील:' : 'Advocate:'}</strong> {party.advocate}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-[#6b7280]"><strong>{language === 'ta' ? 'संपर्क:' : 'Contact:'}</strong> {party.contact}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-[#b69d7410]">
                        <button className="flex-1 text-center py-2 text-xs font-semibold text-[#10b981] bg-[#10b98110] border border-[#10b98140] rounded-lg hover:bg-[#10b98115] transition-colors duration-300">
                          {language === 'ta' ? 'कॉल करें' : 'Call'}
                        </button>
                        <button className="flex-1 text-center py-2 text-xs font-semibold text-[#b69d74] bg-[#b69d7410] border border-[#b69d7440] rounded-lg hover:bg-[#b69d7415] transition-colors duration-300">
                          {language === 'ta' ? 'SMS' : 'SMS'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Log Tab */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#1f2839] flex items-center">
                  <svg className="w-6 h-6 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {language === 'ta' ? 'ऑडिट लॉग' : 'Audit Log'}
                </h3>
                <div className="space-y-3">
                  {auditLog.length > 0 ? auditLog.map((entry) => (
                    <div key={entry.id} className="bg-gradient-to-br from-white to-[#b69d7403] p-4 rounded-xl border border-[#b69d7410] hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[#1f2839] bg-[#b69d7410] px-3 py-1 rounded-full">
                          {entry.action.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-[#6b7280]">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#6b7280] text-sm mb-2">{entry.details}</p>
                      <div className="flex items-center justify-between text-xs text-[#b69d74]">
                        <span><strong>{language === 'ta' ? 'उपयोगकर्ता:' : 'User:'}</strong> {entry.user}</span>
                        <span><strong>IP:</strong> {entry.ip}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#b69d7410] rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-[#6b7280] text-lg">
                        {language === 'ta' ? 'कोई ऑडिट लॉग उपलब्ध नहीं है' : 'No audit logs available'}
                      </p>
                      <p className="text-[#6b7280] text-sm mt-2">
                        {language === 'ta' ? 'सिस्टम गतिविधियाँ यहाँ दिखाई देंगी' : 'System activities will appear here'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;