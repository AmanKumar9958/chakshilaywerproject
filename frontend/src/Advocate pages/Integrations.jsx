import React, { useState } from "react";

const ComparisonResults = ({ results, file1, file2 }) => {
  if (!results) return null;

  if (typeof results === 'string') {
    return (
      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Comparison Results</h3>
        <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-gray-50 p-4 rounded">
          {results}
        </pre>
      </div>
    );
  }

  const hasContent = (value) => {
    return value && Array.isArray(value) && value.length > 0;
  };

  const hasText = (value) => {
    return value && typeof value === 'string' && value.trim().length > 0;
  };

  return (
    <div className="mt-6 bg-white p-4 md:p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Comparison Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-800 text-sm mb-1">Document 1:</h4>
          <p className="text-gray-600 text-sm truncate">{file1?.name || 'Unknown file'}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-800 text-sm mb-1">Document 2:</h4>
          <p className="text-gray-600 text-sm truncate">{file2?.name || 'Unknown file'}</p>
        </div>
      </div>
      
      {hasText(results.summary) && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-2">Summary</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{results.summary}</p>
        </div>
      )}
      
      {hasContent(results.differences) && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Key Differences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-medium text-red-600 text-sm mb-2">In {file1?.name}:</h5>
              <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                {results.differences
                  .filter(diff => typeof diff === 'string' && diff.includes('only in Document 1'))
                  .map((diff, index) => (
                    <li key={index}>{diff}</li>
                  ))}
              </ul>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-medium text-red-600 text-sm mb-2">In {file2?.name}:</h5>
              <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
                {results.differences
                  .filter(diff => typeof diff === 'string' && diff.includes('only in Document 2'))
                  .map((diff, index) => (
                    <li key={index}>{diff}</li>
                  ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-3 rounded-lg">
            <h5 className="font-medium text-red-600 text-sm mb-2">General Differences</h5>
            <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
              {results.differences
                .filter(diff => typeof diff === 'string' && 
                  !diff.includes('only in Document 1') && 
                  !diff.includes('only in Document 2'))
                .map((diff, index) => (
                  <li key={index}>{diff}</li>
                ))}
            </ul>
          </div>
        </div>
      )}
      
      {hasContent(results.similarities) && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-2">Similarities</h4>
          <ul className="list-disc pl-4 text-gray-600 text-sm space-y-1">
            {results.similarities.map((similarity, index) => (
              <li key={index}>{similarity}</li>
            ))}
          </ul>
        </div>
      )}
      
      {hasText(results.riskAssessment) && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 text-sm mb-1">Risk Assessment</h4>
          <p className="text-amber-700 text-sm">{results.riskAssessment}</p>
        </div>
      )}
      
      {!hasText(results.summary) && !hasContent(results.differences) && 
       !hasContent(results.similarities) && !hasText(results.riskAssessment) && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-800 text-sm mb-2">Raw Response</h4>
          <pre className="whitespace-pre-wrap text-xs text-gray-600 overflow-auto max-h-60">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default function Documents() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonStatus, setComparisonStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      const newFiles = Array.from(files);
      const pdfFiles = newFiles.filter(file => 
        file.type === 'application/pdf' && file.size <= MAX_FILE_SIZE
      );
      
      const nonPdfFiles = newFiles.filter(file => file.type !== 'application/pdf');
      const oversizedFiles = newFiles.filter(file => 
        file.type === 'application/pdf' && file.size > MAX_FILE_SIZE
      );
      
      if (nonPdfFiles.length > 0) {
        alert(`${nonPdfFiles.length} non-PDF file(s) were ignored. Only PDF files are supported.`);
      }
      
      if (oversizedFiles.length > 0) {
        alert(`${oversizedFiles.length} file(s) exceed the ${formatFileSize(MAX_FILE_SIZE)} limit.`);
      }
      
      if (pdfFiles.length > 0) {
        setUploadedFiles([...uploadedFiles, ...pdfFiles]);
        setComparisonResult(null);
        setError(null);
      }
    }
  };

  const handleFileInputChange = (e) => {
    handleFileUpload(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const processComparisonData = (data) => {
    if (data.summary || data.differences || data.similarities) {
      return data;
    }
    
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    }
    
    if (data.comparison_results) {
      return {
        summary: data.comparison_summary,
        differences: data.comparison_results.differences || [],
        similarities: data.comparison_results.similarities || [],
        riskAssessment: data.risk_assessment
      };
    }
    
    return data;
  };

  const handleCompareContracts = async () => {
    if (uploadedFiles.length < 2) {
      setError("Please upload exactly 2 PDF contracts to compare.");
      return;
    }

    if (uploadedFiles[0].type !== 'application/pdf' || uploadedFiles[1].type !== 'application/pdf') {
      setError("Only PDF files can be compared.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", uploadedFiles[0]);
    formData.append("file2", uploadedFiles[1]);

    setLoading(true);
    setError(null);
    setComparisonStatus("Preparing documents for comparison...");
    
    try {
      const response = await fetch(
        "https://n8n.srv983857.hstgr.cloud/webhook/a027ab82-e53c-4246-9982-c41c79ac9bca",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      let data = await response.json();
      
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          data = { rawResponse: data };
        }
      }
      
      const processedData = processComparisonData(data);
      setComparisonResult(processedData);
      setComparisonStatus("Comparison completed successfully!");
      
      setTimeout(() => setComparisonStatus(""), 3000);
    } catch (err) {
      console.error("Error comparing contracts:", err);
      
      if (err.message.includes("Failed to fetch")) {
        setError("Network error: Could not connect to the comparison service.");
      } else if (err.message.includes("Server error")) {
        setError(`Server error: ${err.message}`);
      } else {
        setError("Failed to compare contracts. The service might be temporarily unavailable.");
      }
      
      setComparisonStatus("Comparison failed!");
    }
    setLoading(false);
  };

  const clearComparison = () => {
    setComparisonResult(null);
    setError(null);
    setComparisonStatus("");
  };

  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    setComparisonResult(null);
    setError(null);
    setComparisonStatus("");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Contract Comparison Tool</h2>
        <p className="text-gray-600">Upload two PDF contracts to compare their contents</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-colors cursor-pointer ${
            isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="text-3xl mb-3">📄</div>
            <p className="text-lg font-medium text-gray-800 mb-1">
              Drag & drop PDF files here
            </p>
            <p className="text-gray-600 text-sm mb-3">or click to browse</p>
            <button className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm">
              Select PDF Files
            </button>
            <p className="text-gray-400 text-xs mt-3">Max file size: {formatFileSize(MAX_FILE_SIZE)}</p>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <div className="flex items-center min-w-0">
                    <span className="text-gray-600 mr-3">📄</span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{file.name}</p>
                      <p className="text-gray-600 text-xs">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-600 hover:text-gray-800 text-xs bg-white border border-gray-300 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCompareContracts}
            disabled={loading || uploadedFiles.length < 2}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-1 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comparing...
              </>
            ) : (
              "Compare Contracts"
            )}
          </button>
          
          <button
            onClick={() => {
              setComparisonResult({
                summary: "The contracts have 5 significant differences and 3 similarities.",
                differences: [
                  "Clause 4.2: Payment terms are 30 days in Document 1 but 45 days in Document 2",
                  "Clause 7.1: Liability cap is $100,000 in Document 1 but unlimited in Document 2",
                  "Document 1 includes a non-compete clause missing in Document 2",
                  "Document 2 includes an arbitration clause missing in Document 1"
                ],
                similarities: [
                  "Both contracts have identical confidentiality clauses",
                  "Termination conditions are the same in both documents",
                  "Intellectual property rights allocation is identical"
                ],
                riskAssessment: "Document 2 presents higher financial risk due to unlimited liability cap."
              });
            }}
            className="bg-gray-600 text-white px-4 py-3 rounded-md hover:bg-gray-700 transition-colors text-sm"
          >
            Test with Sample
          </button>
          
          {comparisonResult && (
            <button
              onClick={clearComparison}
              className="bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              Clear Results
            </button>
          )}
        </div>
        
        {comparisonStatus && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-gray-800 text-sm">{comparisonStatus}</p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-red-800 text-sm">Error</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Comparison Results */}
      <ComparisonResults 
        results={comparisonResult} 
        file1={uploadedFiles[0]} 
        file2={uploadedFiles[1]} 
      />
    </div>
  );
}