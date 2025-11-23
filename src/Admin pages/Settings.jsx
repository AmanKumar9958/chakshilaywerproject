import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Zap,
  Palette,
  Lock,
  Key,
  Server,
  Cloud,
  Code,
  Save,
  RefreshCw
} from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'Chakshi Pro',
    siteEmail: 'admin@chakshi.com',
    siteUrl: 'https://chakshi.com',
    maintenanceMode: false,
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: true,
    apiAccess: true,
    darkMode: true,
    allowRegistration: true
  });

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Site Name
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Site Email
        </label>
        <input
          type="email"
          value={settings.siteEmail}
          onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Site URL
        </label>
        <input
          type="url"
          value={settings.siteUrl}
          onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <div>
          <p className="font-medium text-slate-800 dark:text-white">Maintenance Mode</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Temporarily disable public access</p>
        </div>
        <button
          onClick={() => handleToggle('maintenanceMode')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            settings.maintenanceMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
            settings.maintenanceMode ? 'transform translate-x-7' : ''
          }`}></div>
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <div>
          <p className="font-medium text-slate-800 dark:text-white">Allow New Registrations</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Enable user registration</p>
        </div>
        <button
          onClick={() => handleToggle('allowRegistration')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            settings.allowRegistration ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
            settings.allowRegistration ? 'transform translate-x-7' : ''
          }`}></div>
        </button>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-2">SMTP Configuration</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Configure email server settings</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          SMTP Host
        </label>
        <input
          type="text"
          placeholder="smtp.gmail.com"
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            SMTP Port
          </label>
          <input
            type="text"
            placeholder="587"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Encryption
          </label>
          <select className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200">
            <option>TLS</option>
            <option>SSL</option>
            <option>None</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          SMTP Username
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          SMTP Password
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
        />
      </div>

      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Mail className="w-4 h-4" />
        <span>Send Test Email</span>
      </button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <div>
          <p className="font-medium text-slate-800 dark:text-white">Two-Factor Authentication</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Require 2FA for admin accounts</p>
        </div>
        <button
          onClick={() => handleToggle('twoFactorAuth')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            settings.twoFactorAuth ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
            settings.twoFactorAuth ? 'transform translate-x-7' : ''
          }`}></div>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          defaultValue="30"
          className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Password Policy
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Minimum 8 characters</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Require uppercase letters</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Require numbers</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Require special characters</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              Settings for {activeSection} coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          System Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Configure platform settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sticky top-6">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            {renderContent()}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
