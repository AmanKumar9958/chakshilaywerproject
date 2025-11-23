import React, { useState } from "react";

const ContentStudio = () => {
  const [selectedCase, setSelectedCase] = useState("property");
  const [userChoice, setUserChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const caseTypes = [
    { 
      value: "property", 
      label: "Property Dispute", 
      difficulty: "Intermediate"
    },
    { 
      value: "consumer", 
      label: "Consumer Case", 
      difficulty: "Beginner"
    },
    { 
      value: "divorce", 
      label: "Divorce Case", 
      difficulty: "Advanced"
    },
  ];

  const scenarios = {
    property: {
      title: "Property Boundary Dispute",
      description: "A complex case involving disputed property boundaries",
      witnessStatement: "I have seen the defendant constructing a wall that encroaches 2 feet into the plaintiff's property based on the original survey map.",
      duration: "15 mins",
      questions: [
        { 
          id: 1, 
          text: "How long have you been residing in the neighborhood?", 
          feedback: "Good question. This establishes credibility and witness reliability.",
          score: 3,
          type: "credibility"
        },
        { 
          id: 2, 
          text: "Are you a certified surveyor or trained in property measurement?", 
          feedback: "Excellent. This challenges expertise and qualification to testify.",
          score: 5,
          type: "expertise"
        },
        { 
          id: 3, 
          text: "What were you doing on the plaintiff's property that day?", 
          feedback: "Weak. Irrelevant to the dispute and doesn't advance your case.",
          score: 1,
          type: "irrelevant"
        }
      ]
    },
    consumer: {
      title: "Defective Product Complaint",
      description: "Consumer protection case with warranty disputes",
      witnessStatement: "The smartphone I purchased from the defendant's company stopped working after 2 weeks, and they refused to honor the warranty.",
      duration: "12 mins",
      questions: [
        { 
          id: 1, 
          text: "Did you attempt to contact customer service before filing?", 
          feedback: "Relevant. Establishes proper process and mitigation efforts.",
          score: 4,
          type: "process"
        },
        { 
          id: 2, 
          text: "What were you doing when the phone stopped working?", 
          feedback: "Good. Reveals potential misuse or normal usage patterns.",
          score: 4,
          type: "causation"
        },
        { 
          id: 3, 
          text: "Do you always buy expensive smartphones?", 
          feedback: "Poor. Irrelevant to the warranty claim and unprofessional.",
          score: 1,
          type: "irrelevant"
        }
      ]
    },
    divorce: {
      title: "Divorce Settlement Dispute",
      description: "Family law case with asset division complexities",
      witnessStatement: "The couple has been living separately for 2 years, and attempts at reconciliation have failed.",
      duration: "18 mins",
      questions: [
        { 
          id: 1, 
          text: "Did both parties attempt mediation before filing?", 
          feedback: "Good. Courts prefer mediation and this shows due process.",
          score: 4,
          type: "procedure"
        },
        { 
          id: 2, 
          text: "Were there agreements about property division?", 
          feedback: "Excellent. Directly relevant to settlement negotiations.",
          score: 5,
          type: "substance"
        },
        { 
          id: 3, 
          text: "Do you think divorce is morally acceptable?", 
          feedback: "Weak. Irrelevant, personal, and potentially objectionable.",
          score: 1,
          type: "irrelevant"
        }
      ]
    }
  };

  const handleCaseChange = (caseType) => {
    setSelectedCase(caseType);
    setUserChoice(null);
    setShowFeedback(false);
    setIsPlaying(false);
  };

  const handleQuestionSelect = (question) => {
    setUserChoice(question);
    setShowFeedback(true);
    setScore(prev => prev + question.score);
    setQuestionsAnswered(prev => prev + 1);
  };

  const resetDemo = () => {
    setUserChoice(null);
    setShowFeedback(false);
  };

  const toggleVideoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetScore = () => {
    setScore(0);
    setQuestionsAnswered(0);
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'expertise': return 'bg-green-50 text-green-700 border-green-200';
      case 'credibility': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'procedure': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'substance': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'process': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'causation': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <section className="min-h-screen py-8 md:py-16 lg:py-20 relative overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gray-100/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/6 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-gray-50/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-44 h-44 md:w-60 md:h-60 lg:w-72 lg:h-72 bg-gray-100/30 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(229,231,235,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(229,231,235,0.5)_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] opacity-30"></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/10 to-gray-100/20"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">{/* Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 lg:mb-8 shadow-lg border border-gray-200">
            <span className="text-sm md:text-base lg:text-lg font-bold text-gray-700">CS</span>
          </div>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight">
              Virtual Courtroom Experience
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium px-4 md:px-0">
              Step into the future of legal education. Practice cross-examination, observe real cases, 
              and develop your advocacy skills in our immersive courtroom simulator.
            </p>
          </div>
        </div>

        {/* Case Type Selector */}
        <div className="mb-10 md:mb-12 lg:mb-16">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6 lg:mb-8 text-center">Choose Your Practice Area</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {caseTypes.map((caseType) => {
              const isSelected = selectedCase === caseType.value;
              
              return (
                <button
                  key={caseType.value}
                  className={`group relative overflow-hidden text-left transition-all duration-300 transform hover:scale-105 hover:bg-gray-50 rounded-2xl border-2 ${
                    isSelected 
                      ? 'border-gray-400 bg-gray-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm hover:shadow-md'
                  }`}
                  onClick={() => handleCaseChange(caseType.value)}
                >
                  <div className="p-4 md:p-6 lg:p-8 h-full">
                    <div className="flex items-start gap-3 md:gap-4 lg:gap-6">
                      <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        <span className="text-xs md:text-sm lg:text-base font-bold">{caseType.label.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-base md:text-lg lg:text-xl font-bold mb-2 md:mb-3 transition-colors duration-300 ${
                          isSelected ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                        }`}>{caseType.label}</h4>
                        <p className={`text-sm md:text-base mb-3 md:mb-4 leading-relaxed transition-colors duration-300 ${
                          isSelected ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {scenarios[caseType.value].description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 lg:gap-4">
                          <span className={`text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full border font-semibold transition-all duration-300 ${
                            caseType.difficulty === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200' :
                            caseType.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {caseType.difficulty}
                          </span>
                          <div className="flex items-center gap-1 md:gap-2">
                            <span className="text-xs text-gray-500 font-medium">Duration:</span>
                            <span className="text-sm text-gray-700 font-medium">
                              {scenarios[caseType.value].duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Score Dashboard */}
        <div className="relative mb-10 md:mb-12 lg:mb-16">
          <div className="bg-white border-2 border-gray-200 p-4 md:p-6 lg:p-8 shadow-lg rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 lg:mb-8">
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-0">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                  <span className="text-xs md:text-sm lg:text-base font-bold text-gray-700">📊</span>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Performance Dashboard</h3>
              </div>
              <button 
                className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm md:text-base"
                onClick={resetScore}
              >
                Reset Score
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              <div className="text-center group">
                <div className={`relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl border-4 flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg bg-white ${
                  score >= 12 ? 'border-green-500' : 
                  score >= 8 ? 'border-blue-500' : 
                  score >= 4 ? 'border-yellow-500' : 'border-gray-300'
                }`}>
                  <span className={`text-xl md:text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                    score >= 12 ? 'text-green-600' : 
                    score >= 8 ? 'text-blue-600' : 
                    score >= 4 ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    {score}
                  </span>
                </div>
                <p className="text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1">Total Score</p>
                <p className="text-xs md:text-sm text-gray-600">Points Earned</p>
              </div>
              
              <div className="text-center group">
                <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl border-4 border-blue-500 bg-white flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <span className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">
                    {questionsAnswered}
                  </span>
                </div>
                <p className="text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1">Questions</p>
                <p className="text-xs md:text-sm text-gray-600">Answered</p>
              </div>
              
              <div className="text-center group">
                <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl border-4 border-green-500 bg-white flex items-center justify-center mx-auto mb-2 md:mb-3 lg:mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <span className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">
                    {questionsAnswered > 0 ? Math.round((score / (questionsAnswered * 5)) * 100) : 0}%
                  </span>
                </div>
                <p className="text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1">Accuracy</p>
                <p className="text-xs md:text-sm text-gray-600">Performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16 lg:mb-20">
          
          {/* Video Simulation */}
          <div className="relative">
            <div className="bg-white border-2 border-gray-200 p-4 md:p-6 lg:p-8 shadow-lg rounded-2xl">
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6 lg:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                  <span className="text-xs md:text-sm lg:text-base font-bold text-gray-700">📹</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">Observe the Case</h3>
                  <p className="text-gray-600 font-medium text-sm md:text-base">Watch real courtroom proceedings</p>
                </div>
              </div>
              
              <div 
                className={`relative rounded-2xl aspect-video flex items-center justify-center cursor-pointer group overflow-hidden transition-all duration-300 border-2 ${
                  isPlaying ? 'border-blue-400 bg-blue-50 shadow-lg' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                }`}
                onClick={toggleVideoPlay}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 via-transparent to-gray-900/20"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                  <div className="w-2 h-2 bg-gray-400/30 rounded-full absolute top-1/4 left-1/4 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400/40 rounded-full absolute top-3/4 right-1/3 animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="w-1 h-1 bg-gray-400/50 rounded-full absolute bottom-1/4 left-1/2 animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
                
                <div className="relative z-10 text-center">
                  <div className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mb-3 md:mb-4 lg:mb-6 transition-all duration-300 shadow-lg ${
                    isPlaying ? 'scale-110 border-blue-400' : 'group-hover:scale-110 hover:border-gray-400'
                  }`}>
                    {isPlaying ? (
                      <span className="text-xs md:text-sm lg:text-base font-bold text-gray-700">⏸️</span>
                    ) : (
                      <span className="text-xs md:text-sm lg:text-base font-bold text-gray-700">▶️</span>
                    )}
                  </div>
                  <h4 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 md:mb-2 lg:mb-3">
                    {scenarios[selectedCase].title}
                  </h4>
                  <p className="text-gray-600 font-medium text-sm md:text-base">
                    {isPlaying ? 'Playing simulation...' : 'Click to start simulation'}
                  </p>
                </div>
                
                {/* Progress Bar */}
                {isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-2 md:h-3 bg-gray-200 rounded-b-2xl">
                    <div className="h-full bg-blue-500 transition-all duration-1000 ease-linear rounded-bl-2xl" 
                         style={{ width: '70%' }}></div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 md:mt-6 lg:mt-8 gap-3 md:gap-4">
                <button 
                  className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base"
                  onClick={toggleVideoPlay}
                >
                  {isPlaying ? 'Pause Simulation' : 'Watch Simulation'}
                </button>
                
                <div className="flex items-center gap-1 md:gap-2 lg:gap-3 text-gray-600">
                  <span className="text-xs md:text-sm">🔊</span>
                  <span className="text-xs md:text-sm font-medium">Audio Enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Practice */}
          <div className="relative">
            <div className="bg-white border-2 border-gray-200 p-4 md:p-6 lg:p-8 shadow-lg rounded-2xl">
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6 lg:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                  <span className="text-xs md:text-sm lg:text-base font-bold text-gray-700">💼</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">Practice Cross-Examination</h3>
                  <p className="text-gray-600 font-medium text-sm md:text-base">Test your litigation skills</p>
                </div>
              </div>
              
              {/* Witness Statement */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-3 md:p-4 lg:p-6 mb-4 md:mb-6 lg:mb-8 shadow-sm">
                <div className="flex items-center gap-1 md:gap-2 lg:gap-3 mb-2 md:mb-3 lg:mb-4">
                  <span className="text-xs md:text-sm lg:text-base font-bold text-gray-700">👤</span>
                  <h4 className="text-sm md:text-base lg:text-lg font-bold text-gray-900">Witness Statement</h4>
                </div>
                <p className="text-gray-800 leading-relaxed font-medium text-sm md:text-base">
                  "{scenarios[selectedCase].witnessStatement}"
                </p>
              </div>

              {/* Question Selection */}
              <div className="mb-4 md:mb-6 lg:mb-8">
                <h4 className="text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6">
                  Choose your cross-examination question:
                </h4>
                <div className="space-y-2 md:space-y-3 lg:space-y-4">
                  {scenarios[selectedCase].questions.map((question) => (
                    <button
                      key={question.id}
                      className={`w-full text-left transition-all duration-300 transform hover:scale-[1.02] rounded-2xl border-2 ${
                        userChoice?.id === question.id 
                          ? 'border-blue-400 bg-blue-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                      } ${showFeedback && userChoice?.id !== question.id ? 'opacity-50' : ''}`}
                      onClick={() => handleQuestionSelect(question)}
                      disabled={showFeedback && userChoice?.id !== question.id}
                    >
                      <div className="p-3 md:p-4 lg:p-6">
                        <div className="flex items-start gap-2 md:gap-3 lg:gap-4">
                          <div className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            userChoice?.id === question.id 
                              ? 'border-blue-500 bg-blue-500 shadow-sm' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            {userChoice?.id === question.id && (
                              <span className="text-xs font-bold text-white">✓</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 mb-1 md:mb-2 lg:mb-3 font-medium leading-relaxed text-sm md:text-base">{question.text}</p>
                            <span className={`text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full border font-semibold ${getQuestionTypeColor(question.type)}`}>
                              {question.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Feedback */}
              {showFeedback && userChoice && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
                  <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4 lg:mb-6">
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                      <span className="text-xs md:text-sm lg:text-base font-bold text-gray-700">🤖</span>
                    </div>
                    <h4 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">Expert AI Analysis</h4>
                  </div>
                  
                  <p className="text-gray-800 mb-3 md:mb-4 lg:mb-6 leading-relaxed font-medium text-sm md:text-base lg:text-lg">
                    {userChoice.feedback}
                  </p>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    <div className="flex items-center gap-1 md:gap-2 lg:gap-3">
                      <span className="text-xs md:text-sm lg:text-base font-bold text-gray-700">🏆</span>
                      <span className="text-sm md:text-base lg:text-lg font-bold text-green-600">
                        +{userChoice.score} points earned
                      </span>
                    </div>
                    
                    <button 
                      className="px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm md:text-base"
                      onClick={resetDemo}
                    >
                      Try Another Question →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="relative overflow-hidden">
          <div className="bg-white border-2 border-gray-200 p-6 md:p-8 lg:p-12 text-center shadow-lg rounded-2xl">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-4 left-4 md:top-6 md:left-6 w-24 h-24 md:w-32 md:h-32 bg-gray-100/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-28 h-28 md:w-40 md:h-40 bg-gray-50/30 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 bg-gray-100/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 lg:mb-8 shadow-lg border border-gray-200">
                <span className="text-sm md:text-base lg:text-lg font-bold text-gray-700">⭐</span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6">
                This is Just the Beginning
              </h3>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed">
                Experience the full Cross-Examination Simulator with detailed scoring, multiple rounds, 
                realistic courtroom environments, and comprehensive feedback with a premium subscription.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 lg:gap-6">
                <button className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg font-bold bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto">
                  Start Free Trial →
                </button>
                <button className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-sm md:text-base lg:text-lg w-full sm:w-auto">
                  View Full Features
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentStudio;