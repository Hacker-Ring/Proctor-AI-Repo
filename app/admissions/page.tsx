'use client';

import { useState } from 'react';

interface Officer {
  id: string;
  name: string;
  email: string;
  callsDone: number;
  cost: number;
  avgCallDuration: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  lastActive: string;
}

interface NewOfficer {
  name: string;
  email: string;
  password: string;
  role: string;
  documentsAccess: string[];
  accessLevel: 'read' | 'write' | 'admin';
  limits: {
    maxCallsPerDay: number;
    maxCallsPerMonth: number;
    costLimit: number;
  };
}

const mockOfficers: Officer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@proctoraivoice.com',
    callsDone: 156,
    cost: 2340.50,
    avgCallDuration: '12m 34s',
    sentiment: 'positive',
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@proctoraivoice.com',
    callsDone: 203,
    cost: 3045.75,
    avgCallDuration: '9m 12s',
    sentiment: 'positive',
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@proctoraivoice.com',
    callsDone: 89,
    cost: 1335.25,
    avgCallDuration: '15m 8s',
    sentiment: 'neutral',
    lastActive: '3 hours ago'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@proctoraivoice.com',
    callsDone: 178,
    cost: 2670.00,
    avgCallDuration: '11m 45s',
    sentiment: 'positive',
    lastActive: '30 minutes ago'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@proctoraivoice.com',
    callsDone: 134,
    cost: 2010.50,
    avgCallDuration: '13m 22s',
    sentiment: 'negative',
    lastActive: '4 hours ago'
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james.wilson@proctoraivoice.com',
    callsDone: 245,
    cost: 3675.00,
    avgCallDuration: '8m 56s',
    sentiment: 'positive',
    lastActive: '15 minutes ago'
  }
];

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-600 bg-green-50';
    case 'negative':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return '+';
    case 'negative':
      return '-';
    default:
      return '=';
  }
};

