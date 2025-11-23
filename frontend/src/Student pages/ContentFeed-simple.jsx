import React from 'react';

const ContentFeed = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Content Feed</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Latest Updates */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Latest Updates</h3>
              <p className="text-blue-600 mb-4">Stay updated with recent legal developments.</p>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Recent case law updates</li>
                <li>• Legislative changes</li>
                <li>• Court notifications</li>
              </ul>
            </div>

            {/* Study Materials */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Study Materials</h3>
              <p className="text-green-600 mb-4">Access curated learning content.</p>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Course materials</li>
                <li>• Practice papers</li>
                <li>• Video lectures</li>
              </ul>
            </div>

            {/* News & Articles */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">News & Articles</h3>
              <p className="text-purple-600 mb-4">Read legal news and expert articles.</p>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• Legal journalism</li>
                <li>• Expert opinions</li>
                <li>• Analysis articles</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentFeed;