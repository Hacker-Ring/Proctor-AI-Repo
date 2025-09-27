'use client';

import { useState } from 'react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'xlsx' | 'pptx';
  size: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'pending' | 'error';
  category: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Admission Requirements 2024.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    status: 'processed',
    category: 'Requirements'
  },
  {
    id: '2',
    name: 'Student Application Form.docx',
    type: 'docx',
    size: '156 KB',
    uploadDate: '2024-01-14',
    status: 'processed',
    category: 'Forms'
  },
  {
    id: '3',
    name: 'Exam Guidelines.txt',
    type: 'txt',
    size: '45 KB',
    uploadDate: '2024-01-13',
    status: 'processing',
    category: 'Guidelines'
  },
  {
    id: '4',
    name: 'Fee Structure.xlsx',
    type: 'xlsx',
    size: '89 KB',
    uploadDate: '2024-01-12',
    status: 'processed',
    category: 'Financial'
  },
  {
    id: '5',
    name: 'Presentation Template.pptx',
    type: 'pptx',
    size: '1.2 MB',
    uploadDate: '2024-01-11',
    status: 'error',
    category: 'Templates'
  },
  {
    id: '6',
    name: 'Policy Document.pdf',
    type: 'pdf',
    size: '3.1 MB',
    uploadDate: '2024-01-10',
    status: 'pending',
    category: 'Policies'
  },
  {
    id: '7',
    name: 'Contact Information.doc',
    type: 'doc',
    size: '67 KB',
    uploadDate: '2024-01-09',
    status: 'processed',
    category: 'Contact'
  },
  {
    id: '8',
    name: 'Data Analysis Report.pdf',
    type: 'pdf',
    size: '4.2 MB',
    uploadDate: '2024-01-08',
    status: 'processed',
    category: 'Reports'
  }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'P';
    case 'doc':
    case 'docx':
      return 'D';
    case 'txt':
      return 'T';
    case 'xlsx':
      return 'X';
    case 'pptx':
      return 'P';
    default:
      return 'F';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'processed':
      return 'text-green-600 bg-green-50';
    case 'processing':
      return 'text-blue-600 bg-blue-50';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'error':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'processed':
      return '✓';
    case 'processing':
      return '⏳';
    case 'pending':
      return '⏸';
    case 'error':
      return '✗';
    default:
      return '?';
  }
};

export default function ManageData() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Requirements', 'Forms', 'Guidelines', 'Financial', 'Templates', 'Policies', 'Contact', 'Reports'];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Manage Data</h1>
        <p className="text-gray-600 mt-1">Upload and manage your documents</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            />
          </div>
          <button className="btn-primary">
            Upload New
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-[6px] text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="card p-4 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                  <span className="text-sm font-semibold text-gray-600">{getFileIcon(document.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black text-sm truncate" title={document.name}>
                    {document.name}
                  </h3>
                  <p className="text-xs text-gray-600">{document.type.toUpperCase()}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-[6px] text-xs font-medium ${getStatusColor(document.status)}`}>
                {getStatusIcon(document.status)} {document.status}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium text-black">{document.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-black">{document.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uploaded:</span>
                <span className="font-medium text-black">{document.uploadDate}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="flex-1 btn-secondary text-xs py-1.5">
                  View
                </button>
                <button className="flex-1 btn-primary text-xs py-1.5">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-semibold text-gray-600">F</span>
          </div>
          <h3 className="font-semibold text-black mb-2">No documents found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-black">{mockDocuments.length}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">F</span>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-black">
                {mockDocuments.filter(doc => doc.status === 'processed').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-[6px] flex items-center justify-center">
              <span className="text-sm font-semibold text-green-600">✓</span>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-black">
                {mockDocuments.filter(doc => doc.status === 'processing').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-[6px] flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">⏳</span>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-black">
                {mockDocuments.filter(doc => doc.status === 'error').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-[6px] flex items-center justify-center">
              <span className="text-sm font-semibold text-red-600">✗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
