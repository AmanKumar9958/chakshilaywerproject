
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, X, Mail, Phone, FileText, Building, User as UserIcon, Users, Eye, Edit2, Trash2, Filter, MessageSquare, Calendar, MapPin, Briefcase, Clock, CheckCircle, Upload, Download, CreditCard, TrendingUp, Award, DollarSign, Video, File, AlertCircle } from 'lucide-react';
// import GeneralPartyDetails from './GeneralPartyDetails';
// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';

const Reports = () => {
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    gold: '#b69d74',
    golden: '#b69d74',
    gray: '#6b7280',
    success: '#10b981',
    green: '#10b981',
    danger: '#ef4444',
    blue: '#3b82f6',
    amber: '#f59e0b'
  };

  const fileUploadRef = useRef(null);
  const panCardUploadRef = useRef(null);
  const aadhaarCardUploadRef = useRef(null);
  const viewPanUploadRef = useRef(null);
  const viewAadhaarUploadRef = useRef(null);

  // State Management
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);
  const [showViewPartyModal, setShowViewPartyModal] = useState(false);
  const [showAddCaseModal, setShowAddCaseModal] = useState(false); // NEW
  const [showUploadDocModal, setShowUploadDocModal] = useState(false); // NEW
  const [showCommunicationHub, setShowCommunicationHub] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(false);
  
  // File upload states
  const [uploadedPanCard, setUploadedPanCard] = useState(null);
  const [uploadedAadhaar, setUploadedAadhaar] = useState(null);
  
  const [parties, setParties] = useState([]);
const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
const [newPayment, setNewPayment] = useState({
  amount: '',
  dueDate: '',
  method: '',
  invoice: '',
  notes: '',
});

  const [newParty, setNewParty] = useState({
    name: '',
    type: 'Individual',
    contact: '',
    phone: '',
    notes: '',
    address: '',
    occupation: '',
    company: '',
    panCard: null,
    aadhaarCard: null,
    panNumber: '',
    aadhaarNumber: ''
  });

  // NEW: New Case State
 const [newCase, setNewCase] = useState({ 
  caseNumber: '',
  caseTitle: '',        // ✅ Changed from 'title' to match backend
  clientName: '',       // ✅ Changed from 'client' to match backend
  oppositeParty: '',    // ✅ Changed from 'opposingParty' to match backend
  court: '',
  caseType: 'Civil',
  filingDate: '',
  nextHearing: '',      // ✅ Changed from 'nextHearingDate' to match backend
  status: 'Active',
  description: ''
});

// case options//  
 const caseOptions = [
    { value: 'Civil', label: 'Civil' },
    { value: 'Criminal', label: 'Criminal' },
    { value: 'Family', label: 'Family' },
    { value: 'Corporate', label: 'Corporate' },
  ];
  // NEW: Upload Document State
  const [newDocument, setNewDocument] = useState({
    title: '',
    caseId: '',
    file: null,
    description: ''
  });
