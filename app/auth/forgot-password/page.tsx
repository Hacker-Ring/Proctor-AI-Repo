'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../lib/auth';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // Don't render form if user is logged in
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await auth.resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset email sent! Check your inbox.');
        setResendCooldown(60); // 60 second cooldown
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    setError('');
    try {
      const { data, error } = await auth.resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset email sent again!');
        setResendCooldown(60);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-[6px] focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-[6px] text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-[6px] text-sm">
              {message}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-[6px] text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send reset email'}
            </button>

            {message && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="w-full text-center py-2 px-4 text-sm font-medium text-black hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend email'
                }
              </button>
            )}
          </div>

          <div className="text-center">
            <a
              href="/auth/signin"
              className="font-medium text-black hover:text-gray-700 text-sm"
            >
              Back to sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
