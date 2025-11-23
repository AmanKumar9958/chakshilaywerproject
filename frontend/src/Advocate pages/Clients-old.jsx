import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar, 
  DollarSign, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Send, 
  Upload, 
  Download, 
  Eye, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Star,
  AlertCircle,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Video,
  Mic,
  Paperclip
} from 'lucide-react';

export default function Clients() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile view on resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data for clients
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      address: 'Delhi High Court Area, New Delhi',
      status: 'active',
      caseType: 'Corporate Law',
      totalFees: 500000,
      paidFees: 300000,
      outstandingFees: 200000,
      joinDate: '2024-01-15',
      documents: 12,
      hearings: 3,
      rating: 4.8,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      address: 'Connaught Place, New Delhi',
      status: 'active',
      caseType: 'Family Law',
      totalFees: 150000,
      paidFees: 150000,
      outstandingFees: 0,
      joinDate: '2024-02-01',
      documents: 8,
      hearings: 2,
      rating: 4.9,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 76543 21098',
      address: 'Sector 15, Gurgaon',
      status: 'pending',
      caseType: 'Criminal Law',
      totalFees: 750000,
      paidFees: 250000,
      outstandingFees: 500000,
      joinDate: '2024-01-10',
      documents: 15,
      hearings: 5,
      rating: 4.7,
      avatar: '/api/placeholder/40/40'
    }
  ]);

  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      clientId: 1,
      messages: [
        {
          id: 1,
          sender: 'client',
          message: 'Hello, I need to discuss the contract review status.',
          timestamp: '2024-01-20 10:30 AM',
          type: 'text'
        },
        {
          id: 2,
          sender: 'advocate',
          message: 'Good morning! I have reviewed the contract. There are a few key points we need to address.',
          timestamp: '2024-01-20 10:45 AM',
          type: 'text'
        }
      ]
    }
  ]);

  const billingData = {
    totalRevenue: 1200000,
    pendingPayments: 700000,
    monthlyRecurring: 450000,
    averageClientValue: 375000
  };

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      client: 'Priya Sharma',
      action: 'Payment received',
      amount: '₹1,50,000',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'document',
      client: 'Rajesh Kumar',
      action: 'Document uploaded',
      details: 'Contract Amendment',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'meeting',
      client: 'Amit Patel',
      action: 'Meeting scheduled',
      details: 'Court hearing preparation',
      time: '1 day ago'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.caseType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedClient) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'advocate',
      message: newMessage,
      timestamp: new Date().toLocaleString(),
      type: 'text'
    };
    
    setConversations(prev => prev.map(conv => 
      conv.clientId === selectedClient.id 
        ? { ...conv, messages: [...conv.messages, newMsg] }
        : conv
    ));
    
    setNewMessage('');
  };

  const ClientOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: clients.length, icon: Users, color: 'text-blue-600', change: '+12%' },
          { label: 'Active Cases', value: clients.filter(c => c.status === 'active').length, icon: FileText, color: 'text-green-600', change: '+8%' },
          { label: 'Total Revenue', value: `₹${(billingData.totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: 'text-yellow-600', change: '+15%' },
          { label: 'Pending Payments', value: `₹${(billingData.pendingPayments / 100000).toFixed(1)}L`, icon: Clock, color: 'text-red-600', change: '-5%' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="mt-2 flex items-center text-xs">
                {isPositive ? (
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'payment' ? 'bg-green-100' :
                    activity.type === 'document' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                    {activity.type === 'document' && <FileText className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.client}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="font-medium text-green-600">{activity.amount}</p>
                  )}
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ClientList = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Client</span>
        </button>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.caseType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {client.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{client.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3 text-center">
              <div>
                <p className="text-sm font-medium text-gray-900">₹{(client.totalFees / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-600">Total Fees</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{client.documents}</p>
                <p className="text-xs text-gray-600">Documents</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{client.hearings}</p>
                <p className="text-xs text-gray-600">Hearings</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">{client.rating}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setSelectedClient(client);
                    setActiveTab('communication');
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>

            {client.outstandingFees > 0 && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-800">
                    Outstanding: ₹{(client.outstandingFees / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const Communication = () => {
    const currentConversation = conversations.find(conv => conv.clientId === selectedClient?.id);

    if (isMobile && !selectedClient) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
          <p className="text-gray-600">Choose a client to start messaging</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px]">
        {/* Client List - Hidden on mobile when chat is open */}
        {(!isMobile || !selectedClient) && (
          <div className="bg-white border border-gray-200 rounded-lg lg:col-span-1">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Conversations</h3>
            </div>
            <div className="p-2 space-y-1 overflow-y-auto max-h-[432px]">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedClient?.id === client.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{client.name}</p>
                      <p className="text-sm text-gray-600 truncate">{client.caseType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {selectedClient && (
          <div className={`bg-white border border-gray-200 rounded-lg flex flex-col ${
            isMobile ? 'fixed inset-0 z-50' : 'lg:col-span-2'
          }`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <button 
                    onClick={() => setSelectedClient(null)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    ←
                  </button>
                )}
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedClient.name}</h3>
                  <p className="text-sm text-gray-600">Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded">
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {currentConversation?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'advocate' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.sender === 'advocate'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'advocate' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded">
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Billing = () => (
    <div className="space-y-6">
      {/* Billing Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(billingData.totalRevenue / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Pending Payments', value: `₹${(billingData.pendingPayments / 100000).toFixed(1)}L`, icon: Clock, color: 'text-red-600' },
          { label: 'Monthly Recurring', value: `₹${(billingData.monthlyRecurring / 100000).toFixed(1)}L`, icon: DollarSign, color: 'text-blue-600' },
          { label: 'Avg Client Value', value: `₹${(billingData.averageClientValue / 1000).toFixed(0)}K`, icon: Star, color: 'text-yellow-600' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Client Billing Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Client Billing</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fees</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.caseType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    ₹{(client.totalFees / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600">
                    ₹{(client.outstandingFees / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.outstandingFees === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.outstandingFees === 0 ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Documents = () => (
    <div className="space-y-6">
      {/* Document Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Contracts', count: 24, icon: FileText, color: 'text-blue-600' },
          { label: 'Evidence Files', count: 18, icon: FileText, color: 'text-green-600' },
          { label: 'Legal Docs', count: 32, icon: FileText, color: 'text-purple-600' }
        ].map((category, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{category.label}</p>
                <p className="text-xl font-semibold text-gray-900">{category.count}</p>
              </div>
              <FileText className={`h-6 w-6 ${category.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[
              { name: 'Contract_Amendment.pdf', client: 'Rajesh Kumar', size: '2.4 MB', date: '2024-01-20' },
              { name: 'Evidence_Photos.zip', client: 'Priya Sharma', size: '15.2 MB', date: '2024-01-19' },
              { name: 'Legal_Notice.docx', client: 'Amit Patel', size: '186 KB', date: '2024-01-18' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-600">{doc.client} • {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{doc.date}</span>
                  <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Manage your clients and cases</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-4 sm:space-x-8 min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'clients', label: 'Clients', icon: User },
              { id: 'communication', label: 'Communication', icon: MessageSquare },
              { id: 'billing', label: 'Billing', icon: DollarSign },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map((tab) => (
              <TabButton
                key={tab.id}
                {...tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && <ClientOverview />}
          {activeTab === 'clients' && <ClientList />}
          {activeTab === 'communication' && <Communication />}
          {activeTab === 'billing' && <Billing />}
          {activeTab === 'documents' && <Documents />}
        </div>
      </div>
    </div>
  );
}