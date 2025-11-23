import React, { useState, useEffect } from 'react';

const RoleGateway = () => {
  const [activeRole, setActiveRole] = useState('advocates');
  const [isVisible, setIsVisible] = useState(false);
  const [animatingFeatures, setAnimatingFeatures] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    setAnimatingFeatures([]);
    const timer = setTimeout(() => {
      setAnimatingFeatures(roleData[activeRole].features.map((_, index) => index));
    }, 300);
    return () => clearTimeout(timer);
  }, [activeRole]);

  const roleData = {
    advocates: {
      title: 'Legal Advocates',
      description: 'Comprehensive legal practice management powered by AI',
      features: [
        'AI-powered contract analysis and comparison',
        'Complete case lifecycle management',
        'Private workspace with secure document storage',
        'Client portal with real-time updates',
        'Alternative legal argument generation',
        'Document risk analysis and summarization',
        'Legal precedent matching system',
        'Time tracking and billing integration'
      ],
      stats: {
        users: '500+',
        satisfaction: '98%',
        timesSaved: '60%'
      },
      useCases: [
        'Analyze contracts in minutes instead of hours',
        'Track all case documents in one secure workspace',
        'Generate alternative legal strategies with AI',
        'Keep clients updated with automated progress reports'
      ],
      image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      testimonials: [
        "Reduced contract review time by 80%",
        "Client satisfaction increased by 45%"
      ]
    },
    clerks: {
      title: 'Legal Clerks',
      description: 'Streamlined court administration and case tracking',
      features: [
        'Daily hearing calendar management',
        'Automated SMS alerts to all parties',
        'Real-time case status monitoring',
        'Document upload and organization',
        'Court schedule coordination',
        'Multi-language support (Hindi/English)',
        'Offline mode for unreliable connectivity',
        'Quick action buttons for common tasks'
      ],
      stats: {
        users: '200+',
        satisfaction: '97%',
        timesSaved: '45%'
      },
      useCases: [
        'Never miss a hearing with automated calendar alerts',
        'Instantly notify all parties about case updates',
        'Organize and track hundreds of case documents',
        'Generate reports with one-click actions'
      ],
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      testimonials: [
        "Reduced scheduling errors by 90%",
        "Saved 15 hours per week on administrative tasks"
      ]
    },
    students: {
      title: 'Law Students',
      description: 'Complete legal education support platform',
      features: [
        'Course progress tracking and analytics',
        'Assignment and exam management',
        'Moot court preparation tools',
        'Legal research methodology guidance',
        'Study material organization',
        'Achievement badges and progress rewards',
        'Collaborative study features',
        'Career guidance and mentorship'
      ],
      stats: {
        users: '1000+',
        satisfaction: '95%',
        timesSaved: '40%'
      },
      useCases: [
        'Track your academic progress across all subjects',
        'Prepare for moot courts with guided practice',
        'Organize study materials and assignments efficiently',
        'Connect with peers and mentors for guidance'
      ],
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      testimonials: [
        "Improved exam scores by 30% on average",
        "85% faster legal research capabilities"
      ]
    }
  };

  const currentRole = roleData[activeRole];

  return (
    <section 
      className="relative py-16 overflow-hidden"
      style={{ 
        backgroundColor: '#f5f5ef',
      }}
      aria-labelledby="role-gateway-heading"
      role="region"
    >
      {/* Enhanced Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/98 to-[#b69d74]/5"></div>
      
      {/* Animated Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : i % 2 === 0 ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'
            }`}
            style={{
              width: `${6 + Math.random() * 12}px`,
              height: `${6 + Math.random() * 12}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: '#b69d74',
              opacity: 0.1 + Math.random() * 0.15,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              transitionDelay: `${i * 100}ms`
            }}
          />
        ))}
      </div>

      {/* Legal Scale Decoration */}
      <div className={`absolute top-10 left-8 opacity-10 transition-all duration-1000 ${
        isVisible ? 'translate-x-0 opacity-10' : '-translate-x-16 opacity-0'
      }`}>
        <svg width="80" height="80" viewBox="0 0 120 120" className="text-[#b69d74]">
          <path 
            d="M60 20 L60 100 M30 60 L90 60 M45 40 L45 80 M75 40 L75 80" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
          />
          <circle cx="60" cy="60" r="4" fill="currentColor" className="animate-ping" />
        </svg>
      </div>

      {/* Gavel Decoration */}
      <div className={`absolute bottom-10 right-12 opacity-10 transition-all duration-1000 delay-300 ${
        isVisible ? 'translate-x-0 opacity-10' : 'translate-x-16 opacity-0'
      }`}>
        <svg width="70" height="70" viewBox="0 0 100 100" className="text-[#b69d74] animate-bounce">
          <rect x="20" y="40" width="60" height="8" rx="4" fill="currentColor" />
          <rect x="45" y="35" width="10" height="18" rx="5" fill="currentColor" />
          <rect x="40" y="60" width="20" height="6" rx="3" fill="currentColor" />
        </svg>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
        }`}>
          <h2 
            id="role-gateway-heading" 
            className="text-4xl md:text-5xl font-bold mb-4 text-[#1f2839] relative"
          >
            How Chakshi Works in Practice
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#b69d74] to-transparent animate-pulse"></div>
          </h2>
          <p className="text-xl text-[#6b7280] max-w-3xl mx-auto leading-relaxed font-medium mb-6">
            Tailored solutions for every legal professional's unique needs
          </p>
          
          {/* Quick Stats Bar */}
          <div className="flex justify-center space-x-12 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#b69d74]">10,000+</div>
              <div className="text-[#6b7280] font-medium">Legal Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#b69d74]">50,000+</div>
              <div className="text-[#6b7280] font-medium">Cases Managed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#10b981]">95%</div>
              <div className="text-[#6b7280] font-medium">Average Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Enhanced Role Navigation */}
        <div className={`flex justify-center mb-12 transition-all duration-700 delay-300 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
        }`}>
          <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl border border-[#b69d74]/20 shadow-2xl overflow-hidden relative p-1">
            <div 
              className="absolute top-1 bottom-1 bg-gradient-to-r from-[#b69d74] to-[#a08965] transition-all duration-500 ease-out shadow-lg rounded-xl"
              style={{
                left: `${Object.keys(roleData).indexOf(activeRole) * (100 / Object.keys(roleData).length)}%`,
                width: `${100 / Object.keys(roleData).length}%`
              }}
            />
            {Object.entries(roleData).map(([key, role]) => (
              <button
                key={key}
                onClick={() => setActiveRole(key)}
                className={`relative z-10 px-8 py-4 font-semibold text-sm transition-all duration-300 whitespace-nowrap transform hover:scale-105 min-w-[160px] rounded-xl ${
                  activeRole === key
                    ? 'text-white shadow-inner'
                    : 'text-[#1f2839] hover:text-[#b69d74] hover:bg-white/50'
                }`}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Main Content Card */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-3xl border border-[#b69d74]/20 shadow-2xl overflow-hidden transition-all duration-500 delay-500 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
        }`}>
          
          <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
            {/* Left Content Section */}
            <div className="p-8 flex flex-col">
              {/* Enhanced Header Section */}
              <div className="bg-gradient-to-br from-[#b69d74] via-[#b69d74] to-[#a08965] text-white p-6 rounded-2xl mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-3 animate-fade-in">{currentRole.title}</h3>
                  <p className="text-lg opacity-95 mb-4 animate-slide-up leading-relaxed">
                    {currentRole.description}
                  </p>
                  
                  {/* Enhanced Stats */}
                  <div className="flex justify-between text-sm">
                    {Object.entries(currentRole.stats).map(([key, value], index) => (
                      <div 
                        key={key} 
                        className={`text-center transition-all duration-500 delay-${index * 100} ${
                          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}
                      >
                        <div className="text-2xl font-bold bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm animate-pulse">
                          {value}
                        </div>
                        <div className="opacity-90 capitalize mt-2 font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Floating Elements */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
              </div>

              {/* Enhanced Content Grid */}
              <div className="grid grid-cols-2 gap-6 flex-1">
                
                {/* Enhanced Features List */}
                <div className={`transition-all duration-700 delay-700 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                }`}>
                  <h4 className="text-xl font-semibold text-[#1f2839] mb-4 flex items-center">
                    <span className="w-2 h-6 bg-[#b69d74] rounded-full mr-3"></span>
                    Key Features
                  </h4>
                  <div className="space-y-3">
                    {currentRole.features.map((feature, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start space-x-3 transition-all duration-500 transform hover:translate-x-1 hover:bg-gradient-to-r from-[#b69d74]/5 to-transparent p-2 rounded-lg border border-transparent hover:border-[#b69d74]/20 ${
                          animatingFeatures.includes(index) ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                        }`}
                        style={{ transitionDelay: `${800 + index * 100}ms` }}
                      >
                        <div className="w-1.5 h-1.5 bg-[#b69d74] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-[#1f2839] leading-relaxed text-sm font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Use Cases & Testimonials */}
                <div className="space-y-6">
                  {/* Use Cases */}
                  <div className={`transition-all duration-700 delay-900 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                  }`}>
                    <h4 className="text-xl font-semibold text-[#1f2839] mb-4 flex items-center">
                      <span className="w-2 h-6 bg-[#b69d74] rounded-full mr-3"></span>
                      Practical Use Cases
                    </h4>
                    <div className="space-y-3">
                      {currentRole.useCases.map((useCase, index) => (
                        <div 
                          key={index} 
                          className={`bg-gradient-to-br from-[#f5f5ef] to-white rounded-lg p-3 border-l-3 border-[#b69d74] shadow-sm transition-all duration-500 transform hover:scale-102 hover:shadow-md cursor-pointer group ${
                            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                          }`}
                          style={{ transitionDelay: `${1000 + index * 150}ms` }}
                        >
                          <p className="text-[#1f2839] leading-relaxed text-sm font-medium group-hover:text-[#1f2839] transition-colors">
                            {useCase}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className={`transition-all duration-700 delay-1100 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                  }`}>
                    <h4 className="text-xl font-semibold text-[#1f2839] mb-4 flex items-center">
                      <span className="w-2 h-6 bg-[#10b981] rounded-full mr-3"></span>
                      User Results
                    </h4>
                    <div className="space-y-2">
                      {currentRole.testimonials.map((testimonial, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-r from-[#b69d74]/10 to-transparent rounded-lg p-3 border border-[#b69d74]/20"
                        >
                          <p className="text-[#1f2839] text-sm font-medium">"{testimonial}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Section */}
              <div className={`mt-6 pt-6 border-t border-[#b69d74]/20 transition-all duration-700 delay-1200 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-[#1f2839] mb-1">Ready to transform your legal practice?</h5>
                    <p className="text-[#6b7280] text-sm">Join thousands of legal professionals already using Chakshi</p>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-[#b69d74] to-[#a08965] text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group flex-shrink-0"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Image Section */}
            <div className={`relative overflow-hidden transition-all duration-700 delay-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}>
              <img
                src={currentRole.image}
                alt="Role visual"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out pointer-events-none"
                style={{
                  transform: isVisible ? 'scale(1)' : 'scale(1.03)',
                  transformOrigin: 'center center',
                  willChange: 'transform, opacity',
                  transitionProperty: 'transform, opacity',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 text-white flex flex-col justify-between">
                {/* Top Badge removed per request */}

                {/* Bottom Content */}
                <div className="space-y-6">
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h4 className="text-2xl font-bold mb-4">Why Choose Chakshi?</h4>
                    <ul className="space-y-3 text-white/90">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#b69d74] rounded-full mr-3"></span>
                        Industry-leading AI technology
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#b69d74] rounded-full mr-3"></span>
                        Secure and compliant platform
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#b69d74] rounded-full mr-3"></span>
                        Continuous updates and improvements
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#b69d74] rounded-full mr-3"></span>
                        24/7 customer support
                      </li>
                    </ul>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center border border-white/30">
                      <div className="text-lg font-bold">99.9%</div>
                      <div className="text-xs opacity-90">Uptime</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center border border-white/30">
                      <div className="text-lg font-bold">256-bit</div>
                      <div className="text-xs opacity-90">Encryption</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center border border-white/30">
                      <div className="text-lg font-bold">24/7</div>
                      <div className="text-xs opacity-90">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features Bar removed as requested */}
      </div>

      {/* Enhanced Custom CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default RoleGateway;