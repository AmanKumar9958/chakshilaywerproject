import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, Target, UserCheck, Timer, Shield, Award, Bot, Star, 
  CheckCircle, Clock, Users, TrendingUp, Scale, Gavel, BookOpen, Briefcase
} from "lucide-react";

// Custom hook for intersection observer
const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [ref, options]);

  return isIntersecting;
};

// Custom hook for number animation with proper cleanup
const useNumberAnimation = (isActive, targetValue, duration = 2000) => {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isActive || !targetValue) {
      setDisplayValue(0);
      return;
    }

    let startTimestamp = null;
    const startValue = 0;
    const endValue = Number(targetValue) || 0;

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth easing function
      const easedProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentValue = Math.floor(easedProgress * (endValue - startValue) + startValue);
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isActive, targetValue, duration]);

  return displayValue;
};

// Professional StatCard Component with legal imagery
const StatCard = ({ stat, index, isVisible }) => {
  const animatedValue = useNumberAnimation(isVisible, stat.number, 2000 + (index * 200));
  
  // Handle decimal values for accuracy rate
  const displayValue = stat.suffix === '%' && stat.number % 1 !== 0 
    ? (animatedValue + (stat.number % 1)).toFixed(1)
    : animatedValue;

  return (
    <div className="relative group">
      {/* Card with legal-themed background image */}
      <div 
        className="relative p-8 rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group cursor-pointer min-h-[380px] flex flex-col justify-center border"
        style={{
          background: `rgba(255, 255, 255, 0.90)`,
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(182, 157, 116, 0.3)',
          boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(182, 157, 116, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
          e.currentTarget.style.transform = 'translateY(-12px) scale(1.05)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(31, 40, 57, 0.12)';
          e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
        }}
      >
        {/* Animated legal pattern overlay */}
        {stat.pattern && (
          <div 
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
            style={{
              backgroundImage: `url("${stat.pattern}")`,
              backgroundSize: '200px 200px',
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat'
            }}
          />
        )}
        
        {/* Golden accent elements - simplified */}
        <div 
          className="absolute top-4 right-4 w-3 h-12 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-y-125"
          style={{
            background: 'linear-gradient(180deg, #b69d74 0%, #b69d74 100%)',
          }}
        />
        
        <div className="relative z-10 text-center">
          {/* Icon container with legal theme */}
          <div className="relative mb-6">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)',
                boxShadow: '0 8px 32px rgba(182, 157, 116, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Subtle pattern inside icon container */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <stat.icon className="w-8 h-8 text-white relative z-10" />
            </div>
          </div>
          
          {/* Numbers with enhanced typography */}
          <div className="mb-4">
            <div 
              className="text-5xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: 'linear-gradient(135deg, #1f2839 0%, #b69d74 100%)'
              }}
            >
              {typeof displayValue === 'string' ? displayValue : displayValue.toLocaleString()}{stat.suffix}
            </div>
            
            {/* Animated legal-style divider */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div 
                className="h-0.5 rounded-full transition-all duration-500 group-hover:w-8"
                style={{ 
                  width: '4px',
                  background: 'linear-gradient(90deg, #b69d74, #b69d74)'
                }}
              />
              <Gavel className="w-3 h-3 text-[#b69d74]" />
              <div 
                className="h-0.5 rounded-full transition-all duration-500 group-hover:w-8"
                style={{ 
                  width: '4px',
                  background: 'linear-gradient(90deg, #b69d74, #b69d74)'
                }}
              />
            </div>
          </div>
          
          <div 
            className="text-xl font-semibold mb-3 tracking-wide"
            style={{ color: '#1f2839' }}
          >
            {stat.label}
          </div>
          
          <p 
            className="text-sm font-medium tracking-wide opacity-90 leading-relaxed"
            style={{ color: '#6b7280' }}
          >
            {stat.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Professional Trust Badge Component
const TrustBadge = ({ icon: Icon, text, iconColor = '#B69D74', gradient }) => {
  if (!Icon || !text) return null;
  
  return (
  <div 
    className="relative group cursor-pointer"
    style={{
      background: gradient || 'rgba(255, 255, 255, 0.90)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(182, 157, 116, 0.3)',
      borderRadius: '50px',
      padding: '14px 28px',
      boxShadow: '0 6px 25px rgba(31, 40, 57, 0.12)',
      transition: 'all 0.4s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
      e.currentTarget.style.boxShadow = '0 12px 35px rgba(182, 157, 116, 0.25)';
      e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 6px 25px rgba(31, 40, 57, 0.12)';
      e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
      e.currentTarget.style.background = gradient || 'rgba(255, 255, 255, 0.90)';
    }}
  >
    <div className="flex items-center gap-3">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
        style={{
          background: iconColor === '#f59e0b' 
            ? 'linear-gradient(135deg, #f59e0b 0%, #f59e0b 100%)'
            : 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <Icon className="w-5 h-5 text-white relative z-10" />
      </div>
      <span 
        className="font-semibold text-sm tracking-wide"
        style={{ color: '#1f2839' }}
      >
        {text}
      </span>
    </div>
  </div>
  );
};

// Main Stats Component
const Stats = () => {
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Legal-themed background images (placeholder URLs - replace with actual legal-themed images)
  const legalImages = {
    documents: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231F2839'/%3E%3Cpath d='M80 80 L320 80 L320 220 L80 220 Z' fill='none' stroke='%23B69D74' stroke-width='2'/%3E%3Cpath d='M100 100 L300 100 M100 130 L250 130 M100 160 L280 160 M100 190 L200 190' stroke='%23D4C4A8' stroke-width='1.5'/%3E%3C/svg%3E",
    accuracy: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231F2839'/%3E%3Ccircle cx='200' cy='150' r='60' fill='none' stroke='%23B69D74' stroke-width='2'/%3E%3Cpath d='M170 150 L190 170 L230 130' stroke='%23D4C4A8' stroke-width='3' fill='none'/%3E%3C/svg%3E",
    professionals: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231F2839'/%3E%3Ccircle cx='150' cy='120' r='25' fill='%23B69D74' opacity='0.3'/%3E%3Ccircle cx='250' cy='120' r='25' fill='%23D4C4A8' opacity='0.3'/%3E%3Cpath d='M120 200 L180 200 M220 200 L280 200' stroke='%23B69D74' stroke-width='2'/%3E%3C/svg%3E",
    time: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231F2839'/%3E%3Ccircle cx='200' cy='150' r='50' fill='none' stroke='%23B69D74' stroke-width='2'/%3E%3Cpath d='M200 150 L200 110 M200 150 L240 150' stroke='%23D4C4A8' stroke-width='3'/%3E%3C/svg%3E"
  };

  const statsData = [
    { 
      number: 5, 
      label: "Core Features", 
      suffix: "", 
      icon: FileText,
      description: "Document analysis capabilities",
      backgroundImage: legalImages.documents,
      pattern: "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50 L100 0 L100 100 L0 100 L0 0 Z' fill='%23B69D74' fill-opacity='0.03'/%3E%3C/svg%3E"
    },
    { 
      number: 24, 
      label: "Available Daily", 
      suffix: "/7", 
      icon: Clock,
      description: "Always accessible platform",
      backgroundImage: legalImages.accuracy,
      pattern: "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='30' fill='%23B69D74' fill-opacity='0.03'/%3E%3C/svg%3E"
    },
    { 
      number: 3, 
      label: "User Roles", 
      suffix: "", 
      icon: Users,
      description: "Advocate, Student, Clerk access",
      backgroundImage: legalImages.professionals,
      pattern: "data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 60 L120 0 L120 120 L0 120 L0 0 Z' fill='%23D4C4A8' fill-opacity='0.03'/%3E%3C/svg%3E"
    },
    { 
      number: 10, 
      label: "File Formats", 
      suffix: "+", 
      icon: FileText,
      description: "Multiple document types supported",
      backgroundImage: legalImages.time,
      pattern: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='25' fill='%23B69D74' fill-opacity='0.03'/%3E%3C/svg%3E"
    }
  ];

  const isVisible = useIntersectionObserver(
    statsRef,
    { threshold: 0.2 }
  );

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  return (
    <section 
      className="relative py-24 overflow-hidden"
      style={{ 
        backgroundColor: '#f5f5ef',
        backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
      ref={statsRef}
      aria-labelledby="stats-heading"
      role="region"
    >
      {/* Enhanced background with legal-themed elements */}
      <div className="absolute inset-0">
        {/* Background overlay for readability */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245, 245, 239, 0.85)' }}></div>
        
        {/* Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
        
        {/* Animated Background Elements */}
        <div 
          className="absolute top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{
            background: `linear-gradient(135deg, rgba(182, 157, 116, 0.2), rgba(182, 157, 116, 0.1))`
          }}
        ></div>
        <div 
          className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: `linear-gradient(135deg, rgba(182, 157, 116, 0.15), rgba(182, 157, 116, 0.08))`
          }}
        ></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1f2839 1px, transparent 1px),
              linear-gradient(to bottom, #1f2839 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        ></div>
        
        {/* Scale of Justice */}
        <div 
          className="absolute top-20 left-10 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M100 40 L100 160 M60 100 L140 100 M80 70 L80 130 M120 70 L120 130' stroke='%23b69d74' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: '200px',
            height: '200px'
          }}
        />
        
        {/* Law Books Pattern */}
        <div 
          className="absolute bottom-32 right-20 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Cpath d='M50 50 L50 120 L80 120 L80 50 Z M60 50 L60 120 M70 50 L70 120 M90 60 L90 130 L120 130 L120 60 Z M100 60 L100 130 M110 60 L110 130' stroke='%23b69d74' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: '150px',
            height: '150px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header with Legal Theme */}
        <div className="text-center mb-20">
          <h2 id="stats-heading" className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            <span style={{ color: '#1f2839' }}>Comprehensive </span>
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: 'linear-gradient(135deg, #b69d74 0%, #b69d74 50%, #1f2839 100%)'
              }}
            >
              Legal Platform
            </span>
          </h2>
          
          <p 
            className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-medium"
            style={{ color: '#6b7280' }}
          >
            Discover our feature-rich AI platform designed to 
            <span style={{ color: '#b69d74', fontWeight: '600' }}> streamline legal workflows</span> and enhance productivity
          </p>
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statsData.map((stat, index) => (
            <div key={index} aria-label={`${stat.number}${stat.suffix} ${stat.label}`}>
              <StatCard 
                stat={stat}
                index={index}
                isVisible={isVisible}
              />
            </div>
          ))}
        </div>
        
        {/* Professional Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-20">
          <TrustBadge 
            icon={Shield} 
            text="Secure Platform" 
            iconColor="#B69D74" 
          />
          <TrustBadge 
            icon={Clock} 
            text="Real-time Processing" 
            iconColor="#B69D74" 
          />
          <TrustBadge 
            icon={Bot} 
            text="AI-Powered Tools" 
            iconColor="#B69D74" 
          />
          <TrustBadge 
            icon={Scale} 
            text="Legal Compliance" 
            iconColor="#B69D74" 
          />
        </div>
        
        {/* Premium Legal Call to Action */}
        <div 
          className="relative text-center rounded-3xl p-16 overflow-hidden border"
          style={{
            background: `linear-gradient(rgba(255, 255, 255, 0.90), rgba(255, 255, 255, 0.85)), url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(182, 157, 116, 0.4)',
            boxShadow: '0 25px 60px rgba(31, 40, 57, 0.15)'
          }}
        >
          {/* Background decoration */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-2xl"
            style={{
              background: 'radial-gradient(circle, #b69d74 0%, transparent 70%)'
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-2xl"
            style={{
              background: 'radial-gradient(circle, #b69d74 0%, transparent 70%)'
            }}
          />
          
          <div className="relative z-10">
            <div className="mb-6">
              <span 
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold tracking-wide border"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.2) 0%, rgba(182, 157, 116, 0.3) 100%)',
                  color: '#b69d74',
                  border: '1px solid rgba(182, 157, 116, 0.5)'
                }}
              >
                <Briefcase className="w-4 h-4" />
                Transform Your Legal Practice
              </span>
            </div>
            
            <h3 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ color: '#1f2839' }}
            >
              Ready to Join the 
              <span 
                className="bg-gradient-to-r bg-clip-text text-transparent block mt-2"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #b69d74 0%, #b69d74 50%, #1f2839 100%)'
                }}
              >
                Legal AI Revolution?
              </span>
            </h3>
            
            <p 
              className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
              style={{ color: '#6b7280' }}
            >
              Join legal professionals who are already using our platform to 
              <span style={{ color: '#b69d74', fontWeight: '600' }}> streamline workflows and boost productivity</span> 
              with AI-powered legal solutions
            </p>
            
            <div className="flex justify-center mb-10">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-register-modal'))}
                className="group relative px-12 py-5 text-white rounded-2xl font-bold text-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden border"
                style={{ 
                  background: 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)',
                  boxShadow: '0 10px 25px rgba(182, 157, 116, 0.40)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  borderWidth: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(182, 157, 116, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(182, 157, 116, 0.40)';
                }}
                aria-label="Open Register Modal"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5" />
                Start Free Trial
                </span>
              </button>
            </div>
            
            {/* Enhanced Legal Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium">
              <div className="flex items-center gap-3 group">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.2) 0%, rgba(182, 157, 116, 0.3) 100%)',
                    border: '1px solid rgba(182, 157, 116, 0.4)'
                  }}
                >
                  <CheckCircle className="w-5 h-5 text-[#b69d74]" />
                </div>
                <span style={{ color: '#1f2839' }}>Live & Operational</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.2) 0%, rgba(182, 157, 116, 0.3) 100%)',
                    border: '1px solid rgba(182, 157, 116, 0.4)'
                  }}
                >
                  <CheckCircle className="w-5 h-5 text-[#b69d74]" />
                </div>
                <span style={{ color: '#1f2839' }}>3 Days Free Trial Available</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.2) 0%, rgba(182, 157, 116, 0.3) 100%)',
                    border: '1px solid rgba(182, 157, 116, 0.4)'
                  }}
                >
                  <CheckCircle className="w-5 h-5 text-[#b69d74]" />
                </div>
                <span style={{ color: '#1f2839' }}>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;