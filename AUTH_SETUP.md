# Authentication Setup Guide

This guide covers the complete authentication setup for the Proctor AI Voice Agent application, including auto-login, forgot password, Google SSO, and rate limiting for multiple confirmations.

## Features Implemented

### 1. Auto-Login
- Users are automatically redirected to the dashboard if already logged in
- Auth forms show loading state while checking authentication status
- Middleware handles route protection and redirects

### 2. Forgot Password
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Set new password after clicking reset link
- Rate limiting prevents abuse (2 attempts per minute per email)

### 3. Google SSO
- Google OAuth integration with Supabase
- `/auth/callback` - Handles OAuth callback
- Seamless sign-in experience

### 4. Multiple Confirmations
- Rate limiting for confirmation emails (3 attempts per minute per email)
- Resend functionality with cooldown timer
- Prevents email spam and abuse

## Environment Setup

### Required Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth (for Google SSO)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Supabase Configuration

1. **Enable Google OAuth Provider:**
   - Go to your Supabase dashboard
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

2. **Configure Redirect URLs:**
   - Add `http://localhost:3000/auth/callback` for development
   - Add `https://yourdomain.com/auth/callback` for production

3. **Email Templates:**
   - Customize password reset email template
   - Customize confirmation email template
   - Set redirect URLs in email templates

### Google OAuth Setup

1. **Create Google OAuth App:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. **Configure OAuth Consent Screen:**
   - Add your application name
   - Add authorized domains
   - Add scopes: `email`, `profile`, `openid`

3. **Set Authorized Redirect URIs:**
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - This is your Supabase auth callback URL

## File Structure

```
app/
├── auth/
│   ├── signin/page.tsx          # Sign in form
│   ├── signup/page.tsx          # Sign up form
│   ├── forgot-password/page.tsx # Forgot password form
│   ├── reset-password/page.tsx  # Reset password form
│   └── callback/page.tsx        # OAuth callback handler
├── components/
│   └── AuthForm.tsx             # Enhanced auth form with Google SSO
└── contexts/
    └── AuthContext.tsx          # Auth context provider

lib/
├── auth.ts                      # Auth service with rate limiting
├── rate-limiter.ts             # Rate limiting utility
└── supabase.ts                 # Supabase client configuration

middleware.ts                    # Route protection middleware
```

## Usage Examples

### Sign In with Google
```tsx
import { auth } from '../lib/auth';

const handleGoogleSignIn = async () => {
  const { data, error } = await auth.signInWithGoogle();
  if (error) {
    console.error('Google sign in failed:', error);
  }
};
```

### Reset Password
```tsx
const handleResetPassword = async (email: string) => {
  const { data, error } = await auth.resetPassword(email);
  if (error) {
    console.error('Password reset failed:', error);
  }
};
```

### Resend Confirmation
```tsx
const handleResendConfirmation = async (email: string) => {
  const { data, error } = await auth.resendConfirmation(email);
  if (error) {
    console.error('Resend confirmation failed:', error);
  }
};
```

## Rate Limiting

The application includes built-in rate limiting to prevent abuse:

- **Confirmation emails**: 3 attempts per minute per email
- **Password reset**: 2 attempts per minute per email
- **Client-side implementation**: Uses in-memory storage
- **Production recommendation**: Use Redis for distributed rate limiting

## Security Features

1. **Route Protection**: Middleware protects authenticated routes
2. **Auto-redirect**: Prevents logged-in users from accessing auth pages
3. **Rate Limiting**: Prevents email spam and brute force attacks
4. **Session Validation**: Validates sessions before password reset
5. **Input Validation**: Client and server-side validation

## Testing

1. **Test Auto-login**: Sign in and try accessing `/auth/signin`
2. **Test Forgot Password**: Use forgot password flow
3. **Test Google SSO**: Sign in with Google
4. **Test Rate Limiting**: Try multiple confirmation emails quickly
5. **Test Route Protection**: Try accessing `/dashboard` without auth

## Troubleshooting

### Common Issues

1. **Google OAuth not working**:
   - Check redirect URLs in Google Console
   - Verify Supabase Google provider configuration
   - Check environment variables

2. **Rate limiting too strict**:
   - Adjust limits in `lib/rate-limiter.ts`
   - Clear browser storage to reset limits

3. **Email not sending**:
   - Check Supabase email configuration
   - Verify SMTP settings in Supabase dashboard

4. **Redirect loops**:
   - Check middleware configuration
   - Verify route protection logic

### Debug Mode

Enable debug logging by adding to your environment:
```env
NEXT_PUBLIC_DEBUG_AUTH=true
```

This will log authentication events to the console for debugging.
