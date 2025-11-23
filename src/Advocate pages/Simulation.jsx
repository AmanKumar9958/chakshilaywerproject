import React, { useState } from 'react';
import { 
  Scale, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Gavel, 
  Users, 
  Timer, 
  Award,
  Save,
  Copy,
  Mic,
  RefreshCw,
  Send,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';

export default function Simulation() {
  // State for different simulation aspects
  const [selectedStyle, setSelectedStyle] = useState('persuasive');
  const [argumentText, setArgumentText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [witnessResponses, setWitnessResponses] = useState([]);
  const [timelineOutcomes, setTimelineOutcomes] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('arguments');

  // Sample data for different argument styles
  const argumentStyles = [
    { id: 'persuasive', name: 'Persuasive', description: 'Appeal to logic and emotion with balanced rhetoric', icon: MessageSquare },
    { id: 'calm', name: 'Calm & Measured', description: 'Fact-based, methodical approach with neutral tone', icon: BarChart3 },
    { id: 'aggressive', name: 'Aggressive', description: 'Confrontational style with strong challenges', icon: Target },
    { id: 'narrative', name: 'Narrative', description: 'Storytelling approach to frame your case', icon: Users }
  ];

  // Sample witness responses
  const witnessResponseLibrary = {
    'persuasive': [
      "I understand your perspective, but consider the broader implications...",
      "That's a reasonable point, however the evidence suggests otherwise...",
      "I appreciate that viewpoint, but let me offer an alternative interpretation..."
    ],
    'calm': [
      "Based on the records, I can confirm that on June 15th...",
      "The documentation shows a different sequence of events...",
      "I need to clarify that my previous statement was specifically about..."
    ],
    'aggressive': [
      "I strongly disagree with that characterization of events!",
      "That's an inaccurate representation of what occurred!",
      "I must object to that line of questioning as misleading!"
    ],
    'evasive': [
      "I don't recall that specific detail...",
      "I would need to review the documents before answering...",
      "That question seems to presume facts not in evidence..."
    ]
  };

  // Sample feedback criteria
  const feedbackCriteria = [
    { name: 'Persuasiveness', score: 0 },
    { name: 'Legal Accuracy', score: 0 },
    { name: 'Clarity', score: 0 },
    { name: 'Professionalism', score: 0 },
    { name: 'Effectiveness', score: 0 }
  ];

  // Function to generate a mock argument based on selected style
  const generateArgument = () => {
    const style = argumentStyles.find(s => s.id === selectedStyle);
    let generatedArgument = '';
    
    switch(selectedStyle) {
      case 'persuasive':
        generatedArgument = "Your Honor, if we consider the fundamental principles of justice in this matter, we find that the evidence clearly demonstrates a pattern of behavior that any reasonable person would find concerning. The defendant's actions not only violated the statute but also breached the trust placed in them by the community.";
        break;
      case 'calm':
        generatedArgument = "The record shows three specific instances where the protocol was not followed. On June 15th, the log indicates an entry was modified after the fact. On July 22nd, the required verification step was skipped. Finally, on August 5th, the documentation was incomplete according to regulation 4.2.C.";
        break;
      case 'aggressive':
        generatedArgument = "This is nothing but a blatant attempt to mislead the court! The evidence clearly shows the defendant knowingly and willingly violated the agreement. Their actions demonstrate a complete disregard for the process and for the truth!";
        break;
      case 'narrative':
        generatedArgument = "Imagine a small business owner, working tirelessly for decades to build something for their family. Now picture that foundation being undermined by the deceptive practices we've seen in this case. This isn't just about financial loss—it's about broken trust and damaged reputations.";
        break;
      default:
        generatedArgument = "Please select an argument style to generate content.";
    }
    
    setArgumentText(generatedArgument);
  };

  // Function to ask a question to the AI witness
  const askQuestion = () => {
    if (!currentQuestion.trim()) return;
    
    // Determine response style based on some logic (could be random or based on question content)
    const responseStyles = Object.keys(witnessResponseLibrary);
    const randomStyle = responseStyles[Math.floor(Math.random() * responseStyles.length)];
    const possibleResponses = witnessResponseLibrary[randomStyle];
    const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
    
    const newQuestion = {
      id: questions.length + 1,
      text: currentQuestion,
      response: response,
      style: randomStyle,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
  };

  // Function to simulate different timeline outcomes
  const simulateTimelines = () => {
    const outcomes = [
      {
        title: "Standard Procedure Timeline",
        steps: [
          "Motion to dismiss - Denied",
          "Discovery phase - Completed",
          "Pre-trial conference - Scheduled",
          "Trial - Estimated 3-5 days",
          "Verdict - Jury deliberation 1-2 days"
        ],
        successProbability: "65%",
        duration: "6-9 months",
        color: "blue"
      },
      {
        title: "Expedited Timeline",
        steps: [
          "Motion to dismiss - Granted in part",
          "Limited discovery - 30 days",
          "Summary judgment motion - Filed",
          "Settlement conference - Ordered",
          "Possible resolution in 60 days"
        ],
        successProbability: "45%",
        duration: "2-3 months",
        color: "purple"
      },
      {
        title: "Appeal Scenario",
        steps: [
          "Initial verdict - Unfavorable",
          "Notice of appeal - Filed",
          "Appellate briefing - 90 days",
          "Oral arguments - Scheduled",
          "Appellate decision - 6-12 months"
        ],
        successProbability: "30%",
        duration: "12-18 months",
        color: "amber"
      }
    ];
    
    setTimelineOutcomes(outcomes);
  };

  // Function to get AI feedback
  const getFeedback = () => {
    // Generate random scores for demonstration
    const scoredFeedback = feedbackCriteria.map(criterion => ({
      ...criterion,
      score: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
    }));
    
    const overallScore = scoredFeedback.reduce((sum, item) => sum + item.score, 0) / scoredFeedback.length;
    
    const comments = [
      "Your persuasive approach was effective but could use more specific case references.",
      "Consider varying your tone more to emphasize key points.",
      "The narrative structure was compelling but watch for tangential details.",
      "Your cross-examination strategy effectively highlighted inconsistencies.",
      "Work on transitioning more smoothly between evidence points."
    ];
    
    setFeedback({
      criteria: scoredFeedback,
      overallScore: overallScore.toFixed(1),
      comments: comments
    });
  };

  // Function to clear conversation
  const clearConversation = () => {
    setQuestions([]);
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#f5f5ef' }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 p-6 border rounded-lg backdrop-blur-md" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.6)', 
                  borderColor: 'rgba(182, 157, 116, 0.2)',
                  boxShadow: '0 0 25px rgba(182, 157, 116, 0.15)'
                }}>
          <h1 className="text-3xl font-bold mb-2 flex items-center" style={{ color: '#1f2839' }}>
            <Scale className="mr-3 w-8 h-8" style={{ color: '#b69d74' }} />
            Courtroom Simulation Platform
          </h1>
          <p style={{ color: '#6b7280' }}>Practice arguments, cross-examination, and explore different case outcomes with AI assistance</p>
        </header>
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto mb-8 border rounded-lg p-1 backdrop-blur-md" 
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.6)', 
               borderColor: 'rgba(182, 157, 116, 0.2)' 
             }}>
          <button
            className={`flex items-center py-3 px-6 font-medium rounded-lg transition-all border ${activeTab === 'arguments' ? '' : ''}`}
            style={{
              backgroundColor: activeTab === 'arguments' ? 'rgba(182, 157, 116, 0.12)' : 'transparent',
              color: activeTab === 'arguments' ? '#1f2839' : '#6b7280',
              borderColor: activeTab === 'arguments' ? 'rgba(182, 157, 116, 0.3)' : 'transparent',
              boxShadow: activeTab === 'arguments' ? '0 0 15px rgba(182, 157, 116, 0.2)' : 'none'
            }}
            onClick={() => setActiveTab('arguments')}
          >
            <MessageSquare className="mr-2 w-4 h-4" style={{ color: activeTab === 'arguments' ? '#b69d74' : '#6b7280' }} />
            Argument Simulation
          </button>
          <button
            className={`flex items-center py-3 px-6 font-medium rounded-lg transition-all border ${activeTab === 'cross-exam' ? '' : ''}`}
            style={{
              backgroundColor: activeTab === 'cross-exam' ? 'rgba(182, 157, 116, 0.12)' : 'transparent',
              color: activeTab === 'cross-exam' ? '#1f2839' : '#6b7280',
              borderColor: activeTab === 'cross-exam' ? 'rgba(182, 157, 116, 0.3)' : 'transparent',
              boxShadow: activeTab === 'cross-exam' ? '0 0 15px rgba(182, 157, 116, 0.2)' : 'none'
            }}
            onClick={() => setActiveTab('cross-exam')}
          >
            <Gavel className="mr-2 w-4 h-4" style={{ color: activeTab === 'cross-exam' ? '#b69d74' : '#6b7280' }} />
            Cross-Examination
          </button>
          <button
            className={`flex items-center py-3 px-6 font-medium rounded-lg transition-all border ${activeTab === 'timelines' ? '' : ''}`}
            style={{
              backgroundColor: activeTab === 'timelines' ? 'rgba(182, 157, 116, 0.12)' : 'transparent',
              color: activeTab === 'timelines' ? '#1f2839' : '#6b7280',
              borderColor: activeTab === 'timelines' ? 'rgba(182, 157, 116, 0.3)' : 'transparent',
              boxShadow: activeTab === 'timelines' ? '0 0 15px rgba(182, 157, 116, 0.2)' : 'none'
            }}
            onClick={() => setActiveTab('timelines')}
          >
            <Calendar className="mr-2 w-4 h-4" style={{ color: activeTab === 'timelines' ? '#b69d74' : '#6b7280' }} />
            Timeline Outcomes
          </button>
          <button
            className={`flex items-center py-3 px-6 font-medium rounded-lg transition-all border ${activeTab === 'feedback' ? '' : ''}`}
            style={{
              backgroundColor: activeTab === 'feedback' ? 'rgba(182, 157, 116, 0.12)' : 'transparent',
              color: activeTab === 'feedback' ? '#1f2839' : '#6b7280',
              borderColor: activeTab === 'feedback' ? 'rgba(182, 157, 116, 0.3)' : 'transparent',
              boxShadow: activeTab === 'feedback' ? '0 0 15px rgba(182, 157, 116, 0.2)' : 'none'
            }}
            onClick={() => setActiveTab('feedback')}
          >
            <BarChart3 className="mr-2 w-4 h-4" style={{ color: activeTab === 'feedback' ? '#b69d74' : '#6b7280' }} />
            AI Feedback
          </button>
        </div>
        
        {/* Argument Simulation Tab */}
        {activeTab === 'arguments' && (
          <div className="border rounded-lg p-6 mb-6 backdrop-blur-md" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.6)', 
                 borderColor: 'rgba(182, 157, 116, 0.2)',
                 boxShadow: '0 0 25px rgba(182, 157, 116, 0.15)'
               }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1f2839' }}>Mock Argument Generation</h3>
              <div className="text-sm px-3 py-1 rounded-full border backdrop-blur-sm" 
                   style={{ 
                     color: '#6b7280', 
                     backgroundColor: 'rgba(182, 157, 116, 0.08)',
                     borderColor: 'rgba(182, 157, 116, 0.2)'
                   }}>
                Selected: {argumentStyles.find(s => s.id === selectedStyle)?.name}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {argumentStyles.map(style => {
                const IconComponent = style.icon;
                const isSelected = selectedStyle === style.id;
                return (
                  <div 
                    key={style.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all backdrop-blur-sm ${
                      isSelected ? '' : ''
                    }`}
                    style={{
                      borderColor: isSelected ? 'rgba(182, 157, 116, 0.5)' : 'rgba(182, 157, 116, 0.2)',
                      backgroundColor: isSelected ? 'rgba(182, 157, 116, 0.12)' : 'rgba(255, 255, 255, 0.3)',
                      boxShadow: isSelected ? '0 0 15px rgba(182, 157, 116, 0.3)' : 'none'
                    }}
                    onClick={() => setSelectedStyle(style.id)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = 'rgba(182, 157, 116, 0.4)';
                        e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = 'rgba(182, 157, 116, 0.2)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      }
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <IconComponent className="w-6 h-6 mr-2" style={{ color: isSelected ? '#b69d74' : '#6b7280' }} />
                      <h4 className="font-semibold" style={{ color: '#1f2839' }}>{style.name}</h4>
                    </div>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{style.description}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="mb-6">
              <button 
                className="px-6 py-3 text-white rounded-lg transition-all duration-200 flex items-center backdrop-blur-md border"
                style={{
                  background: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  boxShadow: '0 0 15px rgba(182, 157, 116, 0.3)'
                }}
                onClick={generateArgument}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 0 25px rgba(182, 157, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 0 15px rgba(182, 157, 116, 0.3)';
                }}
              >
                <TrendingUp className="mr-2 w-4 h-4" />
                Generate Argument
              </button>
            </div>
            
            <div className="border-2 rounded-lg p-6 min-h-[200px] mb-6 backdrop-blur-sm" 
                 style={{ 
                   borderColor: 'rgba(182, 157, 116, 0.3)', 
                   backgroundColor: 'rgba(182, 157, 116, 0.05)' 
                 }}>
              <p className="leading-relaxed" style={{ color: '#1f2839' }}>
                {argumentText || "Your generated argument will appear here. Select a style and click 'Generate Argument' to begin."}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-5 py-2.5 text-white rounded-lg transition-all duration-200 flex items-center backdrop-blur-md border"
                      style={{
                        background: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
                        borderColor: 'rgba(182, 157, 116, 0.3)',
                        boxShadow: '0 0 15px rgba(182, 157, 116, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 0 20px rgba(182, 157, 116, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 0 15px rgba(182, 157, 116, 0.3)';
                      }}>
                <Save className="mr-2 w-4 h-4" />
                Save Argument
              </button>
              <button className="px-5 py-2.5 text-white rounded-lg transition-all duration-200 flex items-center backdrop-blur-md border"
                      style={{
                        background: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
                        borderColor: 'rgba(182, 157, 116, 0.3)',
                        boxShadow: '0 0 15px rgba(182, 157, 116, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 0 20px rgba(182, 157, 116, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 0 15px rgba(182, 157, 116, 0.3)';
                      }}>
                <Mic className="mr-2 w-4 h-4" />
                Practice Delivery
              </button>
              <button className="px-5 py-2.5 rounded-lg transition-all duration-200 flex items-center backdrop-blur-sm border"
                      style={{
                        color: '#1f2839',
                        backgroundColor: 'rgba(182, 157, 116, 0.08)',
                        borderColor: 'rgba(182, 157, 116, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.15)';
                        e.target.style.borderColor = 'rgba(182, 157, 116, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.08)';
                        e.target.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                      }}>
                <Copy className="mr-2 w-4 h-4" />
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
        
        {/* Cross-Examination Tab */}
        {activeTab === 'cross-exam' && (
          <div className="border rounded-lg p-6 mb-6 backdrop-blur-md" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.6)', 
                 borderColor: 'rgba(182, 157, 116, 0.2)',
                 boxShadow: '0 0 25px rgba(182, 157, 116, 0.15)'
               }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1f2839' }}>AI Witness Cross-Examination</h3>
              {questions.length > 0 && (
                <button 
                  onClick={clearConversation}
                  className="text-sm transition-colors flex items-center px-3 py-1 rounded border backdrop-blur-sm"
                  style={{ 
                    color: '#6b7280', 
                    backgroundColor: 'rgba(182, 157, 116, 0.08)',
                    borderColor: 'rgba(182, 157, 116, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#1f2839';
                    e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6b7280';
                    e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.08)';
                  }}
                >
                  <RefreshCw className="mr-1 w-4 h-4" />
                  Clear Conversation
                </button>
              )}
            </div>
            
            <div className="flex mb-6">
              <input
                type="text"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                placeholder="Type your question for the witness..."
                className="flex-1 px-5 py-3 border-2 rounded-l-lg focus:outline-none focus:ring-1 transition-all duration-200 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: '#1f2839'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#b69d74';
                  e.target.style.boxShadow = '0 0 0 2px rgba(182, 157, 116, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
              />
              <button 
                className="px-5 py-3 text-white rounded-r-lg transition-all duration-200 flex items-center border border-l-0"
                style={{
                  background: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
                  borderColor: 'rgba(182, 157, 116, 0.3)'
                }}
                onClick={askQuestion}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 0 15px rgba(182, 157, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              >
                <Send className="mr-2 w-4 h-4" />
                Ask
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 py-2">
              {questions.length > 0 ? (
                questions.map((q) => (
                  <div key={q.id} className="border rounded-lg p-4 backdrop-blur-sm" 
                       style={{ 
                         borderColor: 'rgba(182, 157, 116, 0.2)', 
                         backgroundColor: 'rgba(182, 157, 116, 0.05)' 
                       }}>
                    <div className="flex items-start">
                      <div className="p-2 rounded-full mr-3 flex-shrink-0 backdrop-blur-sm border" 
                           style={{ 
                             backgroundColor: 'rgba(182, 157, 116, 0.1)', 
                             borderColor: 'rgba(182, 157, 116, 0.2)' 
                           }}>
                        <Users className="w-4 h-4" style={{ color: '#b69d74' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium" style={{ color: '#1f2839' }}>You</p>
                          <span className="text-xs" style={{ color: '#6b7280' }}>{q.timestamp}</span>
                        </div>
                        <p className="p-3 rounded-lg backdrop-blur-sm border" 
                           style={{ 
                             color: '#1f2839', 
                             backgroundColor: 'rgba(255, 255, 255, 0.8)',
                             borderColor: 'rgba(182, 157, 116, 0.2)'
                           }}>{q.text}</p>
                        <div className="mt-3 p-3 rounded-lg backdrop-blur-sm border" 
                             style={{ 
                               backgroundColor: 'rgba(182, 157, 116, 0.08)',
                               borderColor: 'rgba(182, 157, 116, 0.2)'
                             }}>
                          <div className="flex items-center mb-2">
                            <div className="p-1 rounded-full mr-2 backdrop-blur-sm border" 
                                 style={{ 
                                   backgroundColor: 'rgba(182, 157, 116, 0.12)',
                                   borderColor: 'rgba(182, 157, 116, 0.3)'
                                 }}>
                              <Scale className="w-4 h-4" style={{ color: '#b69d74' }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#1f2839' }}>
                              AI Witness ({q.style})
                            </span>
                          </div>
                          <p style={{ color: '#1f2839' }}>{q.response}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 rounded-lg backdrop-blur-sm border" 
                     style={{ 
                       color: '#6b7280', 
                       backgroundColor: 'rgba(182, 157, 116, 0.05)',
                       borderColor: 'rgba(182, 157, 116, 0.2)'
                     }}>
                  <Gavel className="w-12 h-12 mx-auto mb-3" style={{ color: '#b69d74' }} />
                  <p className="text-lg">No questions asked yet.</p>
                  <p className="text-sm mt-1">Start by asking a question to the AI witness.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Timeline Outcomes Tab */}
        {activeTab === 'timelines' && (
          <div className="border rounded-lg p-6 mb-6 backdrop-blur-md" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.6)', 
                 borderColor: 'rgba(182, 157, 116, 0.2)',
                 boxShadow: '0 0 25px rgba(182, 157, 116, 0.15)'
               }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1f2839' }}>Parallel Timeline Outcomes</h3>
              <div className="text-sm px-3 py-1 rounded-full border backdrop-blur-sm" 
                   style={{ 
                     color: '#6b7280', 
                     backgroundColor: 'rgba(182, 157, 116, 0.08)',
                     borderColor: 'rgba(182, 157, 116, 0.2)'
                   }}>
                {timelineOutcomes.length} Scenarios Generated
              </div>
            </div>
            
            <div className="mb-8">
              <button 
                className="px-6 py-3 text-white rounded-lg transition-all duration-200 flex items-center backdrop-blur-md border"
                style={{
                  background: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  boxShadow: '0 0 15px rgba(182, 157, 116, 0.3)'
                }}
                onClick={simulateTimelines}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 0 25px rgba(182, 157, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 0 15px rgba(182, 157, 116, 0.3)';
                }}
              >
                <Calendar className="mr-2 w-4 h-4" />
                Generate Timeline Scenarios
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {timelineOutcomes.length > 0 ? (
                timelineOutcomes.map((timeline, index) => (
                  <div key={index} 
                       className="border rounded-lg p-5 transition-all duration-200 backdrop-blur-sm cursor-pointer" 
                       style={{ 
                         borderColor: 'rgba(182, 157, 116, 0.2)',
                         backgroundColor: 'rgba(255, 255, 255, 0.3)'
                       }}
                       onMouseEnter={(e) => {
                         e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.08)';
                         e.target.style.borderColor = 'rgba(182, 157, 116, 0.4)';
                         e.target.style.transform = 'translateY(-2px)';
                         e.target.style.boxShadow = '0 0 20px rgba(182, 157, 116, 0.2)';
                       }}
                       onMouseLeave={(e) => {
                         e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                         e.target.style.borderColor = 'rgba(182, 157, 116, 0.2)';
                         e.target.style.transform = 'translateY(0)';
                         e.target.style.boxShadow = 'none';
                       }}>
                    <h4 className="font-semibold mb-3 text-lg" style={{ color: '#1f2839' }}>{timeline.title}</h4>
                    <div className="flex justify-between items-center mb-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm" 
                            style={{ 
                              color: '#10b981', 
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              borderColor: 'rgba(16, 185, 129, 0.3)'
                            }}>
                        Success: {timeline.successProbability}
                      </span>
                      <span className="text-sm" style={{ color: '#6b7280' }}>{timeline.duration}</span>
                    </div>
                    <ul className="space-y-3">
                      {timeline.steps.map((step, i) => (
                        <li key={i} className="flex items-start">
                          <Timer className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#b69d74' }} />
                          <span className="text-sm" style={{ color: '#1f2839' }}>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 rounded-lg backdrop-blur-sm border" 
                     style={{ 
                       color: '#6b7280', 
                       backgroundColor: 'rgba(182, 157, 116, 0.05)',
                       borderColor: 'rgba(182, 157, 116, 0.2)'
                     }}>
                  <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#b69d74' }} />
                  <p className="text-lg">No timeline scenarios generated yet.</p>
                  <p className="text-sm mt-1">Click the button to explore different case outcomes.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* AI Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="border rounded-lg p-6 backdrop-blur-md" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.6)', 
                 borderColor: 'rgba(182, 157, 116, 0.2)',
                 boxShadow: '0 0 25px rgba(182, 157, 116, 0.15)'
               }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1f2839' }}>AI Jury/Bench Feedback</h3>
              {feedback && (
                <div className="text-sm px-3 py-1 rounded-full border backdrop-blur-sm" 
                     style={{ 
                       color: '#6b7280', 
                       backgroundColor: 'rgba(182, 157, 116, 0.08)',
                       borderColor: 'rgba(182, 157, 116, 0.2)'
                     }}>
                  Score: {feedback.overallScore}/100
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <button 
                className="px-6 py-3 text-white rounded-lg transition-all duration-200 flex items-center backdrop-blur-md border"
                style={{
                  background: 'linear-gradient(135deg, #b69d74, #b69d74DD, #b69d74BB)',
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  boxShadow: '0 0 15px rgba(182, 157, 116, 0.3)'
                }}
                onClick={getFeedback}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 0 25px rgba(182, 157, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 0 15px rgba(182, 157, 116, 0.3)';
                }}
              >
                <Award className="mr-2 w-4 h-4" />
                Request Feedback
              </button>
            </div>
            
            {feedback ? (
              <div>
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        style={{ color: 'rgba(182, 157, 116, 0.2)' }}
                      />
                      <circle
                        className="stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * feedback.overallScore) / 100}
                        transform="rotate(-90 50 50)"
                        style={{ color: '#b69d74' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold" style={{ color: '#1f2839' }}>{feedback.overallScore}</span>
                      <span className="text-sm" style={{ color: '#6b7280' }}>out of 100</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {feedback.criteria.map((criterion, index) => (
                    <div key={index} 
                         className="border rounded-lg p-4 transition-all duration-200 backdrop-blur-sm" 
                         style={{ 
                           borderColor: 'rgba(182, 157, 116, 0.2)',
                           backgroundColor: 'rgba(255, 255, 255, 0.3)'
                         }}
                         onMouseEnter={(e) => {
                           e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.08)';
                           e.target.style.borderColor = 'rgba(182, 157, 116, 0.4)';
                         }}
                         onMouseLeave={(e) => {
                           e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                           e.target.style.borderColor = 'rgba(182, 157, 116, 0.2)';
                         }}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium" style={{ color: '#1f2839' }}>{criterion.name}</h4>
                        <span className="font-bold" style={{ color: '#1f2839' }}>{criterion.score}/100</span>
                      </div>
                      <div className="w-full rounded-full h-2.5 mb-1 backdrop-blur-sm" 
                           style={{ backgroundColor: 'rgba(182, 157, 116, 0.2)' }}>
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${criterion.score}%`,
                            background: 'linear-gradient(90deg, #b69d74, #b69d74CC)'
                          }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#6b7280' }}>
                        {criterion.score >= 90 ? 'Excellent' : 
                         criterion.score >= 80 ? 'Very Good' : 
                         criterion.score >= 70 ? 'Good' : 
                         criterion.score >= 60 ? 'Fair' : 'Needs Improvement'}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-6" style={{ borderColor: 'rgba(182, 157, 116, 0.2)' }}>
                  <h4 className="font-medium mb-4 text-lg" style={{ color: '#1f2839' }}>Feedback Comments</h4>
                  <ul className="space-y-3">
                    {feedback.comments.map((comment, index) => (
                      <li key={index} 
                          className="flex items-start p-3 rounded-lg backdrop-blur-sm border" 
                          style={{ 
                            backgroundColor: 'rgba(182, 157, 116, 0.05)',
                            borderColor: 'rgba(182, 157, 116, 0.2)'
                          }}>
                        <Lightbulb className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#b69d74' }} />
                        <span style={{ color: '#1f2839' }}>{comment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 rounded-lg backdrop-blur-sm border" 
                   style={{ 
                     color: '#6b7280', 
                     backgroundColor: 'rgba(182, 157, 116, 0.05)',
                     borderColor: 'rgba(182, 157, 116, 0.2)'
                   }}>
                <BarChart3 className="w-12 h-12 mx-auto mb-3" style={{ color: '#b69d74' }} />
                <p className="text-lg">No feedback yet.</p>
                <p className="text-sm mt-1">Click the button to get AI evaluation of your performance.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}