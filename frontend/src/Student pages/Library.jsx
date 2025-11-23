import React, { useState } from 'react';
import { FiBook, FiDownload, FiBookmark, FiSearch, FiFilter, FiX } from 'react-icons/fi';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [savedResources, setSavedResources] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [resources] = useState([
    {
      id: 1,
      title: 'Introduction to Civil Law',
      type: 'Book',
      author: 'Robert Smith',
      year: 2024,
      format: 'PDF',
      category: 'Civil Law',
      pages: 320,
      rating: 4.8,
      description: 'Comprehensive guide to civil law principles and procedures'
    },
    {
      id: 2,
      title: 'Criminal Procedure Guide',
      type: 'Document',
      author: 'Jennifer Davis',
      year: 2025,
      format: 'PDF',
      category: 'Criminal Law',
      pages: 180,
      rating: 4.6,
      description: 'Step-by-step criminal procedure handbook for practitioners'
    },
    {
      id: 3,
      title: 'Legal Research Methods',
      type: 'Course Material',
      author: 'Prof. Michael Chen',
      year: 2025,
      format: 'DOCX',
      category: 'Legal Research',
      pages: 95,
      rating: 4.9,
      description: 'Advanced legal research techniques and methodologies'
    },
    {
      id: 4,
      title: 'Constitutional Law of India',
      type: 'Book',
      author: 'Justice R. Sharma',
      year: 2024,
      format: 'PDF',
      category: 'Constitutional Law',
      pages: 450,
      rating: 4.7,
      description: 'Complete analysis of Indian Constitution with amendments'
    },
    {
      id: 5,
      title: 'Tamil Nadu Land Records Manual',
      type: 'Document',
      author: 'Revenue Department',
      year: 2023,
      format: 'PDF',
      category: 'Property Law',
      pages: 210,
      rating: 4.5,
      description: 'Official guide to TN land records and registration'
    }
  ]);

  const resourceTypes = ['all', ...new Set(resources.map(resource => resource.type))];
  const categories = ['all', ...new Set(resources.map(resource => resource.category))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const toggleSaveResource = (resourceId) => {
    setSavedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const downloadResource = (resource) => {
    // Simulate download functionality
    console.log(`Downloading: ${resource.title}`);
    // In real implementation, this would trigger actual download
  };

  const getTypeColor = (type) => {
    const colors = {
      'Book': 'bg-[#b69d74] bg-opacity-15 text-[#b69d74]',
      'Document': 'bg-[#10b981] bg-opacity-15 text-[#10b981]',
      'Course Material': 'bg-[#3b82f6] bg-opacity-15 text-[#3b82f6]'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-[#f5f5ef] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1f2839]">Digital Law Library</h1>
            <p className="text-[#6b7280] mt-1">Comprehensive legal resources and research materials</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-[#6b7280]" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-[#b69d7440] rounded-lg bg-white 
                         placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#b69d74] 
                         focus:border-[#b69d74] text-sm text-[#1f2839]"
                placeholder="Search by title, author, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-[#b69d7440] rounded-lg 
                       bg-white text-[#1f2839] hover:bg-[#b69d74] hover:bg-opacity-5 transition-all duration-200"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-[#b69d7440] rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#1f2839]">Filter Resources</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-[#6b7280] hover:text-[#1f2839]"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedType === type
                      ? 'bg-[#b69d74] text-white'
                      : 'bg-[#b69d74] bg-opacity-10 text-[#1f2839] hover:bg-opacity-20'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-[#b69d7440] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#1f2839]">{resources.length}</div>
            <div className="text-[#6b7280] text-sm">Total Resources</div>
          </div>
          <div className="bg-white border border-[#b69d7440] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#1f2839]">
              {resources.filter(r => r.format === 'PDF').length}
            </div>
            <div className="text-[#6b7280] text-sm">PDF Documents</div>
          </div>
          <div className="bg-white border border-[#b69d7440] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#1f2839]">{savedResources.length}</div>
            <div className="text-[#6b7280] text-sm">Saved Items</div>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[#b69d7440] rounded-lg">
            <FiBook className="mx-auto h-12 w-12 text-[#6b7280]" />
            <h3 className="mt-4 text-lg font-medium text-[#1f2839]">No resources found</h3>
            <p className="mt-2 text-[#6b7280]">Try adjusting your search terms or filters</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedType('all'); }}
              className="mt-4 px-4 py-2 bg-[#b69d74] text-white rounded-lg hover:bg-[#b69d74] 
                       hover:bg-opacity-90 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredResources.map(resource => (
              <div 
                key={resource.id} 
                className="bg-white border border-[#b69d7440] rounded-lg p-4 md:p-6 
                         hover:shadow-md transition-all duration-300 hover:border-[#b69d7460]"
              >
                {/* Resource Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    <FiBook className="text-lg" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-sm text-[#6b7280]">
                      ⭐ {resource.rating}
                    </span>
                    <button 
                      onClick={() => toggleSaveResource(resource.id)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        savedResources.includes(resource.id)
                          ? 'text-[#b69d74] bg-[#b69d74] bg-opacity-10'
                          : 'text-[#6b7280] hover:text-[#b69d74] hover:bg-[#b69d74] hover:bg-opacity-10'
                      }`}
                    >
                      <FiBookmark className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Resource Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#1f2839] mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-[#6b7280] text-sm mb-3">By {resource.author}</p>
                  <p className="text-[#1f2839] text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-[#1f2839] bg-opacity-5 text-[#1f2839]">
                      {resource.category}
                    </span>
                    <span className="text-[#6b7280]">{resource.year}</span>
                    <span className="text-[#6b7280]">{resource.pages} pages</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-[#b69d7410]">
                  <button className="text-[#b69d74] hover:text-[#b69d74] hover:bg-opacity-90 
                                   font-medium text-sm transition-all duration-200 px-3 py-2 
                                   rounded-lg hover:bg-[#b69d74] hover:bg-opacity-10">
                    Preview
                  </button>
                  <button 
                    onClick={() => downloadResource(resource)}
                    className="flex items-center text-[#1f2839] hover:text-[#b69d74] text-sm 
                             transition-all duration-200 px-3 py-2 rounded-lg hover:bg-[#b69d74] hover:bg-opacity-10"
                  >
                    <FiDownload className="mr-1 text-base" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Library Features Section */}
        <div className="mt-12 bg-white border border-[#b69d7440] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#1f2839] mb-4">Library Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-[#b69d74] bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiSearch className="text-[#b69d74] text-xl" />
              </div>
              <h3 className="font-medium text-[#1f2839]">Advanced Search</h3>
              <p className="text-sm text-[#6b7280] mt-1">Natural language queries with AI-powered results</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-[#10b981] bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiDownload className="text-[#10b981] text-xl" />
              </div>
              <h3 className="font-medium text-[#1f2839]">Offline Access</h3>
              <p className="text-sm text-[#6b7280] mt-1">Download resources for offline study sessions</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-[#3b82f6] bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiBookmark className="text-[#3b82f6] text-xl" />
              </div>
              <h3 className="font-medium text-[#1f2839]">Personal Library</h3>
              <p className="text-sm text-[#6b7280] mt-1">Save and organize your favorite resources</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-[#f59e0b] bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiBook className="text-[#f59e0b] text-xl" />
              </div>
              <h3 className="font-medium text-[#1f2839]">OCR Support</h3>
              <p className="text-sm text-[#6b7280] mt-1">Text extraction from scanned documents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;