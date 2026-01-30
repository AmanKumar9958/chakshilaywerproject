import React, { useState } from 'react';
// import DocumentComparison from './Documentcomparizon'; // Import the component

export default function Research() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // Dummy data - pre-populated documents
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Constitutional Law Research - Right to Privacy',
      type: 'research',
      description: 'Comprehensive analysis of landmark judgments on right to privacy under Article 21, including Puttaswamy case and subsequent developments.',
      fileName: 'privacy_research.pdf',
      sizeKb: 2048,
      uploadedAt: '2025-11-20T10:30:00',
    },
    {
      id: 2,
      title: 'Contract Law - Breach of Contract Analysis',
      type: 'research',
      description: 'Legal opinion on remedies available for breach of contract under Indian Contract Act, 1872.',
      fileName: 'contract_breach_opinion.docx',
      sizeKb: 512,
      uploadedAt: '2025-11-18T14:20:00',
    },
    {
      id: 3,
      title: 'Criminal Procedure Code - Section 144 Application',
      type: 'research',
      description: 'Brief on the constitutional validity of Section 144 CrPC and its application in public order situations.',
      fileName: 'section_144_brief.pdf',
      sizeKb: 1536,
      uploadedAt: '2025-11-15T09:15:00',
    },
    {
      id: 4,
      title: 'Property Rights Research Notes',
      type: 'research',
      description: 'Quick reference notes on property transfer laws and registration requirements in different states.',
      fileName: 'property_rights_notes.txt',
      sizeKb: 128,
      uploadedAt: '2025-11-12T16:45:00',
    },
    {
      id: 5,
      title: 'Environmental Law - NGT Jurisdiction',
      type: 'research',
      description: 'Research paper on the jurisdiction and powers of National Green Tribunal in environmental matters.',
      fileName: 'ngt_jurisdiction.pdf',
      sizeKb: 3072,
      uploadedAt: '2025-11-10T11:00:00',
    },
    {
      id: 6,
      title: 'Labour Law Compliance Checklist',
      type: 'research',
      description: 'Comprehensive checklist for labour law compliance for startups and SMEs in India.',
      fileName: 'labour_compliance.docx',
      sizeKb: 256,
      uploadedAt: '2025-11-08T13:30:00',
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });

  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const fetchResearchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/documents`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch documents');

      const data = await response.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      const researchDocs = list
        .filter(doc => (doc.documentType || '').toLowerCase() === 'research')
        .map(doc => ({
          ...doc,
          id: doc._id || doc.id,
          title: doc.title,
          type: 'research',
          description: doc.description || '',
          fileName: doc.filename || doc.originalName || doc.name || 'document',
          sizeKb: doc.size ? Math.round(parseFloat(doc.size) / 1024) : 0,
          uploadedAt: doc.uploadedAt || doc.createdAt || new Date().toISOString()
        }));

      setDocuments(researchDocs);
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  React.useEffect(() => {
    fetchResearchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.title.trim()) {
      alert('Please provide both file and title');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('title', formData.title.trim());
    uploadData.append('file', formData.file);
    uploadData.append('documentType', 'Research');
    uploadData.append('description', formData.description.trim());

    try {
      const response = await fetch(`${API_BASE_URL}/student/documents/upload`, {
        method: 'POST',
        body: uploadData
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }

      await fetchResearchDocuments();
    } catch (error) {
      console.error('UPLOAD ERROR:', error);
      alert(error.message || 'Upload failed');
      return;
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      file: null,
    });
    
    const fileInput = document.getElementById('doc-file-input');
    if (fileInput) fileInput.value = '';
    
    setShowUploadModal(false);
  };

  const filteredDocs = documents.filter(doc =>
    [doc.title, doc.description, doc.fileName, doc.type]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleView = (doc) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Opening document: ${doc.title}\n\nIn production, this would open the actual document from your storage.`);
    }
  };

  const handleAnalyze = (doc) => {
    setSelectedDocument(doc);
    setShowAnalysis(true);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // If analysis view is open, show DocumentComparison
  if (showAnalysis) {
    return (
      <div className="relative">
        {/* Close button overlay */}
        <button
          onClick={() => {
            setShowAnalysis(false);
            setSelectedDocument(null);
          }}
          className="fixed top-4 right-4 z-[60] p-2 rounded-lg text-white shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: colors.golden }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Document info banner */}
        <div 
          className="fixed top-4 left-4 z-[60] px-4 py-2 rounded-lg shadow-lg"
          style={{ background: 'rgba(255,255,255,0.95)', border: `1px solid ${colors.border}` }}
        >
          <p className="text-xs font-medium" style={{ color: colors.gray }}>Analyzing Document:</p>
          <p className="text-sm font-semibold" style={{ color: colors.navy }}>{selectedDocument?.title}</p>
        </div>

        <DocumentComparison />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen lg:ml-60 pt-16 lg:pt-0"
      style={{ background: colors.cream }}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: colors.navy }}
            >
              Research Documents
            </h1>
            <p
              className="mt-1 text-sm sm:text-base"
              style={{ color: colors.gray }}
            >
              Upload, search, and manage your legal research documents
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-95 flex items-center justify-center whitespace-nowrap shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${colors.golden}, #c8b090)`,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 shadow-sm"
              placeholder="Search research documents by title, description, or filename..."
              style={{
                border: `1px solid rgba(182, 157, 116, 0.35)`,
                background: 'white',
                color: colors.navy,
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3.5 top-3.5"
              style={{ color: colors.gray }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Document cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-semibold"
              style={{ color: colors.navy }}
            >
              {searchQuery ? `Found ${filteredDocs.length} document(s)` : `All Documents (${documents.length})`}
            </h2>
            {filteredDocs.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `rgba(182, 157, 116, 0.15)`, color: colors.golden }}>
                {filteredDocs.length} total
              </span>
            )}
          </div>

          {filteredDocs.length === 0 ? (
            <div
              className="p-8 sm:p-12 rounded-xl text-center"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: `1px solid rgba(182,157,116,0.25)`,
              }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `rgba(182, 157, 116, 0.1)` }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  style={{ color: colors.gray }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: colors.navy }}
              >
                {searchQuery ? 'No matching documents' : 'No documents yet'}
              </h3>
              <p className="text-sm" style={{ color: colors.gray }}>
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Click "Upload Document" to add your first research document'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map(doc => (
                <div
                  key={doc.id}
                  className="p-5 rounded-xl flex flex-col justify-between h-full transition-all hover:shadow-md"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: `1px solid rgba(182,157,116,0.25)`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div>
                    {/* Type badge and date */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full"
                        style={{ 
                          background: `rgba(182, 157, 116, 0.15)`,
                          color: colors.golden 
                        }}
                      >
                        {doc.type}
                      </span>
                      <span className="text-xs" style={{ color: colors.gray }}>
                        {formatDate(doc.uploadedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-bold mb-2 text-base leading-snug"
                      style={{ color: colors.navy }}
                    >
                      {doc.title}
                    </h3>

                    {/* File info */}
                    <div className="flex items-center text-xs mb-3 pb-3 border-b" style={{ color: colors.gray, borderColor: 'rgba(182, 157, 116, 0.15)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="truncate">{doc.fileName}</span>
                      <span className="mx-1.5">•</span>
                      <span>{doc.sizeKb} KB</span>
                    </div>

                    {/* Description */}
                    {doc.description && (
                      <p
                        className="text-sm mb-4 line-clamp-2 leading-relaxed"
                        style={{ color: colors.gray }}
                      >
                        {doc.description}
                      </p>
                    )}
                  </div>

                  {/* Actions - Better UI with grid layout */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleView(doc)}
                      className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-80 flex items-center justify-center"
                      style={{ 
                        border: `1.5px solid ${colors.golden}`,
                        color: colors.golden,
                        background: 'transparent'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnalyze(doc)}
                      className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${colors.golden}, #c8b090)`,
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Analyze
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'white',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ background: `rgba(182, 157, 116, 0.15)` }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    style={{ color: colors.golden }}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colors.navy }}
                >
                  Upload Research Document
                </h2>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-md hover:bg-gray-100"
                style={{ color: colors.gray }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleUpload}>
              {/* File */}
              <div>
                <label
                  htmlFor="doc-file-input"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: colors.navy }}
                >
                  File <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="doc-file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:text-sm file:font-medium file:text-white cursor-pointer rounded-md"
                  style={{
                    border: `1px solid rgba(182,157,116,0.35)`,
                    background: 'white',
                    color: colors.navy,
                  }}
                />
                {formData.file && (
                  <p className="mt-1.5 text-xs flex items-center" style={{ color: colors.golden }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {formData.file.name}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: colors.navy }}
                >
                  Document Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2"
                  placeholder="e.g., Privacy Law Research Memo"
                  style={{
                    border: `1px solid rgba(182,157,116,0.35)`,
                    background: 'white',
                    color: colors.navy,
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: colors.navy }}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md text-sm resize-none focus:outline-none focus:ring-2"
                  placeholder="Brief description of the document content..."
                  style={{
                    border: `1px solid rgba(182,157,116,0.35)`,
                    background: 'white',
                    color: colors.navy,
                  }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-gray-100"
                  style={{
                    border: `1px solid rgba(182,157,116,0.35)`,
                    color: colors.navy,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-95 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, #c8b090)`,
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
