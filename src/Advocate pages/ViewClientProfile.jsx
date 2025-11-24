import React, { useState, useRef, useEffect } from 'react';
import { 
  Star, FileText, CreditCard, Upload, Download, 
  Mail, MapPin, Phone, CheckCircle, Eye, Plus, X, 
  IndianRupee, AlertCircle, Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';

const ViewClientProfile = ({ 
  selectedClient, 
  onClose, 
  colors, 
  getStatusColor, 
  getStatusBgColor, 
  getTypeIcon,
  fileUploadRef,
  handleFileUpload,
  onUpdate // Callback to refresh client data in parent
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [clientData, setClientData] = useState(selectedClient);
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  // Modal states
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showIdUploadModal, setShowIdUploadModal] = useState(false);

  // Form states
  const [newCase, setNewCase] = useState({
    caseNumber: '',
    court: '',
    caseTitle: '',
    clientName: selectedClient?.clientName || '',
    oppositeParty: '',
    caseStatus: 'Active'
  });

  const [newDocument, setNewDocument] = useState({
    file: null,
    name: '',
    category: '',
    linkedCase: '',
    client: selectedClient?.clientName || ''
  });

  const [newPayment, setNewPayment] = useState({
    amount: '',
    method: 'Cash',
    invoice: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Completed',
    notes: ''
  });

  const [idUpload, setIdUpload] = useState({
    type: 'Aadhaar Card',
    file: null,
    number: '',
    verified: false
  });

  const documentUploadRef = useRef(null);
  const idDocUploadRef = useRef(null);

  const API_BASE_URL = 'http://localhost:4000/api';

  // Fetch client data, cases, and documents on mount
  useEffect(() => {
    if (selectedClient?._id) {
      fetchClientDetails();
      fetchClientCases();
      fetchClientDocuments();
    }
  }, [selectedClient?._id]);

  // Fetch updated client details
  const fetchClientDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${selectedClient._id}`);
      const data = await response.json();
      if (data.success) {
        setClientData(data.client);
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  // Fetch cases for this client
const fetchClientCases = async () => { 
  try {
    setLoading(true);

    const response = await fetch(`${API_BASE_URL}/cases?clientName=${encodeURIComponent(selectedClient.clientName)}`);

    const data = await response.json();

    if (data.success) {
      setCases(data.data);
      console.log('✅ Cases fetched and shown successfully:', data.data);
    } else {
      console.error('❌ Failed to fetch cases:', data.message);
    }
  } catch (error) {
    console.error('❌ Error fetching cases:', error);
  } finally {
    setLoading(false);
  }
};

  // Fetch documents for this client
  const fetchClientDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents?client=${encodeURIComponent(selectedClient.clientName)}`);
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    }
  };

  if (!selectedClient) return null;

  // Handle case form submission
  const handleCaseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCase)
      });

      const data = await response.json();
      
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Case Created!',
          text: `${newCase.caseNumber} has been added successfully.`,
          confirmButtonColor: colors.golden
        });

        setShowNewCaseModal(false);
        setNewCase({
          caseNumber: '',
          court: '',
          caseTitle: '',
          clientName: selectedClient?.clientName || '',
          oppositeParty: '',
          caseStatus: 'Active'
        });
        
        // Refresh cases list
        fetchClientCases();
        fetchClientDetails(); // Update case counts
        if (onUpdate) onUpdate();
      } else {
        throw new Error(data.message || 'Failed to create case');
      }
    } catch (error) {
      console.error('Error creating case:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create case. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle document upload submission
  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!newDocument.file) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.'
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', newDocument.file);
      formData.append('name', newDocument.name);
      formData.append('category', newDocument.category);
      formData.append('linkedCase', newDocument.linkedCase);
      formData.append('client', newDocument.client);

      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Document Uploaded!',
          text: `${newDocument.name} has been uploaded successfully.`,
          confirmButtonColor: colors.golden
        });

        setShowUploadDocModal(false);
        setNewDocument({
          file: null,
          name: '',
          category: '',
          linkedCase: '',
          client: selectedClient?.clientName || ''
        });
        
        // Refresh documents list
        fetchClientDocuments();
      } else {
        throw new Error(data.message || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.message || 'Failed to upload document. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${selectedClient._id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment)
      });

      const data = await response.json();
      
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Payment Recorded!',
          text: `Payment of ₹${newPayment.amount} has been recorded.`,
          confirmButtonColor: colors.golden
        });

        setShowPaymentModal(false);
        setNewPayment({
          amount: '',
          method: 'Cash',
          invoice: '',
          date: new Date().toISOString().split('T')[0],
          status: 'Completed',
          notes: ''
        });
        
        // Refresh client data
        fetchClientDetails();
        if (onUpdate) onUpdate();
      } else {
        throw new Error(data.message || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to record payment. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle ID document upload
  const handleIdUpload = async (e) => {
    e.preventDefault();
    if (!idUpload.file) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select an ID document to upload.'
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', idUpload.file);
      formData.append('type', idUpload.type);
      formData.append('number', idUpload.number);
      formData.append('clientId', selectedClient._id);

      const response = await fetch(`${API_BASE_URL}/clients/${selectedClient._id}/id-proof`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'ID Document Uploaded!',
          text: `${idUpload.type} has been uploaded successfully.`,
          confirmButtonColor: colors.golden
        });

        setShowIdUploadModal(false);
        setIdUpload({
          type: 'Aadhaar Card',
          file: null,
          number: '',
          verified: false
        });
        
        // Refresh client data
        fetchClientDetails();
        if (onUpdate) onUpdate();
      } else {
        throw new Error(data.message || 'Failed to upload ID');
      }
    } catch (error) {
      console.error('Error uploading ID:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.message || 'Failed to upload ID document. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle document download
  const handleDocumentDownload = async (documentId, fileName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download document. Please try again.'
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg" 
        style={{
          background: colors.cream,
          border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        }}
      >
        {/* Modal Header */}
        <div 
          className="flex justify-between items-center p-6 border-b" 
          style={{
            borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl" 
              style={{
                background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
              }}
            >
              {getTypeIcon(clientData.clientType)}
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: colors.navy }}>
                {clientData.clientName}
              </h2>
              {clientData.organization && (
                <p className="text-lg" style={{ color: colors.gray }}>
                  {clientData.organization}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: getStatusBgColor(clientData.status),
                    color: getStatusColor(clientData.status)
                  }}
                >
                  {clientData.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
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
              {/* Top Section: Contact Information & ID Verification */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div 
                  className="p-5 rounded-lg" 
                  style={{
                    background: `rgba(255, 255, 255, 0.03)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: colors.navy }}>
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                        }}
                      >
                        <Mail className="w-5 h-5" style={{ color: colors.golden }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: colors.gray }}>Email Address</p>
                        <p className="font-medium" style={{ color: colors.navy }}>{clientData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                        }}
                      >
                        <Phone className="w-5 h-5" style={{ color: colors.golden }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: colors.gray }}>Phone Number</p>
                        <p className="font-medium" style={{ color: colors.navy }}>{clientData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                        }}
                      >
                        <MapPin className="w-5 h-5" style={{ color: colors.golden }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: colors.gray }}>Address</p>
                        <p className="font-medium" style={{ color: colors.navy }}>{clientData.address || `${clientData.city}, ${clientData.state}`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID Verification */}
                <div 
                  className="p-5 rounded-lg" 
                  style={{
                    background: `rgba(255, 255, 255, 0.03)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>
                      ID Verification
                    </h3>
                    <button
                      onClick={() => setShowIdUploadModal(true)}
                      className="px-3 py-1 rounded-lg text-xs font-medium transition-colors text-white"
                      style={{
                        background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                      }}
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Upload ID
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {clientData.idProofs?.length > 0 ? (
                      clientData.idProofs.map((proof, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-lg" 
                          style={{
                            background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.10)`
                              }}
                            >
                              <FileText className="w-5 h-5" style={{ color: colors.blue }} />
                            </div>
                            <div>
                              <div className="font-medium text-sm" style={{ color: colors.navy }}>
                                {proof.type}
                              </div>
                              <div className="text-xs" style={{ color: colors.gray }}>
                                {proof.number}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle 
                              className="w-4 h-4" 
                              style={{ color: proof.verified ? colors.green : colors.gray }} 
                            />
                            <span 
                              className="text-xs" 
                              style={{ color: proof.verified ? colors.green : colors.gray }}
                            >
                              {proof.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div 
                        className="text-center p-6 rounded-lg" 
                        style={{
                          background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
                        }}
                      >
                        <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: colors.gray }} />
                        <p className="text-sm" style={{ color: colors.gray }}>
                          No ID documents uploaded yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    label: 'Total Cases', 
                    value: cases.length || 0, 
                    color: colors.blue,
                    icon: <FileText className="w-5 h-5" />
                  },
                  { 
                    label: 'Active Cases', 
                    value: cases.filter(c => c.caseStatus === 'Active').length || 0, 
                    color: colors.green,
                    icon: <CheckCircle className="w-5 h-5" />
                  },
                  { 
                    label: 'Outstanding', 
                    value: `₹${((clientData.outstandingDues || 0) / 1000).toFixed(0)}K`, 
                    color: (clientData.outstandingDues || 0) > 0 ? colors.amber : colors.green,
                    icon: <IndianRupee className="w-5 h-5" />
                  }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg" 
                    style={{
                      background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.10)`,
                      border: `1px solid rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.20)`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ 
                          background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.20)`,
                          color: stat.color
                        }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-sm mt-1" style={{ color: colors.gray }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.navy }}>
                  Notes
                </h3>
                <div 
                  className="p-4 rounded-lg" 
                  style={{
                    background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                  }}
                >
                  <p style={{ color: colors.gray }}>
                    {clientData.notes || 'No notes available'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>
                  Associated Cases
                </h3>
                <button 
                  onClick={() => setShowNewCaseModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                  }}
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Case
                </button>
              </div>
              <div className="space-y-3">
                {cases.length > 0 ? (
                  cases.map((caseItem, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-4 rounded-lg" 
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}
                    >
                      <div>
                        <h4 className="font-medium" style={{ color: colors.navy }}>
                          {caseItem.caseNumber}
                        </h4>
                        <p className="text-sm" style={{ color: colors.gray }}>
                          {caseItem.caseTitle}
                        </p>
                        <p className="text-xs" style={{ color: colors.gray }}>
                          {caseItem.court}
                        </p>
                      </div>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: getStatusBgColor(caseItem.caseStatus),
                          color: getStatusColor(caseItem.caseStatus)
                        }}
                      >
                        {caseItem.caseStatus}
                      </span>
                    </div>
                  ))
                ) : (
                  <div 
                    className="text-center p-8 rounded-lg" 
                    style={{
                      background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
                    }}
                  >
                    <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: colors.gray }} />
                    <p className="text-sm" style={{ color: colors.gray }}>
                      No cases associated with this client yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>
                  Document Repository
                </h3>
                <button 
                  onClick={() => setShowUploadDocModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                  }}
                  disabled={loading}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Document
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-4 rounded-lg" 
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8" style={{ color: colors.golden }} />
                        <div>
                          <h4 className="font-medium" style={{ color: colors.navy }}>
                            {doc.name}
                          </h4>
                          <p className="text-sm" style={{ color: colors.gray }}>
                            {doc.category} • {new Date(doc.uploadDate || doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDocumentDownload(doc._id, doc.name)}
                        className="p-2 rounded-lg transition-colors" 
                        style={{
                          background: `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.10)`,
                          color: colors.blue
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div 
                    className="col-span-2 text-center p-8 rounded-lg" 
                    style={{
                      background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
                    }}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: colors.gray }} />
                    <p className="text-sm" style={{ color: colors.gray }}>
                      No documents uploaded yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>
                  Payment History
                </h3>
                <div className="flex gap-3 items-center">
                  <div className="text-right">
                    <div className="text-xs" style={{ color: colors.gray }}>
                      Outstanding
                    </div>
                    <div 
                      className="text-lg font-bold" 
                      style={{ 
                        color: (clientData.outstandingDues || 0) > 0 ? colors.amber : colors.green 
                      }}
                    >
                      ₹{(clientData.outstandingDues || 0).toLocaleString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
                    style={{
                      background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                    }}
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Record Payment
                  </button>
                </div>
              </div>

              {(clientData.outstandingDues || 0) > 0 && (
                <div 
                  className="flex items-center gap-3 p-3 rounded-lg" 
                  style={{
                    background: `${colors.amber}15`,
                    border: `1px solid ${colors.amber}40`
                  }}
                >
                  <AlertCircle className="w-5 h-5" style={{ color: colors.amber }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.navy }}>
                      Overdue Payment
                    </p>
                    <p className="text-xs" style={{ color: colors.gray }}>
                      ₹{(clientData.outstandingDues || 0).toLocaleString()} pending
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {clientData.paymentHistory?.length > 0 ? (
                  clientData.paymentHistory.map((payment, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-4 rounded-lg" 
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}
                    >
                      <div>
                        <h4 className="font-medium" style={{ color: colors.navy }}>
                          ₹{payment.amount.toLocaleString()}
                        </h4>
                        <p className="text-sm" style={{ color: colors.gray }}>
                          {payment.method} • {payment.invoice}
                        </p>
                        <p className="text-xs" style={{ color: colors.gray }}>
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
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
                  ))
                ) : (
                  <div 
                    className="text-center p-8 rounded-lg" 
                    style={{
                      background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`
                    }}
                  >
                    <IndianRupee className="w-12 h-12 mx-auto mb-3" style={{ color: colors.gray }} />
                    <p className="text-sm" style={{ color: colors.gray }}>
                      No payment history available
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
          <div 
            className="w-full max-w-lg rounded-lg p-6" 
            style={{ background: colors.cream }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: colors.navy }}>
                Create New Case
              </h3>
              <button onClick={() => setShowNewCaseModal(false)} disabled={loading}>
                <X className="w-5 h-5" style={{ color: colors.gray }} />
              </button>
            </div>

            <form onSubmit={handleCaseSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Case Number"
                value={newCase.caseNumber}
                onChange={(e) => setNewCase({...newCase, caseNumber: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <input
                type="text"
                placeholder="Court"
                value={newCase.court}
                onChange={(e) => setNewCase({...newCase, court: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <input
                type="text"
                placeholder="Case Title"
                value={newCase.caseTitle}
                onChange={(e) => setNewCase({...newCase, caseTitle: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <input
                type="text"
                placeholder="Client Name"
                value={newCase.clientName}
                onChange={(e) => setNewCase({...newCase, clientName: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <input
                type="text"
                placeholder="Opposite Party"
                value={newCase.oppositeParty}
                onChange={(e) => setNewCase({...newCase, oppositeParty: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <select
                value={newCase.caseStatus}
                onChange={(e) => setNewCase({...newCase, caseStatus: e.target.value})}
                className="w-full p-2 rounded border text-sm"
              >
                <option>Active</option>
                <option>Pending</option>
                <option>Closed</option>
                <option>On Hold</option>
              </select>

              <button
                type="submit"
                className="w-full py-2 rounded text-white font-medium"
                style={{
                  background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Case'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadDocModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
          <div 
            className="w-full max-w-lg rounded-lg p-6" 
            style={{ background: colors.cream }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: colors.navy }}>
                Upload Document
              </h3>
              <button onClick={() => setShowUploadDocModal(false)} disabled={loading}>
                <X className="w-5 h-5" style={{ color: colors.gray }} />
              </button>
            </div>

            <form onSubmit={handleDocumentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Select File
                </label>
                <input
                  ref={documentUploadRef}
                  type="file"
                  onChange={(e) => setNewDocument({...newDocument, file: e.target.files[0]})}
                  className="w-full p-2 rounded border text-sm"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  required
                />
                {newDocument.file && (
                  <p className="text-xs mt-1" style={{ color: colors.gray }}>
                    Selected: {newDocument.file.name}
                  </p>
                )}
              </div>

              <input
                type="text"
                placeholder="Document Name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <select
                value={newDocument.category}
                onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              >
                <option value="">Select Category</option>
                <option>Contract</option>
                <option>Affidavit</option>
                <option>Petition</option>
                <option>Evidence</option>
                <option>Court Order</option>
                <option>Other</option>
              </select>

              <input
                type="text"
                placeholder="Link to Case (Case Number)"
                value={newDocument.linkedCase}
                onChange={(e) => setNewDocument({...newDocument, linkedCase: e.target.value})}
                className="w-full p-2 rounded border text-sm"
              />

              <input
                type="text"
                placeholder="Client"
                value={newDocument.client}
                onChange={(e) => setNewDocument({...newDocument, client: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <button
                type="submit"
                className="w-full py-2 rounded text-white font-medium"
                style={{
                  background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                }}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
          <div 
            className="w-full max-w-lg rounded-lg p-6" 
            style={{ background: colors.cream }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: colors.navy }}>
                Record Payment
              </h3>
              <button onClick={() => setShowPaymentModal(false)} disabled={loading}>
                <X className="w-5 h-5" style={{ color: colors.gray }} />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <select
                value={newPayment.method}
                onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                className="w-full p-2 rounded border text-sm"
              >
                <option>Cash</option>
                <option>Cheque</option>
                <option>Bank Transfer</option>
                <option>UPI</option>
                <option>Card</option>
              </select>

              <input
                type="text"
                placeholder="Invoice Number"
                value={newPayment.invoice}
                onChange={(e) => setNewPayment({...newPayment, invoice: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <input
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <select
                value={newPayment.status}
                onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
                className="w-full p-2 rounded border text-sm"
              >
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>

              <textarea
                placeholder="Notes (optional)"
                value={newPayment.notes}
                onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                rows="3"
              />

              <button
                type="submit"
                className="w-full py-2 rounded text-white font-medium"
                style={{
                  background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                }}
                disabled={loading}
              >
                {loading ? 'Recording...' : 'Record Payment'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ID Document Upload Modal */}
      {showIdUploadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
          <div 
            className="w-full max-w-lg rounded-lg p-6" 
            style={{ background: colors.cream }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: colors.navy }}>
                Upload ID Document
              </h3>
              <button onClick={() => setShowIdUploadModal(false)} disabled={loading}>
                <X className="w-5 h-5" style={{ color: colors.gray }} />
              </button>
            </div>

            <form onSubmit={handleIdUpload} className="space-y-4">
              <select
                value={idUpload.type}
                onChange={(e) => setIdUpload({...idUpload, type: e.target.value})}
                className="w-full p-2 rounded border text-sm"
              >
                <option>Aadhaar Card</option>
                <option>PAN Card</option>
                <option>Passport</option>
                <option>Driving License</option>
                <option>Voter ID</option>
              </select>

              <input
                type="text"
                placeholder="ID Number"
                value={idUpload.number}
                onChange={(e) => setIdUpload({...idUpload, number: e.target.value})}
                className="w-full p-2 rounded border text-sm"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.navy }}>
                  Upload Document
                </label>
                <input
                  ref={idDocUploadRef}
                  type="file"
                  onChange={(e) => setIdUpload({...idUpload, file: e.target.files[0]})}
                  className="w-full p-2 rounded border text-sm"
                  accept=".pdf,.jpg,.png"
                  required
                />
                {idUpload.file && (
                  <p className="text-xs mt-1" style={{ color: colors.gray }}>
                    Selected: {idUpload.file.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded text-white font-medium"
                style={{
                  background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                }}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload ID Document'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewClientProfile;
