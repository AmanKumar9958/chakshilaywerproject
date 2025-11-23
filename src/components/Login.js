import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Hero.js comprehensive color palette
  const colors = {
    // Primary Brand Colors
    background: '#f5f5ef',
    darkNavy: '#1f2839',
    golden: '#b69d74',
    mediumGray: '#6b7280',
    
    // Functional Status Colors
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Transparency & Alpha Variations
    whiteAlpha03: 'rgba(255, 255, 255, 0.03)',
    whiteAlpha06: 'rgba(255, 255, 255, 0.06)',
    whiteAlpha08: 'rgba(255, 255, 255, 0.08)',
    whiteAlpha20: 'rgba(255, 255, 255, 0.20)',
    goldenAlpha05: 'rgba(182, 157, 116, 0.05)',
    goldenAlpha08: 'rgba(182, 157, 116, 0.08)',
    goldenAlpha10: 'rgba(182, 157, 116, 0.10)',
    goldenAlpha12: 'rgba(182, 157, 116, 0.12)',
    goldenAlpha15: 'rgba(182, 157, 116, 0.15)',
    goldenAlpha20: 'rgba(182, 157, 116, 0.20)',
    goldenAlpha40: 'rgba(182, 157, 116, 0.40)',
    goldenAlpha50: 'rgba(182, 157, 116, 0.50)',
    goldenAlpha60: 'rgba(182, 157, 116, 0.60)',
    navyAlpha05: 'rgba(31, 40, 57, 0.05)',
    navyAlpha15: 'rgba(31, 40, 57, 0.15)',
    navyAlpha20: 'rgba(31, 40, 57, 0.20)',
    navyAlpha25: 'rgba(31, 40, 57, 0.25)',
    
    // Gradient Combinations
    primaryButtonGradient: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
    textGradient: 'linear-gradient(135deg, #1f2839, #b69d74)',
    progressGradient: 'linear-gradient(90deg, #b69d74, #b69d74CC)',
    backgroundGradient: 'linear-gradient(135deg, #b69d7420, #b69d7410)'
  };

  const roles = [
    {
      id: 'advocate',
      title: 'Advocate',
      label: '⚖️ Legal Professional',
      route: '/advocate/dashboard',
      description: 'Legal professional practice management',
      emoji: '⚖️',
      gradient: colors.primaryButtonGradient
    },
    {
      id: 'student',
      title: 'Law Student',
      label: '🎓 Academic Learning',
      route: '/student/dashboard',
      description: 'Pursuing legal education and training',
      emoji: '🎓',
      gradient: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}CC)`
    },
    {
      id: 'clerk',
      title: 'Court Clerk',
      label: '📋 Administrative Support',
      route: '/clerk/dashboard',
      description: 'Court administration and case management',
      emoji: '📋',
      gradient: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}BB)`
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'role') {
      setRoleError('');
    }
    setError('');
  };

  // Demo authentication - replace with actual API call
  const authenticateUser = async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, allow any email/password combination
    // In production, this should make a real API call
    if (credentials.email && credentials.password && credentials.role) {
      return {
        id: Date.now(),
        email: credentials.email,
        role: credentials.role,
        name: credentials.email.split('@')[0],
        token: `demo-token-${Date.now()}`,
        isAuthenticated: true
      };
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRoleError('');
    setLoading(true);
    
    if (!formData.role) {
      setRoleError('Please select your role');
      setLoading(false);
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Authenticate user (replace with actual API call)
      const userData = await authenticateUser(formData);
      
      // Store user data in context and localStorage
      login(userData);
      
      // Get the selected role's route
      const selectedRole = roles.find(role => role.id === formData.role);
      navigate(selectedRole.route);
      
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: colors.background }}
    >
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: colors.goldenAlpha10 }}
        ></div>
        <div 
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ 
            backgroundColor: colors.goldenAlpha08,
            animationDelay: '2s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ 
            backgroundColor: colors.goldenAlpha05,
            animationDelay: '4s'
          }}
        ></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, ${colors.goldenAlpha10} 1px, transparent 1px), linear-gradient(to bottom, ${colors.goldenAlpha10} 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}
        ></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 border rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              backgroundColor: colors.whiteAlpha20,
              borderColor: colors.goldenAlpha40,
              backdropFilter: 'blur(6px)',
              ':hover': { borderColor: colors.goldenAlpha60 }
            }}
          >
            <span className="text-3xl">🔐</span>
          </div>
          <h1 
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: colors.darkNavy }}
          >
            Welcome Back
          </h1>
          <p 
            className="text-lg sm:text-xl"
            style={{ color: colors.mediumGray }}
          >
            Sign in to your legal platform account
          </p>
        </div>

        {/* Main Form Card */}
        <div 
          className="border rounded-2xl p-6 sm:p-8 mb-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            backgroundColor: colors.whiteAlpha20,
            borderColor: colors.goldenAlpha40,
            backdropFilter: 'blur(6px)',
            ':hover': { borderColor: colors.goldenAlpha60 }
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.darkNavy }}
              >
                📧 Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full p-3 sm:p-4 pl-4 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 hover:border-opacity-80"
                  style={{
                    backgroundColor: colors.whiteAlpha06,
                    borderColor: colors.goldenAlpha40,
                    color: colors.darkNavy,
                    '::placeholder': { color: colors.mediumGray },
                    ':focus': {
                      ringColor: colors.golden,
                      borderColor: 'transparent'
                    },
                    ':hover': { borderColor: colors.goldenAlpha60 }
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.darkNavy }}
              >
                🔒 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full p-3 sm:p-4 pl-4 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 hover:border-opacity-80"
                  style={{
                    backgroundColor: colors.whiteAlpha06,
                    borderColor: colors.goldenAlpha40,
                    color: colors.darkNavy,
                    '::placeholder': { color: colors.mediumGray },
                    ':focus': {
                      ringColor: colors.golden,
                      borderColor: 'transparent'
                    },
                    ':hover': { borderColor: colors.goldenAlpha60 }
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-colors duration-200"
                  style={{ 
                    color: colors.mediumGray,
                    ':hover': { color: colors.golden }
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label 
                className="block text-sm font-medium mb-3"
                style={{ color: colors.darkNavy }}
              >
                👤 Select Your Role
              </label>
              <div className="space-y-3">
                {roles.map((role) => {
                  const isSelected = formData.role === role.id;
                  const isHovered = hoveredRole === role.id;
                  
                  return (
                    <div
                      key={role.id}
                      className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{
                        borderColor: isSelected ? colors.golden : colors.goldenAlpha40,
                        backgroundColor: isSelected ? colors.goldenAlpha10 : 'transparent',
                        ...(isSelected && { 
                          boxShadow: `0 0 0 1px ${colors.goldenAlpha20}` 
                        }),
                        ...(isHovered && !isSelected && { 
                          borderColor: colors.goldenAlpha60,
                          backgroundColor: colors.goldenAlpha05 
                        })
                      }}
                      onClick={() => !loading && handleChange({ target: { name: 'role', value: role.id } })}
                      onMouseEnter={() => setHoveredRole(role.id)}
                      onMouseLeave={() => setHoveredRole(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-10 h-10 sm:w-12 sm:h-12 border rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                            isHovered ? 'scale-110' : ''
                          }`}
                          style={{
                            background: role.gradient,
                            borderColor: colors.goldenAlpha60
                          }}
                        >
                          <span className="text-xl sm:text-2xl text-white">{role.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 
                              className="text-base sm:text-lg font-semibold truncate"
                              style={{ color: colors.darkNavy }}
                            >
                              {role.title}
                            </h4>
                            {isSelected && (
                              <span 
                                className="text-lg sm:text-xl flex-shrink-0 ml-2"
                                style={{ color: colors.golden }}
                              >
                                ✅
                              </span>
                            )}
                          </div>
                          <p 
                            className="text-sm truncate"
                            style={{ color: colors.mediumGray }}
                          >
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {roleError && (
                <div 
                  className="mt-2 flex items-center gap-2 text-sm"
                  style={{ color: colors.golden }}
                >
                  <span>⚠️</span>
                  {roleError}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`w-full text-white py-3 sm:py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              style={{
                background: colors.primaryButtonGradient,
                boxShadow: `0 4px 15px ${colors.goldenAlpha40}`
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Signing In...
                </>
              ) : (
                <>
                  <span>👤</span>
                  Sign In
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div 
              className="mt-4 p-3 border rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: colors.goldenAlpha10,
                borderColor: colors.goldenAlpha40
              }}
            >
              <span style={{ color: colors.golden }}>⚠️</span>
              <p 
                className="text-sm"
                style={{ color: colors.darkNavy }}
              >
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Register Link */}
        <div 
          className="text-center p-4 border rounded-lg hover:bg-opacity-80 transition-all duration-300"
          style={{
            backgroundColor: colors.whiteAlpha06,
            borderColor: colors.goldenAlpha40,
            backdropFilter: 'blur(6px)'
          }}
        >
          <p 
            className="text-sm"
            style={{ color: colors.mediumGray }}
          >
            Don't have an account? {' '}
            <button 
              className="font-medium hover:underline transition-colors duration-200"
              onClick={() => !loading && navigate('/register')}
              disabled={loading}
              style={{
                color: colors.darkNavy,
                ':hover': { color: colors.golden }
              }}
            >
              Create one here
            </button>
          </p>
        </div>

        {/* Demo Notice */}
        <div 
          className="mt-6 p-4 border rounded-lg hover:bg-opacity-80 transition-all duration-300"
          style={{
            backgroundColor: colors.goldenAlpha10,
            borderColor: colors.goldenAlpha40
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-8 h-8 border rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: colors.primaryButtonGradient,
                borderColor: colors.goldenAlpha60
              }}
            >
              <span className="text-xl text-white">⭐</span>
            </div>
            <div>
              <h4 
                className="text-sm font-semibold mb-1"
                style={{ color: colors.darkNavy }}
              >
                Demo Mode Active
              </h4>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: colors.mediumGray }}
              >
                You can sign in with any email and password. Just select your role and click "Sign In" to explore the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-4 text-center">
          <button 
            className="flex items-center gap-1 mx-auto transition-colors duration-200 hover:underline text-sm"
            onClick={() => navigate('/')}
            style={{
              color: colors.mediumGray,
              ':hover': { color: colors.golden }
            }}
          >
            <span>🏠</span>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;