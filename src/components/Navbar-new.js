import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X, Zap } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.pro-nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when menu is open on mobile
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
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogin = () => {
    handleLinkClick();
    navigate('/login');
  };

  const handleRegister = () => {
    handleLinkClick();
    navigate('/register');
  };

  return (
    <nav className={`pro-nav fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'pro-glass backdrop-blur-xl bg-white/80 border-b border-gray-200 pro-shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="pro-container">
        <div className="pro-flex-between h-20">
          
          {/* Professional Logo */}
          <div className="pro-nav-brand pro-flex items-center pro-gap-3">
            <div className="pro-flex-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 pro-rounded-xl pro-shadow-glow pro-hover-lift">
              <img 
                src="src/components/logo.jpeg" 
                alt="Chakshi Logo" 
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to Zap icon if logo fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              <Zap className="w-6 h-6 text-white hidden" />
            </div>
            <div className="pro-flex-col">
              <span className="text-2xl font-bold pro-gradient-text bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Chakshi
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Legal AI Suite
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:pro-flex items-center pro-gap-8">
            <div className="pro-flex items-center pro-gap-6">
              {[
                { href: '#home', label: 'Home' },
                { href: '#features', label: 'Features' },
                { href: '#resources', label: 'Resources' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#contact', label: 'Contact' }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="pro-text-body font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Professional Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 pro-flex-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pro-input bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2.5 w-64 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Professional Auth Buttons */}
            <div className="pro-flex items-center pro-gap-4">
              <button 
                className="pro-btn pro-btn-ghost px-6 py-2.5 font-semibold"
                onClick={handleLogin}
              >
                Log In
              </button>
              <button 
                className="pro-btn pro-btn-primary px-6 py-2.5 font-semibold pro-shadow-glow pro-hover-lift"
                onClick={handleRegister}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden pro-btn pro-btn-ghost pro-p-2 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="pro-card bg-white/95 backdrop-blur-xl mt-4 pro-p-6 border border-gray-200 pro-shadow-xl pro-animate-slide-in">
            
            {/* Mobile Search */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 pro-flex-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pro-input bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-3 w-full focus:bg-white focus:border-blue-500"
              />
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-4 mb-6">
              {[
                { href: '#home', label: 'Home' },
                { href: '#features', label: 'Features' },
                { href: '#resources', label: 'Resources' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#contact', label: 'Contact' }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="block pro-text-body font-medium text-gray-700 hover:text-gray-900 py-3 transition-colors duration-300 border-b border-gray-100 last:border-0"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pro-flex-col pro-gap-3">
              <button 
                className="pro-btn pro-btn-ghost w-full py-3 font-semibold"
                onClick={handleLogin}
              >
                Log In
              </button>
              <button 
                className="pro-btn pro-btn-primary w-full py-3 font-semibold pro-shadow-glow"
                onClick={handleRegister}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;