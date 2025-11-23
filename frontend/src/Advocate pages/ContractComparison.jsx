import axios from "axios";
import { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  X,
  Loader,
  Eye,
  FileCheck,
  Scale,
  BookOpen,
  Search,
  Clock,
  Shield,
  GitCompare
} from 'lucide-react';

// N8N Webhook URLs
const WEBHOOK_URLS = {
  // contractComparison: "https://n8n.srv983857.hstgr.cloud/webhook/620edd24-93aa-4567-b5d5-94caf2a5574d",
  contractComparison: "https://n8n.srv983857.hstgr.cloud/webhook/a027ab82-e53c-4246-9982-c41c79ac9bca",
  riskAnalysis: "https://n8n.srv983857.hstgr.cloud/webhook/32c4f30e-6722-4125-bd7d-691f0e9460e4",
  documentSummarizer: "https://n8n.srv983857.hstgr.cloud/webhook/12ac51e5-e395-4c18-b5f9-ddd9516e6ed3",
  authenticityChecker: "https://n8n.srv983857.hstgr.cloud/webhook/ec8123eb-cee8-4ca3-a941-d499ed3f024d",
  complianceGenerator: "https://n8n.srv983857.hstgr.cloud/webhook/compliance"
};

// Enhanced webhook connectivity test
const testWebhookConnectivity = async (url, name) => {
  try {
    console.log(`🧪 Testing webhook connectivity for ${name}...`);
    const response = await axios.post(url, { 
      test: true,
      timestamp: new Date().toISOString()
    }, { 
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`✅ ${name} webhook is reachable:`, response.status);
    return { status: true, message: `✅ ${name} operational` };
  } catch (error) {
    console.error(`❌ ${name} webhook connection failed:`, error.message);
    
    let errorMessage = `❌ ${name}: `;
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage += "Workflow not active or URL incorrect";
      } else {
        errorMessage += `Server error (${error.response.status})`;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage += "Request timeout";
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage += "Network connection failed";
    } else {
      errorMessage += error.message;
    }
    
    return { status: false, message: errorMessage };
  }
};

