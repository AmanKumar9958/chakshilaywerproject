import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  FileText, 
  Users, 
  Brain, 
  Scale, 
  Calendar, 
  Upload, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Briefcase,
  Award,
  BarChart3,
  BookOpen,
  Search,
  Zap,
  Eye,
  Download,
  X,
  Activity,
  PieChart,
  Folder,
  UserCheck,
  FileCheck,
  Sparkles,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('workspace');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef1 = useRef();
  const fileRef2 = useRef();

  // N8N Webhook URLs
  const webhooks = {
    contractComparison: 'https://n8n.srv983857.hstgr.cloud/webhook/a027ab82-e53c-4246-9982-c41c79ac9bca',
    riskAnalysis: 'https://n8n.srv983857.hstgr.cloud/webhook/32c4f30e-6722-4125-bd7d-691f0e9460e4',
    documentSummarizer: 'https://n8n.srv983857.hstgr.cloud/webhook/12ac51e5-e395-4c18-b5f9-ddd9516e6ed3',
    authenticityChecker: 'https://n8n.srv983857.hstgr.cloud/webhook/ec8123eb-cee8-4ca3-a941-d499ed3f024d'
  };

  // Color palette matching sidebar
  const colors = {
    background: '#f5f5ef',
    textPrimary: '#1f2839',
    textSecondary: '#6b7280',
    accent: '#b69d74',
    border: 'rgba(31, 40, 57, 0.15)',
    hover: 'rgba(182, 157, 116, 0.08)',
    active: 'rgba(182, 157, 116, 0.12)',
    shadow: '0 1px 3px 0 rgba(31, 40, 57, 0.1), 0 1px 2px 0 rgba(31, 40, 57, 0.06)',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  // Contract Analysis Functions
  const handleContractComparison = async () => {
    const file1 = fileRef1.current?.files[0];
    const file2 = fileRef2.current?.files[0];
    
    if (!file1 || !file2) {
      alert('Please select both contracts to compare');
      return;
    }

    const ext1 = file1.name.split('.').pop().toLowerCase();
    const ext2 = file2.name.split('.').pop().toLowerCase();
    
    if (ext1 !== ext2) {
      alert('Both contracts must have the same file extension');
      return;
    }

    const allowedFormats = ['pdf', 'docx', 'png', 'jpeg', 'jpg'];
    if (!allowedFormats.includes(ext1)) {
      alert('Supported formats: PDF, DOCX, PNG, JPEG, JPG');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await fetch(webhooks.contractComparison, {
        method: 'POST',
        body: formData
      });
      const result = await response.text();
      setAnalysisResults({
        type: 'comparison',
        data: result,
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      alert('Error analyzing contracts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRiskAnalysis = async (file) => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file1', file);

    try {
      const response = await fetch(webhooks.riskAnalysis, {
        method: 'POST',
        body: formData
      });
      const result = await response.text();
      setAnalysisResults({
        type: 'risk',
        data: result,
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      alert('Error analyzing risks: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSummarizer = async (file) => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file1', file);

    try {
      const response = await fetch(webhooks.documentSummarizer, {
        method: 'POST',
        body: formData
      });
      const result = await response.text();
      setAnalysisResults({
        type: 'summary',
        data: result,
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      alert('Error summarizing document: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticityCheck = async (file) => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file1', file);

    try {
      const response = await fetch(webhooks.authenticityChecker, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      setAnalysisResults({
        type: 'authenticity',
        data: result,
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      alert('Error checking authenticity: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Data
  const stats = [
    { 
      name: 'Total Cases', 
      value: '24', 
      change: '+12%', 
      trend: 'up', 
      icon: Briefcase,
      description: 'Active legal cases'
    },
    { 
      name: 'Active Cases', 
      value: '18', 
      change: '+5%', 
      trend: 'up', 
      icon: Activity,
      description: 'Currently in progress'
    },
    { 
      name: 'Success Rate', 
      value: '87%', 
      change: '+15%', 
      trend: 'up', 
      icon: Award,
      description: 'Case success rate'
    },
    { 
      name: 'High Risk', 
      value: '3', 
      change: '-2%', 
      trend: 'down', 
      icon: AlertTriangle,
      description: 'Requiring attention'
    }
  ];

  const recentActivities = [
    { 
      type: 'case', 
      title: 'Property Dispute Case Filed', 
      description: 'New case filed for ABC vs XYZ Corporation',
      time: '2 hours ago', 
      status: 'active',
      priority: 'high'
    },
    { 
      type: 'document', 
      title: 'Contract Analysis Completed', 
      description: 'AI analysis completed for merger agreement',
      time: '4 hours ago', 
      status: 'completed',
      priority: 'medium'
    },
    { 
      type: 'hearing', 
      title: 'Court Hearing Scheduled', 
      description: 'Hearing scheduled for Johnson v. Smith case',
      time: '1 day ago', 
      status: 'upcoming',
      priority: 'high'
    }
  ];

  const quickActions = [
    { name: 'New Case', description: 'Start a new legal case file', icon: FileText },
    { name: 'Upload Docs', description: 'Upload legal documents', icon: Upload },
    { name: 'Add Client', description: 'Register new client profile', icon: UserCheck },
    { name: 'Schedule', description: 'Schedule client meeting', icon: Calendar },
    { name: 'AI Analysis', description: 'Analyze documents with AI', icon: Brain },
    { name: 'Generate Report', description: 'Create case reports', icon: FileCheck }
  ];

  const tabs = [
    { id: 'workspace', name: 'Dashboard', icon: Home },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'contract-analysis', name: 'Contract AI', icon: Scale },
    { id: 'case-management', name: 'Cases', icon: Folder },
    { id: 'client-portal', name: 'Clients', icon: Users },
    { id: 'ai-tools', name: 'AI Tools', icon: Brain }
  ];

  const upcomingEvents = [
    { title: 'Court Hearing - Property Dispute', time: 'Today, 2:00 PM', type: 'hearing', urgent: true },
    { title: 'Client Meeting - Tech Startup', time: 'Tomorrow, 10:00 AM', type: 'meeting', urgent: false },
    { title: 'Document Review Deadline', time: 'Dec 25, 5:00 PM', type: 'deadline', urgent: true }
  ];

  const aiAnalysisTools = [
    { name: 'Risk Analysis', icon: Shield, description: 'Identify potential risks and missing clauses' },
    { name: 'Document Summarizer', icon: BookOpen, description: 'Convert complex documents to plain language' },
    { name: 'Authenticity Checker', icon: Search, description: 'Verify document authenticity' }
  ];

  // Render Functions
  const renderWorkspace = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div 
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'white',
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Counsel'}
            </h2>
            <p style={{ color: colors.textSecondary }}>Here's your practice overview for today</p>
          </div>
          <div className="flex items-center space-x-6 mt-4 lg:mt-0">
            <div className="text-center">
              <div className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>24</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>Active Cases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold" style={{ color: colors.success }}>87%</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index} 
              className="rounded-xl border p-6 hover:shadow-md transition-shadow cursor-pointer"
              style={{
                backgroundColor: 'white',
                borderColor: colors.border
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{stat.name}</p>
                  <p className="text-2xl font-semibold mt-1" style={{ color: colors.textPrimary }}>{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: colors.hover }}
                >
                  <IconComponent className="w-6 h-6" style={{ color: colors.accent }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div 
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'white',
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg transition-all group"
                style={{ borderColor: colors.border }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.accent;
                  e.currentTarget.style.backgroundColor = colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div 
                  className="p-3 rounded-lg mb-3"
                  style={{ backgroundColor: colors.hover }}
                >
                  <IconComponent className="w-5 h-5" style={{ color: colors.accent }} />
                </div>
                <span className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>{action.name}</span>
                <span className="text-xs text-center" style={{ color: colors.textSecondary }}>{action.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div 
          className="rounded-xl border p-6"
          style={{
            backgroundColor: 'white',
            borderColor: colors.border,
            boxShadow: colors.shadow
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Recent Activities</h3>
            <button 
              className="text-sm font-medium"
              style={{ color: colors.accent }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-4 p-3 rounded-lg transition-colors cursor-pointer"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  activity.status === 'active' ? 'bg-green-500' :
                  activity.status === 'completed' ? 'bg-blue-500' : 
                  'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: colors.textPrimary }}>{activity.title}</p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{activity.description}</p>
                  <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>{activity.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  activity.priority === 'high' ? 'bg-red-100 text-red-800' :
                  activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div 
          className="rounded-xl border p-6"
          style={{
            backgroundColor: 'white',
            borderColor: colors.border,
            boxShadow: colors.shadow
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Upcoming Events</h3>
            <button 
              className="text-sm font-medium"
              style={{ color: colors.accent }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              View Calendar
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  event.urgent ? 'border-red-200 bg-red-50' : ''
                }`}
                style={{
                  borderColor: event.urgent ? undefined : colors.border,
                  backgroundColor: event.urgent ? undefined : colors.hover
                }}
                onMouseEnter={(e) => {
                  if (!event.urgent) {
                    e.currentTarget.style.borderColor = colors.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!event.urgent) {
                    e.currentTarget.style.borderColor = colors.border;
                  }
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: colors.textPrimary }}>{event.title}</p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{event.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ml-4 flex-shrink-0 ${
                  event.type === 'hearing' ? 'bg-red-100 text-red-800' :
                  event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContractAnalysis = () => (
    <div className="space-y-6">
      <div 
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'white',
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${colors.accent}20` }}
          >
            <Brain className="w-6 h-6" style={{ color: colors.accent }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>AI Contract Analysis</h3>
            <p style={{ color: colors.textSecondary }}>Professional legal document analysis powered by AI</p>
          </div>
        </div>
        
        {/* Contract Comparison */}
        <div 
          className="mb-8 p-6 rounded-lg border"
          style={{
            backgroundColor: colors.hover,
            borderColor: colors.border
          }}
        >
          <h4 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Contract Comparison</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>First Contract</label>
              <div 
                onClick={() => fileRef1.current?.click()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
                style={{ borderColor: colors.border }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.accent}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}
              >
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textSecondary }} />
                <p className="text-sm" style={{ color: colors.textSecondary }}>Click to upload contract</p>
                <input ref={fileRef1} type="file" className="hidden" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>Second Contract</label>
              <div 
                onClick={() => fileRef2.current?.click()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
                style={{ borderColor: colors.border }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.accent}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}
              >
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textSecondary }} />
                <p className="text-sm" style={{ color: colors.textSecondary }}>Click to upload contract</p>
                <input ref={fileRef2} type="file" className="hidden" />
              </div>
            </div>
          </div>
          
          <button
            onClick={handleContractComparison}
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.accent,
              color: 'white'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.opacity = '1';
              }
            }}
          >
            {loading ? 'Comparing...' : 'Compare Contracts'}
          </button>
        </div>

        {/* AI Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiAnalysisTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <div 
                key={index} 
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                style={{
                  borderColor: colors.border
                }}
              >
                <div 
                  className="p-3 rounded-lg w-fit mb-4"
                  style={{ backgroundColor: colors.hover }}
                >
                  <IconComponent className="w-6 h-6" style={{ color: colors.accent }} />
                </div>
                <h5 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>{tool.name}</h5>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{tool.description}</p>
                <input
                  type="file"
                  className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (tool.name === 'Risk Analysis') handleRiskAnalysis(file);
                      else if (tool.name === 'Document Summarizer') handleDocumentSummarizer(file);
                      else if (tool.name === 'Authenticity Checker') handleAuthenticityCheck(file);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div 
          className="rounded-xl border p-6"
          style={{
            backgroundColor: 'white',
            borderColor: colors.border,
            boxShadow: colors.shadow
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Analysis Results</h3>
            <button
              onClick={() => setAnalysisResults(null)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div 
            className="rounded-lg p-4"
            style={{ backgroundColor: colors.hover }}
          >
            <pre className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto" style={{ color: colors.textPrimary }}>
              {typeof analysisResults.data === 'string' 
                ? analysisResults.data 
                : JSON.stringify(analysisResults.data, null, 2)
              }
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  const renderCaseManagement = () => (
    <div className="space-y-6">
      <div 
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'white',
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Case Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="p-4 border rounded-lg"
            style={{ borderColor: colors.border }}
          >
            <h4 className="font-medium mb-2" style={{ color: colors.textPrimary }}>Document Organization</h4>
            <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>Secure workspace with version control</p>
            <button 
              className="w-full py-2 rounded-md transition-colors"
              style={{
                backgroundColor: colors.accent,
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Manage Documents
            </button>
          </div>
          
          <div 
            className="p-4 border rounded-lg"
            style={{ borderColor: colors.border }}
          >
            <h4 className="font-medium mb-2" style={{ color: colors.textPrimary }}>Case Tracking</h4>
            <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>Complete lifecycle management</p>
            <button 
              className="w-full py-2 rounded-md transition-colors"
              style={{
                backgroundColor: colors.success,
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              View Timeline
            </button>
          </div>
          
          <div 
            className="p-4 border rounded-lg"
            style={{ borderColor: colors.border }}
          >
            <h4 className="font-medium mb-2" style={{ color: colors.textPrimary }}>Legal Strategies</h4>
            <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>AI-generated arguments</p>
            <button 
              className="w-full py-2 rounded-md transition-colors"
              style={{
                backgroundColor: colors.info,
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Generate Arguments
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClientManagement = () => (
    <div className="space-y-6">
      <div 
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'white',
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Client Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            className="p-4 border rounded-lg text-center"
            style={{ borderColor: colors.border }}
          >
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-medium" style={{ color: colors.textPrimary }}>Active Clients</h4>
            <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>12</p>
          </div>
          <div 
            className="p-4 border rounded-lg text-center"
            style={{ borderColor: colors.border }}
          >
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-medium" style={{ color: colors.textPrimary }}>Messages</h4>
            <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>8</p>
          </div>
          <div 
            className="p-4 border rounded-lg text-center"
            style={{ borderColor: colors.border }}
          >
            <div className="text-2xl mb-2">📄</div>
            <h4 className="font-medium" style={{ color: colors.textPrimary }}>Documents</h4>
            <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>34</p>
          </div>
          <div 
            className="p-4 border rounded-lg text-center"
            style={{ borderColor: colors.border }}
          >
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-medium" style={{ color: colors.textPrimary }}>Invoices</h4>
            <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>5</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAITools = () => (
    <div className="space-y-6">
      <div 
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'white',
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>AI Legal Assistant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="p-4 border rounded-lg"
            style={{ borderColor: colors.border }}
          >
            <h4 className="font-medium mb-2" style={{ color: colors.textPrimary }}>Case Analysis</h4>
            <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>Upload case files for legal pathway suggestions</p>
            <button 
              className="w-full py-2 rounded-md transition-colors"
              style={{
                backgroundColor: colors.accent,
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Analyze Case
            </button>
          </div>
          
          <div 
            className="p-4 border rounded-lg"
            style={{ borderColor: colors.border }}
          >
            <h4 className="font-medium mb-2" style={{ color: colors.textPrimary }}>Precedent Matching</h4>
            <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>AI-driven similar case identification</p>
            <button 
              className="w-full py-2 rounded-md transition-colors"
              style={{
                backgroundColor: colors.success,
                color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Find Precedents
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div 
        className="rounded-xl border p-6"
        style={{
          backgroundColor: 'white',
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Analytics & Insights</h3>
        <p style={{ color: colors.textSecondary }}>Comprehensive analytics dashboard coming soon...</p>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen ml-72"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div 
        className="border-b sticky top-0 z-40 backdrop-blur-sm"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}DD)`
                }}
              >
                <span className="text-white font-semibold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Legal Practice Dashboard</h1>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Welcome, {user?.name || 'Legal Professional'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hover;
                  e.currentTarget.style.color = colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                <span className="text-lg">🔔</span>
              </button>
              <button 
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hover;
                  e.currentTarget.style.color = colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                <span className="text-lg">⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div 
        className="border-b sticky top-16 z-30 backdrop-blur-sm"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <div className="px-6">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2 py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-all"
                  style={{
                    borderColor: isActive ? colors.accent : 'transparent',
                    color: isActive ? colors.accent : colors.textSecondary
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.textSecondary;
                    }
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
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
          <div 
            className="rounded-xl border p-8 shadow-lg"
            style={{
              backgroundColor: 'white',
              borderColor: colors.border
            }}
          >
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: colors.accent, borderTopColor: 'transparent' }}
              ></div>
              <div className="text-center">
                <h3 className="font-semibold" style={{ color: colors.textPrimary }}>Processing Request</h3>
                <p style={{ color: colors.textSecondary }}>AI is analyzing your documents...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="px-6 py-6">
        {activeTab === 'workspace' && renderWorkspace()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'contract-analysis' && renderContractAnalysis()}
        {activeTab === 'case-management' && renderCaseManagement()}
        {activeTab === 'client-portal' && renderClientManagement()}
        {activeTab === 'ai-tools' && renderAITools()}
      </div>
    </div>
  );
};

export default Dashboard;
