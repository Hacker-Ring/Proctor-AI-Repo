'use client';

import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome back, {user?.user_metadata?.name || user?.email || 'User'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-[6px] flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">
                    {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700">{user?.email || 'Loading...'}</span>
              </div>
              <button
                onClick={() => {
                  // Handle sign out
                  window.location.href = '/auth/signin';
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
