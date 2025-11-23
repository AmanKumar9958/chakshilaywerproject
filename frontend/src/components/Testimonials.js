import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const [flippedCard, setFlippedCard] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Senior Advocate",
      location: "Chennai",
      content: "The auto-drafting engine has cut my document preparation time by 70%. The risk scoring feature is incredibly accurate.",
      detailed: "I've been using Chakshi for 6 months now and it has completely transformed my practice. The document automation saves me hours each week, and the AI-powered risk assessment has helped me avoid several potential issues with contracts. The courtroom simulation feature has also helped me prepare better for cases.",
      rating: 5,
      category: "Legal Professionals",
      avatar: "RK",
      gender: "male",
      company: "Kumar & Associates",
      verified: true,
      experience: "15+ years",
      highlight: "70% time savings",
      gradient: "from-[#b69d74] to-[#b69d74DD]"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Law Student",
      location: "Delhi",
      content: "The courtroom simulation helped me prepare for my moot court competition. I felt confident and well-prepared!",
      detailed: "As a law student, I found the courtroom simulation feature incredibly valuable. It allowed me to practice arguments and get feedback on my presentation skills. The AI judge provided surprisingly accurate assessments of my performance, and the legal research tools have been invaluable for my studies.",
      rating: 5,
      category: "Students & Education",
      avatar: "PS",
      gender: "female",
      company: "National Law University",
      verified: true,
      experience: "3rd Year Student",
      highlight: "Moot court success",
      gradient: "from-[#b69d74] to-[#b69d74CC]"
    },
    {
      id: 3,
      name: "Vikram Mehta",
      role: "Business Owner",
      location: "Mumbai",
      content: "As someone without legal background, Chakshi helped me understand and create contracts that protect my business interests.",
      detailed: "Running a small business means I need to handle legal documents but can't afford a full-time lawyer. Chakshi's guided contract creation and plain-English explanations have been invaluable. The templates are comprehensive and easy to customize, saving me thousands in legal fees.",
      rating: 5,
      category: "Business Owners",
      avatar: "VM",
      gender: "male",
      company: "Mehta Enterprises",
      verified: true,
      experience: "10+ years in business",
      highlight: "Thousands saved",
      gradient: "from-[#b69d74] to-[#b69d74BB]"
    },
    {
      id: 4,
      name: "Anjali Singh",
      role: "Corporate Lawyer",
      location: "Bangalore",
      content: "The compliance tracking system has saved our firm countless hours of manual work and improved our accuracy significantly.",
      detailed: "Managing compliance across multiple jurisdictions was always a challenge until we implemented Chakshi. The automated tracking and alert system ensures we never miss important deadlines, and the reporting features make audits a breeze. Our client satisfaction has increased dramatically.",
      rating: 5,
      category: "Legal Professionals",
      avatar: "AS",
      gender: "female",
      company: "Singh Legal Associates",
      verified: true,
      experience: "12+ years",
      highlight: "Multi-jurisdiction compliance",
      gradient: "from-[#b69d74] to-[#b69d74AA]"
    },
    {
      id: 5,
      name: "Rahul Kapoor",
      role: "Startup Founder",
      location: "Hyderabad",
      content: "Perfect for startups that need legal protection but have limited resources. Exceptional value for money.",
      detailed: "As a first-time entrepreneur, navigating legal requirements was daunting. Chakshi's intuitive interface and comprehensive templates helped us set up proper contracts, privacy policies, and terms of service without breaking the bank. The AI guidance made complex legal concepts accessible.",
      rating: 4,
      category: "Business Owners",
      avatar: "RK",
      gender: "male",
      company: "TechStart Solutions",
      verified: true,
      experience: "Entrepreneur",
      highlight: "Startup-friendly",
      gradient: "from-[#b69d74] to-[#b69d7499]"
    },
    {
      id: 6,
      name: "Dr. Meena Iyer",
      role: "Legal Professor",
      location: "Kolkata",
      content: "An excellent teaching tool that brings real-world legal scenarios into the classroom with remarkable accuracy.",
      detailed: "I've incorporated Chakshi into my curriculum, and the results have been outstanding. Students gain practical experience with document drafting, case analysis, and courtroom procedures that would otherwise be difficult to simulate. The platform bridges the gap between theory and practice perfectly.",
      rating: 5,
      category: "Students & Education",
      avatar: "MI",
      gender: "female",
      company: "West Bengal National University",
      verified: true,
      experience: "20+ years teaching",
      highlight: "Curriculum integration",
      gradient: "from-[#b69d74] to-[#b69d7488]"
    }
  ];

  const categories = [
    { id: 'All', name: 'All Reviews', count: testimonials.length },
    { id: 'Legal Professionals', name: 'Legal Professionals', count: testimonials.filter(t => t.category === 'Legal Professionals').length },
    { id: 'Business Owners', name: 'Business Owners', count: testimonials.filter(t => t.category === 'Business Owners').length },
    { id: 'Students & Education', name: 'Students & Education', count: testimonials.filter(t => t.category === 'Students & Education').length }
  ];

  // Filter testimonials based on active category
  const filteredTestimonials = activeCategory === 'All' 
    ? testimonials 
    : testimonials.filter(testimonial => testimonial.category === activeCategory);

  // Auto-rotation for featured testimonial
  useEffect(() => {
    let interval;
    if (isAutoPlaying && filteredTestimonials.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % filteredTestimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredTestimonials.length]);

  const handleCardClick = (id) => {
    if (flippedCard === id) {
      setFlippedCard(null);
    } else {
      setFlippedCard(id);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setFlippedCard(null);
    setCurrentSlide(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const averageRating = (filteredTestimonials.reduce((sum, t) => sum + t.rating, 0) / filteredTestimonials.length).toFixed(1);
  
  const featuredTestimonial = filteredTestimonials[currentSlide];

  // Gender icon component
  const GenderIcon = ({ gender, className = "w-4 h-4" }) => {
    if (gender === 'male') {
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      );
    } else if (gender === 'female') {
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  // Star rating component
  const StarRating = ({ rating, size = "text-sm" }) => {
    return (
      <div className={`flex gap-0.5 ${size} text-[#b69d74]`}>
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < rating ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };

  return (
    <section 
      id="testimonials" 
      className="relative min-h-screen text-[#1f2839] overflow-hidden"
      style={{ 
        backgroundColor: '#f5f5ef',
        backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Background Elements */}
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
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#b69d74] to-[#b69d74DD] border border-[#b69d7460] rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
            <span className="text-white font-bold text-sm md:text-xl">★</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1f2839] mb-4">
            Trusted by Legal Professionals
          </h2>
          <p className="text-lg md:text-xl text-[#6b7280] max-w-3xl mx-auto mb-6 md:mb-8 px-4">
            See what our users are saying about their experience with Chakshi Legal AI Suite. 
            Real stories from real professionals who've transformed their practice.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12 px-4">
            <div 
              className="text-center p-4 md:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(182, 157, 116, 0.3)',
                boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
              }}
            >
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1f2839] mb-1">{averageRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                <StarRating rating={5} />
              </div>
              <div className="text-xs md:text-sm text-[#6b7280]">Average Rating</div>
            </div>
            <div 
              className="text-center p-4 md:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(182, 157, 116, 0.3)',
                boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
              }}
            >
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1f2839] mb-1">500+</div>
              <div className="text-xs md:text-sm text-[#6b7280]">Happy Users</div>
            </div>
            <div 
              className="text-center p-4 md:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(182, 157, 116, 0.3)',
                boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
              }}
            >
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1f2839] mb-1">98%</div>
              <div className="text-xs md:text-sm text-[#6b7280]">Satisfaction Rate</div>
            </div>
            <div 
              className="text-center p-4 md:p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(182, 157, 116, 0.3)',
                boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
              }}
            >
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1f2839] mb-1">24/7</div>
              <div className="text-xs md:text-sm text-[#6b7280]">Support Available</div>
            </div>
          </div>
        </div>

        {/* Featured Testimonial */}
        <div className="mb-12 md:mb-16 relative max-w-4xl mx-auto px-4">
          {featuredTestimonial && (
            <div 
              className="p-6 md:p-8 rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(182, 157, 116, 0.3)',
                boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(182, 157, 116, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(31, 40, 57, 0.12)';
              }}
            >
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#b69d74] to-[#b69d74DD] rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-2xl flex-shrink-0 shadow-lg relative">
                    {featuredTestimonial.avatar}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-[#b69d7440]">
                      <GenderIcon gender={featuredTestimonial.gender} className="w-3 h-3 text-[#b69d74]" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-[#1f2839]">{featuredTestimonial.name}</h3>
                      <p className="text-sm text-[#6b7280]">{featuredTestimonial.role} • {featuredTestimonial.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={featuredTestimonial.rating} />
                      <span className="text-sm text-[#6b7280]">({featuredTestimonial.rating}/5)</span>
                    </div>
                  </div>
                  
                  <p className="text-base text-[#6b7280] mb-4 italic">"{featuredTestimonial.content}"</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] text-white rounded-lg font-medium">
                      {featuredTestimonial.highlight}
                    </span>
                    {featuredTestimonial.verified && (
                      <div className="flex items-center gap-1 text-xs text-[#b69d74] font-medium">
                        ✓ VERIFIED USER
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-[#6b7280]">{featuredTestimonial.detailed.substring(0, 120)}...</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Carousel Controls */}
          <div className="flex items-center justify-center mt-6 gap-2 md:gap-4 flex-wrap">
            <button 
              onClick={prevSlide}
              className="px-3 py-2 md:px-4 md:py-2 flex items-center justify-center rounded-lg border text-[#1f2839] transition-all duration-300 text-sm hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(182, 157, 116, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                e.currentTarget.style.color = '#b69d74';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                e.currentTarget.style.color = '#1f2839';
              }}
            >
              ← Previous
            </button>
            
            <button 
              onClick={toggleAutoPlay}
              className="px-3 py-2 md:px-4 md:py-2 flex items-center justify-center rounded-lg border text-[#1f2839] transition-all duration-300 text-sm hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(182, 157, 116, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                e.currentTarget.style.color = '#b69d74';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                e.currentTarget.style.color = '#1f2839';
              }}
            >
              {isAutoPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            
            <button 
              onClick={nextSlide}
              className="px-3 py-2 md:px-4 md:py-2 flex items-center justify-center rounded-lg border text-[#1f2839] transition-all duration-300 text-sm hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(182, 157, 116, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                e.currentTarget.style.color = '#b69d74';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                e.currentTarget.style.color = '#1f2839';
              }}
            >
              Next →
            </button>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-[#b69d74] w-6' : 'bg-[#b69d7440]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center mb-8 md:mb-12 px-4">
          <div 
            className="flex flex-wrap items-center gap-2 md:gap-3 p-2 rounded-xl border max-w-full overflow-x-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.80)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(182, 157, 116, 0.3)'
            }}
          >
            {categories.map((category) => {
              return (
                <button
                  key={category.id}
                  className={`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 rounded-lg transition-all duration-300 text-xs md:text-sm whitespace-nowrap ${
                    activeCategory === category.id 
                      ? 'bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] text-white' 
                      : 'text-[#6b7280] hover:text-[#b69d74] hover:bg-white/60'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="font-medium">{category.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-lg font-semibold ${
                    activeCategory === category.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[#b69d7410] text-[#6b7280] border border-[#b69d7440]'
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16 px-4">
          {filteredTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={`relative group cursor-pointer transition-all duration-500 h-80 md:h-96 ${
                flippedCard === testimonial.id ? '[transform:rotateY(180deg)]' : ''
              }`}
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              onClick={() => handleCardClick(testimonial.id)}
            >
              {/* Card Front */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                <div 
                  className="h-full p-4 md:p-6 rounded-xl border transition-all duration-300 flex flex-col hover:shadow-xl hover:-translate-y-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.80)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(182, 157, 116, 0.3)',
                    boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
                    e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(182, 157, 116, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                    e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(31, 40, 57, 0.12)';
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#b69d74] to-[#b69d74DD] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-[#b69d7440]">
                        <GenderIcon gender={testimonial.gender} className="w-2.5 h-2.5 text-[#b69d74]" />
                      </div>
                    </div>
                    <StarRating rating={testimonial.rating} />
                  </div>
                  
                  <p className="text-sm md:text-base text-[#6b7280] mb-4 md:mb-6 leading-relaxed flex-grow line-clamp-4">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="text-xs md:text-sm font-medium text-[#1f2839]">
                      {testimonial.rating}/5 Rating
                    </div>
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 text-xs text-[#b69d74] font-medium">
                        ✓ VERIFIED
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-[#b69d7440] pt-3 md:pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm md:text-base font-semibold text-[#1f2839]">{testimonial.name}</h4>
                        <p className="text-xs text-[#6b7280]">{testimonial.role}</p>
                        <p className="text-xs text-[#9CA3AF]">{testimonial.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#6b7280] font-medium">{testimonial.company}</p>
                        <p className="text-xs text-[#9CA3AF]">{testimonial.experience}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 md:mt-4 flex items-center justify-center text-xs text-[#6b7280] hover:text-[#b69d74] transition-colors duration-300">
                    Click for detailed review →
                  </div>
                </div>
              </div>
              
              {/* Card Back */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto">
                <div 
                  className="h-full p-4 md:p-6 rounded-xl border transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.80)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(182, 157, 116, 0.3)',
                    boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#b69d74] to-[#b69d74DD] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-[#b69d7440]">
                        <GenderIcon gender={testimonial.gender} className="w-2.5 h-2.5 text-[#b69d74]" />
                      </div>
                    </div>
                    <button 
                      className="px-2 py-1 md:px-3 md:py-1 flex items-center justify-center bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] text-white rounded-lg text-xs hover:shadow-lg transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlippedCard(null);
                      }}
                    >
                      ← Back
                    </button>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-semibold text-[#1f2839] mb-3">Detailed Experience</h3>
                  <p className="text-xs md:text-sm text-[#6b7280] mb-4 md:mb-6 leading-relaxed">
                    {testimonial.detailed}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <StarRating rating={testimonial.rating} />
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#b69d74] to-[#b69d74DD] text-white rounded-lg font-medium">
                      {testimonial.category}
                    </span>
                  </div>
                  
                  <div className="border-t border-[#b69d7440] pt-3 md:pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1f2839]">{testimonial.name}</h4>
                        <p className="text-xs text-[#6b7280]">{testimonial.role}</p>
                      </div>
                      {testimonial.verified && (
                        <div className="text-xs text-[#b69d74] bg-[#b69d7410] border border-[#b69d7440] px-2 py-1 rounded-lg font-medium">
                          ✓ VERIFIED
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section and Brand Footer removed as requested */}
      </div>
    </section>
  );
};

export default Testimonials;