import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CreditCard,
  FileText,
  Settings,
  FileBarChart,
  Bell,
  Shield,
  Database,
  BookOpen,
  MessageSquare,
  Calendar,
  Zap,
  Package,
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Overview',
      items: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
      ]
    },
    {
      title: 'Management',
      items: [
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { path: '/admin/content', icon: FileText, label: 'Content' },
        { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
      ]
    },
    {
      title: 'Communication',
      items: [
        { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
      ]
    },
    {
      title: 'System',
      items: [
        { path: '/admin/reports', icon: FileBarChart, label: 'Reports' },
        { path: '/admin/database', icon: Database, label: 'Database' },
        { path: '/admin/integrations', icon: Package, label: 'Integrations' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    },
    {
      title: 'Security',
      items: [
        { path: '/admin/security', icon: Shield, label: 'Security' },
        { path: '/admin/activity', icon: Zap, label: 'Activity Log' },
      ]
    }
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 ease-in-out flex flex-col h-screen relative`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Chakshi</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mx-auto">
            <Shield className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1.5 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        )}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {menuItems.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            {!collapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            {collapsed && <div className="mb-2 border-t border-slate-700 mx-4"></div>}
            <div className="space-y-1 px-2">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5'} flex-shrink-0`} />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {!collapsed && isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        {!collapsed ? (
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-semibold text-white">System Status</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">All systems operational</span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
