'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CallMetricsServiceClient, VendorDetails } from '../../lib/call-metrics-service-client';

export default function CallMetricsExample() {
  const { user } = useAuth();
  const [callMetrics, setCallMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCallMetrics = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const metrics = await CallMetricsServiceClient.getUserCallMetrics(user.id);
        setCallMetrics(metrics);
      } catch (error) {
        console.error('Failed to load call metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCallMetrics();
  }, [user?.id]);

  const handleSaveSampleCall = async () => {
    if (!user?.id) return;

    const sampleVendorDetails: VendorDetails = {
      vendor_name: 'Sample Vendor',
      vendor_id: 'vendor_123',
      api_version: '1.0',
      additional_info: {
        region: 'us-east-1',
        quality: 'high'
      }
    };

    try {
      const callId = `call_${Date.now()}`;
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 5 * 60 * 1000); // 5 minutes later

      await CallMetricsServiceClient.saveCallMetrics(
        user.id,
        callId,
        300, // 5 minutes in seconds
        'This is a sample call transcript. The user asked about admission requirements and we provided detailed information about the application process.',
        'User inquired about admission requirements. Provided comprehensive information about application process, deadlines, and required documents.',
        startTime,
        endTime,
        sampleVendorDetails
      );

      // Reload metrics
      const metrics = await CallMetricsServiceClient.getUserCallMetrics(user.id);
      setCallMetrics(metrics);
    } catch (error) {
      console.error('Failed to save sample call:', error);
      alert('Failed to save sample call. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Call Metrics</h3>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading call metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">Call Metrics</h3>
        <button
          onClick={handleSaveSampleCall}
          className="btn-primary text-sm"
        >
          Add Sample Call
        </button>
      </div>

      {callMetrics.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-semibold text-gray-600">C</span>
          </div>
          <h4 className="font-semibold text-black mb-2">No call metrics yet</h4>
          <p className="text-gray-600 mb-4">Click "Add Sample Call" to create a test call record</p>
        </div>
      ) : (
        <div className="space-y-4">
          {callMetrics.slice(0, 5).map((call) => (
            <div key={call.id} className="border border-gray-200 rounded-[6px] p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-black">Call {call.call_id}</h4>
                <span className="text-sm text-gray-600">
                  {new Date(call.start_time).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">{Math.floor(call.call_duration / 60)}m {call.call_duration % 60}s</span>
                </div>
                <div>
                  <span className="text-gray-600">Vendor:</span>
                  <span className="ml-2 font-medium">
                    {JSON.parse(call.vendor_details).vendor_name}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600 line-clamp-2">{call.summary}</p>
              </div>
            </div>
          ))}
          
          {callMetrics.length > 5 && (
            <p className="text-sm text-gray-600 text-center">
              Showing 5 of {callMetrics.length} calls
            </p>
          )}
        </div>
      )}
    </div>
  );
}
