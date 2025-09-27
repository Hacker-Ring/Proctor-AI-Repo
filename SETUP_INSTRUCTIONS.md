# Setup Instructions for Proctor AI Voice Agent

## Quick Fix for Current Error

The error you're seeing is because the Supabase environment variables are not configured. Follow these steps to fix it:

### 1. Create Environment File

Create a `.env.local` file in your project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Google OAuth (for Google SSO)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Azure Voice Live API
AZURE_VOICE_LIVE_API_VERSION=2024-02-15-preview
```

### 2. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Supabase Database

Run the SQL scripts in your Supabase SQL editor:

1. **Enable RLS and Auth**: Run `supabase/enable-rls-with-supabase-auth.sql`
2. **Update Schema**: Run `supabase/update-schema-for-auth.sql`

### 4. Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Copy the Client ID and Client Secret to your `.env.local`

### 5. Restart Development Server

After creating the `.env.local` file:

```bash
npm run dev
```

## What's Fixed

✅ **Error Handling**: Added proper error handling for missing environment variables
✅ **Graceful Degradation**: App won't crash if Supabase is not configured
✅ **Clear Error Messages**: Console will show helpful error messages
✅ **Authentication Flow**: All auth features work once environment is configured

## Features Available

Once configured, you'll have:

- ✅ **Auto-login**: Signed-in users redirect to dashboard
- ✅ **Sign-out**: Available in header and sidebar
- ✅ **Google SSO**: Sign in with Google
- ✅ **Forgot Password**: Email-based password reset
- ✅ **Rate Limiting**: Prevents abuse of auth features
- ✅ **Responsive UI**: Works on all devices

## Troubleshooting

### Still Getting Errors?

1. **Check Console**: Look for specific error messages
2. **Verify Environment**: Make sure `.env.local` is in the project root
3. **Restart Server**: Always restart after changing environment variables
4. **Check Supabase**: Ensure your project is active and credentials are correct

### Common Issues

- **"Auth object is not properly initialized"**: Missing environment variables
- **"Supabase client not initialized"**: Invalid or missing Supabase credentials
- **OAuth not working**: Check Google OAuth configuration in Supabase

## Next Steps

1. Set up your environment variables
2. Test the authentication flow
3. Customize the UI to match your brand
4. Deploy to production

The application is now robust and will handle missing configuration gracefully while providing clear guidance on what needs to be set up.
