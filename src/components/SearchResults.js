import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ExternalLink, FileText, Users, Zap, Shield } from 'lucide-react';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
    
    // Simulate search results
    setTimeout(() => {
      const mockResults = generateSearchResults(searchQuery);
      setResults(mockResults);
      setIsLoading(false);
    }, 800);
  }, [location.search]);

  const generateSearchResults = (searchQuery) => {
    const allResults = [
      {
        title: "AI-Powered Contract Analysis",
        description: "Intelligent contract review with risk assessment, clause extraction, and compliance checking.",
        type: "Feature",
        section: "features",
        relevance: 95,
        icon: FileText
      },
      {
        title: "Legal Research Engine", 
        description: "Advanced AI research tool with access to millions of cases, statutes, and legal documents.",
        type: "Feature",
        section: "features", 
        relevance: 92,
        icon: Search
      },
      {
        title: "Document Automation",
        description: "Smart templates and automated document generation for legal professionals.",
        type: "Feature",
        section: "features",
        relevance: 88,
        icon: Zap
      },
      {
        title: "Enterprise Security",
        description: "Bank-grade security with end-to-end encryption and compliance standards.",
        type: "Feature", 
        section: "features",
        relevance: 85,
        icon: Shield
      },
      {
        title: "Customer Testimonials",
        description: "See what legal professionals are saying about Chakshi's AI platform.",
        type: "Section",
        section: "testimonials",
        relevance: 80,
        icon: Users
      },
      {
        title: "Pricing Plans",
        description: "Flexible pricing options for solo practitioners, firms, and enterprises.",
        type: "Section", 
        section: "pricing",
        relevance: 75,
        icon: FileText
      }
    ];

    if (!searchQuery.trim()) return allResults;

    return allResults
      .filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.relevance - a.relevance);
  };

  const handleResultClick = (result) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(result.section);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 300);
  };

  const colors = {
    primary: '#b69d74',
    neutral: {
      50: '#f5f5ef',
      100: '#f0f0ea', 
      800: '#1f2839',
      700: '#333330',
      600: '#4a4a44',
      500: '#6d6d67'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">
            {query ? `Results for "${query}"` : 'All available content'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <>
            <div className="mb-6 text-sm text-gray-500">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            
            <div className="space-y-4">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <div 
                    key={index}
                    onClick={() => handleResultClick(result)}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="p-3 rounded-xl flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}20` }}
                      >
                        <result.icon 
                          className="w-6 h-6" 
                          style={{ color: colors.primary }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {result.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span 
                              className="text-xs font-semibold px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary
                              }}
                            >
                              {result.type}
                            </span>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed mb-3">
                          {result.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Relevance: {result.relevance}%</span>
                          <span>•</span>
                          <span>Go to {result.section}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-6">
                    Try searching for features, pricing, or testimonials
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <span>Explore Platform</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;