import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Video,
  FileImage,
  FileCode,
  Search,
  Filter,
  Upload,
  MoreVertical,
  CheckCircle,
  Clock,
  Star,
  Users
} from 'lucide-react';

const Content = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'all', label: 'All Content', count: 342 },
    { id: 'courses', label: 'Courses', count: 45 },
    { id: 'articles', label: 'Articles', count: 187 },
    { id: 'videos', label: 'Videos', count: 78 },
    { id: 'documents', label: 'Documents', count: 32 }
  ];

  const stats = [
    { label: 'Total Content', value: '342', icon: FileText, color: 'from-blue-500 to-indigo-600' },
    { label: 'Published', value: '289', icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
    { label: 'Drafts', value: '38', icon: Clock, color: 'from-yellow-500 to-orange-600' },
    { label: 'Avg. Rating', value: '4.7', icon: Star, color: 'from-purple-500 to-pink-600' }
  ];

  const content = [
    {
      id: 1,
      title: 'Contract Law Fundamentals',
      type: 'course',
      author: 'Dr. Rajesh Kumar',
      status: 'published',
      enrolled: 1234,
      rating: 4.8,
      views: 15234,
      lastUpdated: '2024-10-10',
      thumbnail: '📚'
    },
    {
      id: 2,
      title: 'Understanding Criminal Procedure Code',
      type: 'article',
      author: 'Adv. Priya Sharma',
      status: 'published',
      enrolled: 0,
      rating: 4.6,
      views: 8976,
      lastUpdated: '2024-10-11',
      thumbnail: '📝'
    },
    {
      id: 3,
      title: 'Legal Research Methods - Complete Guide',
      type: 'video',
      author: 'Prof. Amit Patel',
      status: 'published',
      enrolled: 892,
      rating: 4.9,
      views: 12456,
      lastUpdated: '2024-10-09',
      thumbnail: '🎥'
    },
    {
      id: 4,
      title: 'Constitutional Law - Advanced Topics',
      type: 'course',
      author: 'Dr. Sneha Reddy',
      status: 'draft',
      enrolled: 0,
      rating: 0,
      views: 0,
      lastUpdated: '2024-10-12',
      thumbnail: '📚'
    },
    {
      id: 5,
      title: 'Cyber Law Essentials for Practitioners',
      type: 'document',
      author: 'Adv. Vikram Singh',
      status: 'published',
      enrolled: 567,
      rating: 4.5,
      views: 6789,
      lastUpdated: '2024-10-08',
      thumbnail: '📄'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'article': return FileText;
      case 'video': return Video;
      case 'document': return FileImage;
      default: return FileCode;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'article': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'video': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'document': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    return status === 'published' ? (
      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
        <CheckCircle className="w-3 h-3" />
        <span>Published</span>
      </span>
    ) : (
      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-semibold">
        <Clock className="w-3 h-3" />
        <span>Draft</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Content Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage courses, articles, videos, and documents
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {content.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-4xl">{item.thumbnail}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-semibold ${getTypeColor(item.type)}`}>
                          <TypeIcon className="w-3 h-3" />
                          <span className="capitalize">{item.type}</span>
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        By {item.author}
                      </p>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Views</p>
                    <p className="font-bold text-slate-800 dark:text-white">{item.views.toLocaleString()}</p>
                  </div>
                  {item.type === 'course' && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Enrolled</p>
                      <p className="font-bold text-slate-800 dark:text-white">{item.enrolled}</p>
                    </div>
                  )}
                  {item.rating > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rating</p>
                      <p className="font-bold text-slate-800 dark:text-white flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>{item.rating}</span>
                      </p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Updated</p>
                    <p className="text-xs font-medium text-slate-800 dark:text-white">{item.lastUpdated}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Content;