// Add new payment
const handleAddPayment = () => {
  if (!newPayment.amount || !newPayment.dueDate || !newPayment.method) {
    alert('Please fill in all required fields');
    return;
  }

  const payment = {
    _id: Date.now().toString(), // Generate temporary ID
    amount: parseFloat(newPayment.amount),
    dueDate: newPayment.dueDate,
    method: newPayment.method,
    invoice: newPayment.invoice || `INV-${Date.now()}`,
    notes: newPayment.notes,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  // Update selectedParty with new payment
  const updatedParty = {
    ...selectedParty,
    paymentHistory: [payment, ...(selectedParty.paymentHistory || [])],
    outstandingDues: (selectedParty.outstandingDues || 0) + payment.amount,
  };

  setSelectedParty(updatedParty);

  // Reset form and close modal
  setNewPayment({
    amount: '',
    dueDate: '',
    method: '',
    invoice: '',
    notes: '',
  });
  setShowAddPaymentModal(false);

  alert('Payment added successfully!');
};

// Mark payment as complete
const handleMarkPaymentComplete = (paymentId) => {
  const updatedPaymentHistory = selectedParty.paymentHistory.map((payment) => {
    if ((payment._id || payment.id) === paymentId) {
      return {
        ...payment,
        status: 'Completed',
        paidDate: new Date().toISOString(),
      };
    }
    return payment;
  });

  // Calculate new outstanding dues
  const completedPayment = selectedParty.paymentHistory.find(
    (p) => (p._id || p.id) === paymentId
  );
  const newOutstanding = Math.max(
    0,
    (selectedParty.outstandingDues || 0) - (completedPayment?.amount || 0)
  );

  const updatedParty = {
    ...selectedParty,
    paymentHistory: updatedPaymentHistory,
    outstandingDues: newOutstanding,
  };

  setSelectedParty(updatedParty);
  alert('Payment marked as complete!');
};

  // Fetch parties from backend on component mount
  useEffect(() => {
    fetchParties();
  }, []);

  // API Functions
  const fetchParties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/clerk-parties`);
      if (response.data.success) {
        setParties(response.data.data);
        console.log('✅ Parties fetched:', response.data.data.length);
      }
    } catch (error) {
      console.error('❌ Error fetching parties:', error);
      setParties([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter parties
  const filteredParties = parties.filter(party => {
    const matchesSearch = (party.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          party.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          party.contact?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'All' || party.type === filterType;
    return matchesSearch && matchesType;
  });

  // File upload handlers
  const handlePanCardUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert('Only JPG, PNG, and PDF files are allowed');
        return;
      }
      setUploadedPanCard(file);
      setNewParty({ ...newParty, panCard: file });
    }
  };

  const handleAadhaarCardUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert('Only JPG, PNG, and PDF files are allowed');
        return;
      }
      setUploadedAadhaar(file);
      setNewParty({ ...newParty, aadhaarCard: file });
    }
  };

  // NEW: Handle ID Proof Upload for View Modal
  const handleViewIdUpload = async (type, file) => {
    if (!file || !selectedParty) return;

    setLoading(true);
    try {
      // Upload to backend
      const response = await axios.post(
        `${API_BASE_URL}/clerk-parties/${selectedParty._id}/upload-id`,
        {
          type: type === 'pan' ? 'PAN Card' : 'Aadhaar',
          number: type === 'pan' ? selectedParty.panCard?.number : selectedParty.aadhaarCard?.number,
          fileUrl: 'https://example.com/uploads/' + file.name // Placeholder
        }
      );

      if (response.data.success) {
        alert(`${type.toUpperCase()} Card uploaded successfully!`);
        // Refresh party details
        handleViewParty(selectedParty);
      }
    } catch (error) {
      console.error('❌ Error uploading ID proof:', error);
      alert('Failed to upload ID proof');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleViewParty = async (party) => {
  console.log('🔍 [handleViewParty] Function called');
  console.log('📋 [handleViewParty] Party object received:', party);
  console.log('🆔 [handleViewParty] Party ID:', party?._id);
  
  setLoading(true);
  console.log('⏳ [handleViewParty] Loading state set to true');
  
  try {
    const apiUrl = `${API_BASE_URL}/clerk-parties/${party._id}`;
    console.log('🌐 [handleViewParty] API URL:', apiUrl);
    console.log('📡 [handleViewParty] Making GET request...');
    
    const response = await axios.get(apiUrl);
    
    console.log('📦 [handleViewParty] Response received:', response);
    console.log('✅ [handleViewParty] Response status:', response.status);
    console.log('📊 [handleViewParty] Response data:', response.data);
    console.log('🔐 [handleViewParty] Success flag:', response.data.success);
    
    if (response.data.success) {
      console.log('✨ [handleViewParty] Success! Party data:', response.data.data);
      
      setSelectedParty(response.data.data);
      console.log('💾 [handleViewParty] Selected party state updated');
      
      setShowViewPartyModal(true);
      console.log('👁️ [handleViewParty] View party modal opened');
      
      setActiveTab('overview');
      console.log('📑 [handleViewParty] Active tab set to: overview');
      
      console.log('✅ [handleViewParty] Party details fetched successfully');
    } else {
      console.warn('⚠️ [handleViewParty] Response success flag is false');
      console.log('📄 [handleViewParty] Falling back to original party data');
      
      setSelectedParty(party);
      setShowViewPartyModal(true);
      setActiveTab('overview');
    }
  } catch (error) {
    console.error('❌ [handleViewParty] Error occurred!');
    console.error('❌ [handleViewParty] Error object:', error);
    console.error('❌ [handleViewParty] Error message:', error.message);
    console.error('❌ [handleViewParty] Error stack:', error.stack);
    
    if (error.response) {
      // Server responded with error
      console.error('🔴 [handleViewParty] Server error response:', error.response);
      console.error('🔴 [handleViewParty] Response status:', error.response.status);
      console.error('🔴 [handleViewParty] Response data:', error.response.data);
      console.error('🔴 [handleViewParty] Response headers:', error.response.headers);
    } else if (error.request) {
      // Request made but no response
      console.error('📡 [handleViewParty] No response received:', error.request);
    } else {
      // Error in setting up request
      console.error('⚙️ [handleViewParty] Request setup error:', error.message);
    }
    
    console.log('🔄 [handleViewParty] Falling back to original party data');
    setSelectedParty(party);
    console.log('💾 [handleViewParty] Selected party set to fallback data');
    
    setShowViewPartyModal(true);
    console.log('👁️ [handleViewParty] View party modal opened (fallback)');
    
    setActiveTab('overview');
    console.log('📑 [handleViewParty] Active tab set to: overview (fallback)');
  } finally {
    setLoading(false);
    console.log('✔️ [handleViewParty] Loading state set to false');
    console.log('🏁 [handleViewParty] Function execution completed');
    console.log('═'.repeat(50));
  }
};


  const handleAddParty = async () => {
    if (!newParty.name || !newParty.contact) {
      alert('Please fill in required fields (Name and Contact)');
      return;
    }

    setLoading(true);
    try {
      const partyData = {
        name: newParty.name,
        type: newParty.type,
        email: newParty.contact,
        phone: newParty.phone,
        address: newParty.address,
        occupation: newParty.occupation,
        company: newParty.company,
        notes: newParty.notes,
        panNumber: newParty.panNumber,
        aadhaarNumber: newParty.aadhaarNumber
      };

      const response = await axios.post(`${API_BASE_URL}/clerk-parties`, partyData);

      if (response.data.success) {
        console.log('✅ Party created successfully');
        alert('Party created successfully!');
        
        setNewParty({
          name: '',
          type: 'Individual',
          contact: '',
          phone: '',
          notes: '',
          address: '',
          occupation: '',
          company: '',
          panCard: null,
          aadhaarCard: null,
          panNumber: '',
          aadhaarNumber: ''
        });
        setUploadedPanCard(null);
        setUploadedAadhaar(null);
        setShowAddPartyModal(false);
        
        fetchParties();
      }
    } catch (error) {
      console.error('❌ Error creating party:', error);
      alert(error.response?.data?.message || 'Failed to create party. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this party?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/clerk-parties/${id}`);
      
      if (response.data.success) {
        console.log('✅ Party deleted successfully');
        alert('Party archived successfully!');
        fetchParties();
      }
    } catch (error) {
      console.error('❌ Error deleting party:', error);
      alert('Failed to delete party. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Handle Add Case
 const handleAddCase = async () => { 
  console.log('\n' + '═'.repeat(60));
  console.log('🎬 [handleAddCase] ═══ FUNCTION START ═══');
  console.log('═'.repeat(60));
  console.log('⏰ [handleAddCase] Timestamp:', new Date().toISOString());
  console.log('⏰ [handleAddCase] Local Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('📋 [handleAddCase] Current case state:', JSON.stringify(newCase, null, 2));
  console.log('🔍 [handleAddCase] Starting validation process...');
  console.log('─'.repeat(60));
  
  // ✅ Individual field logging
  console.log('📝 [handleAddCase] Field-by-field inspection:');
  console.log('   • caseNumber:', newCase.caseNumber, '|', typeof newCase.caseNumber, '| Length:', newCase.caseNumber?.length || 0);
  console.log('   • caseTitle:', newCase.caseTitle, '|', typeof newCase.caseTitle, '| Length:', newCase.caseTitle?.length || 0);
  console.log('   • clientName:', newCase.clientName, '|', typeof newCase.clientName, '| Length:', newCase.clientName?.length || 0);
  console.log('   • oppositeParty:', newCase.oppositeParty, '|', typeof newCase.oppositeParty, '| Length:', newCase.oppositeParty?.length || 0);
  console.log('   • court:', newCase.court, '|', typeof newCase.court, '| Length:', newCase.court?.length || 0);
  console.log('   • filingDate:', newCase.filingDate, '|', typeof newCase.filingDate, '| Length:', newCase.filingDate?.length || 0);
  console.log('   • caseType:', newCase.caseType, '|', typeof newCase.caseType);
  console.log('   • nextHearing:', newCase.nextHearing, '|', typeof newCase.nextHearing);
  console.log('   • status:', newCase.status, '|', typeof newCase.status);
  console.log('   • description:', newCase.description, '| Length:', newCase.description?.length || 0);
  console.log('─'.repeat(60));

  // ✅ Validation with detailed logging
  console.log('🔍 [handleAddCase] Running validation checks...');
  const validationChecks = {
    caseNumber: {
      value: newCase.caseNumber,
      isEmpty: !newCase.caseNumber,
      isTrimmedEmpty: !newCase.caseNumber?.trim(),
      status: newCase.caseNumber && newCase.caseNumber.trim() ? '✅ VALID' : '❌ INVALID'
    },
    caseTitle: {
      value: newCase.caseTitle,
      isEmpty: !newCase.caseTitle,
      isTrimmedEmpty: !newCase.caseTitle?.trim(),
      status: newCase.caseTitle && newCase.caseTitle.trim() ? '✅ VALID' : '❌ INVALID'
    },
    clientName: {
      value: newCase.clientName,
      isEmpty: !newCase.clientName,
      isTrimmedEmpty: !newCase.clientName?.trim(),
      status: newCase.clientName && newCase.clientName.trim() ? '✅ VALID' : '❌ INVALID'
    },
    oppositeParty: {
      value: newCase.oppositeParty,
      isEmpty: !newCase.oppositeParty,
      isTrimmedEmpty: !newCase.oppositeParty?.trim(),
      status: newCase.oppositeParty && newCase.oppositeParty.trim() ? '✅ VALID' : '❌ INVALID'
    },
    court: {
      value: newCase.court,
      isEmpty: !newCase.court,
      isTrimmedEmpty: !newCase.court?.trim(),
      status: newCase.court && newCase.court.trim() ? '✅ VALID' : '❌ INVALID'
    },
    filingDate: {
      value: newCase.filingDate,
      isEmpty: !newCase.filingDate,
      isValidDate: newCase.filingDate && !isNaN(new Date(newCase.filingDate).getTime()),
      status: newCase.filingDate ? '✅ VALID' : '❌ INVALID'
    }
  };

  console.log('📊 [handleAddCase] Detailed validation results:');
  console.table(validationChecks);
  
  if (!newCase.caseNumber || !newCase.caseTitle || !newCase.clientName || !newCase.oppositeParty || !newCase.court || !newCase.filingDate) {
    console.warn('⚠️' + '═'.repeat(58));
    console.warn('⚠️  VALIDATION FAILED - MISSING REQUIRED FIELDS');
    console.warn('⚠️' + '═'.repeat(58));
    
    const missingFields = [];
    if (!newCase.caseNumber) missingFields.push('Case Number');
    if (!newCase.caseTitle) missingFields.push('Case Title');
    if (!newCase.clientName) missingFields.push('Client Name');
    if (!newCase.oppositeParty) missingFields.push('Opposite Party');
    if (!newCase.court) missingFields.push('Court');
    if (!newCase.filingDate) missingFields.push('Filing Date');
    
    console.error('❌ [handleAddCase] Missing fields:', missingFields.join(', '));
    console.error('❌ [handleAddCase] Missing field count:', missingFields.length, '/', 6);
    console.log('📊 [handleAddCase] Field check summary:', {
      caseNumber: newCase.caseNumber ? '✅ Present' : '❌ MISSING',
      caseTitle: newCase.caseTitle ? '✅ Present' : '❌ MISSING',
      clientName: newCase.clientName ? '✅ Present' : '❌ MISSING',
      oppositeParty: newCase.oppositeParty ? '✅ Present' : '❌ MISSING',
      court: newCase.court ? '✅ Present' : '❌ MISSING',
      filingDate: newCase.filingDate ? '✅ Present' : '❌ MISSING'
    });
    
    const alertMessage = `Please fill in all required fields:\n\n${missingFields.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;
    console.warn('🚨 [handleAddCase] Alert message:', alertMessage);
    alert(alertMessage);
    
    console.log('🔙 [handleAddCase] Returning from function due to validation failure');
    console.log('═'.repeat(60) + '\n');
    return;
  }

  console.log('✅ [handleAddCase] ═══ VALIDATION PASSED ═══');
  console.log('✅ [handleAddCase] All 6 required fields are present');
  console.log('─'.repeat(60));

  console.log('⏳ [handleAddCase] Setting loading state to TRUE...');
  setLoading(true);
  console.log('✅ [handleAddCase] Loading state updated');
  console.log('─'.repeat(60));
  
  try {
    console.log('📦 [handleAddCase] ═══ PREPARING REQUEST DATA ═══');
    
    // ✅ Prepare case data with extensive logging
    const caseData = {
      caseNumber: newCase.caseNumber,
      caseTitle: newCase.caseTitle,
      clientName: newCase.clientName,
      oppositeParty: newCase.oppositeParty,
      court: newCase.court,
      caseType: newCase.caseType,
      filingDate: newCase.filingDate,
      nextHearing: newCase.nextHearing || null,
      status: newCase.status,
      description: newCase.description
    };

    console.log('📋 [handleAddCase] Case data object created');
    console.log('📊 [handleAddCase] Data structure:');
    console.log('   ├─ caseNumber:', caseData.caseNumber);
    console.log('   ├─ caseTitle:', caseData.caseTitle);
    console.log('   ├─ clientName:', caseData.clientName);
    console.log('   ├─ oppositeParty:', caseData.oppositeParty);
    console.log('   ├─ court:', caseData.court);
    console.log('   ├─ caseType:', caseData.caseType);
    console.log('   ├─ filingDate:', caseData.filingDate);
    console.log('   ├─ nextHearing:', caseData.nextHearing);
    console.log('   ├─ status:', caseData.status);
    console.log('   └─ description:', caseData.description ? `${caseData.description.substring(0, 50)}...` : '(empty)');
    
    console.log('📤 [handleAddCase] Complete payload (JSON):');
    console.log(JSON.stringify(caseData, null, 2));
    
    console.log('📏 [handleAddCase] Payload size:', JSON.stringify(caseData).length, 'bytes');
    console.log('🔢 [handleAddCase] Field count:', Object.keys(caseData).length);
    console.log('─'.repeat(60));

    const apiUrl = `${API_BASE_URL}/new-case`;
    console.log('🌐 [handleAddCase] ═══ API REQUEST DETAILS ═══');
    console.log('🔗 [handleAddCase] Base URL:', API_BASE_URL);
    console.log('🔗 [handleAddCase] Full URL:', apiUrl);
    console.log('📡 [handleAddCase] HTTP Method: POST');
    console.log('📋 [handleAddCase] Headers:', {
      'Content-Type': 'application/json'
    });
    console.log('⏱️ [handleAddCase] Starting API call timer...');
    console.time('[handleAddCase] API call duration');
    console.log('🚀 [handleAddCase] Sending HTTP POST request NOW...');
    console.log('─'.repeat(60));
    
    const requestStartTime = performance.now();
    console.log('⏰ [handleAddCase] Request start time:', requestStartTime.toFixed(2), 'ms');
    
    const response = await axios.post(apiUrl, caseData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const requestEndTime = performance.now();
    const requestDuration = requestEndTime - requestStartTime;
    
    console.timeEnd('[handleAddCase] API call duration');
    console.log('⏱️ [handleAddCase] Request completed in:', requestDuration.toFixed(2), 'ms');
    console.log('─'.repeat(60));

    console.log('📦 [handleAddCase] ═══ RESPONSE RECEIVED ═══');
    console.log('✅ [handleAddCase] Response object:', response);
    console.log('📊 [handleAddCase] Response status:', response.status, response.statusText);
    console.log('📋 [handleAddCase] Response headers:', response.headers);
    console.log('📊 [handleAddCase] Response config:', response.config.method.toUpperCase(), response.config.url);
    console.log('─'.repeat(60));
    
    console.log('📊 [handleAddCase] Response data structure:');
    console.log('   ├─ success:', response.data.success);
    console.log('   ├─ message:', response.data.message);
    console.log('   └─ data:', response.data.data ? 'Present' : 'Missing');
    
    console.log('📄 [handleAddCase] Full response data:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('─'.repeat(60));
    
    if (response.data.success) {
      console.log('✅' + '═'.repeat(58));
      console.log('✅  SUCCESS - CASE CREATED!');
      console.log('✅' + '═'.repeat(58));
      console.log('🎉 [handleAddCase] Case creation successful!');
      console.log('🆔 [handleAddCase] Created case ID:', response.data.data._id);
      console.log('📄 [handleAddCase] Created case number:', response.data.data.caseNumber);
      console.log('📋 [handleAddCase] Created case title:', response.data.data.caseTitle);
      console.log('👤 [handleAddCase] Client:', response.data.data.clientName);
      console.log('⚖️ [handleAddCase] Opposite Party:', response.data.data.oppositeParty);
      console.log('🏛️ [handleAddCase] Court:', response.data.data.court);
      console.log('📅 [handleAddCase] Filing Date:', response.data.data.filingDate);
      console.log('📊 [handleAddCase] Complete created case data:');
      console.log(JSON.stringify(response.data.data, null, 2));
      console.log('─'.repeat(60));
      
      console.log('🔔 [handleAddCase] Showing success alert to user...');
      alert('✅ Case created successfully!\n\nCase Number: ' + response.data.data.caseNumber);
      console.log('✅ [handleAddCase] Alert dismissed by user');
      console.log('─'.repeat(60));
      
      console.log('🔄 [handleAddCase] Resetting form fields...');
      const resetData = {
        caseNumber: '',
        caseTitle: '',
        clientName: '',
        oppositeParty: '',
        court: '',
        caseType: 'Civil',
        filingDate: '',
        nextHearing: '',
        status: 'Active',
        description: ''
      };
      console.log('📋 [handleAddCase] Reset values:', resetData);
      
      setNewCase(resetData);
      console.log('✅ [handleAddCase] Form state reset to initial values');
      console.log('─'.repeat(60));
      
      console.log('👁️ [handleAddCase] Closing modal...');
      setShowAddCaseModal(false);
      console.log('✅ [handleAddCase] Modal closed successfully');
      console.log('─'.repeat(60));
      
      console.log('✅ [handleAddCase] Post-creation cleanup complete');
      console.log('🎊 [handleAddCase] Case creation flow finished successfully!');
    } else {
      console.warn('⚠️ [handleAddCase] Response success flag is FALSE');
      console.warn('⚠️ [handleAddCase] This should not happen with 200 status');
      console.warn('⚠️ [handleAddCase] Response:', response.data);
    }
    
  } catch (error) {
    console.error('\n' + '❌'.repeat(30));
    console.error('❌  ERROR OCCURRED IN handleAddCase');
    console.error('❌'.repeat(30));
    console.error('💥 [handleAddCase] Exception caught in try-catch block');
    console.error('⏰ [handleAddCase] Error time:', new Date().toISOString());
    console.error('─'.repeat(60));
    
    console.error('📊 [handleAddCase] Error object type:', error.constructor.name);
    console.error('📋 [handleAddCase] Error properties:', Object.keys(error));
    console.error('📄 [handleAddCase] Complete error object:', error);
    console.error('💬 [handleAddCase] Error message:', error.message);
    console.error('📚 [handleAddCase] Error stack trace:');
    console.error(error.stack);
    console.error('─'.repeat(60));
    
    if (error.response) {
      console.error('🔴' + '═'.repeat(58));
      console.error('🔴  SERVER ERROR RESPONSE');
      console.error('🔴' + '═'.repeat(58));
      console.error('📡 [handleAddCase] Server responded with error');
      console.error('📊 [handleAddCase] Response status:', error.response.status, error.response.statusText);
      console.error('📋 [handleAddCase] Response headers:', error.response.headers);
      console.error('📄 [handleAddCase] Response data:', error.response.data);
      console.error('💬 [handleAddCase] Error message from server:', error.response.data?.message);
      console.error('📊 [handleAddCase] Full error response:');
      console.error(JSON.stringify(error.response.data, null, 2));
      console.error('─'.repeat(60));
      
      const errorMessage = error.response.data?.message || 'Failed to create case';
      console.error('🚨 [handleAddCase] Alert message to show:', errorMessage);
      alert('❌ Error: ' + errorMessage);
      console.error('✅ [handleAddCase] Error alert dismissed');
      
    } else if (error.request) {
      console.error('📡' + '═'.repeat(58));
      console.error('📡  NO RESPONSE FROM SERVER');
      console.error('📡' + '═'.repeat(58));
      console.error('🌐 [handleAddCase] Request was sent but no response received');
      console.error('📋 [handleAddCase] Request object:', error.request);
      console.error('🔍 [handleAddCase] Request readyState:', error.request.readyState);
      console.error('🔍 [handleAddCase] Request status:', error.request.status);
      console.error('🔍 [handleAddCase] Request statusText:', error.request.statusText);
      console.error('─'.repeat(60));
      
      console.error('🚨 [handleAddCase] Possible causes:');
      console.error('   • Backend server is down');
      console.error('   • Network connection lost');
      console.error('   • CORS issue');
      console.error('   • Firewall blocking request');
      console.error('   • Request timeout');
      
      alert('❌ No response from server.\n\nPlease check:\n• Is the backend running?\n• Is your internet connected?');
      console.error('✅ [handleAddCase] No response alert dismissed');
      
    } else {
      console.error('⚙️' + '═'.repeat(58));
      console.error('⚙️  REQUEST SETUP ERROR');
      console.error('⚙️' + '═'.repeat(58));
      console.error('🔧 [handleAddCase] Error occurred while setting up request');
      console.error('💬 [handleAddCase] Error message:', error.message);
      console.error('📋 [handleAddCase] Error config:', error.config);
      console.error('─'.repeat(60));
      
      alert('❌ Failed to create case.\n\nError: ' + error.message);
      console.error('✅ [handleAddCase] Setup error alert dismissed');
    }
    
    console.error('─'.repeat(60));
    console.error('📊 [handleAddCase] Error handling complete');
    
  } finally {
    console.log('\n' + '🏁'.repeat(30));
    console.log('🏁  FINALLY BLOCK EXECUTED');
    console.log('🏁'.repeat(30));
    console.log('🔄 [handleAddCase] Setting loading state to FALSE...');
    setLoading(false);
    console.log('✅ [handleAddCase] Loading state set to false');
    console.log('⏰ [handleAddCase] End time:', new Date().toISOString());
    console.log('─'.repeat(60));
    
    console.log('✔️ [handleAddCase] Function execution complete');
    console.log('📊 [handleAddCase] Final state:', {
      loading: false,
      modalOpen: false,
      formReset: true
    });
    console.log('═'.repeat(60));
    console.log('🎬 [handleAddCase] ═══ FUNCTION END ═══');
    console.log('═'.repeat(60) + '\n\n');
  }
};



  // NEW: Handle Upload Document
  // Enhanced Upload Document Handler with Console Logs
const handleUploadDocument = async () => {
  console.log('\n' + '═'.repeat(60));
  console.log('📄 [handleUploadDocument] ═══ FUNCTION START ═══');
  console.log('═'.repeat(60));
  console.log('⏰ [handleUploadDocument] Timestamp:', new Date().toISOString());
  console.log('📋 [handleUploadDocument] Current document state:', JSON.stringify(newDocument, null, 2));
  console.log('─'.repeat(60));

  // Field validation with logging
  console.log('🔍 [handleUploadDocument] Field-by-field inspection:');
  console.log('   • title:', newDocument.title, '| Length:', newDocument.title?.length || 0);
  console.log('   • caseId:', newDocument.caseId || 'Not provided (optional)');
  console.log('   • file:', newDocument.file ? {
    name: newDocument.file.name,
    size: `${(newDocument.file.size / 1024).toFixed(2)} KB`,
    type: newDocument.file.type,
    lastModified: new Date(newDocument.file.lastModified).toISOString()
  } : 'No file selected');
  console.log('   • description:', newDocument.description, '| Length:', newDocument.description?.length || 0);
  console.log('─'.repeat(60));

  // Validation
  if (!newDocument.title || !newDocument.file) {
    console.warn('⚠️' + '═'.repeat(58));
    console.warn('⚠️  VALIDATION FAILED - MISSING REQUIRED FIELDS');
    console.warn('⚠️' + '═'.repeat(58));
    
    const missingFields = [];
    if (!newDocument.title) missingFields.push('Document Title');
    if (!newDocument.file) missingFields.push('File');
    
    console.error('❌ [handleUploadDocument] Missing fields:', missingFields.join(', '));
    alert('Please fill in all required fields and select a file');
    console.log('🔙 [handleUploadDocument] Returning due to validation failure\n');
    return;
  }

  console.log('✅ [handleUploadDocument] ═══ VALIDATION PASSED ═══');
  console.log('─'.repeat(60));

  setLoading(true);
  console.log('⏳ [handleUploadDocument] Loading state set to TRUE');
  
  try {
    console.log('📦 [handleUploadDocument] ═══ PREPARING FORM DATA ═══');
    
    const formData = new FormData();
    formData.append('title', newDocument.title);
    formData.append('description', newDocument.description);
    formData.append('file', newDocument.file);
    if (newDocument.caseId) {
      formData.append('caseId', newDocument.caseId);
    }

    console.log('📋 [handleUploadDocument] FormData prepared:');
    console.log('   ├─ title:', newDocument.title);
    console.log('   ├─ description:', newDocument.description || '(empty)');
    console.log('   ├─ file:', newDocument.file.name, '|', `${(newDocument.file.size / 1024).toFixed(2)} KB`);
    console.log('   └─ caseId:', newDocument.caseId || 'Not linked to case');
    console.log('─'.repeat(60));

    // Log FormData entries
    console.log('📊 [handleUploadDocument] FormData entries:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`   • ${pair[0]}: [File] ${pair[1].name}`);
      } else {
        console.log(`   • ${pair[0]}: ${pair[1]}`);
      }
    }
    console.log('─'.repeat(60));

    const apiUrl = `${API_BASE_URL}/new-document`;
    console.log('🌐 [handleUploadDocument] ═══ API REQUEST DETAILS ═══');
    console.log('🔗 [handleUploadDocument] Full URL:', apiUrl);
    console.log('📡 [handleUploadDocument] HTTP Method: POST');
    console.log('📋 [handleUploadDocument] Content-Type: multipart/form-data');
    console.log('⏱️ [handleUploadDocument] Starting API call...');
    console.time('[handleUploadDocument] API call duration');
    
    const requestStartTime = performance.now();
    console.log('⏰ [handleUploadDocument] Request start time:', requestStartTime.toFixed(2), 'ms');

    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const requestEndTime = performance.now();
    const requestDuration = requestEndTime - requestStartTime;
    
    console.timeEnd('[handleUploadDocument] API call duration');
    console.log('⏱️ [handleUploadDocument] Request completed in:', requestDuration.toFixed(2), 'ms');
    console.log('─'.repeat(60));

    console.log('📦 [handleUploadDocument] ═══ RESPONSE RECEIVED ═══');
    console.log('✅ [handleUploadDocument] Response status:', response.status, response.statusText);
    console.log('📊 [handleUploadDocument] Response headers:', response.headers);
    console.log('📄 [handleUploadDocument] Full response data:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('─'.repeat(60));

    if (response.data.success) {
      console.log('✅' + '═'.repeat(58));
      console.log('✅  SUCCESS - DOCUMENT UPLOADED!');
      console.log('✅' + '═'.repeat(58));
      console.log('🎉 [handleUploadDocument] Document upload successful!');
      console.log('🆔 [handleUploadDocument] Document ID:', response.data.data?._id);
      console.log('📄 [handleUploadDocument] Document title:', response.data.data?.title);
      console.log('📁 [handleUploadDocument] File URL:', response.data.data?.fileUrl);
      console.log('📊 [handleUploadDocument] Complete uploaded document data:');
      console.log(JSON.stringify(response.data.data, null, 2));
      console.log('─'.repeat(60));

      alert('✅ Document uploaded successfully!');
      
      console.log('🔄 [handleUploadDocument] Resetting form fields...');
      setNewDocument({
        title: '',
        caseId: '',
        file: null,
        description: ''
      });
      console.log('✅ [handleUploadDocument] Form reset complete');
      
      console.log('👁️ [handleUploadDocument] Closing modal...');
      setShowUploadDocModal(false);
      console.log('✅ [handleUploadDocument] Modal closed');
      
      // Refresh party if viewing
      if (selectedParty) {
        console.log('🔄 [handleUploadDocument] Refreshing party view...');
        console.log('🆔 [handleUploadDocument] Selected party:', selectedParty.name, '|', selectedParty._id);
        handleViewParty(selectedParty);
        console.log('✅ [handleUploadDocument] Party view refreshed');
      }
    }
    
  } catch (error) {
    console.error('\n' + '❌'.repeat(30));
    console.error('❌  ERROR OCCURRED IN handleUploadDocument');
    console.error('❌'.repeat(30));
    console.error('💥 [handleUploadDocument] Exception caught');
    console.error('⏰ [handleUploadDocument] Error time:', new Date().toISOString());
    console.error('─'.repeat(60));
    
    console.error('📊 [handleUploadDocument] Error type:', error.constructor.name);
    console.error('💬 [handleUploadDocument] Error message:', error.message);
    console.error('📚 [handleUploadDocument] Error stack:', error.stack);
    console.error('─'.repeat(60));
    
    if (error.response) {
      console.error('🔴 [handleUploadDocument] Server error response');
      console.error('📊 [handleUploadDocument] Response status:', error.response.status, error.response.statusText);
      console.error('📄 [handleUploadDocument] Response data:', error.response.data);
      console.error('💬 [handleUploadDocument] Server message:', error.response.data?.message);
      
      const errorMessage = error.response.data?.message || 'Failed to upload document';
      alert('❌ Error: ' + errorMessage);
      
    } else if (error.request) {
      console.error('📡 [handleUploadDocument] No response from server');
      console.error('🌐 [handleUploadDocument] Request object:', error.request);
      alert('❌ No response from server. Please check your connection.');
      
    } else {
      console.error('⚙️ [handleUploadDocument] Request setup error');
      console.error('💬 [handleUploadDocument] Error:', error.message);
      alert('❌ Failed to upload document: ' + error.message);
    }
    
  } finally {
    console.log('\n' + '🏁'.repeat(30));
    console.log('🏁  FINALLY BLOCK EXECUTED');
    console.log('🏁'.repeat(30));
    setLoading(false);
    console.log('✅ [handleUploadDocument] Loading state set to FALSE');
    console.log('⏰ [handleUploadDocument] End time:', new Date().toISOString());
    console.log('═'.repeat(60));
    console.log('🎬 [handleUploadDocument] ═══ FUNCTION END ═══');
    console.log('═'.repeat(60) + '\n\n');
  }
};

  // Helper functions
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Individual': return <UserIcon className="w-6 h-6" />;
      case 'Company': return <Building className="w-6 h-6" />;
      case 'Government': return <Users className="w-6 h-6" />;
      default: return <UserIcon className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Individual': return colors.success;
      case 'Company': return colors.gold;
      case 'Government': return colors.navy;
      default: return colors.gray;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return colors.success;
      case 'Pending': return colors.gold;
      case 'Closed':
      case 'Inactive': return colors.gray;
      default: return colors.gray;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Active': return `${colors.success}15`;
      case 'Pending': return `${colors.gold}15`;
      case 'Closed':
      case 'Inactive': return `${colors.gray}15`;
      default: return `${colors.gray}15`;
    }
  };

  return (
    <div className="min-h-screen lg:ml-60 pt-16 lg:pt-0 p-4 lg:p-6" style={{ backgroundColor: colors.cream }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: colors.navy }}>
            Legal Reference Library
          </h1>
          <p className="text-base lg:text-lg" style={{ color: colors.gray }}>
            Reference library of parties and documents for easy linking to cases
          </p>
           {/* <GeneralPartyDetails /> */}
        </div>

        {/* Parties Directory Section */}
        <div 
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{ borderTop: `4px solid ${colors.gold}` }}
        >
          {/* Tab Header */}
          <div 
            className="px-4 lg:px-6 py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ backgroundColor: `${colors.gold}10` }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.gold }}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold" style={{ color: colors.navy }}>
                  Parties Directory
                </h2>
                <p className="text-xs lg:text-sm" style={{ color: colors.gray }}>
                  {filteredParties.length} {filteredParties.length === 1 ? 'party' : 'parties'} found
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddPartyModal(true)}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: colors.gold }}
            >
              <Plus className="w-5 h-5" />
              Add Party
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="p-4 border-b flex flex-col md:flex-row gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: colors.gray }} />
              <input
                type="text"
                placeholder="Search by name or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: colors.gray + '40' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" style={{ color: colors.gray }} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-auto px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: colors.gray + '40' }}
              >
                <option value="All">All Types</option>
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
                <option value="Government">Government</option>
              </select>
            </div>
          </div>

          {/* Parties Table - Responsive */}
          <div className="overflow-x-auto">
            {loading && parties.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.gold }}></div>
                  <p style={{ color: colors.gray }}>Loading parties...</p>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-[640px]">
                <thead style={{ backgroundColor: `${colors.navy}05` }}>
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-semibold" style={{ color: colors.navy }}>Party Name</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-semibold" style={{ color: colors.navy }}>Type</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-semibold hidden md:table-cell" style={{ color: colors.navy }}>Contact</th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs lg:text-sm font-semibold" style={{ color: colors.navy }}>Cases</th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs lg:text-sm font-semibold" style={{ color: colors.navy }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParties.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Users className="w-12 lg:w-16 h-12 lg:h-16 mx-auto mb-4 opacity-20" style={{ color: colors.gray }} />
                        <p className="text-base lg:text-lg font-medium" style={{ color: colors.gray }}>No parties found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredParties.map((party) => (
                      <tr key={party._id || party.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div 
                              className="w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: getTypeColor(party.type) + '20' }}
                            >
                              {React.cloneElement(getTypeIcon(party.type), { 
                                className: 'w-4 lg:w-5 h-4 lg:h-5',
                                style: { color: getTypeColor(party.type) } 
                              })}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm lg:text-base truncate" style={{ color: colors.navy }}>{party.name}</p>
                              <p className="text-xs hidden lg:block" style={{ color: colors.gray }}>
                                Added: {new Date(party.addedDate || party.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span 
                            className="px-2 lg:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                            style={{
                              backgroundColor: getTypeColor(party.type) + '20',
                              color: getTypeColor(party.type)
                            }}
                          >
                            {party.type}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs lg:text-sm">
                              <Mail className="w-3 lg:w-4 h-3 lg:h-4 flex-shrink-0" style={{ color: colors.gray }} />
                              <span className="truncate max-w-[200px]" style={{ color: colors.navy }}>{party.email || party.contact}</span>
                            </div>
                            {party.phone && (
                              <div className="flex items-center gap-2 text-xs lg:text-sm">
                                <Phone className="w-3 lg:w-4 h-3 lg:h-4 flex-shrink-0" style={{ color: colors.gray }} />
                                <span style={{ color: colors.navy }}>{party.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-center">
                          <div 
                            className="inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full"
                            style={{ backgroundColor: colors.gold + '20', color: colors.gold }}
                          >
                            <FileText className="w-3 lg:w-4 h-3 lg:h-4" />
                            <span className="font-semibold text-xs lg:text-sm">{party.linkedCases || 0}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <div className="flex items-center justify-center gap-1 lg:gap-2">
                            <button
                              onClick={() => handleViewParty(party)}
                              disabled={loading}
                              className="p-1.5 lg:p-2 rounded-lg transition-colors hover:bg-blue-50 disabled:opacity-50"
                              title="View Details"
                              style={{ color: colors.navy }}
                            >
                              <Eye className="w-3.5 lg:w-4 h-3.5 lg:h-4" />
                            </button>
                            {/* <button
                              className="p-1.5 lg:p-2 rounded-lg transition-colors hover:bg-green-50"
                              title="Edit Party"
                              style={{ color: colors.success }}
                            >
                              <Edit2 className="w-3.5 lg:w-4 h-3.5 lg:h-4" />
                            </button> */}
                            <button
                              onClick={() => handleDeleteParty(party._id || party.id)}
                              disabled={loading}
                              className="p-1.5 lg:p-2 rounded-lg transition-colors hover:bg-red-50 disabled:opacity-50"
                              title="Delete Party"
                              style={{ color: colors.danger }}
                            >
                              <Trash2 className="w-3.5 lg:w-4 h-3.5 lg:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ADD PARTY MODAL */}
       {showAddPartyModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div 
      className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
      style={{ maxHeight: '90vh' }}
    >
      <div 
        className="px-4 lg:px-6 py-4 flex items-center justify-between border-b"
        style={{ backgroundColor: `${colors.golden}10` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.golden }}
          >
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg lg:text-xl font-bold" style={{ color: colors.navy }}>Add New Party</h3>
        </div>
        <button
          onClick={() => {
            setShowAddPartyModal(false);
            setUploadedPanCard(null);
            setUploadedAadhaar(null);
          }}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" style={{ color: colors.gray }} />
        </button>
      </div>

      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Party Name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Party Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newParty.partyName}
              onChange={(e) => {
                console.log('✏️ [Input] Party Name:', e.target.value);
                setNewParty({ ...newParty, partyName: e.target.value });
              }}
              placeholder="Party name"
              required
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: colors.gray + '40' }}
            />
          </div>

          {/* Email ID */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={newParty.email}
              onChange={(e) => {
                console.log('✏️ [Input] Email ID:', e.target.value);
                setNewParty({ ...newParty, email: e.target.value });
              }}
              placeholder="Email ID"
              required
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: colors.gray + '40' }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={newParty.phone}
              onChange={(e) => {
                console.log('✏️ [Input] Phone:', e.target.value);
                setNewParty({ ...newParty, phone: e.target.value });
              }}
              placeholder="Phone number"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: colors.gray + '40' }}
            />
          </div>

          {/* Case Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Case <span className="text-red-500">*</span>
            </label>
            <select
              value={newParty.case}
              onChange={(e) => {
                console.log('✏️ [Select] Case:', e.target.value);
                setNewParty({ ...newParty, case: e.target.value });
              }}
              required
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: colors.gray + '40' }}
            >
              {/* Replace with your case options array */}
              {caseOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Court */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Court
            </label>
            <input
              type="text"
              value={newParty.court}
              onChange={(e) => setNewParty({ ...newParty, court: e.target.value })}
              placeholder="Court"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: colors.gray + '40' }}
            />
          </div>

          {/* Filing Date */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Filing Date
            </label>
            <input
              type="date"
              value={newParty.filingDate}
              onChange={(e) => setNewParty({ ...newParty, filingDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: colors.gray + '40' }}
            />
          </div>

          {/* Next Hearing Date */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Next Hearing Date
            </label>
            <input
              type="date"
              value={newParty.nextHearingDate}
              onChange={(e) => setNewParty({ ...newParty, nextHearingDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
              style={{ borderColor: colors.gray + '40' }}
            />
          </div>

          {/* Description - full width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Description
            </label>
            <textarea
              value={newParty.description}
              onChange={(e) => setNewParty({ ...newParty, description: e.target.value })}
              placeholder="Description (optional)"
              rows="4"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm resize-none"
              style={{ borderColor: colors.gray + '40' }}
            />
          </div>

          {/* Party Type Dropdown - full width */}
         <div className="col-span-1 md:col-span-2">

            <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
              Party Type
            </label>
            <select
  value={newParty.partyType}
  onChange={(e) => setNewParty({...newParty, partyType: e.target.value})}
  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
  style={{ borderColor: colors.gray + '40', minWidth: '150px' }} // set a minimum width if needed
>
  <option value="">Select Party Type</option>
  <option value="Individual">Individual</option>
  <option value="Company">Company</option>
  <option value="Government">Government</option>
</select>

          </div>
        </div>
      </div>

      <div
        className="px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t"
        style={{ backgroundColor: colors.cream }}
      >
        <button
          onClick={() => {
            setShowAddPartyModal(false);
            setUploadedPanCard(null);
            setUploadedAadhaar(null);
          }}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition-colors text-sm disabled:opacity-50"
          style={{ backgroundColor: colors.gray + '20', color: colors.navy }}
        >
          Cancel
        </button>
        <button
          onClick={handleAddParty}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg text-sm disabled:opacity-50"
          style={{ backgroundColor: colors.golden }}
        >
          {loading ? 'Adding...' : 'Add Party'}
        </button>
      </div>
    </div>
  </div>
)}


      {/* VIEW PARTY MODAL WITH ID UPLOAD DISPLAY + NEW CASE & DOCUMENT MODALS */}
        {selectedParty && !showCommunicationHub && !showInsights && (
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
                    {getTypeIcon(selectedParty.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: colors.navy }}>{selectedParty.name}</h2>
                    {selectedParty.company && (
                      <p className="text-lg" style={{ color: colors.gray }}>{selectedParty.company}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: getStatusBgColor(selectedParty.status),
                          color: getStatusColor(selectedParty.status)
                        }}
                      >
                        {selectedParty.status || 'Active'}
                      </span>
                      <div className="flex items-center gap-1">
                        {/* {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < (selectedParty.rating || 0) ? 'fill-current' : ''}`}
                            style={{ color: i < (selectedParty.rating || 0) ? colors.amber : colors.gray + '40' }}
                          />
                        ))} */}
                        <span className="text-sm ml-1" style={{ color: colors.gray }}>{selectedParty.rating || 0}.0</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedParty(null)}
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
              <div className="flex gap-1 p-6 pb-0 flex-wrap">
                {[
                  { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
                  { id: 'cases', label: 'Cases', icon: <FileText className="w-4 h-4" /> },
                  { id: 'documents', label: 'Documents', icon: <Upload className="w-4 h-4" /> },
                  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> }
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
    {/* Top Grid - Contact Info, ID Proofs, and Stats */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN - Contact Information */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 flex-shrink-0" style={{ color: colors.golden }} />
            <span className="text-sm truncate" style={{ color: colors.gray }}>{selectedParty.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 flex-shrink-0" style={{ color: colors.golden }} />
            <span className="text-sm" style={{ color: colors.gray }}>{selectedParty.phone}</span>
          </div>
          {/* <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.golden }} />
            <span className="text-sm" style={{ color: colors.gray }}>{selectedParty.address}</span>
          </div> */}
        </div>
      </div>

      {/* MIDDLE COLUMN - ID Verification (Compact) */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>ID Verification</h3>
        <div className="space-y-2">
          {/* PAN Card - Compact */}
          <div className="p-2 rounded-lg" style={{
            background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`,
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm" style={{ color: colors.navy }}>PAN Card</div>
                  <div className="text-xs truncate" style={{ color: colors.gray }}>
                    {selectedParty.panNumber || 'Not provided'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => viewPanUploadRef.current?.click()}
                className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
                style={{ backgroundColor: colors.golden + '20', color: colors.golden }}
              >
                <Upload className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Aadhaar Card - Compact */}
          <div className="p-2 rounded-lg" style={{
            background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`,
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm" style={{ color: colors.navy }}>Aadhaar Card</div>
                  <div className="text-xs truncate" style={{ color: colors.gray }}>
                    {selectedParty.aadhaarNumber || 'Not provided'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => viewAadhaarUploadRef.current?.click()}
                className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
                style={{ backgroundColor: colors.golden + '20', color: colors.golden }}
              >
                <Upload className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Hidden file inputs */}
          <input
            ref={viewPanUploadRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleViewIdUpload('pan', file);
            }}
          />
          <input
            ref={viewAadhaarUploadRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleViewIdUpload('aadhaar', file);
            }}
          />
        </div>
      </div>

      {/* RIGHT COLUMN - Quick Stats */}
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.navy }}>Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg" style={{ background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.10)` }}>
            <div className="text-xl font-bold" style={{ color: colors.blue }}>{selectedParty.totalCases || 0}</div>
            <div className="text-xs" style={{ color: colors.gray }}>Total Cases</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.10)` }}>
            <div className="text-xl font-bold" style={{ color: colors.green }}>{selectedParty.activeCases || 0}</div>
            <div className="text-xs" style={{ color: colors.gray }}>Active</div>
          </div>
          <div className="col-span-2 text-center p-3 rounded-lg" style={{ 
            background: `rgba(${parseInt(colors.amber.slice(1, 3), 16)}, ${parseInt(colors.amber.slice(3, 5), 16)}, ${parseInt(colors.amber.slice(5, 7), 16)}, 0.10)` 
          }}>
            <div className="text-2xl font-bold" style={{ color: selectedParty.outstandingDues > 0 ? colors.amber : colors.green }}>
              ₹{(selectedParty.outstandingDues || 0).toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: colors.gray }}>Outstanding</div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Section - Cases Preview */}
    {/* <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Recent Cases</h3>
        <button
          onClick={() => setActiveTab('cases')}
          className="text-xs px-3 py-1 rounded-lg font-medium"
          style={{ backgroundColor: colors.golden + '20', color: colors.golden }}
        >
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
        {(selectedParty.linkedCases?.length > 0 || selectedParty.cases?.length > 0) ? (
          (selectedParty.linkedCases || selectedParty.cases).slice(0, 4).map((caseItem, index) => (
            <div
              key={index}
              className="p-3 rounded-lg"
              style={{
                background: `rgba(255, 255, 255, 0.03)`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate" style={{ color: colors.navy }}>
                    {caseItem.caseNumber || caseItem.id}
                  </h4>
                  <p className="text-xs truncate" style={{ color: colors.gray }}>
                    {caseItem.caseTitle || caseItem.title}
                  </p>
                </div>
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2"
                  style={{ 
                    backgroundColor: getStatusBgColor(caseItem.status),
                    color: getStatusColor(caseItem.status)
                  }}
                >
                  {caseItem.status}
                </span>
              </div>
              {caseItem.court && (
                <div className="flex items-center gap-1 mt-1">
                  <Building className="w-3 h-3" style={{ color: colors.golden }} />
                  <p className="text-xs truncate" style={{ color: colors.gray }}>{caseItem.court}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center py-4 text-sm" style={{ color: colors.gray }}>No cases found</p>
        )}
      </div>
    </div> */}

    {/* Notes Section */}
    {/* <div>
      <h3 className="text-lg font-semibold mb-3" style={{ color: colors.navy }}>Notes</h3>
      <div className="p-4 rounded-lg max-h-32 overflow-y-auto" style={{
        background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`,
        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
      }}>
        <p className="text-sm" style={{ color: colors.gray }}>{selectedParty.notes || 'No notes available'}</p>
      </div>
    </div> */}
  </div>
)}


                {/* CASES TAB WITH NEW CASE BUTTON */}
                {activeTab === 'cases' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Associated Cases</h3>
                      <button 
                        onClick={() => setShowAddCaseModal(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white flex items-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        New Case
                      </button>
                    </div>
                    <div className="space-y-3">
                      {selectedParty.linkedCases?.length > 0 || selectedParty.cases?.length > 0 ? (
                        (selectedParty.linkedCases || selectedParty.cases || []).map((caseItem, index) => (
                          <div key={index} className="flex justify-between items-center p-4 rounded-lg" style={{
                            background: `rgba(255, 255, 255, 0.03)`,
                            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                          }}>
                            <div>
                              <h4 className="font-medium" style={{ color: colors.navy }}>{caseItem.caseNumber || caseItem.id}</h4>
                              <p className="text-sm" style={{ color: colors.gray }}>{caseItem.caseTitle || caseItem.title}</p>
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
                        ))
                      ) : (
                        <p className="text-center py-8" style={{ color: colors.gray }}>No cases found</p>
                      )}
                    </div>
                  </div>
                )}

                {/* DOCUMENTS TAB WITH UPLOAD BUTTON */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Document Repository</h3>
                      <button 
                        onClick={() => setShowUploadDocModal(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white flex items-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                        }}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Document
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedParty.documents?.length > 0 ? (
                        selectedParty.documents.map((doc, index) => (
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
                        ))
                      ) : (
                        <p className="col-span-2 text-center py-8" style={{ color: colors.gray }}>No documents found</p>
                      )}
                    </div>
                  </div>
                )}

       {activeTab === 'payments' && (
  <div className="space-y-4">
    {/* Header with Outstanding Amount */}
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Payment History</h3>
      <div className="text-right">
        <div className="text-sm" style={{ color: colors.gray }}>Outstanding Amount</div>
        <div className="text-xl font-bold" style={{ 
          color: (selectedParty.outstandingDues || 0) > 0 ? colors.amber : colors.green 
        }}>
          ₹{(selectedParty.outstandingDues || 0).toLocaleString()}
        </div>
      </div>
    </div>

    {/* Add Payment Button */}
    <div className="flex justify-end">
      <button
        onClick={() => setShowAddPaymentModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: colors.gold }}
      >
        <Plus size={18} />
        Add Payment
      </button>
    </div>

    {/* Payment History List */}
    <div className="space-y-3">
      {selectedParty.paymentHistory?.length > 0 ? (
        selectedParty.paymentHistory.map((payment, index) => {
          // Calculate if payment is overdue
          const dueDate = new Date(payment.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          dueDate.setHours(0, 0, 0, 0);
          
          const isOverdue = payment.status === 'Pending' && dueDate < today;
          const daysPastDue = isOverdue ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)) : 0;

          return (
            <div 
              key={payment._id || index} 
              className="p-4 rounded-lg space-y-3" 
              style={{
                background: isOverdue 
                  ? `rgba(239, 68, 68, 0.05)` 
                  : `rgba(255, 255, 255, 0.03)`,
                border: isOverdue
                  ? `1px solid ${colors.danger}40`
                  : `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
              }}
            >
              {/* Header Row */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-lg" style={{ color: colors.navy }}>
                      ₹{payment.amount.toLocaleString()}
                    </h4>
                    {isOverdue && (
                      <span 
                        className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                        style={{ 
                          backgroundColor: `${colors.danger}15`,
                          color: colors.danger
                        }}
                      >
                        <AlertCircle size={12} />
                        Overdue ({daysPastDue} days)
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm" style={{ color: colors.gray }}>
                    <span className="flex items-center gap-1">
                      <CreditCard size={14} />
                      {payment.method}
                    </span>
                    <span>•</span>
                    <span>{payment.invoice}</span>
                  </div>
                </div>

                {/* Status Badge/Button */}
                <div>
                  {payment.status === 'Completed' ? (
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                      style={{ 
                        backgroundColor: `${colors.green}15`,
                        color: colors.green
                      }}
                    >
                      <CheckCircle size={14} />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkPaymentComplete(payment._id || index)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ 
                        backgroundColor: isOverdue ? `${colors.danger}20` : `${colors.amber}20`,
                        color: isOverdue ? colors.danger : colors.amber,
                        border: `1px solid ${isOverdue ? colors.danger : colors.amber}40`
                      }}
                    >
                      <Clock size={14} />
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>

              {/* Dates Row */}
              <div className="flex items-center gap-4 text-sm" style={{ color: colors.gray }}>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Due: {new Date(payment.dueDate).toLocaleDateString('en-IN')}</span>
                </div>
                {payment.paidDate && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={14} />
                      <span>Paid: {new Date(payment.paidDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Notes Section */}
              {payment.notes && (
                <div 
                  className="p-3 rounded text-sm"
                  style={{ 
                    backgroundColor: `rgba(${parseInt(colors.navy.slice(1, 3), 16)}, ${parseInt(colors.navy.slice(3, 5), 16)}, ${parseInt(colors.navy.slice(5, 7), 16)}, 0.05)`,
                    color: colors.navy
                  }}
                >
                  <div className="flex items-start gap-2">
                    <FileText size={14} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-xs mb-1" style={{ color: colors.gray }}>Notes:</div>
                      <div>{payment.notes}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Overdue Warning */}
              {isOverdue && (
                <div 
                  className="p-3 rounded text-sm flex items-start gap-2"
                  style={{ 
                    backgroundColor: `${colors.danger}10`,
                    border: `1px solid ${colors.danger}30`,
                    color: colors.danger
                  }}
                >
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Payment Overdue</div>
                    <div className="text-xs mt-1">
                      This payment was due on {new Date(payment.dueDate).toLocaleDateString('en-IN')} 
                      ({daysPastDue} days ago)
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: colors.gray }} />
          <p className="text-base font-medium" style={{ color: colors.gray }}>
            No payment history found
          </p>
          <p className="text-sm mt-2" style={{ color: colors.gray }}>
            Add a payment to get started
          </p>
        </div>
      )}
    </div>

    {/* Add Payment Modal */}
    {showAddPaymentModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={() => setShowAddPaymentModal(false)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            className="px-6 py-4 flex items-center justify-between border-b"
            style={{ backgroundColor: `${colors.golden}10` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.golden }}
              >
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold" style={{ color: colors.navy }}>
                Add Payment Record
              </h3>
            </div>
            <button
              onClick={() => setShowAddPaymentModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: colors.gray }} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold" style={{ color: colors.gray }}>
                  ₹
                </span>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: colors.gray + '40' }}
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newPayment.dueDate}
                onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: colors.gray + '40' }}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: colors.gray + '40' }}
              >
                <option value="">Select method</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                Invoice Number
              </label>
              <input
                type="text"
                value={newPayment.invoice}
                onChange={(e) => setNewPayment({ ...newPayment, invoice: e.target.value })}
                placeholder="Enter invoice number"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: colors.gray + '40' }}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                Notes
              </label>
              <textarea
                value={newPayment.notes}
                onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                placeholder="Additional notes (optional)"
                rows="3"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm resize-none"
                style={{ borderColor: colors.gray + '40' }}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className="px-6 py-4 flex items-center justify-end gap-3 border-t"
            style={{ backgroundColor: colors.cream }}
          >
            <button
              onClick={() => {
                setShowAddPaymentModal(false);
                setNewPayment({
                  amount: '',
                  dueDate: '',
                  method: '',
                  invoice: '',
                  notes: '',
                });
              }}
              className="px-6 py-2 rounded-lg font-semibold text-sm"
              style={{ backgroundColor: colors.gray + '20', color: colors.navy }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddPayment}
              disabled={!newPayment.amount || !newPayment.dueDate || !newPayment.method}
              className="px-6 py-2 rounded-lg font-semibold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.golden }}
            >
              Add Payment
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}


              </div>

              {/* Modal Footer */}
              <div 
                className="px-6 py-4 border-t flex items-center justify-end gap-2"
                style={{ 
                  backgroundColor: colors.cream,
                  borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}
              >
                {/* <button 
                  className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                  }}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  View Client Profile
                </button>
                 */}
                {/* <button 
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, 0.10)`,
                    color: colors.blue,
                    border: `1px solid rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.20)`
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                </button> */}
              </div>
            </div>
          </div>
        )}

        {/* ADD CASE MODAL */}
        {showAddCaseModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden" style={{ maxHeight: '90vh' }}>
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ backgroundColor: `${colors.gold}10` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.gold }}>
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: colors.navy }}>Add New Case</h3>
                </div>
                <button onClick={() => setShowAddCaseModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" style={{ color: colors.gray }} />
                </button>
              </div>


              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Case Number <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={newCase.caseNumber}
        onChange={(e) => setNewCase({ ...newCase, caseNumber: e.target.value })}
        placeholder="e.g., CIV/2025/001"
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Case Type <span className="text-red-500">*</span>
      </label>
      <select
        value={newCase.caseType}
        onChange={(e) => setNewCase({ ...newCase, caseType: e.target.value })}
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      >
        <option value="Civil">Civil</option>
        <option value="Criminal">Criminal</option>
        <option value="Family">Family</option>
        <option value="Corporate">Corporate</option>
      </select>
    </div>

   <div className="col-span-1 md:col-span-2">

      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Case Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={newCase.caseTitle}
        onChange={(e) => setNewCase({ ...newCase, caseTitle: e.target.value })}
        placeholder="Brief title of the case"
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Client Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={newCase.clientName}
        onChange={(e) => setNewCase({ ...newCase, clientName: e.target.value })}
        placeholder="Client name"
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Opposing Party <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={newCase.oppositeParty}
        onChange={(e) => setNewCase({ ...newCase, oppositeParty: e.target.value })}
        placeholder="Opposing party name"
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Court <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={newCase.court}
        onChange={(e) => setNewCase({ ...newCase, court: e.target.value })}
        placeholder="Court name"
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Filing Date <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        value={newCase.filingDate}
        onChange={(e) => setNewCase({ ...newCase, filingDate: e.target.value })}
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Next Hearing Date
      </label>
      <input
        type="date"
        value={newCase.nextHearingDate}
        onChange={(e) => setNewCase({ ...newCase, nextHearing: e.target.value })}
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Status
      </label>
      <select
        value={newCase.status}
        onChange={(e) => setNewCase({ ...newCase, status: e.target.value })}
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
        style={{ borderColor: colors.gray + '40' }}
      >
        <option value="Active">Active</option>
        <option value="Pending">Pending</option>
        <option value="Closed">Closed</option>
        <option value="On Hold">On Hold</option>
      </select>
    </div>

  <div className="col-span-1 md:col-span-2">

      <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
        Description
      </label>
      <textarea
        value={newCase.description}
        onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
        placeholder="Case details and notes..."
        rows="4"
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm resize-none"
        style={{ borderColor: colors.gray + '40' }}
      />
    </div>
  </div>
</div>


              <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ backgroundColor: colors.cream }}>
                <button
                  onClick={() => setShowAddCaseModal(false)}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
                  style={{ backgroundColor: colors.gray + '20', color: colors.navy }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCase}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg font-semibold text-white text-sm disabled:opacity-50"
                  style={{ backgroundColor: colors.gold }}
                >
                  {loading ? 'Creating...' : 'Create Case'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD DOCUMENT MODAL */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ backgroundColor: `${colors.gold}10` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.gold }}>
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: colors.navy }}>Upload Document</h3>
                </div>
                <button onClick={() => setShowUploadDocModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" style={{ color: colors.gray }} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                      Document Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newDocument.title}
                      onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                      placeholder="e.g., Contract Agreement, ID Proof, etc."
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      style={{ borderColor: colors.gray + '40' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                      Related Case (Optional)
                    </label>
                    <input
                      type="text"
                      value={newDocument.caseId}
                      onChange={(e) => setNewDocument({ ...newDocument, caseId: e.target.value })}
                      placeholder="Case number or ID"
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      style={{ borderColor: colors.gray + '40' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                      Select File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files[0] })}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      style={{ borderColor: colors.gray + '40' }}
                    />
                    {newDocument.file && (
                      <div className="mt-2 flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: colors.gold + '10' }}>
                        <File className="w-4 h-4" style={{ color: colors.gold }} />
                        <span className="text-sm" style={{ color: colors.navy }}>{newDocument.file.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                      Description
                    </label>
                    <textarea
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                      placeholder="Additional notes about this document..."
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm resize-none"
                      style={{ borderColor: colors.gray + '40' }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ backgroundColor: colors.cream }}>
                <button
                  onClick={() => setShowUploadDocModal(false)}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
                  style={{ backgroundColor: colors.gray + '20', color: colors.navy }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadDocument}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg font-semibold text-white text-sm disabled:opacity-50"
                  style={{ backgroundColor: colors.gold }}
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reports;
