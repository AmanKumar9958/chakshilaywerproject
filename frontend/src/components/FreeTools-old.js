import React, { useState, useEffect } from "react";

const FreeTools = () => {
  const freeTools = [
    {
      id: 1,
      title: "RTI Application Generator",
      label: "Information Rights",
      description: "Create comprehensive Right to Information applications with automated legal formatting and government compliance checks.",
      category: "Government",
      isNew: false,
      isFeatured: true,
      popularity: 95,
      timeEstimate: "8-12 min",
      uses: 15680,
      difficulty: "Beginner",
      successRate: 98,
      rating: 4.9,
      lastUpdated: "2024-09-15",
      premium: false,
      tags: ["Information", "Government", "Transparency", "RTI"],
      features: [
        "Auto-fill government details",
        "Legal compliance verification",
        "Multiple format exports",
        "Application tracking support"
      ]
    },
    {
      id: 2,
      title: "Police Complaint Builder",
      label: "Crime Reporting",
      description: "Generate legally sound police complaints with proper formatting, evidence attachment guidelines, and follow-up procedures.",
      category: "Criminal",
      isNew: true,
      isFeatured: false,
      popularity: 89,
      timeEstimate: "12-18 min",
      uses: 12340,
      difficulty: "Intermediate",
      successRate: 94,
      rating: 4.7,
      lastUpdated: "2024-09-20",
      premium: false,
      tags: ["Crime", "Police", "Complaint", "Evidence"],
      features: [
        "Evidence checklist included",
        "Station locator integration",
        "Legal procedure guidance",
        "Progress tracking system"
      ]
    },
    {
      id: 3,
      title: "Consumer Court Assistant",
      label: "Consumer Rights",
      description: "Draft comprehensive consumer complaints with automated damage calculations, legal precedent references, and court filing guidance.",
      category: "Consumer",
      isNew: false,
      isFeatured: true,
      popularity: 93,
      timeEstimate: "15-25 min",
      uses: 18920,
      difficulty: "Intermediate",
      successRate: 96,
      rating: 4.8,
      lastUpdated: "2024-09-10",
      premium: false,
      tags: ["Consumer Rights", "Products", "Services", "Redressal"],
      features: [
        "Damage calculator built-in",
        "Legal precedent database",
        "Court fee calculator",
        "Filing procedure guide"
      ]
    },
    {
      id: 4,
      title: "Smart Rental Agreement",
      label: "Property Law",
      description: "Create legally compliant rental agreements with city-specific clauses, automatic rent calculations, and tenant protection features.",
      category: "Property",
      isNew: false,
      isFeatured: true,
      popularity: 97,
      timeEstimate: "20-30 min",
      uses: 28760,
      difficulty: "Advanced",
      successRate: 99,
      rating: 4.9,
      lastUpdated: "2024-09-18",
      premium: false,
      tags: ["Property", "Rental", "Agreement", "Tenancy"],
      features: [
        "City-specific legal clauses",
        "Rent escalation calculator",
        "Security deposit tracker",
        "Digital signature support"
      ]
    },
    {
      id: 5,
      title: "Will & Testament Creator",
      label: "Estate Planning",
      description: "Design comprehensive wills with asset distribution planning, executor guidelines, and legal validity verification across states.",
      category: "Personal",
      isNew: true,
      isFeatured: false,
      popularity: 86,
      timeEstimate: "25-40 min",
      uses: 9840,
      difficulty: "Advanced",
      successRate: 97,
      rating: 4.6,
      lastUpdated: "2024-09-22",
      premium: true,
      tags: ["Will", "Assets", "Testament", "Inheritance"],
      features: [
        "Asset valuation guide",
        "State law compliance",
        "Executor responsibilities",
        "Legal witness requirements"
      ]
    },
    {
      id: 6,
      title: "Legal Notice Generator",
      label: "Legal Notices",
      description: "Draft formal legal notices with appropriate legal language, response timelines, and escalation procedures for various situations.",
      category: "Civil",
      isNew: false,
      isFeatured: false,
      popularity: 91,
      timeEstimate: "10-20 min",
      uses: 16420,
      difficulty: "Intermediate",
      successRate: 95,
      rating: 4.7,
      lastUpdated: "2024-09-12",
      premium: false,
      tags: ["Notice", "Legal", "Court", "Civil"],
      features: [
        "Multiple notice types",
        "Timeline calculators",
        "Legal language database",
        "Delivery proof guidance"
      ]
    },
    {
      id: 7,
      title: "FIR Copy Application",
      label: "Police Records",
      description: "Generate applications for certified FIR copies with proper documentation requirements and police station procedures.",
      category: "Criminal",
      isNew: false,
      isFeatured: false,
      popularity: 84,
      timeEstimate: "5-10 min",
      uses: 11250,
      difficulty: "Beginner",
      successRate: 99,
      rating: 4.8,
      lastUpdated: "2024-09-08",
      premium: false,
      tags: ["FIR", "Police", "Copy", "Documentation"],
      features: [
        "Station contact details",
        "Required documents list",
        "Fee calculation guide",
        "Processing timeline"
      ]
    },
    {
      id: 8,
      title: "Property Due Diligence Kit",
      label: "Property Verification",
      description: "Comprehensive property verification toolkit with document checklists, legal compliance checks, and investment risk assessment.",
      category: "Property",
      isNew: true,
      isFeatured: true,
      popularity: 90,
      timeEstimate: "30-45 min",
      uses: 14870,
      difficulty: "Advanced",
      successRate: 93,
      rating: 4.8,
      lastUpdated: "2024-09-21",
      premium: true,
      tags: ["Property", "Verification", "Documents", "Investment"],
      features: [
        "Document verification matrix",
        "Legal compliance scanner",
        "Risk assessment calculator",
        "Investment analysis tools"
      ]
    },
    {
      id: 9,
      title: "Employment Contract Builder",
      label: "Employment Law",
      description: "Create comprehensive employment contracts with role-specific clauses, compliance checks, and industry standard terms.",
      category: "Corporate",
      isNew: true,
      isFeatured: false,
      popularity: 88,
      timeEstimate: "15-25 min",
      uses: 7340,
      difficulty: "Intermediate",
      successRate: 96,
      rating: 4.7,
      lastUpdated: "2024-09-19",
      premium: false,
      tags: ["Employment", "Contract", "HR", "Compliance"],
      features: [
        "Role-based templates",
        "Salary structure guide",
        "Compliance verification",
        "Digital signature ready"
      ]
    },
    {
      id: 10,
      title: "Startup Legal Essentials",
      label: "Business Formation",
      description: "Complete legal documentation package for startups including incorporation papers, founder agreements, and compliance guides.",
      category: "Corporate",
      isNew: false,
      isFeatured: true,
      popularity: 92,
      timeEstimate: "45-60 min",
      uses: 5670,
      difficulty: "Advanced",
      successRate: 94,
      rating: 4.9,
      lastUpdated: "2024-09-17",
      premium: true,
      tags: ["Startup", "Incorporation", "Founders", "Compliance"],
      features: [
        "Complete incorporation kit",
        "Founder equity calculator",
        "Compliance calendar",
        "Investor agreement templates"
      ]
    }
  ];

  const categories = [
    "All", 
    "Government", 
    "Criminal", 
    "Consumer", 
    "Property", 
    "Personal", 
    "Civil", 
    "Corporate"
  ];
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedTool, setSelectedTool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [bookmarkedTools, setBookmarkedTools] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    difficulty: [],
    rating: null,
    featured: false
  });

  // Filter tools based on category, search query, and additional filters
  const filteredTools = freeTools
    .filter(tool => {
      // Category filter
      const categoryMatch = selectedCategory === "All" || tool.category === selectedCategory;
      
      // Search filter
      const searchMatch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Free/Premium filter
      const freeMatch = !showOnlyFree || !tool.premium;
      
      // Difficulty filter
      const difficultyMatch = activeFilters.difficulty.length === 0 || 
        activeFilters.difficulty.includes(tool.difficulty);
      
      // Rating filter
      const ratingMatch = !activeFilters.rating || tool.rating >= activeFilters.rating;
      
      // Featured filter
      const featuredMatch = !activeFilters.featured || tool.isFeatured;
      
      return categoryMatch && searchMatch && freeMatch && difficultyMatch && ratingMatch && featuredMatch;
    })
    .sort((a, b) => {
      if (sortBy === "popularity") return b.popularity - a.popularity;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "uses") return b.uses - a.uses;
      if (sortBy === "success") return b.successRate - a.successRate;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      return 0;
    });

  const openToolDetails = (tool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const toggleBookmark = (toolId) => {
    setBookmarkedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setShowOnlyFree(false);
    setActiveFilters({
      difficulty: [],
      rating: null,
      featured: false
    });
    setSortBy("default");
  };

  const toggleDifficultyFilter = (difficulty) => {
    setActiveFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty]
    }));
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Government': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Criminal': return 'bg-red-100 text-red-700 border-red-200';
      case 'Consumer': return 'bg-green-100 text-green-700 border-green-200';
      case 'Property': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Personal': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Civil': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Corporate': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-400'
            }`}
          >
            ⭐
          </span>
        ))}
        <span className="text-xs text-gray-200 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">
      
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-white/5 rounded-full filter blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/3 rounded-full filter blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/4 rounded-full filter blur-xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Legal Document
            <span className="block text-blue-200"> Templates</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
            Transform your legal document creation with our AI-powered template library. 
            Professional-grade documents in minutes, not hours.
          </p>
          
          {/* Enhanced Stats */}
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{freeTools.length}+</div>
              <div className="text-sm font-medium text-blue-200">Professional Templates</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-sm font-medium text-blue-200">Success Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">75K+</div>
              <div className="text-sm font-medium text-blue-200">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">15min</div>
              <div className="text-sm font-medium text-blue-200">Avg. Completion</div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8 shadow-xl border border-white/30">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search templates, categories, or keywords..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-12 pr-12 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all duration-300 bg-white/20 backdrop-blur-sm text-white placeholder-gray-300"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors duration-200"
                    onClick={() => setSearchQuery("")}
                  >
                    <span className="text-gray-300">✕</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Enhanced Controls */}
            <div className="flex items-center gap-4">
              
              {/* View Toggle */}
              <div className="flex bg-white/20 rounded-xl p-1 shadow-inner">{/* Grid/List View Icons */}
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" 
                      ? 'bg-white/30 text-white shadow-sm' 
                      : 'text-gray-300 hover:text-white hover:bg-white/20'
                  }`}
                  title="Grid View"
                >
                  <span>⊞</span>
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? 'bg-white/30 text-white shadow-sm' 
                      : 'text-gray-300 hover:text-white hover:bg-white/20'
                  }`}
                  title="List View"
                >
                  <span>☰</span>
                </button>
              </div>
                </div>
              
              {/* Sort Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              >
                <option value="default" className="text-gray-800">Default Order</option>
                <option value="popularity" className="text-gray-800">Most Popular</option>
                <option value="name" className="text-gray-800">Alphabetical</option>
                <option value="uses" className="text-gray-800">Most Used</option>
                <option value="rating" className="text-gray-800">Highest Rated</option>
                <option value="newest" className="text-gray-800">Recently Updated</option>
              </select>
              
              {/* Clear Filters */}
              <button 
                onClick={clearAllFilters}
                className="px-6 py-3 bg-white/20 text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
              >
                <span>🗑️</span>
                Clear All
              </button>
            </div>
          </div>
        </div>
              </div>
              
              {/* Sort */}
              <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-700 font-medium"
                >
                  <option value="default">Default Order</option>
                  <option value="popularity">Most Popular</option>
                  <option value="name">Alphabetical</option>
                  <option value="uses">Most Used</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Recently Updated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowOnlyFree(!showOnlyFree)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  showOnlyFree 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                    : 'bg-white/80 text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                <Lock className="w-4 h-4" />
                Free Only
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-800">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const categoryCount = category === 'All' 
                ? freeTools.length 
                : freeTools.filter(tool => tool.category === category).length;
              
              return (
                <button
                  key={category}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg shadow-blue-500/25' 
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 shadow-sm'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="font-medium">{category}</span>
                  <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                    selectedCategory === category 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {categoryCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/30">
          <div className="flex flex-wrap items-center gap-6">
            
            {/* Difficulty Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Difficulty:</span>
              <div className="flex gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => toggleDifficultyFilter(difficulty)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      activeFilters.difficulty.includes(difficulty)
                        ? getDifficultyColor(difficulty).replace('bg-', 'bg-').replace('text-', 'text-')
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Rating Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Min Rating:</span>
              <select
                value={activeFilters.rating || ''}
                onChange={(e) => setActiveFilters(prev => ({
                  ...prev,
                  rating: e.target.value ? parseFloat(e.target.value) : null
                }))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white/80 backdrop-blur-sm"
              >
                <option value="">Any</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
            
            {/* Featured Filter */}
            <button
              onClick={() => setActiveFilters(prev => ({
                ...prev,
                featured: !prev.featured
              }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                activeFilters.featured
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Star className="w-4 h-4" />
              Featured Only
            </button>
            
            {/* Clear Filters */}
            {(searchQuery || selectedCategory !== 'All' || showOnlyFree || 
              activeFilters.difficulty.length > 0 || activeFilters.rating || activeFilters.featured) && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Results Info */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-lg font-medium text-gray-800">
              Showing <span className="text-blue-600 font-bold">{filteredTools.length}</span> of{' '}
              <span className="font-bold">{freeTools.length}</span> templates
              {selectedCategory !== 'All' && (
                <span className="text-gray-600"> in {selectedCategory}</span>
              )}
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-1">
                Results for "<span className="font-medium text-gray-800">{searchQuery}</span>"
              </p>
            )}
          </div>
          
          {filteredTools.length > 0 && (
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Avg: 15-25 min</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>98% Success Rate</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Tools Grid/List */}
        {filteredTools.length > 0 ? (
          <div className={`grid gap-8 mb-16 ${
            viewMode === 'grid' ? 'lg:grid-cols-3 md:grid-cols-2' : 'grid-cols-1'
          }`}>
            {filteredTools.map(tool => {
              const IconComponent = tool.icon;
              const isBookmarked = bookmarkedTools.includes(tool.id);
              
              return (
                <div 
                  key={tool.id} 
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 ${
                    viewMode === 'list' ? 'flex items-center gap-8' : ''
                  }`}
                  onClick={() => openToolDetails(tool)}
                >
                  <div className={`relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/30 ${
                    tool.isFeatured ? 'ring-2 ring-yellow-400/50' : ''
                  } ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {tool.isNew && (
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          NEW
                        </div>
                      )}
                      {tool.isFeatured && (
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          FEATURED
                        </div>
                      )}
                      {tool.premium && (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          PRO
                        </div>
                      )}
                    </div>
                    
                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(tool.id);
                      }}
                      className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isBookmarked 
                          ? 'bg-red-500 text-white shadow-lg scale-110' 
                          : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    
                    <div className={`${viewMode === 'list' ? 'flex items-start gap-6' : ''}`}>
                      {/* Icon */}
                      <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-6'}`}>
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <IconComponent className="w-10 h-10 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                            {tool.title}
                          </h3>
                        </div>
                        
                        {/* Rating and Stats */}
                        <div className="flex items-center justify-between mb-4">
                          {renderStarRating(tool.rating)}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>{tool.uses.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                          {tool.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${getCategoryColor(tool.category)}`}>
                            {tool.category}
                          </span>
                          <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${getDifficultyColor(tool.difficulty)}`}>
                            {tool.difficulty}
                          </span>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{tool.timeEstimate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>{tool.successRate}%</span>
                            </div>
                          </div>
                          
                          <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
                            {tool.premium ? (
                              <>
                                <Lock className="w-4 h-4" />
                                Upgrade
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4" />
                                Use Template
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No templates found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any templates matching your criteria. Try adjusting your search terms or filters.
            </p>
            <button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Enhanced CTA Section */}
        <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Need Custom Legal
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Solutions?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered document generator creates personalized legal documents tailored to your 
              specific requirements. Get professional-grade documents with expert guidance in minutes.
            </p>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-10 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Settings className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">AI Customization</h3>
                <p className="text-blue-100 text-sm">Tailored documents based on your specific needs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Legal Compliance</h3>
                <p className="text-blue-100 text-sm">Guaranteed compliance with current regulations</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
                <p className="text-blue-100 text-sm">24/7 assistance from legal professionals</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/25 flex items-center gap-3">
                <Zap className="w-6 h-6" />
                Try AI Generator
                <ArrowRight className="w-6 h-6" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 hover:border-white/50 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3">
                <Download className="w-6 h-6" />
                Download All Templates
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && selectedTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 pro-flex items-center justify-center pro-p-4">
          <div className="bg-white pro-rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative pro-p-6 border-b border-gray-200">
              <button 
                className="absolute top-6 right-6 w-8 h-8 pro-flex-center hover:bg-gray-100 pro-rounded-lg transition-colors duration-200"
                onClick={closeModal}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              
              <div className="pro-flex items-start pro-gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 pro-rounded-xl pro-flex-center flex-shrink-0">
                  <selectedTool.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="pro-flex items-center pro-gap-3 mb-2">
                    <h2 className="pro-heading-xl text-gray-900">{selectedTool.title}</h2>
                    {selectedTool.isNew && (
                      <span className="bg-green-500 text-white pro-text-xs px-2 py-1 pro-rounded-lg font-semibold">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="pro-flex items-center pro-gap-3">
                    <span className={`pro-text-sm px-3 py-1 pro-rounded-lg border font-medium ${getCategoryColor(selectedTool.category)}`}>
                      {selectedTool.category}
                    </span>
                    <span className={`pro-text-sm px-3 py-1 pro-rounded-lg font-medium ${getDifficultyColor(selectedTool.difficulty)}`}>
                      {selectedTool.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pro-p-6">
              <p className="pro-text-body text-gray-700 mb-6 leading-relaxed">
                {selectedTool.description}
              </p>
              
              {/* Stats */}
              <div className="pro-grid md:grid-cols-4 pro-gap-4 mb-6">
                <div className="text-center pro-p-4 bg-blue-50 pro-rounded-lg">
                  <div className="pro-heading-lg font-bold text-blue-600">{selectedTool.popularity}%</div>
                  <div className="pro-text-sm text-blue-700">Popularity</div>
                </div>
                <div className="text-center pro-p-4 bg-green-50 pro-rounded-lg">
                  <div className="pro-heading-lg font-bold text-green-600">{selectedTool.successRate}%</div>
                  <div className="pro-text-sm text-green-700">Success Rate</div>
                </div>
                <div className="text-center pro-p-4 bg-purple-50 pro-rounded-lg">
                  <div className="pro-heading-lg font-bold text-purple-600">{selectedTool.uses.toLocaleString()}</div>
                  <div className="pro-text-sm text-purple-700">Times Used</div>
                </div>
                <div className="text-center pro-p-4 bg-orange-50 pro-rounded-lg">
                  <div className="pro-heading-lg font-bold text-orange-600">{selectedTool.timeEstimate}</div>
                  <div className="pro-text-sm text-orange-700">Completion</div>
                </div>
              </div>
              
              {/* Features */}
              <div className="mb-6">
                <h3 className="pro-heading-md text-gray-900 mb-4 pro-flex items-center pro-gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  What You'll Get
                </h3>
                <div className="pro-grid md:grid-cols-2 pro-gap-3">
                  {[
                    "Customizable template tailored to your needs",
                    "Step-by-step guidance through the process", 
                    "Legal tips and best practices included",
                    "Multiple export formats (PDF, Word, etc.)",
                    "Professional legal formatting",
                    "Compliance with current regulations"
                  ].map((feature, index) => (
                    <div key={index} className="pro-flex items-center pro-gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="pro-text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tags */}
              <div className="mb-6">
                <h4 className="pro-text-sm font-semibold text-gray-900 mb-3">Related Keywords:</h4>
                <div className="pro-flex flex-wrap pro-gap-2">
                  {selectedTool.tags.map((tag, index) => (
                    <span key={index} className="pro-text-xs px-3 py-1 bg-gray-100 text-gray-700 pro-rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pro-p-6 border-t border-gray-200 pro-flex items-center pro-gap-4">
              <button className="pro-btn pro-btn-ghost pro-flex items-center pro-gap-2">
                <Bookmark className="w-4 h-4" />
                Save for Later
              </button>
              <button className="pro-btn pro-btn-primary flex-1">
                Use This Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FreeTools;