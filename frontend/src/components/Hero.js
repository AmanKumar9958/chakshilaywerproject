import React, { useEffect, useState } from 'react';
import { ArrowRight, FileText, Brain, CheckCheck, Search, Zap, ChevronDown, Sparkles, Shield, Clock, Star, Users, Award } from 'lucide-react';

// Import Montserrat font
const montserratFont = {
  fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % 3);
    }, 4000);
    
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    
    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  // Typewriter effect for animated text
  useEffect(() => {
    const currentText = animatedTexts[textIndex];
    let currentIndex = 0;
    setTypedText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (currentIndex < currentText.length) {
        setTypedText(currentText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 120);

    return () => clearInterval(typeInterval);
  }, [textIndex]);

  // Professional legal color palette
  const colors = {
    background: '#f5f5ef',
    textDark: '#1f2839',
    accent: '#b69d74',
    textLight: '#6b7280'
  };

  const animatedTexts = [
    "Document Intelligence",
    "Risk Assessment",
    "Compliance Automation"
  ];

  return (
    <>
      {/* Montserrat Font */}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      <section id="hero" className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.background }}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Law-themed background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          }}
        ></div>
        
        {/* Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
        
        {/* Animated Background Elements */}
        <div 
          className="absolute top-20 -left-20 w-80 h-80 rounded-full blur-3xl animate-float-slow"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}20, ${colors.accent}10)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl animate-float-slow animation-delay-2000"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}15, ${colors.accent}08)`
          }}
        ></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${colors.textDark} 1px, transparent 1px),
              linear-gradient(to bottom, ${colors.textDark} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 lg:pt-36 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[75vh]">
          
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={montserratFont}>
            
            {/* Premium Badge
            <div 
              className="inline-flex items-center space-x-3 backdrop-blur-md border rounded-full px-6 py-3 text-sm font-semibold transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg animate-slide-up"
              style={{
                backgroundColor: `${colors.background}CC`,
                borderColor: colors.accent,
                color: colors.textDark,
                animationDelay: '0.1s',
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500 animate-pulse" />
                <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
              </div>
              <span className="font-bold tracking-wide">Trusted by 10,000+ Legal Professionals</span>
            </div> */}
            
            {/* Enhanced Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight">
                <span 
                  className="block mb-4 tracking-tight transform transition-all duration-1000 hover:scale-105 animate-slide-up"
                  style={{ 
                    ...montserratFont,
                    color: colors.textDark,
                    textShadow: '0 6px 25px rgba(31, 40, 57, 0.2), 0 0 60px rgba(31, 40, 57, 0.1)',
                    letterSpacing: '-0.02em',
                    animationDelay: '0.2s',
                    animationFillMode: 'both'
                  }}
                >
                  <span className="inline-block animate-float-text" style={{ animationDelay: '0.3s' }}>Next-Gen</span>
                  <span className="inline-block animate-float-text ml-4" style={{ animationDelay: '0.4s' }}>Legal</span>
                </span>
                <span 
                  className="block transform transition-all duration-1000 hover:scale-105 animate-slide-up relative"
                  style={{
                    ...montserratFont,
                    color: colors.textDark,
                    textShadow: '0 6px 30px rgba(31, 40, 57, 0.4)',
                    letterSpacing: '-0.01em',
                    animationDelay: '0.5s',
                    animationFillMode: 'both'
                  }}
                >
                  <span className="relative inline-block animate-shimmer-text">
                    AI Platform
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer-overlay"
                      style={{ transform: 'skewX(-20deg)' }}
                    ></div>
                  </span>
                </span>
              </h1>
              
              <div className="space-y-6">
                {/* Enhanced description */}
                <div className="space-y-3">
                  <p 
                    className="text-xl lg:text-2xl leading-relaxed font-semibold animate-slide-up"
                    style={{ 
                      ...montserratFont,
                      color: colors.textDark,
                      animationDelay: '0.7s',
                      animationFillMode: 'both'
                    }}
                  >
                    <span className="inline-block animate-bounce-gentle" style={{ animationDelay: '0.8s' }}>Revolutionize</span>
                    <span className="inline-block animate-bounce-gentle ml-2" style={{ animationDelay: '0.9s' }}>legal</span>
                    <span className="inline-block animate-bounce-gentle ml-2" style={{ animationDelay: '1.0s' }}>workflows</span>
                    <span className="inline-block animate-bounce-gentle ml-2" style={{ animationDelay: '1.1s' }}>with</span>
                    <span className="inline-block animate-bounce-gentle ml-2" style={{ animationDelay: '1.2s' }}>intelligent</span>
                  </p>
                  
                  {/* Subheading */}
                  <p 
                    className="text-lg lg:text-xl leading-relaxed font-medium animate-slide-up"
                    style={{ 
                      ...montserratFont,
                      color: colors.textLight,
                      animationDelay: '0.9s',
                      animationFillMode: 'both'
                    }}
                  >
                    <span className="inline-block animate-bounce-gentle" style={{ animationDelay: '1.4s' }}>Precision.</span>
                    <span className="inline-block animate-bounce-gentle ml-2" style={{ animationDelay: '1.5s' }}>Speed.</span>
                    <span className="inline-block animate-bounce-gentle ml-2" style={{ animationDelay: '1.6s' }}>Excellence.</span>
                  </p>
                </div>
                
                {/* Enhanced Typewriter Effect */}
                <div className="h-20 overflow-hidden relative">
                  <div className="flex items-center">
                    <span 
                      className="text-2xl lg:text-3xl xl:text-4xl font-black transform transition-all duration-500 hover:scale-105 relative animate-slide-up"
                      style={{ 
                        ...montserratFont,
                        color: colors.accent,
                        textShadow: '0 6px 30px rgba(182, 157, 116, 0.5), 0 0 60px rgba(182, 157, 116, 0.2)',
                        letterSpacing: '-0.01em',
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC, ${colors.accent}AA)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        backgroundSize: '200% 200%',
                        animation: 'gradient-pulse 3s ease-in-out infinite, slide-up 0.8s ease-out 1.4s both',
                      }}
                    >
                      {typedText}
                    </span>
                    <span 
                      className={`inline-block w-1 h-8 lg:h-10 xl:h-12 ml-2 bg-current transition-opacity duration-150 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                      style={{ 
                        backgroundColor: colors.accent,
                        boxShadow: `0 0 20px ${colors.accent}60`,
                        animation: isTyping ? 'none' : 'cursor-glow 1.5s ease-in-out infinite alternate'
                      }}
                    ></span>
                  </div>
                  
                  {/* Enhanced floating background elements */}
                  <div 
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full blur-sm animate-float-sparkle opacity-70"
                    style={{ 
                      background: `radial-gradient(circle, ${colors.accent}90, ${colors.accent}50)`,
                      animationDelay: '2s'
                    }}
                  ></div>
                  <div 
                    className="absolute top-0 right-6 w-6 h-6 rounded-full blur-sm animate-float-sparkle opacity-60"
                    style={{ 
                      background: `radial-gradient(circle, ${colors.accent}70, ${colors.accent}40)`,
                      animationDelay: '3.5s'
                    }}
                  ></div>
                  <div 
                    className="absolute -bottom-2 left-1/3 w-5 h-5 rounded-full blur-sm animate-float-sparkle opacity-50"
                    style={{ 
                      background: `radial-gradient(circle, ${colors.accent}60, ${colors.accent}30)`,
                      animationDelay: '4.2s'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '1.8s', animationFillMode: 'both' }}>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-register-modal'))}
                className="group inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-xl hover:shadow-2xl transform"
                style={{
                  ...montserratFont,
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}DD, ${colors.accent}BB)`,
                  color: colors.background,
                  boxShadow: `0 10px 25px ${colors.accent}40, 0 0 0 1px ${colors.accent}20`,
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label="Open Register Modal"
              >
                <span className="font-black tracking-wide">Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              {/* Watch Demo removed */}
            </div>
            
            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 animate-slide-up" style={{ animationDelay: '2.0s', animationFillMode: 'both' }}>
              {[
                { 
                  icon: Award, 
                  text: "98% Accuracy Rate", 
                  subtext: "AI-Powered Precision",
                  color: '#10b981'
                },
                { 
                  icon: Zap, 
                  text: "5x Faster Results", 
                  subtext: "Lightning Speed",
                  color: '#f59e0b'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transform group"
                  style={{
                    ...montserratFont,
                    backgroundColor: `${colors.background}AA`,
                    borderColor: `${item.color}40`,
                    boxShadow: `0 8px 25px ${item.color}20`
                  }}
                >
                  <div 
                    className="p-3 rounded-xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="font-black text-sm tracking-wide"
                        style={{ color: colors.textDark }}
                      >
                        {item.text}
                      </div>
                    </div>
                    <div 
                      className="text-xs font-semibold tracking-wide"
                      style={{ color: colors.textLight }}
                    >
                      {item.subtext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Professional Dashboard */}
          <div className="relative lg:h-[500px] flex items-center justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-md lg:max-w-lg scale-90 lg:scale-95">
              
              {/* Ultra-Transparent Dashboard Card */}
              <div 
                className="relative rounded-3xl p-6 transition-all duration-700 hover:scale-[1.01] border-2 shadow-2xl animate-float group mx-auto overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(6px) saturate(110%)',
                  borderColor: `${colors.accent}40`,
                  boxShadow: '0 20px 40px -12px rgba(31, 40, 57, 0.05), 0 0 0 1px rgba(182, 157, 116, 0.15)',
                  maxWidth: '420px'
                }}
              >
                {/* Subtle background pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.01]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.accent} 1px, transparent 1px), radial-gradient(circle at 80% 50%, ${colors.accent} 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }}
                ></div>
                {/* Premium Dashboard Header */}
                <div className="relative flex items-center justify-between mb-6">
                  {/* System Status Indicators */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)`, boxShadow: `0 0 15px ${colors.accent}40` }}></div>
                        <div className="absolute inset-0 w-4 h-4 rounded-full animate-ping" style={{ backgroundColor: colors.accent, opacity: 0.3 }}></div>
                        <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}></div>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: `${colors.accent}80`, animationDelay: '0.4s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: `${colors.accent}50`, animationDelay: '0.8s' }}></div>
                    </div>
                  </div>
                  
                  {/* Brand and Status */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div 
                        className="font-black text-xl tracking-tight mb-0.5"
                        style={{ 
                          background: `linear-gradient(135deg, ${colors.textDark}, ${colors.accent})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          letterSpacing: '-0.03em'
                        }}
                      >
                       Chakshi
                      </div>
                      <div className="text-xs font-semibold" style={{ color: colors.textLight }}>Enterprise Edition</div>
                    </div>
                    <div 
                      className="relative flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all duration-300 hover:scale-105"
                      style={{
                        background: `rgba(182, 157, 116, 0.12)`,
                        border: `2px solid ${colors.accent}`,
                        color: colors.textDark,
                        boxShadow: `0 6px 20px rgba(182, 157, 116, 0.15)`
                      }}
                    >
                      <div className="relative flex items-center space-x-1">
                        <div 
                          className="w-2 h-2 rounded-full animate-ping"
                          style={{ backgroundColor: '#10b981' }}
                        ></div>
                        <div 
                          className="absolute w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#10b981' }}
                        ></div>
                      </div>
                      <span className="font-black text-xs">LIVE</span>
                    </div>
                  </div>
                </div>
                
                {/* Premium Workflow Pipeline */}
                <div className="space-y-5">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      {[
                        { icon: FileText, label: "Upload", status: "complete", time: "0.3s" },
                        { icon: Brain, label: "Analyze", status: "processing", time: "2.1s" },
                        { icon: CheckCheck, label: "Results", status: "pending", time: "--" }
                      ].map((step, index) => (
                        <div key={index} className="flex items-center">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="relative">
                              <div 
                                className={`relative p-3 rounded-2xl border-2 transition-all duration-500 ${
                                  step.status === 'complete' 
                                    ? 'shadow-lg animate-bounce scale-105' 
                                    : step.status === 'processing'
                                    ? 'shadow-md animate-pulse scale-100'
                                    : 'shadow-sm'
                                }`}
                                style={{
                                  background: step.status === 'complete' 
                                    ? `rgba(182, 157, 116, 0.15)`
                                    : step.status === 'processing'
                                    ? `rgba(182, 157, 116, 0.10)`
                                    : `rgba(255, 255, 255, 0.08)`,
                                  borderColor: step.status === 'complete' 
                                    ? colors.accent
                                    : step.status === 'processing'
                                    ? colors.accent
                                    : `${colors.textDark}25`,
                                  borderWidth: '2px'
                                }}
                              >
                                <step.icon 
                                  className="w-5 h-5 transition-all duration-300" 
                                  style={{ 
                                    color: step.status === 'complete' 
                                      ? colors.accent
                                      : step.status === 'processing'
                                      ? colors.accent
                                      : `${colors.textDark}60`
                                  }} 
                                />
                                {step.status === 'complete' && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: '#10b981' }}>
                                    <CheckCheck className="w-2 h-2 text-white" />
                                  </div>
                                )}
                                {step.status === 'processing' && (
                                  <div className="absolute inset-0 rounded-2xl animate-ping border" style={{ borderColor: colors.accent, opacity: 0.3 }}></div>
                                )}
                              </div>
                            </div>
                            <div className="text-center space-y-0.5">
                              <div 
                                className="text-xs font-bold tracking-wide"
                                style={{ 
                                  color: step.status === 'pending' ? colors.textLight : colors.textDark
                                }}
                              >
                                {step.label}
                              </div>
                              <div 
                                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                                style={{ 
                                  color: step.status === 'complete' ? '#10b981' : step.status === 'processing' ? colors.accent : colors.textLight,
                                  backgroundColor: step.status === 'complete' ? 'rgba(16, 185, 129, 0.1)' : step.status === 'processing' ? `${colors.accent}10` : 'rgba(107, 114, 128, 0.1)'
                                }}
                              >
                                {step.time}
                              </div>
                            </div>
                          </div>
                          {index < 2 && (
                            <div className="relative mx-3">
                              <div 
                                className="w-12 h-1.5 rounded-full transition-all duration-1000 relative overflow-hidden"
                                style={{ 
                                  backgroundColor: `${colors.textDark}15`
                                }}
                              >
                                <div 
                                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
                                  style={{
                                    width: step.status === 'complete' ? '100%' : step.status === 'processing' ? '60%' : '0%',
                                    background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}CC)`,
                                    boxShadow: step.status === 'complete' ? `0 0 8px ${colors.accent}50` : ''
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Compact Analytics Status */}
                  <div 
                    className="relative flex items-center space-x-4 p-4 rounded-2xl border transition-all duration-500 hover:scale-[1.01]"
                    style={{
                      background: `rgba(182, 157, 116, 0.08)`,
                      borderColor: `${colors.accent}50`,
                      boxShadow: `0 8px 25px rgba(182, 157, 116, 0.10)`
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div 
                            key={i}
                            className="w-2.5 h-2.5 rounded-full animate-bounce"
                            style={{ 
                              backgroundColor: colors.accent,
                              animationDelay: `${i * 0.15}s`
                            }}
                          ></div>
                        ))}
                      </div>
                      <div 
                        className="p-2 rounded-xl"
                        style={{ backgroundColor: `rgba(182, 157, 116, 0.10)` }}
                      >
                        <Brain className="w-5 h-5" style={{ color: colors.accent }} />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div 
                        className="font-bold text-sm tracking-wide mb-1"
                        style={{ color: colors.textDark }}
                      >
                        AI analyzing contract clauses...
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.textDark}10` }}>
                          <div 
                            className="h-full rounded-full animate-pulse transition-all duration-1000"
                            style={{ 
                              width: '87%',
                              background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}CC)`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold" style={{ color: colors.accent }}>87%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Document Preview */}
                  <div 
                    className="space-y-3 rounded-2xl p-4 border backdrop-blur-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderColor: `rgba(31, 40, 57, 0.15)`
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: `rgba(182, 157, 116, 0.10)` }}
                        >
                          <FileText className="w-4 h-4" style={{ color: colors.accent }} />
                        </div>
                        <div>
                          <div 
                            className="font-bold text-sm"
                            style={{ color: colors.textDark }}
                          >
                            Divorce_Agreement_2025.pdf
                          </div>
                          <div 
                            className="text-xs font-medium"
                            style={{ color: colors.textLight }}
                          >
                            2.4 MB • 15 pages
                          </div>
                        </div>
                      </div>
                      <div 
                        className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold border"
                        style={{
                          backgroundColor: `rgba(182, 157, 116, 0.10)`,
                          borderColor: colors.accent,
                          color: colors.textDark
                        }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: colors.accent }}
                        ></div>
                        <span>ANALYZING</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { width: "w-5/6", highlight: false },
                        { width: "w-full", highlight: false },
                        { width: "w-11/12", highlight: true },
                        { width: "w-4/5", highlight: true },
                        { width: "w-3/4", highlight: false }
                      ].map((line, index) => (
                        <div 
                          key={index}
                          className={`h-2 rounded-lg transition-all duration-500 ${line.width} ${
                            line.highlight ? 'animate-pulse' : ''
                          }`}
                          style={{
                            background: line.highlight 
                              ? `linear-gradient(90deg, ${colors.accent}, ${colors.accent}CC)`
                              : `linear-gradient(90deg, ${colors.textDark}30, ${colors.textDark}20)`,
                            animationDelay: `${index * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>

                    {/* Simple Risk Assessment */}
                    <div 
                      className="mt-3 p-3 rounded-xl border"
                      style={{
                        background: `rgba(182, 157, 116, 0.05)`,
                        borderColor: `rgba(182, 157, 116, 0.20)`
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" style={{ color: colors.accent }} />
                          <span className="font-bold text-xs" style={{ color: colors.textDark }}>Risk Assessment</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#10b981' }}></div>
                          <span className="text-xs font-semibold" style={{ color: '#10b981' }}>LOW RISK</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Clarity', score: 94, color: '#10b981' },
                          { label: 'Fair Terms', score: 87, color: '#f59e0b' },
                          { label: 'Compliance', score: 96, color: '#10b981' }
                        ].map((metric, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-lg font-black" style={{ color: metric.color }}>{metric.score}%</div>
                            <div className="text-xs font-medium" style={{ color: colors.textLight }}>{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Transparent Floating Analytics Cards */}
              {[
                { 
                  top: "top-4", 
                  right: "-right-4", 
                  icon: FileText, 
                  value: "98%", 
                  label: "Accuracy",
                  delay: '0s',
                  color: '#10b981'
                },
                { 
                  bottom: "bottom-4", 
                  left: "-left-4", 
                  icon: Search, 
                  value: "5x", 
                  label: "Faster",
                  delay: '1s',
                  color: '#3b82f6'
                },
                { 
                  top: "top-1/2", 
                  right: "-right-6", 
                  icon: Brain, 
                  value: "AI", 
                  label: "Powered",
                  delay: '2s',
                  color: colors.accent
                }
              ].map((card, index) => (
                <div 
                  key={index}
                  className={`absolute ${card.top} ${card.bottom} ${card.left} ${card.right} rounded-2xl p-3 border transition-all duration-700 hover:scale-105 animate-float shadow-xl`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)',
                    borderColor: `${card.color}60`,
                    animationDelay: card.delay,
                    boxShadow: `0 15px 30px -8px rgba(31, 40, 57, 0.10), 0 0 0 1px ${card.color}30`,
                    maxWidth: '120px'
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="p-2 rounded-xl shadow-md"
                      style={{ 
                        background: `rgba(${card.color === '#10b981' ? '16, 185, 129' : card.color === '#3b82f6' ? '59, 130, 246' : '182, 157, 116'}, 0.15)`
                      }}
                    >
                      <card.icon className="w-4 h-4" style={{ color: card.color }} />
                    </div>
                    <div className="min-w-0">
                      <div 
                        className="text-lg font-black tracking-tight"
                        style={{ color: colors.textDark }}
                      >
                        {card.value}
                      </div>
                      <div 
                        className="text-xs font-bold whitespace-nowrap"
                        style={{ color: colors.textDark }}
                      >
                        {card.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce">
          <span 
            className="text-sm font-medium"
            style={{ color: colors.textLight }}
          >
            {/* Discover Features */}
          </span>
          <ChevronDown 
            className="w-5 h-5" 
            style={{ color: colors.accent }} 
          />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes float-text {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-sparkle {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
          25% { transform: translateY(-15px) scale(1.2) rotate(90deg); }
          50% { transform: translateY(-5px) scale(0.8) rotate(180deg); }
          75% { transform: translateY(-20px) scale(1.1) rotate(270deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes shimmer-text {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes shimmer-overlay {
          0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
        }
        @keyframes gradient-pulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes cursor-glow {
          0% { box-shadow: 0 0 5px currentColor; }
          100% { box-shadow: 0 0 25px currentColor, 0 0 35px currentColor; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.01); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-text {
          animation: float-text 4s ease-in-out infinite;
        }
        .animate-float-sparkle {
          animation: float-sparkle 6s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-shimmer-text {
          animation: shimmer-text 3s ease-in-out infinite;
        }
        .animate-shimmer-overlay {
          animation: shimmer-overlay 3s linear infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
    </>
  );
};

export default Hero;