import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const CaseList = () => {
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
  const [newCase, setNewCase] = useState({
    number: '',
    status: 'Active',
    client: '',
    opposingParty: '',
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

  // ============= API FUNCTIONS =============

  const fetchCases = async () => {
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

      setCases(transformedCases);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setLoading(false);
      addNotification?.({ 
        type: 'error', 
        message: error.message || 'Failed to load cases' 
      });
    }
  };

  const createCase = async (caseData) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/new-case`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create case');
      }

      const data = await response.json();
      
      addNotification?.({ 
        type: 'success', 
        message: data.message || `Case ${caseData.number} created successfully` 
      });

      await fetchCases();
      setSubmitting(false);
      return data;
    } catch (error) {
      console.error('Error creating case:', error);
      setSubmitting(false);
      addNotification?.({ 
        type: 'error', 
        message: error.message || 'Failed to create case' 
      });
      throw error;
    }
  };

  // ============= USE EFFECTS =============

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

  // ============= MEMOIZED VALUES =============
  
  const filteredAndSortedCases = useMemo(() => {
    return cases;
  }, [cases]);

  // ============= EVENT HANDLERS =============

  const handleCaseSelection = (caseId) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId) 
        : [...prev, caseId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCases(
      selectedCases.length === filteredAndSortedCases.length 
        ? [] 
        : filteredAndSortedCases.map(c => c.id)
    );
  };

  const handleBulkAction = (action) => {
    if (selectedCases.length === 0) {
      addNotification?.({ type: 'warning', message: 'No cases selected' });
      return;
    }
    const msg = action === 'export' 
      ? `Exporting ${selectedCases.length} cases...` 
      : `Archived ${selectedCases.length} cases`;
    addNotification?.({ type: 'success', message: msg });
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

  const exportToCSV = () => {
    const headers = ['Case Number', 'Title', 'Status', 'Priority', 'Court', 'Filing Date', 'Next Hearing'];
    const data = filteredAndSortedCases.map(case_ => [
      case_.number, case_.title, case_.status, case_.priority, case_.court, case_.filingDate, case_.nextHearing || 'N/A'
    ]);
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cases.csv';
    a.click();
    URL.revokeObjectURL(url);
    addNotification?.({ type: 'success', message: 'Cases exported to CSV successfully' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCase(prev => ({ ...prev, [name]: value }));
  };

  const handleActsChange = (act) => {
    setNewCase(prev => ({
      ...prev,
      actsSections: prev.actsSections.includes(act)
        ? prev.actsSections.filter(a => a !== act)
        : [...prev.actsSections, act]
    }));
  };

  const resetForm = () => {
    setNewCase({
      number: '',
      status: 'Active',
      client: '',
      opposingParty: '',
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
    
    if (!newCase.number || !newCase.client || !newCase.opposingParty || !newCase.court || !newCase.filingDate) {
      addNotification?.({ 
        type: 'warning', 
        message: 'Please fill all required fields' 
      });
      return;
    }

    try {
      const caseData = {
        number: newCase.number,
        status: newCase.status,
        client: newCase.client,
        opposingParty: newCase.opposingParty,
        court: newCase.court,
        filingDate: newCase.filingDate,
        caseType: newCase.caseType,
        judge: newCase.judge,
        description: newCase.description,
        actsSections: newCase.actsSections,
        nextHearing: newCase.nextHearing || null,
        hearingTime: newCase.hearingTime || null
      };

      await createCase(caseData);
      setShowNewCaseModal(false);
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#f5f5ef]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1f2839]">
              {language === 'ta' ? 'मामले' : 'Cases'}
            </h1>
            <p className="text-[#6b7280] mt-1">
              {language === 'ta' ? 'सभी कानूनी मामलों का प्रबंधन करें' : 'Manage all legal cases'}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#1f2839] bg-white border border-[#1f283925] rounded-md hover:bg-[#ffffff] transition-colors shadow-sm"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {language === 'ta' ? 'फ़िल्टर' : 'Filters'}
            </button>

            <div className="flex items-center border border-[#1f283925] rounded-md bg-white shadow-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-[#b69d7415] text-[#b69d74]' : 'text-[#6b7280] hover:text-[#1f2839]'}`}
                title="Table view"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V7a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#b69d7415] text-[#b69d74]' : 'text-[#6b7280] hover:text-[#1f2839]'}`}
                title="Grid view"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => setShowNewCaseModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#b69d74] border border-transparent rounded-md hover:bg-[#b69d74DD] focus:outline-none focus:ring-2 focus:ring-[#b69d74] transition-colors shadow-sm"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {language === 'ta' ? 'नया मामला' : 'New Case'}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-[#1f283915] p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ta' ? 'मामले खोजें...' : 'Search cases...'}
                  className="w-full pl-10 pr-4 py-2 border border-[#1f283925] rounded-lg bg-white text-[#1f2839] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-[#1f2839]">
                {language === 'ta' ? 'सॉर्ट करें:' : 'Sort by:'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-[#1f283925] rounded-md bg-white text-[#1f2839] focus:outline-none focus:ring-2 focus:ring-[#b69d74] shadow-sm"
              >
                <option value="lastUpdate">{language === 'ta' ? 'अंतिम अपडेट' : 'Last Update'}</option>
                <option value="caseNumber">{language === 'ta' ? 'मामला संख्या' : 'Case Number'}</option>
                <option value="filingDate">{language === 'ta' ? 'फाइलिंग दिनांक' : 'Filing Date'}</option>
                <option value="nextHearing">{language === 'ta' ? 'अगली सुनवाई' : 'Next Hearing'}</option>
                <option value="priority">{language === 'ta' ? 'प्राथमिकता' : 'Priority'}</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-[#6b7280] hover:text-[#1f2839] transition-colors"
                title={sortOrder === 'asc' ? 'Descending' : 'Ascending'}
              >
                <svg className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#1f283915]">
              <div>
                <label className="block text-sm font-medium text-[#1f2839] mb-2">
                  {language === 'ta' ? 'स्थिति' : 'Status'}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-[#1f283925] rounded-md bg-white text-[#1f2839] shadow-sm"
                >
                  <option value="all">{language === 'ta' ? 'सभी' : 'All'}</option>
                  <option value="active">{language === 'ta' ? 'सक्रिय' : 'Active'}</option>
                  <option value="pending">{language === 'ta' ? 'लंबित' : 'Pending'}</option>
                  <option value="closed">{language === 'ta' ? 'बंद' : 'Closed'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2839] mb-2">
                  {language === 'ta' ? 'प्राथमिकता' : 'Priority'}
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-[#1f283925] rounded-md bg-white text-[#1f2839] shadow-sm"
                >
                  <option value="all">{language === 'ta' ? 'सभी' : 'All'}</option>
                  <option value="critical">{language === 'ta' ? 'महत्वपूर्ण' : 'Critical'}</option>
                  <option value="high">{language === 'ta' ? 'उच्च' : 'High'}</option>
                  <option value="medium">{language === 'ta' ? 'मध्यम' : 'Medium'}</option>
                  <option value="low">{language === 'ta' ? 'कम' : 'Low'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2839] mb-2">
                  {language === 'ta' ? 'न्यायालय' : 'Court'}
                </label>
                <select
                  value={filters.court}
                  onChange={(e) => setFilters({...filters, court: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-[#1f283925] rounded-md bg-white text-[#1f2839] shadow-sm"
                >
                  <option value="all">{language === 'ta' ? 'सभी' : 'All'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2839] mb-2">
                  {language === 'ta' ? 'मामले का प्रकार' : 'Case Type'}
                </label>
                <select
                  value={filters.caseType}
                  onChange={(e) => setFilters({...filters, caseType: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-[#1f283925] rounded-md bg-white text-[#1f2839] shadow-sm"
                >
                  <option value="all">{language === 'ta' ? 'सभी' : 'All'}</option>
                  <option value="criminal">{language === 'ta' ? 'आपराधिक' : 'Criminal'}</option>
                  <option value="civil">{language === 'ta' ? 'नागरिक' : 'Civil'}</option>
                  <option value="family">{language === 'ta' ? 'पारिवारिक' : 'Family'}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedCases.length > 0 && (
          <div className="bg-[#b69d7410] border border-[#b69d7440] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-[#1f2839]">
                  {selectedCases.length} {language === 'ta' ? 'मामले चयनित' : 'cases selected'}
                </span>
                <button
                  onClick={() => setSelectedCases([])}
                  className="text-sm text-[#b69d74] hover:text-[#1f2839] transition-colors"
                >
                  {language === 'ta' ? 'साफ़ करें' : 'Clear'}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-sm font-medium text-[#b69d74] hover:text-[#1f2839] transition-colors"
                >
                  {language === 'ta' ? 'निर्यात' : 'Export'}
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="px-3 py-1 text-sm font-medium text-[#b69d74] hover:text-[#1f2839] transition-colors"
                >
                  {language === 'ta' ? 'संग्रहीत करें' : 'Archive'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-[#6b7280]">
          <span>
            {language === 'ta' ? 
              `${filteredAndSortedCases.length} मामले दिख रहे हैं ${cases.length} में से` :
              `Showing ${filteredAndSortedCases.length} of ${cases.length} cases`
            }
          </span>
          <button
            onClick={exportToCSV}
            className="flex items-center px-3 py-1 text-[#6b7280] hover:text-[#1f2839] transition-colors hover:bg-white rounded-md border border-transparent hover:border-[#1f283915]"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Cases Display */}
        {viewMode === 'table' ? (
          // Table View
          <div className="bg-white rounded-xl border-2 border-[#1f283915] overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-[#1f283920]">
                <thead className="bg-gradient-to-r from-[#f5f5ef] to-[#fafaf8]">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input 
                        type="checkbox" 
                        checked={selectedCases.length === filteredAndSortedCases.length && filteredAndSortedCases.length > 0} 
                        onChange={handleSelectAll} 
                        className="h-4 w-4 text-[#b69d74] focus:ring-[#b69d74] border-[#1f283925] rounded" 
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#1f2839] uppercase tracking-wider">Case</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#1f2839] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#1f2839] uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#1f2839] uppercase tracking-wider">Next Hearing</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#1f2839] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y-2 divide-[#1f283910]">
                  {filteredAndSortedCases.map((case_) => (
                    <tr key={case_.id} className="hover:bg-gradient-to-r hover:from-[#f5f5ef] hover:to-[#fafaf8] transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedCases.includes(case_.id)} 
                          onChange={() => handleCaseSelection(case_.id)} 
                          className="h-4 w-4 text-[#b69d74] focus:ring-[#b69d74] border-[#1f283925] rounded" 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Link 
                                to={`/clerk/case/${case_.id}`} 
                                className="text-sm font-semibold text-[#b69d74] hover:text-[#1f2839] transition-colors"
                              >
                                {case_.number}
                              </Link>
                              <button 
                                onClick={(e) => toggleFavorite(case_.id, e)} 
                                className={`p-1 rounded-lg transition-all duration-200 ${favorites.has(case_.id) ? 'text-[#f59e0b] bg-[#f59e0b15]' : 'text-[#6b7280] hover:text-[#f59e0b] hover:bg-[#f59e0b10]'}`}
                              >
                                <svg className="h-4 w-4" fill={favorites.has(case_.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </button>
                            </div>
                            <div className="text-sm font-medium text-[#1f2839] mt-1">{case_.title}</div>
                            <div className="text-xs text-[#6b7280] mt-0.5">{case_.court} • {case_.judge}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs rounded-lg font-semibold ${getStatusColor(case_.status)}`}>
                          {case_.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs rounded-lg font-semibold ${getPriorityColor(case_.priority)}`}>
                          {case_.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1f2839]">
                        {case_.nextHearing ? (
                          <div>
                            <div className="font-medium">{new Date(case_.nextHearing).toLocaleDateString()}</div>
                            <div className="text-xs text-[#6b7280]">{case_.hearingTime}</div>
                          </div>
                        ) : (
                          <span className="text-[#6b7280]">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => navigate(`/clerk/case/${case_.id}`)} 
                          className="px-4 py-1.5 text-[#b69d74] hover:text-white hover:bg-[#b69d74] border-2 border-[#b69d74] rounded-lg transition-all duration-200 font-semibold"
                        >
                          {language === 'ta' ? 'देखें' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCases.map((case_) => (
              <div 
                key={case_.id} 
                className="bg-white rounded-xl border-2 border-[#1f283915] p-6 hover:shadow-2xl hover:border-[#b69d7440] transition-all duration-300 cursor-pointer shadow-md hover:scale-[1.02]" 
                onClick={() => navigate(`/clerk/case/${case_.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={selectedCases.includes(case_.id)} 
                      onChange={(e) => { e.stopPropagation(); handleCaseSelection(case_.id); }} 
                      className="h-4 w-4 text-[#b69d74] focus:ring-[#b69d74] border-[#1f283925] rounded" 
                    />
                    <div 
                      className="text-lg font-bold text-[#b69d74] hover:text-[#1f2839] transition-colors" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link to={`/clerk/case/${case_.id}`}>{case_.number}</Link>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(case_.id, e)} 
                    className={`p-1.5 rounded-lg transition-all duration-200 ${favorites.has(case_.id) ? 'text-[#f59e0b] bg-[#f59e0b15]' : 'text-[#6b7280] hover:text-[#f59e0b] hover:bg-[#f59e0b10]'}`}
                  >
                    <svg className="h-5 w-5" fill={favorites.has(case_.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-base font-semibold text-[#1f2839] mb-3 line-clamp-2">{case_.title}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(case_.status)}`}>
                    {case_.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(case_.priority)}`}>
                    {case_.priority}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-[#6b7280]">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {case_.court}
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {case_.judge}
                  </div>
                  {case_.nextHearing && (
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(case_.nextHearing).toLocaleDateString()} at {case_.hearingTime}
                    </div>
                  )}
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {case_.documents} documents
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#1f283915]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6b7280]">Updated {case_.lastUpdate}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/clerk/case/${case_.id}`); }} 
                      className="px-3 py-1 text-xs font-medium text-[#b69d74] hover:text-[#1f2839] border border-[#b69d7440] rounded hover:bg-[#b69d7410] transition-colors"
                    >
                      {language === 'ta' ? 'देखें' : 'View'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedCases.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-[#1f283915] shadow-sm">
            <svg className="h-12 w-12 text-[#6b7280] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-[#1f2839] mb-2">
              {language === 'ta' ? 'कोई मामले नहीं मिले' : 'No cases found'}
            </h3>
            <p className="text-[#6b7280] mb-4">
              {language === 'ta' ? 
                'आपकी खोज या फ़िल्टर से मेल खाने वाले कोई मामले नहीं हैं।' :
                'No cases match your search or filter criteria.'
              }
            </p>
            <button 
              onClick={() => { 
                setSearchQuery(''); 
                setFilters({ status: 'all', priority: 'all', court: 'all', caseType: 'all' }); 
              }} 
              className="text-[#b69d74] hover:text-[#1f2839] font-medium transition-colors"
            >
              {language === 'ta' ? 'फ़िल्टर साफ़ करें' : 'Clear filters'}
            </button>
          </div>
        )}
      </div>

      {/* NEW CASE MODAL */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Modal Header with Submit Button */}
            <div className="sticky top-0 bg-white border-b border-[#1f283915] px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10 shadow-sm">
              <div className="flex items-center justify-between sm:justify-start flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1f2839]">
                  {language === 'ta' ? 'नया मामला बनाएँ' : 'Create New Case'}
                </h2>
                <button 
                  onClick={() => { setShowNewCaseModal(false); resetForm(); }} 
                  className="sm:hidden text-[#6b7280] hover:text-[#1f2839] transition-colors p-1"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Submit Button in Header */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCaseModal(false);
                    resetForm();
                  }}
                  disabled={submitting}
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-[#6b7280] bg-white border border-[#1f283925] rounded-lg hover:bg-[#f5f5ef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('newCaseForm').requestSubmit();
                  }}
                  disabled={submitting}
                  className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white bg-[#b69d74] rounded-lg hover:bg-[#b69d74DD] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] sm:min-w-[120px]"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Creating...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {language === 'ta' ? 'बनाएँ' : 'Submit'}
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => { setShowNewCaseModal(false); resetForm(); }} 
                  className="hidden sm:block text-[#6b7280] hover:text-[#1f2839] transition-colors p-1"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <form id="newCaseForm" onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  
                  {/* Case Number */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Case Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="number"
                      value={newCase.number}
                      onChange={handleInputChange}
                      placeholder="e.g., 2023/CRL/001"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Case Status */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Case Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={newCase.status}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Client */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Client <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="client"
                      value={newCase.client}
                      onChange={handleInputChange}
                      placeholder="Client name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Opposing Party */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Opposing Party <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="opposingParty"
                      value={newCase.opposingParty}
                      onChange={handleInputChange}
                      placeholder="Opposing party name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Court */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Court <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="court"
                      value={newCase.court}
                      onChange={handleInputChange}
                      placeholder="Court name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Filing Date */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Filing Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      name="filingDate"
                      value={newCase.filingDate}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Case Type */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Case Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="caseType"
                      value={newCase.caseType}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    >
                      <option value="Civil">Civil</option>
                      <option value="Criminal">Criminal</option>
                      <option value="Family">Family</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Judge */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Judge <span className="text-[#6b7280] text-xs">(optional)</span>
                    </label>
                    <input
                      name="judge"
                      value={newCase.judge}
                      onChange={handleInputChange}
                      placeholder="Hon. Justice..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Next Hearing Date */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Next Hearing Date <span className="text-[#6b7280] text-xs">(optional)</span>
                    </label>
                    <input
                      type="date"
                      name="nextHearing"
                      value={newCase.nextHearing}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Hearing Time */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Hearing Time <span className="text-[#6b7280] text-xs">(optional)</span>
                    </label>
                    <input
                      type="time"
                      name="hearingTime"
                      value={newCase.hearingTime}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Description <span className="text-[#6b7280] text-xs">(optional)</span>
                    </label>
                    <textarea
                      name="description"
                      value={newCase.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief case description..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-[#1f283925] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b69d74] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Acts & Sections */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                      Acts & Sections <span className="text-[#6b7280] text-xs">(select multiple)</span>
                    </label>
                    <div className="border border-[#1f283925] rounded-lg p-3 sm:p-4 max-h-40 sm:max-h-48 overflow-y-auto bg-[#fafaf8]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {actsOptions.map((act) => (
                          <label
                            key={act}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={newCase.actsSections.includes(act)}
                              onChange={() => handleActsChange(act)}
                              className="h-4 w-4 text-[#b69d74] focus:ring-[#b69d74] border-[#1f283925] rounded flex-shrink-0"
                            />
                            <span className="text-xs sm:text-sm text-[#1f2839]">{act}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {newCase.actsSections.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newCase.actsSections.map((act) => (
                          <span
                            key={act}
                            className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-[#b69d7420] text-[#b69d74] border border-[#b69d7440]"
                          >
                            <span className="max-w-[150px] sm:max-w-none truncate">{act}</span>
                            <button
                              type="button"
                              onClick={() => handleActsChange(act)}
                              className="ml-1 sm:ml-2 text-[#b69d74] hover:text-[#1f2839] flex-shrink-0"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Mobile Submit Button */}
                <div className="sm:hidden mt-6 pt-6 border-t border-[#1f283915] space-y-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#b69d74] rounded-lg hover:bg-[#b69d74DD] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ta' ? 'मामला बनाएँ' : 'Create Case'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCaseModal(false);
                      resetForm();
                    }}
                    disabled={submitting}
                    className="w-full px-6 py-3 text-sm font-medium text-[#6b7280] bg-white border border-[#1f283925] rounded-lg hover:bg-[#f5f5ef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseList;