import React, { useState, useMemo } from 'react';
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
  Menu
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
    blue: '#3b82f6'
  };

  // Sample data for demonstration
  const [caseData] = useState([
    { id: 1, name: 'Smith v. Jones', progress: 65, risk: 'Medium', successProbability: 72, value: 125000, status: 'Active', category: 'Civil Litigation' },
    { id: 2, name: 'Williams v. Anderson Corp', progress: 30, risk: 'High', successProbability: 35, value: 450000, status: 'Active', category: 'Corporate Law' },
    { id: 3, name: 'State v. Peterson', progress: 85, risk: 'Low', successProbability: 88, value: 75000, status: 'Active', category: 'Criminal Defense' },
    { id: 4, name: 'Johnson Estate Planning', progress: 45, risk: 'Medium', successProbability: 60, value: 95000, status: 'Pending', category: 'Estate Planning' },
    { id: 5, name: 'Davis Contract Dispute', progress: 90, risk: 'Low', successProbability: 92, value: 150000, status: 'Active', category: 'Contract Law' },
    { id: 6, name: 'Thompson IP Case', progress: 70, risk: 'Medium', successProbability: 78, value: 275000, status: 'Active', category: 'Intellectual Property' },
    { id: 7, name: 'Miller Bankruptcy', progress: 95, risk: 'Low', successProbability: 85, value: 50000, status: 'Completed', category: 'Bankruptcy' }
  ]);

  const [filters, setFilters] = useState({ timeframe: '7d' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalCases = caseData.length;
    const activeCases = caseData.filter(c => c.status === 'Active').length;
    const totalValue = caseData.reduce((sum, c) => sum + c.value, 0);
    const avgSuccessRate = caseData.reduce((sum, c) => sum + c.successProbability, 0) / totalCases;
    const highRiskCases = caseData.filter(c => c.risk === 'High').length;

    return { totalCases, activeCases, totalValue, avgSuccessRate, highRiskCases };
  }, [caseData]);

  // Filtered case data based on search
  const filteredCaseData = useMemo(() => {
    return caseData.filter(caseItem =>
      caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        displayColors: false,
        titleFont: {
          size: window.innerWidth < 768 ? 11 : 12
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 11 : 12
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 11
          },
          color: colors.gray,
          maxRotation: window.innerWidth < 768 ? 45 : 0
        }
      },
      y: {
        grid: {
          color: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 11
          },
          color: colors.gray
        }
      }
    }
  };

  // Chart data configurations
  const progressData = {
    labels: filteredCaseData.map(c => {
      if (window.innerWidth < 640) {
        return c.name.substring(0, 12) + (c.name.length > 12 ? '...' : '');
      }
      return c.name.substring(0, 20) + (c.name.length > 20 ? '...' : '');
    }),
    datasets: [{
      label: 'Progress %',
      data: filteredCaseData.map(c => c.progress),
      backgroundColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.20)`,
      borderColor: colors.golden,
      borderWidth: 2,
      borderRadius: 6,
    }]
  };

  const riskData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [{
      data: [
        filteredCaseData.filter(c => c.risk === 'Low').length,
        filteredCaseData.filter(c => c.risk === 'Medium').length,
        filteredCaseData.filter(c => c.risk === 'High').length
      ],
      backgroundColor: [
        `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.20)`,
        `rgba(${parseInt(colors.amber.slice(1, 3), 16)}, ${parseInt(colors.amber.slice(3, 5), 16)}, ${parseInt(colors.amber.slice(5, 7), 16)}, 0.20)`,
        `rgba(239, 68, 68, 0.20)`
      ],
      borderColor: [colors.green, colors.amber, '#ef4444'],
      borderWidth: 2
    }]
  };

  const valueData = {
    labels: filteredCaseData.map(c => {
      if (window.innerWidth < 640) {
        return c.name.substring(0, 10) + (c.name.length > 10 ? '...' : '');
      }
      return c.name.substring(0, 15) + (c.name.length > 15 ? '...' : '');
    }),
    datasets: [{
      label: 'Case Value ($)',
      data: filteredCaseData.map(c => c.value),
      backgroundColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
      borderColor: colors.golden,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: colors.cream,
      pointBorderColor: colors.golden,
      pointBorderWidth: 2,
      pointRadius: window.innerWidth < 768 ? 3 : 4
    }]
  };

  const statCards = [
    { title: 'Total Cases', value: metrics.totalCases, icon: FileText, change: 12 },
    { title: 'Active Cases', value: metrics.activeCases, icon: Activity, change: 5 },
    { title: 'Total Value', value: `$${(metrics.totalValue / 1000000).toFixed(1)}M`, icon: DollarSign, change: 8 },
    { title: 'Success Rate', value: `${metrics.avgSuccessRate.toFixed(1)}%`, icon: Target, change: 3.2 }
  ];

  // Professional analytics sections
  const performanceMetrics = [
    { title: 'Win Rate', value: '78%', subtitle: 'Civil: 85%, Criminal: 72%', icon: Scale, trend: 'up' },
    { title: 'Case Duration', value: '8.2 months', subtitle: 'Improved from 9.1 months', icon: Clock, trend: 'up' },
    { title: 'Court Performance', value: '4.2/5', subtitle: 'High Court: 4.5, District: 3.9', icon: Briefcase, trend: 'stable' },
    { title: 'Attendance Rate', value: '94%', subtitle: 'Excellent attendance record', icon: Calendar, trend: 'up' }
  ];

  const financialMetrics = [
    { title: 'Monthly Revenue', value: '$45K', subtitle: '+15% vs last month', icon: TrendingUp, trend: 'up' },
    { title: 'Outstanding Fees', value: '$18K', subtitle: 'Average age: 42 days', icon: Clock, trend: 'down' },
    { title: 'Expense Ratio', value: '28%', subtitle: 'Court fees: 12%, Travel: 8%', icon: PieChart, trend: 'stable' },
    { title: 'Client Value', value: '$125K', subtitle: 'Average client lifetime value', icon: Users, trend: 'up' }
  ];

  const productivityMetrics = [
    { title: 'Billable Hours', value: '156h', subtitle: 'Current month tracking', icon: Clock, trend: 'up' },
    { title: 'Document Processing', value: '2.3 days', subtitle: 'Average drafting time', icon: FileText, trend: 'up' },
    { title: 'Research Efficiency', value: '65%', subtitle: 'Time saved with technology', icon: BookOpen, trend: 'up' },
    { title: 'Task Completion', value: '91%', subtitle: 'Deadlines successfully met', icon: CheckCircle, trend: 'stable' }
  ];

  const predictiveMetrics = [
    { title: 'Success Probability', value: '76%', subtitle: 'AI prediction confidence', icon: Target, trend: 'up' },
    { title: 'Delay Risk', value: 'Medium', subtitle: '2-3 weeks expected', icon: AlertTriangle, trend: 'stable' },
    { title: 'Settlement Likelihood', value: '42%', subtitle: 'Mediation recommended', icon: Scale, trend: 'up' },
    { title: 'Case Complexity', value: '68%', subtitle: 'Above average complexity', icon: Activity, trend: 'up' }
  ];

  return (
    <div className="min-h-screen" style={{background: colors.cream}}>
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
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-lg mr-2 transition-colors"
                  style={{
                    background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.08)`,
                    color: colors.navy
                  }}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold" style={{color: colors.navy}}>
                    Legal Analytics Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm hidden sm:block" style={{color: colors.gray}}>
                    Comprehensive practice performance insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3" style={{ color: colors.gray }} />
                  <select 
                    className="text-xs sm:text-sm pl-7 pr-3 py-1.5 rounded-lg focus:outline-none transition-all appearance-none"
                    style={{
                      background: `rgba(255, 255, 255, 0.06)`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                      color: colors.navy,
                      backdropFilter: 'blur(6px)'
                    }}
                    value={filters.timeframe}
                    onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
                    onFocus={(e) => e.target.style.borderColor = colors.golden}
                    onBlur={(e) => e.target.style.borderColor = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}
                  >
                    <option value="7d">7 Days</option>
                    <option value="90d">90 Days</option>
                    <option value="1y">1 Year</option>
                  </select>
                </div>
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
                    <span className={`text-xs font-semibold`} style={{
                      color: stat.change > 0 ? colors.green : '#ef4444'
                    }}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
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

          {/* Charts Section - Stack on mobile */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Case Progress Chart */}
            <div className="p-4 sm:p-6 rounded-lg" style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
              backdropFilter: 'blur(6px)',
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-semibold" style={{color: colors.navy}}>
                  Case Progress
                </h3>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
                }}>
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: colors.golden }} />
                </div>
              </div>
              <div style={{ height: '250px', minHeight: '200px' }}>
                <Bar data={progressData} options={chartOptions} />
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="p-4 sm:p-6 rounded-lg" style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
              backdropFilter: 'blur(6px)',
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-semibold" style={{color: colors.navy}}>
                  Risk Distribution
                </h3>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
                }}>
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: colors.golden }} />
                </div>
              </div>
              <div style={{ height: '250px', minHeight: '200px' }}>
                <Doughnut 
                  data={riskData} 
                  options={{
                    ...chartOptions, 
                    cutout: window.innerWidth < 768 ? '50%' : '60%'
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Case Value Trend - Full width */}
          <div className="p-4 sm:p-6 rounded-lg mb-6" style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
            backdropFilter: 'blur(6px)',
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold" style={{color: colors.navy}}>
                Case Value Trends
              </h3>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
              }}>
                <LineChart className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: colors.golden }} />
              </div>
            </div>
            <div style={{ height: '280px', minHeight: '250px' }}>
              <Line data={valueData} options={chartOptions} />
            </div>
          </div>

          {/* Advanced Analytics Sections */}
          
          {/* Performance Metrics */}
          <div className="p-4 sm:p-6 rounded-lg mb-6" style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
            backdropFilter: 'blur(6px)',
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{color: colors.navy}}>Performance Metrics</h3>
                <p className="text-sm" style={{color: colors.gray}}>Win/Loss ratios, case durations, and court performance</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
              }}>
                <BarChart3 className="w-4 h-4" style={{ color: colors.golden }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg transition-all duration-200 hover:scale-105" style={{
                  background: `rgba(255, 255, 255, 0.03)`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      background: `linear-gradient(135deg, ${colors.golden}15, ${colors.golden}08)`
                    }}>
                      <metric.icon className="w-4 h-4" style={{ color: colors.golden }} />
                    </div>
                    <div className={`w-2 h-2 rounded-full`} style={{
                      background: metric.trend === 'up' ? colors.green : metric.trend === 'down' ? '#ef4444' : colors.amber
                    }}></div>
                  </div>
                  <h4 className="text-lg font-bold mb-1" style={{color: colors.navy}}>{metric.value}</h4>
                  <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>{metric.title}</p>
                  <p className="text-xs" style={{color: colors.golden}}>{metric.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Analytics */}
          <div className="p-4 sm:p-6 rounded-lg mb-6" style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
            backdropFilter: 'blur(6px)',
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{color: colors.navy}}>Financial Analytics</h3>
                <p className="text-sm" style={{color: colors.gray}}>Revenue trends, outstanding fees, and profitability</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
              }}>
                <DollarSign className="w-4 h-4" style={{ color: colors.golden }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {financialMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg transition-all duration-200 hover:scale-105" style={{
                  background: `rgba(255, 255, 255, 0.03)`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      background: `linear-gradient(135deg, ${colors.golden}15, ${colors.golden}08)`
                    }}>
                      <metric.icon className="w-4 h-4" style={{ color: colors.golden }} />
                    </div>
                    <div className={`w-2 h-2 rounded-full`} style={{
                      background: metric.trend === 'up' ? colors.green : metric.trend === 'down' ? '#ef4444' : colors.amber
                    }}></div>
                  </div>
                  <h4 className="text-lg font-bold mb-1" style={{color: colors.navy}}>{metric.value}</h4>
                  <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>{metric.title}</p>
                  <p className="text-xs" style={{color: colors.golden}}>{metric.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity Insights */}
          <div className="p-4 sm:p-6 rounded-lg mb-6" style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
            backdropFilter: 'blur(6px)',
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{color: colors.navy}}>Productivity Insights</h3>
                <p className="text-sm" style={{color: colors.gray}}>Time tracking, efficiency metrics, and task completion</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
              }}>
                <Activity className="w-4 h-4" style={{ color: colors.golden }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {productivityMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg transition-all duration-200 hover:scale-105" style={{
                  background: `rgba(255, 255, 255, 0.03)`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      background: `linear-gradient(135deg, ${colors.golden}15, ${colors.golden}08)`
                    }}>
                      <metric.icon className="w-4 h-4" style={{ color: colors.golden }} />
                    </div>
                    <div className={`w-2 h-2 rounded-full`} style={{
                      background: metric.trend === 'up' ? colors.green : metric.trend === 'down' ? '#ef4444' : colors.amber
                    }}></div>
                  </div>
                  <h4 className="text-lg font-bold mb-1" style={{color: colors.navy}}>{metric.value}</h4>
                  <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>{metric.title}</p>
                  <p className="text-xs" style={{color: colors.golden}}>{metric.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Analytics */}
          <div className="p-4 sm:p-6 rounded-lg mb-6" style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
            backdropFilter: 'blur(6px)',
            border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{color: colors.navy}}>Predictive Analytics</h3>
                <p className="text-sm" style={{color: colors.gray}}>AI-powered insights and predictions for case outcomes</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors.golden}20, ${colors.golden}10)`
              }}>
                <Target className="w-4 h-4" style={{ color: colors.golden }} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {predictiveMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg transition-all duration-200 hover:scale-105" style={{
                  background: `rgba(255, 255, 255, 0.03)`,
                  border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      background: `linear-gradient(135deg, ${colors.golden}15, ${colors.golden}08)`
                    }}>
                      <metric.icon className="w-4 h-4" style={{ color: colors.golden }} />
                    </div>
                    <div className={`w-2 h-2 rounded-full`} style={{
                      background: metric.trend === 'up' ? colors.green : metric.trend === 'down' ? '#ef4444' : colors.amber
                    }}></div>
                  </div>
                  <h4 className="text-lg font-bold mb-1" style={{color: colors.navy}}>{metric.value}</h4>
                  <p className="text-sm font-medium mb-1" style={{color: colors.gray}}>{metric.title}</p>
                  <p className="text-xs" style={{color: colors.golden}}>{metric.subtitle}</p>
                </div>
              ))}
            </div>
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
                <h3 className="text-base sm:text-lg font-semibold" style={{color: colors.navy}}>
                  Case Summary
                </h3>
              </div>
              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: colors.gray }} />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48 pl-10 pr-3 py-2 text-sm rounded-lg focus:outline-none transition-all"
                  style={{
                    background: `rgba(255, 255, 255, 0.06)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                    color: colors.navy,
                    backdropFilter: 'blur(6px)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.golden}
                  onBlur={(e) => e.target.style.borderColor = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}
                />
              </div>
            </div>
            
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="space-y-3">
                {filteredCaseData.map((caseItem) => (
                  <div key={caseItem.id} className="p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{
                    background: `rgba(255, 255, 255, 0.03)`,
                    border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                  }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm truncate" style={{color: colors.navy}}>{caseItem.name}</h4>
                        <p className="text-xs" style={{color: colors.gray}}>{caseItem.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium`} style={{
                        background: caseItem.status === 'Active' ? `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.20)` :
                        caseItem.status === 'Pending' ? `rgba(${parseInt(colors.amber.slice(1, 3), 16)}, ${parseInt(colors.amber.slice(3, 5), 16)}, ${parseInt(colors.amber.slice(5, 7), 16)}, 0.20)` :
                        `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.20)`,
                        color: caseItem.status === 'Active' ? colors.green :
                        caseItem.status === 'Pending' ? colors.amber : colors.blue,
                        border: `1px solid ${caseItem.status === 'Active' ? colors.green :
                        caseItem.status === 'Pending' ? colors.amber : colors.blue}40`
                      }}>
                        {caseItem.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span style={{color: colors.gray}}>Progress:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 rounded-full" style={{background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}}>
                            <div 
                              className="h-1.5 rounded-full"
                              style={{ width: `${caseItem.progress}%`, background: colors.golden }}
                            ></div>
                          </div>
                          <span className="font-medium" style={{color: colors.navy}}>{caseItem.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <span style={{color: colors.gray}}>Risk:</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium`} style={{
                          background: caseItem.risk === 'High' ? 'rgba(239, 68, 68, 0.20)' :
                          caseItem.risk === 'Medium' ? `rgba(${parseInt(colors.amber.slice(1, 3), 16)}, ${parseInt(colors.amber.slice(3, 5), 16)}, ${parseInt(colors.amber.slice(5, 7), 16)}, 0.20)` :
                          `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.20)`,
                          color: caseItem.risk === 'High' ? '#ef4444' :
                          caseItem.risk === 'Medium' ? colors.amber : colors.green,
                          border: `1px solid ${caseItem.risk === 'High' ? '#ef4444' :
                          caseItem.risk === 'Medium' ? colors.amber : colors.green}40`
                        }}>
                          {caseItem.risk}
                        </span>
                      </div>
                      <div>
                        <span style={{color: colors.gray}}>Success:</span>
                        <span className="font-medium" style={{color: colors.navy}}>{caseItem.successProbability}%</span>
                      </div>
                      <div>
                        <span style={{color: colors.gray}}>Value:</span>
                        <span className="font-medium" style={{color: colors.navy}}>${(caseItem.value/1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr style={{borderBottom: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}}>
                    <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Case Name</th>
                    <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Progress</th>
                    <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Risk</th>
                    <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Success</th>
                    <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Value</th>
                    <th className="text-left p-3 text-sm font-semibold" style={{color: colors.gray}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCaseData.map((caseItem) => (
                    <tr key={caseItem.id} className="transition-all duration-200" style={{
                      borderBottom: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.05)`}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="p-3">
                        <div>
                          <span className="text-sm font-medium block" style={{color: colors.navy}}>{caseItem.name}</span>
                          <span className="text-xs" style={{color: colors.gray}}>{caseItem.category}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full" style={{background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`}}>
                            <div 
                              className="h-2 rounded-full"
                              style={{ width: `${caseItem.progress}%`, background: colors.golden }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium" style={{color: colors.gray}}>{caseItem.progress}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium`} style={{
                          background: caseItem.risk === 'High' ? 'rgba(239, 68, 68, 0.20)' :
                          caseItem.risk === 'Medium' ? `rgba(${parseInt(colors.amber.slice(1, 3), 16)}, ${parseInt(colors.amber.slice(3, 5), 16)}, ${parseInt(colors.amber.slice(5, 7), 16)}, 0.20)` :
                          `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.20)`,
                          color: caseItem.risk === 'High' ? '#ef4444' :
                          caseItem.risk === 'Medium' ? colors.amber : colors.green,
                          border: `1px solid ${caseItem.risk === 'High' ? '#ef4444' :
                          caseItem.risk === 'Medium' ? colors.amber : colors.green}40`
                        }}>
                          {caseItem.risk}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-medium" style={{color: colors.navy}}>
                          {caseItem.successProbability}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-medium" style={{color: colors.navy}}>
                          ${caseItem.value.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium`} style={{
                          background: caseItem.status === 'Active' ? `rgba(${parseInt(colors.green.slice(1, 3), 16)}, ${parseInt(colors.green.slice(3, 5), 16)}, ${parseInt(colors.green.slice(5, 7), 16)}, 0.20)` :
                          caseItem.status === 'Pending' ? `rgba(${parseInt(colors.amber.slice(1, 3), 16)}, ${parseInt(colors.amber.slice(3, 5), 16)}, ${parseInt(colors.amber.slice(5, 7), 16)}, 0.20)` :
                          `rgba(${parseInt(colors.blue.slice(1, 3), 16)}, ${parseInt(colors.blue.slice(3, 5), 16)}, ${parseInt(colors.blue.slice(5, 7), 16)}, 0.20)`,
                          color: caseItem.status === 'Active' ? colors.green :
                          caseItem.status === 'Pending' ? colors.amber : colors.blue,
                          border: `1px solid ${caseItem.status === 'Active' ? colors.green :
                          caseItem.status === 'Pending' ? colors.amber : colors.blue}40`
                        }}>
                          {caseItem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;