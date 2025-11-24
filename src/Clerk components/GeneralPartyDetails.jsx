import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Plus,
  X,
  Mail,
  Phone,
  FileText,
  Building,
  User as UserIcon,
  Users,
  Eye,
  Trash2,
  Filter,
  Upload,
  File,
  CreditCard,
  Download,
  AlertCircle,
} from 'lucide-react';

// API base URL
const API_BASE_URL = 'http://localhost:4000/api';

const GeneralPartyDetails = () => {
  const colors = {
    cream: '#f5f5ef',
    navy: '#1f2839',
    gold: '#b69d74',
    golden: '#b69d74',
    gray: '#6b7280',
    success: '#10b981',
    green: '#10b981',
    danger: '#ef4444',
    blue: '#3b82f6',
    amber: '#f59e0b',
  };

  // File upload refs
  const panCardUploadRef = useRef(null);
  const aadhaarCardUploadRef = useRef(null);
  const viewPanUploadRef = useRef(null);
  const viewAadhaarUploadRef = useRef(null);

  // State management
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);
  const [showViewPartyModal, setShowViewPartyModal] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(false);

  const [uploadedPanCard, setUploadedPanCard] = useState(null);
  const [uploadedAadhaar, setUploadedAadhaar] = useState(null);

  const [parties, setParties] = useState([]);

  const [newParty, setNewParty] = useState({
    name: '',
    type: 'Individual',
    contact: '',
    phone: '',
    notes: '',
    address: '',
    occupation: '',
    company: '',
    panCard: null,
    aadhaarCard: null,
    panNumber: '',
    aadhaarNumber: '',
  });

  // Fetch parties from backend
  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/clerk-parties`);
      if (response.data.success) {
        setParties(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
      setParties([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter parties based on search and type
  const filteredParties = parties.filter(
    (party) => {
      const matchesSearch =
        party.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        party.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        party.contact?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || party.type === filterType;
      return matchesSearch && matchesType;
    }
  );

  // File upload handlers for PAN and Aadhaar cards
  const validateFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return false;
    }
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      alert('Only JPG, PNG, and PDF files are allowed');
      return false;
    }
    return true;
  };

  const handlePanCardUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setUploadedPanCard(file);
      setNewParty({ ...newParty, panCard: file });
    }
  };

  const handleAadhaarCardUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setUploadedAadhaar(file);
      setNewParty({ ...newParty, aadhaarCard: file });
    }
  };

  // Upload ID proof for viewed party
  const handleViewIdUpload = async (type, file) => {
    if (!file || !selectedParty) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/clerk-parties/${selectedParty._id}/upload-id`,
        {
          type: type === 'pan' ? 'PAN Card' : 'Aadhaar',
          number:
            type === 'pan'
              ? selectedParty.panCard?.number
              : selectedParty.aadhaarCard?.number,
          fileUrl: 'https://example.com/uploads/' + file.name, // Placeholder
        }
      );
      if (response.data.success) {
        alert(`${type.toUpperCase()} Card uploaded successfully!`);
        handleViewParty(selectedParty);
      }
    } catch (error) {
      console.error('Error uploading ID proof:', error);
      alert('Failed to upload ID proof');
    } finally {
      setLoading(false);
    }
  };

  // View party details modal
  const handleViewParty = async (party) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/clerk-parties/${party._id}`);
      if (response.data.success) {
        setSelectedParty(response.data.data);
        setShowViewPartyModal(true);
      } else {
        setSelectedParty(party);
        setShowViewPartyModal(true);
      }
    } catch (error) {
      setSelectedParty(party);
      setShowViewPartyModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Add a new party
  const handleAddParty = async () => {
    if (!newParty.name || !newParty.contact) {
      alert('Please fill in required fields (Name and Contact)');
      return;
    }
    setLoading(true);
    try {
      const partyData = {
        name: newParty.name,
        type: newParty.type,
        email: newParty.contact,
        phone: newParty.phone,
        address: newParty.address,
        occupation: newParty.occupation,
        company: newParty.company,
        notes: newParty.notes,
        panNumber: newParty.panNumber,
        aadhaarNumber: newParty.aadhaarNumber,
      };
      const response = await axios.post(`${API_BASE_URL}/clerk-parties`, partyData);
      if (response.data.success) {
        alert('Party created successfully!');
        setNewParty({
          name: '',
          type: 'Individual',
          contact: '',
          phone: '',
          notes: '',
          address: '',
          occupation: '',
          company: '',
          panCard: null,
          aadhaarCard: null,
          panNumber: '',
          aadhaarNumber: '',
        });
        setUploadedPanCard(null);
        setUploadedAadhaar(null);
        setShowAddPartyModal(false);
        fetchParties();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create party. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete party
  const handleDeleteParty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this party?')) return;
    setLoading(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/clerk-parties/${id}`);
      if (response.data.success) {
        alert('Party archived successfully!');
        fetchParties();
      }
    } catch (error) {
      alert('Failed to delete party. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for icons and colors
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Individual':
        return <UserIcon className="w-6 h-6" />;
      case 'Company':
        return <Building className="w-6 h-6" />;
      case 'Government':
        return <Users className="w-6 h-6" />;
      default:
        return <UserIcon className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Individual':
        return colors.success;
      case 'Company':
        return colors.gold;
      case 'Government':
        return colors.navy;
      default:
        return colors.gray;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return colors.success;
      case 'Pending':
        return colors.gold;
      case 'Closed':
      case 'Inactive':
        return colors.gray;
      default:
        return colors.gray;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Active':
        return `${colors.success}15`;
      case 'Pending':
        return `${colors.gold}15`;
      case 'Closed':
      case 'Inactive':
        return `${colors.gray}15`;
      default:
        return `${colors.gray}15`;
    }
  };

  return (
   <div
    className="min-h-screen w-full lg:ml-60 pt-16 lg:pt-0"
    style={{ background: '#f5f5ef', display: 'flex', flexDirection: 'column' }}
  >
      {/* Parties Directory Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: colors.navy }}>
          Parties Directory
        </h2>
        <p className="text-sm" style={{ color: colors.gray }}>
          {filteredParties.length} {filteredParties.length === 1 ? 'party' : 'parties'} found
        </p>
      </div>

      {/* Add Party Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddPartyModal(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white"
          style={{ backgroundColor: colors.gold }}
        >
          <Plus className="w-5 h-5" />
          Add Party
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: colors.gray }} />
          <input
            type="text"
            placeholder="Search by name or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
            style={{ borderColor: colors.gray + '40' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" style={{ color: colors.gray }} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
            style={{ borderColor: colors.gray + '40' }}
          >
            <option value="All">All Types</option>
            <option value="Individual">Individual</option>
            <option value="Company">Company</option>
            <option value="Government">Government</option>
          </select>
        </div>
      </div>

      {/* Parties Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        {loading && parties.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderColor: colors.gold }}
              ></div>
              <p style={{ color: colors.gray }}>Loading parties...</p>
            </div>
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead style={{ backgroundColor: `${colors.navy}05` }}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: colors.navy }}>
                  Party Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: colors.navy }}>
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold hidden md:table-cell" style={{ color: colors.navy }}>
                  Contact
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: colors.navy }}>
                  Cases
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: colors.navy }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredParties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: colors.gray }} />
                    <p className="text-base font-medium" style={{ color: colors.gray }}>
                      No parties found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredParties.map((party) => (
                  <tr key={party._id || party.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: getTypeColor(party.type) + '20' }}
                        >
                          {React.cloneElement(getTypeIcon(party.type), {
                            className: 'w-4 h-4',
                            style: { color: getTypeColor(party.type) },
                          })}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: colors.navy }}>
                            {party.name}
                          </p>
                          <p className="text-xs hidden lg:block" style={{ color: colors.gray }}>
                            Added: {new Date(party.addedDate || party.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                        style={{
                          backgroundColor: getTypeColor(party.type) + '20',
                          color: getTypeColor(party.type),
                        }}
                      >
                        {party.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="w-3 h-3 flex-shrink-0" style={{ color: colors.gray }} />
                          <span className="truncate max-w-[200px]" style={{ color: colors.navy }}>
                            {party.email || party.contact}
                          </span>
                        </div>
                        {party.phone && (
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3 h-3 flex-shrink-0" style={{ color: colors.gray }} />
                            <span style={{ color: colors.navy }}>{party.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{ backgroundColor: colors.gold + '20', color: colors.gold }}
                      >
                        <FileText className="w-3 h-3" />
                        <span className="font-semibold text-xs">{party.linkedCases || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewParty(party)}
                          disabled={loading}
                          className="p-1.5 rounded-lg transition-colors hover:bg-blue-50 disabled:opacity-50"
                          title="View Details"
                          style={{ color: colors.navy }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteParty(party._id || party.id)}
                          disabled={loading}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-50 disabled:opacity-50"
                          title="Delete Party"
                          style={{ color: colors.danger }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD PARTY MODAL */}
      {showAddPartyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden" style={{ maxHeight: '90vh' }}>
            <div
              className="px-4 py-4 flex items-center justify-between border-b"
              style={{ backgroundColor: `${colors.golden}10` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.golden }}>
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: colors.navy }}>
                  Add New Party
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddPartyModal(false);
                  setUploadedPanCard(null);
                  setUploadedAadhaar(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: colors.gray }} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Party Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Party Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                    placeholder="Party name"
                    required
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* Email / Contact */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Email / Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newParty.contact}
                    onChange={(e) => setNewParty({ ...newParty, contact: e.target.value })}
                    placeholder="Email or contact"
                    required
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newParty.phone}
                    onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={newParty.address}
                    onChange={(e) => setNewParty({ ...newParty, address: e.target.value })}
                    placeholder="Address"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={newParty.occupation}
                    onChange={(e) => setNewParty({ ...newParty, occupation: e.target.value })}
                    placeholder="Occupation"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Company
                  </label>
                  <input
                    type="text"
                    value={newParty.company}
                    onChange={(e) => setNewParty({ ...newParty, company: e.target.value })}
                    placeholder="Company"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* PAN Number */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={newParty.panNumber}
                    onChange={(e) => setNewParty({ ...newParty, panNumber: e.target.value })}
                    placeholder="PAN number"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* Aadhaar Number */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={newParty.aadhaarNumber}
                    onChange={(e) => setNewParty({ ...newParty, aadhaarNumber: e.target.value })}
                    placeholder="Aadhaar number"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Description
                  </label>
                  <textarea
                    value={newParty.notes}
                    onChange={(e) => setNewParty({ ...newParty, notes: e.target.value })}
                    placeholder="Notes (optional)"
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm resize-none"
                    style={{ borderColor: colors.gray + '40' }}
                  />
                </div>

                {/* PAN Card Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    PAN Card Upload
                  </label>
                  <input
                    ref={panCardUploadRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePanCardUpload}
                    className="w-full"
                  />
                  {uploadedPanCard && (
                    <div
                      className="mt-2 p-2 rounded-lg"
                      style={{ backgroundColor: colors.gold + '10', color: colors.navy }}
                    >
                      {uploadedPanCard.name}
                    </div>
                  )}
                </div>

                {/* Aadhaar Card Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.navy }}>
                    Aadhaar Card Upload
                  </label>
                  <input
                    ref={aadhaarCardUploadRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleAadhaarCardUpload}
                    className="w-full"
                  />
                  {uploadedAadhaar && (
                    <div
                      className="mt-2 p-2 rounded-lg"
                      style={{ backgroundColor: colors.gold + '10', color: colors.navy }}
                    >
                      {uploadedAadhaar.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="px-4 py-4 flex items-center justify-end gap-3 border-t"
              style={{ backgroundColor: colors.cream }}
            >
              <button
                onClick={() => {
                  setShowAddPartyModal(false);
                  setUploadedPanCard(null);
                  setUploadedAadhaar(null);
                }}
                disabled={loading}
                className="px-6 py-2 rounded-lg font-semibold text-sm"
                style={{ backgroundColor: colors.gray + '20', color: colors.navy }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddParty}
                disabled={loading}
                className="px-6 py-2 rounded-lg font-semibold text-white text-sm"
                style={{ backgroundColor: colors.golden }}
              >
                {loading ? 'Adding...' : 'Add Party'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PARTY MODAL */}
      {showViewPartyModal && selectedParty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg"
            style={{
              background: colors.cream,
              border: `1px solid rgba(182, 157, 116, 0.15)`,
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'rgba(182, 157, 116, 0.15)' }}>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(182, 157, 116, 0.1)' }}
                >
                  {getTypeIcon(selectedParty.type)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.navy }}>
                    {selectedParty.name}
                  </h2>
                  {selectedParty.company && (
                    <p className="text-lg" style={{ color: colors.gray }}>
                      {selectedParty.company}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowViewPartyModal(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ background: 'rgba(182, 157, 116, 0.1)', color: colors.golden }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contact Information */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>
                    Contact Information
                  </h3>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" style={{ color: colors.golden }} />
                      <span style={{ color: colors.gray }}>{selectedParty.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" style={{ color: colors.golden }} />
                      <span style={{ color: colors.gray }}>{selectedParty.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span style={{ color: colors.golden, marginTop: 4 }}>📍</span>
                      <span style={{ color: colors.gray }}>{selectedParty.address}</span>
                    </div>
                  </div>
                </div>

                {/* ID Proofs with Upload */}
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>
                    ID Verification
                  </h3>
                  <div className="space-y-3 mt-3">
                    {selectedParty.idProofs && selectedParty.idProofs.length > 0 ? (
                      selectedParty.idProofs.map((proof, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg"
                          style={{
                            background: 'rgba(182, 157, 116, 0.05)',
                            border: '1px solid rgba(182, 157, 116, 0.15)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-medium flex items-center gap-2" style={{ color: colors.navy }}>
                                <CreditCard className="w-4 h-4" />
                                {proof.type}
                              </div>
                              <div className="text-sm" style={{ color: colors.gray }}>
                                {proof.number}
                              </div>
                            </div>
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: proof.verified ? colors.green + '20' : colors.amber + '20',
                                color: proof.verified ? colors.green : colors.amber,
                              }}
                            >
                              {proof.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>

                          {/* File display if exists */}
                          {proof.fileUrl ? (
                            <div
                              className="flex items-center justify-between p-2 rounded-lg mb-2"
                              style={{ backgroundColor: colors.golden + '10' }}
                            >
                              <div className="flex items-center gap-2">
                                <File className="w-4 h-4" style={{ color: colors.golden }} />
                                <span className="text-xs" style={{ color: colors.navy }}>
                                  {proof.fileUrl.split('/').pop()}
                                </span>
                              </div>
                              <a
                                href={proof.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-blue-600 hover:underline"
                              >
                                Download
                              </a>
                            </div>
                          ) : (
                            <div
                              className="p-2 rounded-lg text-xs text-amber-600"
                              style={{ backgroundColor: colors.amber + '10' }}
                            >
                              No file uploaded
                            </div>
                          )}

                          {!proof.verified && (
                            <div className="mt-2">
                              <label
                                htmlFor={`upload-${proof.type}`}
                                className="cursor-pointer text-blue-600 hover:underline text-sm font-semibold"
                              >
                                Upload {proof.type} file
                              </label>
                              <input
                                id={`upload-${proof.type}`}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleViewIdUpload(proof.type.toLowerCase(), e.target.files[0])}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No ID verification records found.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold" style={{ color: colors.navy }}>
                  Notes
                </h3>
                <p className="mt-2 whitespace-pre-line" style={{ color: colors.gray }}>
                  {selectedParty.notes || 'No notes available.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              className="p-4 border-t flex justify-end gap-3"
              style={{ borderColor: 'rgba(182, 157, 116, 0.15)' }}
            >
              <button
                onClick={() => setShowViewPartyModal(false)}
                className="px-6 py-2 rounded-lg font-semibold"
                style={{ backgroundColor: colors.gold, color: 'white' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralPartyDetails;
