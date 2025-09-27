'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        router.push('/auth/signin');
      }
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-black hover:text-gray-700 transition-colors">
              Proctor AI Voice Agent
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-[6px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/auth/signin" className="btn-primary">
                  Sign In
                </a>
                <a href="/auth/signup" className="btn-secondary">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
