import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const CaseList = () => {
  // ==================== STATE MANAGEMENT ====================
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCases, setSelectedCases] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('lastUpdate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    court: 'all',
    caseType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  
  // ✅ FIXED: Updated field names to match backend
  const [newCase, setNewCase] = useState({
    caseNumber: '',      // ✅ Changed from 'number'
    status: 'Active',
    clientName: '',      // ✅ Changed from 'client'
    oppositeParty: '',   // ✅ Changed from 'opposingParty'
    court: '',
    filingDate: '',
    caseType: 'Civil',
    judge: '',
    description: '',
    actsSections: [],
    nextHearing: '',
    hearingTime: '',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const context = useOutletContext();
  const { addNotification, language } = context || {};
  const modalRef = useRef(null);

  const actsOptions = [
    'IPC - Indian Penal Code',
    'CrPC - Criminal Procedure Code',
    'CPC - Civil Procedure Code',
    'Evidence Act',
    'IT Act - Information Technology Act',
    'Negotiable Instruments Act',
    'Companies Act',
    'Contract Act',
    'Property Law',
    'Family Law',
    'Labour Law',
    'Consumer Protection Act'
  ];

  // ==================== API FUNCTIONS ====================

  const fetchCases = async () => {
    console.log('📡 [fetchCases] Starting fetch...');
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.priority !== 'all') queryParams.append('priority', filters.priority);
      if (filters.court !== 'all') queryParams.append('court', filters.court);
      if (filters.caseType !== 'all') queryParams.append('caseType', filters.caseType);
      if (searchQuery) queryParams.append('search', searchQuery);
      
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortOrder', sortOrder);

      console.log('🌐 [fetchCases] URL:', `${API_BASE_URL}/new-case?${queryParams.toString()}`);

      const response = await fetch(`${API_BASE_URL}/new-case?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }

      const data = await response.json();
      console.log('✅ [fetchCases] Data received:', data);
      
      const transformedCases = data.data.map(caseItem => ({
        id: caseItem._id,
        number: caseItem.caseNumber,
        title: caseItem.caseTitle || `${caseItem.clientName} vs ${caseItem.oppositeParty}`,
        status: caseItem.status,
        priority: caseItem.priority || 'Medium',
        court: caseItem.court,
        caseType: caseItem.caseType,
        filingDate: caseItem.filingDate?.split('T')[0] || caseItem.filingDate,
        nextHearing: caseItem.nextHearing?.split('T')[0] || caseItem.nextHearing,
        hearingTime: caseItem.hearingTime,
        judge: caseItem.judge,
        parties: caseItem.parties || [caseItem.clientName, caseItem.oppositeParty],
        advocate: caseItem.advocate || '',
        lastUpdate: caseItem.lastUpdated?.split('T')[0] || caseItem.updatedAt?.split('T')[0],
        documents: caseItem.documentCount || caseItem.documents?.length || 0,
        description: caseItem.description,
        actsSections: caseItem.actsSections || []
      }));

      console.log('✅ [fetchCases] Transformed cases:', transformedCases.length);
      setCases(transformedCases);
      setLoading(false);
    } catch (error) {
      console.error('❌ [fetchCases] Error:', error);
      setLoading(false);
      addNotification?.({ 
        type: 'error', 
        message: error.message || 'Failed to load cases' 
      });
    }
  };

  const createCase = async (caseData) => {
    console.log('📤 [createCase] Starting case creation...');
    console.log('📋 [createCase] Data:', caseData);
    
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/new-case`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData)
      });

      console.log('📦 [createCase] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [createCase] Error response:', errorData);
        throw new Error(errorData.message || 'Failed to create case');
      }

      const data = await response.json();
      console.log('✅ [createCase] Success:', data);
      
      addNotification?.({ 
        type: 'success', 
        message: data.message || `Case ${caseData.caseNumber} created successfully` 
      });

      await fetchCases();
      setSubmitting(false);
      return data;
    } catch (error) {
      console.error('❌ [createCase] Error:', error);
      setSubmitting(false);
      addNotification?.({ 
        type: 'error', 
        message: error.message || 'Failed to create case' 
      });
      throw error;
    }
  };

  // ==================== USE EFFECTS ====================

  useEffect(() => {
    fetchCases();
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== null) {
        fetchCases();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const court = searchParams.get('court');
    if (status || priority || court) {
      setFilters(prev => ({
        ...prev,
        status: status || 'all',
        priority: priority || 'all',
        court: court || 'all'
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowNewCaseModal(false);
      }
    };
    if (showNewCaseModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNewCaseModal]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowNewCaseModal(false);
    };
    if (showNewCaseModal) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showNewCaseModal]);

  // ==================== MEMOIZED VALUES ====================
  
  const filteredAndSortedCases = useMemo(() => {
    return cases;
  }, [cases]);

  // ==================== EVENT HANDLERS ====================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`✏️ [Input] ${name}:`, value);
    setNewCase(prev => ({ ...prev, [name]: value }));
  };

  const handleActsChange = (act) => {
    console.log('📋 [Acts] Toggling:', act);
    setNewCase(prev => ({
      ...prev,
      actsSections: prev.actsSections.includes(act)
        ? prev.actsSections.filter(a => a !== act)
        : [...prev.actsSections, act]
    }));
  };

  const resetForm = () => {
    console.log('🔄 [resetForm] Resetting form...');
    setNewCase({
      caseNumber: '',      // ✅ Fixed
      status: 'Active',
      clientName: '',      // ✅ Fixed
      oppositeParty: '',   // ✅ Fixed
      court: '',
      filingDate: '',
      caseType: 'Civil',
      judge: '',
      description: '',
      actsSections: [],
      nextHearing: '',
      hearingTime: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 [handleSubmit] Form submitted');
    console.log('📋 [handleSubmit] Form data:', newCase);
    
    // ✅ Updated validation with correct field names
    if (!newCase.caseNumber || !newCase.clientName || !newCase.oppositeParty || !newCase.court || !newCase.filingDate) {
      console.warn('⚠️ [handleSubmit] Validation failed');
      addNotification?.({ 
        type: 'warning', 
        message: 'Please fill all required fields' 
      });
      return;
    }

    try {
      // ✅ Send with correct field names matching backend
      const caseData = {
        caseNumber: newCase.caseNumber,    // ✅ Fixed
        status: newCase.status,
        clientName: newCase.clientName,    // ✅ Fixed
        oppositeParty: newCase.oppositeParty,  // ✅ Fixed
        court: newCase.court,
        filingDate: newCase.filingDate,
        caseType: newCase.caseType,
        judge: newCase.judge,
        description: newCase.description,
        actsSections: newCase.actsSections,
        nextHearing: newCase.nextHearing || null,
        hearingTime: newCase.hearingTime || null
      };

      console.log('📤 [handleSubmit] Sending data:', caseData);

      await createCase(caseData);
      setShowNewCaseModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ [handleSubmit] Error:', error);
    }
  };

  const handleCaseSelection = (caseId) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId) 
        : [...prev, caseId]
    );
  };

  const toggleFavorite = (caseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.has(caseId) ? newSet.delete(caseId) : newSet.add(caseId);
      return newSet;
    });
  };

  const handleCardClick = (caseId) => {
    navigate(`/clerk/case/${caseId}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-[#dc2626] bg-[#dc262615] border-2 border-[#dc262640]';
      case 'high': return 'text-[#f59e0b] bg-[#f59e0b15] border-2 border-[#f59e0b40]';
      case 'medium': return 'text-[#3b82f6] bg-[#3b82f615] border-2 border-[#3b82f640]';
      case 'low': return 'text-[#10b981] bg-[#10b98115] border-2 border-[#10b98140]';
      default: return 'text-[#6b7280] bg-[#6b728015] border-2 border-[#6b728040]';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-[#10b981] bg-[#10b98115] border-2 border-[#10b98140]';
      case 'pending': return 'text-[#f59e0b] bg-[#f59e0b15] border-2 border-[#f59e0b40]';
      case 'closed': return 'text-[#6b7280] bg-[#6b728015] border-2 border-[#6b728040]';
      default: return 'text-[#6b7280] bg-[#6b728015] border-2 border-[#6b728040]';
    }
  };

  // ==================== LOADING STATE ====================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b69d74]"></div>
        <span className="ml-2 text-[#6b7280]">
          {language === 'ta' ? 'मामले लोड हो रहे हैं...' : 'Loading cases...'}
        </span>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================

  return (
    <div className="min-h-screen bg-[#f5f5ef] lg:ml-60 pt-16 lg:pt-0">
      <div className="w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-6">
        
        {/* ==================== HEADER ==================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1f2839]">
              {language === 'ta' ? 'मामले' : 'Cases'}
            </h1>
            <p className="text-[#6b7280] mt-1 text-sm sm:text-base">
              {language === 'ta' ? 'सभी कानूनी मामलों का प्रबंधन करें' : 'Manage all legal cases'}
            </p>
          </div>
          
          <div className="flex items-center flex-wrap gap-3">
            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#1f2839] bg-white border border-[#1f283925] rounded-lg hover:bg-[#f5f5ef] transition-colors shadow-sm"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {language === 'ta' ? 'फ़िल्टर' : 'Filters'}
            </button>

            {/* View Toggle */}
            <div className="flex items-center border border-[#1f283925] rounded-lg bg-white shadow-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-l-lg transition-colors ${viewMode === 'table' ? 'bg-[#b69d7415] text-[#b69d74]' : 'text-[#6b7280] hover:text-[#1f2839]'}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V7a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-r-lg transition-colors ${viewMode === 'grid' ? 'bg-[#b69d7415] text-[#b69d74]' : 'text-[#6b7280] hover:text-[#1f2839]'}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>

            {/* New Case Button */}
            <button
              onClick={() => {
                console.log('🔘 [Button] New Case clicked');
                setShowNewCaseModal(true);
              }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#b69d74] border border-transparent rounded-lg hover:bg-[#b69d74DD] focus:outline-none focus:ring-2 focus:ring-[#b69d74] transition-colors shadow-sm"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {language === 'ta' ? 'नया मामला' : 'New Case'}
            </button>
          </div>
        </div>

        {/* ==================== SEARCH BAR ==================== */}
        <div className="bg-white rounded-xl shadow-sm border border-[#1f283915] p-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={language === 'ta' ? 'मामला नंबर, पार्टी नाम या अदालत खोजें...' : 'Search by case number, party name, or court...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* ==================== FILTERS PANEL ==================== */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-[#1f283915] p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1f2839] mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2839] mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                >
                  <option value="all">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2839] mb-2">Case Type</label>
                <select
                  value={filters.caseType}
                  onChange={(e) => setFilters(prev => ({ ...prev, caseType: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                >
                  <option value="all">All Types</option>
                  <option value="Civil">Civil</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Family">Family</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1f2839] mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                >
                  <option value="lastUpdate">Last Updated</option>
                  <option value="caseNumber">Case Number</option>
                  <option value="filingDate">Filing Date</option>
                  <option value="nextHearing">Next Hearing</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CASES DISPLAY ==================== */}
        {filteredAndSortedCases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#1f283915] p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-[#6b7280] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-[#1f2839] mb-2">
              {language === 'ta' ? 'कोई मामला नहीं मिला' : 'No Cases Found'}
            </h3>
            <p className="text-[#6b7280] mb-4">
              {language === 'ta' ? 'नया मामला बनाने के लिए "नया मामला" बटन पर क्लिक करें' : 'Click "New Case" button to create your first case'}
            </p>
            <button
              onClick={() => setShowNewCaseModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#b69d74] rounded-lg hover:bg-[#b69d74DD] transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {language === 'ta' ? 'नया मामला बनाएं' : 'Create New Case'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedCases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => handleCardClick(caseItem.id)}
                className="bg-white rounded-xl shadow-sm border border-[#1f283915] p-5 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#1f2839] mb-1 truncate group-hover:text-[#b69d74] transition-colors">
                      {caseItem.number}
                    </h3>
                    <p className="text-sm text-[#6b7280] line-clamp-1">{caseItem.title}</p>
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(caseItem.id, e)}
                    className="flex-shrink-0 ml-2 p-1.5 hover:bg-[#f5f5ef] rounded-lg transition-colors"
                  >
                    <svg
                      className={`h-5 w-5 ${favorites.has(caseItem.id) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#6b7280]'}`}
                      fill={favorites.has(caseItem.id) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-[#6b7280]">
                    <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Filed: {caseItem.filingDate}
                  </div>
                  {caseItem.nextHearing && (
                    <div className="flex items-center text-xs text-[#6b7280]">
                      <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Next: {caseItem.nextHearing}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-[#6b7280]">
                    <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {caseItem.court}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                    {caseItem.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                    {caseItem.priority}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-[#3b82f6] bg-[#3b82f615] border border-[#3b82f640]">
                    {caseItem.caseType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#1f283915] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#1f283915]">
                <thead className="bg-[#f5f5ef]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#1f2839] uppercase">Case Number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#1f2839] uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#1f2839] uppercase">Court</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#1f2839] uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#1f2839] uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#1f2839] uppercase">Next Hearing</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#1f2839] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#1f283915]">
                  {filteredAndSortedCases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      onClick={() => handleCardClick(caseItem.id)}
                      className="hover:bg-[#f5f5ef] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1f2839]">{caseItem.number}</td>
                      <td className="px-6 py-4 text-sm text-[#6b7280] max-w-xs truncate">{caseItem.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">{caseItem.court}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">{caseItem.nextHearing || 'Not scheduled'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(caseItem.id);
                          }}
                          className="text-[#b69d74] hover:text-[#b69d74DD]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== NEW CASE MODAL - UPLOAD BUTTON AT TOP RIGHT ==================== */}
        {showNewCaseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              ref={modalRef} 
              className="bg-white rounded-xl shadow-2xl w-full flex flex-col
                         max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl"
              style={{ maxHeight: '90vh' }}
            >
              {/* ========== MODAL HEADER WITH UPLOAD BUTTON ========== */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1f2839]">
                  {language === 'ta' ? 'नया मामला बनाएं' : 'Create New Case'}
                </h2>

                <div className="flex items-center gap-3">
                  {/* ✅ UPLOAD CASE BUTTON - TOP RIGHT! */}
                  <button
                    type="submit"
                    form="newCaseForm"
                    disabled={submitting}
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#b69d74] border border-transparent rounded-lg hover:bg-[#a68d64] focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{language === 'ta' ? 'अपलोड हो रहा है...' : 'Uploading...'}</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>{language === 'ta' ? 'अपलोड करें' : 'Upload Case'}</span>
                      </>
                    )}
                  </button>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => {
                      console.log('🔘 [Modal] Close button clicked');
                      setShowNewCaseModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ========== FORM CONTENT - SCROLLABLE ========== */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <form id="newCaseForm" onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Responsive 3-Column Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* ✅ Case Number - FIXED FIELD NAME */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">
                        Case Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="caseNumber"
                        value={newCase.caseNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., 2023/CRL/001"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      />
                    </div>

                    {/* Case Status */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={newCase.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* Case Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">
                        Case Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="caseType"
                        value={newCase.caseType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      >
                        <option value="Civil">Civil</option>
                        <option value="Criminal">Criminal</option>
                        <option value="Family">Family</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>

                    {/* ✅ Client - FIXED FIELD NAME */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">
                        Client <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="clientName"
                        value={newCase.clientName}
                        onChange={handleInputChange}
                        placeholder="Client name"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      />
                    </div>

                    {/* ✅ Opposing Party - FIXED FIELD NAME */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">
                        Opposing Party <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="oppositeParty"
                        value={newCase.oppositeParty}
                        onChange={handleInputChange}
                        placeholder="Opposing party name"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      />
                    </div>

                    {/* Court */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">
                        Court <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="court"
                        value={newCase.court}
                        onChange={handleInputChange}
                        placeholder="Court name"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      />
                    </div>

                    {/* Filing Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">
                        Filing Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="date"
                        name="filingDate"
                        value={newCase.filingDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      />
                    </div>

                    {/* Judge */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">Judge</label>
                      <input
                        type="text"
                        name="judge"
                        value={newCase.judge}
                        onChange={handleInputChange}
                        placeholder="Judge name"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      />
                    </div>

                    {/* Next Hearing */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">Next Hearing Date</label>
                      <input
                        type="date"
                        name="nextHearing"
                        value={newCase.nextHearing}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      />
                    </div>

                    {/* Hearing Time */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1f2839]">Hearing Time</label>
                      <input
                        type="time"
                        name="hearingTime"
                        value={newCase.hearingTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#1f2839]">Case Description</label>
                    <textarea
                      name="description"
                      value={newCase.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of the case..."
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] resize-none"
                    />
                  </div>

                  {/* Acts and Sections */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#1f2839]">Related Acts & Sections</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-300 rounded-lg bg-gray-50">
                      {actsOptions.map((act) => (
                        <label key={act} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={newCase.actsSections.includes(act)}
                            onChange={() => handleActsChange(act)}
                            className="h-4 w-4 text-[#b69d74] focus:ring-[#b69d74] border-gray-300 rounded"
                          />
                          <span className="text-xs text-[#1f2839]">{act}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* ========== MOBILE ONLY: BOTTOM BUTTONS ========== */}
              <div className="sm:hidden border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    form="newCaseForm"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#b69d74] rounded-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Upload Case</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCaseModal(false);
                      resetForm();
                    }}
                    className="w-full px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseList;
