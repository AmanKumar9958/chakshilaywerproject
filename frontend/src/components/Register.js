import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { loginUser as backendLoginUser } from '../lib/api'; // Using backendLoginUser to register/login in our backend

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const roles = [
    {
      id: 'advocate',
      title: 'Advocate',
      description: 'Legal professional managing cases and clients',
      route: '/advocate/dashboard',
      gradient: 'from-[#b69d74] to-[#b69d74]/85',
      emoji: '⚖️'
    },
    {
      id: 'student',
      title: 'Law Student',
      description: 'Student pursuing legal education',
      route: '/student/dashboard',
      gradient: 'from-[#b69d74] to-[#b69d74]/80',
      emoji: '🎓'
    },
    {
      id: 'clerk',
      title: 'Court Clerk',
      description: 'Court administrative professional',
      route: '/clerk/dashboard',
      gradient: 'from-[#b69d74] to-[#b69d74]/75',
      emoji: '📋'
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

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: 'gray' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score < 2) return { strength: score, text: 'Weak', color: '#b69d74' };
    if (score < 4) return { strength: score, text: 'Medium', color: '#b69d74' };
    return { strength: score, text: 'Strong', color: '#b69d74' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.role) {
      setRoleError('Please select your role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRoleError('');
    setLoading(true);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up with Supabase
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role, // Store role in Supabase user metadata
          },
        },
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Supabase signUp might not immediately return a session if email confirmation is required.
      // For simplicity, we'll assume a session is immediately available or handle the confirmation flow.
      // If email confirmation is enabled, the user will need to verify their email before logging in.
      // For this task, we'll proceed as if the session is available.
      if (!data || !data.session || !data.session.access_token) {
        // If no session, it might mean email confirmation is pending.
        // We can still proceed to call our backend if the user object is returned,
        // but the token might not be valid for authenticated calls yet.
        // For now, we'll assume a session is needed for immediate login.
        throw new Error('Supabase registration successful, but no active session. Please check your email for verification.');
      }

      const supabaseToken = data.session.access_token;

      // 2. Send Supabase JWT to our backend for local user creation/update
      // The backend /auth/login endpoint handles both login and initial registration in our local DB
      const backendResponse = await backendLoginUser(supabaseToken);

      if (!backendResponse.success) {
        throw new Error(backendResponse.message || 'Backend registration/login failed.');
      }

      const userProfile = backendResponse.data.user;

      // Ensure the role from the backend matches the selected role in the form
      if (userProfile.role.toLowerCase() !== formData.role) {
        throw new Error(`Role mismatch: You are registered as ${userProfile.role}, but tried to register as ${formData.role}.`);
      }
      
      // Store user data in context and localStorage
      login({ ...userProfile, token: supabaseToken });
      
      // Get the selected role's route
      const selectedRole = roles.find(role => role.id === formData.role);
      navigate(selectedRole.route);
      
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5ef] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-80 h-80 sm:w-96 sm:h-96 bg-[#b69d74]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 sm:w-96 sm:h-96 bg-[#b69d74]/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-[#b69d74]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#b69d74/10_1px,transparent_1px),linear-gradient(to_bottom,#b69d74/10_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>
      
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#b69d74] to-[#b69d74]/85 border border-[#b69d74]/40 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <span className="text-white font-bold text-sm md:text-lg">📝</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1f2839] mb-2">Create Your Account</h1>
          <p className="text-sm md:text-base text-[#6b7280]">Join our legal platform and get started</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#b69d74]/40 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl hover:border-[#b69d74]/60 transition-all duration-300 mb-4 md:mb-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
            
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1f2839] mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] text-sm">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full p-3 pl-10 sm:pl-12 bg-white/60 border border-[#b69d74]/40 rounded-lg focus:ring-2 focus:ring-[#b69d74] focus:border-[#b69d74] hover:border-[#b69d74]/60 transition-colors duration-200 text-sm md:text-base text-[#1f2839] placeholder-[#6b7280]"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1f2839] mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] text-sm">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full p-3 pl-10 sm:pl-12 bg-white/60 border border-[#b69d74]/40 rounded-lg focus:ring-2 focus:ring-[#b69d74] focus:border-[#b69d74] hover:border-[#b69d74]/60 transition-colors duration-200 text-sm md:text-base text-[#1f2839] placeholder-[#6b7280]"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1f2839] mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] text-sm">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password (min 6 characters)"
                  className="w-full p-3 pl-10 sm:pl-12 pr-12 bg-white/60 border border-[#b69d74]/40 rounded-lg focus:ring-2 focus:ring-[#b69d74] focus:border-[#b69d74] hover:border-[#b69d74]/60 transition-colors duration-200 text-sm md:text-base text-[#1f2839] placeholder-[#6b7280]"
                  disabled={loading}
                  minLength="6"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#b69d74] transition-colors text-sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#6b7280]">Password Strength</span>
                    <span className="text-xs font-medium text-[#b69d74]">
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-[#b69d74]/10 border border-[#b69d74]/40 rounded-lg h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-[#b69d74] to-[#b69d74]/85 rounded-lg transition-all duration-300"
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1f2839] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] text-sm">🔐</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="w-full p-3 pl-10 sm:pl-12 pr-12 bg-white/60 border border-[#b69d74]/40 rounded-lg focus:ring-2 focus:ring-[#b69d74] focus:border-[#b69d74] hover:border-[#b69d74]/60 transition-colors duration-200 text-sm md:text-base text-[#1f2839] placeholder-[#6b7280]"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#b69d74] transition-colors text-sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <div className="w-4 h-4 bg-[#b69d74] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-xs text-[#b69d74] font-medium">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 bg-[#b69d74] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✗</span>
                      </div>
                      <span className="text-xs text-[#b69d74] font-medium">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1f2839] mb-3">
                Select Your Role
              </label>
              <div className="space-y-2 sm:space-y-3">
                {roles.map((role) => {
                  const isSelected = formData.role === role.id;
                  const isHovered = hoveredRole === role.id;
                  
                  return (
                    <div
                      key={role.id}
                      className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? `border-[#b69d74] bg-[#b69d74]/10 ring-2 ring-[#b69d74]/20` 
                          : 'border-[#b69d74]/40 hover:border-[#b69d74]/60 hover:bg-[#b69d74]/5'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !loading && handleChange({ target: { name: 'role', value: role.id } })}
                      onMouseEnter={() => setHoveredRole(role.id)}
                      onMouseLeave={() => setHoveredRole(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${role.gradient} border border-[#b69d74]/40 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                          isHovered ? 'scale-110' : ''
                        }`}>
                          <span className="text-white font-bold text-sm">{role.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-[#1f2839]">{role.title}</h4>
                            {isSelected && (
                              <div className="w-5 h-5 bg-[#b69d74] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-[#6b7280]">{role.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {roleError && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[#b69d74]">
                  <span className="font-bold">⚠️</span>
                  {roleError}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`w-full p-3 md:p-4 bg-gradient-to-r from-[#b69d74] to-[#b69d74]/85 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base border border-[#b69d74]/40 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-pulse">⏳</span>
                  Creating Account...
                </>
              ) : (
                <>
                  🚀 Create Account
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-[#b69d7410] border border-[#b69d7440] rounded-lg flex items-center gap-2">
              <div className="w-5 h-5 bg-[#b69d74] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-[#1f2839]">{error}</p>
            </div>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-sm border border-[#b69d74]/40 rounded-lg hover:bg-white/80 transition-all duration-300">
          <p className="text-xs sm:text-sm text-[#6b7280]">
            Already have an account? {' '}
            <button 
              className="text-[#1f2839] hover:text-[#b69d74] font-medium hover:underline transition-colors duration-200"
              onClick={() => !loading && navigate('/login')}
              disabled={loading}
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-[#b69d74]/10 border border-[#b69d74]/40 rounded-lg hover:bg-[#b69d74]/15 transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-[#b69d74] to-[#b69d74]/85 border border-[#b69d74]/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs md:text-sm">ℹ️</span>
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-semibold text-[#1f2839] mb-1">Demo Mode Active</h4>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Registration will create a demo account. Fill in all fields and select your role to get started exploring the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-3 sm:mt-4 text-center">
          <button 
            className="text-xs sm:text-sm text-[#6b7280] hover:text-[#b69d74] flex items-center gap-1 mx-auto transition-colors duration-200 hover:underline"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>

        {/* Brand Footer */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-[#6b7280] text-xs sm:text-sm">
            <div className="w-5 h-5 bg-gradient-to-br from-[#b69d74] to-[#b69d74]/85 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span>Chakshi Legal AI Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
