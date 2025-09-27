'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'D' },
  { name: 'Calls', href: '/calls', icon: 'C' },
  { name: 'Manage Data', href: '/manage-data', icon: 'M' },
  { name: 'Analytics', href: '/analytics', icon: 'A' },
  { name: 'Officers', href: '/officers', icon: 'O' },
  { name: 'Pricing', href: '/pricing', icon: 'P' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-black">Proctor AI Voice Agent</h1>
        <p className="text-sm text-gray-600 mt-1">Admissions</p>
      </div>
      
      <nav className="px-4 space-y-2 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-gray-700 rounded-[6px] transition-all duration-200 hover:bg-gray-100 hover:text-black cursor-pointer ${isActive ? 'bg-black text-white hover:bg-gray-800' : ''}`}
            >
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info and sign out */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500">Signed in</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-[6px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="w-6 h-6 bg-gray-200 rounded-[6px] flex items-center justify-center text-xs mr-3">🚪</span> {/* 🚪 */} {/* 🚪 */}
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
}
