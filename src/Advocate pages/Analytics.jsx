import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle,
  BookOpen,
  Clock,
  Users,
  FileText,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  Activity,
  Scale,
  Briefcase,
  PieChart,
  LineChart,
  Menu,
  Mail,
  Phone,
  Star,
  X
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = () => {
  // Professional color palette
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
    green: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    red: '#ef4444'
  };

  // API Configuration
  // const API_BASE_URL =  'https://server.chakshi.com/api';
  const API_BASE_URL =  'http://localhost:4000/api';


  // State Management
  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ timeframe: '1y' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showClientsSection, setShowClientsSection] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Client data
  const [clients, setClients] = useState([
   
    
    {
      id: 3,
      name: 'Amit Agarwal',
      company: 'Agarwal Enterprises',
      email: 'amit@agarwalenterprises.com',
      phone: '+91 76543 21098',
      status: 'Inactive',
      type: 'Partnership',
      rating: 4,
      totalCases: 12,
      activeCases: 0,
      totalBilled: 2800000,
      outstandingDues: 0,
      lastContact: '2024-08-15',
      joinDate: '2021-11-20',
      avatar: null
    }
  ]);

  // Fetch cases from backend
  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching cases from API...');
      const response = await axios.get(`${API_BASE_URL}/cases`);
      
      console.log('Cases API Response:', response.data);
      
      if (response.data.success) {
        // Transform backend data to match frontend structure
        const transformedCases = response.data.data.map(caseItem => ({
          id: caseItem._id || caseItem.id,
          caseNumber: caseItem.caseNumber,
          caseTitle: caseItem.caseTitle || 'Untitled Case',
          court: caseItem.court || 'Not Assigned',
          clientName: caseItem.clientName || 'Unknown Client',
          oppositeParty: caseItem.oppositeParty || 'Not Specified',
          status: caseItem.status || 'active', // 'active', 'closed', 'archived'
          stage: caseItem.stage || 'Initial Filing',
          nextHearing: caseItem.nextHearing,
          createdDate: caseItem.createdDate,
          lastUpdated: caseItem.lastUpdated,
          documents: caseItem.documents || [],
          timeline: caseItem.timeline || []
        }));
        
        setCaseData(transformedCases);
        console.log('Cases fetched successfully:', transformedCases.length);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      setError(error.response?.data?.message || 'Failed to fetch cases. Please try again.');
      setCaseData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cases on component mount
  useEffect(() => {
    fetchCases();
  }, []);

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'active') return colors.green;
    if (statusLower === 'closed') return colors.blue;
    if (statusLower === 'archived') return colors.gray;
    return colors.amber;
  };

  const getStatusBgColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'active') return `${colors.green}20`;
    if (statusLower === 'closed') return `${colors.blue}20`;
    if (statusLower === 'archived') return `${colors.gray}20`;
    return `${colors.amber}20`;
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalCases = caseData.length;
    const activeCases = caseData.filter(c => c.status?.toLowerCase() === 'active').length;
    const closedCases = caseData.filter(c => c.status?.toLowerCase() === 'closed').length;
    const archivedCases = caseData.filter(c => c.status?.toLowerCase() === 'archived').length;

    return { totalCases, activeCases, closedCases, archivedCases };
  }, [caseData]);

  // Filtered case data based on search
  const filteredCaseData = useMemo(() => {
    return caseData.filter(caseItem =>
      caseItem.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.oppositeParty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.court?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.stage?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [caseData, searchTerm]);

  // Mobile-optimized chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          },
          color: colors.navy
        }
      },
      tooltip: {
        backgroundColor: `rgba(${parseInt(colors.navy.slice(1, 3), 16)}, ${parseInt(colors.navy.slice(3, 5), 16)}, ${parseInt(colors.navy.slice(5, 7), 16)}, 0.95)`,
        titleColor: colors.cream,
        bodyColor: colors.cream,
        borderColor: colors.golden,
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        displayColors: false
      }
    }
  };

  const statCards = [
    { title: 'Total Cases', value: metrics.totalCases, icon: FileText, change: 12 },
    { title: 'Active Cases', value: metrics.activeCases, icon: Activity, change: 5 },
    { title: 'Closed Cases', value: metrics.closedCases, icon: CheckCircle, change: 8 },
    { title: 'Archived Cases', value: metrics.archivedCases, icon: BookOpen, change: -2 }
  ];

  return (
    <div 
      className="min-h-screen ml-60" 
      style={{background: colors.cream}}
    >
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.10))`,
          backdropFilter: 'blur(6px)',
          borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        }}>
          <div className="px-4 py-3 sm:px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-lg sm:text-xl font-bold" style={{color: colors.navy}}>
                  Analytics Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {/* <button
                  onClick={() => setShowClientsSection(!showClientsSection)}
                  className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-sm"
                  style={{
                    background: showClientsSection 
                      ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                      : `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                    color: showClientsSection ? 'white' : colors.golden,
                    border: showClientsSection ? 'none' : `1px solid ${colors.golden}40`
                  }}
                >
                  <Users className="w-4 h-4 sm:mr-2 inline" />
                  <span className="hidden sm:inline">View Clients</span>
                </button> */}
                <button
                  onClick={() => setShowNewClientModal(true)}
                  className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                    color: 'white'
                  }}
                >
                  <Users className="w-4 h-4 sm:mr-2 inline" />
                  <span className="hidden sm:inline">Onboard Client</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-3 sm:p-4 md:p-6">
          {/* Key Metrics Grid - Responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {statCards.map((stat, index) => (
              <div 
                key={index}
                className="p-3 sm:p-4 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  backdropFilter: 'blur(6px)',
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                  boxShadow: `0 0 15px rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.20)`
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{
                    background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
                  }}>
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.golden }} />
                  </div>
                  <div className="flex items-center gap-1">
                    {/* <span className={`text-xs font-semibold`} style={{
                      color: stat.change > 0 ? colors.green : colors.red
                    }}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span> */}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1" style={{color: colors.navy}}>
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm truncate" style={{color: colors.gray}}>
                    {stat.title}
                  </p>
                </div>
              </div>
            ))}
          </div>  
           
          {/* Case Summary Table with Mobile Optimization */}
          <div className="p-4 sm:p-6 rounded-lg" style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
            backdropFilter: 'blur(6px)',
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
                }}>
                  <FileText className="w-4 h-4" style={{ color: colors.golden }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold" style={{color: colors.navy}}>
                    Case Summary
                  </h3>
                  <p className="text-xs" style={{ color: colors.gray }}>
                    {loading ? 'Loading...' : `${filteredCaseData.length} cases found`}
                  </p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: colors.gray }} />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                  className="w-full sm:w-48 pl-10 pr-3 py-2 text-sm rounded-lg focus:outline-none transition-all"
                  style={{
                    background: `rgba(255, 255, 255, 0.06)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                    color: colors.navy,
                    backdropFilter: 'blur(6px)',
                    opacity: loading ? 0.5 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.golden}
                  onBlur={(e) => e.target.style.borderColor = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}
                />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.golden }}></div>
                  <p style={{ color: colors.gray }}>Loading cases...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: colors.amber + '20', border: `1px solid ${colors.amber}` }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: colors.amber }} />
                  <p style={{ color: colors.navy }}>{error}</p>
                </div>
                <button
                  onClick={fetchCases}
                  className="mt-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: colors.golden, color: 'white' }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredCaseData.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: colors.gray }} />
                <p className="text-base font-medium" style={{ color: colors.gray }}>
                  {searchTerm ? 'No cases match your search' : 'No cases found'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-sm"
                    style={{ color: colors.golden }}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
            
            {/* Mobile Card View */}
            {!loading && !error && filteredCaseData.length > 0 && (
              <div className="block sm:hidden">
                <div className="space-y-3">
                  {filteredCaseData.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                      }}
                    >
                      <div className="space-y-2">
                        {/* Case Number & Status */}
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs" style={{ color: colors.gray }}>Case Number</p>
                            <h4 className="font-semibold text-sm" style={{ color: colors.navy }}>
                              {caseItem.caseNumber}
                            </h4>
                          </div>
                          <span
                            className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
                            style={{
                              background: getStatusBgColor(caseItem.status),
                              color: getStatusColor(caseItem.status),
                              border: `1px solid ${getStatusColor(caseItem.status)}40`,
                              textTransform: 'capitalize'
                            }}
                          >
                            {caseItem.status}
                          </span>
                        </div>

                        {/* Case Title */}
                        <div>
                          <p className="text-xs" style={{ color: colors.gray }}>Case Title</p>
                          <p className="text-sm font-medium" style={{ color: colors.navy }}>
                            {caseItem.caseTitle}
                          </p>
                        </div>

                        {/* Court */}
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3 h-3" style={{ color: colors.golden }} />
                          <div>
                            <p className="text-xs" style={{ color: colors.gray }}>Court</p>
                            <p className="text-sm" style={{ color: colors.navy }}>{caseItem.court}</p>
                          </div>
                        </div>

                        {/* Client & Opposite Party */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t" style={{
                          borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                        }}>
                          <div>
                            <p className="text-xs" style={{ color: colors.gray }}>Client</p>
                            <p className="text-sm font-medium truncate" style={{ color: colors.navy }}>
                              {caseItem.clientName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs" style={{ color: colors.gray }}>Opposite Party</p>
                            <p className="text-sm font-medium truncate" style={{ color: colors.navy }}>
                              {caseItem.oppositeParty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            {!loading && !error && filteredCaseData.length > 0 && (
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr style={{borderBottom: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}}>
                      <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Case Number</th>
                      <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Case Title</th>
                      <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Court</th>
                      <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Client Name</th>
                      <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Opposite Party</th>
                      <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCaseData.map((caseItem) => (
                      <tr
                        key={caseItem.id}
                        className="transition-all duration-200"
                        style={{
                          borderBottom: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-3">
                          <span className="text-sm font-semibold" style={{ color: colors.navy }}>
                            {caseItem.caseNumber}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm" style={{ color: colors.navy }}>
                            {caseItem.caseTitle}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" style={{ color: colors.golden }} />
                            <span className="text-sm" style={{ color: colors.navy }}>
                              {caseItem.court}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-medium" style={{ color: colors.navy }}>
                            {caseItem.clientName}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-medium" style={{ color: colors.navy }}>
                            {caseItem.oppositeParty}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              background: getStatusBgColor(caseItem.status),
                              color: getStatusColor(caseItem.status),
                              border: `1px solid ${getStatusColor(caseItem.status)}40`,
                              textTransform: 'capitalize'
                            }}
                          >
                            {caseItem.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Clients Section */}
          {showClientsSection && (
            <div className="mt-6">
              <div className="p-4 sm:p-6 rounded-lg mb-6" style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                backdropFilter: 'blur(6px)',
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
              }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold" style={{color: colors.navy}}>
                    Client Portfolio
                  </h2>
                  <div className="text-sm" style={{color: colors.gray}}>
                    {clients.length} Total Clients
                  </div>
                </div>

                {/* Client Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className="p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                        backdropFilter: 'blur(6px)',
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                        boxShadow: `0 0 15px rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                            style={{
                              background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`,
                              color: colors.golden
                            }}
                          >
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm" style={{color: colors.navy}}>
                              {client.name}
                            </h3>
                            <p className="text-xs" style={{color: colors.gray}}>
                              {client.company}
                            </p>
                          </div>
                        </div>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: client.status === 'Active' 
                              ? `${colors.green}15` 
                              : `${colors.gray}15`,
                            color: client.status === 'Active' ? colors.green : colors.gray,
                            border: `1px solid ${client.status === 'Active' ? colors.green : colors.gray}40`
                          }}
                        >
                          {client.status}
                        </span>
                      </div>

                      {/* Client Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs" style={{color: colors.gray}}>
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{color: colors.gray}}>
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{
                        borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                      }}>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{color: colors.navy}}>
                            {client.totalCases}
                          </div>
                          <div className="text-xs" style={{color: colors.gray}}>
                            Cases
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{color: colors.golden}}>
                            {client.activeCases}
                          </div>
                          <div className="text-xs" style={{color: colors.gray}}>
                            Active
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{color: colors.green}}>
                            â‚¹{(client.totalBilled / 100000).toFixed(1)}L
                          </div>
                          <div className="text-xs" style={{color: colors.gray}}>
                            Billed
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3"
                            fill={i < client.rating ? colors.golden : 'none'}
                            style={{color: i < client.rating ? colors.golden : colors.gray}}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6" style={{
              background: colors.cream,
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`,
                      color: colors.golden
                    }}
                  >
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{color: colors.navy}}>
                      {selectedClient.name}
                    </h2>
                    <p className="text-sm" style={{color: colors.gray}}>
                      {selectedClient.company} â€¢ {selectedClient.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                    color: colors.golden
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="p-4 rounded-lg" style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}>
                  <h3 className="font-semibold mb-4" style={{color: colors.navy}}>
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" style={{color: colors.golden}} />
                      <span className="text-sm" style={{color: colors.navy}}>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4" style={{color: colors.golden}} />
                      <span className="text-sm" style={{color: colors.navy}}>{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" style={{color: colors.golden}} />
                      <span className="text-sm" style={{color: colors.navy}}>
                        Joined: {new Date(selectedClient.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4" style={{color: colors.golden}} />
                      <span className="text-sm" style={{color: colors.navy}}>
                        Last Contact: {new Date(selectedClient.lastContact).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Case Statistics */}
                <div className="p-4 rounded-lg" style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}>
                  <h3 className="font-semibold mb-4" style={{color: colors.navy}}>
                    Case Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{color: colors.gray}}>Total Cases:</span>
                      <span className="text-sm font-semibold" style={{color: colors.navy}}>{selectedClient.totalCases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{color: colors.gray}}>Active Cases:</span>
                      <span className="text-sm font-semibold" style={{color: colors.golden}}>{selectedClient.activeCases}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="p-4 rounded-lg" style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}>
                  <h3 className="font-semibold mb-4" style={{color: colors.navy}}>
                    Financial Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{color: colors.gray}}>Total Billed:</span>
                      <span className="text-sm font-semibold" style={{color: colors.green}}>
                        â‚¹{selectedClient.totalBilled.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{color: colors.gray}}>Outstanding Dues:</span>
                      <span className="text-sm font-semibold" style={{color: selectedClient.outstandingDues > 0 ? colors.amber : colors.green}}>
                        â‚¹{selectedClient.outstandingDues.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Client Rating */}
                <div className="p-4 rounded-lg" style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                }}>
                  <h3 className="font-semibold mb-4" style={{color: colors.navy}}>
                    Client Rating
                  </h3>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6"
                        fill={i < selectedClient.rating ? colors.golden : 'none'}
                        style={{color: i < selectedClient.rating ? colors.golden : colors.gray}}
                      />
                    ))}
                    <span className="text-lg font-bold ml-2" style={{color: colors.navy}}>
                      {selectedClient.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Client Modal */}
        {showNewClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="w-full max-w-2xl rounded-lg p-6" style={{
              background: colors.cream,
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{color: colors.navy}}>
                  Onboard New Client
                </h2>
                <button
                  onClick={() => setShowNewClientModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                    color: colors.golden
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  id: clients.length + 1,
                  name: e.target.clientName.value,
                  company: e.target.companyName.value,
                  email: e.target.email.value,
                  phone: e.target.phone.value,
                  status: 'Active',
                  type: e.target.clientType.value,
                  rating: 0,
                  totalCases: 0,
                  activeCases: 0,
                  totalBilled: 0,
                  outstandingDues: 0,
                  lastContact: new Date().toISOString().split('T')[0],
                  joinDate: new Date().toISOString().split('T')[0],
                  avatar: null
                };
                
                setClients(prev => [formData, ...prev]);
                setShowNewClientModal(false);
                setShowClientsSection(true);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                      Client Name *
                    </label>
                    <input
                      name="clientName"
                      type="text"
                      className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                        color: colors.navy
                      }}
                      placeholder="Enter client full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                      Company/Organization
                    </label>
                    <input
                      name="companyName"
                      type="text"
                      className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                        color: colors.navy
                      }}
                      placeholder="Company or organization name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                        color: colors.navy
                      }}
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                      Phone Number *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                      style={{
                        background: `rgba(255, 255, 255, 0.03)`,
                        border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                        color: colors.navy
                      }}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: colors.navy}}>
                    Client Type *
                  </label>
                  <select
                    name="clientType"
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all"
                    style={{
                      background: `rgba(255, 255, 255, 0.03)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                      color: colors.navy
                    }}
                    required
                  >
                    <option value="">Select client type</option>
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Trust">Trust</option>
                    <option value="NGO">NGO/Non-Profit</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewClientModal(false)}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                      background: `rgba(${parseInt(colors.gray.slice(1, 3), 16)}, ${parseInt(colors.gray.slice(3, 5), 16)}, ${parseInt(colors.gray.slice(5, 7), 16)}, 0.10)`,
                      color: colors.gray
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                      background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                      color: 'white'
                    }}
                  >
                    Onboard Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;