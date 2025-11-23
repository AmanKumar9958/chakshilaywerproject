import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Search, Upload, Download, Eye, Edit, Trash2, 
  X, CheckCircle, Archive, RefreshCw, Folder
} from 'lucide-react';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const MyDocuments = () => {
  const navigate = useNavigate();

  // State Management
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Edit mode state
  const [editingDocument, setEditingDocument] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  // New Document Form State
  const [newDocument, setNewDocument] = useState({
    title: '',
    file: null,
    documentType: 'Notes',
    description: ''
  });

  const modalRef = useRef(null);
  const previewModalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Color Palette
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    golden: '#b69d74',
    gray: '#6b7280',
    green: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    red: '#ef4444'
  };

  // Document Categories for Students
  const categories = ['All', 'Notes', 'Assignment', 'Research', 'Certificate', 'Other'];

  // Document Type Colors
  const getDocumentTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'notes':
        return { bg: `${colors.blue}15`, text: colors.blue, border: `${colors.blue}40` };
      case 'assignment':
        return { bg: `${colors.amber}15`, text: colors.amber, border: `${colors.amber}40` };
      case 'research':
        return { bg: `${colors.green}15`, text: colors.green, border: `${colors.green}40` };
      case 'certificate':
        return { bg: `${colors.golden}15`, text: colors.golden, border: `${colors.golden}40` };
      case 'other':
        return { bg: `${colors.gray}15`, text: colors.gray, border: `${colors.gray}40` };
      default:
        return { bg: `${colors.golden}15`, text: colors.golden, border: `${colors.golden}40` };
    }
  };

  // ============= API FUNCTIONS =============

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/student/documents`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch documents');

      const data = await response.json();
      setDocuments(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('ERROR:', error.message);
      setDocuments([]);
      setLoading(false);
    }
  };

  const uploadDocument = async (formData) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      });

      xhr.open('POST', `${API_BASE_URL}/student/documents/upload`);
      xhr.send(formData);

      await uploadPromise;
      alert('Document uploaded successfully!');
      await fetchDocuments();

      setUploading(false);
      setShowUploadModal(false);
      resetForm();
    } catch (error) {
      console.error('UPLOAD ERROR:', error);
      alert('Failed to upload document');
      setUploading(false);
    }
  };

  const downloadDocument = async (documentId, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/documents/download/${documentId}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Document downloaded successfully!');
    } catch (error) {
      console.error('DOWNLOAD ERROR:', error);
      alert('Failed to download document');
    }
  };

  const viewDocumentInPopup = async (document) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/documents/view/${document._id}`);
      if (!response.ok) throw new Error('View failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setPreviewDocument({
        ...document,
        url: url,
        type: blob.type
      });
      setShowPreviewModal(true);
    } catch (error) {
      console.error('VIEW ERROR:', error);
      alert('Failed to view document');
    }
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/student/documents/${documentId}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) throw new Error('Delete failed');

      alert('Document deleted successfully!');
      await fetchDocuments();
    } catch (error) {
      console.error('DELETE ERROR:', error);
      alert('Failed to delete document');
    }
  };

  const updateDocumentTitle = async (documentId, newTitle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/documents/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) throw new Error('Update failed');

      alert('Document title updated successfully!');
      await fetchDocuments();
      setEditingDocument(null);
      setEditedTitle('');
    } catch (error) {
      console.error('UPDATE ERROR:', error);
      alert('Failed to update document title');
    }
  };

  // ============= USE EFFECTS =============

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowUploadModal(false);
      }
    };

    if (showUploadModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUploadModal]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (previewModalRef.current && !previewModalRef.current.contains(e.target)) {
        closePreviewModal();
      }
    };

    if (showPreviewModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPreviewModal]);

  // ============= EVENT HANDLERS =============

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const filenameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      
      setNewDocument(prev => ({ 
        ...prev, 
        file,
        title: prev.title ? prev.title : filenameWithoutExt
      }));
    }
  };

  const resetForm = () => {
    setNewDocument({
      title: '',
      file: null,
      documentType: 'Notes',
      description: ''
    });
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closePreviewModal = () => {
    if (previewDocument?.url) {
      window.URL.revokeObjectURL(previewDocument.url);
    }
    setPreviewDocument(null);
    setShowPreviewModal(false);
    setEditingDocument(null);
    setEditedTitle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newDocument.title || !newDocument.file) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', newDocument.title);
    formData.append('file', newDocument.file);
    formData.append('documentType', newDocument.documentType);
    formData.append('description', newDocument.description);

    try {
      await uploadDocument(formData);
    } catch (error) {
      console.error('SUBMIT ERROR:', error);
    }
  };

  // ============= FILTER LOGIC =============

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || doc.documentType === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ============= HELPER FUNCTIONS =============

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const metrics = {
    totalDocuments: documents.length,
    totalSize: documents.reduce((sum, d) => sum + parseFloat(d.size || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.golden }}></div>
        <span className="ml-2" style={{ color: colors.gray }}>Loading documents...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:ml-60 pt-16 lg:pt-0" style={{ background: colors.cream }}>

      {/* Header */}
      <header className="border-b py-3" style={{
        background: `rgba(255, 255, 255, 0.03)`,
        borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
      }}>
        <div className="px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: colors.navy }}>
              <Folder className="w-6 h-6" style={{ color: colors.golden }} />
              My Documents
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.gray }}>
              Manage your personal document library
            </p>
          </div>

          <button
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-white flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
            }}
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-4 sm:py-6">
        {/* Metrics Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              label: 'Total Documents',
              value: metrics.totalDocuments,
              icon: <FileText className="w-5 h-5" />,
              color: colors.blue,
              subtitle: 'All documents'
            },
            {
              label: 'Storage Used',
              value: `${(metrics.totalSize / 1024).toFixed(1)} MB`,
              icon: <Archive className="w-5 h-5" />,
              color: colors.golden,
              subtitle: 'Total storage'
            }
          ].map((metric, index) => (
            <div key={index} className="p-4 rounded-lg backdrop-blur-sm transition-all hover:scale-105" style={{
              background: `rgba(255, 255, 255, 0.9)`,
              border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
            }}>
              <div className="flex justify-between items-center mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  background: `rgba(${parseInt(metric.color.slice(1, 3), 16)}, ${parseInt(metric.color.slice(3, 5), 16)}, ${parseInt(metric.color.slice(5, 7), 16)}, 0.15)`,
                  color: metric.color
                }}>
                  {metric.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: colors.navy }}>{metric.value}</h3>
              <p className="text-sm mb-1" style={{ color: colors.gray }}>{metric.label}</p>
              <p className="text-xs" style={{ color: colors.gray }}>{metric.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-6 p-4 rounded-lg backdrop-blur-sm" style={{
          background: `rgba(255, 255, 255, 0.9)`,
          border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: colors.gray }} />
            <input
              type="text"
              placeholder="Search your documents..."
              className="pl-10 pr-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 text-sm transition-all"
              style={{
                background: `white`,
                border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`,
                color: colors.navy
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Document Library */}
        <div className="px-4 rounded-lg backdrop-blur-sm" style={{
          background: `rgba(255, 255, 255, 0.9)`,
          border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
        }}>
          {/* Category Filter */}
          <div className="p-4 border-b flex flex-wrap gap-2" style={{
            borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  selectedCategory === cat ? 'text-white' : 'text-gray-700'
                }`}
                style={{
                  background: selectedCategory === cat 
                    ? `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                    : 'white',
                  border: `1px solid ${colors.golden}40`
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Documents Grid */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => {
                const typeColors = getDocumentTypeColor(document.documentType);

                return (
                  <div
                    key={document._id}
                    className="p-4 rounded-lg backdrop-blur-sm transition-all hover:scale-[1.02]"
                    style={{
                      background: `white`,
                      border: `1px solid rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                    }}
                  >
                    {/* Document Header */}
                    <div className="flex justify-between items-start mb-3">
                      <span 
                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{
                          background: typeColors.bg,
                          color: typeColors.text,
                          border: `1px solid ${typeColors.border}`
                        }}
                      >
                        {document.documentType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                        background: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.10)`,
                        color: colors.golden
                      }}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold truncate" style={{ color: colors.navy }}>
                          {document.title}
                        </h3>
                        <p className="text-xs" style={{ color: colors.gray }}>
                          {formatFileSize(document.size)}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {document.description && (
                      <p className="text-sm line-clamp-2 mb-3" style={{ color: colors.gray }}>
                        {document.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{
                      borderColor: `rgba(${parseInt(colors.golden.slice(1, 3), 16)}, ${parseInt(colors.golden.slice(3, 5), 16)}, ${parseInt(colors.golden.slice(5, 7), 16)}, 0.15)`
                    }}>
                      <button
                        className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-semibold text-xs transition-all"
                        style={{
                          background: `${colors.blue}15`,
                          color: colors.blue
                        }}
                        onClick={() => viewDocumentInPopup(document)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      <button
                        className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-semibold text-xs transition-all"
                        style={{
                          background: `${colors.green}15`,
                          color: colors.green
                        }}
                        onClick={() => downloadDocument(document._id, document.filename)}
                      >
                        <Download className="w-4 h-4" />
                        Save
                      </button>

                      <button
                        className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg font-semibold text-xs transition-all"
                        style={{
                          background: `${colors.red}15`,
                          color: colors.red
                        }}
                        onClick={() => deleteDocument(document._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 mx-auto mb-4" style={{ color: colors.golden }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.navy }}>No documents found</h3>
                <p className="mb-4 text-sm" style={{ color: colors.gray }}>
                  {searchQuery ? 'Try adjusting your search' : 'Upload your first document to get started'}
                </p>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.golden}, ${colors.golden}DD)`
                  }}
                  onClick={() => setShowUploadModal(true)}
                >
                  Upload Document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex-shrink-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold" style={{ color: colors.navy }}>
                Upload New Document
              </h2>
              <button onClick={() => { setShowUploadModal(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-6 h-6" style={{ color: colors.gray }} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form id="uploadForm" onSubmit={handleSubmit} className="space-y-5">

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    File Upload <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: colors.golden }}>
                    <input
                      ref={fileInputRef}
                      required
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: colors.golden }} />
                      {newDocument.file ? (
                        <div>
                          <p className="text-sm font-medium" style={{ color: colors.navy }}>
                            {newDocument.file.name}
                          </p>
                          <p className="text-xs mt-1" style={{ color: colors.gray }}>
                            {formatFileSize(newDocument.file.size)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium" style={{ color: colors.navy }}>
                            Click to upload document
                          </p>
                          <p className="text-xs mt-1" style={{ color: colors.gray }}>
                            PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Document Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Document Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="title"
                    value={newDocument.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Criminal Law Notes - Chapter 1"
                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb', color: colors.navy }}
                  />
                </div>

                {/* Document Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="documentType"
                    value={newDocument.documentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb', color: colors.navy }}
                  >
                    <option value="Notes">📝 Notes</option>
                    <option value="Assignment">📋 Assignment</option>
                    <option value="Research">🔬 Research</option>
                    <option value="Certificate">🏆 Certificate</option>
                    <option value="Other">📄 Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Description <span className="text-xs" style={{ color: colors.gray }}>(optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={newDocument.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Brief description of the document..."
                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 resize-none"
                    style={{ borderColor: '#e5e7eb', color: colors.navy }}
                  />
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.navy }}>Uploading...</span>
                      <span style={{ color: colors.gray }}>{uploadProgress}%</span>
                    </div>
                    <div className="w-full rounded-full h-2 bg-gray-200">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%`, background: colors.golden }}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 bg-white border-t px-6 py-4 flex gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => { setShowUploadModal(false); resetForm(); }}
                disabled={uploading}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#e5e7eb', color: colors.gray }}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="uploadForm"
                disabled={uploading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
                style={{ background: colors.golden }}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div ref={previewModalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
              <div className="flex-1">
                {editingDocument === previewDocument._id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-xl font-bold px-3 py-1 border-2 rounded-lg focus:outline-none"
                      style={{ borderColor: colors.golden, color: colors.navy }}
                      placeholder="Enter new title"
                    />
                    <button
                      onClick={() => updateDocumentTitle(previewDocument._id, editedTitle)}
                      className="px-3 py-1 rounded-lg text-sm font-semibold text-white"
                      style={{ background: colors.green }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingDocument(null);
                        setEditedTitle('');
                      }}
                      className="px-3 py-1 rounded-lg text-sm font-semibold"
                      style={{ color: colors.gray }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold" style={{ color: colors.navy }}>
                      {previewDocument.title}
                    </h2>
                    <p className="text-sm" style={{ color: colors.gray }}>
                      {formatFileSize(previewDocument.size)} • {formatDate(previewDocument.uploadedAt)}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingDocument !== previewDocument._id && (
                  <button
                    onClick={() => {
                      setEditingDocument(previewDocument._id);
                      setEditedTitle(previewDocument.title);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
                    style={{
                      background: `${colors.green}15`,
                      color: colors.green,
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}

                <button
                  onClick={() => downloadDocument(previewDocument._id, previewDocument.filename)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
                  style={{
                    background: `${colors.blue}15`,
                    color: colors.blue,
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

                <button 
                  onClick={closePreviewModal} 
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" style={{ color: colors.gray }} />
                </button>
              </div>
            </div>

            {/* Document Preview */}
            <div className="flex-1 overflow-hidden bg-gray-100 rounded-b-xl">
              {previewDocument.type === 'application/pdf' ? (
                <iframe
                  src={previewDocument.url}
                  className="w-full h-full"
                  title="Document Preview"
                />
              ) : previewDocument.type.startsWith('image/') ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={previewDocument.url} 
                    alt={previewDocument.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: colors.gray }} />
                    <p className="text-lg font-semibold mb-2" style={{ color: colors.navy }}>
                      Preview not available
                    </p>
                    <p className="text-sm mb-4" style={{ color: colors.gray }}>
                      Download the document to view it
                    </p>
                    <button
                      onClick={() => downloadDocument(previewDocument._id, previewDocument.filename)}
                      className="px-6 py-3 text-sm font-medium text-white rounded-lg"
                      style={{ background: colors.golden }}
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;
