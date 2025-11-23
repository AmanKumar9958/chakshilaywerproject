import React, { useState, useEffect, useRef, useMemo } from 'react';

// Icon components (using Lucide React icons - you'll need to install: npm install lucide-react)
const Brain = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const FileText = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Zap = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const BarChart3 = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Shield = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Color constants for maintainability
const COLORS = {
  primary: '#b69d74',
  secondary: '#1f2839',
  background: '#f5f5ef',
  text: {
    primary: '#1f2839',
    secondary: '#6b7280',
    light: '#9ca3af'
  }
};

// Error Boundary Component
class FeatureErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Feature Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-red-500 text-sm">Feature temporarily unavailable</div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Features = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Icon mapping
  const iconMap = {
    AI: Brain,
    DOC: FileText,
    AUTO: Zap,
    CRM: Users,
    STAT: BarChart3,
    SEC: Shield
  };

  // Memoized features data
  const features = useMemo(() => [
    {
      title: "AI Legal Research",
      description: "Advanced AI-powered research engine for instant case analysis and precedent mapping.",
      stats: "10M+ Cases",
      performance: "+85% Speed",
      category: "Research",
      features: ["Natural Language Search", "Citation Analysis", "Real-time Updates"],
      badge: "Popular",
      icon: "AI",
      bgImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
    },
    {
      title: "Contract Analysis",
      description: "AI-driven contract review with risk assessment and compliance checking.",
      stats: "99.2% Accuracy",
      performance: "+70% Speed",
      category: "Contracts",
      features: ["Risk Scoring", "Clause Library", "Auto Redlining"],
      badge: "Enterprise",
      icon: "DOC",
      bgImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
    },
    {
      title: "Document Automation",
      description: "Smart document creation with templates and automated population.",
      stats: "5x Faster",
      performance: "+90% Efficiency",
      category: "Documents",
      features: ["Smart Templates", "Auto-Population", "E-Signature"],
      badge: "Time Saver",
      icon: "AUTO",
      bgImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
    },
    {
      title: "Client Management",
      description: "Comprehensive CRM with case tracking and client portal.",
      stats: "360° View",
      performance: "+60% Satisfaction",
      category: "CRM",
      features: ["Case Timeline", "Billing Integration", "Client Portal"],
      badge: "Client Focused",
      icon: "CRM",
      bgImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
    },
    {
      title: "Analytics & Insights",
      description: "Real-time business intelligence with predictive analytics.",
      stats: "40+ Metrics",
      performance: "+45% Efficiency",
      category: "Analytics",
      features: ["Live Dashboards", "Predictive Analytics", "KPI Tracking"],
      badge: "Data Driven",
      icon: "STAT",
      bgImage: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
    },
    {
      title: "Security & Compliance",
      description: "Enterprise-grade security with end-to-end encryption.",
      stats: "SOC 2 Certified",
      performance: "99.99% Uptime",
      category: "Security",
      features: ["End-to-End Encryption", "MFA", "Audit Trails"],
      badge: "Secure",
      icon: "SEC",
      bgImage: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=300&fit=crop&crop=center&auto=format&q=80"
    }
  ], []);

  // Feature Card Component
  const FeatureCard = ({ feature, index, isInView }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const IconComponent = iconMap[feature.icon];

    return (
      <FeatureErrorBoundary>
        <div 
          className={`group relative backdrop-blur-sm border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            background: 'rgba(255, 255, 255, 0.80)',
            borderColor: 'rgba(182, 157, 116, 0.3)',
            boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
            e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.5)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(31, 40, 57, 0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
            e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(31, 40, 57, 0.12)';
          }}
          role="img"
          aria-label={`${feature.title} feature card`}
        >
          
          {/* Content layer */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#b69d74] to-[#d4c4a8] text-white">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              
              {feature.badge && (
                <div className="px-3 py-1 text-xs font-semibold rounded-full bg-[#b69d74] text-white">
                  {feature.badge}
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <span 
                className="text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm text-[#b69d74] border"
                style={{
                  background: 'rgba(182, 157, 116, 0.2)',
                  borderColor: 'rgba(182, 157, 116, 0.4)'
                }}
              >
                {feature.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-[#1f2839] mb-3">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed mb-4 text-gray-700">
              {feature.description}
            </p>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div 
                className="p-3 rounded-lg text-center backdrop-blur-sm border"
                style={{
                  background: 'rgba(255, 255, 255, 0.60)',
                  borderColor: 'rgba(182, 157, 116, 0.3)'
                }}
              >
                <div className="text-sm font-bold text-[#1f2839]">{feature.stats}</div>
                <div className="text-xs text-gray-600">Capacity</div>
              </div>
              <div 
                className="p-3 rounded-lg text-center backdrop-blur-sm border"
                style={{
                  background: 'rgba(255, 255, 255, 0.60)',
                  borderColor: 'rgba(182, 157, 116, 0.3)'
                }}
              >
                <div className="text-sm font-bold text-[#b69d74]">{feature.performance}</div>
                <div className="text-xs text-gray-600">Improvement</div>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-2 mb-6">
              {feature.features.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#b69d74] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FeatureErrorBoundary>
    );
  };

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="relative pt-0 pb-20 -mt-24 overflow-hidden"
      aria-labelledby="features-heading"
      style={{ 
        backgroundColor: '#f5f5ef',
        backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 relative z-10">
        
        {/* Header Section */}
  <div className="text-center mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#1f2839]">Chakshi Features</h2>
          </div>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Comprehensive AI-powered features designed for modern legal professionals. 
            Streamline workflows and deliver exceptional results with cutting-edge technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 mb-20">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              feature={feature}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Final CTA */}
        <div 
          className="relative backdrop-blur-sm border rounded-2xl p-8 md:p-12 text-center overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderColor: 'rgba(182, 157, 116, 0.3)',
            boxShadow: '0 15px 35px rgba(31, 40, 57, 0.15)'
          }}
        >
          
          <div className="absolute inset-0">
            <div 
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
              style={{
                background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.3), rgba(182, 157, 116, 0.1))'
              }}
            ></div>
            <div 
              className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-15"
              style={{
                background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.2), rgba(182, 157, 116, 0.05))'
              }}
            ></div>
          </div>
          
          <div className="relative z-10">
            
            <h2 className="text-2xl md:text-3xl font-bold text-[#1f2839] mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed text-gray-700">
              Join legal professionals using Chakshi to streamline workflows and deliver better results.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-register-modal'))}
                  className="flex items-center gap-2 px-8 py-4 text-white font-bold rounded-xl bg-gradient-to-r from-[#b69d74] to-[#d4c4a8] hover:shadow-lg transition-all duration-200 hover:scale-105"
                  aria-label="Start Free Trial - Open Register Modal"
                >
                  Start Free Trial
                </button>
              {/* Schedule Demo removed per request */}
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 text-gray-700">
              {["Credit card required", "Cancel anytime"].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-[#b69d74] rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;