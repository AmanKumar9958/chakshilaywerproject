import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OfflineModeToggle = () => {
  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, theme, language } = context || {};

  // State management
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineMode, setOfflineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [offlineData, setOfflineData] = useState({
    cases: [],
    pendingChanges: [],
    lastSync: null,
    cacheSize: 0
  });
  const [autoSync, setAutoSync] = useState(true);
  const [cacheSettings, setCacheSettings] = useState({
    maxSize: 50,
    retentionDays: 7,
    autoCleanup: true
  });

  // Mock offline data
  const mockOfflineData = {
    cases: [
      {
        id: 1,
        number: '2023/CRL/001',
        title: 'State vs John Doe',
        status: 'Active',
        lastModified: '2023-12-20T10:30:00Z',
        syncStatus: 'synced'
      },
      {
        id: 2,
        number: '2023/CIV/045',
        title: 'Property Dispute Case',
        status: 'Pending',
        lastModified: '2023-12-19T15:45:00Z',
        syncStatus: 'pending'
      }
    ],
    pendingChanges: [
      {
        id: 1,
        type: 'case_update',
        caseId: 1,
        changes: { status: 'Under Review' },
        timestamp: '2023-12-20T14:30:00Z',
        retryCount: 0
      }
    ],
    lastSync: '2023-12-20T12:00:00Z',
    cacheSize: 25.7
  };

  // Initialize offline data
  useEffect(() => {
    const savedData = localStorage.getItem('clerk-offline-data');
    if (savedData) {
      try {
        setOfflineData(JSON.parse(savedData));
      } catch (error) {
        setOfflineData(mockOfflineData);
      }
    } else {
      setOfflineData(mockOfflineData);
    }

    const savedSettings = localStorage.getItem('clerk-cache-settings');
    if (savedSettings) {
      try {
        setCacheSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading cache settings:', error);
      }
    }
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification?.({
        type: 'success',
        message: language === 'ta' ? 'इंटरनेट कनेक्शन बहाल हो गया' : 'Internet connection restored'
      });
      
      if (autoSync && offlineData.pendingChanges.length > 0) {
        performSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineMode(true);
      addNotification?.({
        type: 'warning',
        message: language === 'ta' ? 'ऑफलाइन मोड में स्विच हो गया' : 'Switched to offline mode'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSync, offlineData.pendingChanges, addNotification, language]);

  // Auto-sync when online
  useEffect(() => {
    if (isOnline && autoSync && offlineData.pendingChanges.length > 0) {
      const syncTimer = setTimeout(() => {
        performSync();
      }, 3000);

      return () => clearTimeout(syncTimer);
    }
  }, [isOnline, autoSync, offlineData.pendingChanges]);

  // Toggle offline mode
  const toggleOfflineMode = useCallback(() => {
    const newMode = !offlineMode;
    setOfflineMode(newMode);
    
    if (newMode) {
      addNotification?.({
        type: 'info',
        message: language === 'ta' ? 'ऑफलाइन मोड सक्षम किया गया' : 'Offline mode enabled'
      });
      cacheCurrentData();
    } else if (isOnline) {
      addNotification?.({
        type: 'info',
        message: language === 'ta' ? 'ऑनलाइन मोड में वापस' : 'Back to online mode'
      });
      if (offlineData.pendingChanges.length > 0) {
        performSync();
      }
    }
  }, [offlineMode, isOnline, offlineData.pendingChanges, addNotification, language]);

  // Cache current data
  const cacheCurrentData = useCallback(() => {
    const currentData = {
      ...offlineData,
      lastSync: new Date().toISOString(),
      cacheSize: Math.random() * 30 + 20
    };
    
    setOfflineData(currentData);
    localStorage.setItem('clerk-offline-data', JSON.stringify(currentData));
    
    addNotification?.({
      type: 'success',
      message: language === 'ta' ? 'डेटा कैश किया गया' : 'Data cached successfully'
    });
  }, [offlineData, addNotification, language]);

  // Perform sync
  const performSync = useCallback(async () => {
    if (!isOnline) {
      addNotification?.({
        type: 'error',
        message: language === 'ta' ? 'सिंक के लिए इंटरनेट कनेक्शन चाहिए' : 'Internet connection required for sync'
      });
      return;
    }

    setSyncStatus('syncing');
    
    try {
      for (let i = 0; i < offlineData.pendingChanges.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const updatedData = {
        ...offlineData,
        pendingChanges: [],
        lastSync: new Date().toISOString()
      };
      
      setOfflineData(updatedData);
      localStorage.setItem('clerk-offline-data', JSON.stringify(updatedData));
      setSyncStatus('success');
      
      addNotification?.({
        type: 'success',
        message: language === 'ta' ? `${offlineData.pendingChanges.length} परिवर्तन सिंक किए गए` : `${offlineData.pendingChanges.length} changes synced`
      });

      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      addNotification?.({
        type: 'error',
        message: language === 'ta' ? 'सिंक असफल हुआ' : 'Sync failed'
      });
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, [isOnline, offlineData, addNotification, language]);

  // Clear cache
  const clearCache = useCallback(() => {
    if (window.confirm(language === 'ta' ? 'क्या आप कैश क्लियर करना चाहते हैं?' : 'Are you sure you want to clear the cache?')) {
      const clearedData = {
        cases: [],
        pendingChanges: [],
        lastSync: null,
        cacheSize: 0
      };
      
      setOfflineData(clearedData);
      localStorage.removeItem('clerk-offline-data');
      
      addNotification?.({
        type: 'success',
        message: language === 'ta' ? 'कैश क्लियर किया गया' : 'Cache cleared'
      });
    }
  }, [addNotification, language]);

  // Save cache settings
  const saveCacheSettings = useCallback(() => {
    localStorage.setItem('clerk-cache-settings', JSON.stringify(cacheSettings));
    addNotification?.({
      type: 'success',
      message: language === 'ta' ? 'कैश सेटिंग्स सेव की गईं' : 'Cache settings saved'
    });
  }, [cacheSettings, addNotification, language]);

  // Status color functions
  const getConnectionStatusColor = () => {
    if (!isOnline) return 'text-[#f59e0b] bg-[#f59e0b15] border border-[#f59e0b30]';
    if (offlineMode) return 'text-[#b69d74] bg-[#b69d7410] border border-[#b69d7430]';
    return 'text-[#10b981] bg-[#10b98115] border border-[#10b98130]';
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-[#3b82f6] bg-[#3b82f615] border border-[#3b82f630]';
      case 'success': return 'text-[#10b981] bg-[#10b98115] border border-[#10b98130]';
      case 'error': return 'text-[#f59e0b] bg-[#f59e0b15] border border-[#f59e0b30]';
      default: return 'text-[#6b7280] bg-[#6b728010] border border-[#6b728020]';
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5ef] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#b69d7430] p-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#1f2839] mb-3 bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
                {language === 'ta' ? 'ऑफलाइन मोड' : 'Offline Mode'}
              </h1>
              <p className="text-[#6b7280] text-lg">
                {language === 'ta' ? 'इंटरनेट कनेक्टिविटी प्रबंधन और ऑफलाइन डेटा सिंक' : 'Manage internet connectivity and offline data sync'}
              </p>
            </div>

            <div className="flex items-center space-x-6 mt-6 lg:mt-0">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-[#b69d7420]">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}`}></div>
                <span className="text-sm font-semibold text-[#1f2839]">
                  {isOnline ? (language === 'ta' ? 'ऑनलाइन' : 'Online') : (language === 'ta' ? 'ऑफलाइन' : 'Offline')}
                </span>
              </div>

              <button
                onClick={toggleOfflineMode}
                className={`relative inline-flex items-center h-8 rounded-full w-16 transition-all duration-500 transform ${
                  offlineMode 
                    ? 'bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] shadow-lg shadow-[#b69d7440]' 
                    : 'bg-gradient-to-r from-[#10b981] to-[#10b981DD] shadow-lg shadow-[#10b98140]'
                }`}
              >
                <span className={`inline-block w-6 h-6 transform bg-white rounded-full transition-all duration-500 shadow-lg ${
                  offlineMode ? 'translate-x-2' : 'translate-x-8'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connection Status */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-[#b69d7420] transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#b69d7410] to-[#b69d7405] group-hover:from-[#b69d7415] group-hover:to-[#b69d7410] transition-all duration-300">
                <svg className="h-8 w-8 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-[#6b7280]">
                  {language === 'ta' ? 'कनेक्शन स्थिति' : 'Connection Status'}
                </p>
                <span className={`px-3 py-1 text-xs rounded-full font-semibold mt-1 inline-block ${getConnectionStatusColor()}`}>
                  {!isOnline ? (language === 'ta' ? 'ऑफलाइन' : 'Offline') :
                   offlineMode ? (language === 'ta' ? 'ऑफलाइन मोड' : 'Offline Mode') :
                   (language === 'ta' ? 'ऑनलाइन' : 'Online')}
                </span>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-[#b69d7420] transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#3b82f610] to-[#3b82f605] group-hover:from-[#3b82f615] group-hover:to-[#3b82f610] transition-all duration-300">
                <svg className="h-8 w-8 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-[#6b7280]">
                  {language === 'ta' ? 'सिंक स्थिति' : 'Sync Status'}
                </p>
                <span className={`px-3 py-1 text-xs rounded-full font-semibold mt-1 inline-block ${getSyncStatusColor()}`}>
                  {syncStatus === 'idle' ? (language === 'ta' ? 'निष्क्रिय' : 'Idle') :
                   syncStatus === 'syncing' ? (language === 'ta' ? 'सिंक हो रहा है' : 'Syncing') :
                   syncStatus === 'success' ? (language === 'ta' ? 'सफल' : 'Success') :
                   (language === 'ta' ? 'त्रुटि' : 'Error')}
                </span>
              </div>
            </div>
          </div>

          {/* Last Sync */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-[#b69d7420] transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#f59e0b10] to-[#f59e0b05] group-hover:from-[#f59e0b15] group-hover:to-[#f59e0b10] transition-all duration-300">
                <svg className="h-8 w-8 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-[#6b7280]">
                  {language === 'ta' ? 'अंतिम सिंक' : 'Last Sync'}
                </p>
                <p className="text-sm font-bold text-[#1f2839]">
                  {offlineData.lastSync ? new Date(offlineData.lastSync).toLocaleString() : (language === 'ta' ? 'कभी नहीं' : 'Never')}
                </p>
              </div>
            </div>
          </div>

          {/* Cache Size */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-[#b69d7420] transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#10b98110] to-[#10b98105] group-hover:from-[#10b98115] group-hover:to-[#10b98110] transition-all duration-300">
                <svg className="h-8 w-8 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-[#6b7280]">
                  {language === 'ta' ? 'कैश साइज' : 'Cache Size'}
                </p>
                <p className="text-sm font-bold text-[#1f2839]">
                  {offlineData.cacheSize.toFixed(1)} MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Offline Data */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#b69d7430] p-8 transform transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#1f2839] bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
                {language === 'ta' ? 'ऑफलाइन डेटा' : 'Offline Data'}
              </h2>
              <div className="flex space-x-3">
                {isOnline && (
                  <button
                    onClick={performSync}
                    disabled={syncStatus === 'syncing'}
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#3b82f6] to-[#3b82f6DD] rounded-xl hover:from-[#3b82f6DD] hover:to-[#3b82f6] disabled:opacity-50 flex items-center transform transition-all duration-300 hover:scale-105 shadow-lg shadow-[#3b82f640]"
                  >
                    {syncStatus === 'syncing' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                    <svg className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'hidden' : 'inline'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {language === 'ta' ? 'सिंक करें' : 'Sync'}
                  </button>
                )}
                <button
                  onClick={cacheCurrentData}
                  className="px-6 py-3 text-sm font-semibold text-[#1f2839] bg-gradient-to-r from-[#b69d7410] to-[#b69d7408] rounded-xl hover:from-[#b69d7415] hover:to-[#b69d7410] flex items-center transform transition-all duration-300 hover:scale-105 border border-[#b69d7430]"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {language === 'ta' ? 'कैश करें' : 'Cache'}
                </button>
              </div>
            </div>

            {/* Pending Changes */}
            {offlineData.pendingChanges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#f59e0b] mb-4 flex items-center">
                  <div className="w-2 h-2 bg-[#f59e0b] rounded-full mr-2 animate-pulse"></div>
                  {language === 'ta' ? 'पेंडिंग परिवर्तन' : 'Pending Changes'} 
                  <span className="ml-2 bg-[#f59e0b20] text-[#f59e0b] px-2 py-1 rounded-full text-sm">
                    {offlineData.pendingChanges.length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {offlineData.pendingChanges.map((change) => (
                    <div key={change.id} className="bg-gradient-to-r from-[#f59e0b08] to-[#f59e0b05] p-4 rounded-xl border border-[#f59e0b30] transform transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold text-[#f59e0b] bg-[#f59e0b15] px-2 py-1 rounded-full">
                            {change.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <p className="text-sm text-[#6b7280] mt-2">
                            {change.type === 'case_update' ? `Case #${change.caseId} - Status updated` :
                             change.type === 'document_upload' ? `Document: ${change.data.fileName}` :
                             'Unknown change'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#f59e0b] font-semibold">
                            {new Date(change.timestamp).toLocaleString()}
                          </p>
                          {change.retryCount > 0 && (
                            <p className="text-xs text-[#f59e0b] mt-1">
                              Retry: {change.retryCount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cached Cases */}
            <div>
              <h3 className="text-lg font-semibold text-[#1f2839] mb-4 flex items-center">
                <div className="w-2 h-2 bg-[#b69d74] rounded-full mr-2"></div>
                {language === 'ta' ? 'कैश किए गए मामले' : 'Cached Cases'}
                <span className="ml-2 bg-[#b69d7415] text-[#b69d74] px-2 py-1 rounded-full text-sm">
                  {offlineData.cases.length}
                </span>
              </h3>
              <div className="space-y-3">
                {offlineData.cases.map((caseItem) => (
                  <div key={caseItem.id} className="bg-gradient-to-r from-[#b69d7408] to-[#b69d7405] p-4 rounded-xl border border-[#b69d7430] transform transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-[#1f2839] group-hover:text-[#b69d74] transition-colors duration-300">
                          {caseItem.number}
                        </span>
                        <p className="text-sm text-[#6b7280] mt-1">
                          {caseItem.title}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          caseItem.syncStatus === 'synced' 
                            ? 'bg-[#10b98115] text-[#10b981] border border-[#10b98130]' 
                            : 'bg-[#f59e0b15] text-[#f59e0b] border border-[#f59e0b30]'
                        }`}>
                          {caseItem.syncStatus}
                        </span>
                        <p className="text-xs text-[#6b7280] mt-2">
                          {new Date(caseItem.lastModified).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#b69d7430] p-8 transform transition-all duration-300">
            <h2 className="text-2xl font-bold text-[#1f2839] mb-6 bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
              {language === 'ta' ? 'सेटिंग्स' : 'Settings'}
            </h2>

            <div className="space-y-6">
              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#b69d7405] to-transparent border border-[#b69d7420]">
                <div>
                  <span className="text-sm font-semibold text-[#1f2839]">
                    {language === 'ta' ? 'ऑटो सिंक' : 'Auto Sync'}
                  </span>
                  <p className="text-xs text-[#6b7280] mt-1">
                    {language === 'ta' ? 'ऑनलाइन आने पर स्वचालित सिंक' : 'Automatic sync when online'}
                  </p>
                </div>
                <button
                  onClick={() => setAutoSync(!autoSync)}
                  className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-500 transform ${
                    autoSync 
                      ? 'bg-gradient-to-r from-[#10b981] to-[#10b981DD] shadow-lg shadow-[#10b98140]' 
                      : 'bg-gradient-to-r from-[#6b7280] to-[#6b7280AA]'
                  }`}
                >
                  <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-500 shadow-lg ${
                    autoSync ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Cache Size */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#b69d7405] to-transparent border border-[#b69d7420]">
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  {language === 'ta' ? 'अधिकतम कैश साइज (MB)' : 'Max Cache Size (MB)'}
                </label>
                <select
                  value={cacheSettings.maxSize}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, maxSize: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 text-sm border border-[#b69d7430] rounded-xl bg-white/50 backdrop-blur-sm text-[#1f2839] focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all duration-300"
                >
                  <option value={25}>25 MB</option>
                  <option value={50}>50 MB</option>
                  <option value={100}>100 MB</option>
                  <option value={200}>200 MB</option>
                </select>
              </div>

              {/* Retention Days */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#b69d7405] to-transparent border border-[#b69d7420]">
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  {language === 'ta' ? 'डेटा रिटेंशन (दिन)' : 'Data Retention (days)'}
                </label>
                <select
                  value={cacheSettings.retentionDays}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, retentionDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 text-sm border border-[#b69d7430] rounded-xl bg-white/50 backdrop-blur-sm text-[#1f2839] focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all duration-300"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>

              {/* Auto Cleanup */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#b69d7405] to-transparent border border-[#b69d7420]">
                <div>
                  <span className="text-sm font-semibold text-[#1f2839]">
                    {language === 'ta' ? 'ऑटो क्लीनअप' : 'Auto Cleanup'}
                  </span>
                  <p className="text-xs text-[#6b7280] mt-1">
                    {language === 'ta' ? 'पुराना कैश डेटा खुद से डिलीट करें' : 'Automatically delete old cached data'}
                  </p>
                </div>
                <button
                  onClick={() => setCacheSettings({ ...cacheSettings, autoCleanup: !cacheSettings.autoCleanup })}
                  className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-500 transform ${
                    cacheSettings.autoCleanup 
                      ? 'bg-gradient-to-r from-[#10b981] to-[#10b981DD] shadow-lg shadow-[#10b98140]' 
                      : 'bg-gradient-to-r from-[#6b7280] to-[#6b7280AA]'
                  }`}
                >
                  <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-500 shadow-lg ${
                    cacheSettings.autoCleanup ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-[#b69d7420]">
                <button
                  onClick={saveCacheSettings}
                  className="w-full px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74] transform transition-all duration-300 hover:scale-105 shadow-lg shadow-[#b69d7440]"
                >
                  {language === 'ta' ? 'सेटिंग्स सेव करें' : 'Save Settings'}
                </button>
                
                <button
                  onClick={clearCache}
                  className="w-full px-6 py-4 text-sm font-semibold text-[#f59e0b] bg-gradient-to-r from-[#f59e0b10] to-[#f59e0b08] rounded-xl hover:from-[#f59e0b15] hover:to-[#f59e0b10] transform transition-all duration-300 hover:scale-105 border border-[#f59e0b30]"
                >
                  {language === 'ta' ? 'कैश क्लियर करें' : 'Clear Cache'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineModeToggle;