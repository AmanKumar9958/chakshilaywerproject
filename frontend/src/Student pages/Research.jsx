import React, { useState } from 'react';

export default function Research() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    jurisdiction: '',
    year: '',
    judge: '',
    topic: ''
  });
  const [savedNotes, setSavedNotes] = useState([
    {
      id: 1,
      title: "Analysis of Data Privacy Laws",
      content: "Comparative analysis of GDPR and Indian Data Protection Bill",
      caseReference: "Justice K.S. Puttaswamy (Retd.) vs Union Of India (2017)",
      tags: ["Privacy", "Constitutional Law", "GDPR"],
      date: "2023-10-25"
    },
    {
      id: 2,
      title: "Contract Law Precedents",
      content: "Important cases related to offer and acceptance",
      caseReference: "Carlill v. Carbolic Smoke Ball Company (1893)",
      tags: ["Contract Law", "Offer", "Acceptance"],
      date: "2023-10-20"
    }
  ]);
  const [recentSearches, setRecentSearches] = useState([
    "Right to Privacy cases",
    "Article 14 discrimination",
    "Contract law specific performance",
    "Tort law negligence precedents"
  ]);

  // Color palette matching sidebar
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
    lightGray: '#f9fafb'
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchFilters({
      jurisdiction: '',
      year: '',
      judge: '',
      topic: ''
    });
    setSearchQuery('');
  };

  const searchResults = [
    {
      id: 1,
      caseName: "Justice K.S. Puttaswamy (Retd.) vs Union Of India",
      citation: "AIR 2017 SC 4161",
      year: "2017",
      court: "Supreme Court of India",
      summary: "Landmark judgment recognizing right to privacy as a fundamental right under Article 21 of the Constitution.",
      topics: ["Privacy", "Constitutional Law", "Fundamental Rights"]
    },
    {
      id: 2,
      caseName: "Shayara Bano vs Union of India",
      citation: "AIR 2017 SC 4609",
      year: "2017",
      court: "Supreme Court of India",
      summary: "Declared the practice of instant triple talaq unconstitutional.",
      topics: ["Muslim Law", "Constitutional Law", "Gender Justice"]
    }
  ];

  // Mobile-friendly tab navigation
  const TabButton = ({ tab, icon, label, activeTab, onClick }) => (
    <button
      className={`flex-1 min-w-0 px-3 py-3 font-semibold flex flex-col items-center text-xs md:text-sm md:flex-row md:justify-center transition-all duration-300 ${
        activeTab === tab 
          ? 'text-white border-b-2 shadow-sm' 
          : 'text-[#1f2839] hover:bg-[rgba(182,157,116,0.1)]'
      }`}
      style={{
        background: activeTab === tab ? `linear-gradient(135deg, ${colors.golden}, #c8b090)` : 'transparent',
        borderBottomColor: activeTab === tab ? colors.golden : 'transparent'
      }}
      onClick={() => onClick(tab)}
    >
      <span className="mb-1 md:mb-0 md:mr-2">{icon}</span>
      <span className="text-center md:text-left">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen lg:ml-60 pt-16 lg:pt-0" style={{ background: colors.cream }}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.navy }}>
            Legal Research Center
          </h1>
          <p className="mt-1 text-sm sm:text-base" style={{ color: colors.gray }}>
            Access comprehensive legal databases and research tools
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto rounded-xl" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.5)',
            border: `1px solid rgba(182, 157, 116, 0.2)`
          }}
        >
          <div className="flex min-w-max">
            <TabButton
              tab="search"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              label="Search"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <TabButton
              tab="notes"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              label="Notes"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <TabButton
              tab="history"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="History"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <TabButton
              tab="tools"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label="Tools"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="min-h-96">
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-4 sm:p-6 rounded-xl backdrop-blur-sm" 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid rgba(182, 157, 116, 0.2)`,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <h3 className="font-semibold text-lg sm:text-xl mb-4" style={{ color: colors.navy }}>
                  Search Legal Database
                </h3>
                <form onSubmit={handleSearch}>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none text-sm sm:text-base"
                      placeholder="Search by case name, citation, topic, or keywords"
                      style={{
                        border: `1px solid rgba(182, 157, 116, 0.3)`,
                        color: colors.navy,
                        background: 'white'
                      }}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 p-2 rounded-md transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${colors.golden}, #c8b090)`,
                        color: 'white'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Jurisdiction', name: 'jurisdiction', options: ['All Jurisdictions', 'Supreme Court', 'High Courts', 'International'] },
                      { label: 'Year', name: 'year', options: ['All Years', '2023', '2022', '2021', '2020'] },
                      { label: 'Topic', name: 'topic', options: ['All Topics', 'Constitutional Law', 'Criminal Law', 'Contract Law', 'Property Law'] }
                    ].map((filter, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-medium mb-1" style={{ color: colors.navy }}>
                          {filter.label}
                        </label>
                        <select
                          value={searchFilters[filter.name]}
                          onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                          className="w-full px-3 py-2 rounded-md text-sm focus:outline-none"
                          style={{
                            border: `1px solid rgba(182, 157, 116, 0.3)`,
                            color: colors.navy,
                            background: 'white'
                          }}
                        >
                          {filter.options.map((opt, i) => (
                            <option key={i} value={i === 0 ? '' : opt.toLowerCase()}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: colors.navy }}>
                        Judge
                      </label>
                      <input
                        type="text"
                        value={searchFilters.judge}
                        onChange={(e) => handleFilterChange('judge', e.target.value)}
                        className="w-full px-3 py-2 rounded-md text-sm focus:outline-none"
                        placeholder="Judge name"
                        style={{
                          border: `1px solid rgba(182, 157, 116, 0.3)`,
                          color: colors.navy,
                          background: 'white'
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      className="text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: colors.golden }}
                    >
                      Advanced Filters
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: colors.gray }}
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </button>
                  </div>
                </form>
              </div>

              {/* Search Results */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: colors.navy }}>
                  Search Results
                </h3>
                
                {searchQuery ? (
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id} 
                        className="p-4 sm:p-5 rounded-xl transition-all hover:scale-[1.01]"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: `1px solid rgba(182, 157, 116, 0.2)`,
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <h4 className="font-bold mb-2 text-base sm:text-lg" style={{ color: colors.navy }}>
                          {result.caseName}
                        </h4>
                        <div className="flex flex-wrap items-center text-xs sm:text-sm mb-3 gap-2" style={{ color: colors.gray }}>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {result.citation}
                          </span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {result.year}
                          </span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {result.court}
                          </span>
                        </div>
                        <p className="mb-3 text-sm sm:text-base" style={{ color: colors.navy }}>
                          {result.summary}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {result.topics.map((topic, index) => (
                            <span 
                              key={index} 
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                background: `rgba(182, 157, 116, 0.15)`,
                                color: colors.golden
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <button 
                            className="font-medium text-sm flex items-center hover:opacity-80 transition-opacity"
                            style={{ color: colors.golden }}
                          >
                            Read Full Judgment
                          </button>
                          <div className="flex space-x-2">
                            <button style={{ color: colors.gray }} className="p-1 hover:opacity-70">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                            <button style={{ color: colors.gray }} className="p-1 hover:opacity-70">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    className="p-8 rounded-xl text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: `1px solid rgba(182, 157, 116, 0.2)`
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" style={{ color: colors.gray }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h4 className="text-lg font-medium" style={{ color: colors.navy }}>
                      Enter your search query
                    </h4>
                    <p className="mt-1 text-sm" style={{ color: colors.gray }}>
                      Search by case name, citation, topic, or keywords
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colors.navy }}>
                  Your Saved Notes
                </h3>
                <button 
                  className="py-2 px-4 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 flex items-center"
                  style={{ background: `linear-gradient(135deg, ${colors.golden}, #c8b090)` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Note
                </button>
              </div>

              {savedNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedNotes.map((note) => (
                    <div 
                      key={note.id} 
                      className="p-4 rounded-xl transition-all hover:scale-[1.01]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: `1px solid rgba(182, 157, 116, 0.2)`
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-base sm:text-lg" style={{ color: colors.navy }}>
                          {note.title}
                        </h4>
                        <div className="flex space-x-1">
                          <button style={{ color: colors.gray }} className="p-1 hover:opacity-70">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1 hover:opacity-70 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <p className="mb-3 text-sm" style={{ color: colors.navy }}>{note.content}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs mb-1" style={{ color: colors.gray }}>Case Reference:</p>
                        <p className="text-sm font-medium" style={{ color: colors.navy }}>{note.caseReference}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              background: `rgba(182, 157, 116, 0.15)`,
                              color: colors.golden
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs" style={{ color: colors.gray }}>
                        <span>Updated: {note.date}</span>
                        <button 
                          className="font-medium flex items-center hover:opacity-80"
                          style={{ color: colors.golden }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  className="p-8 rounded-xl text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid rgba(182, 157, 116, 0.2)`
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" style={{ color: colors.gray }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="text-lg font-medium" style={{ color: colors.navy }}>No saved notes yet</h4>
                  <p className="mt-1 text-sm mb-4" style={{ color: colors.gray }}>
                    Start adding notes to your research
                  </p>
                  <button 
                    className="py-2 px-4 rounded-lg text-sm font-medium text-white transition-all"
                    style={{ background: `linear-gradient(135deg, ${colors.golden}, #c8b090)` }}
                  >
                    Create First Note
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colors.navy }}>
                  Research History
                </h3>
                <button className="text-sm font-medium hover:opacity-80" style={{ color: colors.gray }}>
                  Clear History
                </button>
              </div>

              <div 
                className="p-4 sm:p-5 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid rgba(182, 157, 116, 0.2)`
                }}
              >
                <h4 className="font-medium mb-3" style={{ color: colors.navy }}>Recent Searches</h4>
                
                {recentSearches.length > 0 ? (
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center p-2 sm:p-3 rounded text-sm"
                        style={{ background: colors.lightGray }}
                      >
                        <span className="truncate" style={{ color: colors.navy }}>{search}</span>
                        <button 
                          className="font-medium text-sm whitespace-nowrap ml-2 hover:opacity-80"
                          style={{ color: colors.golden }}
                        >
                          Search Again
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p style={{ color: colors.gray }}>No recent searches found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Case Citator",
                  description: "Check the current status of a case - whether it's been overruled, affirmed, or cited.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: colors.golden }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  buttonText: "Check Status",
                  placeholder: "Enter case citation"
                },
                {
                  title: "Statute Finder",
                  description: "Quickly locate statutes and legislative materials by title, section, or keyword.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: colors.golden }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ),
                  buttonText: "Search Statutes",
                  placeholder: "Search statutes"
                }
              ].map((tool, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid rgba(182, 157, 116, 0.2)`
                  }}
                >
                  <div className="flex items-center mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ background: `rgba(182, 157, 116, 0.15)` }}
                    >
                      {tool.icon}
                    </div>
                    <h3 className="font-semibold" style={{ color: colors.navy }}>{tool.title}</h3>
                  </div>
                  <p className="text-sm mb-3" style={{ color: colors.gray }}>{tool.description}</p>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded text-sm mb-2 focus:outline-none"
                    placeholder={tool.placeholder}
                    style={{
                      border: `1px solid rgba(182, 157, 116, 0.3)`,
                      color: colors.navy
                    }}
                  />
                  <button 
                    className="w-full py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${colors.golden}, #c8b090)` }}
                  >
                    {tool.buttonText}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
