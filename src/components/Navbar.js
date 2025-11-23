import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutEvent } = useAuth(); // Listen for logout events

  // Professional color palette
  const colors = {
    primary: {
      50: '#f8f7f4',
      100: '#f5f5ef',
      200: '#ebe9e0',
      300: '#d9d5c8',
      400: '#c7c0a8',
      500: '#b69d74',
      600: '#a08960',
      700: '#8a7550',
      800: '#6d5d3f',
      900: '#504530',
    },
    neutral: {
      50: '#f5f5ef',
      100: '#f0f0ea',
      200: '#e5e5df',
      300: '#d0d0ca',
      400: '#a8a8a2',
      500: '#6d6d67',
      600: '#4a4a44',
      700: '#333330',
      800: '#1f2839',
      900: '#1a1f2e',
    },
    accent: {
      500: '#b69d74',
      600: '#a08960',
      700: '#8a7550',
    }
  };

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
      
      // Update active section based on scroll position
        const sections = ['hero', 'features', 'pricing', 'testimonials', 'footer'];
        let currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // For footer, highlight if near bottom of page
            if (section === 'footer') {
              const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 40);
              return nearBottom;
            }
            return rect.top <= 120 && rect.bottom >= 120;
          }
          return false;
        });
        // If no section is active and we're at the very bottom, highlight footer
        if (!currentSection && (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 10)) {
          currentSection = 'footer';
        }
        if (currentSection) {
          setActiveSection(currentSection);
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      // For home page, let scroll detection handle active section
      if (window.scrollY < 100) {
        setActiveSection('hero');
      }
    } else if (path.includes('/login') || path.includes('/register') || path.includes('/dashboard')) {
      // Clear active section for auth/dashboard pages
      setActiveSection('');
    }
    
    // Always close modals and mobile menu when route changes
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setIsOpen(false);
  }, [location]);

  // Close modals when user logs out
  useEffect(() => {
    if (logoutEvent > 0) {
      setShowLoginModal(false);
      setShowRegisterModal(false);
      setIsOpen(false);
    }
  }, [logoutEvent]);

  // Listen for external requests to open the register modal (e.g., from Features CTA)
  useEffect(() => {
    const openRegisterHandler = () => setShowRegisterModal(true);
    window.addEventListener('open-register-modal', openRegisterHandler);
    return () => window.removeEventListener('open-register-modal', openRegisterHandler);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Body overflow handler
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const handleLinkClick = (section = '') => {
    setIsOpen(false);
    if (section) {
      setActiveSection(section);
      if (location.pathname !== '/') {
        // If not on home page, navigate to home first then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            const offset = 100; // Account for fixed navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 300);
      } else {
        // If already on home page, just scroll
        const element = document.getElementById(section);
        if (element) {
          // For footer, scroll to the very bottom to ensure it's visible
          if (section === 'footer') {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            const offset = 100; // Account for fixed navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }
      }
    }
  };

  const handleNavigation = (path, section = '') => {
    if (section) {
      setActiveSection(section);
    }
    navigate(path);
    setIsOpen(false);
  };

  const navigationItems = [
    { id: 'hero', label: 'Home', type: 'section', path: '/' },
    { id: 'features', label: 'Features', type: 'section', path: '/' },
    { id: 'pricing', label: 'Pricing', type: 'section', path: '/' },
    { id: 'testimonials', label: 'Reviews', type: 'section', path: '/' },
    { id: 'footer', label: 'Contact', type: 'section', path: '/' }
  ];

  return (
    <nav 
      ref={navbarRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'backdrop-blur-xl border-b shadow-lg py-0' 
          : 'backdrop-blur-lg border-b py-0'
      }`}
      style={{
        backgroundColor: isScrolled ? `${colors.neutral[50]}F2` : `${colors.neutral[50]}E6`,
        borderColor: colors.neutral[300],
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-22">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group -ml-4"
            onClick={() => handleLinkClick('hero')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleLinkClick('hero')}
            aria-label="Chakshi - Home"
          >
            <div className="relative">
              <img 
                src="/logo.png"
                alt="Chakshi Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 object-contain"
              />
            </div>
            <div className="flex flex-col">
              {/* <span 
                className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
              >
                Chakshi
              </span> */}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            
            {/* Navigation Links */}
            <div 
              className="flex items-center space-x-1 rounded-2xl p-2 border"
              style={{
                backgroundColor: `${colors.neutral[50]}99`,
                borderColor: colors.neutral[300]
              }}
            >
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.type === 'section' ? handleLinkClick(item.id) : handleNavigation(item.path, item.id)}
                  className={`relative flex items-center px-3 lg:px-4 xl:px-5 py-2 lg:py-3 font-semibold transition-all duration-300 rounded-xl ${
                    activeSection === item.id
                      ? 'text-white shadow-lg'
                      : 'hover:bg-opacity-80'
                  }`}
                  style={{
                    color: activeSection === item.id ? 'white' : colors.neutral[700],
                    backgroundColor: activeSection === item.id ? 'transparent' : 'transparent',
                    ...(activeSection === item.id && {
                      background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.accent[600]})`,
                      boxShadow: `0 4px 15px ${colors.primary[500]}40`
                    }),
                    ...(activeSection !== item.id && {
                      ':hover': {
                        backgroundColor: `${colors.neutral[100]}CC`,
                        color: colors.neutral[800]
                      }
                    })
                  }}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <span className="text-sm tracking-wide">{item.label}</span>
                  {activeSection === item.id && (
                    <div 
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.primary[50] }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              <button 
                className="flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 font-semibold transition-all duration-300 rounded-xl border hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => setShowLoginModal(true)}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: colors.neutral[400],
                  color: colors.neutral[800]
                }}
                type="button"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button 
                className="flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 font-semibold text-white transition-all duration-300 rounded-xl border hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => setShowRegisterModal(true)}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.accent[600]})`,
                  borderColor: colors.primary[600],
                  boxShadow: `0 4px 15px ${colors.primary[500]}40`
                }}
                type="button"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              style={{
                backgroundColor: isOpen ? colors.neutral[200] : colors.neutral[100],
                border: `1px solid ${colors.neutral[400]}`,
                color: colors.neutral[800]
              }}
              type="button"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            isOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isOpen}
        >
          <div 
            className="border rounded-2xl mt-4 p-6 shadow-xl backdrop-blur-lg"
            style={{
              backgroundColor: `${colors.neutral[50]}F2`,
              borderColor: colors.neutral[300],
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            
            {/* Mobile Navigation Links */}
            <nav aria-label="Mobile navigation">
              <div className="space-y-3 mb-6">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => item.type === 'section' ? handleLinkClick(item.id) : handleNavigation(item.path, item.id)}
                    className={`flex items-center justify-between w-full py-4 px-4 rounded-xl transition-all duration-300 border ${
                      activeSection === item.id
                        ? 'text-white shadow-lg'
                        : 'border-transparent'
                    }`}
                    style={{
                      color: activeSection === item.id ? 'white' : colors.neutral[700],
                      backgroundColor: activeSection === item.id ? 'transparent' : 'transparent',
                      borderColor: activeSection === item.id ? 'transparent' : 'transparent',
                      ...(activeSection === item.id && {
                        background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.accent[600]})`,
                        boxShadow: `0 4px 15px ${colors.primary[500]}40`
                      })
                    }}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    <span className="font-semibold">{item.label}</span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        activeSection === item.id ? 'text-white rotate-180' : ''
                      }`}
                      style={{
                        color: activeSection === item.id ? 'white' : colors.neutral[500]
                      }}
                    />
                  </button>
                ))}
              </div>
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-4 pt-6 border-t" style={{ borderColor: colors.neutral[300] }}>
              <button 
                className="flex items-center justify-center space-x-2 w-full py-4 px-6 font-semibold transition-all duration-300 rounded-xl border hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => setShowLoginModal(true)}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: colors.neutral[400],
                  color: colors.neutral[800]
                }}
                type="button"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button 
                className="flex items-center justify-center space-x-2 w-full py-4 px-6 font-semibold text-white transition-all duration-300 rounded-xl border hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => setShowRegisterModal(true)}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.accent[600]})`,
                  borderColor: colors.primary[600],
                  boxShadow: `0 4px 15px ${colors.primary[500]}40`
                }}
                type="button"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onOpenRegister={() => setShowRegisterModal(true)}
      />
      
      {/* Register Modal */}
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </nav>
  );
};

// Helper function to expose navigation for other components
export const navigateToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // For footer, scroll to the very bottom to ensure it's visible
    if (sectionId === 'footer') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }
};

export default Navbar;