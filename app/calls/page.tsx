'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CallMetricsService, VendorDetails } from '../../lib/call-metrics-service';
import ProtectedLayout from '../components/ProtectedLayout';

export default function CallsPage() {
  const { user } = useAuth();
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state for creating new call
  const [formData, setFormData] = useState({
    callId: '',
    duration: '',
    transcript: '',
    summary: '',
    vendorName: '',
    vendorId: ''
  });

  useEffect(() => {
    const loadCalls = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const callMetrics = await CallMetricsService.getUserCallMetrics(user.id);
        setCalls(callMetrics);
      } catch (error) {
        console.error('Failed to load calls:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCalls();
  }, [user?.id]);

  const handleCreateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const vendorDetails: VendorDetails = {
        vendor_name: formData.vendorName,
        vendor_id: formData.vendorId,
        api_version: '1.0'
      };

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + parseInt(formData.duration) * 60 * 1000);

      await CallMetricsService.saveCallMetrics(
        user.id,
        formData.callId,
        parseInt(formData.duration) * 60, // Convert minutes to seconds
        formData.transcript,
        formData.summary,
        startTime,
        endTime,
        vendorDetails
      );

      // Reload calls
      const updatedCalls = await CallMetricsService.getUserCallMetrics(user.id);
      setCalls(updatedCalls);
      setShowCreateForm(false);
      setFormData({
        callId: '',
        duration: '',
        transcript: '',
        summary: '',
        vendorName: '',
        vendorId: ''
      });
    } catch (error) {
      console.error('Failed to create call:', error);
      alert('Failed to create call. Please try again.');
    }
  };

  const handleDeleteCall = async (callId: string) => {
    if (!user?.id) return;
    
    if (!confirm('Are you sure you want to delete this call?')) return;

    try {
      await CallMetricsService.deleteCallMetrics(callId, user.id);
      setCalls(prev => prev.filter(call => call.call_id !== callId));
    } catch (error) {
      console.error('Failed to delete call:', error);
      alert('Failed to delete call. Please try again.');
    }
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.call_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateFilter === 'all') return matchesSearch;
    
    const callDate = new Date(call.start_time);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return matchesSearch && callDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return matchesSearch && callDate >= weekAgo;
      case 'month':
        return matchesSearch && callDate.getMonth() === now.getMonth() && callDate.getFullYear() === now.getFullYear();
      default:
        return matchesSearch;
    }
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <ProtectedLayout>
      <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Call Management</h1>
            <p className="text-gray-600 mt-1">Manage and track your proctoring calls</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            + Add New Call
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search calls by ID, transcript, or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Create Call Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[6px] p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-black mb-4">Create New Call</h2>
            <form onSubmit={handleCreateCall} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Call ID</label>
                  <input
                    type="text"
                    value={formData.callId}
                    onChange={(e) => setFormData(prev => ({ ...prev, callId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendorName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor ID</label>
                  <input
                    type="text"
                    value={formData.vendorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendorId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transcript</label>
                <textarea
                  value={formData.transcript}
                  onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-black mb-2">Loading calls...</h3>
          <p className="text-gray-600">Please wait while we fetch your call data</p>
        </div>
      )}

      {/* Calls List */}
      {!loading && (
        <div className="space-y-4">
          {filteredCalls.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">No calls found</h3>
              <p className="text-gray-600">Try adjusting your search or create a new call</p>
            </div>
          ) : (
            filteredCalls.map((call) => {
              const vendorDetails = JSON.parse(call.vendor_details);
              return (
                <div key={call.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-[6px] flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">Call {call.call_id}</h3>
                        <p className="text-sm text-gray-600">{vendorDetails.vendor_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{formatDate(call.start_time)}</span>
                      <button
                        onClick={() => handleDeleteCall(call.call_id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium text-black">{formatDuration(call.call_duration)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Vendor ID:</span>
                      <p className="font-medium text-black">{vendorDetails.vendor_id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <p className="font-medium text-green-600">Completed</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Summary:</span>
                      <p className="text-black mt-1">{call.summary}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Transcript:</span>
                      <p className="text-black mt-1 text-sm bg-gray-50 p-3 rounded-[6px] max-h-32 overflow-y-auto">
                        {call.transcript}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && calls.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Calls</p>
                <p className="text-2xl font-bold text-black">{calls.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold text-black">
                  {formatDuration(calls.reduce((sum, call) => sum + call.call_duration, 0))}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-black">
                  {formatDuration(Math.round(calls.reduce((sum, call) => sum + call.call_duration, 0) / calls.length))}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-black">
                  {calls.filter(call => {
                    const callDate = new Date(call.start_time);
                    const now = new Date();
                    return callDate.getMonth() === now.getMonth() && callDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedLayout>
  );
}
