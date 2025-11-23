import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SmsLog = () => {
  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, theme, language } = context || {};

  // State management
  const [activeTab, setActiveTab] = useState('history');
  const [smsHistory, setSmsHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [sending, setSending] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30'
  });
  const [bulkMessage, setBulkMessage] = useState({
    recipients: '',
    template: '',
    message: ''
  });

  // Extended color palette
  const colors = {
    // Primary Brand Colors
    cream: '#f5f5ef',
    navy: '#1f2839',
    gold: '#b69d74',
    gray: '#6b7280',
    
    // Extended Gold Variations
    goldLight: '#d4c4a8',
    goldDark: '#9c8460',
    goldLighter: '#f0e9dd',
    
    // Extended Status Colors
    success: '#10b981',
    successLight: '#34d399',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    info: '#3b82f6',
    infoLight: '#60a5fa',
    
    // Neutral Tones
    white: '#ffffff',
    white80: 'rgba(255, 255, 255, 0.8)',
    white60: 'rgba(255, 255, 255, 0.6)',
    black: '#000000',
    
    // Semantic Colors
    border: 'rgba(182, 157, 116, 0.2)',
    borderHover: 'rgba(182, 157, 116, 0.4)',
    shadow: 'rgba(31, 40, 57, 0.1)',
    overlay: 'rgba(182, 157, 116, 0.05)'
  };

  // Mock data with more entries for testing scroll
  const mockSmsHistory = [
    {
      id: 1,
      recipient: '+91-9876543210',
      recipientName: 'John Doe',
      message: 'Your hearing is scheduled for tomorrow at 10:00 AM in Court Room 1. Please bring all necessary documents.',
      status: 'Delivered',
      sentAt: '2023-12-20T14:30:00Z',
      template: 'Hearing Reminder',
      cost: 0.50,
      caseNumber: '2023/CRL/001'
    },
    {
      id: 2,
      recipient: '+91-9876543211',
      recipientName: 'Jane Smith',
      message: 'Case status updated: Your case hearing has been postponed to next week. We will inform you of the new date.',
      status: 'Sent',
      sentAt: '2023-12-20T12:15:00Z',
      template: 'Case Update',
      cost: 0.50,
      caseNumber: '2023/CIV/045'
    },
    {
      id: 3,
      recipient: '+91-9876543212',
      recipientName: 'Bob Wilson',
      message: 'Document submission deadline is approaching. Please submit before Dec 25 to avoid any penalties.',
      status: 'Failed',
      sentAt: '2023-12-20T10:00:00Z',
      template: 'Document Reminder',
      cost: 0.00,
      error: 'Invalid number',
      caseNumber: '2023/FAM/012'
    },
    {
      id: 4,
      recipient: '+91-9876543213',
      recipientName: 'Alice Johnson',
      message: 'Your affidavit has been received and is under review. We will contact you if additional information is needed.',
      status: 'Delivered',
      sentAt: '2023-12-19T16:45:00Z',
      template: 'Document Confirmation',
      cost: 0.50,
      caseNumber: '2023/PRO/078'
    },
    {
      id: 5,
      recipient: '+91-9876543214',
      recipientName: 'Michael Brown',
      message: 'Payment received for legal services. Thank you for your prompt payment.',
      status: 'Delivered',
      sentAt: '2023-12-19T11:20:00Z',
      template: 'Payment Confirmation',
      cost: 0.50,
      caseNumber: '2023/TAX/033'
    },
    {
      id: 6,
      recipient: '+91-9876543215',
      recipientName: 'Sarah Davis',
      message: 'Reminder: Court appearance required next Monday at 2:00 PM. Dress code: Formal attire.',
      status: 'Sent',
      sentAt: '2023-12-18T09:15:00Z',
      template: 'Court Reminder',
      cost: 0.50,
      caseNumber: '2023/FAM/067'
    }
  ];

  const mockTemplates = [
    {
      id: 1,
      name: 'Hearing Reminder',
      content: 'Your hearing is scheduled for {date} at {time} in {court}. Please be present on time with all required documents.',
      category: 'Reminders',
      variables: ['date', 'time', 'court'],
      active: true,
      usage: 156
    },
    {
      id: 2,
      name: 'Case Update',
      content: 'Case status updated: {update_message}. For details, contact your advocate at {advocate_contact}.',
      category: 'Updates',
      variables: ['update_message', 'advocate_contact'],
      active: true,
      usage: 89
    },
    {
      id: 3,
      name: 'Document Reminder',
      content: 'Document submission deadline is approaching. Please submit {document_type} before {deadline} to avoid delays.',
      category: 'Reminders',
      variables: ['document_type', 'deadline'],
      active: true,
      usage: 67
    },
    {
      id: 4,
      name: 'Payment Confirmation',
      content: 'Payment of {amount} received for {service}. Receipt number: {receipt_number}. Thank you for your payment.',
      category: 'Financial',
      variables: ['amount', 'service', 'receipt_number'],
      active: true,
      usage: 45
    }
  ];

  // Load data with animation delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSmsHistory(mockSmsHistory);
      setTemplates(mockTemplates);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter messages
  const filteredMessages = smsHistory.filter(message => {
    const matchesStatus = filters.status === 'all' || message.status.toLowerCase() === filters.status;
    
    const now = new Date();
    const messageDate = new Date(message.sentAt);
    const daysDiff = (now - messageDate) / (1000 * 60 * 60 * 24);
    const matchesDate = filters.dateRange === 'all' || daysDiff <= parseInt(filters.dateRange);
    
    return matchesStatus && matchesDate;
  });

  // Send bulk SMS
  const sendBulkSms = async () => {
    if (!bulkMessage.recipients || !bulkMessage.message) {
      addNotification?.({
        type: 'error',
        message: 'Please fill in recipients and message'
      });
      return;
    }

    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const recipients = bulkMessage.recipients.split('\n').filter(r => r.trim());
      const newMessages = recipients.map((recipient, index) => ({
        id: Date.now() + index,
        recipient: recipient.trim(),
        recipientName: `Contact ${index + 1}`,
        message: bulkMessage.message,
        status: Math.random() > 0.1 ? 'Sent' : 'Failed',
        sentAt: new Date().toISOString(),
        template: bulkMessage.template || 'Custom',
        cost: Math.random() > 0.1 ? 0.50 : 0.00
      }));
      
      setSmsHistory(prev => [...newMessages, ...prev]);
      setBulkMessage({ recipients: '', template: '', message: '' });
      
      addNotification?.({
        type: 'success',
        message: `Bulk SMS sent to ${recipients.length} recipients`
      });
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: 'Failed to send bulk SMS'
      });
    } finally {
      setSending(false);
    }
  };

  // Get status color based on palette
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return `text-[${colors.success}] bg-[${colors.success}]/10 border-[${colors.success}]/20`;
      case 'sent':
        return `text-[${colors.info}] bg-[${colors.info}]/10 border-[${colors.info}]/20`;
      case 'failed':
        return `text-[${colors.warning}] bg-[${colors.warning}]/10 border-[${colors.warning}]/20`;
      default:
        return `text-[${colors.gray}] bg-[${colors.gray}]/10 border-[${colors.gray}]/20`;
    }
  };

  // Tab change with smooth transition
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#f5f5ef] p-4 md:p-6 lg:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#b69d74]/20 p-6 md:p-8 transform transition-all duration-500 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1f2839] mb-2 md:mb-3 bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent break-words">
                SMS Communications
              </h1>
              <p className="text-[#6b7280] text-sm md:text-base lg:text-lg truncate md:whitespace-normal">
                Track and manage all your legal SMS communications in one place
              </p>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6 mt-4 lg:mt-0 flex-shrink-0">
              <div className="flex items-center space-x-2 text-xs md:text-sm">
                <div className="flex items-center space-x-1 text-[#10b981]">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-[#10b981] rounded-full animate-pulse"></div>
                  <span className="whitespace-nowrap">{smsHistory.filter(m => m.status === 'Delivered').length} Delivered</span>
                </div>
                <div className="flex items-center space-x-1 text-[#f59e0b]">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-[#f59e0b] rounded-full"></div>
                  <span className="whitespace-nowrap">{smsHistory.filter(m => m.status === 'Failed').length} Failed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#b69d74]/20 overflow-hidden transform transition-all duration-500 min-h-[600px] flex flex-col">
          {/* Animated Tabs Navigation */}
          <div className="border-b border-[#b69d74]/10 bg-gradient-to-r from-white to-[#f5f5ef] flex-shrink-0">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {[
                { key: 'history', label: 'Message History', icon: '📨' },
                { key: 'templates', label: 'Templates', icon: '📋' },
                { key: 'bulk', label: 'Bulk SMS', icon: '📤' },
                { key: 'analytics', label: 'Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex-1 min-w-[140px] py-4 px-4 md:px-6 text-sm font-semibold border-b-2 transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-[#b69d74] text-[#b69d74] bg-white/50'
                      : 'border-transparent text-[#6b7280] hover:text-[#1f2839]'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-base md:text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {/* Enhanced History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4 md:space-y-6 animate-fadeIn h-full">
                {/* Simplified Filters */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 p-4 bg-[#b69d74]/5 rounded-xl border border-[#b69d74]/10">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <label className="text-sm font-medium text-[#1f2839] whitespace-nowrap">
                      Status:
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="text-sm border border-[#b69d74]/30 rounded-lg px-3 py-2 bg-white/80 text-[#1f2839] focus:ring-2 focus:ring-[#b69d74]/30 focus:border-[#b69d74] transition-all duration-300 min-w-[120px]"
                    >
                      <option value="all">All Status</option>
                      <option value="delivered">Delivered</option>
                      <option value="sent">Sent</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 md:space-x-3">
                    <label className="text-sm font-medium text-[#1f2839] whitespace-nowrap">
                      Period:
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                      className="text-sm border border-[#b69d74]/30 rounded-lg px-3 py-2 bg-white/80 text-[#1f2839] focus:ring-2 focus:ring-[#b69d74]/30 focus:border-[#b69d74] transition-all duration-300 min-w-[140px]"
                    >
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 3 months</option>
                      <option value="all">All time</option>
                    </select>
                  </div>
                </div>

                {/* Enhanced Messages List */}
                <div className="space-y-3 md:space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#b69d74] scrollbar-track-[#f5f5ef]">
                  {filteredMessages.map((message, index) => (
                    <div 
                      key={message.id}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-[#b69d74]/10 hover:border-[#b69d74]/30 hover:shadow-md transition-all duration-500 transform hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 md:mb-4 gap-3">
                        <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#b69d74] to-[#b69d74]/80 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {message.recipientName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-[#1f2839] truncate">
                              {message.recipientName}
                            </h4>
                            <p className="text-sm text-[#6b7280] truncate">
                              {message.recipient}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`px-2 py-1 md:px-3 md:py-1.5 text-xs rounded-full font-semibold border ${getStatusColor(message.status)} whitespace-nowrap`}>
                            {message.status}
                          </span>
                          <p className="text-xs text-[#6b7280] mt-1 md:mt-2 whitespace-nowrap">
                            {new Date(message.sentAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3 md:mb-4">
                        <p className="text-[#1f2839] bg-white/50 p-3 md:p-4 rounded-lg border border-[#b69d74]/10 text-sm leading-relaxed break-words">
                          {message.message}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-[#6b7280] gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-[#b69d74]/10 text-[#b69d74] px-2 py-1 rounded text-xs whitespace-nowrap">
                            {message.template}
                          </span>
                          {message.caseNumber && (
                            <span className="bg-[#1f2839]/10 text-[#1f2839] px-2 py-1 rounded text-xs whitespace-nowrap">
                              Case: {message.caseNumber}
                            </span>
                          )}
                          <span className="font-medium whitespace-nowrap">₹{message.cost}</span>
                        </div>
                        {message.error && (
                          <span className="text-[#f59e0b] text-xs sm:text-right break-words">
                            {message.error}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredMessages.length === 0 && (
                  <div className="text-center py-8 md:py-12 animate-pulse flex flex-col items-center justify-center h-64">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#b69d74]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl md:text-3xl">📨</span>
                    </div>
                    <p className="text-[#6b7280] text-base md:text-lg">
                      No SMS messages found
                    </p>
                    <p className="text-[#6b7280] text-sm mt-2">
                      Try adjusting your filters
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4 md:space-y-6 animate-fadeIn h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 auto-rows-max">
                  {templates.map((template, index) => (
                    <div 
                      key={template.id}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-[#b69d74]/10 hover:border-[#b69d74]/30 hover:shadow-md transition-all duration-500 transform hover:-translate-y-1 h-fit"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-[#1f2839] text-base md:text-lg truncate">
                            {template.name}
                          </h4>
                          <p className="text-sm text-[#6b7280] truncate">
                            {template.category} • Used {template.usage} times
                          </p>
                        </div>
                        <span className={`px-2 py-1 md:px-3 md:py-1.5 text-xs rounded-full font-semibold border flex-shrink-0 ml-2 ${
                          template.active 
                            ? 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20' 
                            : 'text-[#6b7280] bg-[#6b7280]/10 border-[#6b7280]/20'
                        }`}>
                          {template.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="mb-3 md:mb-4">
                        <p className="text-[#1f2839] bg-white/50 p-3 rounded-lg border border-[#b69d74]/10 text-sm leading-relaxed break-words min-h-[80px]">
                          {template.content}
                        </p>
                      </div>

                      <div className="mb-3 md:mb-4">
                        <p className="text-xs font-semibold text-[#1f2839] mb-2">Variables:</p>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {template.variables.map((variable, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-[#b69d74]/10 text-[#b69d74] rounded-full border border-[#b69d74]/20 break-keep">
                              {`{${variable}}`}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setBulkMessage({ ...bulkMessage, template: template.name, message: template.content })}
                          className="flex-1 px-3 py-2 md:px-4 md:py-2.5 text-sm font-semibold text-[#b69d74] bg-[#b69d74]/10 border border-[#b69d74]/20 rounded-lg hover:bg-[#b69d74] hover:text-white transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Bulk SMS Tab */}
            {activeTab === 'bulk' && (
              <div className="space-y-4 md:space-y-6 animate-fadeIn h-full">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1f2839] mb-2 md:mb-3">
                        Recipients (one number per line)
                      </label>
                      <textarea
                        value={bulkMessage.recipients}
                        onChange={(e) => setBulkMessage({ ...bulkMessage, recipients: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-[#b69d74]/30 rounded-xl bg-white/80 text-[#1f2839] placeholder-[#6b7280] focus:ring-2 focus:ring-[#b69d74]/30 focus:border-[#b69d74] transition-all duration-300 resize-none text-sm md:text-base"
                        placeholder="+91-9876543210&#10;+91-9876543211&#10;+91-9876543212"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1f2839] mb-2 md:mb-3">
                        Select Template
                      </label>
                      <select
                        value={bulkMessage.template}
                        onChange={(e) => {
                          const selectedTemplate = templates.find(t => t.name === e.target.value);
                          setBulkMessage({ 
                            ...bulkMessage, 
                            template: e.target.value,
                            message: selectedTemplate ? selectedTemplate.content : bulkMessage.message
                          });
                        }}
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-[#b69d74]/30 rounded-xl bg-white/80 text-[#1f2839] focus:ring-2 focus:ring-[#b69d74]/30 focus:border-[#b69d74] transition-all duration-300 text-sm md:text-base"
                      >
                        <option value="">Custom Message</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.name}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1f2839] mb-2 md:mb-3">
                        Message Content
                      </label>
                      <textarea
                        value={bulkMessage.message}
                        onChange={(e) => setBulkMessage({ ...bulkMessage, message: e.target.value })}
                        rows={6}
                        maxLength={160}
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-[#b69d74]/30 rounded-xl bg-white/80 text-[#1f2839] placeholder-[#6b7280] focus:ring-2 focus:ring-[#b69d74]/30 focus:border-[#b69d74] transition-all duration-300 resize-none text-sm md:text-base"
                        placeholder="Enter your message..."
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-[#6b7280]">
                          {bulkMessage.message.length}/160 characters
                        </p>
                        <div className={`w-3 h-3 rounded-full ${bulkMessage.message.length > 140 ? 'bg-[#f59e0b] animate-pulse' : 'bg-[#10b981]'}`}></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#b69d74]/5 to-[#b69d74]/10 p-3 md:p-4 rounded-xl border border-[#b69d74]/20">
                      <h4 className="font-semibold text-[#1f2839] mb-1 md:mb-2 text-sm md:text-base">💡 Pro Tip</h4>
                      <p className="text-xs md:text-sm text-[#6b7280] leading-relaxed">
                        Keep messages under 160 characters to avoid splitting into multiple SMS and reduce costs. Use templates for consistent messaging.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 md:pt-6 border-t border-[#b69d74]/10">
                  <button
                    onClick={() => setBulkMessage({ recipients: '', template: '', message: '' })}
                    className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-[#6b7280] bg-white/80 border border-[#b69d74]/30 rounded-xl hover:bg-[#b69d74]/5 hover:text-[#1f2839] transition-all duration-300 transform hover:scale-105 order-2 sm:order-1"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={sendBulkSms}
                    disabled={sending || !bulkMessage.recipients || !bulkMessage.message}
                    className="px-6 py-2 md:px-8 md:py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74]/80 border border-[#b69d74] rounded-xl hover:from-[#b69d74]/90 hover:to-[#b69d74]/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 order-1 sm:order-2"
                  >
                    {sending && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    )}
                    <span>{sending ? 'Sending...' : 'Send Bulk SMS'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 md:space-y-8 animate-fadeIn h-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { 
                      label: 'Total SMS', 
                      value: smsHistory.length, 
                      icon: '📨', 
                      color: 'from-white/80 to-[#b69d74]/5',
                      border: 'border-[#b69d74]/10'
                    },
                    { 
                      label: 'Delivered', 
                      value: smsHistory.filter(m => m.status === 'Delivered').length, 
                      icon: '✅', 
                      color: 'from-white/80 to-[#10b981]/5',
                      border: 'border-[#10b981]/10'
                    },
                    { 
                      label: 'Failed', 
                      value: smsHistory.filter(m => m.status === 'Failed').length, 
                      icon: '⚠️', 
                      color: 'from-white/80 to-[#f59e0b]/5',
                      border: 'border-[#f59e0b]/10'
                    },
                    { 
                      label: 'Total Cost', 
                      value: `₹${smsHistory.reduce((sum, m) => sum + m.cost, 0).toFixed(2)}`, 
                      icon: '💰', 
                      color: 'from-white/80 to-[#3b82f6]/5',
                      border: 'border-[#3b82f6]/10'
                    }
                  ].map((stat, index) => (
                    <div 
                      key={stat.label}
                      className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-4 md:p-6 border ${stat.border} hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#b69d74]/10 rounded-xl flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                          <span className="text-xl md:text-2xl">{stat.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#6b7280] truncate">
                            {stat.label}
                          </p>
                          <p className="text-lg md:text-2xl font-bold text-[#1f2839] truncate">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Template Usage Visualization */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 lg:p-8 border border-[#b69d74]/10">
                  <h3 className="text-lg md:text-xl font-bold text-[#1f2839] mb-4 md:mb-6 bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
                    Template Usage Analytics
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {templates.map((template, index) => (
                      <div key={template.id} className="flex flex-col sm:flex-row sm:items-center justify-between group hover:bg-white/50 p-3 rounded-xl transition-all duration-300 gap-2">
                        <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#b69d74] to-[#b69d74]/80 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-[#1f2839] text-sm md:text-base block truncate">
                              {template.name}
                            </span>
                            <p className="text-xs text-[#6b7280] truncate">
                              {template.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto">
                          <div className="flex-1 sm:flex-none sm:w-24 md:w-32 bg-[#b69d74]/10 rounded-full h-2 md:h-3">
                            <div
                              className="bg-gradient-to-r from-[#b69d74] to-[#b69d74]/80 h-2 md:h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${(template.usage / Math.max(...templates.map(t => t.usage))) * 100}%`,
                                animationDelay: `${index * 200}ms`
                              }}
                            ></div>
                          </div>
                          <span className="font-bold text-[#1f2839] text-sm md:text-base w-8 md:w-12 text-right">
                            {template.usage}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsLog;