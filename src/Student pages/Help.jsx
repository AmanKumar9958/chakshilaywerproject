import React from 'react';

const StudentHelp = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Help & Support</h1>
          <p className="text-gray-600 mb-2">Find answers to common questions or contact support.</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>How to use the dashboard</li>
            <li>Managing your assignments</li>
            <li>Accessing course materials</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentHelp;