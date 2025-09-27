import { createClient } from '@supabase/supabase-js'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { Database } from './database.types'
import { confirmationEmailLimiter, passwordResetLimiter } from './rate-limiter'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  console.error('Required variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create Supabase client with error handling
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Auth helper functions
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: { name?: string }) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    if (!supabase) {
      return { error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getUser() {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  async getSession() {
    if (!supabase) {
      return { session: null, error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  },

  // Reset password with rate limiting
  async resetPassword(email: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    
    const rateLimitKey = `password_reset_${email}`;
    
    if (!passwordResetLimiter.isAllowed(rateLimitKey)) {
      const timeUntilReset = Math.ceil(passwordResetLimiter.getTimeUntilReset(rateLimitKey) / 1000);
      return { 
        data: null, 
        error: { 
          message: `Too many password reset attempts. Please wait ${timeUntilReset} seconds before trying again.` 
        } 
      };
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  },

  // Update password
  async updatePassword(password: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  // Sign in with Google
  async signInWithGoogle() {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Resend confirmation email with rate limiting
  async resendConfirmation(email: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase client not initialized. Please check your environment variables.' } }
    }
    
    const rateLimitKey = `confirmation_${email}`;
    
    if (!confirmationEmailLimiter.isAllowed(rateLimitKey)) {
      const timeUntilReset = Math.ceil(confirmationEmailLimiter.getTimeUntilReset(rateLimitKey) / 1000);
      return { 
        data: null, 
        error: { 
          message: `Too many confirmation email attempts. Please wait ${timeUntilReset} seconds before trying again.` 
        } 
      };
    }

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })
    return { data, error }
  }
}

// Server-side auth helpers
export const createServerClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables for server-side client')
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// SSR-compatible server client for middleware and server components
export const createServerClientSSR = (cookies: {
  get: (name: string) => string | undefined
  set: (name: string, value: string, options?: any) => void
  remove: (name: string, options?: any) => void
}) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables for server-side client')
  }
  return createSSRClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookies.get(name)
      },
      set(name: string, value: string, options: any) {
        cookies.set(name, value, options)
      },
      remove(name: string, options: any) {
        cookies.remove(name, options)
      },
    },
  })
}