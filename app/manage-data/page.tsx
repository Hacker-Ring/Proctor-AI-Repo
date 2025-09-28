'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DocumentServiceClient } from '../../lib/document-service-client';
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

// Helper function to get file icon component
const getFileIcon = (filename: string) => {
  const ext = getFileExtension(filename);
  const iconClass = "w-8 h-8";
  
  switch (ext) {
    case 'pdf':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      );
    case 'doc':
    case 'docx':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
      );
    case 'txt':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="16" y1="9" x2="8" y2="9"/>
        </svg>
      );
    case 'xlsx':
    case 'xls':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="16" y1="9" x2="8" y2="9"/>
        </svg>
      );
    case 'pptx':
    case 'ppt':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      );
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      );
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Load documents on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const docs = await DocumentServiceClient.getUserDocuments(user.id);
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
      const docs = await DocumentServiceClient.getUserDocuments(user.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to reload documents:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!user?.id) return;
    
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await DocumentServiceClient.deleteDocument(documentId, user.id);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getFileExtension(doc.document_name).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  return (
    <ProtectedLayout>
      <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Manage Data</h1>
        <p className="text-gray-600 mt-1">Upload and manage your documents</p>
      </div>

      {/* Search and Upload */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search documents by name, type, or extension..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary px-6 py-3"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload New
          </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredDocuments.map((document) => {
            const uploadDate = new Date(document.upload_date);
            const isRecent = (Date.now() - uploadDate.getTime()) < (7 * 24 * 60 * 60 * 1000); // 7 days
            
            return (
              <div key={document.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 group">
                {/* File Icon and Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    {getFileIcon(document.document_name)}
                  </div>
                  {isRecent && (
                    <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded">
                      NEW
                    </span>
                  )}
                </div>

                {/* File Name */}
                <h3 className="font-medium text-black text-sm mb-2 line-clamp-2" title={document.document_name}>
                  {document.document_name}
                </h3>

                {/* File Size */}
                <p className="text-xs text-gray-500 mb-3">
                  {formatFileSize(document.file_size)}
                </p>

                {/* Upload Date */}
                <p className="text-xs text-gray-400 mb-4">
                  {uploadDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <a
                    href={document.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white border border-gray-300 text-black text-xs py-2 px-3 rounded text-center hover:bg-gray-50 transition-colors"
                  >
                    View
                  </a>
                  <a
                    href={document.document_url}
                    download={document.document_name}
                    className="flex-1 bg-black text-white text-xs py-2 px-3 rounded text-center hover:bg-gray-800 transition-colors"
                  >
                    Download
                  </a>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteDocument(document.id)}
                  className="w-full text-xs text-gray-400 hover:text-black py-2 mt-2 hover:bg-gray-50 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            );
          })}
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
