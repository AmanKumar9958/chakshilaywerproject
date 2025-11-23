import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Integrations = () => {
  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, theme, language } = context || {};

  // State management
  const [activeTab, setActiveTab] = useState('active');
  const [integrations, setIntegrations] = useState([]);
  const [availableIntegrations, setAvailableIntegrations] = useState([]);
  const [syncStatus, setSyncStatus] = useState({});
  const [connecting, setConnecting] = useState({});
  const [testingConnection, setTestingConnection] = useState({});
  const [syncHistory, setSyncHistory] = useState([]);
  const [apiKeys, setApiKeys] = useState({});
  const [configuring, setConfiguring] = useState(null);
  const [configForm, setConfigForm] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mock data for integrations
  const mockAvailableIntegrations = [
    {
      id: 'ecourts',
      name: 'eCourts India',
      description: 'Integrated with National Judicial Data Grid for case status updates',
      category: 'Court System',
      icon: '⚖️',
      status: 'active',
      features: ['Case Status Sync', 'Hearing Updates', 'Order Downloads'],
      provider: 'NIC India',
      documentation: 'https://ecourts.gov.in/api-docs'
    },
    {
      id: 'legalbreach',
      name: 'Legal Breach Database',
      description: 'Access to comprehensive legal precedent database',
      category: 'Legal Database',
      icon: '📚',
      status: 'active',
      features: ['Precedent Search', 'Case Law Research', 'Citation Verification'],
      provider: 'Legal Breach',
      documentation: 'https://legalbreach.com/api'
    },
    {
      id: 'indiankanoon',
      name: 'Indian Kanoon',
      description: 'Free legal database with Supreme Court and High Court judgments',
      category: 'Legal Database',
      icon: '📖',
      status: 'available',
      features: ['Judgment Search', 'Legal Citations', 'Full Text Search'],
      provider: 'Indian Kanoon',
      documentation: 'https://indiankanoon.org/api'
    },
    {
      id: 'sms_gateway',
      name: 'SMS Gateway',
      description: 'Send SMS notifications to clients and advocates',
      category: 'Communication',
      icon: '📱',
      status: 'active',
      features: ['Bulk SMS', 'Templates', 'Delivery Reports'],
      provider: 'TextLocal',
      documentation: 'https://textlocal.in/api'
    },
    {
      id: 'email_service',
      name: 'Email Service',
      description: 'Professional email service for legal communications',
      category: 'Communication',
      icon: '📧',
      status: 'active',
      features: ['Email Templates', 'Scheduling', 'Tracking'],
      provider: 'SendGrid',
      documentation: 'https://sendgrid.com/docs'
    },
    {
      id: 'document_scanner',
      name: 'Document Scanner API',
      description: 'OCR and document processing for legal documents',
      category: 'Document Processing',
      icon: '📄',
      status: 'available',
      features: ['OCR Processing', 'Text Extraction', 'Format Conversion'],
      provider: 'Adobe PDF Services',
      documentation: 'https://developer.adobe.com/document-services'
    }
  ];

  const mockSyncHistory = [
    {
      id: 1,
      integration: 'eCourts India',
      action: 'Case Status Update',
      timestamp: '2023-12-20T10:30:00Z',
      status: 'Success',
      records: 25,
      details: 'Updated case statuses for 25 active cases'
    },
    {
      id: 2,
      integration: 'SMS Gateway',
      action: 'Hearing Reminders',
      timestamp: '2023-12-20T09:15:00Z',
      status: 'Success',
      records: 12,
      details: 'Sent hearing reminders to 12 clients'
    },
    {
      id: 3,
      integration: 'Legal Breach Database',
      action: 'Precedent Sync',
      timestamp: '2023-12-19T16:45:00Z',
      status: 'Partial',
      records: 150,
      details: '150 precedents synced, 3 failed due to API limits'
    }
  ];

  // Load initial data
  useEffect(() => {
    const activeIntegrations = mockAvailableIntegrations.filter(i => i.status === 'active');
    const available = mockAvailableIntegrations.filter(i => i.status === 'available');
    
    setIntegrations(activeIntegrations);
    setAvailableIntegrations(available);
    setSyncHistory(mockSyncHistory);

    // Initialize sync status
    const initialSyncStatus = {};
    activeIntegrations.forEach(integration => {
      initialSyncStatus[integration.id] = {
        lastSync: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        status: Math.random() > 0.8 ? 'error' : 'success',
        nextSync: new Date(Date.now() + Math.random() * 86400000).toISOString()
      };
    });
    setSyncStatus(initialSyncStatus);
  }, []);

  // Auto-sync functionality
  useEffect(() => {
    const interval = setInterval(() => {
      integrations.forEach(integration => {
        if (Math.random() > 0.95) {
          performSync(integration.id, 'auto');
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [integrations]);

  // Connect to integration
  const connectIntegration = async (integrationId) => {
    setConnecting(prev => ({ ...prev, [integrationId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const integration = availableIntegrations.find(i => i.id === integrationId);
      if (integration) {
        setIntegrations(prev => [...prev, { ...integration, status: 'active' }]);
        setAvailableIntegrations(prev => prev.filter(i => i.id !== integrationId));
        
        setSyncStatus(prev => ({
          ...prev,
          [integrationId]: {
            lastSync: new Date().toISOString(),
            status: 'success',
            nextSync: new Date(Date.now() + 86400000).toISOString()
          }
        }));
        
        addNotification?.({
          type: 'success',
          message: `Successfully connected to ${integration.name}`
        });
      }
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: `Failed to connect to integration`
      });
    } finally {
      setConnecting(prev => ({ ...prev, [integrationId]: false }));
    }
  };

  // Disconnect integration
  const disconnectIntegration = async (integrationId) => {
    try {
      const integration = integrations.find(i => i.id === integrationId);
      if (integration) {
        setIntegrations(prev => prev.filter(i => i.id !== integrationId));
        setAvailableIntegrations(prev => [...prev, { ...integration, status: 'available' }]);
        
        setSyncStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[integrationId];
          return newStatus;
        });
        
        addNotification?.({
          type: 'info',
          message: `Disconnected from ${integration.name}`
        });
      }
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: 'Failed to disconnect integration'
      });
    }
  };

  // Test connection
  const testConnection = async (integrationId) => {
    setTestingConnection(prev => ({ ...prev, [integrationId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isSuccess = Math.random() > 0.2;
      
      addNotification?.({
        type: isSuccess ? 'success' : 'error',
        message: isSuccess ? 'Connection test successful' : 'Connection test failed'
      });
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: 'Connection test failed'
      });
    } finally {
      setTestingConnection(prev => ({ ...prev, [integrationId]: false }));
    }
  };

  // Perform sync
  const performSync = async (integrationId, type = 'manual') => {
    try {
      const integration = integrations.find(i => i.id === integrationId);
      if (!integration) return;

      const success = Math.random() > 0.1;
      const records = Math.floor(Math.random() * 100) + 1;
      
      setSyncStatus(prev => ({
        ...prev,
        [integrationId]: {
          lastSync: new Date().toISOString(),
          status: success ? 'success' : 'error',
          nextSync: new Date(Date.now() + 86400000).toISOString()
        }
      }));

      const historyEntry = {
        id: Date.now(),
        integration: integration.name,
        action: type === 'auto' ? 'Auto Sync' : 'Manual Sync',
        timestamp: new Date().toISOString(),
        status: success ? 'Success' : 'Failed',
        records: success ? records : 0,
        details: success ? `Synced ${records} records successfully` : 'Sync failed due to API error'
      };
      
      setSyncHistory(prev => [historyEntry, ...prev.slice(0, 19)]);
      
      if (type === 'manual') {
        addNotification?.({
          type: success ? 'success' : 'error',
          message: success ? `${integration.name} synced successfully` : `${integration.name} sync failed`
        });
      }
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: 'Sync operation failed'
      });
    }
  };

  // Open configuration modal
  const openConfiguration = (integration) => {
    setConfiguring(integration.id);
    setConfigForm({
      apiKey: apiKeys[integration.id] || '',
      endpoint: '',
      timeout: 30,
      retryAttempts: 3,
      enableLogging: true
    });
  };

  // Save configuration
  const saveConfiguration = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApiKeys(prev => ({
        ...prev,
        [configuring]: configForm.apiKey
      }));
      
      setConfiguring(null);
      setConfigForm({});
      
      addNotification?.({
        type: 'success',
        message: 'Configuration saved successfully'
      });
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: 'Failed to save configuration'
      });
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-[#10b981] bg-[#10b98120] border-[#10b98140]';
      case 'error':
        return 'text-[#f59e0b] bg-[#f59e0b20] border-[#f59e0b40]';
      case 'partial':
        return 'text-[#3b82f6] bg-[#3b82f620] border-[#3b82f640]';
      default:
        return 'text-[#6b7280] bg-[#6b728020] border-[#6b728040]';
    }
  };

  // Card hover animation style
  const getCardStyle = (integrationId) => {
    const baseStyle = "transform transition-all duration-300 ease-out border";
    
    if (hoveredCard === integrationId) {
      return `${baseStyle} scale-[1.02] border-[#b69d7460] shadow-lg`;
    }
    
    return `${baseStyle} scale-100 border-[rgba(31,40,57,0.15)] hover:border-[#b69d7440]`;
  };

  return (
    <div className="min-h-screen bg-[#f5f5ef] p-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-[rgba(182,157,116,0.15)] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#1f2839] mb-3">
              {language === 'ta' ? 'एकीकरण' : 'Integrations'}
            </h1>
            <p className="text-[#6b7280] text-lg">
              {language === 'ta' ? 'बाहरी सेवाओं और डेटाबेस के साथ कनेक्ट करें' : 'Connect with external services and databases'}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-6 lg:mt-0">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-[#10b981]">
                <div className="w-3 h-3 bg-[#10b981] rounded-full mr-2 animate-pulse"></div>
                <span className="font-semibold">{integrations.length} Active</span>
              </div>
              <div className="flex items-center text-[#3b82f6]">
                <div className="w-3 h-3 bg-[#3b82f6] rounded-full mr-2"></div>
                <span className="font-semibold">{availableIntegrations.length} Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-[rgba(182,157,116,0.12)] shadow-sm overflow-hidden">
        {/* Tabs Navigation */}
        <div className="border-b border-[rgba(182,157,116,0.10)]">
          <nav className="flex -mb-px">
            {[
              { key: 'active', label: language === 'ta' ? 'सक्रिय' : 'Active', icon: '✓' },
              { key: 'available', label: language === 'ta' ? 'उपलब्ध' : 'Available', icon: '➕' },
              { key: 'history', label: language === 'ta' ? 'इतिहास' : 'History', icon: '📊' },
              { key: 'api', label: language === 'ta' ? 'API प्रबंधन' : 'API Management', icon: '🔑' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-5 px-8 text-sm font-semibold border-b-2 transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'border-[#b69d74] text-[#b69d74]'
                    : 'border-transparent text-[#6b7280] hover:text-[#1f2839] hover:border-[#b69d7440]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Active Integrations Tab */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {integrations.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className={getCardStyle(integration.id)}
                      onMouseEnter={() => setHoveredCard(integration.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="bg-gradient-to-br from-white to-[rgba(182,157,116,0.03)] p-6 rounded-2xl">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl bg-[rgba(182,157,116,0.10)] p-3 rounded-xl">
                              {integration.icon}
                            </div>
                            <div>
                              <h3 className="font-bold text-[#1f2839] text-lg">
                                {integration.name}
                              </h3>
                              <p className="text-sm text-[#6b7280]">
                                {integration.category} • {integration.provider}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              syncStatus[integration.id]?.status === 'success' ? 'bg-[#10b981]' :
                              syncStatus[integration.id]?.status === 'error' ? 'bg-[#f59e0b]' :
                              'bg-[#3b82f6]'
                            }`}></div>
                            <span className="text-xs font-medium text-[#6b7280] capitalize">
                              {syncStatus[integration.id]?.status || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        <p className="text-[#6b7280] mb-4 leading-relaxed">
                          {integration.description}
                        </p>

                        {/* Features */}
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {integration.features.map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs px-3 py-1.5 bg-[rgba(182,157,116,0.08)] text-[#b69d74] rounded-full font-medium border border-[rgba(182,157,116,0.15)]"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Sync Status */}
                        {syncStatus[integration.id] && (
                          <div className="mb-6 p-4 bg-[rgba(182,157,116,0.05)] rounded-xl border border-[rgba(182,157,116,0.10)]">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-[#6b7280] text-xs font-medium mb-1">Last Sync</div>
                                <div className="text-[#1f2839] font-semibold">
                                  {new Date(syncStatus[integration.id].lastSync).toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-[#6b7280] text-xs font-medium mb-1">Next Sync</div>
                                <div className="text-[#1f2839] font-semibold">
                                  {new Date(syncStatus[integration.id].nextSync).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => performSync(integration.id)}
                            className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] border border-transparent rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74BB] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
                          >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {language === 'ta' ? 'सिंक करें' : 'Sync Now'}
                          </button>
                          
                          <button
                            onClick={() => testConnection(integration.id)}
                            disabled={testingConnection[integration.id]}
                            className="p-3 text-sm font-medium text-[#6b7280] bg-white border border-[rgba(31,40,57,0.15)] rounded-xl hover:bg-[rgba(182,157,116,0.05)] hover:text-[#b69d74] hover:border-[#b69d7440] transition-all duration-300 disabled:opacity-50"
                          >
                            {testingConnection[integration.id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#b69d74]"></div>
                            ) : (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>

                          <button
                            onClick={() => openConfiguration(integration)}
                            className="p-3 text-sm font-medium text-[#6b7280] bg-white border border-[rgba(31,40,57,0.15)] rounded-xl hover:bg-[rgba(182,157,116,0.05)] hover:text-[#b69d74] hover:border-[#b69d7440] transition-all duration-300"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-[rgba(182,157,116,0.08)] rounded-full flex items-center justify-center">
                    <svg className="h-10 w-10 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1f2839] mb-3">
                    {language === 'ta' ? 'कोई सक्रिय एकीकरण नहीं' : 'No Active Integrations'}
                  </h3>
                  <p className="text-[#6b7280] mb-6 max-w-md mx-auto">
                    {language === 'ta' ? 'उपलब्ध टैब से एकीकरण कनेक्ट करें' : 'Connect integrations from the Available tab to get started'}
                  </p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="px-8 py-3 text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] rounded-xl font-semibold hover:from-[#b69d74DD] hover:to-[#b69d74BB] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    {language === 'ta' ? 'उपलब्ध एकीकरण देखें' : 'View Available Integrations'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Available Integrations Tab */}
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {availableIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={getCardStyle(integration.id)}
                    onMouseEnter={() => setHoveredCard(integration.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="bg-gradient-to-br from-white to-[rgba(182,157,116,0.03)] p-6 rounded-2xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl bg-[rgba(182,157,116,0.10)] p-3 rounded-xl">
                            {integration.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#1f2839] text-lg">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-[#6b7280]">
                              {integration.category} • {integration.provider}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1.5 bg-[rgba(59,130,246,0.10)] text-[#3b82f6] rounded-full font-medium border border-[rgba(59,130,246,0.20)]">
                          Available
                        </span>
                      </div>

                      <p className="text-[#6b7280] mb-4 leading-relaxed">
                        {integration.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-[#1f2839] mb-3">
                          {language === 'ta' ? 'विशेषताएं:' : 'Features:'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {integration.features.map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs px-3 py-1.5 bg-[rgba(182,157,116,0.08)] text-[#b69d74] rounded-full font-medium border border-[rgba(182,157,116,0.15)]"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => connectIntegration(integration.id)}
                          disabled={connecting[integration.id]}
                          className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#10b981] to-[#10b981DD] border border-transparent rounded-xl hover:from-[#10b981DD] hover:to-[#10b981BB] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-50"
                        >
                          {connecting[integration.id] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {language === 'ta' ? 'कनेक्ट हो रहा है...' : 'Connecting...'}
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              {language === 'ta' ? 'कनेक्ट करें' : 'Connect'}
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => window.open(integration.documentation, '_blank')}
                          className="px-4 py-3 text-sm font-medium text-[#6b7280] bg-white border border-[rgba(31,40,57,0.15)] rounded-xl hover:bg-[rgba(182,157,116,0.05)] hover:text-[#b69d74] hover:border-[#b69d7440] transition-all duration-300 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {language === 'ta' ? 'डॉक्स' : 'Docs'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1f2839]">
                  {language === 'ta' ? 'सिंक इतिहास' : 'Sync History'}
                </h3>
                <div className="text-sm text-[#6b7280]">
                  {syncHistory.length} records
                </div>
              </div>
              
              <div className="space-y-4">
                {syncHistory.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-[rgba(182,157,116,0.10)] hover:border-[#b69d7440] transition-all duration-300 hover:shadow-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1.5 text-xs rounded-full font-semibold border ${getStatusColor(entry.status.toLowerCase())}`}>
                          {entry.status}
                        </span>
                        <div>
                          <span className="font-semibold text-[#1f2839]">
                            {entry.integration}
                          </span>
                          <span className="text-sm text-[#6b7280] ml-3">
                            {entry.action}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-[#6b7280] font-medium">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-[#6b7280]">
                        {entry.details}
                      </p>
                      {entry.records > 0 && (
                        <span className="text-xs px-2 py-1 bg-[rgba(182,157,116,0.08)] text-[#b69d74] rounded font-medium">
                          {entry.records} records
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Management Tab */}
          {activeTab === 'api' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-[#1f2839]">
                {language === 'ta' ? 'API प्रबंधन' : 'API Management'}
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* API Key Management */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[rgba(182,157,116,0.12)]">
                  <h4 className="font-bold text-[#1f2839] text-lg mb-6">
                    {language === 'ta' ? 'API कुंजी प्रबंधन' : 'API Key Management'}
                  </h4>
                  <div className="space-y-4">
                    {integrations.map((integration) => (
                      <div
                        key={integration.id}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-[rgba(182,157,116,0.10)] hover:border-[#b69d7440] transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{integration.icon}</span>
                          <div>
                            <div className="font-semibold text-[#1f2839]">
                              {integration.name}
                            </div>
                            <div className="text-xs text-[#6b7280]">
                              {integration.provider}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {apiKeys[integration.id] ? (
                            <span className="text-xs px-3 py-1.5 bg-[#10b98120] text-[#10b981] rounded-full font-medium border border-[#10b98140]">
                              Configured
                            </span>
                          ) : (
                            <span className="text-xs px-3 py-1.5 bg-[#f59e0b20] text-[#f59e0b] rounded-full font-medium border border-[#f59e0b40]">
                              Missing
                            </span>
                          )}
                          <button
                            onClick={() => openConfiguration(integration)}
                            className="text-sm font-medium text-[#b69d74] hover:text-[#1f2839] transition-colors duration-300"
                          >
                            {language === 'ta' ? 'कॉन्फ़िगर करें' : 'Configure'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Statistics */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[rgba(182,157,116,0.12)]">
                  <h4 className="font-bold text-[#1f2839] text-lg mb-6">
                    {language === 'ta' ? 'API आंकड़े' : 'API Statistics'}
                  </h4>
                  <div className="space-y-6">
                    {[
                      { label: language === 'ta' ? 'आज के अनुरोध' : 'Requests Today', value: '1,247', color: '#1f2839' },
                      { label: language === 'ta' ? 'सफलता दर' : 'Success Rate', value: '98.2%', color: '#10b981' },
                      { label: language === 'ta' ? 'औसत प्रतिक्रिया समय' : 'Avg Response Time', value: '342ms', color: '#3b82f6' },
                      { label: language === 'ta' ? 'दर सीमा शेष' : 'Rate Limit Remaining', value: '8,753', color: '#b69d74' }
                    ].map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-[#6b7280] font-medium">{stat.label}</span>
                        <span className="text-lg font-bold" style={{ color: stat.color }}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      {configuring && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-[rgba(182,157,116,0.15)] shadow-xl animate-scaleIn">
            <h3 className="text-xl font-bold text-[#1f2839] mb-6">
              {language === 'ta' ? 'एकीकरण कॉन्फ़िगरेशन' : 'Integration Configuration'}
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  {language === 'ta' ? 'API कुंजी' : 'API Key'}
                </label>
                <input
                  type="password"
                  value={configForm.apiKey}
                  onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                  className="w-full px-4 py-3 border border-[rgba(31,40,57,0.15)] rounded-xl bg-white text-[#1f2839] focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                  placeholder="Enter your API key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  {language === 'ta' ? 'एंडपॉइंट URL' : 'Endpoint URL'}
                </label>
                <input
                  type="url"
                  value={configForm.endpoint}
                  onChange={(e) => setConfigForm({ ...configForm, endpoint: e.target.value })}
                  className="w-full px-4 py-3 border border-[rgba(31,40,57,0.15)] rounded-xl bg-white text-[#1f2839] focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                    {language === 'ta' ? 'टाइमआउट' : 'Timeout'} (s)
                  </label>
                  <input
                    type="number"
                    value={configForm.timeout}
                    onChange={(e) => setConfigForm({ ...configForm, timeout: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-[rgba(31,40,57,0.15)] rounded-xl bg-white text-[#1f2839] focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                    {language === 'ta' ? 'पुनः प्रयास' : 'Retry Attempts'}
                  </label>
                  <input
                    type="number"
                    value={configForm.retryAttempts}
                    onChange={(e) => setConfigForm({ ...configForm, retryAttempts: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-[rgba(31,40,57,0.15)] rounded-xl bg-white text-[#1f2839] focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-[rgba(182,157,116,0.05)] rounded-xl border border-[rgba(182,157,116,0.10)]">
                <input
                  type="checkbox"
                  checked={configForm.enableLogging}
                  onChange={(e) => setConfigForm({ ...configForm, enableLogging: e.target.checked })}
                  className="h-5 w-5 text-[#b69d74] border-[rgba(31,40,57,0.15)] rounded focus:ring-[#b69d74]"
                />
                <span className="text-sm font-medium text-[#1f2839]">
                  {language === 'ta' ? 'लॉगिंग सक्षम करें' : 'Enable logging'}
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => {
                  setConfiguring(null);
                  setConfigForm({});
                }}
                className="flex-1 px-6 py-3 text-sm font-semibold text-[#6b7280] bg-white border border-[rgba(31,40,57,0.15)] rounded-xl hover:bg-[rgba(182,157,116,0.05)] hover:text-[#b69d74] hover:border-[#b69d7440] transition-all duration-300"
              >
                {language === 'ta' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={saveConfiguration}
                className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] border border-transparent rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74BB] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {language === 'ta' ? 'सेव करें' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;