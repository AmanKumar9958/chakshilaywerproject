import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Activity,
  CheckCircle,
  Filter
} from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('30d');

  const reportTypes = [
    {
      id: 'user-analytics',
      title: 'User Analytics Report',
      description: 'Comprehensive user behavior and engagement metrics',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      lastGenerated: '2 hours ago'
    },
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Financial performance and transaction analysis',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      lastGenerated: '1 day ago'
    },
    {
      id: 'content-performance',
      title: 'Content Performance',
      description: 'Course and content engagement statistics',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      lastGenerated: '3 hours ago'
    },
    {
      id: 'growth',
      title: 'Growth Metrics',
      description: 'Platform growth and user acquisition data',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
      lastGenerated: '5 hours ago'
    },
    {
      id: 'system-health',
      title: 'System Health Report',
      description: 'Server performance and uptime statistics',
      icon: Activity,
      color: 'from-cyan-500 to-blue-600',
      lastGenerated: '30 minutes ago'
    },
    {
      id: 'subscription',
      title: 'Subscription Report',
      description: 'Active subscriptions and renewal rates',
      icon: CheckCircle,
      color: 'from-yellow-500 to-orange-600',
      lastGenerated: '4 hours ago'
    }
  ];

  const quickStats = [
    { label: 'Reports Generated', value: '342', color: 'blue' },
    { label: 'Total Downloads', value: '1,234', color: 'green' },
    { label: 'Scheduled Reports', value: '12', color: 'purple' },
    { label: 'Last 30 Days', value: '89', color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Reports & Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Generate and download comprehensive reports
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Select Date Range</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Choose the period for report generation</p>
          </div>
          <div className="flex items-center space-x-3">
            {['7d', '30d', '1y', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  dateRange === range
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '1y' ? '1 Year' : 'Custom'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {report.lastGenerated}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {report.description}
                </p>

                <div className="flex items-center space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                    <FileBarChart className="w-4 h-4" />
                    <span className="text-sm font-medium">Generate</span>
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={`h-1 bg-gradient-to-r ${report.color}`}></div>
            </div>
          );
        })}
      </div>

      {/* Scheduled Reports */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Scheduled Reports</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Automated report generation schedule</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Schedule New</span>
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Weekly User Report', frequency: 'Every Monday 9:00 AM', nextRun: 'Oct 14, 2024', status: 'Active' },
            { name: 'Monthly Revenue Report', frequency: 'First day of month', nextRun: 'Nov 1, 2024', status: 'Active' },
            { name: 'Quarterly Growth Analysis', frequency: 'Every 3 months', nextRun: 'Jan 1, 2025', status: 'Active' }
          ].map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">{schedule.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{schedule.frequency}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Next run</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{schedule.nextRun}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                  {schedule.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
