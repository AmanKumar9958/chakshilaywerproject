import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
// ============= DOCUMENTS TAB COMPONENT =============
const DocumentsTab = ({ 
  documents, 
  uploadProgress, 
  permissions, 
  language, 
  handleFileUpload 
}) => {
  // State for upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    files: [],
    title: '',
    documentType: 'Petition',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Document types
  const documentTypes = [
    'Petition',
    'Evidence',
    'Affidavit',
    'Notice',
    'Order',
    'Judgment',
    'Application',
    'Reply',
    'Other'
  ];

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    
    // Auto-fill title if only one file
    if (files.length === 1 && !uploadForm.title) {
      const fileName = files[0].name.replace(/\.[^/.]+$/, '');
      setUploadForm(prev => ({ ...prev, title: fileName }));
    }
  };

  // Handle upload submission
  const handleSubmitUpload = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }
    
    if (!uploadForm.title.trim()) {
      alert('Please enter a document title');
      return;
    }

    // Create FormData or handle upload
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('title', uploadForm.title);
    formData.append('documentType', uploadForm.documentType);
    formData.append('description', uploadForm.description);

    // Call the upload handler
    handleFileUpload(formData);
    
    // Reset and close modal
    setShowUploadModal(false);
    setUploadForm({
      files: [],
      title: '',
      documentType: 'Petition',
      description: ''
    });
    setSelectedFiles([]);
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#1f2839] flex items-center">
          <svg className="w-6 h-6 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {language === 'ta' ? 'दस्तावेज़' : 'Documents'}
          <span className="ml-2 px-3 py-1 text-sm bg-[#b69d7410] text-[#b69d74] rounded-full font-medium">
            {documents.length}
          </span>
        </h3>

        {permissions.canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74dd] border border-transparent rounded-xl hover:from-[#b69d74dd] hover:to-[#b69d74bb] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center shadow-lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {language === 'ta' ? 'अपलोड करें' : 'Upload'}
          </button>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[#1f2839]">
            {language === 'ta' ? 'अपलोड प्रगति' : 'Upload Progress'}
          </h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-white p-4 rounded-xl border border-[#b69d7420]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#6b7280]">
                  {language === 'ta' ? 'अपलोड हो रहा है...' : 'Uploading...'}
                </span>
                <span className="text-sm font-bold text-[#b69d74]">{progress}%</span>
              </div>
              <div className="w-full bg-[#b69d7410] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#b69d74] to-[#b69d74cc] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map(doc => (
          <div
            key={doc.id}
            className="bg-gradient-to-br from-white to-[#b69d7403] p-5 rounded-xl border border-[#b69d7420] hover:border-[#b69d7440] transition-all duration-300 group hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#b69d7410] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1f2839] truncate max-w-[120px]">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-[#6b7280]">{doc.size}</p>
                </div>
              </div>
              
              <button className="text-[#6b7280] hover:text-[#b69d74] transition-colors duration-300 opacity-0 group-hover:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            <div className="text-xs text-[#6b7280] space-y-1">
              <p>
                <strong>{language === 'ta' ? 'द्वारा अपलोड किया गया:' : 'Uploaded by:'}</strong> {doc.uploadedBy}
              </p>
              <p>
                <strong>{language === 'ta' ? 'तारीख:' : 'Date:'}</strong> {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button className="text-xs font-medium text-[#b69d74] hover:text-[#b69d74dd] transition-colors duration-300">
                {language === 'ta' ? 'डाउनलोड करें' : 'Download'}
              </button>
              <button className="text-xs font-medium text-[#3b82f6] hover:text-[#3b82f6dd] transition-colors duration-300">
                {language === 'ta' ? 'देखें' : 'View'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#b69d7410] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[#6b7280] text-lg">
            {language === 'ta' ? 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया' : 'No documents uploaded yet'}
          </p>
          <p className="text-[#6b7280] text-sm mt-2">
            {language === 'ta' ? 'दस्तावेज़ जोड़ने के लिए ऊपर अपलोड बटन पर क्लिक करें' : 'Click the upload button above to add documents'}
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1f2839]">
                {language === 'ta' ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#6b7280] hover:text-[#1f2839] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-5">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  {language === 'ta' ? 'फ़ाइलें चुनें' : 'Select Files'} 
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="border-2 border-dashed border-[#b69d7440] rounded-xl p-6 text-center hover:border-[#b69d74] transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <svg className="w-12 h-12 mx-auto mb-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-[#1f2839] font-medium">
                      {language === 'ta' ? 'फ़ाइलें अपलोड करने के लिए क्लिक करें' : 'Click to upload files'}
                    </p>
                    <p className="text-xs text-[#6b7280] mt-1">
                      PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                    </p>
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#b69d7408] rounded-lg border border-[#b69d7420]">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-[#1f2839]">{file.name}</p>
                            <p className="text-xs text-[#6b7280]">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Document Title */}
              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  {language === 'ta' ? 'दस्तावेज़ शीर्षक' : 'Document Title'} 
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none transition-all"
                  placeholder={language === 'ta' ? 'उदाहरण: याचिका - संशोधन' : 'e.g., Petition - Amendment'}
                  required
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  {language === 'ta' ? 'दस्तावेज़ प्रकार' : 'Document Type'} 
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={uploadForm.documentType}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, documentType: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none transition-all"
                  required
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  {language === 'ta' ? 'विवरण' : 'Description'} 
                  <span className="text-xs text-[#6b7280] ml-1">(Optional)</span>
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none resize-none transition-all"
                  placeholder={language === 'ta' ? 'दस्तावेज़ के बारे में अतिरिक्त जानकारी' : 'Additional information about the document'}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {language === 'ta' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74dd] rounded-xl hover:from-[#b69d74dd] hover:to-[#b69d74bb] transition-all shadow-lg flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {language === 'ta' ? 'अपलोड करें' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


// ============= NEXT HEARING TAB COMPONENT =============
const NextHearingTab = ({ caseData, setCaseData, language, sendNotification }) => {
  // State for managing hearings
  const [editingHearingId, setEditingHearingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', date: '', time: '', court: '', judge: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [currentHearingId, setCurrentHearingId] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [newHearing, setNewHearing] = useState({
    name: '',
    date: '',
    time: '',
    court: '',
    judge: '',
    remarks: []
  });

  // Handle Edit Click
  const handleEditClick = (hearing) => {
    setEditForm({
      name: hearing.name,
      date: hearing.date,
      time: hearing.time,
      court: hearing.court,
      judge: hearing.judge
    });
    setEditingHearingId(hearing.id);
  };

  // Save Edited Hearing
  const saveEdit = () => {
    const updatedHearings = caseData.hearings.map(h =>
      h.id === editingHearingId ? { ...h, ...editForm } : h
    );
    setCaseData({ ...caseData, hearings: updatedHearings });
    setEditingHearingId(null);
  };

  // Add New Hearing
  const handleAddHearing = () => {
    const newHearingData = {
      id: Date.now(),
      ...newHearing,
      remarks: []
    };
    setCaseData({
      ...caseData,
      hearings: [...(caseData.hearings || []), newHearingData]
    });
    setShowAddModal(false);
    setNewHearing({ name: '', date: '', time: '', court: '', judge: '', remarks: [] });
  };

  // Add Remark
  const handleAddRemark = () => {
    if (!remarkText.trim()) return;
    
    const updatedHearings = caseData.hearings.map(h => {
      if (h.id === currentHearingId) {
        return {
          ...h,
          remarks: [
            ...(h.remarks || []),
            {
              id: Date.now(),
              text: remarkText,
              by: 'Current User',
              date: new Date().toISOString()
            }
          ]
        };
      }
      return h;
    });
    
    setCaseData({ ...caseData, hearings: updatedHearings });
    setShowRemarkModal(false);
    setRemarkText('');
    setCurrentHearingId(null);
  };

  // Delete Hearing
  const handleDeleteHearing = (id) => {
    if (window.confirm('Are you sure you want to delete this hearing?')) {
      const updatedHearings = caseData.hearings.filter(h => h.id !== id);
      setCaseData({ ...caseData, hearings: updatedHearings });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#1f2839] flex items-center">
          <svg className="w-6 h-6 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {language === 'ta' ? 'अगली सुनवाई' : 'Next Hearings'}
        </h3>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Hearing
        </button>
      </div>

      {/* Hearings Grid */}
      {caseData.hearings && caseData.hearings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseData.hearings.map((hearing) => (
            <div
              key={hearing.id}
              className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border-2 border-[#b69d7420] hover:border-[#b69d7440] transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              {editingHearingId === hearing.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">Hearing Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none"
                      placeholder="e.g., First Hearing"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-[#1f2839] mb-2">Date</label>
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1f2839] mb-2">Time</label>
                      <input
                        type="time"
                        value={editForm.time}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">Court</label>
                    <input
                      type="text"
                      value={editForm.court}
                      onChange={(e) => setEditForm({ ...editForm, court: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                      placeholder="Court name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1f2839] mb-2">Judge</label>
                    <input
                      type="text"
                      value={editForm.judge}
                      onChange={(e) => setEditForm({ ...editForm, judge: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                      placeholder="Judge name"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setEditingHearingId(null)}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-[#1f2839]">{hearing.name}</h4>
                    <span className="px-3 py-1 text-xs font-bold bg-[#b69d7410] text-[#b69d74] border border-[#b69d7440] rounded-full">
                      Upcoming
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="mb-4 p-3 bg-[#b69d7408] rounded-xl border border-[#b69d7420]">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg font-bold text-[#1f2839]">
                        {new Date(hearing.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-[#6b7280]">{hearing.time}</span>
                    </div>
                  </div>

                  {/* Court & Judge Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-white rounded-xl border border-[#b69d7420]">
                      <p className="text-xs text-[#6b7280] mb-1">Court</p>
                      <p className="text-sm font-semibold text-[#1f2839]">{hearing.court}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#b69d7420]">
                      <p className="text-xs text-[#6b7280] mb-1">Judge</p>
                      <p className="text-sm font-semibold text-[#1f2839]">{hearing.judge}</p>
                    </div>
                  </div>

                  {/* Remarks Section */}
                  {hearing.remarks && hearing.remarks.length > 0 && (
                    <div className="mb-4 p-3 bg-[#b69d7408] rounded-xl border border-[#b69d7420]">
                      <h5 className="text-sm font-bold text-[#1f2839] mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Remarks ({hearing.remarks.length})
                      </h5>
                      <div className="space-y-2">
                        {hearing.remarks.map((remark) => (
                          <div key={remark.id} className="p-2 bg-white rounded-lg border border-[#b69d7415] text-xs">
                            <p className="text-[#1f2839] mb-1">{remark.text}</p>
                            <div className="flex justify-between text-[#6b7280]">
                              <span>{remark.by}</span>
                              <span>{new Date(remark.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#b69d7420]">
                    <button
                      onClick={() => handleEditClick(hearing)}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setCurrentHearingId(hearing.id);
                        setShowRemarkModal(true);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Remark
                    </button>

                    <button
                      onClick={() => handleDeleteHearing(hearing.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#b69d7410] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[#6b7280] text-lg mb-2">
            {language === 'ta' ? 'कोई आगामी सुनवाई नहीं' : 'No upcoming hearings scheduled'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-6 py-2 text-sm font-semibold text-white rounded-lg shadow-lg"
            style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
          >
            Add First Hearing
          </button>
        </div>
      )}

      {/* Add Hearing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#1f2839] mb-4">Add New Hearing</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">Hearing Name</label>
                <input
                  type="text"
                  value={newHearing.name}
                  onChange={(e) => setNewHearing({ ...newHearing, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                  placeholder="e.g., First Hearing"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#1f2839] mb-2">Date</label>
                  <input
                    type="date"
                    value={newHearing.date}
                    onChange={(e) => setNewHearing({ ...newHearing, date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2839] mb-2">Time</label>
                  <input
                    type="time"
                    value={newHearing.time}
                    onChange={(e) => setNewHearing({ ...newHearing, time: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">Court</label>
                <input
                  type="text"
                  value={newHearing.court}
                  onChange={(e) => setNewHearing({ ...newHearing, court: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                  placeholder="Court name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">Judge</label>
                <input
                  type="text"
                  value={newHearing.judge}
                  onChange={(e) => setNewHearing({ ...newHearing, judge: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] outline-none"
                  placeholder="Judge name"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHearing}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
              >
                Add Hearing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Remark Modal */}
      {showRemarkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#1f2839] mb-4">Add Remark</h3>
            
            <textarea
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none resize-none"
              placeholder="Enter your remark here..."
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRemarkModal(false);
                  setRemarkText('');
                  setCurrentHearingId(null);
                }}
                className="flex-1 px-4 py-2 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRemark}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
              >
                Add Remark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ============= HISTORY TAB COMPONENT (SEPARATED) =============
// ============= ENHANCED HISTORY TAB COMPONENT =============
const HistoryTab = ({ 
  caseData, 
  setCaseData,
  language, 
  showAddHistoryModal,
  setShowAddHistoryModal,
  handleAddRemark,
  user
}) => {
  // State for editing
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ event: '', details: '', date: '', time: '' });
  const [historyStatuses, setHistoryStatuses] = useState({});

  // Check if milestone is ongoing (within next 7 days)
  const isOngoing = (date) => {
    const today = new Date();
    const milestoneDate = new Date(date);
    const diffDays = Math.ceil((milestoneDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  // Handle Edit Click
  const handleEditClick = (index) => {
    const event = caseData.caseHistory[index];
    setEditForm({
      event: event.event,
      details: event.details,
      date: event.date,
      time: event.time || '10:00'
    });
    setEditingIndex(index);
  };

  // Save Edited Event
  const saveEdit = () => {
    const updatedHistory = [...caseData.caseHistory];
    updatedHistory[editingIndex] = {
      ...updatedHistory[editingIndex],
      event: editForm.event,
      details: editForm.details,
      date: editForm.date,
      time: editForm.time
    };
    setCaseData({ ...caseData, caseHistory: updatedHistory });
    setEditingIndex(null);
  };

  // Mark as Complete
  const handleMarkComplete = (index) => {
    const newStatus = historyStatuses[index] === 'completed' ? 'pending' : 'completed';
    setHistoryStatuses({
      ...historyStatuses,
      [index]: newStatus
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#1f2839] flex items-center">
          <svg className="w-6 h-6 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {language === 'ta' ? 'केस हिस्ट्री और माइलस्टोन' : 'Case History & Milestones'}
        </h3>
        
        <button
          onClick={() => setShowAddHistoryModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Milestone
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#b69d74] via-[#b69d7460] to-transparent"></div>

        <div className="space-y-6">
          {caseData.caseHistory.map((event, index) => {
            const status = historyStatuses[index] || 'pending';
            const ongoing = isOngoing(event.date);
            const isCompleted = status === 'completed';
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className={`ml-16 relative transition-all duration-500 ${
                  isCompleted ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                {/* Timeline Icon */}
                <div
                  className={`absolute -left-[3.75rem] top-6 w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-4 border-[#f5f5ef] transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-[#10b981] to-emerald-600 ring-4 ring-[#10b98130]'
                      : ongoing
                      ? 'bg-gradient-to-br from-[#f59e0b] to-amber-600 ring-4 ring-[#f59e0b30] animate-pulse'
                      : 'bg-gradient-to-br from-[#b69d74] to-[#a58c66] ring-4 ring-[#b69d7430]'
                  }`}
                >
                  {isCompleted ? (
                    // Completed Icon
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : ongoing ? (
                    // Ongoing Icon (spinning clock)
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    // Pending Icon (clock)
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                {/* Event Card */}
                <div
                  className={`bg-white rounded-2xl border-2 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    isCompleted ? 'border-[#10b981]' : ongoing ? 'border-[#f59e0b]' : 'border-[#b69d7440]'
                  }`}
                >
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#1f2839] mb-2">Event Name</label>
                        <input
                          type="text"
                          value={editForm.event}
                          onChange={(e) => setEditForm({ ...editForm, event: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none font-semibold"
                          placeholder="Event title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-[#1f2839] mb-2">Details</label>
                        <textarea
                          value={editForm.details}
                          onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none resize-none"
                          placeholder="Event details"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#1f2839] mb-2">Date</label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#1f2839] mb-2">Time</label>
                          <input
                            type="time"
                            value={editForm.time}
                            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                          style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-[#1f2839]">{event.event}</h4>
                            
                            {index === 0 && (
                              <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-[#10b981] to-emerald-600 text-white rounded-full shadow-sm">
                                Latest
                              </span>
                            )}
                            
                            {ongoing && !isCompleted && (
                              <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-[#f59e0b] to-amber-600 text-white rounded-full shadow-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                Ongoing
                              </span>
                            )}
                            
                            {isCompleted && (
                              <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-[#10b981] to-emerald-600 text-white rounded-full shadow-sm">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[#6b7280] leading-relaxed mb-3">{event.details}</p>
                        </div>

                        <div className="ml-6 flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#b69d7410] border border-[#b69d7440] rounded-lg">
                            <svg className="w-4 h-4 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-bold text-[#1f2839]">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {event.time && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#b69d7408] border border-[#b69d7430] rounded-lg">
                              <svg className="w-4 h-4 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-bold text-[#6b7280]">{event.time}</span>
                            </div>
                          )}
                          
                          <span className="text-xs text-[#6b7280] mt-1">
                            By <strong className="text-[#1f2839]">{event.by}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Remarks */}
                      {event.remarks && event.remarks.length > 0 && (
                        <div className="mb-4 p-4 bg-[#b69d7408] rounded-xl border border-[#b69d7420]">
                          <h5 className="text-sm font-bold text-[#1f2839] mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            Remarks ({event.remarks.length})
                          </h5>
                          <div className="space-y-2">
                            {event.remarks.map((remark, remarkIndex) => (
                              <div key={remarkIndex} className="p-3 bg-white rounded-lg border border-[#b69d7415] shadow-sm">
                                <p className="text-sm text-[#1f2839] mb-2">{remark.text}</p>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-[#b69d74]">{remark.by}</span>
                                  <span className="text-[#6b7280]">{new Date(remark.date).toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-[#b69d7420]">
                        <button
                          onClick={() => handleMarkComplete(index)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            isCompleted
                              ? 'text-[#6b7280] bg-[#6b728008] border-2 border-[#6b728030]'
                              : 'text-white bg-gradient-to-r from-[#10b981] to-emerald-600 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {isCompleted ? 'Mark as Pending' : 'Mark Complete'}
                        </button>

                        <button
                          onClick={() => handleEditClick(index)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#3b82f6] to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </button>

                        <button
                          onClick={() => handleAddRemark(index)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Remark
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {caseData.caseHistory.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#b69d7410] rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#1f2839] mb-3">No History Yet</h3>
          <p className="text-[#6b7280] mb-8 max-w-md mx-auto">
            No case history has been recorded yet. Add your first milestone to get started.
          </p>
          <button
            onClick={() => setShowAddHistoryModal(true)}
            className="px-8 py-3 text-sm font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ background: 'linear-gradient(135deg, #b69d74, #a58c66)' }}
          >
            Add First Milestone
          </button>
        </div>
      )}
    </div>
  );
};


const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const context = useOutletContext();
  const { addNotification, openModal, theme, language, isOnline } = context || {};

  // State management
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [permissions, setPermissions] = useState({
    canEdit: true,
    canDelete: false,
    canUpload: true,
    canNotify: true
  });

  // NEW: History and Remarks State
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [showAddRemarkModal, setShowAddRemarkModal] = useState(false);
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);
  const [editingHistory, setEditingHistory] = useState(null);
  const [newHistory, setNewHistory] = useState({
    event: '',
    details: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    completed: false
  });
  const [newRemark, setNewRemark] = useState('');

  // ============= API FUNCTIONS =============

  const fetchCaseDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/new-case/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Case not found');
        }
        throw new Error('Failed to fetch case details');
      }

      const data = await response.json();
      
     const transformedCase = {
  id: data.data.id,
  number: data.data.caseNumber,
  title: `${data.data.caseTitle} (${data.data.clientName} vs ${data.data.oppositeParty})`,
  status: data.data.status,
  priority: data.data.priority || 'Medium',
  court: data.data.court,
  caseType: data.data.caseType,
  filingDate: data.data.filingDate?.split('T')[0] || data.data.filingDate,
  nextHearing: data.data.nextHearing?.split('T')[0] || data.data.nextHearing,
  hearingTime: data.data.hearingTime,
  judge: data.data.judge,
  description: data.data.description,
  acts: data.data.actsSections || [],
  
  parties: [
    {
      id: 1,
      name: data.data.clientName,
      type: 'Petitioner',
      advocate: data.data.advocate || 'Not assigned',
      contact: data.data.clientContact || 'NA'
    },
    {
      id: 2,
      name: data.data.oppositeParty,
      type: 'Respondent',
      advocate: data.data.oppositeAdvocate || 'Not assigned',
      contact: data.data.oppositeContact || 'NA'
    }
  ],
  
  caseHistory: data.data.caseHistory || [
    {
      date: data.data.filingDate,
      time: '09:00',
      event: 'Case filed',
      details: `Case ${data.data.caseNumber} filed`,
      by: 'System',
      completed: true,
      remarks: []
    }
  ],
  
  hearings: data.data.hearings || [],  // ✅ ADD THIS LINE
  
  attachments: data.data.documents || []
};


      setCaseData(transformedCase);
      setFormData(transformedCase);
      setDocuments(transformedCase.attachments);
      setLoading(false);
      setWebsocketConnected(isOnline);
      
      addNotification?.({
        type: 'success',
        message: `Case ${transformedCase.number} loaded successfully`
      });
    } catch (error) {
      console.error('Error fetching case details:', error);
      setLoading(false);
      addNotification?.({
        type: 'error',
        message: error.message || 'Failed to load case details'
      });
      
      if (error.message === 'Case not found') {
        setTimeout(() => navigate('/clerk/cases'), 2000);
      }
    }
  };

  const updateCaseDetails = async (updatedData) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/new-case/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseTitle: updatedData.title,
          description: updatedData.description,
          status: updatedData.status,
          priority: updatedData.priority,
          court: updatedData.court,
          judge: updatedData.judge,
          nextHearing: updatedData.nextHearing,
          hearingTime: updatedData.hearingTime,
          actsSections: updatedData.acts
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update case');
      }

      const data = await response.json();
      
      addNotification?.({
        type: 'success',
        message: data.message || 'Case updated successfully'
      });

      await fetchCaseDetails();
      setEditMode(false);
      setSaving(false);
    } catch (error) {
      console.error('Error updating case:', error);
      setSaving(false);
      addNotification?.({
        type: 'error',
        message: error.message || 'Failed to update case'
      });
    }
  };

  const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('caseId', id);

    try {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // NEW: Check if milestone is ongoing
  const isMilestoneOngoing = (historyItem) => {
    if (historyItem.completed) return false;
    
    const milestoneDateTime = new Date(`${historyItem.date}T${historyItem.time || '00:00'}`);
    const now = new Date();
    
    return now >= milestoneDateTime;
  };

  // NEW: Mark as Complete Handler
  const handleMarkComplete = (historyIndex) => {
    const updatedHistory = [...caseData.caseHistory];
    updatedHistory[historyIndex].completed = true;
    updatedHistory[historyIndex].completedAt = new Date().toISOString();
    updatedHistory[historyIndex].completedBy = user?.name || 'Unknown User';

    setCaseData({
      ...caseData,
      caseHistory: updatedHistory
    });

    // TODO: Call API to save completion status
    addNotification?.({ type: 'success', message: 'Milestone marked as complete' });
  };

  // NEW: Edit History Handler
  const handleEditHistory = (historyIndex) => {
    const historyItem = caseData.caseHistory[historyIndex];
    setEditingHistory({
      ...historyItem,
      index: historyIndex
    });
    setShowEditHistoryModal(true);
  };

  // NEW: Submit Edit History
  const handleSubmitEditHistory = async () => {
    if (!editingHistory.event.trim() || !editingHistory.details.trim()) {
      addNotification?.({ type: 'warning', message: 'Please fill all required fields' });
      return;
    }

    try {
      const updatedHistory = [...caseData.caseHistory];
      updatedHistory[editingHistory.index] = {
        ...editingHistory,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.name || 'Unknown User'
      };
      delete updatedHistory[editingHistory.index].index;

      setCaseData({
        ...caseData,
        caseHistory: updatedHistory
      });

      // TODO: Call API to save edited history
      addNotification?.({ type: 'success', message: 'Milestone updated successfully' });
      setShowEditHistoryModal(false);
      setEditingHistory(null);
    } catch (error) {
      addNotification?.({ type: 'error', message: 'Failed to update milestone' });
    }
  };

  // NEW: Add Remark Handler
  const handleAddRemark = (historyIndex) => {
    setSelectedHistoryIndex(historyIndex);
    setShowAddRemarkModal(true);
  };

  // NEW: Submit Remark
  const handleSubmitRemark = async () => {
    if (!newRemark.trim()) {
      addNotification?.({ type: 'warning', message: 'Please enter a remark' });
      return;
    }

    try {
      const remark = {
        text: newRemark,
        by: user?.name || 'Unknown User',
        date: new Date().toISOString()
      };

      const updatedHistory = [...caseData.caseHistory];
      if (!updatedHistory[selectedHistoryIndex].remarks) {
        updatedHistory[selectedHistoryIndex].remarks = [];
      }
      updatedHistory[selectedHistoryIndex].remarks.push(remark);

      setCaseData({
        ...caseData,
        caseHistory: updatedHistory
      });

      // TODO: Call API to save remark
      addNotification?.({ type: 'success', message: 'Remark added successfully' });
      setNewRemark('');
      setShowAddRemarkModal(false);
      setSelectedHistoryIndex(null);
    } catch (error) {
      addNotification?.({ type: 'error', message: 'Failed to add remark' });
    }
  };

  // NEW: Submit History
  const handleSubmitHistory = async () => {
    if (!newHistory.event.trim() || !newHistory.details.trim()) {
      addNotification?.({ type: 'warning', message: 'Please fill all required fields' });
      return;
    }

    try {
      const historyEntry = {
        event: newHistory.event,
        details: newHistory.details,
        date: newHistory.date,
        time: newHistory.time,
        by: user?.name || 'Unknown User',
        completed: false,
        remarks: []
      };

      setCaseData({
        ...caseData,
        caseHistory: [historyEntry, ...caseData.caseHistory]
      });

      // TODO: Call API to save history
      addNotification?.({ type: 'success', message: 'Milestone added successfully' });
      setNewHistory({ 
        event: '', 
        details: '', 
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        completed: false
      });
      setShowAddHistoryModal(false);
    } catch (error) {
      addNotification?.({ type: 'error', message: 'Failed to add milestone' });
    }
  };

  // ============= USE EFFECTS =============

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!websocketConnected || !caseData) return;

    const interval = setInterval(() => {
      const updateTypes = ['document_added', 'status_changed', 'hearing_scheduled', 'note_added'];
      const randomUpdate = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      if (Math.random() > 0.95) {
        addNotification?.({
          type: 'info',
          message: `Case updated: ${randomUpdate.replace('_', ' ')}`
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [websocketConnected, caseData]);

  useEffect(() => {
    return () => {
      setCaseData(null);
      setLoading(true);
    };
  }, [id]);

  // ============= EVENT HANDLERS =============

  const handleSave = async () => {
    try {
      if (!formData.title?.trim()) {
        throw new Error('Case title is required');
      }

      await updateCaseDetails(formData);
    } catch (error) {
      console.error('Error saving case:', error);
      addNotification?.({
        type: 'error',
        message: error.message || 'Failed to save case'
      });
    }
  };

  const handleFileUpload = useCallback(async (files) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const fileId = Date.now() + Math.random();
      
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      try {
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress < 90) {
              return { ...prev, [fileId]: currentProgress + 10 };
            }
            return prev;
          });
        }, 200);

        await uploadDocument(file);
        
        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        
        addNotification?.({
          type: 'success',
          message: `Document "${file.name}" uploaded successfully`
        });

        await fetchCaseDetails();
      } catch (error) {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        
        addNotification?.({
          type: 'error',
          message: `Failed to upload "${file.name}"`
        });
      }
    }
  }, [id, user]);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && permissions.canUpload) {
      handleFileUpload(files);
    }
  }, [handleFileUpload, permissions.canUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const sendNotification = async (type, message) => {
    if (!permissions.canNotify) {
      addNotification?.({
        type: 'error',
        message: 'You do not have permission to send notifications'
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId: id,
          type,
          message,
          recipients: caseData.parties.map(p => p.name)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
      
      const notification = {
        id: Date.now(),
        type,
        message,
        sentAt: new Date().toISOString(),
        sentBy: user?.name || 'Unknown User',
        recipients: caseData.parties.map(p => p.name)
      };
      
      setNotifications(prev => [notification, ...prev]);
      
      addNotification?.({
        type: 'success',
        message: `${type} notification sent to all parties`
      });
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: error.message || 'Failed to send notification'
      });
    }
  };

  // ============= RENDER LOGIC =============

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b69d74]"></div>
        <span className="ml-3 text-[#6b7280] font-medium">
          {language === 'ta' ? 'मामले की जानकारी लोड हो रही है...' : 'Loading case details...'}
        </span>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#b69d7410] rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1f2839] mb-3">
          {language === 'ta' ? 'मामला नहीं मिला' : 'Case not found'}
        </h3>
        <p className="text-[#6b7280] mb-6 max-w-md mx-auto">
          {language === 'ta' ? 'यह मामला मौजूद नहीं है या आपको इसे देखने का अधिकार नहीं है।' : 'This case does not exist or you do not have permission to view it.'}
        </p>
        <Link
          to="/clerk/cases"
          className="inline-flex items-center px-6 py-3 bg-[#b69d74] text-white font-medium rounded-lg hover:bg-[#b69d74dd] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {language === 'ta' ? 'मामलों की सूची पर वापस जाएं' : 'Back to cases'}
        </Link>
      </div>
    );
  }

  return (
  
  <div className="min-h-screen bg-[#f5f5ef] lg:ml-60 pt-16 lg:pt-0" onDrop={handleFileDrop} onDragOver={handleDragOver}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#b69d7420] p-8 mb-8 transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <Link
                  to="/clerk/cases"
                  className="group flex items-center text-[#6b7280] hover:text-[#b69d74] transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {language === 'ta' ? 'वापस' : 'Back'}
                </Link>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-[#1f2839] bg-gradient-to-r from-[#1f2839] to-[#b69d74] bg-clip-text text-transparent">
                    {caseData.number}
                  </h1>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                    caseData.status === 'Active' ? 'bg-[#10b98120] text-[#10b981] border border-[#10b98140]' :
                    caseData.status === 'Pending' ? 'bg-[#f59e0b20] text-[#f59e0b] border border-[#f59e0b40]' :
                    'bg-[#6b728020] text-[#6b7280] border border-[#6b728040]'
                  }`}>
                    {caseData.status}
                  </span>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                    caseData.priority === 'Critical' ? 'bg-[#ef444420] text-[#ef4444] border border-[#ef444440]' :
                    caseData.priority === 'High' ? 'bg-[#f59e0b20] text-[#f59e0b] border border-[#f59e0b40]' :
                    caseData.priority === 'Medium' ? 'bg-[#b69d7420] text-[#b69d74] border border-[#b69d7440]' :
                    'bg-[#10b98120] text-[#10b981] border border-[#10b98140]'
                  }`}>
                    {caseData.priority}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                {editMode ? (
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 text-lg border-2 border-[#b69d7440] rounded-xl bg-white text-[#1f2839] focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300"
                    placeholder="Enter case title..."
                  />
                ) : (
                  <p className="text-xl text-[#1f2839] font-medium leading-relaxed">
                    {caseData.title}
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{caseData.court}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{caseData.judge}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Filed: {new Date(caseData.filingDate).toLocaleDateString()}</span>
                </div>
                {websocketConnected && (
                  <div className="flex items-center space-x-2 text-[#10b981]">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Updates</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6 lg:mt-0">
              {editMode ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setEditMode(false)}
                    disabled={saving}
                    className="px-6 py-3 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-[#b69d7405] hover:border-[#b69d7460] disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {language === 'ta' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#b69d74] to-[#b69d74dd] border border-transparent rounded-xl hover:from-[#b69d74dd] hover:to-[#b69d74bb] disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center"
                  >
                    {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                    {language === 'ta' ? 'सेव करें' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {permissions.canEdit && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-3 text-sm font-semibold text-[#1f2839] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-[#b69d7408] hover:border-[#b69d7460] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {language === 'ta' ? 'संपादित करें' : 'Edit'}
                    </button>
                  )}

                  <button
                    onClick={() => sendNotification('SMS', 'Case update notification')}
                    disabled={!permissions.canNotify}
                    className="px-6 py-3 text-sm font-semibold text-[#10b981] bg-[#10b98110] border-2 border-[#10b98140] rounded-xl hover:bg-[#10b98115] disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {language === 'ta' ? 'सूचना भेजें' : 'Notify'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#b69d7420] overflow-hidden mb-8">
          <div className="border-b border-[#b69d7410]">
            <nav className="flex -mb-px">
              {[
                { key: 'overview', label: language === 'ta' ? 'अवलोकन' : 'Overview', icon: '📋' },
                { key: 'documents', label: language === 'ta' ? 'दस्तावेज़' : 'Documents', icon: '📄' },
                { key: 'history', label: language === 'ta' ? 'इतिहास' : 'History', icon: '🕒' },
                // { key: 'parties', label: language === 'ta' ? 'पार्टियां' : 'Parties', icon: '👥' },
                { key: 'hearings', label: language === 'ta' ? 'सुनवाई' : 'Hearings', icon: '⚖️' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-5 px-4 text-sm font-semibold border-b-2 transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'border-[#b69d74] text-[#b69d74] bg-[#b69d7405]'
                      : 'border-transparent text-[#6b7280] hover:text-[#b69d74] hover:bg-[#b69d7403]'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Case Information */}
                  <div className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border border-[#b69d7410]">
                    <h3 className="text-xl font-semibold text-[#1f2839] mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {language === 'ta' ? 'मामले की जानकारी' : 'Case Information'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: language === 'ta' ? 'मामला संख्या' : 'Case Number', value: caseData.number },
                        { label: language === 'ta' ? 'मामले का प्रकार' : 'Case Type', value: caseData.caseType },
                        { label: language === 'ta' ? 'न्यायालय' : 'Court', value: caseData.court },
                        { label: language === 'ta' ? 'न्यायाधीश' : 'Judge', value: caseData.judge }
                      ].map((field, index) => (
                        <div key={index} className="space-y-2">
                          <label className="block text-sm font-medium text-[#6b7280]">
                            {field.label}
                          </label>
                          <p className="text-[#1f2839] font-medium bg-[#b69d7405] p-3 rounded-xl border border-[#b69d7410]">
                            {field.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Description */}
                  <div className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border border-[#b69d7410]">
                    <h3 className="text-xl font-semibold text-[#1f2839] mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      {language === 'ta' ? 'विवरण' : 'Description'}
                    </h3>
                    {editMode ? (
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-[#b69d7440] rounded-xl bg-white text-[#1f2839] focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all duration-300 resize-none"
                        placeholder="Enter case description..."
                      />
                    ) : (
                      <p className="text-[#1f2839] leading-relaxed bg-[#b69d7405] p-4 rounded-xl border border-[#b69d7410]">
                        {caseData.description}
                      </p>
                    )}
                  </div>

                  {/* Acts & Sections */}
                  <div className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border border-[#b69d7410]">
                    <h3 className="text-xl font-semibold text-[#1f2839] mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {language === 'ta' ? 'अधिनियम और धाराएं' : 'Acts & Sections'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {caseData.acts && caseData.acts.length > 0 ? (
                        caseData.acts.map((act, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#b69d7410] to-[#b69d7408] text-[#b69d74] border border-[#b69d7440] rounded-xl transition-all duration-300 hover:from-[#b69d7415] hover:to-[#b69d7410] hover:border-[#b69d7460]"
                          >
                            {act}
                          </span>
                        ))
                      ) : (
                        <p className="text-[#6b7280] text-sm">No acts specified</p>
                      )}
                    </div>
                  </div>
                </div>
 {/* Next Hearing */}
                 {activeTab === 'hearings' && (
  <NextHearingTab
    caseData={caseData}
    setCaseData={setCaseData} 
    language={language}
    sendNotification={sendNotification}
  />
)}

                {/* Sidebar */}
                <div className="space-y-8">
                  

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-white to-[#b69d7403] rounded-2xl p-6 border border-[#b69d7410]">
                    <h4 className="font-semibold text-[#1f2839] mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {language === 'ta' ? 'त्वरित आंकड़े' : 'Quick Stats'}
                    </h4>
                    <div className="space-y-4">
                      {[
                        { label: language === 'ta' ? 'दस्तावेज़' : 'Documents', value: documents.length, color: '#b69d74' },
                        // { label: language === 'ta' ? 'पार्टियां' : 'Parties', value: caseData.parties.length, color: '#10b981' },
                        { label: language === 'ta' ? 'सुनवाई' : 'Hearings', value: caseData.caseHistory.length, color: '#3b82f6' }
                      ].map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#b69d7405] rounded-xl border border-[#b69d7410]">
                          <span className="text-[#6b7280] text-sm font-medium">{stat.label}</span>
                          <span className="text-lg font-bold" style={{ color: stat.color }}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* File Upload */}
                  {permissions.canUpload && (
                    <div className="border-3 border-dashed border-[#b69d7440] rounded-2xl p-8 text-center transition-all duration-300 hover:border-[#b69d7460] hover:bg-[#b69d7405] group">
                      <svg className="mx-auto h-12 w-12 text-[#b69d74] mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="block text-lg font-semibold text-[#1f2839] mb-2">
                            {language === 'ta' ? 'फ़ाइलें अपलोड करें' : 'Upload Files'}
                          </span>
                          <span className="block text-sm text-[#6b7280] mb-4">
                            {language === 'ta' ? 'फ़ाइलें यहाँ खींचें या क्लिक करें' : 'Drop files here or click to upload'}
                          </span>
                          <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#b69d74] to-[#b69d74dd] text-white font-semibold rounded-xl hover:from-[#b69d74dd] hover:to-[#b69d74bb] transition-all duration-300 transform group-hover:-translate-y-0.5">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {language === 'ta' ? 'फ़ाइलें चुनें' : 'Choose Files'}
                          </span>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
  <DocumentsTab
    documents={documents}
    uploadProgress={uploadProgress}
    permissions={permissions}
    language={language}
    handleFileUpload={handleFileUpload}
  />
)}

            {/* History Tab - ENHANCED */}
            {activeTab === 'history' && (
          <HistoryTab
            caseData={caseData}
            language={language}
            showAddHistoryModal={showAddHistoryModal}
            setShowAddHistoryModal={setShowAddHistoryModal}
            showAddRemarkModal={showAddRemarkModal}
            setShowAddRemarkModal={setShowAddRemarkModal}
            handleAddRemark={handleAddRemark}
            handleEditHistory={handleEditHistory}
            user={user}
          />
        )}

            {/* Parties Tab */}
            {/* {activeTab === 'parties' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#1f2839] flex items-center">
                  <svg className="w-6 h-6 mr-3 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {language === 'ta' ? 'पार्टियां' : 'Parties'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseData.parties.map((party) => (
                    <div key={party.id} className="bg-gradient-to-br from-white to-[#b69d7403] p-6 rounded-xl border border-[#b69d7410] hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-[#1f2839]">{party.name}</h4>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          party.type === 'Petitioner' 
                            ? 'bg-[#10b98120] text-[#10b981] border border-[#10b98140]'
                            : 'bg-[#b69d7420] text-[#b69d74] border border-[#b69d7440]'
                        }`}>
                          {party.type}
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[#6b7280]"><strong>{language === 'ta' ? 'वकील:' : 'Advocate:'}</strong> {party.advocate}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4 text-[#b69d74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-[#6b7280]"><strong>{language === 'ta' ? 'संपर्क:' : 'Contact:'}</strong> {party.contact}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-[#b69d7410]">
                        <button className="flex-1 text-center py-2 text-xs font-semibold text-[#10b981] bg-[#10b98110] border border-[#10b98140] rounded-lg hover:bg-[#10b98115] transition-colors duration-300">
                          {language === 'ta' ? 'कॉल करें' : 'Call'}
                        </button>
                        <button className="flex-1 text-center py-2 text-xs font-semibold text-[#b69d74] bg-[#b69d7410] border border-[#b69d7440] rounded-lg hover:bg-[#b69d7415] transition-colors duration-300">
                          {language === 'ta' ? 'SMS' : 'SMS'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Hearings Tab */}
            {/* Next Hearing */}
                 {activeTab === 'hearings' && (
  <NextHearingTab
    caseData={caseData}
    setCaseData={setCaseData} 
    language={language}
    sendNotification={sendNotification}
  />
)}

          </div>
        </div>
      </div>

      {/* Add History Modal */}
      {showAddHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#b69d7420]">
              <h2 className="text-2xl font-bold text-[#1f2839]">
                {language === 'ta' ? 'नया इतिहास जोड़ें' : 'Add New History'}
              </h2>
              <button
                onClick={() => setShowAddHistoryModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newHistory.event}
                  onChange={(e) => setNewHistory({ ...newHistory, event: e.target.value })}
                  placeholder="e.g., Hearing Scheduled"
                  className="w-full px-4 py-2.5 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newHistory.date}
                  onChange={(e) => setNewHistory({ ...newHistory, date: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1f2839] mb-2">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newHistory.details}
                  onChange={(e) => setNewHistory({ ...newHistory, details: e.target.value })}
                  placeholder="Enter detailed description of the event..."
                  rows={4}
                  className="w-full px-4 py-2.5 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-[#b69d7420] bg-[#f5f5ef] rounded-b-2xl">
              <button
                onClick={() => setShowAddHistoryModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'ta' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleSubmitHistory}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #b69d74, #b69d74dd)' }}
              >
                {language === 'ta' ? 'इतिहास जोड़ें' : 'Add History'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Remark Modal */}
      {showAddRemarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[#b69d7420]">
              <h2 className="text-2xl font-bold text-[#1f2839]">
                {language === 'ta' ? 'टिप्पणी जोड़ें' : 'Add Remark'}
              </h2>
              <button
                onClick={() => {
                  setShowAddRemarkModal(false);
                  setNewRemark('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <textarea
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                placeholder="Enter your remark..."
                rows={5}
                className="w-full px-4 py-2.5 border-2 border-[#b69d7440] rounded-xl focus:border-[#b69d74] focus:ring-2 focus:ring-[#b69d7420] transition-all resize-none"
                autoFocus
              />
            </div>

            <div className="flex gap-3 p-6 border-t border-[#b69d7420] bg-[#f5f5ef] rounded-b-2xl">
              <button
                onClick={() => {
                  setShowAddRemarkModal(false);
                  setNewRemark('');
                }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#6b7280] bg-white border-2 border-[#b69d7440] rounded-xl hover:bg-gray-50 transition-colors"
              >
                {language === 'ta' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleSubmitRemark}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #b69d74, #b69d74dd)' }}
              >
                {language === 'ta' ? 'टिप्पणी जोड़ें' : 'Add Remark'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetails;
