import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FakeCaseChecker = () => {
  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, theme, language } = context || {};

  // State management
  const [activeTab, setActiveTab] = useState('scanner');
  const [scanResults, setScanResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [suspiciousCases, setSuspiciousCases] = useState([]);
  const [riskThreshold, setRiskThreshold] = useState(70);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const [scanHistory, setScanHistory] = useState([]);
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    dateRange: '30',
    caseType: 'all',
    status: 'all'
  });
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Mock data for suspicious cases
  const mockSuspiciousCases = [
    {
      id: 1,
      caseNumber: '2023/CRL/001',
      title: 'State vs John Doe',
      riskScore: 85,
      riskLevel: 'High',
      flags: ['Duplicate parties', 'Inconsistent dates', 'Missing documents'],
      detectedAt: '2023-12-20T10:30:00Z',
      status: 'Under Review',
      caseType: 'Criminal',
      filingDate: '2023-01-15',
      court: 'District Court I'
    },
    {
      id: 2,
      caseNumber: '2023/CIV/045',
      title: 'Property Dispute Case',
      riskScore: 75,
      riskLevel: 'Medium',
      flags: ['Unusual filing pattern', 'Questionable evidence'],
      detectedAt: '2023-12-19T15:45:00Z',
      status: 'Flagged',
      caseType: 'Civil',
      filingDate: '2023-03-10',
      court: 'District Court II'
    },
    {
      id: 3,
      caseNumber: '2023/FAM/012',
      title: 'Divorce Proceedings',
      riskScore: 65,
      riskLevel: 'Medium',
      flags: ['Address mismatch', 'Document authenticity'],
      detectedAt: '2023-12-18T09:15:00Z',
      status: 'Verified',
      caseType: 'Family',
      filingDate: '2023-02-20',
      court: 'Family Court'
    }
  ];

  // Mock scan history
  const mockScanHistory = [
    {
      id: 1,
      scanDate: '2023-12-20T11:00:00Z',
      casesScanned: 150,
      suspiciousFound: 3,
      duration: '2.5 min',
      triggeredBy: 'Auto-scan',
      status: 'Completed'
    },
    {
      id: 2,
      scanDate: '2023-12-19T16:30:00Z',
      casesScanned: 200,
      suspiciousFound: 5,
      duration: '3.1 min',
      triggeredBy: 'Manual',
      status: 'Completed'
    },
    {
      id: 3,
      scanDate: '2023-12-18T10:15:00Z',
      casesScanned: 175,
      suspiciousFound: 2,
      duration: '2.8 min',
      triggeredBy: 'Auto-scan',
      status: 'Completed'
    }
  ];

  // Load initial data
  useEffect(() => {
    setSuspiciousCases(mockSuspiciousCases);
    setScanHistory(mockScanHistory);
  }, []);

  // Auto-scan functionality
  useEffect(() => {
    if (!autoScanEnabled) return;

    const interval = setInterval(() => {
      performAutoScan();
    }, 300000);

    return () => clearInterval(interval);
  }, [autoScanEnabled]);

  // Perform automated scan
  const performAutoScan = useCallback(async () => {
    const newScanEntry = {
      id: Date.now(),
      scanDate: new Date().toISOString(),
      casesScanned: Math.floor(Math.random() * 100) + 100,
      suspiciousFound: Math.floor(Math.random() * 5),
      duration: `${(Math.random() * 2 + 1).toFixed(1)} min`,
      triggeredBy: 'Auto-scan',
      status: 'Completed'
    };

    setScanHistory(prev => [newScanEntry, ...prev.slice(0, 9)]);

    if (newScanEntry.suspiciousFound > 0) {
      addNotification?.({
        type: 'warning',
        message: `Auto-scan detected ${newScanEntry.suspiciousFound} suspicious case(s)`
      });
    }
  }, [addNotification]);

  // Manual scan function
  const runManualScan = async () => {
    setScanning(true);
    setScanProgress(0);
    try {
      // Simulate scanning process with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setScanProgress(i);
      }

      const newResults = [
        {
          id: Date.now(),
          caseNumber: `2023/NEW/${Math.floor(Math.random() * 1000)}`,
          riskScore: Math.floor(Math.random() * 40) + 60,
          flags: ['Suspicious filing pattern', 'Inconsistent data'],
          detectedAt: new Date().toISOString()
        }
      ];

      setScanResults(newResults);

      const scanEntry = {
        id: Date.now(),
        scanDate: new Date().toISOString(),
        casesScanned: Math.floor(Math.random() * 50) + 80,
        suspiciousFound: newResults.length,
        duration: `${(Math.random() * 1.5 + 1).toFixed(1)} min`,
        triggeredBy: 'Manual',
        status: 'Completed'
      };

      setScanHistory(prev => [scanEntry, ...prev.slice(0, 9)]);

      addNotification?.({
        type: 'success',
        message: `Scan completed. Found ${newResults.length} suspicious case(s)`
      });
    } catch (error) {
      console.error('Scan error:', error);
      addNotification?.({
        type: 'error',
        message: 'Failed to complete scan'
      });
    } finally {
      setScanning(false);
      setScanProgress(0);
    }
  };

  // Filter suspicious cases
  const filteredCases = suspiciousCases.filter(caseItem => {
    const matchesRisk = filters.riskLevel === 'all' || 
      (filters.riskLevel === 'high' && caseItem.riskScore >= 80) ||
      (filters.riskLevel === 'medium' && caseItem.riskScore >= 60 && caseItem.riskScore < 80) ||
      (filters.riskLevel === 'low' && caseItem.riskScore < 60);

    const matchesType = filters.caseType === 'all' || caseItem.caseType.toLowerCase() === filters.caseType;
    const matchesStatus = filters.status === 'all' || caseItem.status.toLowerCase().replace(' ', '') === filters.status;

    const now = new Date();
    const detectedDate = new Date(caseItem.detectedAt);
    const daysDiff = (now - detectedDate) / (1000 * 60 * 60 * 24);
    const matchesDate = filters.dateRange === 'all' || daysDiff <= parseInt(filters.dateRange);

    return matchesRisk && matchesType && matchesStatus && matchesDate;
  });

  // Handle case selection
  const handleCaseSelection = (caseId, checked) => {
    const newSelection = new Set(selectedCases);
    if (checked) {
      newSelection.add(caseId);
    } else {
      newSelection.delete(caseId);
    }
    setSelectedCases(newSelection);
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedCases.size === 0) {
      addNotification?.({
        type: 'warning',
        message: 'Please select cases to perform bulk action'
      });
      return;
    }

    setBulkActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedCaseNumbers = suspiciousCases
        .filter(c => selectedCases.has(c.id))
        .map(c => c.caseNumber);

      let message = '';
      switch (action) {
        case 'verify':
          message = `${selectedCases.size} case(s) marked as verified`;
          break;
        case 'investigate':
          message = `${selectedCases.size} case(s) marked for investigation`;
          break;
        case 'flag':
          message = `${selectedCases.size} case(s) flagged for review`;
          break;
        default:
          message = `Bulk action completed for ${selectedCases.size} case(s)`;
      }

      addNotification?.({
        type: 'success',
        message
      });

      setSelectedCases(new Set());
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: 'Failed to perform bulk action'
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Get risk color based on new palette
  const getRiskColor = (riskScore) => {
    if (riskScore >= 80) return 'text-[#f59e0b] bg-[#f59e0b15] border-[#f59e0b40]';
    if (riskScore >= 60) return 'text-[#3b82f6] bg-[#3b82f615] border-[#3b82f640]';
    return 'text-[#10b981] bg-[#10b98115] border-[#10b98140]';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review': return 'bg-[#f59e0b15] text-[#f59e0b] border-[#f59e0b40]';
      case 'Flagged': return 'bg-[#3b82f615] text-[#3b82f6] border-[#3b82f640]';
      case 'Verified': return 'bg-[#10b98115] text-[#10b981] border-[#10b98140]';
      default: return 'bg-[#6b728015] text-[#6b7280] border-[#6b728040]';
    }
  };

  // Professional SVG Icons
  const Icons = {
    Search: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    Warning: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    Chart: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    Settings: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    TrendUp: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    AlertCircle: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Eye: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    CheckCircle: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Target: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    Robot: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Document: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Users: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    Scan: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
    Building: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    Folder: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    Calendar: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    Clock: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    EyeView: () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div 
        className="bg-[#f5f5ef] rounded-xl border-2 border-[#1f283915] p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1f2839] mb-2 transition-all duration-300 hover:translate-x-1">
              {language === 'ta' ? 'नकली मामला चेकर' : 'Fake Case Checker'}
            </h1>
            <p className="text-[#6b7280] transition-colors duration-300">
              {language === 'ta' ? 'संदिग्ध और नकली मामलों की पहचान करने के लिए AI-संचालित उपकरण' : 'AI-powered tool to identify suspicious and potentially fake cases'}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Auto-scan Toggle */}
            <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-2.5 border-2 border-[#1f283915] shadow-sm hover:shadow-md transition-all duration-300">
              <label className="text-sm font-semibold text-[#1f2839] whitespace-nowrap">
                {language === 'ta' ? 'ऑटो-स्कैन' : 'Auto-scan'}
              </label>
              <button
                onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                className={`relative inline-flex items-center h-7 rounded-full w-14 transition-all duration-300 border-2 ${
                  autoScanEnabled 
                    ? 'bg-[#b69d74] border-[#b69d74]' 
                    : 'bg-[#e5e7eb] border-[#d1d5db]'
                } transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:ring-offset-2`}
                style={{
                  boxShadow: autoScanEnabled ? '0 2px 8px rgba(182, 157, 116, 0.3)' : 'none'
                }}
              >
                <span 
                  className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-300 shadow-lg ${
                    autoScanEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} 
                />
              </button>
              {autoScanEnabled && (
                <span className="flex items-center text-xs text-[#10b981] font-medium">
                  <span className="w-2 h-2 bg-[#10b981] rounded-full mr-1.5 animate-pulse"></span>
                  Active
                </span>
              )}
            </div>

            {/* Run Scan Button */}
            <button
              onClick={runManualScan}
              disabled={scanning}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#b69d74] border-2 border-[#b69d74] rounded-xl hover:bg-[#a08a65] hover:border-[#a08a65] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none"
              style={{
                boxShadow: scanning ? 'none' : '0 4px 12px rgba(182, 157, 116, 0.4)'
              }}
            >
              {scanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  {language === 'ta' ? 'स्कैन हो रहा है...' : 'Scanning...'}
                </>
              ) : (
                <>
                  <svg 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {language === 'ta' ? 'स्कैन शुरू करें' : 'Run Scan'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Risk Threshold Slider */}
        <div className="mt-6 pt-6 border-t-2 border-[#1f283915]">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-[#1f2839]">
              {language === 'ta' ? 'जोखिम थ्रेशहोल्ड' : 'Risk Threshold'}
            </label>
            <span className="px-3 py-1 text-sm font-bold text-[#b69d74] bg-[#b69d7415] border-2 border-[#b69d7440] rounded-lg">
              {riskThreshold}%
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="50"
              max="90"
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:ring-offset-2"
              style={{
                background: `linear-gradient(90deg, #b69d74 ${((riskThreshold - 50) / 40) * 100}%, #e5e7eb ${((riskThreshold - 50) / 40) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs font-medium text-[#6b7280] mt-3">
              <span className="px-2 py-1 bg-[#10b98115] text-[#10b981] rounded border border-[#10b98140]">
                50% Low
              </span>
              <span className="px-2 py-1 bg-[#3b82f615] text-[#3b82f6] rounded border border-[#3b82f640]">
                70% Medium
              </span>
              <span className="px-2 py-1 bg-[#f59e0b15] text-[#f59e0b] rounded border border-[#f59e0b40]">
                90% High
              </span>
            </div>
          </div>
        </div>

        {/* Scan Progress Bar */}
        {scanning && (
          <div className="mt-6 pt-6 border-t-2 border-[#1f283915] animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#1f2839] flex items-center">
                <svg className="h-5 w-5 mr-2 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scan Progress
              </span>
              <span className="text-sm font-bold text-[#b69d74] bg-[#b69d7415] px-3 py-1 rounded-lg border-2 border-[#b69d7440]">
                {scanProgress}%
              </span>
            </div>
            <div className="w-full bg-[#e5e7eb] rounded-full h-4 overflow-hidden border-2 border-[#1f283915] shadow-inner">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ 
                  width: `${scanProgress}%`,
                  background: 'linear-gradient(90deg, #b69d74 0%, #a08a65 100%)',
                  boxShadow: '0 2px 8px rgba(182, 157, 116, 0.4)'
                }}
              >
                {scanProgress > 10 && (
                  <span className="text-xs font-bold text-white">
                    {scanProgress}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-[#6b7280] mt-2 flex items-center">
              <span className="w-2 h-2 bg-[#b69d74] rounded-full mr-2 animate-pulse"></span>
              Analyzing cases for suspicious patterns...
            </p>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-[#f5f5ef] rounded-xl border-2 border-[#1f283915] shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="border-b-2 border-[#1f283915]">
          <nav className="flex -mb-px">
            {[
              { key: 'scanner', label: language === 'ta' ? 'स्कैनर' : 'Scanner', icon: 'Search' },
              { key: 'suspicious', label: language === 'ta' ? 'संदिग्ध मामले' : 'Suspicious Cases', icon: 'Warning' },
              { key: 'history', label: language === 'ta' ? 'स्कैन इतिहास' : 'Scan History', icon: 'Chart' },
              { key: 'settings', label: language === 'ta' ? 'सेटिंग्स' : 'Settings', icon: 'Settings' }
            ].map((tab) => {
              const IconComponent = Icons[tab.icon];
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'border-[#b69d74] text-[#b69d74]'
                      : 'border-transparent text-[#6b7280] hover:text-[#b69d74] hover:border-[#b69d7460]'
                  }`}
                >
                  <span className="mr-2"><IconComponent /></span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Scanner Tab */}
          {activeTab === 'scanner' && (
            <div className="space-y-6 animate-slideIn">
              {/* Scan Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { 
                    label: language === 'ta' ? 'कुल स्कैन' : 'Total Scans', 
                    value: scanHistory.length, 
                    color: 'bg-[#b69d7415] text-[#b69d74] border-[#b69d7440]',
                    icon: 'TrendUp'
                  },
                  { 
                    label: language === 'ta' ? 'संदिग्ध मामले' : 'Suspicious Cases', 
                    value: suspiciousCases.length, 
                    color: 'bg-[#f59e0b15] text-[#f59e0b] border-[#f59e0b40]',
                    icon: 'AlertCircle'
                  },
                  { 
                    label: language === 'ta' ? 'समीक्षाधीन' : 'Under Review', 
                    value: suspiciousCases.filter(c => c.status === 'Under Review').length, 
                    color: 'bg-[#3b82f615] text-[#3b82f6] border-[#3b82f640]',
                    icon: 'Eye'
                  },
                  { 
                    label: language === 'ta' ? 'सत्यापित' : 'Verified', 
                    value: suspiciousCases.filter(c => c.status === 'Verified').length, 
                    color: 'bg-[#10b98115] text-[#10b981] border-[#10b98140]',
                    icon: 'CheckCircle'
                  }
                ].map((stat, index) => {
                  const IconComponent = Icons[stat.icon];
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${stat.color}`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3"><IconComponent /></span>
                        <div>
                          <p className="text-sm font-medium opacity-80">{stat.label}</p>
                          <p className="text-2xl font-semibold">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Scan Results */}
              {scanResults.length > 0 && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold text-[#1f2839] mb-4 flex items-center">
                    <span className="mr-2"><Icons.Target /></span>
                    {language === 'ta' ? 'हाल के स्कैन परिणाम' : 'Recent Scan Results'}
                  </h3>
                  <div className="space-y-3">
                    {scanResults.map((result) => (
                      <div 
                        key={result.id} 
                        className="bg-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02)) border border-[rgba(245,158,11,0.3)] rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                result.riskScore >= 80 ? 'bg-[#f59e0b] animate-pulse' : 
                                result.riskScore >= 60 ? 'bg-[#3b82f6]' : 'bg-[#10b981]'
                              }`}
                            ></div>
                            <div>
                              <h4 className="font-medium text-[#1f2839]">
                                {result.caseNumber}
                              </h4>
                              <p className="text-sm text-[#6b7280]">
                                Risk Score: <span className="font-semibold">{result.riskScore}%</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-[#6b7280]">
                              {new Date(result.detectedAt).toLocaleString()}
                            </span>
                            <button className="text-[#b69d74] hover:text-[#1f2839] text-sm font-medium transition-colors duration-300">
                              {language === 'ta' ? 'विस्तार से देखें' : 'View Details'}
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {result.flags.map((flag, index) => (
                              <span 
                                key={index} 
                                className="text-xs px-2 py-1 bg-[rgba(245,158,11,0.1)] text-[#f59e0b] rounded border border-[rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-105"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Detection Algorithms */}
              <div className="animate-slideIn">
                <h3 className="text-lg font-semibold text-[#1f2839] mb-4 flex items-center">
                  <span className="mr-2"><Icons.Robot /></span>
                  {language === 'ta' ? 'AI पहचान एल्गोरिदम' : 'AI Detection Algorithms'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: language === 'ta' ? 'दस्तावेज़ विश्लेषण' : 'Document Analysis',
                      description: language === 'ta' ? 'दस्तावेज़ों की प्रामाणिकता की जांच करता है' : 'Checks document authenticity and consistency',
                      icon: 'Document',
                      color: 'from-blue-500/10 to-blue-500/5',
                      border: 'border-blue-500/20'
                    },
                    {
                      title: language === 'ta' ? 'पार्टी सत्यापन' : 'Party Verification',
                      description: language === 'ta' ? 'पार्टियों की जानकारी सत्यापित करता है' : 'Verifies party information and relationships',
                      icon: 'Users',
                      color: 'from-purple-500/10 to-purple-500/5',
                      border: 'border-purple-500/20'
                    },
                    {
                      title: language === 'ta' ? 'पैटर्न पहचान' : 'Pattern Recognition',
                      description: language === 'ta' ? 'संदिग्ध पैटर्न की पहचान करता है' : 'Identifies suspicious filing patterns',
                      icon: 'Scan',
                      color: 'from-orange-500/10 to-orange-500/5',
                      border: 'border-orange-500/20'
                    }
                  ].map((algo, index) => {
                    const IconComponent = Icons[algo.icon];
                    return (
                      <div 
                        key={index}
                        className={`bg-gradient(135deg, ${algo.color}) border ${algo.border} rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                      >
                        <div className="flex items-center mb-3">
                          <span className="mr-3"><IconComponent /></span>
                          <h4 className="font-semibold text-[#1f2839]">{algo.title}</h4>
                        </div>
                        <p className="text-sm text-[#6b7280] mb-2">{algo.description}</p>
                        <span className="text-xs px-2 py-1 bg-[#10b98115] text-[#10b981] rounded border border-[#10b98140]">
                          Active
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Suspicious Cases Tab */}
          {activeTab === 'suspicious' && (
            <div className="space-y-6 animate-slideIn">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gradient(135deg, rgba(255,255,255,0.05), rgba(182,157,116,0.08)) rounded-xl border border-[rgba(182,157,116,0.15)]">
                {[
                  {
                    label: language === 'ta' ? 'जोखिम स्तर' : 'Risk Level',
                    value: filters.riskLevel,
                    options: [
                      { value: 'all', label: language === 'ta' ? 'सभी' : 'All' },
                      { value: 'high', label: language === 'ta' ? 'उच्च' : 'High' },
                      { value: 'medium', label: language === 'ta' ? 'मध्यम' : 'Medium' },
                      { value: 'low', label: language === 'ta' ? 'कम' : 'Low' }
                    ],
                    onChange: (value) => setFilters({ ...filters, riskLevel: value })
                  },
                  {
                    label: language === 'ta' ? 'मामले का प्रकार' : 'Case Type',
                    value: filters.caseType,
                    options: [
                      { value: 'all', label: language === 'ta' ? 'सभी' : 'All' },
                      { value: 'criminal', label: language === 'ta' ? 'आपराधिक' : 'Criminal' },
                      { value: 'civil', label: language === 'ta' ? 'दीवानी' : 'Civil' },
                      { value: 'family', label: language === 'ta' ? 'पारिवारिक' : 'Family' }
                    ],
                    onChange: (value) => setFilters({ ...filters, caseType: value })
                  },
                  {
                    label: language === 'ta' ? 'स्थिति' : 'Status',
                    value: filters.status,
                    options: [
                      { value: 'all', label: language === 'ta' ? 'सभी' : 'All' },
                      { value: 'underreview', label: language === 'ta' ? 'समीक्षाधीन' : 'Under Review' },
                      { value: 'flagged', label: language === 'ta' ? 'फ्लैग किया गया' : 'Flagged' },
                      { value: 'verified', label: language === 'ta' ? 'सत्यापित' : 'Verified' }
                    ],
                    onChange: (value) => setFilters({ ...filters, status: value })
                  }
                ].map((filter, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-[#1f2839]">
                      {filter.label}:
                    </label>
                    <select
                      value={filter.value}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="text-sm border border-[rgba(182,157,116,0.3)] rounded-lg px-3 py-1 bg-white/50 text-[#1f2839] backdrop-blur-sm transition-all duration-300 hover:border-[#b69d74] focus:border-[#b69d74] focus:ring-1 focus:ring-[#b69d74]"
                    >
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {selectedCases.size > 0 && (
                  <div className="flex items-center space-x-2 ml-auto">
                    <span className="text-sm text-[#6b7280]">
                      {selectedCases.size} selected
                    </span>
                    <button
                      onClick={() => handleBulkAction('verify')}
                      disabled={bulkActionLoading}
                      className="text-sm px-3 py-1 text-[#10b981] bg-[#10b98115] border border-[#10b98140] rounded-lg hover:bg-[#10b98125] disabled:opacity-50 transition-all duration-300"
                    >
                      {language === 'ta' ? 'सत्यापित करें' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleBulkAction('investigate')}
                      disabled={bulkActionLoading}
                      className="text-sm px-3 py-1 text-[#f59e0b] bg-[#f59e0b15] border border-[#f59e0b40] rounded-lg hover:bg-[#f59e0b25] disabled:opacity-50 transition-all duration-300"
                    >
                      {language === 'ta' ? 'जांच करें' : 'Investigate'}
                    </button>
                  </div>
                )}
              </div>

              {/* Cases List */}
              <div className="space-y-4">
                {filteredCases.map((caseItem) => (
                  <div 
                    key={caseItem.id} 
                    className="bg-gradient(135deg, rgba(255,255,255,0.05), rgba(182,157,116,0.08)) rounded-xl p-4 border border-[rgba(182,157,116,0.15)] backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedCases.has(caseItem.id)}
                          onChange={(e) => handleCaseSelection(caseItem.id, e.target.checked)}
                          className="mt-1 h-4 w-4 text-[#b69d74] border-[rgba(182,157,116,0.5)] rounded transition-all duration-300 focus:ring-[#b69d74]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="font-semibold text-[#1f2839]">
                              {caseItem.caseNumber}
                            </h4>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium border transition-all duration-300 ${getRiskColor(caseItem.riskScore)}`}>
                              Risk: {caseItem.riskScore}%
                            </span>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium border transition-all duration-300 ${getStatusColor(caseItem.status)}`}>
                              {caseItem.status}
                            </span>
                          </div>
                          <p className="text-[#1f2839] mb-3 font-medium">
                            {caseItem.title}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-[#6b7280] mb-4">
                            <span className="flex items-center">
                              <span className="mr-1"><Icons.Building /></span>
                              {caseItem.court}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <span className="mr-1"><Icons.Folder /></span>
                              {caseItem.caseType}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <span className="mr-1"><Icons.Calendar /></span>
                              Filed: {new Date(caseItem.filingDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {caseItem.flags.map((flag, index) => (
                              <span 
                                key={index} 
                                className="text-xs px-3 py-1 bg-[rgba(245,158,11,0.1)] text-[#f59e0b] rounded-lg border border-[rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-105"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-[#6b7280]">
                          Detected: {new Date(caseItem.detectedAt).toLocaleDateString()}
                        </span>
                        <button className="text-[#b69d74] hover:text-[#1f2839] text-sm font-medium transition-colors duration-300 flex items-center">
                          <span className="mr-1"><Icons.EyeView /></span>
                          {language === 'ta' ? 'विस्तार से देखें' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCases.length === 0 && (
                <div className="text-center py-12 animate-fadeIn">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 text-[#6b7280]">
                      <Icons.Search />
                    </div>
                  </div>
                  <p className="text-[#6b7280] text-lg">
                    {language === 'ta' ? 'कोई संदिग्ध मामले नहीं मिले' : 'No suspicious cases found'}
                  </p>
                  <p className="text-[#6b7280] text-sm mt-2">
                    {language === 'ta' ? 'अपनी खोज मानदंड समायोजित करें या एक नया स्कैन चलाएं' : 'Adjust your search criteria or run a new scan'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Scan History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-slideIn">
              <h3 className="text-lg font-semibold text-[#1f2839] flex items-center">
                <span className="mr-2"><Icons.Chart /></span>
                {language === 'ta' ? 'स्कैन इतिहास' : 'Scan History'}
              </h3>
              <div className="space-y-4">
                {scanHistory.map((scan, index) => (
                  <div 
                    key={scan.id}
                    className="bg-gradient(135deg, rgba(255,255,255,0.05), rgba(182,157,116,0.08)) rounded-xl p-4 border border-[rgba(182,157,116,0.15)] backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full animate-pulse ${
                            scan.status === 'Completed' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'
                          }`}></div>
                          <div>
                            <span className="font-medium text-[#1f2839]">
                              {scan.triggeredBy} Scan
                            </span>
                            <div className="text-sm text-[#6b7280] mt-1">
                              <span className="flex items-center">
                                <span className="mr-1"><Icons.Folder /></span>
                                {scan.casesScanned} cases scanned
                              </span>
                              <span className={`flex items-center ${scan.suspiciousFound > 0 ? 'text-[#f59e0b] font-medium' : ''}`}>
                                <span className="mr-1"><Icons.Warning /></span>
                                {scan.suspiciousFound} suspicious found
                              </span>
                              <span className="flex items-center">
                                <span className="mr-1"><Icons.Clock /></span>
                                {scan.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-[#6b7280]">
                        {new Date(scan.scanDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-slideIn">
              <h3 className="text-lg font-semibold text-[#1f2839] flex items-center">
                <span className="mr-2"><Icons.Settings /></span>
                {language === 'ta' ? 'स्कैनर सेटिंग्स' : 'Scanner Settings'}
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: language === 'ta' ? 'स्वचालित स्कैन' : 'Automatic Scanning',
                    description: language === 'ta' ? 'नियमित अंतराल पर स्वचालित स्कैन सक्षम करें' : 'Enable automatic scanning at regular intervals',
                    enabled: autoScanEnabled,
                    toggle: () => setAutoScanEnabled(!autoScanEnabled)
                  },
                  {
                    title: language === 'ta' ? 'ईमेल अलर्ट' : 'Email Alerts',
                    description: language === 'ta' ? 'उच्च जोखिम मामलों के लिए ईमेल अलर्ट' : 'Email alerts for high-risk cases',
                    enabled: true,
                    toggle: () => {}
                  },
                  {
                    title: language === 'ta' ? 'सूचनाएं' : 'Notifications',
                    description: language === 'ta' ? 'स्कैन पूर्ण होने पर सूचना' : 'Notifications when scan completes',
                    enabled: true,
                    toggle: () => {}
                  }
                ].map((setting, index) => (
                  <div 
                    key={index}
                    className="bg-gradient(135deg, rgba(255,255,255,0.05), rgba(182,157,116,0.08)) p-4 rounded-xl border border-[rgba(182,157,116,0.15)] backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#1f2839] mb-1">
                          {setting.title}
                        </h4>
                        <p className="text-sm text-[#6b7280]">
                          {setting.description}
                        </p>
                      </div>
                      <button
                        onClick={setting.toggle}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300 ${
                          setting.enabled 
                            ? 'bg-gradient(135deg, #b69d74, #b69d74DD)' 
                            : 'bg-[#6b728040]'
                        } transform hover:scale-105`}
                      >
                        <span 
                          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-all duration-300 shadow-lg ${
                            setting.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Risk Threshold Setting */}
                <div className="bg-gradient(135deg, rgba(255,255,255,0.05), rgba(182,157,116,0.08)) p-4 rounded-xl border border-[rgba(182,157,116,0.15)] backdrop-blur-sm">
                  <h4 className="font-medium text-[#1f2839] mb-3">
                    {language === 'ta' ? 'जोखिम थ्रेशहोल्ड' : 'Risk Threshold'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280]">
                        {language === 'ta' ? 'न्यूनतम जोखिम स्कोर सेट करें' : 'Set minimum risk score for detection'}
                      </span>
                      <span className="text-sm font-medium text-[#b69d74]">{riskThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="90"
                      value={riskThreshold}
                      onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                      className="w-full h-2 bg-gradient(90deg, #b69d74, #b69d74CC) rounded-lg appearance-none cursor-pointer transition-all duration-300"
                      style={{
                        background: `linear-gradient(90deg, #b69d74 ${riskThreshold}%, rgba(182,157,116,0.3) ${riskThreshold}%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }

        /* Custom Range Slider Styles */
        input[type='range'] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #b69d74;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(182, 157, 116, 0.5);
          transition: all 0.3s ease;
        }
        
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(182, 157, 116, 0.6);
        }
        
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #b69d74;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(182, 157, 116, 0.5);
          transition: all 0.3s ease;
        }
        
        input[type='range']::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(182, 157, 116, 0.6);
        }
      `}</style>
    </div>
  );
};

export default FakeCaseChecker;