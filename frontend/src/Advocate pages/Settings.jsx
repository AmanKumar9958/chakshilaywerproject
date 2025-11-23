import React, { useState, useEffect } from 'react';
import './Settings.css';
import { 
  User, 
  Briefcase, 
  Palette, 
  Bell, 
  CreditCard,
  Save,
  Shield,
  Mail,
  Phone,
  FileText,
  Settings as SettingsIcon,
  Check,
  AlertCircle,
  Crown
} from 'lucide-react';

export default function Settings() {
  // State for profile information
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    specialization: 'Intellectual Property Law',
    barRegistration: 'CA-2020-18935',
    email: 's.johnson@lawfirm.com',
    phone: '(555) 123-4567',
    bio: 'Experienced IP attorney with focus on technology patents and copyright law.'
  });
  
  // State for notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    caseUpdates: true,
    courtDeadlines: true,
    newMessages: true,
    marketingEmails: false
  });
  
  // State for theme preferences
  const [theme, setTheme] = useState({
    mode: 'light',
    fontSize: 'medium',
    highContrast: false
  });
  
  // State for workspace settings
  const [workspace, setWorkspace] = useState({
    defaultView: 'dashboard',
    matterSorting: 'recent',
    documentAutoSave: true,
    backupFrequency: 'daily'
  });

  // State for active settings category
  const [activeCategory, setActiveCategory] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Enhanced categories with icons and descriptions
  const settingsCategories = [
    { 
      id: 'profile', 
      name: 'Profile Information', 
      icon: User, 
      description: 'Manage your professional profile'
    },
    { 
      id: 'workspace', 
      name: 'Workspace Setup', 
      icon: Briefcase, 
      description: 'Customize your work environment'
    },
    { 
      id: 'theme', 
      name: 'Theme & Appearance', 
      icon: Palette, 
      description: 'Personalize your interface'
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell, 
      description: 'Control your alert preferences'
    },
    { 
      id: 'billing', 
      name: 'Billing & Subscription', 
      icon: CreditCard, 
      description: 'Manage your account and payments'
    },
    { 
      id: 'security', 
      name: 'Security & Privacy', 
      icon: Shield, 
      description: 'Protect your account and data'
    },
    { 
      id: 'advanced', 
      name: 'Advanced Settings', 
      icon: SettingsIcon, 
      description: 'Import, export, and reset settings'
    }
  ];

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        const savedProfile = localStorage.getItem('profileSettings');
        const savedNotifications = localStorage.getItem('notificationSettings');
        const savedTheme = localStorage.getItem('themeSettings');
        const savedWorkspace = localStorage.getItem('workspaceSettings');
        
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setProfile(profileData);
        }
        
        if (savedNotifications) {
          const notificationData = JSON.parse(savedNotifications);
          setNotifications(notificationData);
        }
        
        if (savedTheme) {
          const themeData = JSON.parse(savedTheme);
          setTheme(themeData);
          applyThemeSettings(themeData);
        }
        
        if (savedWorkspace) {
          const workspaceData = JSON.parse(savedWorkspace);
          setWorkspace(workspaceData);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();

    // Listen for system theme changes when auto mode is selected
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme.mode === 'auto') {
        applyThemeSettings(theme);
      }
    };

    // Handle keyboard navigation
    const handleKeyNavigation = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            // Save current active category settings
            if (activeCategory === 'profile') {
              if (validateProfileForm()) saveProfileSettings();
            } else if (activeCategory === 'workspace') {
              saveWorkspaceSettings();
            } else if (activeCategory === 'theme') {
              applyThemeSettingsAndSave();
            } else if (activeCategory === 'notifications') {
              saveNotificationSettings();
            }
            break;
          default:
            break;
        }
      }
      
      // Navigate between categories with arrow keys when sidebar is focused
      if (e.target.closest('.settings-sidebar')) {
        const categories = settingsCategories.map(cat => cat.id);
        const currentIndex = categories.indexOf(activeCategory);
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % categories.length;
          setActiveCategory(categories[nextIndex]);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
          setActiveCategory(categories[prevIndex]);
        }
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    document.addEventListener('keydown', handleKeyNavigation);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      document.removeEventListener('keydown', handleKeyNavigation);
    };
  }, []);

  // Apply theme settings to the document
  const applyThemeSettings = (themeData) => {
    try {
      // Remove existing theme classes
      document.body.classList.remove('light', 'dark', 'auto', 'high-contrast');
      document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-x-large');
      
      // Apply theme mode
      if (themeData.mode === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.add(prefersDark ? 'dark' : 'light');
      } else {
        document.body.classList.add(themeData.mode);
      }
      
      // Apply high contrast if enabled
      if (themeData.highContrast) {
        document.body.classList.add('high-contrast');
      }
      
      // Apply font size
      document.body.classList.add(`font-${themeData.fontSize}`);
      
      // Add CSS custom properties for better theme control
      document.documentElement.style.setProperty('--font-size-scale', getFontSizeScale(themeData.fontSize));
      
    } catch (error) {
      console.error('Error applying theme settings:', error);
    }
  };

  // Helper function to get font size scale
  const getFontSizeScale = (fontSize) => {
    const scales = {
      'small': '0.875',
      'medium': '1',
      'large': '1.125',
      'x-large': '1.25'
    };
    return scales[fontSize] || '1';
  };

  // Handle profile changes with validation
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      clearError(name);
    }
  };

  // Handle notification changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  // Handle theme changes
  const handleThemeChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newTheme = { 
      ...theme, 
      [name]: type === 'checkbox' ? checked : value 
    };
    
    setTheme(newTheme);
  };

  // Handle workspace changes
  const handleWorkspaceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWorkspace(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Save profile settings
  const saveProfileSettings = async () => {
    try {
      setIsLoading(true);
      localStorage.setItem('profileSettings', JSON.stringify(profile));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving profile settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Save notification settings
  const saveNotificationSettings = async () => {
    try {
      setIsLoading(true);
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply and save theme settings
  const applyThemeSettingsAndSave = async () => {
    try {
      setIsLoading(true);
      applyThemeSettings(theme);
      localStorage.setItem('themeSettings', JSON.stringify(theme));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving theme settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Save workspace settings
  const saveWorkspaceSettings = async () => {
    try {
      setIsLoading(true);
      localStorage.setItem('workspaceSettings', JSON.stringify(workspace));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving workspace settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone format
  const validatePhone = (phone) => {
    const re = /^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{10,}$/;
    return re.test(phone);
  };

  // Validate bar registration format
  const validateBarRegistration = (registration) => {
    const re = /^[A-Z]{2}-\d{4}-\d{4,6}$/;
    return re.test(registration);
  };

  // Clear errors for a specific field
  const clearError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Set error for a specific field
  const setError = (fieldName, message) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: message
    }));
  };

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (profile.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!profile.barRegistration.trim()) {
      newErrors.barRegistration = 'Bar registration number is required';
    } else if (!validateBarRegistration(profile.barRegistration)) {
      newErrors.barRegistration = 'Invalid format. Use format: CA-2020-18935';
    }
    
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profile.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (profile.phone && !validatePhone(profile.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (profile.bio && profile.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset all settings to defaults
  const resetAllSettings = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        
        // Clear localStorage
        localStorage.removeItem('profileSettings');
        localStorage.removeItem('notificationSettings');
        localStorage.removeItem('themeSettings');
        localStorage.removeItem('workspaceSettings');
        
        // Reset to default values
        setProfile({
          name: '',
          specialization: 'Intellectual Property Law',
          barRegistration: '',
          email: '',
          phone: '',
          bio: ''
        });
        
        setNotifications({
          emailNotifications: true,
          caseUpdates: true,
          courtDeadlines: true,
          newMessages: true,
          marketingEmails: false
        });
        
        const defaultTheme = {
          mode: 'light',
          fontSize: 'medium',
          highContrast: false
        };
        
        setTheme(defaultTheme);
        applyThemeSettings(defaultTheme);
        
        setWorkspace({
          defaultView: 'dashboard',
          matterSorting: 'recent',
          documentAutoSave: true,
          backupFrequency: 'daily'
        });
        
        setErrors({});
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(''), 3000);
        
      } catch (error) {
        console.error('Error resetting settings:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 3000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Export settings as JSON
  const exportSettings = () => {
    try {
      const settings = {
        profile,
        notifications,
        theme,
        workspace,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `chakshi-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error exporting settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Import settings from JSON file
  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setIsLoading(true);
        const importedSettings = JSON.parse(e.target.result);
        
        if (importedSettings.profile) {
          setProfile(importedSettings.profile);
          localStorage.setItem('profileSettings', JSON.stringify(importedSettings.profile));
        }
        
        if (importedSettings.notifications) {
          setNotifications(importedSettings.notifications);
          localStorage.setItem('notificationSettings', JSON.stringify(importedSettings.notifications));
        }
        
        if (importedSettings.theme) {
          setTheme(importedSettings.theme);
          applyThemeSettings(importedSettings.theme);
          localStorage.setItem('themeSettings', JSON.stringify(importedSettings.theme));
        }
        
        if (importedSettings.workspace) {
          setWorkspace(importedSettings.workspace);
          localStorage.setItem('workspaceSettings', JSON.stringify(importedSettings.workspace));
        }
        
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(''), 3000);
        
      } catch (error) {
        console.error('Error importing settings:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (validateProfileForm()) {
      await saveProfileSettings();
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="border rounded-lg p-6 backdrop-blur-md" 
           style={{ 
             backgroundColor: 'rgba(255, 255, 255, 0.6)', 
             borderColor: 'rgba(182, 157, 116, 0.2)',
             boxShadow: '0 0 25px rgba(182, 157, 116, 0.15)'
           }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-lg flex items-center justify-center font-bold text-2xl border backdrop-blur-sm" 
               style={{ 
                 backgroundColor: 'rgba(182, 157, 116, 0.1)', 
                 color: '#1f2839',
                 borderColor: 'rgba(182, 157, 116, 0.3)',
                 boxShadow: '0 0 15px rgba(182, 157, 116, 0.2)'
               }}>
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#1f2839' }}>Professional Profile</h3>
            <p className="mb-4" style={{ color: '#6b7280' }}>Manage your professional information and credentials</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center backdrop-blur-sm border" 
                    style={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                      color: '#10b981',
                      borderColor: 'rgba(16, 185, 129, 0.3)'
                    }}>
                <Check className="w-3 h-3 mr-1" />
                Verified Attorney
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center backdrop-blur-sm border" 
                    style={{ 
                      backgroundColor: 'rgba(182, 157, 116, 0.1)', 
                      color: '#b69d74',
                      borderColor: 'rgba(182, 157, 116, 0.3)'
                    }}>
                <Crown className="w-3 h-3 mr-1" />
                Pro Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="border rounded-lg p-6 backdrop-blur-md" 
           style={{ 
             backgroundColor: 'rgba(255, 255, 255, 0.6)', 
             borderColor: 'rgba(182, 157, 116, 0.2)',
             boxShadow: '0 0 25px rgba(182, 157, 116, 0.15)'
           }}>
        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: '#1f2839' }}>
                  <User className="w-4 h-4 mr-2" style={{ color: '#b69d74' }} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm transition-all duration-200 ${
                    errors.name ? '' : ''
                  }`}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: errors.name ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)',
                    color: '#1f2839'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#b69d74';
                    e.target.style.boxShadow = '0 0 0 2px rgba(182, 157, 116, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm flex items-center" style={{ color: '#f59e0b' }}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: '#1f2839' }}>
                  <Briefcase className="w-4 h-4 mr-2" style={{ color: '#b69d74' }} />
                  Legal Specialization
                </label>
                <select
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(182, 157, 116, 0.3)',
                    color: '#1f2839'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#b69d74';
                    e.target.style.boxShadow = '0 0 0 2px rgba(182, 157, 116, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option>Intellectual Property Law</option>
                  <option>Criminal Law</option>
                  <option>Corporate Law</option>
                  <option>Family Law</option>
                  <option>Real Estate Law</option>
                  <option>Employment Law</option>
                  <option>Tax Law</option>
                  <option>Immigration Law</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: '#1f2839' }}>
                  <Shield className="w-4 h-4 mr-2" style={{ color: '#b69d74' }} />
                  Bar Registration Number
                </label>
                <input
                  type="text"
                  name="barRegistration"
                  value={profile.barRegistration}
                  onChange={handleProfileChange}
                  placeholder="e.g., CA-2020-18935"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: errors.barRegistration ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)',
                    color: '#1f2839'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#b69d74';
                    e.target.style.boxShadow = '0 0 0 2px rgba(182, 157, 116, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.barRegistration ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                {errors.barRegistration && (
                  <p className="mt-1 text-sm flex items-center" style={{ color: '#f59e0b' }}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.barRegistration}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: '#1f2839' }}>
                  <Mail className="w-4 h-4 mr-2" style={{ color: '#b69d74' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: errors.email ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)',
                    color: '#1f2839'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#b69d74';
                    e.target.style.boxShadow = '0 0 0 2px rgba(182, 157, 116, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm flex items-center" style={{ color: '#f59e0b' }}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: '#1f2839' }}>
                  <Phone className="w-4 h-4 mr-2" style={{ color: '#b69d74' }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: errors.phone ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)',
                    color: '#1f2839'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#b69d74';
                    e.target.style.boxShadow = '0 0 0 2px rgba(182, 157, 116, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.phone ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm flex items-center" style={{ color: '#f59e0b' }}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: '#1f2839' }}>
                  <FileText className="w-4 h-4 mr-2" style={{ color: '#b69d74' }} />
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  maxLength="500"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none backdrop-blur-sm transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: errors.bio ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)',
                    color: '#1f2839'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#b69d74';
                    e.target.style.boxShadow = '0 0 0 2px rgba(182, 157, 116, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.bio ? '#f59e0b' : 'rgba(182, 157, 116, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Tell us about your legal expertise and experience..."
                ></textarea>
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {errors.bio && (
                      <p className="text-sm flex items-center" style={{ color: '#f59e0b' }}>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.bio}
                      </p>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    {profile.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              {saveStatus === 'success' && (
                <div className="flex items-center" style={{ color: '#10b981' }}>
                  <Check className="w-4 h-4 mr-2" />
                  <span className="text-sm">Profile saved successfully!</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center" style={{ color: '#f59e0b' }}>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Error saving profile. Please try again.</span>
                </div>
              )}
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 text-white backdrop-blur-md border ${
                isLoading 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:shadow-lg'
              }`}
              style={{
                background: isLoading 
                  ? 'linear-gradient(135deg, #6b7280, #6b7280)' 
                  : 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
                borderColor: 'rgba(182, 157, 116, 0.3)',
                boxShadow: isLoading ? 'none' : '0 0 15px rgba(182, 157, 116, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 0 25px rgba(182, 157, 116, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 0 15px rgba(182, 157, 116, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderWorkspaceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Briefcase className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Workspace Configuration</h3>
            <p className="text-gray-600">Customize your work environment and preferences</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Dashboard View</label>
              <select
                name="defaultView"
                value={workspace.defaultView}
                onChange={handleWorkspaceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dashboard">Overview Dashboard</option>
                <option value="cases">Cases List</option>
                <option value="calendar">Calendar View</option>
                <option value="documents">Document Library</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Case Sorting Preference</label>
              <select
                name="matterSorting"
                value={workspace.matterSorting}
                onChange={handleWorkspaceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Most Recent Activity</option>
                <option value="alphabetical">Alphabetical Order</option>
                <option value="priority">Priority Level</option>
                <option value="status">Case Status</option>
                <option value="deadline">Upcoming Deadlines</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select
                name="backupFrequency"
                value={workspace.backupFrequency}
                onChange={handleWorkspaceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="realtime">Real-time Sync</option>
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily Backup</option>
                <option value="weekly">Weekly Backup</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                <input
                  type="checkbox"
                  name="documentAutoSave"
                  checked={workspace.documentAutoSave}
                  onChange={handleWorkspaceChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <div>
                  <span className="font-medium text-gray-800">Enable Document Auto-Save</span>
                  <p className="text-sm text-gray-600">Automatically save changes as you work</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={saveWorkspaceSettings}
            disabled={isLoading}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Workspace Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderThemeSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Palette className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Theme & Appearance</h3>
            <p className="text-gray-600">Personalize your interface appearance</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme Mode</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="light"
                  checked={theme.mode === 'light'}
                  onChange={handleThemeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">Light</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="dark"
                  checked={theme.mode === 'dark'}
                  onChange={handleThemeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">Dark</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="auto"
                  checked={theme.mode === 'auto'}
                  onChange={handleThemeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">System Default</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              name="fontSize"
              value={theme.fontSize}
              onChange={handleThemeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </div>
          
          <div>
            <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
              <input
                type="checkbox"
                name="highContrast"
                checked={theme.highContrast}
                onChange={handleThemeChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-800">High Contrast Mode</span>
                <p className="text-sm text-gray-600">Improve readability with enhanced contrast</p>
              </div>
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={applyThemeSettingsAndSave}
            disabled={isLoading}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Apply Theme</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Notification Preferences</h3>
            <p className="text-gray-600">Control how and when you receive notifications</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={notifications.emailNotifications}
              onChange={handleNotificationChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-800">Enable Email Notifications</span>
              <p className="text-sm text-gray-600">Receive important updates via email</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <input
              type="checkbox"
              name="caseUpdates"
              checked={notifications.caseUpdates}
              onChange={handleNotificationChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-800">Case Updates</span>
              <p className="text-sm text-gray-600">Get notified about case progress</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <input
              type="checkbox"
              name="courtDeadlines"
              checked={notifications.courtDeadlines}
              onChange={handleNotificationChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-800">Court Deadlines</span>
              <p className="text-sm text-gray-600">Stay informed about important deadlines</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <input
              type="checkbox"
              name="newMessages"
              checked={notifications.newMessages}
              onChange={handleNotificationChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-800">New Messages</span>
              <p className="text-sm text-gray-600">Alert me when I receive new messages</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <input
              type="checkbox"
              name="marketingEmails"
              checked={notifications.marketingEmails}
              onChange={handleNotificationChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-800">Marketing Emails</span>
              <p className="text-sm text-gray-600">Receive product updates and offers</p>
            </div>
          </label>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={saveNotificationSettings}
            disabled={isLoading}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Billing & Subscription</h3>
            <p className="text-gray-600">Manage your account and payment preferences</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Current Plan</h4>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-lg font-semibold text-gray-800">Professional Plan</p>
                <p className="text-gray-600">$49.99/month</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Change Plan
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Payment Method</h4>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-6 bg-gray-200 rounded-sm mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">Visa ending in 4242</p>
                  <p className="text-sm text-gray-600">Expires 12/2024</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Billing History</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">Oct 15, 2023</span>
                    <span className="font-semibold text-gray-800">$49.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Subscription</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">Sep 15, 2023</span>
                    <span className="font-semibold text-gray-800">$49.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Subscription</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Shield className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Security & Privacy</h3>
            <p className="text-gray-600">Protect your account and manage privacy settings</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Password</h4>
            <p className="text-gray-600 text-sm mb-3">Last changed 3 months ago</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Change Password
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Two-Factor Authentication</h4>
            <p className="text-gray-600 text-sm mb-3">Add an extra layer of security to your account</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Enable 2FA
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Privacy Settings</h4>
            <p className="text-gray-600 text-sm mb-3">Control how your information is shared</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Manage Privacy
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <SettingsIcon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Advanced Settings</h3>
            <p className="text-gray-600">Manage your settings data and preferences</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Export Settings */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Export Settings</h4>
            <p className="text-gray-600 text-sm mb-4">
              Download your current settings as a JSON file for backup or transfer to another device.
            </p>
            <button
              onClick={exportSettings}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Export Settings
            </button>
          </div>
          
          {/* Import Settings */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Import Settings</h4>
            <p className="text-gray-600 text-sm mb-4">
              Upload a previously exported settings file to restore your preferences.
            </p>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
                id="import-settings"
              />
              <label
                htmlFor="import-settings"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
              >
                Choose File
              </label>
              <span className="text-sm text-gray-500">JSON files only</span>
            </div>
          </div>
          
          {/* Reset Settings */}
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Reset All Settings
            </h4>
            <p className="text-red-700 text-sm mb-4">
              This will permanently delete all your customized settings and restore defaults. This action cannot be undone.
            </p>
            <button
              onClick={resetAllSettings}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to Defaults
            </button>
          </div>
          
          {/* Settings Info */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-2">Settings Information</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Storage:</strong> Settings are stored locally in your browser</p>
              <p><strong>Sync:</strong> Settings are device-specific and don't sync across devices</p>
              <p><strong>Backup:</strong> Use export/import to transfer settings between devices</p>
              <p><strong>Privacy:</strong> No settings data is sent to our servers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5ef' }}>
      {/* Global Success/Error Toast */}
      {(saveStatus === 'success' || saveStatus === 'error') && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 backdrop-blur-md ${
          saveStatus === 'success' 
            ? 'text-white border' 
            : 'text-white border'
        }`}
        style={{
          backgroundColor: saveStatus === 'success' ? '#10b981' : '#f59e0b',
          borderColor: saveStatus === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
          boxShadow: saveStatus === 'success' 
            ? '0 0 15px rgba(16, 185, 129, 0.4)' 
            : '0 0 15px rgba(245, 158, 11, 0.4)'
        }}>
          {saveStatus === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">
            {saveStatus === 'success' ? 'Settings saved successfully!' : 'Error saving settings. Please try again.'}
          </span>
        </div>
      )}
      
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg backdrop-blur-md border" 
                   style={{ 
                     backgroundColor: 'rgba(182, 157, 116, 0.1)', 
                     borderColor: 'rgba(182, 157, 116, 0.2)',
                     boxShadow: '0 0 15px rgba(182, 157, 116, 0.2)'
                   }}>
                <SettingsIcon className="w-6 h-6" style={{ color: '#b69d74' }} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1f2839' }}>
                  Settings & Preferences
                </h1>
                <p className="mt-1" style={{ color: '#6b7280' }}>
                  Customize your legal practice workspace and preferences
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-4 sticky top-6 settings-sidebar backdrop-blur-md" 
                   style={{ 
                     backgroundColor: 'rgba(255, 255, 255, 0.6)', 
                     borderColor: 'rgba(182, 157, 116, 0.2)',
                     boxShadow: '0 0 25px rgba(182, 157, 116, 0.15)'
                   }}>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide" style={{ color: '#1f2839' }}>
                  Settings
                </h3>
                <nav className="space-y-1" role="navigation" aria-label="Settings navigation">
                  {settingsCategories.map((category) => {
                    const IconComponent = category.icon;
                    const isActive = activeCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm ${
                          isActive
                            ? 'border'
                            : 'hover:backdrop-blur-md'
                        }`}
                        style={{
                          backgroundColor: isActive 
                            ? 'rgba(182, 157, 116, 0.12)' 
                            : 'transparent',
                          borderColor: isActive 
                            ? 'rgba(182, 157, 116, 0.3)' 
                            : 'transparent',
                          boxShadow: isActive 
                            ? '0 0 15px rgba(182, 157, 116, 0.2)' 
                            : 'none',
                          color: isActive ? '#1f2839' : '#6b7280'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.05)';
                            e.target.style.color = '#1f2839';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#6b7280';
                          }
                        }}
                        aria-pressed={isActive}
                        aria-describedby={`${category.id}-description`}
                      >
                        <IconComponent className={`w-4 h-4 flex-shrink-0`} 
                                     style={{ color: isActive ? '#b69d74' : '#6b7280' }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div id={`${category.id}-description`} className="text-xs truncate" 
                               style={{ color: '#6b7280' }}>
                            {category.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
                
                {/* Keyboard shortcuts help */}
                <div className="mt-6 p-3 rounded-md backdrop-blur-sm border" 
                     style={{ 
                       backgroundColor: 'rgba(182, 157, 116, 0.08)', 
                       borderColor: 'rgba(182, 157, 116, 0.2)' 
                     }}>
                  <h4 className="text-xs font-medium mb-2" style={{ color: '#1f2839' }}>Keyboard Shortcuts</h4>
                  <div className="space-y-1 text-xs" style={{ color: '#6b7280' }}>
                    <div>↑↓ Navigate categories</div>
                    <div>Ctrl+S Save settings</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {activeCategory === 'profile' && renderProfileSettings()}
              {activeCategory === 'workspace' && renderWorkspaceSettings()}
              {activeCategory === 'theme' && renderThemeSettings()}
              {activeCategory === 'notifications' && renderNotificationSettings()}
              {activeCategory === 'billing' && renderBillingSettings()}
              {activeCategory === 'security' && renderSecuritySettings()}
              {activeCategory === 'advanced' && renderAdvancedSettings()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}