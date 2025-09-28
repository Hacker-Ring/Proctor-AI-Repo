'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '../../lib/supabase-client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, metadata?: { name?: string; phone?: string }) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create supabase client
    const supabase = createClient();
    
    if (!supabase) {
      console.error('Supabase client is not properly initialized. Please check your environment variables.');
      setLoading(false);
      return;
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthContext: Initial session check', { 
          hasSession: !!session, 
          hasUser: !!session?.user, 
          userId: session?.user?.id,
          error: error?.message 
        });
        
        if (error) {
          console.error('Error getting session:', error);
          // Clear any stale state on error
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('Unexpected error getting session:', err);
        // Clear any stale state on error
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch (err) {
      console.error('Error setting up auth state listener:', err);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    
    if (!supabase) {
      return { data: null, error: { message: 'Supabase client not available' } };
    }
    
    console.log('AuthContext: Attempting signin for', email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    console.log('AuthContext: Signin result', { 
      success: !result.error, 
      error: result.error?.message,
      hasUser: !!result.data?.user,
      hasSession: !!result.data?.session
    });
    
    return result;
  };

  const signUp = async (email: string, password: string, metadata?: { name?: string; phone?: string }) => {
    const supabase = createClient();
    
    if (!supabase) {
      return { data: null, error: { message: 'Supabase client not available' } };
    }
    return await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: metadata } 
    });
  };

  const signOut = async () => {
    const supabase = createClient();
    
    if (!supabase) {
      return { error: { message: 'Supabase client not available' } };
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
