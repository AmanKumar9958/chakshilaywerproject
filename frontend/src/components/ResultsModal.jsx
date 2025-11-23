import React, { useState, useEffect } from 'react';
import { translateToMultipleLanguages, SUPPORTED_LANGUAGES } from '../lib/translationService';

const ResultsModal = ({ isOpen, onClose, result, title, type }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [displayText, setDisplayText] = useState('');

  // Process result based on type
  useEffect(() => {
    if (result && isOpen) {
      let processedText = '';
      
      if (typeof result === 'string') {
        processedText = result;
      } else if (typeof result === 'object') {
        processedText = JSON.stringify(result, null, 2);
      }
      
      setDisplayText(processedText);
      setTranslations({ en: processedText });
    }
  }, [result, isOpen]);

  // Handle language change and translation
  const handleLanguageChange = async (langCode) => {
    setSelectedLanguage(langCode);
    
    if (langCode !== 'en' && !translations[langCode] && displayText) {
      setIsTranslating(true);
      try {
        const multiTranslations = await translateToMultipleLanguages(displayText);
        setTranslations(prev => ({
          ...prev,
          hi: multiTranslations.hindi,
          ta: multiTranslations.tamil
        }));
      } catch (error) {
        console.error('Translation failed:', error);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const getCurrentLanguage = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);
  };

  const getResultIcon = () => {
    switch (type) {
      case 'comparison':
        return '⚖️';
      case 'risk':
        return '⚠️';
      case 'summary':
        return '📋';
      case 'compliance':
        return '✅';
      default:
        return '📄';
    }
  };

  const formatDisplayText = (text, resultData) => {
    if (!text && !resultData) return '';
    
    // Handle comparison results specially
    if (type === 'comparison' && resultData?.comparison) {
      return (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">
                {resultData.comparison.summary.similarity}
              </div>
              <div className="text-sm text-gray-600 mt-1">Similarity Score</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">
                {resultData.comparison.summary.totalDifferences}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Changes</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {resultData.comparison.summary.addedContent}
              </div>
              <div className="text-sm text-gray-600 mt-1">Added Lines</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600">
                {resultData.comparison.summary.removedContent}
              </div>
              <div className="text-sm text-gray-600 mt-1">Removed Lines</div>
            </div>
          </div>

          {/* Key Changes Section */}
          {resultData.comparison.keyChanges && resultData.comparison.keyChanges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                🔑 <span>Key Changes Detected</span>
              </h3>
              <div className="space-y-3">
                {resultData.comparison.keyChanges.map((change, index) => (
                  <div key={index} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                    <div className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      {change.field}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-2 rounded border border-red-200">
                        <span className="text-gray-600 block mb-1">📄 Document 1:</span>
                        <span className="text-red-600 font-medium">{change.document1}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-green-200">
                        <span className="text-gray-600 block mb-1">📄 Document 2:</span>
                        <span className="text-green-600 font-medium">{change.document2}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Differences Section */}
          {resultData.comparison.differences && resultData.comparison.differences.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                📝 <span>Line-by-Line Changes ({resultData.comparison.differences.length})</span>
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {resultData.comparison.differences.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${
                      diff.type === 'added'
                        ? 'bg-green-50 border-green-500'
                        : diff.type === 'removed'
                        ? 'bg-red-50 border-red-500'
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        {diff.location || `Line ${diff.lineNumber}`} • {diff.type.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        diff.severity === 'high' ? 'bg-red-100 text-red-800' :
                        diff.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {diff.severity || 'info'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {diff.description}
                    </p>
                    {diff.recommendation && (
                      <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        💡 {diff.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          {resultData.comparison.metadata && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>📁 Documents: {resultData.comparison.metadata.document1} vs {resultData.comparison.metadata.document2}</p>
                <p>📅 Comparison Date: {new Date(resultData.comparison.metadata.comparisonDate).toLocaleString()}</p>
                <p>🔧 Tool: {resultData.comparison.metadata.tool}</p>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // If it's compliance tasks (numbered list)
    if (text && text.includes('1.') && text.includes('2.')) {
      return text.split(/\d+\./).filter(item => item.trim()).map((item, index) => (
        <div key={index} className="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
              {index + 1}
            </span>
            <p className="text-gray-700 text-sm leading-relaxed">{item.trim()}</p>
          </div>
        </div>
      ));
    }
    
    // For other types, split by sentences
    if (text) {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      if (sentences.length > 3) {
        return sentences.map((sentence, index) => (
          <p key={index} className="mb-2 text-gray-700 leading-relaxed">
            {sentence.trim()}{sentence.trim() && '.'}
          </p>
        ));
      }
      
      // Default formatting
      return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>;
    }
    
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getResultIcon()}</span>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-blue-100 text-sm">API Response Results</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Select Language:</span>
            <div className="flex gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedLanguage === lang.code
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  disabled={isTranslating}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
            {isTranslating && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm">Translating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Showing results in:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {getCurrentLanguage()?.flag} {getCurrentLanguage()?.nativeName}
            </span>
          </div>

          <div className="bg-white rounded-lg">
            {isTranslating ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Translating content...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {formatDisplayText(translations[selectedLanguage] || displayText, result)}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>📊 Generated by AI</span>
              <span>🔒 Secure Processing</span>
              <span>⚡ Real-time Translation</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const textToDownload = translations[selectedLanguage] || displayText;
                  const blob = new Blob([textToDownload], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${selectedLanguage}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                📥 Download
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
