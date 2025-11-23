import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  MousePointer,
  Clock,
  Target,
  Globe,
  Smartphone,
  Monitor,
  Calendar
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const mainMetrics = [
    {
      title: 'Total Revenue',
      value: '₹28.5L',
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Active Users',
      value: '8,234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Avg. Session',
      value: '24m 35s',
      change: '+4.2%',
      trend: 'up',
      icon: Clock,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 45234, percentage: 42, color: 'bg-blue-500' },
    { source: 'Direct', visitors: 28456, percentage: 26, color: 'bg-green-500' },
    { source: 'Social Media', visitors: 19876, percentage: 18, color: 'bg-purple-500' },
    { source: 'Referral', visitors: 10567, percentage: 10, color: 'bg-orange-500' },
    { source: 'Email', visitors: 4321, percentage: 4, color: 'bg-pink-500' }
  ];

  const deviceBreakdown = [
    { device: 'Desktop', users: 52345, percentage: 48, icon: Monitor, color: 'from-blue-500 to-indigo-600' },
    { device: 'Mobile', users: 45678, percentage: 42, icon: Smartphone, color: 'from-green-500 to-emerald-600' },
    { device: 'Tablet', users: 10876, percentage: 10, icon: Globe, color: 'from-purple-500 to-pink-600' }
  ];

  const topPages = [
    { page: '/student/dashboard', views: 145234, bounceRate: 24, avgTime: '4m 32s' },
    { page: '/advocate/cases', views: 98765, bounceRate: 18, avgTime: '6m 45s' },
    { page: '/courses', views: 87654, bounceRate: 32, avgTime: '3m 12s' },
    { page: '/advocate/research', views: 76543, bounceRate: 21, avgTime: '5m 23s' },
    { page: '/student/library', views: 65432, bounceRate: 28, avgTime: '4m 01s' }
  ];

  const userGrowth = [
    { month: 'Jan', users: 8234, newUsers: 1234 },
    { month: 'Feb', users: 9456, newUsers: 1422 },
    { month: 'Mar', users: 10876, newUsers: 1620 },
    { month: 'Apr', users: 12234, newUsers: 1758 },
    { month: 'May', users: 14567, newUsers: 2133 },
    { month: 'Jun', users: 16890, newUsers: 2423 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Comprehensive insights into your platform performance
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="mb-6 flex space-x-2">
        {['24h', '7d', '30d', '90d', '1y'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              timeRange === range
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {range === '24h' ? 'Today' : range === '7d' ? 'Week' : range === '30d' ? 'Month' : range === '90d' ? 'Quarter' : 'Year'}
          </button>
        ))}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  metric.trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span>{metric.change}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">User Growth</h2>
          <div className="space-y-4">
            {userGrowth.map((data, index) => {
              const maxUsers = Math.max(...userGrowth.map(d => d.users));
              const percentage = (data.users / maxUsers) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{data.month}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400">+{data.newUsers} new</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{data.users.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{source.source}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{source.visitors.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${source.color} rounded-full transition-all duration-500`}
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-12 text-right">
                  {source.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Breakdown & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Device Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Device Breakdown</h2>
          <div className="space-y-6">
            {deviceBreakdown.map((device, index) => {
              const Icon = device.icon;
              return (
                <div key={index} className="group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${device.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{device.device}</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{device.users.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{device.percentage}%</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${device.color} rounded-full transition-all duration-500`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pages */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Top Pages</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Page</th>
                  <th className="pb-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Views</th>
                  <th className="pb-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Bounce Rate</th>
                  <th className="pb-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="py-4">
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{page.page}</p>
                    </td>
                    <td className="py-4 text-right">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{page.views.toLocaleString()}</p>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        page.bounceRate < 25 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        page.bounceRate < 30 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {page.bounceRate}%
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <p className="text-sm text-slate-600 dark:text-slate-400">{page.avgTime}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Real-time Activity</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Live user activity on the platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">1,234 active now</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <Eye className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">234</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Pageviews/min</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <MousePointer className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">89</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Clicks/min</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <Users className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">45</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">New users/hour</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <Activity className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">92%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Server uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
