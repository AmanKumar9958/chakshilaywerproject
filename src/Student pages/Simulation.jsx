import React, { useState } from 'react';

const Simulation = () => {
  const [activeTab, setActiveTab] = useState('courtroom');
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [simulationStatus, setSimulationStatus] = useState('idle');
  const [recording, setRecording] = useState(false);
  const [practiceMode, setPracticeMode] = useState('oral');

  // Mock data for cases
  const caseScenarios = {
    civil: [
      { id: 1, title: "Contract Breach: Sharma vs. Mehta", difficulty: "Intermediate", duration: "25 min" },
      { id: 2, title: "Property Dispute: Landmark Case", difficulty: "Advanced", duration: "35 min" },
      { id: 3, title: "Tort Law: Personal Injury Claim", difficulty: "Beginner", duration: "20 min" }
    ],
    criminal: [
      { id: 4, title: "State vs. Kumar: Theft Case", difficulty: "Beginner", duration: "20 min" },
      { id: 5, title: "Murder Trial: State vs. Singh", difficulty: "Advanced", duration: "40 min" },
      { id: 6, title: "Cyber Crime: Data Breach Case", difficulty: "Intermediate", duration: "30 min" }
    ],
    constitutional: [
      { id: 7, title: "Right to Privacy Challenge", difficulty: "Advanced", duration: "35 min" },
      { id: 8, title: "Free Speech vs. Hate Speech", difficulty: "Intermediate", duration: "25 min" }
    ],
    corporate: [
      { id: 9, title: "Merger Dispute: Tech Giants", difficulty: "Advanced", duration: "40 min" },
      { id: 10, title: "Shareholder Rights Case", difficulty: "Intermediate", duration: "30 min" }
    ]
  };

  // Mock data for practice modules
  const practiceModules = [
    {
      id: 'oral',
      title: 'Oral Arguments',
      description: 'Practice presenting your case to a virtual judge',
      icon: 'fas fa-microphone',
      tips: [
        'Maintain eye contact with the judge',
        'Speak clearly and at a moderate pace',
        'Structure your arguments logically',
        'Be prepared for interruptions and questions'
      ]
    },
    {
      id: 'cross',
      title: 'Cross Examination',
      description: 'Hone your questioning skills with AI witnesses',
      icon: 'fas fa-user-graduate',
      tips: [
        'Ask short, leading questions',
        'Control the witness without being argumentative',
        'Listen carefully to the answers',
        'Know when to stop questioning'
      ]
    },
    {
      id: 'opening',
      title: 'Opening Statements',
      description: 'Perfect your case introduction',
      icon: 'fas fa-flag',
      tips: [
        'Start with a compelling narrative',
        'Outline what you will prove',
        'Establish credibility',
        'Keep it concise and focused'
      ]
    },
    {
      id: 'closing',
      title: 'Closing Arguments',
      description: 'Master your case summation',
      icon: 'fas fa-gavel',
      tips: [
        'Summarize key evidence',
        'Connect facts to legal principles',
        'Address weaknesses in your case',
        'End with a powerful conclusion'
      ]
    }
  ];

  const startSimulation = () => {
    setSimulationStatus('running');
  };

  const toggleRecording = () => {
    setRecording(!recording);
  };

  const getSelectedCaseTitle = () => {
    const allCases = [
      ...caseScenarios.civil,
      ...caseScenarios.criminal,
      ...caseScenarios.constitutional,
      ...caseScenarios.corporate
    ];
    return allCases.find(c => c.id === selectedCase)?.title || '';
  };

  const renderCourtroomTab = () => (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Virtual Courtroom Environment</h2>
      <p className="text-gray-600 mb-4 md:mb-6">Select a role to begin your simulation experience</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {[
          { id: 'judge', title: 'Judge', icon: 'fas fa-gavel', desc: 'Preside over cases and manage proceedings' },
          { id: 'advocate', title: 'Advocate', icon: 'fas fa-scale-balanced', desc: 'Present arguments and represent clients' },
          { id: 'witness', title: 'Witness', icon: 'fas fa-user', desc: 'Provide testimony and respond to questions' }
        ].map(role => (
          <div 
            key={role.id}
            className={`p-4 md:p-6 rounded-lg border cursor-pointer transition-all ${
              selectedRole === role.id 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white mb-3 mx-auto">
              <i className={role.icon}></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{role.title}</h3>
            <p className="text-sm text-gray-600 text-center">{role.desc}</p>
          </div>
        ))}
      </div>
      
      {selectedRole && (
        <div className="mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Select a Case Scenario</h3>
          <div className="space-y-4 md:space-y-6">
            {Object.entries(caseScenarios).map(([category, cases]) => (
              <div key={category}>
                <h4 className="text-md md:text-lg font-medium text-blue-600 mb-2 pb-2 border-b border-gray-200 capitalize">
                  {category} Cases
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {cases.map(caseItem => (
                    <div 
                      key={caseItem.id} 
                      className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedCase === caseItem.id 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCase(caseItem.id)}
                    >
                      <h5 className="font-medium text-gray-900 mb-2 text-sm md:text-base">{caseItem.title}</h5>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md">{caseItem.difficulty}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md">{caseItem.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedCase && (
        <div className="pt-4 md:pt-6 border-t border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Ready to Begin</h3>
          <p className="text-gray-600 mb-4">
            You've selected <span className="font-semibold">{getSelectedCaseTitle()}</span> as {selectedRole}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors flex-1 sm:flex-none"
              onClick={startSimulation}
            >
              Start Simulation
            </button>
            
            <button 
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors flex items-center justify-center flex-1 sm:flex-none"
              onClick={toggleRecording}
            >
              <i className={`fas ${recording ? 'fa-stop-circle' : 'fa-record-vinyl'} mr-2`}></i>
              {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPracticeTab = () => (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Practice Modules</h2>
      <p className="text-gray-600 mb-4 md:mb-6">Select a practice mode to improve specific courtroom skills</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {practiceModules.map(module => (
          <div 
            key={module.id} 
            className={`p-4 md:p-5 rounded-lg border cursor-pointer transition-all ${
              practiceMode === module.id 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPracticeMode(module.id)}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                <i className={module.icon}></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
          {practiceModules.find(m => m.id === practiceMode)?.title} Practice
        </h3>
        <div className="mb-4 md:mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Tips for Success:</h4>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            {practiceModules.find(m => m.id === practiceMode)?.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors flex-1 sm:flex-none w-full sm:w-auto">
            Start Practice Session
          </button>
          <div className="bg-gray-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center flex-1 sm:flex-none w-full sm:w-auto">
            <i className="fas fa-clock mr-2"></i> 00:00
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkillsTab = () => (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Skill Development</h2>
      <p className="text-gray-600 mb-4 md:mb-6">Focus on specific areas to improve your courtroom performance</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {[
          { icon: 'fas fa-volume-up', title: 'Speaking Confidence', desc: 'Voice modulation, pacing, and projection exercises' },
          { icon: 'fas fa-users', title: 'Body Language', desc: 'Posture, gesture, and eye contact guidance' },
          { icon: 'fas fa-brain', title: 'Legal Reasoning', desc: 'Logic flow and argument structure improvement' },
          { icon: 'fas fa-hourglass-half', title: 'Time Management', desc: 'Practice within time limits and pacing' }
        ].map((skill, index) => (
          <div key={index} className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                <i className={skill.icon}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{skill.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{skill.desc}</p>
            <button className="text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 py-2 px-4 rounded-md font-medium transition-colors">
              Practice Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-6">
        <div className="bg-blue-700 text-white p-4 md:p-6 rounded-lg mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">LegalEagle Courtroom Simulation</h1>
          <p className="mt-1 md:mt-2 opacity-90">Practice your litigation skills in a realistic virtual environment</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {[
              { id: 'courtroom', label: 'Virtual Courtroom', icon: 'fas fa-gavel' },
              { id: 'practice', label: 'Practice Modules', icon: 'fas fa-dumbbell' },
              { id: 'skills', label: 'Skill Development', icon: 'fas fa-chart-line' }
            ].map(tab => (
              <button 
                key={tab.id}
                className={`flex-1 py-3 md:py-4 px-4 font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={tab.icon}></i>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {activeTab === 'courtroom' && renderCourtroomTab()}
          {activeTab === 'practice' && renderPracticeTab()}
          {activeTab === 'skills' && renderSkillsTab()}
        </div>
        
        {simulationStatus === 'running' && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Simulation in Progress</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSimulationStatus('idle')}
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="bg-gray-100 rounded-lg h-64 md:h-96 flex items-center justify-center mb-4 md:mb-6">
                <div className="text-center text-gray-600">
                  <i className="fas fa-vr-cardboard text-4xl md:text-6xl text-blue-600 mb-3"></i>
                  <p className="text-lg md:text-xl font-semibold">3D Courtroom Environment</p>
                  <p className="text-sm md:text-base mt-2">Simulation active - Role: {selectedRole}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors flex-1 sm:flex-none w-full sm:w-auto"
                  onClick={() => setSimulationStatus('idle')}
                >
                  End Simulation
                </button>
                <div className="bg-gray-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center flex-1 sm:flex-none w-full sm:w-auto">
                  <i className="fas fa-clock mr-2"></i> Elapsed Time: 05:32
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default Simulation;