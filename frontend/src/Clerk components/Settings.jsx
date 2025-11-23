import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, theme, language, setTheme, setLanguage } = context || {};

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      language: language || 'en',
      theme: theme || 'light',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      hearingReminders: true,
      caseUpdates: true,
      reminderTime: 24,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 480,
      loginNotifications: true,
    },
    privacy: {
      dataRetention: 365,
      shareAnalytics: true,
      profileVisibility: 'private',
    },
    system: {
      autoSave: true,
      autoBackup: true,
      cacheSize: 100,
      performanceMode: false,
    }
  });

  // Save settings with enhanced feedback
  const saveSettings = async (category) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (category === 'general') {
        if (setTheme && settings.general.theme !== theme) {
          setTheme(settings.general.theme);
        }
        if (setLanguage && settings.general.language !== language) {
          setLanguage(settings.general.language);
        }
      }
      
      addNotification?.({
        type: 'success',
        message: language === 'ta' ? 'सेटिंग्स सफलतापूर्वक सहेजी गईं' : 'Settings saved successfully'
      });
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: language === 'ta' ? 'सेटिंग्स सहेजने में विफल' : 'Failed to save settings'
      });
    } finally {
      setSaving(false);
    }
  };

  // Update setting with animation trigger
  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Enhanced export functionality
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `court-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addNotification?.({
      type: 'success',
      message: language === 'ta' ? 'सेटिंग्स निर्यात की गईं' : 'Settings exported successfully'
    });
  };

  // Enhanced import functionality
  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        setSettings(importedSettings);
        addNotification?.({
          type: 'success',
          message: language === 'ta' ? 'सेटिंग्स आयात की गईं' : 'Settings imported successfully'
        });
      } catch (error) {
        addNotification?.({
          type: 'error',
          message: language === 'ta' ? 'अमान्य सेटिंग्स फ़ाइल' : 'Invalid settings file'
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Reset settings with confirmation
  const resetSettings = (category) => {
    if (window.confirm(language === 'ta' 
      ? 'क्या आप वाकई इन सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?'
      : 'Are you sure you want to reset these settings to default?')) {
      addNotification?.({
        type: 'info',
        message: language === 'ta' 
          ? `${category} सेटिंग्स डिफ़ॉल्ट पर रीसेट की गईं`
          : `${category} settings reset to default`
      });
    }
  };

  // Tab configuration for cleaner code
  const tabs = [
    { key: 'general', label: language === 'ta' ? 'सामान्य' : 'General', icon: '⚙️' },
    { key: 'notifications', label: language === 'ta' ? 'सूचनाएं' : 'Notifications', icon: '🔔' },
    { key: 'security', label: language === 'ta' ? 'सुरक्षा' : 'Security', icon: '🔐' },
    { key: 'privacy', label: language === 'ta' ? 'गोपनीयता' : 'Privacy', icon: '🛡️' },
    { key: 'system', label: language === 'ta' ? 'सिस्टम' : 'System', icon: '💻' }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5ef] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#b69d7440] p-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent mb-3">
                {language === 'ta' ? 'सेटिंग्स' : 'Settings'}
              </h1>
              <p className="text-[#6b7280] text-lg">
                {language === 'ta' 
                  ? 'अपनी प्राथमिकताओं और खाता सेटिंग्स को प्रबंधित करें' 
                  : 'Manage your preferences and account settings'}
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              <label htmlFor="import-settings" className="px-6 py-3 text-sm font-semibold text-[#1f2839] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-[#b69d7408] hover:border-[#b69d7460] transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95 flex items-center shadow-sm">
                <svg className="h-5 w-5 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l3 3m0 0l3-3m-3 3V9" />
                </svg>
                {language === 'ta' ? 'आयात करें' : 'Import'}
                <input
                  id="import-settings"
                  type="file"
                  accept=".json"
                  className="sr-only"
                  onChange={importSettings}
                />
              </label>

              <button
                onClick={exportSettings}
                className="px-6 py-3 text-sm font-semibold text-[#1f2839] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-[#b69d7408] hover:border-[#b69d7460] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center shadow-sm"
              >
                <svg className="h-5 w-5 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {language === 'ta' ? 'निर्यात करें' : 'Export'}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Settings Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#b69d7440] overflow-hidden transform transition-all duration-300">
          {/* Enhanced Tab Navigation */}
          <div className="border-b border-[#b69d7420] bg-gradient-to-r from-white to-[#b69d7405]">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-5 px-6 text-sm font-semibold border-b-2 flex items-center justify-center space-x-3 transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'border-[#b69d74] text-[#b69d74] bg-[#b69d7408]'
                      : 'border-transparent text-[#6b7280] hover:text-[#1f2839] hover:bg-white/50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      key: 'language',
                      label: language === 'ta' ? 'भाषा' : 'Language',
                      type: 'select',
                      options: [
                        { value: 'en', label: 'English' },
                        { value: 'ta', label: 'हिंदी / Tamil' }
                      ]
                    },
                    {
                      key: 'theme',
                      label: language === 'ta' ? 'थीम' : 'Theme',
                      type: 'select',
                      options: [
                        { value: 'light', label: language === 'ta' ? 'हल्का' : 'Light' },
                        { value: 'dark', label: language === 'ta' ? 'डार्क' : 'Dark' },
                        { value: 'system', label: language === 'ta' ? 'सिस्टम' : 'System' }
                      ]
                    },
                    {
                      key: 'timezone',
                      label: language === 'ta' ? 'समय क्षेत्र' : 'Timezone',
                      type: 'select',
                      options: [
                        { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                        { value: 'UTC', label: 'UTC' },
                        { value: 'America/New_York', label: 'America/New_York (EST)' }
                      ]
                    },
                    {
                      key: 'dateFormat',
                      label: language === 'ta' ? 'दिनांक प्रारूप' : 'Date Format',
                      type: 'select',
                      options: [
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                      ]
                    }
                  ].map((field) => (
                    <div key={field.key} className="group">
                      <label className="block text-sm font-semibold text-[#1f2839] mb-3 transition-colors duration-300">
                        {field.label}
                      </label>
                      <select
                        value={settings.general[field.key]}
                        onChange={(e) => updateSetting('general', field.key, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#b69d7420] rounded-xl bg-white/80 text-[#1f2839] font-medium transition-all duration-300 focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7440] focus:outline-none hover:border-[#b69d7440] group-hover:shadow-md"
                      >
                        {field.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-[#b69d7420]">
                  <button
                    onClick={() => resetSettings('general')}
                    className="px-8 py-3 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7420] rounded-xl hover:bg-[#b69d7408] hover:text-[#1f2839] hover:border-[#b69d7440] transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {language === 'ta' ? 'रीसेट करें' : 'Reset'}
                  </button>
                  <button
                    onClick={() => saveSettings('general')}
                    disabled={saving}
                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] border-2 border-transparent rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74BB] disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {language === 'ta' ? 'सहेज रहा है...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ta' ? 'सेव करें' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: language === 'ta' ? 'ईमेल सूचनाएं' : 'Email Notifications' },
                    { key: 'pushNotifications', label: language === 'ta' ? 'पुश सूचनाएं' : 'Push Notifications' },
                    { key: 'hearingReminders', label: language === 'ta' ? 'सुनवाई अनुस्मारक' : 'Hearing Reminders' },
                    { key: 'caseUpdates', label: language === 'ta' ? 'केस अपडेट' : 'Case Updates' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-[#b69d7405] rounded-xl border border-[#b69d7420] transition-all duration-300 hover:shadow-md hover:border-[#b69d7440]">
                      <div>
                        <span className="text-sm font-semibold text-[#1f2839] block">
                          {setting.label}
                        </span>
                        <span className="text-xs text-[#6b7280] mt-1">
                          {language === 'ta' ? 'इस सुविधा के लिए सूचनाएं प्राप्त करें' : 'Receive notifications for this feature'}
                        </span>
                      </div>
                      <button
                        onClick={() => updateSetting('notifications', setting.key, !settings.notifications[setting.key])}
                        className={`relative inline-flex items-center h-7 rounded-full w-14 transition-all duration-300 transform hover:scale-110 ${
                          settings.notifications[setting.key] 
                            ? 'bg-gradient-to-r from-[#10b981] to-[#10b981DD]' 
                            : 'bg-[#6b7280]'
                        }`}
                      >
                        <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-300 shadow-lg ${
                          settings.notifications[setting.key] ? 'translate-x-8' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#b69d7420]">
                  <div className="group">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-3">
                      {language === 'ta' ? 'अनुस्मारक समय (घंटे पहले)' : 'Reminder Time (hours before)'}
                    </label>
                    <select
                      value={settings.notifications.reminderTime}
                      onChange={(e) => updateSetting('notifications', 'reminderTime', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-[#b69d7420] rounded-xl bg-white/80 text-[#1f2839] font-medium transition-all duration-300 focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7440] focus:outline-none hover:border-[#b69d7440] group-hover:shadow-md"
                    >
                      <option value={1}>1 hour</option>
                      <option value={6}>6 hours</option>
                      <option value={24}>24 hours</option>
                      <option value={48}>48 hours</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-[#b69d7420]">
                  <button
                    onClick={() => resetSettings('notifications')}
                    className="px-8 py-3 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7420] rounded-xl hover:bg-[#b69d7408] hover:text-[#1f2839] hover:border-[#b69d7440] transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {language === 'ta' ? 'रीसेट करें' : 'Reset'}
                  </button>
                  <button
                    onClick={() => saveSettings('notifications')}
                    disabled={saving}
                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] border-2 border-transparent rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74BB] disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {language === 'ta' ? 'सहेज रहा है...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ta' ? 'सेव करें' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                  {[
                    { key: 'twoFactorAuth', label: language === 'ta' ? 'द्विकारक प्रमाणीकरण' : 'Two-Factor Authentication' },
                    { key: 'loginNotifications', label: language === 'ta' ? 'लॉगिन सूचनाएं' : 'Login Notifications' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-[#b69d7405] rounded-xl border border-[#b69d7420] transition-all duration-300 hover:shadow-md hover:border-[#b69d7440]">
                      <div>
                        <span className="text-sm font-semibold text-[#1f2839] block">
                          {setting.label}
                        </span>
                        <span className="text-xs text-[#6b7280] mt-1">
                          {language === 'ta' ? 'अपने खाते की सुरक्षा बढ़ाएँ' : 'Enhance your account security'}
                        </span>
                      </div>
                      <button
                        onClick={() => updateSetting('security', setting.key, !settings.security[setting.key])}
                        className={`relative inline-flex items-center h-7 rounded-full w-14 transition-all duration-300 transform hover:scale-110 ${
                          settings.security[setting.key] 
                            ? 'bg-gradient-to-r from-[#10b981] to-[#10b981DD]' 
                            : 'bg-[#6b7280]'
                        }`}
                      >
                        <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-300 shadow-lg ${
                          settings.security[setting.key] ? 'translate-x-8' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#b69d7420]">
                  <div className="group">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-3">
                      {language === 'ta' ? 'सत्र टाइमआउट (मिनट)' : 'Session Timeout (minutes)'}
                    </label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-[#b69d7420] rounded-xl bg-white/80 text-[#1f2839] font-medium transition-all duration-300 focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7440] focus:outline-none hover:border-[#b69d7440] group-hover:shadow-md"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={480}>8 hours</option>
                      <option value={1440}>24 hours</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-[#b69d7420]">
                  <button
                    onClick={() => resetSettings('security')}
                    className="px-8 py-3 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7420] rounded-xl hover:bg-[#b69d7408] hover:text-[#1f2839] hover:border-[#b69d7440] transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {language === 'ta' ? 'रीसेट करें' : 'Reset'}
                  </button>
                  <button
                    onClick={() => saveSettings('security')}
                    disabled={saving}
                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] border-2 border-transparent rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74BB] disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-105 flex items-center shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {language === 'ta' ? 'सहेज रहा है...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ta' ? 'सेव करें' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                  {[
                    { key: 'shareAnalytics', label: language === 'ta' ? 'एनालिटिक्स साझा करें' : 'Share Analytics' },
                    { key: 'profileVisibility', label: language === 'ta' ? 'प्रोफाइल दृश्यता' : 'Profile Visibility', type: 'select' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-[#b69d7405] rounded-xl border border-[#b69d7420] transition-all duration-300 hover:shadow-md hover:border-[#b69d7440]">
                      <div>
                        <span className="text-sm font-semibold text-[#1f2839] block">
                          {setting.label}
                        </span>
                        <span className="text-xs text-[#6b7280] mt-1">
                          {language === 'ta' ? 'डेटा गोपनीयता सेटिंग्स' : 'Data privacy settings'}
                        </span>
                      </div>
                      {setting.type === 'select' ? (
                        <select
                          value={settings.privacy[setting.key]}
                          onChange={(e) => updateSetting('privacy', setting.key, e.target.value)}
                          className="px-4 py-2 border border-[#b69d7420] rounded-lg bg-white text-[#1f2839] text-sm focus:border-[#b69d74] focus:outline-none"
                        >
                          <option value="public">{language === 'ta' ? 'सार्वजनिक' : 'Public'}</option>
                          <option value="private">{language === 'ta' ? 'निजी' : 'Private'}</option>
                          <option value="contacts">{language === 'ta' ? 'केवल संपर्क' : 'Contacts Only'}</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => updateSetting('privacy', setting.key, !settings.privacy[setting.key])}
                          className={`relative inline-flex items-center h-7 rounded-full w-14 transition-all duration-300 transform hover:scale-110 ${
                            settings.privacy[setting.key] 
                              ? 'bg-gradient-to-r from-[#10b981] to-[#10b981DD]' 
                              : 'bg-[#6b7280]'
                          }`}
                        >
                          <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-300 shadow-lg ${
                            settings.privacy[setting.key] ? 'translate-x-8' : 'translate-x-1'
                          }`} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-[#b69d7420]">
                  <button
                    onClick={() => resetSettings('privacy')}
                    className="px-8 py-3 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7420] rounded-xl hover:bg-[#b69d7408] hover:text-[#1f2839] hover:border-[#b69d7440] transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {language === 'ta' ? 'रीसेट करें' : 'Reset'}
                  </button>
                  <button
                    onClick={() => saveSettings('privacy')}
                    disabled={saving}
                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] border-2 border-transparent rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74BB] disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {language === 'ta' ? 'सहेज रहा है...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ta' ? 'सेव करें' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                  {[
                    { key: 'autoSave', label: language === 'ta' ? 'स्वचालित सेव' : 'Auto Save' },
                    { key: 'autoBackup', label: language === 'ta' ? 'स्वचालित बैकअप' : 'Auto Backup' },
                    { key: 'performanceMode', label: language === 'ta' ? 'प्रदर्शन मोड' : 'Performance Mode' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-[#b69d7405] rounded-xl border border-[#b69d7420] transition-all duration-300 hover:shadow-md hover:border-[#b69d7440]">
                      <div>
                        <span className="text-sm font-semibold text-[#1f2839] block">
                          {setting.label}
                        </span>
                        <span className="text-xs text-[#6b7280] mt-1">
                          {language === 'ta' ? 'सिस्टम प्रदर्शन सेटिंग्स' : 'System performance settings'}
                        </span>
                      </div>
                      <button
                        onClick={() => updateSetting('system', setting.key, !settings.system[setting.key])}
                        className={`relative inline-flex items-center h-7 rounded-full w-14 transition-all duration-300 transform hover:scale-110 ${
                          settings.system[setting.key] 
                            ? 'bg-gradient-to-r from-[#10b981] to-[#10b981DD]' 
                            : 'bg-[#6b7280]'
                        }`}
                      >
                        <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-all duration-300 shadow-lg ${
                          settings.system[setting.key] ? 'translate-x-8' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#b69d7420]">
                  <div className="group">
                    <label className="block text-sm font-semibold text-[#1f2839] mb-3">
                      {language === 'ta' ? 'कैश का आकार (MB)' : 'Cache Size (MB)'}
                    </label>
                    <select
                      value={settings.system.cacheSize}
                      onChange={(e) => updateSetting('system', 'cacheSize', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-[#b69d7420] rounded-xl bg-white/80 text-[#1f2839] font-medium transition-all duration-300 focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7440] focus:outline-none hover:border-[#b69d7440] group-hover:shadow-md"
                    >
                      <option value={50}>50 MB</option>
                      <option value={100}>100 MB</option>
                      <option value={200}>200 MB</option>
                      <option value={500}>500 MB</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-[#b69d7420]">
                  <button
                    onClick={() => resetSettings('system')}
                    className="px-8 py-3 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7420] rounded-xl hover:bg-[#b69d7408] hover:text-[#1f2839] hover:border-[#b69d7440] transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {language === 'ta' ? 'रीसेट करें' : 'Reset'}
                  </button>
                  <button
                    onClick={() => saveSettings('system')}
                    disabled={saving}
                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] border-2 border-transparent rounded-xl hover:from-[#b69d74DD] hover:to-[#b69d74BB] disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {language === 'ta' ? 'सहेज रहा है...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {language === 'ta' ? 'सेव करें' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Settings;