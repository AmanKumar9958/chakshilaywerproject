import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Professional Icons Component
const IntegrationIcons = {
  ecourts: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  legalbreach: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  indiankanoon: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  sms_gateway: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  email_service: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  document_scanner: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  sync: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  test: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  settings: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  add: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  docs: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  disconnect: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

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

  // Load initial data - Fixed useEffect dependency
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
  }, []); // Empty dependency array since we're using mock data

  // Auto-sync functionality - Fixed useEffect dependency
  useEffect(() => {
    const interval = setInterval(() => {
      integrations.forEach(integration => {
        if (Math.random() > 0.95) {
          performSync(integration.id, 'auto');
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [integrations]); // Added integrations as dependency

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
          ...prev[integrationId],
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
        return 'text-[#ef4444] bg-[#ef444420] border-[#ef444440]';
      case 'partial':
        return 'text-[#3b82f6] bg-[#3b82f620] border-[#3b82f640]';
      default:
        return 'text-[#6b7280] bg-[#6b728020] border-[#6b728040]';
    }
  };

  // Card hover animation style
  const getCardStyle = (integrationId) => {
    const baseStyle = "transform transition-all duration-300 ease-out border bg-white rounded-xl";
    
    if (hoveredCard === integrationId) {
      return `${baseStyle} scale-[1.02] border-[#b69d7460] shadow-lg`;
    }
    
    return `${baseStyle} scale-100 border-gray-200 hover:border-[#b69d7440] shadow-sm`;
  };

  // Get integration icon
  const getIntegrationIcon = (integrationId) => {
    const IconComponent = IntegrationIcons[integrationId] || IntegrationIcons.docs;
    return <IconComponent />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {language === 'ta' ? 'एकीकरण' : 'Integrations'}
            </h1>
            <p className="text-gray-600 text-lg">
              {language === 'ta' ? 'बाहरी सेवाओं और डेटाबेस के साथ कनेक्ट करें' : 'Connect with external services and databases'}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-6 lg:mt-0">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="font-semibold">{integrations.length} Active</span>
              </div>
              <div className="flex items-center text-blue-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-semibold">{availableIntegrations.length} Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
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
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-[#b69d74] bg-[rgba(182,157,116,0.10)] p-3 rounded-xl">
                              {getIntegrationIcon(integration.id)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {integration.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {integration.category} • {integration.provider}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              syncStatus[integration.id]?.status === 'success' ? 'bg-green-500 animate-pulse' :
                              syncStatus[integration.id]?.status === 'error' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}></div>
                            <span className="text-xs font-medium text-gray-600 capitalize">
                              {syncStatus[integration.id]?.status || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 leading-relaxed">
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
                          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-gray-600 text-xs font-medium mb-1">Last Sync</div>
                                <div className="text-gray-900 font-semibold">
                                  {new Date(syncStatus[integration.id].lastSync).toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600 text-xs font-medium mb-1">Next Sync</div>
                                <div className="text-gray-900 font-semibold">
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
                            <IntegrationIcons.sync />
                            <span className="ml-2">{language === 'ta' ? 'सिंक करें' : 'Sync Now'}</span>
                          </button>
                          
                          <button
                            onClick={() => testConnection(integration.id)}
                            disabled={testingConnection[integration.id]}
                            className="p-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-[#b69d74] hover:border-[#b69d7440] transition-all duration-300 disabled:opacity-50"
                          >
                            {testingConnection[integration.id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#b69d74]"></div>
                            ) : (
                              <IntegrationIcons.test />
                            )}
                          </button>

                          <button
                            onClick={() => openConfiguration(integration)}
                            className="p-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-[#b69d74] hover:border-[#b69d7440] transition-all duration-300"
                          >
                            <IntegrationIcons.settings />
                          </button>

                          <button
                            onClick={() => disconnectIntegration(integration.id)}
                            className="p-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
                            title="Disconnect"
                          >
                            <IntegrationIcons.disconnect />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-[rgba(182,157,116,0.08)] rounded-full flex items-center justify-center">
                    <IntegrationIcons.sync />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {language === 'ta' ? 'कोई सक्रिय एकीकरण नहीं' : 'No Active Integrations'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-[#b69d74] bg-[rgba(182,157,116,0.10)] p-3 rounded-xl">
                            {getIntegrationIcon(integration.id)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {integration.category} • {integration.provider}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium border border-blue-200">
                          Available
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {integration.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
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
                          className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] border border-transparent rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74BB] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-50"
                        >
                          {connecting[integration.id] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {language === 'ta' ? 'कनेक्ट हो रहा है...' : 'Connecting...'}
                            </>
                          ) : (
                            <>
                              <IntegrationIcons.add />
                              <span className="ml-2">{language === 'ta' ? 'कनेक्ट करें' : 'Connect'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => window.open(integration.documentation, '_blank')}
                          className="px-4 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-[#b69d74] hover:border-[#b69d7440] transition-all duration-300 flex items-center"
                        >
                          <IntegrationIcons.docs />
                          <span className="ml-2">{language === 'ta' ? 'डॉक्स' : 'Docs'}</span>
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
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'ta' ? 'सिंक इतिहास' : 'Sync History'}
                </h3>
                <div className="text-sm text-gray-600">
                  {syncHistory.length} records
                </div>
              </div>
              
              <div className="space-y-4">
                {syncHistory.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1.5 text-xs rounded-full font-semibold border ${getStatusColor(entry.status.toLowerCase())}`}>
                          {entry.status}
                        </span>
                        <div>
                          <span className="font-semibold text-gray-900">
                            {entry.integration}
                          </span>
                          <span className="text-sm text-gray-600 ml-3">
                            {entry.action}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-gray-600">
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
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ta' ? 'API प्रबंधन' : 'API Management'}
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* API Key Management */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-6">
                    {language === 'ta' ? 'API कुंजी प्रबंधन' : 'API Key Management'}
                  </h4>
                  <div className="space-y-4">
                    {integrations.map((integration) => (
                      <div
                        key={integration.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-[#b69d74]">
                            {getIntegrationIcon(integration.id)}
                          </span>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {integration.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {integration.provider}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {apiKeys[integration.id] ? (
                            <span className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-full font-medium border border-green-200">
                              Configured
                            </span>
                          ) : (
                            <span className="text-xs px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-full font-medium border border-yellow-200">
                              Missing
                            </span>
                          )}
                          <button
                            onClick={() => openConfiguration(integration)}
                            className="text-sm font-medium text-[#b69d74] hover:text-gray-900 transition-colors duration-300"
                          >
                            {language === 'ta' ? 'कॉन्फ़िगर करें' : 'Configure'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Statistics */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-6">
                    {language === 'ta' ? 'API आंकड़े' : 'API Statistics'}
                  </h4>
                  <div className="space-y-6">
                    {[
                      { label: language === 'ta' ? 'आज के अनुरोध' : 'Requests Today', value: '1,247', color: '#1f2937' },
                      { label: language === 'ta' ? 'सफलता दर' : 'Success Rate', value: '98.2%', color: '#10b981' },
                      { label: language === 'ta' ? 'औसत प्रतिक्रिया समय' : 'Avg Response Time', value: '342ms', color: '#3b82f6' },
                      { label: language === 'ta' ? 'दर सीमा शेष' : 'Rate Limit Remaining', value: '8,753', color: '#b69d74' }
                    ].map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">{stat.label}</span>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-gray-200 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'ta' ? 'एकीकरण कॉन्फ़िगरेशन' : 'Integration Configuration'}
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {language === 'ta' ? 'API कुंजी' : 'API Key'}
                </label>
                <input
                  type="password"
                  value={configForm.apiKey}
                  onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                  placeholder="Enter your API key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {language === 'ta' ? 'एंडपॉइंट URL' : 'Endpoint URL'}
                </label>
                <input
                  type="url"
                  value={configForm.endpoint}
                  onChange={(e) => setConfigForm({ ...configForm, endpoint: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {language === 'ta' ? 'टाइमआउट' : 'Timeout'} (s)
                  </label>
                  <input
                    type="number"
                    value={configForm.timeout}
                    onChange={(e) => setConfigForm({ ...configForm, timeout: parseInt(e.target.value) || 30 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {language === 'ta' ? 'पुनः प्रयास' : 'Retry Attempts'}
                  </label>
                  <input
                    type="number"
                    value={configForm.retryAttempts}
                    onChange={(e) => setConfigForm({ ...configForm, retryAttempts: parseInt(e.target.value) || 3 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  checked={configForm.enableLogging}
                  onChange={(e) => setConfigForm({ ...configForm, enableLogging: e.target.checked })}
                  className="h-5 w-5 text-[#b69d74] border-gray-300 rounded focus:ring-[#b69d74]"
                />
                <span className="text-sm font-medium text-gray-900">
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
                className="flex-1 px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-300"
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