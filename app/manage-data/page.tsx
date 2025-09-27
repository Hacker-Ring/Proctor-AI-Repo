'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DocumentService } from '../../lib/document-service';
import { Database } from '../../lib/database.types';
import DocumentUploadModal from '../components/DocumentUploadModal';
import ProtectedLayout from '../components/ProtectedLayout';

type Document = Database['public']['Tables']['knowledge_base']['Row'];

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

const getFileIcon = (filename: string) => {
  const ext = getFileExtension(filename);
  switch (ext) {
    case 'pdf':
      return 'P';
    case 'doc':
    case 'docx':
      return 'D';
    case 'txt':
      return 'T';
    case 'xlsx':
    case 'xls':
      return 'X';
    case 'pptx':
    case 'ppt':
      return 'P';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'I';
    default:
      return 'F';
  }
};

const getStatusColor = (documentType: string) => {
  // For now, we'll consider all documents as processed since they're successfully uploaded
  return 'text-green-600 bg-green-50';
};

const getStatusIcon = (documentType: string) => {
  // For now, we'll consider all documents as processed since they're successfully uploaded
  return '✓';
};

export default function ManageData() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = ['All', 'Requirements', 'Forms', 'Guidelines', 'Financial', 'Templates', 'Policies', 'Contact', 'Reports'];

  // Load documents on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const docs = await DocumentService.getUserDocuments(user.id);
        setDocuments(docs);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user?.id]);

  const handleUploadSuccess = async () => {
    // Reload documents after successful upload
    if (!user?.id) return;
    
    try {
      const docs = await DocumentService.getUserDocuments(user.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to reload documents:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!user?.id) return;
    
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await DocumentService.deleteDocument(documentId, user.id);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.document_type.includes(selectedCategory.toLowerCase());
    const matchesSearch = doc.document_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  return (
    <ProtectedLayout>
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
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-black mb-2">Loading documents...</h3>
          <p className="text-gray-600">Please wait while we fetch your documents</p>
        </div>
      )}

      {/* Documents Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="card p-4 group hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200 flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-600">{getFileIcon(document.document_name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black text-sm truncate" title={document.document_name}>
                      {document.document_name}
                    </h3>
                    <p className="text-xs text-gray-600">{getFileExtension(document.document_name).toUpperCase()}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-[6px] text-xs font-medium ${getStatusColor(document.document_type)} flex-shrink-0 ml-2`}>
                  {getStatusIcon(document.document_type)} processed
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium text-black">{formatFileSize(document.file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-black">{document.document_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploaded:</span>
                  <span className="font-medium text-black">
                    {new Date(document.upload_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <a
                      href={document.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-secondary text-xs py-1.5 text-center"
                    >
                      View
                    </a>
                    <a
                      href={document.document_url}
                      download={document.document_name}
                      className="flex-1 btn-primary text-xs py-1.5 text-center"
                    >
                      Download
                    </a>
                  </div>
                  <button
                    onClick={() => handleDeleteDocument(document.id)}
                    className="w-full text-xs text-red-600 hover:text-red-800 py-1.5 hover:bg-red-50 rounded transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-black mb-2">No documents found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-black">{documents.length}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-black">
                  {formatFileSize(documents.reduce((sum, doc) => sum + doc.file_size, 0))}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-black">
                  {documents.filter(doc => {
                    const docDate = new Date(doc.upload_date);
                    const now = new Date();
                    return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">File Types</p>
                <p className="text-2xl font-bold text-black">
                  {new Set(documents.map(doc => getFileExtension(doc.document_name))).size}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      </div>
    </ProtectedLayout>
  );
}
