import React, { useState, useEffect } from "react";
import axios from 'axios';
import { 
  FiArrowLeft, 
  FiFileText, 
  FiCalendar, 
  FiFolder, 
  FiUsers, 
  FiDollarSign, 
  FiMessageSquare,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiDownload,
  FiEdit,
  FiPlus,
  FiUpload,
  FiX
} from "react-icons/fi";

const colors = {
  cream: "#f5f5ef",
  navy: "#1f2839",
  golden: "#b69d74",
  gray: "#6b7280",
  green: "#10b981",
  amber: "#f59e0b",
  blue: "#3b82f6",
  red: "#ef4444"
};

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api` || 'https://server.chakshi.com/api';
function formatDate(dateString) {
  if (!dateString || dateString === "NA" || dateString === "TBD" || dateString === "N/A") return dateString;
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: "2-digit", 
    month: "short", 
    year: "numeric"
  });
}

const CaseDetailView = ({ selectedCase, onClose }) => {
  // States
  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState(null);
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  
  // Form states
  const [newTimeline, setNewTimeline] = useState({ stage: '', date: '' });
  const [newPayment, setNewPayment] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  });
  const [newNote, setNewNote] = useState('');
  const [newDocument, setNewDocument] = useState({
    name: '',
    category: '',
    client: selectedCase?.clientName || '',
    file: null,
    fileName: ''
  });

  if (!selectedCase) return null;

  // Fetch Case Overview on mount
 useEffect(() => {
    if (selectedCase?._id) {
      console.log('\n🚀 ═══════════════════════════════════════');
      console.log('🚀 Loading case details for:', selectedCase._id);
      console.log('🚀 Case Number:', selectedCase.caseNumber);
      console.log('🚀 ═══════════════════════════════════════\n');
      
      // Fetch all data
      fetchCaseOverview();
      fetchTimeline();
      fetchPayments();
      fetchNotes();
      fetchDocuments();
    }
  }, [selectedCase]);

  // API Calls
 const fetchCaseOverview = async () => {
  setLoading(true);
  try {
    console.log('🔍 Fetching case overview for:', selectedCase._id);
    const response = await axios.get(`${API_BASE_URL}/cases/${selectedCase._id}`);
    
    if (response.data.success) {
      console.log('✅ Case data received');
      setCaseData(response.data.data);
      // ⭐ REMOVED: Don't overwrite timeline/payments/notes here!
    }
  } catch (error) {
    console.error('❌ Error fetching case overview:', error);
  } finally {
    setLoading(false);
  }
};    

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/case/${selectedCase.caseNumber}`);
      if (response.data.success) {
        setDocuments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
 const fetchTimeline = async () => {
    try {
      console.log('📅 Fetching timeline for case:', selectedCase._id);
      const response = await axios.get(`${API_BASE_URL}/casedetails/${selectedCase._id}/timeline`);
      
      if (response.data.success) {
        console.log('✅ Timeline entries received:', response.data.count);
        setTimelineEntries(response.data.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching timeline:', error);
      setTimelineEntries([]);
    }
  };

  const fetchPayments = async () => {
    try {
      console.log('💰 Fetching payments for case:', selectedCase._id);
      const response = await axios.get(`${API_BASE_URL}/casedetails/${selectedCase._id}/payments`);
      
      if (response.data.success) {
        console.log('✅ Payments received:', response.data.count);
        console.log('Payment data:', response.data.data);
        setPayments(response.data.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
      setPayments([]);
    }
  };

   const fetchNotes = async () => {
    try {
      console.log('📝 Fetching notes for case:', selectedCase._id);
      const response = await axios.get(`${API_BASE_URL}/casedetails/${selectedCase._id}/notes`);
      
      if (response.data.success) {
        console.log('✅ Notes received:', response.data.count);
        setNotes(response.data.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching notes:', error);
      setNotes([]);
    }
  };
  
  // Timeline Handlers
 const handleAddTimeline = async () => {
  if (!newTimeline.stage || !newTimeline.date) {
    alert('Please fill all required fields');
    return;
  }

  try {
    console.log('📅 Adding timeline entry:', newTimeline);
    
    const response = await axios.post(
      `${API_BASE_URL}/casedetails/${selectedCase._id}/timeline`,
      {
        stage: newTimeline.stage,
        date: newTimeline.date,
        status: 'ongoing'
      }
    );

    if (response.data.success) {
      console.log('✅ Timeline entry added');
      await fetchTimeline(); // ⭐ FIXED: Call specific fetch
      setShowTimelineModal(false);
      setNewTimeline({ stage: '', date: '' });
      alert('✅ Timeline entry added successfully!');
    }
  } catch (error) {
    console.error('❌ Error adding timeline:', error);
    alert(error.response?.data?.message || 'Failed to add timeline entry');
  }
};


  // Payment Handlers
 const handleAddPayment = async () => {
  if (!newPayment.description || !newPayment.amount || !newPayment.date) {
    alert('Please fill all required fields');
    return;
  }

  try {
    console.log('💰 Adding payment:', newPayment);
    
    const response = await axios.post(
      `${API_BASE_URL}/casedetails/${selectedCase._id}/payments`,
      {
        description: newPayment.description,
        amount: parseFloat(newPayment.amount),
        date: newPayment.date,
        status: newPayment.status
      }
    );

    if (response.data.success) {
      console.log('✅ Payment added successfully');
      await fetchPayments(); // ⭐ FIXED: Call specific fetch
      setShowPaymentModal(false);
      setNewPayment({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
      alert('✅ Payment added successfully!');
    }
  } catch (error) {
    console.error('❌ Error adding payment:', error);
    alert(error.response?.data?.message || 'Failed to add payment');
  }
};

  const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
  try {
    console.log('💰 Updating payment status:', paymentId, 'to', newStatus);
    
    const response = await axios.put(
      `${API_BASE_URL}/casedetails/${selectedCase._id}/payments/${paymentId}`,
      { status: newStatus }
    );

    if (response.data.success) {
      console.log('✅ Payment status updated');
      await fetchPayments(); // ⭐ FIXED: Call fetchPayments instead
    }
  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    alert('Failed to update payment status');
  }
};


  const calculatePaymentStats = () => {
    const totalAmount = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const paidAmount = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const pendingAmount = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const dueAmount = payments
      .filter(p => p.status === 'due')
      .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const outstandingAmount = totalAmount - paidAmount;

    return {
      total: totalAmount,
      paid: paidAmount,
      pending: pendingAmount,
      due: dueAmount,
      outstanding: outstandingAmount
    };
  };

  // Notes Handlers
 const handleAddNote = async () => {
  if (!newNote.trim()) {
    alert('Please enter note content');
    return;
  }

  try {
    console.log('📝 Adding note');
    
    const response = await axios.post(
      `${API_BASE_URL}/casedetails/${selectedCase._id}/notes`,
      {
        content: newNote,
        author: 'Current User'
      }
    );

    if (response.data.success) {
      console.log('✅ Note added');
      await fetchNotes(); // ⭐ FIXED: Call specific fetch
      setShowNotesModal(false);
      setNewNote('');
      alert('✅ Note added successfully!');
    }
  } catch (error) {
    console.error('❌ Error adding note:', error);
    alert(error.response?.data?.message || 'Failed to add note');
  }
};

  // Document Handlers
 // Document Handlers
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setNewDocument({
      ...newDocument,
      file: file,
      fileName: file.name
    });
  }
};

const handleAddDocument = async () => {
  // Validation
  if (!newDocument.name || !newDocument.category || !newDocument.file) {
    alert('Please fill all required fields');
    return;
  }

  try {
    // Create FormData
    const formData = new FormData();
    
    // ⭐ CRITICAL: Field name must be 'file' to match backend
    formData.append('file', newDocument.file);
    
    // Add other fields
    formData.append('name', newDocument.name);
    formData.append('category', newDocument.category);
    formData.append('linkedCaseNumber', selectedCase.caseNumber || selectedCase.id);
    
    if (newDocument.client) {
      formData.append('linkedClient', newDocument.client);
    }

    if (newDocument.description) {
      formData.append('description', newDocument.description);
    }

    // 🔍 DEBUG: Print what we're sending
    console.log('\n═══════════════════════════════════════');
    console.log('🔍 FRONTEND - FormData Contents:');
    console.log('═══════════════════════════════════════');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`✅ Field: "${key}" = [File] ${value.name} (${(value.size / 1024).toFixed(2)} KB)`);
        if (key !== 'file') {
          console.error(`❌ WRONG! Field name should be "file" not "${key}"`);
          alert(`Error: File field name is "${key}" but should be "file". Please contact developer.`);
          return;
        }
      } else {
        console.log(`   Field: "${key}" = "${value}"`);
      }
    }
    console.log('═══════════════════════════════════════\n');

    console.log('📤 Sending to:', `${API_BASE_URL}/documents`);
    console.log('⏰ Upload started at:', new Date().toLocaleTimeString());

    // Send request
    const response = await axios.post(
      `${API_BASE_URL}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📊 Upload progress: ${percentCompleted}%`);
        }
      }
    );

    console.log('\n✅ SUCCESS!');
    console.log('Response:', response.data);
    console.log('Document ID:', response.data.data?._id);

    if (response.data.success) {
      console.log('✅ Upload successful, refreshing documents list...');
      
      // Refresh documents list
      await fetchDocuments();
      
      // Close modal
      setShowDocumentModal(false);
      
      // Reset form
      setNewDocument({
        name: '',
        category: '',
        client: selectedCase?.clientName || '',
        file: null,
        fileName: '',
        description: ''
      });
      
      // Success message
      alert('✅ Document uploaded successfully!');
      console.log('✅ All cleanup complete\n');
    }

  } catch (error) {
    console.error('\n❌ UPLOAD FAILED');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (error.response) {
      // Server responded with error
      console.error('Status:', error.response.status);
      console.error('Error data:', error.response.data);
      
      if (error.response.data?.error?.code === 'FIELD_NAME_MISMATCH') {
        console.error('\n🔴 FIELD NAME MISMATCH!');
        console.error('Expected:', error.response.data.error.expected);
        console.error('Received:', error.response.data.error.received);
        console.error('Solution:', error.response.data.error.solution);
        
        alert(
          `❌ Upload Failed - Field Name Mismatch\n\n` +
          `Expected field: "${error.response.data.error.expected}"\n` +
          `Received field: "${error.response.data.error.received}"\n\n` +
          `This is a developer error. Please contact support.`
        );
      } else {
        alert(error.response.data?.message || 'Upload failed. Please try again.');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response received');
      console.error('Request:', error.request);
      alert('❌ Network error. Please check your connection and try again.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      alert('❌ Upload failed: ' + error.message);
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
};






  const tabs = [
    { id: "overview", label: "Overview", icon: FiFileText },
    { id: "timeline", label: "Timeline", icon: FiCalendar },
    { id: "documents", label: "Documents", icon: FiFolder },
    { id: "payments", label: "Payments", icon: FiDollarSign },
    { id: "notes", label: "Notes", icon: FiMessageSquare },
  ];

  const displayCase = caseData || selectedCase;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div 
        className="max-w-4xl w-full rounded-lg p-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: colors.cream,
          border: `1px solid ${colors.golden}30`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.3)`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b" style={{ borderColor: `${colors.golden}20` }}>
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:scale-110"
              style={{ 
                background: `${colors.golden}15`, 
                color: colors.navy 
              }}
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold" style={{ color: colors.navy }}>
                  {displayCase.caseNumber || displayCase.id}
                </h2>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: displayCase.status === "active" ? `${colors.blue}20` : `${colors.gray}20`,
                    color: displayCase.status === "active" ? colors.blue : colors.gray,
                    border: `1px solid ${displayCase.status === "active" ? colors.blue : colors.gray}40`
                  }}
                >
                  {displayCase.status?.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: colors.navy }}>
                {displayCase.caseTitle || displayCase.title}
              </h3>
              <p className="text-sm" style={{ color: colors.gray }}>
                {displayCase.category || displayCase.court}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id ? "font-semibold" : "font-medium"}`}
                style={{
                  background: activeTab === tab.id 
                    ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)` 
                    : `${colors.golden}10`,
                  color: activeTab === tab.id ? "white" : colors.navy,
                  border: `1px solid ${activeTab === tab.id ? colors.golden : `${colors.golden}20`}`,
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.golden }}></div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="p-4 rounded-lg" style={{ background: `${colors.golden}05` }}>
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Case Information */}
                <div className="p-4 rounded-lg" style={{ background: "white", border: `1px solid ${colors.golden}20` }}>
                  <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: colors.navy }}>
                    <FiFileText className="w-4 h-4" style={{ color: colors.golden }} />
                    Case Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <span style={{ color: colors.gray }}>Case Number: </span>
                      <span style={{ color: colors.navy, fontWeight: 500 }}>{displayCase.caseNumber || displayCase.id}</span>
                    </div>
                    <div>
                      <span style={{ color: colors.gray }}>Case Type: </span>
                      <span style={{ color: colors.navy, fontWeight: 500 }}>{displayCase.category || "Civil"}</span>
                    </div>
                    <div>
                      <span style={{ color: colors.gray }}>Court: </span>
                      <span style={{ color: colors.navy, fontWeight: 500 }}>{displayCase.court}</span>
                    </div>
                    <div>
                      <span style={{ color: colors.gray }}>Judge: </span>
                      <span style={{ color: colors.navy, fontWeight: 500 }}>{displayCase.judge || 'Not Assigned'}</span>
                    </div>
                    <div>
                      <span style={{ color: colors.gray }}>Next Hearing: </span>
                      <span style={{ color: colors.navy, fontWeight: 500 }}>{formatDate(displayCase.nextHearing)}</span>
                    </div>
                    <div>
                      <span style={{ color: colors.gray }}>Status: </span>
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          background: displayCase.status === "active" ? `${colors.blue}20` : `${colors.gray}20`,
                          color: displayCase.status === "active" ? colors.blue : colors.gray,
                          border: `1px solid ${displayCase.status === "active" ? colors.blue : colors.gray}40`
                        }}
                      >
                        {displayCase.status?.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Parties Information */}
                    <div className="col-span-1 md:col-span-2 pt-3 border-t" style={{ borderColor: `${colors.golden}15` }}>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.navy }}>
                        <FiUsers className="w-4 h-4" style={{ color: colors.golden }} />
                        Parties Involved
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        <div>
                          <span style={{ color: colors.gray }}>Client: </span>
                          <span style={{ color: colors.navy, fontWeight: 500 }}>{displayCase.clientName || displayCase.client}</span>
                        </div>
                        <div>
                          <span style={{ color: colors.gray }}>Opposite Party: </span>
                          <span style={{ color: colors.navy, fontWeight: 500 }}>{displayCase.oppositeParty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {displayCase.description && (
                  <div className="p-4 rounded-lg" style={{ background: "white", border: `1px solid ${colors.golden}20` }}>
                    <h3 className="text-base font-semibold mb-3" style={{ color: colors.navy }}>
                      Case Description
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: colors.gray }}>
                      {displayCase.description}
                    </p>
                  </div>
                )}

                {/* Advocate Information */}
                {displayCase.advocate && (
                  <div className="p-4 rounded-lg" style={{ background: "white", border: `1px solid ${colors.golden}20` }}>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span style={{ color: colors.gray }}>Senior Advocate: </span>
                        <span style={{ color: colors.navy, fontWeight: 500 }}>{displayCase.advocate}</span>
                      </div>
                      {displayCase.juniorAdvocates && displayCase.juniorAdvocates.length > 0 && (
                        <div>
                          <span style={{ color: colors.gray }}>Junior Advocates: </span>
                          <div className="mt-1 space-y-1">
                            {displayCase.juniorAdvocates.map((adv, idx) => (
                              <div key={idx} style={{ color: colors.navy, fontWeight: 500 }}>• {adv}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === "timeline" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold" style={{ color: colors.navy }}>
                    Case Timeline
                  </h3>
                  <button
                    onClick={() => setShowTimelineModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                      color: "white",
                      boxShadow: `0 2px 8px ${colors.golden}40`
                    }}
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Timeline
                  </button>
                </div>

                {timelineEntries && timelineEntries.length > 0 ? (
                  <div className="relative">
                    <div 
                      className="absolute left-6 top-4 bottom-4 w-0.5" 
                      style={{ background: `${colors.golden}30` }}
                    ></div>

                    <div className="space-y-4">
                      {timelineEntries.map((item, idx) => (
                        <div 
                          key={item._id || idx} 
                          className="relative pl-16 pr-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02]" 
                          style={{ 
                            background: "white",
                            border: `1px solid ${colors.golden}20`,
                            boxShadow: `0 2px 8px ${colors.golden}10`
                          }}
                        >
                          <div 
                            className="absolute left-4 top-5 w-5 h-5 rounded-full border-4 flex items-center justify-center"
                            style={{
                              background: item.status === 'completed' 
                                ? colors.green 
                                : item.status === 'active' 
                                ? colors.blue 
                                : item.status === 'ongoing'
                                ? colors.amber
                                : colors.gray,
                              borderColor: colors.cream,
                              boxShadow: `0 0 0 3px ${
                                item.status === 'completed' 
                                  ? colors.green + '20' 
                                  : item.status === 'active' 
                                  ? colors.blue + '20'
                                  : item.status === 'ongoing'
                                  ? colors.amber + '20'
                                  : colors.gray + '20'
                              }`
                            }}
                          >
                            {item.status === 'completed' && (
                              <span className="text-white text-xs font-bold">✓</span>
                            )}
                          </div>

                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 
                                className="font-semibold text-base mb-1" 
                                style={{ color: colors.navy }}
                              >
                                {item.stage}
                              </h4>
                              <div className="flex items-center gap-2">
                                <FiCalendar className="w-3.5 h-3.5" style={{ color: colors.golden }} />
                                <span 
                                  className="text-sm font-medium" 
                                  style={{ color: colors.golden }}
                                >
                                  {formatDate(item.date)}
                                </span>
                              </div>
                            </div>
                            
                            <span 
                              className="text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide" 
                              style={{
                                background: item.status === 'completed' 
                                  ? `${colors.green}20` 
                                  : item.status === 'active' 
                                  ? `${colors.blue}20`
                                  : item.status === 'ongoing'
                                  ? `${colors.amber}20`
                                  : `${colors.gray}20`,
                                color: item.status === 'completed' 
                                  ? colors.green 
                                  : item.status === 'active' 
                                  ? colors.blue
                                  : item.status === 'ongoing'
                                  ? colors.amber
                                  : colors.gray,
                                border: `1px solid ${
                                  item.status === 'completed' 
                                    ? colors.green + '40' 
                                    : item.status === 'active' 
                                    ? colors.blue + '40'
                                    : item.status === 'ongoing'
                                    ? colors.amber + '40'
                                    : colors.gray + '40'
                                }`
                              }}
                            >
                              {item.status}
                            </span>
                          </div>

                          {item.description && (
                            <p 
                              className="text-sm leading-relaxed mt-2 pl-6" 
                              style={{ 
                                color: colors.gray,
                                borderLeft: `2px solid ${colors.golden}20`,
                                paddingLeft: '12px'
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="relative pl-16 py-2">
                      <div 
                        className="absolute left-4 top-2 w-5 h-5 rounded-full border-4"
                        style={{
                          background: colors.cream,
                          borderColor: `${colors.golden}30`
                        }}
                      ></div>
                      <span className="text-xs font-medium" style={{ color: colors.gray }}>
                        Timeline End
                      </span>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="text-center py-12 rounded-lg" 
                    style={{ 
                      background: "white",
                      border: `1px dashed ${colors.golden}40`
                    }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${colors.golden}15` }}
                    >
                      <FiCalendar className="w-8 h-8" style={{ color: colors.golden }} />
                    </div>
                    <p className="font-medium mb-2" style={{ color: colors.navy }}>
                      No timeline entries yet
                    </p>
                    <p className="text-sm" style={{ color: colors.gray }}>
                      Click "Add Timeline" to create your first entry
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold" style={{ color: colors.navy }}>Case Documents</h3>
                  <button 
                    onClick={() => setShowDocumentModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                      color: "white"
                    }}
                  >
                    <FiUpload className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>
                {documents && documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc, idx) => (
                      <div key={doc._id || idx} className="p-4 rounded-lg flex justify-between items-center" style={{ 
                        background: "white",
                        border: `1px solid ${colors.golden}20`
                      }}>
                        <div className="flex items-center gap-3 flex-1">
                          <FiFileText className="w-5 h-5" style={{ color: colors.golden }} />
                          <div>
                            <p className="font-medium text-sm" style={{ color: colors.navy }}>{doc.name}</p>
                            <p className="text-xs" style={{ color: colors.gray }}>
                              {doc.category} • {doc.size} • {formatDate(doc.uploadedAt || doc.date)}
                            </p>
                            {doc.client && (
                              <p className="text-xs mt-1" style={{ color: colors.gray }}>
                                Client: {doc.client}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status && (
                            <span className="text-xs px-2 py-1 rounded" style={{
                              background: doc.status === 'verified' ? `${colors.green}20` : doc.status === 'new' ? `${colors.blue}20` : `${colors.gray}20`,
                              color: doc.status === 'verified' ? colors.green : doc.status === 'new' ? colors.blue : colors.gray
                            }}>
                              {doc.status}
                            </span>
                          )}
                          <button className="p-2 rounded-lg transition-colors" style={{ background: `${colors.golden}10`, color: colors.golden }}>
                            <FiDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    className="text-center py-12 rounded-lg" 
                    style={{ 
                      background: "white",
                      border: `1px dashed ${colors.golden}40`
                    }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${colors.golden}15` }}
                    >
                      <FiFolder className="w-8 h-8" style={{ color: colors.golden }} />
                    </div>
                    <p className="font-medium mb-2" style={{ color: colors.navy }}>
                      No documents uploaded yet
                    </p>
                    <p className="text-sm" style={{ color: colors.gray }}>
                      Click "Upload Document" to add files
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === "payments" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold" style={{ color: colors.navy }}>
                    Case Payments
                  </h3>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                      color: "white"
                    }}
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Payment
                  </button>
                </div>

                {/* Payment Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                      background: "white",
                      border: `1px solid ${colors.golden}20`
                    }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.navy }}>
                      ₹{calculatePaymentStats().total.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: colors.gray }}>
                      Total Amount
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                      background: `${colors.green}10`,
                      border: `1px solid ${colors.green}20`
                    }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.green }}>
                      ₹{calculatePaymentStats().paid.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: colors.gray }}>
                      Paid
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                      background: `${colors.amber}10`,
                      border: `1px solid ${colors.amber}20`
                    }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.amber }}>
                      ₹{(calculatePaymentStats().pending + calculatePaymentStats().due).toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: colors.gray }}>
                      Pending + Due
                    </div>
                  </div>

                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                      background: `${colors.red}10`,
                      border: `1px solid ${colors.red}20`
                    }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.red }}>
                      ₹{calculatePaymentStats().outstanding.toLocaleString()}
                    </div>
                    <div className="text-xs font-semibold" style={{ color: colors.gray }}>
                      Outstanding
                    </div>
                  </div>
                </div>

                {/* Payments List */}
                {payments && payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment, idx) => (
                      <div 
                        key={payment._id || idx} 
                        className="p-4 rounded-lg"
                        style={{ 
                          background: "white",
                          border: `1px solid ${colors.golden}20`
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FiDollarSign className="w-4 h-4" style={{ color: colors.golden }} />
                              <h4 className="font-semibold text-sm" style={{ color: colors.navy }}>
                                {payment.description}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: colors.gray }}>
                              <FiCalendar className="w-3 h-3" />
                              <span>{formatDate(payment.date)}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold mb-1" style={{ color: colors.golden }}>
                              ₹{payment.amount.toLocaleString()}
                            </div>
                            <select
                              value={payment.status}
                              onChange={(e) => handleUpdatePaymentStatus(payment._id, e.target.value)}
                              className="text-xs px-2 py-1 rounded border cursor-pointer"
                              style={{
                                background: payment.status === 'paid' 
                                  ? `${colors.green}20` 
                                  : payment.status === 'pending'
                                  ? `${colors.amber}20`
                                  : `${colors.red}20`,
                                color: payment.status === 'paid' 
                                  ? colors.green 
                                  : payment.status === 'pending'
                                  ? colors.amber
                                  : colors.red,
                                border: `1px solid ${
                                  payment.status === 'paid' 
                                    ? colors.green + '40'
                                    : payment.status === 'pending'
                                    ? colors.amber + '40'
                                    : colors.red + '40'
                                }`,
                                fontWeight: 600
                              }}
                            >
                              <option value="paid">Paid</option>
                              <option value="pending">Pending</option>
                              <option value="due">Due</option>
                            </select>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full h-1.5 rounded-full" style={{ background: `${colors.gray}20` }}>
                            <div 
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: payment.status === 'paid' ? '100%' : payment.status === 'pending' ? '50%' : '25%',
                                background: payment.status === 'paid' 
                                  ? `linear-gradient(90deg, ${colors.green}, ${colors.green}DD)`
                                  : payment.status === 'pending'
                                  ? `linear-gradient(90deg, ${colors.amber}, ${colors.amber}DD)`
                                  : `linear-gradient(90deg, ${colors.red}, ${colors.red}DD)`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    className="text-center py-12 rounded-lg" 
                    style={{ 
                      background: "white",
                      border: `1px dashed ${colors.golden}40`
                    }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${colors.golden}15` }}
                    >
                      <FiDollarSign className="w-8 h-8" style={{ color: colors.golden }} />
                    </div>
                    <p className="font-medium mb-2" style={{ color: colors.navy }}>
                      No payment records yet
                    </p>
                    <p className="text-sm" style={{ color: colors.gray }}>
                      Click "Add Payment" to record your first payment
                    </p>
                  </div>
                )}

                {/* Outstanding Alert */}
                {calculatePaymentStats().outstanding > 0 && (
                  <div 
                    className="p-4 rounded-lg flex items-start gap-3"
                    style={{ 
                      background: `${colors.red}10`,
                      border: `1px solid ${colors.red}20`
                    }}
                  >
                    <FiClock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.red }} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1" style={{ color: colors.red }}>
                        Outstanding Payment Alert
                      </h4>
                      <p className="text-xs" style={{ color: colors.gray }}>
                        There is an outstanding amount of ₹{calculatePaymentStats().outstanding.toLocaleString()} 
                        pending for this case. Please follow up with the client.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === "notes" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold" style={{ color: colors.navy }}>Case Notes</h3>
                  <button 
                    onClick={() => setShowNotesModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                      color: "white"
                    }}
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Note
                  </button>
                </div>
                
                {notes && notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map((note, idx) => (
                      <div 
                        key={note._id || idx} 
                        className="p-4 rounded-lg" 
                        style={{ 
                          background: "white", 
                          border: `1px solid ${colors.golden}20` 
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <FiMessageSquare className="w-4 h-4" style={{ color: colors.golden }} />
                            <span className="text-xs font-medium" style={{ color: colors.gray }}>
                              {note.author || 'Unknown'}
                            </span>
                          </div>
                          <span className="text-xs" style={{ color: colors.gray }}>
                            {formatDate(note.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: colors.navy }}>
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    className="text-center py-12 rounded-lg" 
                    style={{ 
                      background: "white",
                      border: `1px dashed ${colors.golden}40`
                    }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${colors.golden}15` }}
                    >
                      <FiMessageSquare className="w-8 h-8" style={{ color: colors.golden }} />
                    </div>
                    <p className="font-medium mb-2" style={{ color: colors.navy }}>
                      No notes available yet
                    </p>
                    <p className="text-sm" style={{ color: colors.gray }}>
                      Click "Add Note" to create your first note
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      
      {/* Add Timeline Modal */}
      {showTimelineModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowTimelineModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-lg p-6"
            style={{
              background: colors.cream,
              border: `1px solid ${colors.golden}30`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.4)`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{ color: colors.navy }}>
                Add Timeline Entry
              </h3>
              <button
                onClick={() => setShowTimelineModal(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: colors.gray }}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Timeline Stage Name *
                </label>
                <input
                  type="text"
                  value={newTimeline.stage}
                  onChange={(e) => setNewTimeline({...newTimeline, stage: e.target.value})}
                  placeholder="e.g., Evidence Submission"
                  className="w-full p-3 rounded-lg border focus:outline-none"
                  style={{
                    background: "white",
                    border: `1px solid ${colors.golden}20`,
                    color: colors.navy
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={newTimeline.date}
                  onChange={(e) => setNewTimeline({...newTimeline, date: e.target.value})}
                  className="w-full p-3 rounded-lg border focus:outline-none"
                  style={{
                    background: "white",
                    border: `1px solid ${colors.golden}20`,
                    color: colors.navy
                  }}
                />
              </div>

              <div className="p-3 rounded-lg" style={{ background: `${colors.amber}10`, border: `1px solid ${colors.amber}20` }}>
                <p className="text-xs flex items-center gap-2" style={{ color: colors.amber }}>
                  <FiClock className="w-4 h-4" />
                  New timeline entries will be marked as "ongoing"
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTimelineModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: `${colors.gray}15`,
                  color: colors.gray
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTimeline}
                disabled={!newTimeline.stage || !newTimeline.date}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: (newTimeline.stage && newTimeline.date) 
                    ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)` 
                    : `${colors.gray}20`,
                  color: (newTimeline.stage && newTimeline.date) ? "white" : colors.gray,
                  cursor: (newTimeline.stage && newTimeline.date) ? 'pointer' : 'not-allowed'
                }}
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowPaymentModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-lg p-6"
            style={{
              background: colors.cream,
              border: `1px solid ${colors.golden}30`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.4)`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{ color: colors.navy }}>
                Add Payment
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: colors.gray }}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Payment Description *
                </label>
                <input
                  type="text"
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                  placeholder="e.g., Court Fees, Advocate Fees"
                  className="w-full p-3 rounded-lg border focus:outline-none"
                  style={{
                    background: "white",
                    border: `1px solid ${colors.golden}20`,
                    color: colors.navy
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  className="w-full p-3 rounded-lg border focus:outline-none"
                  style={{
                    background: "white",
                    border: `1px solid ${colors.golden}20`,
                    color: colors.navy
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                  className="w-full p-3 rounded-lg border focus:outline-none"
                  style={{
                    background: "white",
                    border: `1px solid ${colors.golden}20`,
                    color: colors.navy
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Payment Status *
                </label>
                <select
                  value={newPayment.status}
                  onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
                  className="w-full p-3 rounded-lg border focus:outline-none"
                  style={{
                    background: "white",
                    border: `1px solid ${colors.golden}20`,
                    color: colors.navy
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="due">Due</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setNewPayment({
                    description: '',
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    status: 'pending'
                  });
                }}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: `${colors.gray}15`,
                  color: colors.gray
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                disabled={!newPayment.description || !newPayment.amount || !newPayment.date}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: (newPayment.description && newPayment.amount && newPayment.date)
                    ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)` 
                    : `${colors.gray}20`,
                  color: (newPayment.description && newPayment.amount && newPayment.date) ? "white" : colors.gray,
                  cursor: (newPayment.description && newPayment.amount && newPayment.date) ? 'pointer' : 'not-allowed'
                }}
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNotesModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowNotesModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-lg p-6"
            style={{
              background: colors.cream,
              border: `1px solid ${colors.golden}30`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.4)`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{ color: colors.navy }}>
                Add Note
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: colors.gray }}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Note Content *
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note here..."
                  rows={5}
                  className="w-full p-3 rounded-lg border focus:outline-none resize-none"
                  style={{
                    background: "white",
                    border: `1px solid ${colors.golden}20`,
                    color: colors.navy
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setNewNote('');
                }}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: `${colors.gray}15`,
                  color: colors.gray
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: newNote.trim() 
                    ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)` 
                    : `${colors.gray}20`,
                  color: newNote.trim() ? "white" : colors.gray,
                  cursor: newNote.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
     {/* Upload Document Modal */}
{showDocumentModal && (
  <div 
    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.6)" }}
    onClick={() => setShowDocumentModal(false)}
  >
    <div 
      className="w-full max-w-md rounded-lg p-6"
      style={{
        background: colors.cream,
        border: `1px solid ${colors.golden}30`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4)`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold" style={{ color: colors.navy }}>
          Upload Document
        </h3>
        <button
          onClick={() => setShowDocumentModal(false)}
          className="p-1 rounded-lg transition-colors"
          style={{ color: colors.gray }}
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
            Document Name *
          </label>
          <input
            type="text"
            value={newDocument.name}
            onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
            placeholder="e.g., Property Deed"
            className="w-full p-3 rounded-lg border focus:outline-none"
            style={{
              background: "white",
              border: `1px solid ${colors.golden}20`,
              color: colors.navy
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
            Category *
          </label>
          <select
            value={newDocument.category}
            onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
            className="w-full p-3 rounded-lg border focus:outline-none"
            style={{
              background: "white",
              border: `1px solid ${colors.golden}20`,
              color: colors.navy
            }}
          >
            <option value="">Select Category</option>
            <option value="Plaint">Plaint</option>
            <option value="Evidence">Evidence</option>
            <option value="Court Order">Court Order</option>
            <option value="Correspondence">Correspondence</option>
            <option value="Contract">Contract</option>
            <option value="Affidavit">Affidavit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
            Client
          </label>
          <input
            type="text"
            value={newDocument.client}
            onChange={(e) => setNewDocument({...newDocument, client: e.target.value})}
            placeholder="Client name"
            className="w-full p-3 rounded-lg border focus:outline-none"
            style={{
              background: "white",
              border: `1px solid ${colors.golden}20`,
              color: colors.navy
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
            Linked Case
          </label>
          <input
            type="text"
            value={selectedCase.caseNumber || selectedCase.id}
            disabled
            className="w-full p-3 rounded-lg border"
            style={{
              background: `${colors.gray}10`,
              border: `1px solid ${colors.golden}20`,
              color: colors.gray
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
            Upload File *
          </label>
          <div className="relative">
            {/* ⭐ FIXED FILE INPUT */}
            <input
              ref={(input) => {
                if (input) {
                  input.onclick = null; // Clear any old handlers
                }
              }}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="caseDocumentFileInput"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="caseDocumentFileInput"
              className="w-full p-3 rounded-lg border flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-opacity-80"
              style={{
                background: `${colors.golden}10`,
                border: `1px dashed ${colors.golden}`,
                color: colors.golden
              }}
            >
              <FiUpload className="w-5 h-5" />
              <span className="font-medium">
                {newDocument.fileName || 'Choose file to upload'}
              </span>
            </label>
          </div>
          <p className="text-xs mt-1" style={{ color: colors.gray }}>
            Supported: PDF, DOC, DOCX, JPG, PNG
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            setShowDocumentModal(false);
            setNewDocument({
              name: '',
              category: '',
              client: selectedCase?.clientName || '',
              file: null,
              fileName: ''
            });
          }}
          className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            background: `${colors.gray}15`,
            color: colors.gray
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleAddDocument}
          disabled={!newDocument.name || !newDocument.category || !newDocument.file}
          className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            background: (newDocument.name && newDocument.category && newDocument.file)
              ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)` 
              : `${colors.gray}20`,
            color: (newDocument.name && newDocument.category && newDocument.file) ? "white" : colors.gray,
            cursor: (newDocument.name && newDocument.category && newDocument.file) ? 'pointer' : 'not-allowed'
          }}
        >
          Upload
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CaseDetailView;
