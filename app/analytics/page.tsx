'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CallMetricsServiceClient } from '../../lib/call-metrics-service-client';
import { DocumentServiceClient } from '../../lib/document-service-client';
import ProtectedLayout from '../components/ProtectedLayout';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [callMetrics, setCallMetrics] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const [calls, docs] = await Promise.all([
          CallMetricsServiceClient.getUserCallMetrics(user.id),
          DocumentServiceClient.getUserDocuments(user.id)
        ]);
        
        setCallMetrics(calls);
        setDocuments(docs);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  // Calculate analytics
  const totalCalls = callMetrics.length;
  const totalDuration = callMetrics.reduce((sum, call) => sum + call.call_duration, 0);
  const averageDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;
  const totalDocuments = documents.length;
  const totalStorage = documents.reduce((sum, doc) => sum + doc.file_size, 0);

  // Get calls by date range
  const getCallsByDateRange = (days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return callMetrics.filter(call => new Date(call.start_time) >= cutoffDate);
  };

  const recentCalls = getCallsByDateRange(parseInt(dateRange));

  // Get calls by hour of day
  const getCallsByHour = () => {
    const hourCounts = Array(24).fill(0);
    callMetrics.forEach(call => {
      const hour = new Date(call.start_time).getHours();
      hourCounts[hour]++;
    });
    return hourCounts;
  };

  // Get calls by day of week
  const getCallsByDayOfWeek = () => {
    const dayCounts = Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    callMetrics.forEach(call => {
      const day = new Date(call.start_time).getDay();
      dayCounts[day]++;
    });
    
    return dayCounts.map((count, index) => ({
      day: dayNames[index],
      count
    }));
  };

  // Get document types distribution
  const getDocumentTypes = () => {
    const typeCounts: { [key: string]: number } = {};
    documents.forEach(doc => {
      const type = doc.document_type.split('/')[0];
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  };

  // Get vendor distribution
  const getVendorDistribution = () => {
    const vendorCounts: { [key: string]: number } = {};
    callMetrics.forEach(call => {
      const vendor = JSON.parse(call.vendor_details).vendor_name;
      vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
    });
    return Object.entries(vendorCounts).map(([vendor, count]) => ({ vendor, count }));
  };

  const hourData = getCallsByHour();
  const dayData = getCallsByDayOfWeek();
  const documentTypes = getDocumentTypes();
  const vendorDistribution = getVendorDistribution();

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-semibold text-gray-600">⏳</span>
          </div>
          <h3 className="font-semibold text-black mb-2">Loading analytics...</h3>
          <p className="text-gray-600">Please wait while we process your data</p>
        </div>
      </div>
    );
  }


  return (
    <ProtectedLayout>
      <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Analytics</h1>
            <p className="text-gray-600 mt-1">Insights and trends from your Proctor AI Voice Agent data</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Calls</p>
              <p className="text-3xl font-bold text-black mt-2">{totalCalls.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-[6px] flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600">📞</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              {recentCalls.length} in last {dateRange} days
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Duration</p>
              <p className="text-3xl font-bold text-black mt-2">{formatDuration(totalDuration)}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-[6px] flex items-center justify-center">
              <span className="text-lg font-semibold text-green-600">⏱️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              Avg: {formatDuration(Math.round(averageDuration))}
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-3xl font-bold text-black mt-2">{totalDocuments.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-[6px] flex items-center justify-center">
              <span className="text-lg font-semibold text-orange-600">📄</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              {formatFileSize(totalStorage)} stored
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendors</p>
              <p className="text-3xl font-bold text-black mt-2">{vendorDistribution.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-[6px] flex items-center justify-center">
              <span className="text-lg font-semibold text-purple-600">🏢</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              Active providers
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Call Volume by Hour */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Call Volume by Hour</h3>
          <div className="space-y-2">
            {hourData.map((count, hour) => (
              <div key={hour} className="flex items-center space-x-3">
                <div className="w-12 text-sm text-gray-600">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(5, (count / Math.max(...hourData)) * 100)}%` }}
                  ></div>
                </div>
                <div className="w-8 text-sm text-gray-600 text-right">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call Volume by Day of Week */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Call Volume by Day</h3>
          <div className="space-y-3">
            {dayData.map(({ day, count }) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{day}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(5, (count / Math.max(...dayData.map(d => d.count))) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document and Vendor Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Document Types */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Document Types</h3>
          {documentTypes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-semibold text-gray-600">📄</span>
              </div>
              <p className="text-gray-600">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentTypes.map(({ type, count }) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(5, (count / Math.max(...documentTypes.map(d => d.count))) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vendor Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Vendor Distribution</h3>
          {vendorDistribution.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-semibold text-gray-600">🏢</span>
              </div>
              <p className="text-gray-600">No calls recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vendorDistribution.map(({ vendor, count }) => (
                <div key={vendor} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{vendor}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(5, (count / Math.max(...vendorDistribution.map(v => v.count))) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Recent Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-black mb-3">Recent Calls</h4>
            {recentCalls.length === 0 ? (
              <p className="text-gray-600 text-sm">No calls in the selected period</p>
            ) : (
              <div className="space-y-2">
                {recentCalls.slice(0, 5).map((call) => (
                  <div key={call.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Call {call.call_id}</span>
                    <span className="text-gray-600">
                      {new Date(call.start_time).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-black mb-3">Recent Documents</h4>
            {documents.length === 0 ? (
              <p className="text-gray-600 text-sm">No documents uploaded</p>
            ) : (
              <div className="space-y-2">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate max-w-[200px]" title={doc.document_name}>
                      {doc.document_name}
                    </span>
                    <span className="text-gray-600">
                      {new Date(doc.upload_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </ProtectedLayout>
  );
}
