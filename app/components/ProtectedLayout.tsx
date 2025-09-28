'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePhoneVerification } from '../hooks/usePhoneVerification';
import Sidebar from './Sidebar';
import PhoneVerificationModal from './PhoneVerificationModal';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, signOut } = useAuth();
  const { needsPhoneNumber, checkingPhone, userId } = usePhoneVerification();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Show phone collection modal if needed
  useEffect(() => {
    if (!checkingPhone && needsPhoneNumber && userId) {
      setShowPhoneModal(true);
    }
  }, [needsPhoneNumber, checkingPhone, userId]);

  const handlePhoneVerificationSuccess = () => {
    setShowPhoneModal(false);
    // Refresh the page to update the phone verification status
    window.location.reload();
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
        alert('Failed to sign out. Please try again.');
      } else {
        // Force a hard redirect to clear any cached state
        window.location.replace('/auth/signin');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

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
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-white">
          {children}
        </main>
      </div>

      {/* Phone Verification Modal */}
      {userId && (
        <PhoneVerificationModal
          isOpen={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          onSuccess={handlePhoneVerificationSuccess}
          userId={userId}
        />
      )}
    </div>
  );
}
