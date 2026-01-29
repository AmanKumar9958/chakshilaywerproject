import React, { useState } from 'react';
import { FiRefreshCw, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const AIHub = () => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const AI_HUB_URL = "https://chakshi.in/";

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`flex flex-col bg-gradient-to-br from-[#f5f5ef] to-[#f8f7f2] ${
        isFullscreen ? 'fixed inset-0 z-50' : 'fixed top-0 right-0 bottom-0'
      }`}
      style={isFullscreen ? {} : { left: '240px' }}
    >
      {/* iframe Container */}
      <div className="flex-1 overflow-hidden p-1">
        <div className="h-full w-full rounded overflow-hidden shadow-xl">
          <iframe
            key={iframeKey}
            src={AI_HUB_URL}
            title="AI Hub"
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default AIHub;