function ContractComparison() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [singleFile, setSingleFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('comparison');
  const [notifications, setNotifications] = useState([]);
  const [webhookStatus, setWebhookStatus] = useState({});
  const [complianceData, setComplianceData] = useState({
    regulation: '',
    country: 'INDIA',
    companyType: ''
  });

  const file1Ref = useRef();
  const file2Ref = useRef();
  const singleFileRef = useRef();

  // Professional notification system
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Test all webhooks function
  const testAllWebhooks = async () => {
    addNotification('Testing webhook connectivity...', 'info');
    const status = {};
    
    for (const [key, url] of Object.entries(WEBHOOK_URLS)) {
      const result = await testWebhookConnectivity(url, key);
      status[key] = result;
    }
    
    setWebhookStatus(status);
    
    const workingWebhooks = Object.values(status).filter(s => s.status).length;
    const totalWebhooks = Object.keys(status).length;
    
    if (workingWebhooks === totalWebhooks) {
      addNotification('All webhooks are operational! ✅', 'success');
    } else if (workingWebhooks > 0) {
      addNotification(`${workingWebhooks}/${totalWebhooks} webhooks are working`, 'warning');
    } else {
      addNotification('❌ No webhooks are responding. Check network connectivity.', 'error');
    }
  };

  // Enhanced file validation
  const validateFiles = (file1, file2) => {
    if (!file1 || !file2) {
      addNotification("Please select both legal documents for comparison analysis.", "warning");
      return false;
    }

    const ext1 = file1.name.split('.').pop().toLowerCase();
    const ext2 = file2.name.split('.').pop().toLowerCase();
    
    if (ext1 !== ext2) {
      addNotification('Both legal documents must be in the same file format for accurate comparison.', "warning");
      return false;
    }

    const allowedFormats = ['pdf', 'docx', 'png', 'jpeg', 'jpg'];
    if (!allowedFormats.includes(ext1)) {
      addNotification('Supported professional document formats: PDF, DOCX, PNG, JPEG, JPG', "error");
      return false;
    }

    // Check file sizes (increased limit to 25MB)
    const maxSize = 25 * 1024 * 1024;
    if (file1.size > maxSize || file2.size > maxSize) {
      addNotification('File size should be under 25MB for optimal processing.', "warning");
    }

    return true;
  };

  const validateSingleFile = (file) => {
    if (!file) {
      addNotification("Please select a legal document for analysis.", "warning");
      return false;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    const allowedFormats = ['pdf', 'docx', 'png', 'jpeg', 'jpg'];
    if (!allowedFormats.includes(ext)) {
      addNotification('Supported professional document formats: PDF, DOCX, PNG, JPEG, JPG', "error");
      return false;
    }

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      addNotification('File size should be under 25MB for optimal processing.', "warning");
    }

    return true;
  };

  // Enhanced contract comparison handler
const handleContractComparison = async () => {
  if (!file1 || !file2) {
    alert('Please upload both documents');
    return;
  }

  setLoading(true);
  
  try {
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);
    
    const response = await axios.post(
      WEBHOOK_URLS.contractComparison,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    
    // Response is plain text markdown
    const responseText = response.data;
    
    setResults({
      type: 'Contract Comparison Analysis',
      data: {
        rawResponse: responseText,
        formatted: parseMarkdownToStructured(responseText)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Comparison error:', error);
    alert('Failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};

// Parse markdown to structured data for display
const parseMarkdownToStructured = (text) => {
  const sections = text.split(/\*\*Section/).filter(s => s.trim());
  const changes = [];
  
  sections.forEach(section => {
    const lines = section.split('\n').filter(l => l.trim());
    const sectionName = lines[0]?.replace(/\*\*/g, '').replace(/\.$/, '').trim();
    
    const sectionChanges = {
      section: sectionName || 'General',
      items: []
    };
    
    let currentItem = null;
    
    lines.slice(1).forEach(line => {
      if (line.includes('- Original:')) {
        if (currentItem) sectionChanges.items.push(currentItem);
        currentItem = { original: line.replace(/- Original:\s*/, '').replace(/"/g, '').trim() };
      } else if (line.includes('- Revised:')) {
        if (currentItem) currentItem.revised = line.replace(/- Revised:\s*/, '').replace(/"/g, '').trim();
      } else if (line.includes('**Addition:**') || line.includes('**Change:**') || line.includes('**Shift:**')) {
        const type = line.includes('Addition') ? 'Addition' : line.includes('Change') ? 'Change' : 'Shift';
        const description = line.replace(/.*\*\*:\s*/, '').replace(/"/g, '').trim();
        if (currentItem) {
          currentItem.type = type;
          currentItem.description = description;
        }
      }
    });
    
    if (currentItem) sectionChanges.items.push(currentItem);
    if (sectionChanges.items.length > 0) changes.push(sectionChanges);
  });
  
  return { sections: changes, totalSections: changes.length };
};


  // Process comparison results for better display
  const processComparisonResults = (data) => {
    if (!data) return { summary: "No data received from analysis" };
    
    if (typeof data === 'string') {
      return { summary: data };
    }
    
    if (typeof data === 'object') {
      // Try to extract meaningful structure
      if (data.message) return { summary: data.message };
      if (data.analysis) return { summary: data.analysis };
      if (data.result) return { summary: data.result };
      
      // Return the entire object for display
      return data;
    }
    
    return { summary: String(data) };
  };

  // Enhanced risk analysis handler
  const handleRiskAnalysis = async () => {
    if (!validateSingleFile(singleFile)) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file1", singleFile);

    try {
      addNotification('Initiating risk assessment analysis...', 'info');
      
      const response = await axios.post(WEBHOOK_URLS.riskAnalysis, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000
      });

      let data = response.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Keep as string
        }
      }

      setResults({
        type: 'Risk Assessment & Compliance',
        data: data,
        timestamp: new Date().toLocaleString()
      });
      addNotification('Risk analysis assessment completed successfully', 'success');
    } catch (err) {
      console.error("Error analyzing risk:", err);
      addNotification('Risk assessment analysis failed. Please try again.', 'error');
      setResults({ 
        type: 'Risk Assessment & Compliance',
        error: err.message,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced document summarizer handler
  const handleDocumentSummarizer = async () => {
    if (!validateSingleFile(singleFile)) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file1", singleFile);

    try {
      addNotification('Generating document intelligence report...', 'info');
      
      const response = await axios.post(WEBHOOK_URLS.documentSummarizer, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000
      });

      let data = response.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Keep as string
        }
      }

      setResults({
        type: 'Legal Document Intelligence',
        data: data,
        timestamp: new Date().toLocaleString()
      });
      addNotification('Legal document intelligence report generated successfully', 'success');
    } catch (err) {
      console.error("Error summarizing document:", err);
      addNotification('Document intelligence generation failed. Please try again.', 'error');
      setResults({ 
        type: 'Legal Document Intelligence',
        error: err.message,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced authenticity check handler
  const handleAuthenticityCheck = async () => {
    if (!validateSingleFile(singleFile)) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file1", singleFile);

    try {
      addNotification('Performing document verification analysis...', 'info');
      
      const response = await axios.post(WEBHOOK_URLS.authenticityChecker, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000
      });

      let data = response.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Keep as string
        }
      }

      setResults({
        type: 'Document Verification Services',
        data: data,
        timestamp: new Date().toLocaleString()
      });
      addNotification('Document verification analysis completed successfully', 'success');
    } catch (err) {
      console.error("Error checking authenticity:", err);
      addNotification('Document verification analysis failed. Please try again.', 'error');
      setResults({ 
        type: 'Document Verification Services',
        error: err.message,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced compliance generation handler
  const handleComplianceGeneration = async () => {
    if (!complianceData.regulation || !complianceData.country || !complianceData.companyType) {
      addNotification("Please complete all regulatory compliance parameters for comprehensive analysis.", "warning");
      return;
    }

    setLoading(true);

    try {
      addNotification('Generating regulatory compliance framework...', 'info');
      
      const response = await axios.post(WEBHOOK_URLS.complianceGenerator, {
        Regulation: complianceData.regulation,
        Country: complianceData.country,
        CompanyType: complianceData.companyType
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 120000
      });

      let data = response.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Keep as string
        }
      }

      setResults({
        type: 'Regulatory Compliance Framework',
        data: data,
        timestamp: new Date().toLocaleString()
      });
      addNotification('Regulatory compliance framework generated successfully', 'success');
    } catch (err) {
      console.error("Error generating compliance tasks:", err);
      addNotification('Regulatory compliance framework generation failed. Please try again.', 'error');
      setResults({ 
        type: 'Regulatory Compliance Framework',
        error: err.message,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFiles = () => {
    setFile1(null);
    setFile2(null);
    setSingleFile(null);
    if (file1Ref.current) file1Ref.current.value = '';
    if (file2Ref.current) file2Ref.current.value = '';
    if (singleFileRef.current) singleFileRef.current.value = '';
  };

  const clearResults = () => {
    setResults(null);
  };

  // Enhanced file upload area component
  const FileUploadArea = ({ label, file, onFileChange, fileRef, accept = ".pdf,.docx,.png,.jpeg,.jpg", multiple = false }) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold" style={{ color: '#1f2839' }}>{label}</label>
      <div className="relative">
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
          multiple={multiple}
        />
        <div 
          onClick={() => fileRef?.current?.click()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'rgba(182, 157, 116, 0.25)',
            backdropFilter: 'blur(6px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#b69d74';
            e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(182, 157, 116, 0.25)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          }}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(182, 157, 116, 0.12)' }}>
              <Upload className="w-6 h-6" style={{ color: '#b69d74' }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#1f2839' }}>
                {file ? 'Replace document' : 'Upload legal document or drag and drop'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Professional formats: PDF, DOCX, PNG, JPEG, JPG (Maximum 25MB)</p>
            </div>
          </div>
        </div>
        {file && (
          <div className="mt-3 flex items-center justify-between p-3 rounded-lg" style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.20)'
          }}>
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4" style={{ color: '#10b981' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#10b981' }}>{file.name}</p>
                <p className="text-xs" style={{ color: '#10b981' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced results display component
  const ResultsDisplay = ({ results, onClose }) => {
    if (!results) return null;

    const formatContent = (content) => {
      if (typeof content === 'string') {
        return content.split('\n').map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ));
      }
      
      if (typeof content === 'object') {
        return Object.entries(content).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">{key}:</h4>
            <div className="text-gray-700 pl-4">
              {formatContent(value)}
            </div>
          </div>
        ));
      }
      
      return <p>{String(content)}</p>;
    };

    return (
      <div className="rounded-lg p-6 mt-6" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(182, 157, 116, 0.20)',
        boxShadow: '0 8px 32px rgba(31, 40, 57, 0.08)'
      }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(182, 157, 116, 0.12)' }}>
              <Eye className="w-5 h-5" style={{ color: '#b69d74' }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#1f2839' }}>{results.type} - Analysis Report</h3>
              <p className="text-sm flex items-center" style={{ color: '#6b7280' }}>
                <Clock className="w-3 h-3 mr-1" />
                Generated: {results.timestamp}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(182, 157, 116, 0.15)',
              color: '#6b7280',
              backdropFilter: 'blur(6px)'
            }}>
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: '#6b7280' }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1f2839';
                e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6b7280';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {results.error ? (
          <div className="rounded-lg p-6 mb-4" style={{
            backgroundColor: '#fef2f2',
            border: '2px solid #fecaca'
          }}>
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 mt-1 text-red-500" />
              <div className="flex-1">
                <h4 className="text-xl font-bold text-red-800 mb-3">Analysis Processing Error</h4>
                <p className="text-red-700 text-lg font-medium">{results.error}</p>
                {results.debugInfo && (
                  <div className="mt-4 p-3 bg-white rounded border border-red-200">
                    <h6 className="font-semibold text-red-800 text-sm mb-2">Technical Details:</h6>
                    <div className="text-xs text-red-600 font-mono">
                      <div>Error Code: {results.debugInfo.errorCode || 'Unknown'}</div>
                      <div>Webhook URL: {results.debugInfo.webhookUrl}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg p-4 border-l-4 border-green-500" style={{
              backgroundColor: '#f0fdf4'
            }}>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="text-lg font-bold text-green-800">Analysis Successfully Completed</h4>
                  <p className="text-green-600">AI-powered legal analysis has been generated</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border-2 border-gray-300">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg">
                <h4 className="text-xl font-bold flex items-center">
                  <FileCheck className="w-6 h-6 mr-2" />
                  Analysis Results
                </h4>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 min-h-[200px]">
                  {formatContent(results.data)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { 
      id: 'comparison', 
      name: 'Contract Comparison', 
      icon: GitCompare,
      description: 'Comprehensive side-by-side legal document comparison'
    },
    { 
      id: 'risk', 
      name: 'Risk Assessment', 
      icon: AlertTriangle,
      description: 'Advanced risk analysis and regulatory compliance evaluation'
    },
    { 
      id: 'summary', 
      name: 'Document Intelligence', 
      icon: BookOpen,
      description: 'AI-powered contract summarization and key insights extraction'
    },
    { 
      id: 'authenticity', 
      name: 'Document Verification', 
      icon: Shield,
      description: 'Professional authenticity validation and integrity assessment'
    },
    { 
      id: 'compliance', 
      name: 'Compliance Generator', 
      icon: CheckCircle,
      description: 'Automated regulatory framework and compliance checklist generation'
    }
  ];

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: '#f5f5ef',
      backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(182, 157, 116, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(31, 40, 57, 0.03) 0%, transparent 50%)
      `
    }}>
      {/* Header */}
      <div className="border-b p-6" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 239, 0.95) 100%)',
        borderBottomColor: 'rgba(182, 157, 116, 0.20)',
        backdropFilter: 'blur(15px)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="p-3 rounded-xl" style={{ 
                background: 'linear-gradient(135deg, #1f2839 0%, #2a3441 100%)'
              }}>
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1f2839' }}>Legal Intelligence Platform</h1>
                <p className="text-sm" style={{ color: '#6b7280' }}>Advanced contract analysis and compliance management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-md" style={{ 
                backgroundColor: Object.keys(webhookStatus).length === 0 ? 'rgba(156, 163, 175, 0.1)' : 
                               Object.values(webhookStatus).every(s => s.status) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: '1px solid',
                borderColor: Object.keys(webhookStatus).length === 0 ? 'rgba(156, 163, 175, 0.2)' : 
                            Object.values(webhookStatus).every(s => s.status) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'
              }}>
                <div className="w-2 h-2 rounded-full" style={{ 
                  backgroundColor: Object.keys(webhookStatus).length === 0 ? '#9ca3af' : 
                                 Object.values(webhookStatus).every(s => s.status) ? '#10b981' : '#f59e0b'
                }}></div>
                <span className="text-xs font-medium" style={{ 
                  color: Object.keys(webhookStatus).length === 0 ? '#9ca3af' : 
                        Object.values(webhookStatus).every(s => s.status) ? '#10b981' : '#f59e0b'
                }}>
                  {Object.keys(webhookStatus).length === 0 ? 'Systems Ready' : 
                   Object.values(webhookStatus).every(s => s.status) ? 'All Systems Online' : 
                   'Some Systems Offline'}
                </span>
              </div>
              <button
                onClick={testAllWebhooks}
                className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6'
                }}
              >
                Test Connectivity
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(245, 245, 239, 0.85) 100%)',
        borderBottomColor: 'rgba(182, 157, 116, 0.20)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1 py-4 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    clearResults();
                  }}
                  className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id ? 'text-white' : 'hover:text-white'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? '#1f2839' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : '#6b7280'
                  }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(31, 40, 57, 0.50)' }}>
          <div className="rounded-lg p-6 max-w-sm w-full mx-4" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(182, 157, 116, 0.20)'
          }}>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b69d74' }}>
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1" style={{ color: '#1f2839' }}>AI Analysis in Progress</h3>
                <p className="text-sm" style={{ color: '#6b7280' }}>Processing your documents...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Contract Comparison Tab */}
       {activeTab === 'comparison' && (
  <div className="space-y-6">
    {/* File Upload Section */}
    <div className="rounded-xl p-6" style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(182, 157, 116, 0.30)',
    }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(182, 157, 116, 0.12)' }}>
          <GitCompare className="w-5 h-5" style={{ color: '#b69d74' }} />
        </div>
        <div>
          <h3 className="text-xl font-semibold" style={{ color: '#1f2839' }}>Document Comparison</h3>
          <p className="text-sm" style={{ color: '#6b7280' }}>Upload two documents to compare changes</p>
        </div>
      </div>

      {/* Side-by-Side Upload Boxes (Like Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Top Version */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: '#1f2839' }}>
            Left Top Version edited
          </label>
          <div 
            onClick={() => file1Ref?.current?.click()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-[#b69d74] hover:bg-[rgba(182,157,116,0.05)]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: file1 ? '#b69d74' : 'rgba(182, 157, 116, 0.25)',
            }}
          >
            <input
              ref={file1Ref}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => setFile1(e.target.files[0])}
              className="hidden"
            />
            {!file1 ? (
              <div className="flex flex-col items-center space-y-3">
                <Upload className="w-10 h-10" style={{ color: '#b69d74' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1f2839' }}>
                    Click to upload document
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                    PDF, DOCX, DOC, TXT
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <FileText className="w-8 h-8" style={{ color: '#10b981' }} />
                <div className="text-left">
                  <p className="text-sm font-medium" style={{ color: '#10b981' }}>{file1.name}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{(file1.size / 1024).toFixed(2)} KB</p>
                </div>
                <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
              </div>
            )}
          </div>

          {/* Document Preview Box (Like Screenshot) */}
          {file1 && (
            <div className="border rounded-lg p-4 bg-white min-h-[200px]" style={{
              borderColor: 'rgba(182, 157, 116, 0.25)',
            }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-600">DOCUMENT PREVIEW</span>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="font-medium mb-2">📄 {file1.name}</p>
                <p className="text-xs text-gray-500">Size: {(file1.size / 1024).toFixed(2)} KB</p>
                <p className="text-xs text-gray-500">Type: {file1.type || 'Document'}</p>
                <p className="text-xs text-green-600 mt-2">✓ Ready for comparison</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Bottom Version */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: '#1f2839' }}>
            Left Bottom Version
          </label>
          <div 
            onClick={() => file2Ref?.current?.click()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-[#b69d74] hover:bg-[rgba(182,157,116,0.05)]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: file2 ? '#b69d74' : 'rgba(182, 157, 116, 0.25)',
            }}
          >
            <input
              ref={file2Ref}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => setFile2(e.target.files[0])}
              className="hidden"
            />
            {!file2 ? (
              <div className="flex flex-col items-center space-y-3">
                <Upload className="w-10 h-10" style={{ color: '#b69d74' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1f2839' }}>
                    Click to upload document
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                    PDF, DOCX, DOC, TXT
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <FileText className="w-8 h-8" style={{ color: '#10b981' }} />
                <div className="text-left">
                  <p className="text-sm font-medium" style={{ color: '#10b981' }}>{file2.name}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{(file2.size / 1024).toFixed(2)} KB</p>
                </div>
                <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
              </div>
            )}
          </div>

          {/* Document Preview Box */}
          {file2 && (
            <div className="border rounded-lg p-4 bg-white min-h-[200px]" style={{
              borderColor: 'rgba(182, 157, 116, 0.25)',
            }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-600">DOCUMENT PREVIEW</span>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="font-medium mb-2">📄 {file2.name}</p>
                <p className="text-xs text-gray-500">Size: {(file2.size / 1024).toFixed(2)} KB</p>
                <p className="text-xs text-gray-500">Type: {file2.type || 'Document'}</p>
                <p className="text-xs text-green-600 mt-2">✓ Ready for comparison</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compare Button - Center (Like Screenshot) */}
      <div className="flex justify-center">
        <button
          onClick={handleContractComparison}
          disabled={loading || !file1 || !file2}
          className="text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #b69d74 0%, #a68b63 100%)',
          }}
        >
          <GitCompare className="w-5 h-5" />
          <span>{loading ? 'Comparing...' : 'Compare'}</span>
        </button>
      </div>
    </div>

    {/* Comparison Results Display (Right Side - Like Screenshot) */}
    {results && results.type === 'Contract Comparison Analysis' && (
      <div className="rounded-xl p-6" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(182, 157, 116, 0.30)',
      }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center" style={{ color: '#1f2839' }}>
            📊 CHANGES HIGHLIGHTED (RIGHT RESULT)
          </h3>
          <button onClick={clearResults} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Stats */}
        {results.data?.comparison?.summary && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {results.data.comparison.summary.similarity}
              </div>
              <div className="text-xs text-gray-600">Similarity</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {results.data.comparison.summary.totalDifferences}
              </div>
              <div className="text-xs text-gray-600">Changes</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {results.data.comparison.summary.addedContent}
              </div>
              <div className="text-xs text-gray-600">Added</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {results.data.comparison.summary.removedContent}
              </div>
              <div className="text-xs text-gray-600">Removed</div>
            </div>
          </div>
        )}

        {/* Key Changes - Highlighted (Like Screenshot) */}
        {results.data?.comparison?.keyChanges && results.data.comparison.keyChanges.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3" style={{ color: '#1f2839' }}>Key Changes Detected:</h4>
            <div className="space-y-2">
              {results.data.comparison.keyChanges.map((change, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-amber-900">{change.field}</div>
                    <div className="text-sm mt-1">
                      <span className="text-red-600">{change.document1}</span>
                      <span className="mx-2">→</span>
                      <span className="text-green-600">{change.document2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Removed/Added Words (Like Screenshot Colors) */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Removed (red):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.data?.comparison?.removedLines?.slice(0, 10).map((item, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                  {item.content.substring(0, 30)}...
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Added (green):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.data?.comparison?.addedLines?.slice(0, 10).map((item, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {item.content.substring(0, 30)}...
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

        {/* Single Document Analysis Tabs */}
        {(activeTab === 'risk' || activeTab === 'summary' || activeTab === 'authenticity') && (
          <div className="rounded-lg p-6 mb-6" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(182, 157, 116, 0.20)'
          }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(182, 157, 116, 0.12)' }}>
                {activeTab === 'risk' && <AlertTriangle className="w-5 h-5" style={{ color: '#b69d74' }} />}
                {activeTab === 'summary' && <BookOpen className="w-5 h-5" style={{ color: '#b69d74' }} />}
                {activeTab === 'authenticity' && <Shield className="w-5 h-5" style={{ color: '#b69d74' }} />}
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{ color: '#1f2839' }}>
                  {activeTab === 'risk' && 'Risk Assessment & Compliance'}
                  {activeTab === 'summary' && 'Legal Document Intelligence'}
                  {activeTab === 'authenticity' && 'Document Verification'}
                </h3>
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  {activeTab === 'risk' && 'Identify potential risks and compliance issues'}
                  {activeTab === 'summary' && 'Extract key insights and summarize content'}
                  {activeTab === 'authenticity' && 'Verify document authenticity and integrity'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <FileUploadArea
                label="Document for Analysis"
                file={singleFile}
                onFileChange={(e) => setSingleFile(e.target.files[0])}
                fileRef={singleFileRef}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={
                  activeTab === 'risk' ? handleRiskAnalysis :
                  activeTab === 'summary' ? handleDocumentSummarizer :
                  handleAuthenticityCheck
                }
                disabled={loading || !singleFile}
                className="text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #b69d74 0%, #a68b63 100%)'
                }}
              >
                {activeTab === 'risk' && <AlertTriangle className="w-4 h-4" />}
                {activeTab === 'summary' && <BookOpen className="w-4 h-4" />}
                {activeTab === 'authenticity' && <Shield className="w-4 h-4" />}
                <span>
                  {loading ? 'Processing...' : 
                    activeTab === 'risk' ? 'Analyze Risks' :
                    activeTab === 'summary' ? 'Generate Summary' :
                    'Verify Document'
                  }
                </span>
              </button>
              
              <button
                onClick={clearFiles}
                className="px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(182, 157, 116, 0.15)',
                  color: '#6b7280'
                }}
              >
                <X className="w-4 h-4" />
                <span>Clear File</span>
              </button>
            </div>
          </div>
        )}

        {/* Compliance Generator Tab */}
        {activeTab === 'compliance' && (
          <div className="rounded-lg p-6 mb-6" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(182, 157, 116, 0.20)'
          }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(182, 157, 116, 0.12)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: '#b69d74' }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{ color: '#1f2839' }}>Compliance Framework Generator</h3>
                <p className="text-sm" style={{ color: '#6b7280' }}>Generate regulatory compliance checklists and frameworks</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#1f2839' }}>Regulation Type</label>
                <input
                  type="text"
                  placeholder="e.g., labor law, data privacy"
                  value={complianceData.regulation}
                  onChange={(e) => setComplianceData({...complianceData, regulation: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-b69d74 focus:ring-1 focus:ring-b69d74"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#1f2839' }}>Jurisdiction</label>
                <select
                  value={complianceData.country}
                  onChange={(e) => setComplianceData({...complianceData, country: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-b69d74 focus:ring-1 focus:ring-b69d74"
                >
                  <option value="INDIA">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CANADA">Canada</option>
                  <option value="AUSTRALIA">Australia</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#1f2839' }}>Business Type</label>
                <input
                  type="text"
                  placeholder="e.g., technology, healthcare"
                  value={complianceData.companyType}
                  onChange={(e) => setComplianceData({...complianceData, companyType: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-b69d74 focus:ring-1 focus:ring-b69d74"
                />
              </div>
            </div>

            <button
              onClick={handleComplianceGeneration}
              disabled={loading || !complianceData.regulation || !complianceData.country || !complianceData.companyType}
              className="text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              style={{
                background: 'linear-gradient(135deg, #b69d74 0%, #a68b63 100%)'
              }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? 'Generating...' : 'Generate Framework'}</span>
            </button>
          </div>
        )}

        {/* Webhook Status Display */}
        {Object.keys(webhookStatus).length > 0 && (
          <div className="rounded-lg p-4 mb-6" style={{
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.20)'
          }}>
            <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: '#1f2839' }}>
              <FileCheck className="w-5 h-5 mr-3" style={{ color: '#3b82f6' }} />
              System Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(webhookStatus).map(([key, status]) => (
                <div key={key} className="p-3 rounded-lg border" style={{
                  backgroundColor: status.status ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  borderColor: status.status ? 'rgba(16, 185, 129, 0.20)' : 'rgba(239, 68, 68, 0.20)'
                }}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${status.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium" style={{ 
                      color: status.status ? '#059669' : '#dc2626' 
                    }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ 
                    color: status.status ? '#059669' : '#dc2626' 
                  }}>
                    {status.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Display */}
        <ResultsDisplay results={results} onClose={clearResults} />
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg p-4 shadow-lg transition-all duration-300 max-w-sm ${
              notification.type === 'error' ? 'bg-red-50 border border-red-200' :
              notification.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
              notification.type === 'success' ? 'bg-green-50 border border-green-200' :
              'bg-blue-50 border border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  notification.type === 'error' ? 'bg-red-100' :
                  notification.type === 'warning' ? 'bg-amber-100' :
                  notification.type === 'success' ? 'bg-green-100' :
                  'bg-blue-100'
                }`}>
                  {notification.type === 'error' && <AlertTriangle className="w-3 h-3 text-red-600" />}
                  {notification.type === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                  {notification.type === 'success' && <CheckCircle className="w-3 h-3 text-green-600" />}
                  {notification.type === 'info' && <FileText className="w-3 h-3 text-blue-600" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    notification.type === 'error' ? 'text-red-800' :
                    notification.type === 'warning' ? 'text-amber-800' :
                    notification.type === 'success' ? 'text-green-800' :
                    'text-blue-800'
                  }`}>
                    {notification.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContractComparison;