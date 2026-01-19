"use client";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Daily Operations</h3>
          <p className="text-sm text-gray-600">Daily operations report - coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Route Performance</h3>
          <p className="text-sm text-gray-600">Route performance metrics - coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Sales Analysis</h3>
          <p className="text-sm text-gray-600">Sales analysis reports - coming soon</p>
        </div>
      </div>
    </div>
  );
}
