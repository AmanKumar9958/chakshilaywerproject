import React, { useState } from 'react';
import { FiCalendar, FiUsers, FiAward, FiClock, FiBook, FiFileText, FiVideo } from 'react-icons/fi';

const MootCourt = () => {
  const [competitions] = useState([
    {
      id: 1,
      title: 'International Law Moot Court Competition',
      date: '2025-10-15',
      status: 'Upcoming',
      participants: 24,
      type: 'International',
      registrationDeadline: '2025-10-01'
    },
    {
      id: 2,
      title: 'Constitutional Law Moot',
      date: '2025-11-05',
      status: 'Registration Open',
      participants: 16,
      type: 'National',
      registrationDeadline: '2025-10-20'
    },
    {
      id: 3,
      title: 'Criminal Law Mock Trial',
      date: '2025-12-01',
      status: 'Registration Open',
      participants: 12,
      type: 'University',
      registrationDeadline: '2025-11-15'
    }
  ]);

  const resources = [
    {
      icon: FiBook,
      title: 'Preparation Guidelines',
      description: 'Learn how to prepare for moot court competitions'
    },
    {
      icon: FiFileText,
      title: 'Past Problems',
      description: 'Access previous moot court problems and solutions'
    },
    {
      icon: FiVideo,
      title: 'Video Resources',
      description: 'Watch recordings of past moot court sessions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moot Court Competitions</h1>
          <p className="text-lg text-gray-600">Professional legal advocacy training and competitions</p>
        </div>

        {/* Competitions Grid */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Competitions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map(competition => (
              <div key={competition.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <FiAward className="text-purple-600 text-lg" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-purple-600">{competition.type}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${competition.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {competition.status}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{competition.title}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiCalendar className="mr-2 text-gray-400" size={16} />
                      <span>Competition: {competition.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiClock className="mr-2 text-gray-400" size={16} />
                      <span>Register by: {competition.registrationDeadline}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiUsers className="mr-2 text-gray-400" size={16} />
                      <span>{competition.participants} teams registered</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium transition-colors">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <button 
                key={index}
                className="p-4 text-left bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <resource.icon className="text-purple-600 text-lg" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MootCourt;