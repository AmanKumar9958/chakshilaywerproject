import React from 'react';

const Career = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Career Hub</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Career Planning */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Career Planning</h3>
              <p className="text-blue-600 mb-4">Plan your legal career path with expert guidance.</p>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Legal specialization roadmaps</li>
                <li>• Skills assessment tools</li>
                <li>• Career timeline planning</li>
              </ul>
            </div>

            {/* Job Opportunities */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Job Opportunities</h3>
              <p className="text-green-600 mb-4">Explore legal job openings and internships.</p>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Law firm positions</li>
                <li>• Corporate legal roles</li>
                <li>• Government opportunities</li>
              </ul>
            </div>

            {/* Professional Development */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">Professional Development</h3>
              <p className="text-purple-600 mb-4">Enhance your legal skills and knowledge.</p>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• Certification programs</li>
                <li>• Continuing education</li>
                <li>• Professional networking</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;