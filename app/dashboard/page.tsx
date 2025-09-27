import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Mock data for metrics
  const metrics = {
    totalCalls: 1247,
    avgTimeTaken: "8m 32s",
    activeCalls: 23
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your ProctorAI system</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">No. of Calls</p>
              <p className="text-3xl font-bold text-black mt-2">{metrics.totalCalls.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">C</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+12% from last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Time Taken</p>
              <p className="text-3xl font-bold text-black mt-2">{metrics.avgTimeTaken}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">T</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600 font-medium">-3% from last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Active Calls</p>
              <p className="text-3xl font-bold text-black mt-2">{metrics.activeCalls}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">A</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+5 from yesterday</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Call Volume Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Call Volume Trend</h3>
          <div className="h-64 bg-gray-50 rounded-[6px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-[6px] flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-semibold text-gray-600">C</span>
              </div>
              <p className="text-gray-600">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">Line chart showing daily call volume</p>
            </div>
          </div>
        </div>

        {/* Call Duration Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Call Duration Distribution</h3>
          <div className="h-64 bg-gray-50 rounded-[6px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-[6px] flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-semibold text-gray-600">B</span>
              </div>
              <p className="text-gray-600">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">Bar chart showing call duration ranges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Peak Hours Analysis</h3>
          <div className="h-64 bg-gray-50 rounded-[6px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-[6px] flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-semibold text-gray-600">H</span>
              </div>
              <p className="text-gray-600">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">Heatmap showing peak call times</p>
            </div>
          </div>
        </div>

        {/* Success Rate Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Call Success Rate</h3>
          <div className="h-64 bg-gray-50 rounded-[6px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-[6px] flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-semibold text-gray-600">S</span>
              </div>
              <p className="text-gray-600">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">Pie chart showing success vs failed calls</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
