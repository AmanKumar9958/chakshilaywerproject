import React from 'react';

const StudentAllFeatures = () => {
  const features = [
    'Dashboard', 'Courses', 'Assignments', 'Calendar', 'Career',
    'Content Feed', 'Exam Prep', 'Library', 'Research'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">All Features</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f} className="border rounded-lg p-4 hover:shadow transition">
                <h3 className="font-semibold text-gray-800">{f}</h3>
                <p className="text-sm text-gray-600">Explore {f} tools and resources.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAllFeatures;