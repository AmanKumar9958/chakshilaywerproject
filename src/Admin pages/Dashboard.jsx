import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  CreditCard,
  FileText,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Activity,
  ShoppingBag,
  UserCheck,
  Calendar,
  Clock,
  Eye,
  MoreVertical,
  Download
} from 'lucide-react';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalUsers: 12453,
    activeUsers: 8234,
    totalRevenue: 2845600,
    newSubscriptions: 342,
    coursesCompleted: 1893,
    avgSessionTime: '24m 35s'
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: UserCheck,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'New Subscriptions',
      value: stats.newSubscriptions,
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Courses Completed',
      value: stats.coursesCompleted,
      change: '+9.7%',
      trend: 'up',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      title: 'Avg Session Time',
      value: stats.avgSessionTime,
      change: '+4.2%',
      trend: 'up',
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'Rahul Sharma', action: 'Subscribed to Premium Plan', time: '2 minutes ago', type: 'subscription' },
    { id: 2, user: 'Priya Patel', action: 'Completed Course: Contract Law', time: '15 minutes ago', type: 'course' },
    { id: 3, user: 'Amit Kumar', action: 'Made payment of ₹4,999', time: '32 minutes ago', type: 'payment' },
    { id: 4, user: 'Sneha Reddy', action: 'Registered as new user', time: '1 hour ago', type: 'registration' },
    { id: 5, user: 'Vikram Singh', action: 'Downloaded research document', time: '2 hours ago', type: 'download' },
  ];

  const topCourses = [
    { id: 1, name: 'Contract Law Fundamentals', enrolled: 1234, completion: 78, revenue: 245600 },
    { id: 2, name: 'Criminal Procedure Code', enrolled: 989, completion: 82, revenue: 198900 },
    { id: 3, name: 'Constitutional Law', enrolled: 876, completion: 75, revenue: 175200 },
    { id: 4, name: 'Legal Research Methods', enrolled: 743, completion: 88, revenue: 148600 },
    { id: 5, name: 'Cyber Law Essentials', enrolled: 654, completion: 71, revenue: 130800 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 245000 },
    { month: 'Feb', revenue: 298000 },
    { month: 'Mar', revenue: 335000 },
    { month: 'Apr', revenue: 412000 },
    { month: 'May', revenue: 489000 },
    { month: 'Jun', revenue: 567000 },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'subscription': return '🎉';
      case 'course': return '📚';
      case 'payment': return '💰';
      case 'registration': return '✨';
      case 'download': return '📥';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === range
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {range === '24h' ? 'Today' : range === '7d' ? 'Week' : range === '30d' ? 'Month' : 'Quarter'}
            </button>
          ))}
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span className="text-xs font-semibold">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Revenue Overview</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Monthly revenue trends</p>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
          <div className="space-y-4">
            {revenueData.map((data, index) => {
              const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
              const percentage = (data.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {data.month}
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      ₹{(data.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-700"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Top Courses</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">By enrollment</p>
            </div>
          </div>
          <div className="space-y-4">
            {topCourses.slice(0, 5).map((course, index) => (
              <div key={course.id} className="flex items-center space-x-3 group cursor-pointer">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                  index === 0 ? 'from-yellow-400 to-orange-500' :
                  index === 1 ? 'from-gray-300 to-gray-400' :
                  index === 2 ? 'from-orange-400 to-red-500' :
                  'from-blue-400 to-indigo-500'
                } flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {course.enrolled} enrolled
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Activities</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Latest user actions on the platform</p>
          </div>
          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
            >
              <div className="text-2xl mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {activity.user}
                  </span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {activity.action}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {activity.time}
                </p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg">
                <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
