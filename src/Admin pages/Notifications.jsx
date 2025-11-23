import React from 'react';
import { Bell, Mail, MessageSquare, Send, Users, CheckCircle } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Notifications Center
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Send and manage platform notifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Notification */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Send Notification</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Notification Type
              </label>
              <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200">
                <option>All Users</option>
                <option>Students</option>
                <option>Advocates</option>
                <option>Clerks</option>
                <option>Premium Users</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter notification title"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Enter notification message"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Push Notification</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-slate-700 dark:text-slate-300">SMS</span>
              </label>
            </div>

            <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
              <Send className="w-5 h-5" />
              <span className="font-medium">Send Notification</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">1,234</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sent Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">89%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Delivery Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">8,234</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Recent Notifications</h2>
        <div className="space-y-4">
          {[
            { title: 'New Course Release', message: 'Contract Law Fundamentals is now live', time: '2 hours ago', recipients: 1234 },
            { title: 'System Maintenance', message: 'Scheduled maintenance on Sunday', time: '5 hours ago', recipients: 8234 },
            { title: 'Premium Offer', message: 'Get 20% off on annual subscription', time: '1 day ago', recipients: 2145 }
          ].map((notif, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-white mb-1">{notif.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{notif.message}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Sent to {notif.recipients.toLocaleString()} users • {notif.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
