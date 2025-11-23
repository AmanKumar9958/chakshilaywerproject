import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Eye, EyeOff } from 'lucide-react';

const RegisterModal = ({ isOpen, onClose }) => {
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
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { login, logoutEvent } = useAuth();

  const colors = {
    background: '#f5f5ef',
    darkNavy: '#1f2839',
    golden: '#b69d74',
    mediumGray: '#6b7280',
    goldenAlpha10: 'rgba(182, 157, 116, 0.10)',
    goldenAlpha15: 'rgba(182, 157, 116, 0.15)',
    goldenAlpha40: 'rgba(182, 157, 116, 0.40)',
    goldenAlpha50: 'rgba(182, 157, 116, 0.50)',
    goldenAlpha05: 'rgba(182, 157, 116, 0.05)',
    navyAlpha70: 'rgba(31, 40, 57, 0.70)'
  };

  const roles = [
    {
      id: 'advocate',
      title: 'Advocate',
      description: 'Legal professional managing cases and clients',
      route: '/advocate/dashboard'
    },
    {
      id: 'student',
      title: 'Law Student',
      description: 'Student pursuing legal education',
      route: '/student/dashboard'
    },
    {
      id: 'clerk',
      title: 'Court Clerk',
      description: 'Court administrative professional',
      route: '/clerk/dashboard'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: '' });
      setError('');
      setRoleError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setHoveredRole(null);

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
      setIsAnimating(false);
    }
  }, [isOpen, onClose]);

  // Close modal when logout event occurs
  useEffect(() => {
    if (logoutEvent > 0 && isOpen) {
      onClose();
    }
  }, [logoutEvent, isOpen, onClose]);

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
    
    if (score < 2) return { strength: score, text: 'Weak', color: colors.golden };
    if (score < 4) return { strength: score, text: 'Medium', color: colors.golden };
    return { strength: score, text: 'Strong', color: colors.golden };
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

  const registerUser = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (userData.name && userData.email && userData.password && userData.role) {
      return {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: `demo-token-${Date.now()}`,
        isAuthenticated: true,
        registeredAt: new Date().toISOString()
      };
    } else {
      throw new Error('Registration failed');
    }
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
      const userData = await registerUser(formData);
      login(userData);
      onClose();
      const selectedRole = roles.find(role => role.id === formData.role);
      navigate(selectedRole.route);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[10000] transition-all duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        backgroundColor: colors.navyAlpha70,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        height: '100vh',
        width: '100vw'
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
        <div 
          className={`relative w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
            isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}
          style={{
            boxShadow: `0 25px 50px rgba(31, 40, 57, 0.3), 0 0 0 1px ${colors.goldenAlpha15}`,
            maxHeight: 'calc(100vh - 1.5rem)',
            overflowY: 'auto',
            margin: '0 auto',
            scrollBehavior: 'smooth'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 hover:scale-110 bg-gray-100 hover:bg-gray-200"
            disabled={loading}
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 
                id="register-modal-title"
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ color: colors.darkNavy }}
              >
                Create Professional Account
              </h1>
              <p 
                className="text-sm sm:text-base"
                style={{ color: colors.mediumGray }}
              >
                Join our legal platform and access professional tools
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkNavy }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full professional name"
                  className="w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  style={{
                    backgroundColor: '#fafafa',
                    borderColor: colors.goldenAlpha40,
                    color: colors.darkNavy
                  }}
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkNavy }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your professional email address"
                  className="w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  style={{
                    backgroundColor: '#fafafa',
                    borderColor: colors.goldenAlpha40,
                    color: colors.darkNavy
                  }}
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkNavy }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a secure password (minimum 6 characters)"
                    className="w-full p-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    style={{
                      backgroundColor: '#fafafa',
                      borderColor: colors.goldenAlpha40,
                      color: colors.darkNavy
                    }}
                    disabled={loading}
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: colors.mediumGray }}>Password Strength</span>
                      <span className="text-xs font-medium" style={{ color: colors.golden }}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div 
                      className="w-full border rounded-lg h-2"
                      style={{ 
                        backgroundColor: colors.goldenAlpha10,
                        borderColor: colors.goldenAlpha40
                      }}
                    >
                      <div 
                        className="h-2 rounded-lg transition-all duration-300"
                        style={{ 
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label 
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkNavy }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your secure password"
                    className="w-full p-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    style={{
                      backgroundColor: '#fafafa',
                      borderColor: colors.goldenAlpha40,
                      color: colors.darkNavy
                    }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 hover:bg-gray-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.golden }}
                        >
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: colors.golden }}>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.golden }}
                        >
                          <span className="text-white text-xs">✗</span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: colors.golden }}>Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-3"
                  style={{ color: colors.darkNavy }}
                >
                  Professional Role
                </label>
                <div className="space-y-3">
                  {roles.map((role) => {
                    const isSelected = formData.role === role.id;
                    const isHovered = hoveredRole === role.id;
                    
                    return (
                      <div
                        key={role.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        style={{
                          borderColor: isSelected ? colors.golden : colors.goldenAlpha40,
                          backgroundColor: isSelected ? colors.goldenAlpha10 : 'transparent',
                          ...(isHovered && !isSelected && {
                            borderColor: colors.goldenAlpha50,
                            backgroundColor: colors.goldenAlpha05
                          })
                        }}
                        onClick={() => !loading && handleChange({ target: { name: 'role', value: role.id } })}
                        onMouseEnter={() => setHoveredRole(role.id)}
                        onMouseLeave={() => setHoveredRole(null)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 
                                className="text-base font-semibold"
                                style={{ color: colors.darkNavy }}
                              >
                                {role.title}
                              </h4>
                              {/* checkmark icon removed for professionalism */}
                            </div>
                            <p 
                              className="text-sm"
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

              <button 
                type="submit"
                className={`w-full text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 shadow-lg ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                style={{
                  background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`,
                  boxShadow: `0 4px 15px ${colors.goldenAlpha40}`
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account Securely
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

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

            <div 
              className="mt-4 p-3 rounded-lg"
              style={{
                backgroundColor: colors.goldenAlpha10,
                borderColor: colors.goldenAlpha40
              }}
            >
              <div>
                <h4 
                  className="text-sm font-semibold mb-1"
                  style={{ color: colors.darkNavy }}
                >
                  Demo Environment
                </h4>
                <p 
                  className="text-xs leading-relaxed"
                  style={{ color: colors.mediumGray }}
                >
                  Complete all fields and select your professional role to create a demonstration account and explore the platform capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;