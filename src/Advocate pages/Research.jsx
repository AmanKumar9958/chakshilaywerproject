import React, { useState, useRef } from 'react';
import {
  Search,
  Mic,
  MicOff,
  FileText,
  Upload,
  Brain,
  Scale,
  Monitor,
  BarChart3,
  BookOpen,
  Target,
  Bell,
  TrendingUp,
  Gavel,
  Building,
  Heart,
  Home,
  Briefcase,
  Shield,
  FileCheck,
  Users,
  Activity,
  Clock,
  Filter,
  Loader
} from 'lucide-react';

export default function Research() {
  const [activeTab, setActiveTab] = useState('ai-research');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Hero.js Color Palette
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
    green: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6'
  };

  // Mock AI analysis
  const handleInstantAnalysis = async () => {
    if (!searchQuery) {
      alert('Please enter a case description or legal query');
      return;
    }

    setLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResults({
        type: 'Case Analysis',
        confidence: '87%',
        legalPathways: [
          'Constitutional Law - Article 14 (Right to Equality)',
          'Administrative Law - Judicial Review',
          'Contract Law - Breach of Contract'
        ],
        precedents: [
          'Maneka Gandhi vs Union of India (1978)',
          'Kesavananda Bharati vs State of Kerala (1973)',
          'I.R. Coelho vs State of Tamil Nadu (2007)'
        ],
        riskAssessment: {
          successProbability: '75%',
          timeEstimate: '6-12 months',
          complexity: 'Medium'
        },
        recommendations: [
          'File a writ petition under Article 226',
          'Include fundamental rights violation arguments',
          'Prepare documentary evidence of procedural lapses'
        ]
      });
      setLoading(false);
    }, 2000);
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };
      
      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  const tabs = [
    { id: 'ai-research', name: 'AI Research', icon: Brain },
    { id: 'precedent-matching', name: 'Precedent Matching', icon: Search },
    { id: 'case-monitoring', name: 'Case Monitoring', icon: Monitor },
    { id: 'comparative-analysis', name: 'Comparative Analysis', icon: BarChart3 },
    { id: 'specialized-research', name: 'Specialized Research', icon: BookOpen }
  ];

  const renderAIResearch = () => (
    <div className="space-y-6">
      {/* Legal Research Assistant */}
      <div className="rounded-lg p-4 md:p-6" style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
        backdropFilter: 'blur(6px)',
        border: `1px solid rgba(182, 157, 116, 0.15)`
      }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ background: `rgba(182, 157, 116, 0.12)` }}>
            <Brain className="w-5 h-5" style={{ color: colors.golden }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Legal Research Assistant</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your case or legal query... (e.g., 'Employment termination without proper notice period')"
              className="w-full p-3 rounded-md h-24 resize-none focus:outline-none transition-all"
              style={{
                border: `1px solid rgba(182, 157, 116, 0.25)`,
                background: `rgba(255, 255, 255, 0.06)`,
                color: colors.navy
              }}
              onFocus={(e) => e.target.style.borderColor = colors.golden}
              onBlur={(e) => e.target.style.borderColor = `rgba(182, 157, 116, 0.25)`}
            />
          </div>
          <div className="flex flex-row md:flex-col gap-2 justify-center">
            <button
              onClick={handleVoiceSearch}
              className="p-3 rounded-md transition-all duration-200 flex items-center justify-center"
              style={{
                background: isListening ? '#ef4444' : `rgba(182, 157, 116, 0.08)`,
                color: isListening ? '#ffffff' : colors.navy
              }}
              onMouseEnter={(e) => {
                if (!isListening) {
                  e.target.style.background = `rgba(182, 157, 116, 0.15)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isListening) {
                  e.target.style.background = `rgba(182, 157, 116, 0.08)`;
                }
              }}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <span className="text-xs text-center md:block hidden" style={{ color: colors.gray }}>
              {isListening ? 'Listening...' : 'Voice Search'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleInstantAnalysis}
            disabled={loading}
            className="px-6 py-2 rounded-md font-medium disabled:opacity-50 transition-all duration-200 flex items-center gap-2 text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.golden} 0%, rgba(182, 157, 116, 0.85) 100%)`,
              boxShadow: `0 4px 12px rgba(182, 157, 116, 0.30)`
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = `0 6px 20px rgba(182, 157, 116, 0.40)`;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 12px rgba(182, 157, 116, 0.30)`;
              }
            }}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Instant Case Analysis
              </>
            )}
          </button>
          
          <button className="px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2" style={{
            background: `rgba(255, 255, 255, 0.06)`,
            border: `1px solid rgba(182, 157, 116, 0.25)`,
            color: colors.navy,
            backdropFilter: 'blur(6px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = `rgba(182, 157, 116, 0.08)`;
            e.target.style.borderColor = colors.golden;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `rgba(255, 255, 255, 0.06)`;
            e.target.style.borderColor = `rgba(182, 157, 116, 0.25)`;
          }}>
            <Upload className="w-4 h-4" />
            Upload Case Files
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="rounded-lg p-4 md:p-6" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
          backdropFilter: 'blur(6px)',
          border: `1px solid rgba(182, 157, 116, 0.15)`
        }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: `rgba(16, 185, 129, 0.12)` }}>
                <Target className="w-5 h-5" style={{ color: colors.green }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>Analysis Results</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
              background: `rgba(16, 185, 129, 0.15)`,
              color: colors.green,
              border: `1px solid rgba(16, 185, 129, 0.25)`
            }}>
              Confidence: {analysisResults.confidence}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3" style={{ color: colors.navy }}>Legal Pathways</h4>
              <ul className="space-y-2">
                {analysisResults.legalPathways.map((pathway, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Scale className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: colors.golden }} />
                    <span style={{ color: colors.gray }}>{pathway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3" style={{ color: colors.navy }}>Relevant Precedents</h4>
              <ul className="space-y-2">
                {analysisResults.precedents.map((precedent, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Gavel className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: colors.golden }} />
                    <span style={{ color: colors.gray }}>{precedent}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3" style={{ color: colors.navy }}>Risk Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: colors.gray }}>Success Probability:</span>
                  <span className="font-medium" style={{ color: colors.green }}>{analysisResults.riskAssessment.successProbability}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.gray }}>Time Estimate:</span>
                  <span className="font-medium" style={{ color: colors.navy }}>{analysisResults.riskAssessment.timeEstimate}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.gray }}>Complexity:</span>
                  <span className="font-medium" style={{ color: colors.amber }}>{analysisResults.riskAssessment.complexity}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3" style={{ color: colors.navy }}>Recommendations</h4>
              <ul className="space-y-2">
                {analysisResults.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FileCheck className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: colors.golden }} />
                    <span style={{ color: colors.gray }}>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Professional Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg p-4 transition-all duration-200 hover:scale-105" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
          backdropFilter: 'blur(6px)',
          border: `1px solid rgba(182, 157, 116, 0.15)`,
          boxShadow: `0 4px 15px rgba(182, 157, 116, 0.10)`
        }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: `rgba(182, 157, 116, 0.12)` }}>
              <FileText className="w-4 h-4" style={{ color: colors.golden }} />
            </div>
            <h4 className="font-medium" style={{ color: colors.navy }}>Document Drafting</h4>
          </div>
          <p className="text-sm mb-3" style={{ color: colors.gray }}>Generate legal documents with AI assistance</p>
          <button className="w-full py-2 rounded-md font-medium transition-all duration-200" style={{
            background: `rgba(182, 157, 116, 0.08)`,
            color: colors.navy,
            border: `1px solid rgba(182, 157, 116, 0.20)`
          }}
          onMouseEnter={(e) => {
            e.target.style.background = `rgba(182, 157, 116, 0.15)`;
            e.target.style.borderColor = colors.golden;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `rgba(182, 157, 116, 0.08)`;
            e.target.style.borderColor = `rgba(182, 157, 116, 0.20)`;
          }}>
            Start Drafting
          </button>
        </div>

        <div className="rounded-lg p-4 transition-all duration-200 hover:scale-105" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
          backdropFilter: 'blur(6px)',
          border: `1px solid rgba(182, 157, 116, 0.15)`,
          boxShadow: `0 4px 15px rgba(182, 157, 116, 0.10)`
        }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: `rgba(16, 185, 129, 0.12)` }}>
              <Brain className="w-4 h-4" style={{ color: colors.green }} />
            </div>
            <h4 className="font-medium" style={{ color: colors.navy }}>Legal Strategies</h4>
          </div>
          <p className="text-sm mb-3" style={{ color: colors.gray }}>AI-generated legal arguments and approaches</p>
          <button className="w-full py-2 rounded-md font-medium transition-all duration-200" style={{
            background: `rgba(182, 157, 116, 0.08)`,
            color: colors.navy,
            border: `1px solid rgba(182, 157, 116, 0.20)`
          }}
          onMouseEnter={(e) => {
            e.target.style.background = `rgba(182, 157, 116, 0.15)`;
            e.target.style.borderColor = colors.golden;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `rgba(182, 157, 116, 0.08)`;
            e.target.style.borderColor = `rgba(182, 157, 116, 0.20)`;
          }}>
            Generate Strategies
          </button>
        </div>

        <div className="rounded-lg p-4 transition-all duration-200 hover:scale-105" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
          backdropFilter: 'blur(6px)',
          border: `1px solid rgba(182, 157, 116, 0.15)`,
          boxShadow: `0 4px 15px rgba(182, 157, 116, 0.10)`
        }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: `rgba(59, 130, 246, 0.12)` }}>
              <BarChart3 className="w-4 h-4" style={{ color: colors.blue }} />
            </div>
            <h4 className="font-medium" style={{ color: colors.navy }}>Case Analysis</h4>
          </div>
          <p className="text-sm mb-3" style={{ color: colors.gray }}>Comprehensive case strength evaluation</p>
          <button className="w-full py-2 rounded-md font-medium transition-all duration-200" style={{
            background: `rgba(182, 157, 116, 0.08)`,
            color: colors.navy,
            border: `1px solid rgba(182, 157, 116, 0.20)`
          }}
          onMouseEnter={(e) => {
            e.target.style.background = `rgba(182, 157, 116, 0.15)`;
            e.target.style.borderColor = colors.golden;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `rgba(182, 157, 116, 0.08)`;
            e.target.style.borderColor = `rgba(182, 157, 116, 0.20)`;
          }}>
            Analyze Case
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrecedentMatching = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Precedent Matching</h3>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Case Facts or Legal Issue</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
            placeholder="Enter case facts, legal issues, or specific legal questions..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option>All Jurisdictions</option>
            <option>Supreme Court</option>
            <option>High Courts</option>
          </select>
          
          <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option>All Practice Areas</option>
            <option>Constitutional Law</option>
            <option>Corporate Law</option>
          </select>
          
          <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option>Last 10 Years</option>
            <option>Last 5 Years</option>
            <option>Last 2 Years</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Search className="w-4 h-4" />
          Find Similar Cases
        </button>
      </div>

      {/* Sample Results */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <h4 className="font-medium text-gray-900 mb-4">Similar Cases Found</h4>
        <div className="space-y-4">
          {[
            {
              title: 'ABC Corp vs State of Delhi',
              citation: '(2023) 5 SCC 234',
              similarity: '94%',
              outcome: 'Petitioner Favored',
              keyPoints: ['Administrative overreach', 'Due process violation']
            },
            {
              title: 'XYZ Industries vs Municipal Corporation',
              citation: '(2022) 3 SCC 156',
              similarity: '87%',
              outcome: 'Partially Favored',
              keyPoints: ['Procedural irregularity', 'Proportionality test']
            }
          ].map((case_item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-2">
                <h5 className="font-medium text-gray-900">{case_item.title}</h5>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {case_item.similarity} Match
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {case_item.outcome}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{case_item.citation}</p>
              <div className="flex flex-wrap gap-1">
                {case_item.keyPoints.map((point, pointIndex) => (
                  <span key={pointIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCaseMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Monitor className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Case Law Monitoring</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Custom Alert Setup</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Keywords (e.g., 'data protection', 'employment law')"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                <option>All Courts</option>
                <option>Supreme Court Only</option>
                <option>High Courts Only</option>
              </select>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Set Alert
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recent Updates</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>3 new Supreme Court judgments</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>15 High Court orders</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>7 tribunal decisions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Today's Developments</h4>
          <div className="space-y-4">
            {[
              {
                court: 'Supreme Court',
                case: 'Privacy Rights in Digital Age',
                impact: 'High',
                summary: 'Landmark judgment on data protection and digital privacy rights'
              },
              {
                court: 'Delhi High Court',
                case: 'Environmental Clearance Guidelines',
                impact: 'Medium',
                summary: 'New guidelines for environmental impact assessment procedures'
              }
            ].map((update, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  update.impact === 'High' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-1">
                    <h5 className="font-medium text-gray-900">{update.case}</h5>
                    <span className="text-sm text-gray-600">{update.court}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{update.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderComparativeAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Case Comparison</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Case A</h4>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter case details or citation..."
            />
            <button className="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors border border-gray-300 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Case B</h4>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter case details or citation..."
            />
            <button className="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors border border-gray-300 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
            <BarChart3 className="w-4 h-4" />
            Compare Cases
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <h4 className="font-medium text-gray-900 mb-4">Doctrine Evolution</h4>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Right to Privacy Evolution</h5>
            <div className="text-sm text-gray-700">
              1950: No explicit privacy right → 2017: Fundamental right → 2023: Digital privacy expansion
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Environmental Law Development</h5>
            <div className="text-sm text-gray-700">
              1980s: Basic pollution control → 1990s: Sustainable development → 2020s: Climate change litigation
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpecializedResearch = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Family Law', icon: Heart, cases: '1,247' },
          { title: 'Property Law', icon: Home, cases: '2,156' },
          { title: 'Commercial Law', icon: Briefcase, cases: '3,428' },
          { title: 'Criminal Law', icon: Shield, cases: '4,532' },
          { title: 'Constitutional Law', icon: Scale, cases: '1,876' },
          { title: 'Corporate Law', icon: Building, cases: '2,943' }
        ].map((module, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <module.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{module.title}</h4>
              <p className="text-xl font-semibold text-gray-700">{module.cases}</p>
              <p className="text-sm text-gray-600">cases available</p>
            </div>
          </div>
        ))}
      </div>

      {/* Research Tools */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Research Tools</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Automation Tools</h4>
            <div className="space-y-2">
              <button className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-600" />
                Citation Generator
              </button>
              <button className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Activity className="w-4 h-4 text-gray-600" />
                Cross-Reference Builder
              </button>
              <button className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                Legal Trend Analysis
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Intelligence Tools</h4>
            <div className="space-y-2">
              <button className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-600" />
                Judge Decision Patterns
              </button>
              <button className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Target className="w-4 h-4 text-gray-600" />
                Success Rate Predictions
              </button>
              <button className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-600" />
                Case Duration Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: colors.cream,
      backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(182, 157, 116, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(31, 40, 57, 0.03) 0%, transparent 50%)
      `
    }}>
      {/* Header */}
      <div className="border-b p-4 md:p-6" style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 239, 0.95) 100%)`,
        borderBottomColor: `rgba(182, 157, 116, 0.20)`,
        backdropFilter: 'blur(15px)'
      }}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl" style={{ 
            background: `linear-gradient(135deg, ${colors.navy} 0%, rgba(31, 40, 57, 0.85) 100%)`
          }}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.navy }}>Legal Research Dashboard</h1>
            <p className="mt-1" style={{ color: colors.gray }}>AI-powered legal analysis and case monitoring</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-6">
          {[
            { name: 'Cases Analyzed', value: '156', icon: Search },
            { name: 'AI Predictions', value: '89', icon: Target },
            { name: 'Precedents', value: '2,341', icon: Gavel },
            { name: 'Active Alerts', value: '45', icon: Bell },
            { name: 'Success Rate', value: '87%', icon: TrendingUp }
          ].map((stat, index) => (
            <div key={index} className="rounded-lg p-3 transition-all duration-200 hover:scale-105" style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
              backdropFilter: 'blur(6px)',
              border: `1px solid rgba(182, 157, 116, 0.15)`,
              boxShadow: `0 4px 15px rgba(182, 157, 116, 0.10)`
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium" style={{ color: colors.gray }}>{stat.name}</p>
                  <p className="text-lg md:text-xl font-bold" style={{ color: colors.navy }}>{stat.value}</p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: `rgba(182, 157, 116, 0.12)` }}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.golden }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="rounded-t-lg" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
          backdropFilter: 'blur(6px)',
          border: `1px solid rgba(182, 157, 116, 0.15)`
        }}>
          <div className="px-4 md:px-6">
            <nav className="flex space-x-4 md:space-x-8 overflow-x-auto py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? ''
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{
                    borderBottomColor: activeTab === tab.id ? colors.golden : 'transparent',
                    color: activeTab === tab.id ? colors.golden : colors.gray
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = colors.navy;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = colors.gray;
                    }
                  }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:block">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-b-lg p-4 md:p-6" style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))`,
          backdropFilter: 'blur(6px)',
          border: `1px solid rgba(182, 157, 116, 0.15)`,
          borderTop: 'none'
        }}>
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(31, 40, 57, 0.50)' }}>
              <div className="rounded-lg p-6 flex items-center gap-4" style={{ 
                background: `rgba(255, 255, 255, 0.95)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid rgba(182, 157, 116, 0.20)`
              }}>
                <Loader className="w-6 h-6 animate-spin" style={{ color: colors.golden }} />
                <span className="font-medium" style={{ color: colors.navy }}>Analyzing legal case...</span>
              </div>
            </div>
          )}

          {activeTab === 'ai-research' && renderAIResearch()}
          {activeTab === 'precedent-matching' && renderPrecedentMatching()}
          {activeTab === 'case-monitoring' && renderCaseMonitoring()}
          {activeTab === 'comparative-analysis' && renderComparativeAnalysis()}
          {activeTab === 'specialized-research' && renderSpecializedResearch()}
        </div>
      </div>
    </div>
  );
}