export default function OfficersPage() {
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOfficer, setNewOfficer] = useState<NewOfficer>({
    name: '',
    email: '',
    password: '',
    role: '',
    documentsAccess: [],
    accessLevel: 'read',
    limits: {
      maxCallsPerDay: 50,
      maxCallsPerMonth: 1000,
      costLimit: 5000
    }
  });

  const availableDocuments = [
    'Student Records',
    'Financial Documents',
    'Academic Transcripts',
    'Admission Applications',
    'Test Scores',
    'Recommendation Letters',
    'Personal Statements',
    'Medical Records'
  ];

  const handleCreateOfficer = () => {
    // Here you would typically send the data to your backend
    console.log('Creating officer:', newOfficer);
    // Reset form
    setNewOfficer({
      name: '',
      email: '',
      password: '',
      role: '',
      documentsAccess: [],
      accessLevel: 'read',
      limits: {
        maxCallsPerDay: 50,
        maxCallsPerMonth: 1000,
        costLimit: 5000
      }
    });
    setShowCreateForm(false);
  };

  const handleDocumentToggle = (document: string) => {
    setNewOfficer(prev => ({
      ...prev,
      documentsAccess: prev.documentsAccess.includes(document)
        ? prev.documentsAccess.filter(doc => doc !== document)
        : [...prev.documentsAccess, document]
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Officers</h1>
            <p className="text-gray-600 mt-1">Manage and monitor call management officers</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-black text-white px-4 py-2 rounded-[6px] hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            + Create Officer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Officers List */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black mb-4">Officers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockOfficers.map((officer) => (
                <div
                  key={officer.id}
                  className={`card p-4 cursor-pointer transition-all duration-200 ${
                    selectedOfficer?.id === officer.id ? 'ring-2 ring-black' : ''
                  }`}
                  onClick={() => setSelectedOfficer(officer)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">U</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{officer.name}</h3>
                        <p className="text-sm text-gray-600">{officer.email}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-[6px] text-xs font-medium ${getSentimentColor(officer.sentiment)}`}>
                      {getSentimentIcon(officer.sentiment)} {officer.sentiment}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Calls</p>
                      <p className="font-semibold text-black">{officer.callsDone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost</p>
                      <p className="font-semibold text-black">${officer.cost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold text-black">{officer.avgCallDuration}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Last active: {officer.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Officer Details */}
        <div className="lg:col-span-1">
          {selectedOfficer ? (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Officer Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-[6px] flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">U</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{selectedOfficer.name}</h4>
                    <p className="text-sm text-gray-600">{selectedOfficer.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. of calls done:</span>
                    <span className="font-semibold text-black">{selectedOfficer.callsDone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-semibold text-black">${selectedOfficer.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg call duration:</span>
                    <span className="font-semibold text-black">{selectedOfficer.avgCallDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sentiment:</span>
                    <span className={`px-2 py-1 rounded-[6px] text-xs font-medium ${getSentimentColor(selectedOfficer.sentiment)}`}>
                      {getSentimentIcon(selectedOfficer.sentiment)} {selectedOfficer.sentiment}
                    </span>
                  </div>
                </div>

                {/* Sentiment Graph Placeholder */}
                <div className="mt-6">
                  <h4 className="font-semibold text-black mb-3">Sentiment Analysis</h4>
                  <div className="h-32 bg-gray-50 rounded-[6px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-[6px] flex items-center justify-center mx-auto mb-2">
                        <span className="text-sm font-semibold text-gray-600">C</span>
                      </div>
                      <p className="text-sm text-gray-600">Sentiment trends</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-semibold text-gray-600">S</span>
                </div>
                <h3 className="font-semibold text-black mb-2">Select an Officer</h3>
                <p className="text-sm text-gray-600">Click on an officer card to view detailed information</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Officer Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[6px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Create New Officer</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateOfficer(); }} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={newOfficer.name}
                      onChange={(e) => setNewOfficer(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newOfficer.email}
                      onChange={(e) => setNewOfficer(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={newOfficer.password}
                      onChange={(e) => setNewOfficer(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={newOfficer.role}
                      onChange={(e) => setNewOfficer(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Senior Officer">Senior Officer</option>
                      <option value="Call Manager">Call Manager</option>
                      <option value="Admissions Officer">Admissions Officer</option>
                      <option value="Supervisor">Supervisor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Access Level */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">Access Level</h3>
                <div className="space-y-2">
                  {['read', 'write', 'admin'].map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="accessLevel"
                        value={level}
                        checked={newOfficer.accessLevel === level}
                        onChange={(e) => setNewOfficer(prev => ({ ...prev, accessLevel: e.target.value as 'read' | 'write' | 'admin' }))}
                        className="mr-3"
                      />
                      <span className="capitalize">{level} Access</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Document Access */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">Document Access</h3>
                <p className="text-sm text-gray-600">Select which documents this officer can access:</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableDocuments.map((document) => (
                    <label key={document} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newOfficer.documentsAccess.includes(document)}
                        onChange={() => handleDocumentToggle(document)}
                        className="mr-2"
                      />
                      <span className="text-sm">{document}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">Access Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Calls Per Day</label>
                    <input
                      type="number"
                      value={newOfficer.limits.maxCallsPerDay}
                      onChange={(e) => setNewOfficer(prev => ({ 
                        ...prev, 
                        limits: { ...prev.limits, maxCallsPerDay: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Calls Per Month</label>
                    <input
                      type="number"
                      value={newOfficer.limits.maxCallsPerMonth}
                      onChange={(e) => setNewOfficer(prev => ({ 
                        ...prev, 
                        limits: { ...prev.limits, maxCallsPerMonth: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Limit ($)</label>
                    <input
                      type="number"
                      value={newOfficer.limits.costLimit}
                      onChange={(e) => setNewOfficer(prev => ({ 
                        ...prev, 
                        limits: { ...prev.limits, costLimit: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-[6px] hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-[6px] hover:bg-gray-800 transition-colors duration-200"
                >
                  Create Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
