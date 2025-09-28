import { CallMetricsService } from "../../lib/call-metrics-service";
import { DocumentService } from "../../lib/document-service";
import CallMetricsExample from "../components/CallMetricsExample";
import ProtectedLayout from "../components/ProtectedLayout";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "../../lib/supabase-server";

export default async function Dashboard() {
  const supabase = createServerSupabaseClient();

  // Check for session first, then get user from session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  console.log('Dashboard auth check:', { 
    hasSession: !!session, 
    hasUser: !!session?.user, 
    userId: session?.user?.id,
    sessionError: sessionError?.message 
  });

  if (!session || !session.user || sessionError) {
    console.log('Dashboard: No valid session, redirecting to signin:', { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      error: sessionError?.message 
    });
    redirect('/auth/signin');
  }

  console.log('Dashboard: User authenticated, proceeding to dashboard');

  const user = session.user;

  // Fetch real call metrics and document stats
  let metrics = {
    totalCalls: 0,
    avgTimeTaken: "0m 0s",
    activeCalls: 0,
    totalDocuments: 0,
    totalStorage: "0 MB"
  };

  let recentCalls: any[] = [];
  let recentDocuments: any[] = [];

  // Only fetch data if user exists
  if (user?.id) {
    try {
      const [callStats, documents] = await Promise.all([
        CallMetricsService.getCallStatistics(user.id),
        DocumentService.getUserDocuments(user.id)
      ]);

    metrics = {
      totalCalls: callStats.totalCalls,
      avgTimeTaken: `${Math.floor(callStats.averageDuration / 60)}m ${callStats.averageDuration % 60}s`,
      activeCalls: callStats.callsThisMonth,
      totalDocuments: documents.length,
      totalStorage: formatFileSize(documents.reduce((sum, doc) => sum + doc.file_size, 0))
    };

      // Get recent calls and documents
      recentCalls = await CallMetricsService.getUserCallMetrics(user.id);
      recentDocuments = documents.slice(0, 5);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  // Helper function to format file size
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <ProtectedLayout>
      <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your Proctor AI Voice Agent system</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Calls</p>
              <p className="text-3xl font-bold text-black mt-2">{metrics.totalCalls.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-[6px] flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">All time calls</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-3xl font-bold text-black mt-2">{metrics.avgTimeTaken}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-[6px] flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Per call average</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-black mt-2">{metrics.activeCalls}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-[6px] flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Calls this month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-3xl font-bold text-black mt-2">{metrics.totalDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-[6px] flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">{metrics.totalStorage} stored</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Calls */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Recent Calls</h3>
            <a href="/calls" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
          </div>
          <div className="space-y-3">
            {recentCalls.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-gray-600">No calls yet</p>
                <p className="text-sm text-gray-500">Start making calls to see them here</p>
              </div>
            ) : (
              recentCalls.slice(0, 5).map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-[6px]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-[6px] flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm">Call {call.call_id}</p>
                      <p className="text-xs text-gray-600">
                        {Math.floor(call.call_duration / 60)}m {call.call_duration % 60}s
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {new Date(call.start_time).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {JSON.parse(call.vendor_details).vendor_name}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Recent Documents</h3>
            <a href="/manage-data" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
          </div>
          <div className="space-y-3">
            {recentDocuments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">No documents yet</p>
                <p className="text-sm text-gray-500">Upload documents to see them here</p>
              </div>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-[6px]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-[6px] flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm truncate max-w-[200px]" title={doc.document_name}>
                        {doc.document_name}
                      </p>
                      <p className="text-xs text-gray-600">{formatFileSize(doc.file_size)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {new Date(doc.upload_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">{doc.document_type}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Call Metrics Component */}
      <div className="mb-8">
        <CallMetricsExample />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="font-semibold text-black mb-2">Start New Call</h3>
          <p className="text-sm text-gray-600 mb-4">Begin a new proctoring session</p>
          <button className="btn-primary w-full">Start Call</button>
        </div>

        <div className="card p-6 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-black mb-2">Upload Document</h3>
          <p className="text-sm text-gray-600 mb-4">Add new documents to knowledge base</p>
          <a href="/manage-data" className="btn-primary w-full block text-center">Upload Now</a>
        </div>

        <div className="card p-6 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-black mb-2">View Analytics</h3>
          <p className="text-sm text-gray-600 mb-4">Detailed insights and reports</p>
          <button className="btn-primary w-full">View Analytics</button>
        </div>
      </div>
      </div>
    </ProtectedLayout>
  );
}
