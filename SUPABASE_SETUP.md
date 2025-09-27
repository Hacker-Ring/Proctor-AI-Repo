# Supabase Integration Setup Guide

This guide will help you set up Supabase as your database for the Proctor AI Voice Agent application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## Step 1: Environment Configuration

1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials:

```env
# Supabase Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Step 2: Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from `supabase/schema.sql` to create the tables
4. Run the SQL commands from `supabase/storage-setup.sql` to set up file storage

## Step 3: Storage Configuration

1. In your Supabase dashboard, go to Storage
2. Create a new bucket named `documents` (if not already created by the SQL script)
3. Set the bucket to public if you want direct access to files

## Step 4: Authentication Setup (Optional)

If you want to use Supabase Auth alongside Clerk:

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL and redirect URLs
3. Enable the providers you want to use

## Database Schema

### Knowledge Base Table
Stores user uploaded documents with the following fields:
- `id`: UUID primary key
- `clerk_id`: User identifier from Clerk
- `document_name`: Original filename
- `document_url`: Public URL to the stored file
- `document_type`: MIME type or file category
- `file_size`: File size in bytes
- `upload_date`: When the file was uploaded
- `created_at` / `updated_at`: Timestamps

### Call Metrics Table
Stores call information with the following fields:
- `id`: UUID primary key
- `clerk_id`: User identifier from Clerk
- `call_id`: Unique identifier for the call
- `call_duration`: Duration in seconds
- `transcript`: Full call transcript
- `summary`: AI-generated call summary
- `start_time` / `end_time`: Call timing
- `vendor_details`: JSON object with vendor information
- `created_at` / `updated_at`: Timestamps

## Usage Examples

### Document Management

```typescript
import { DocumentService } from '@/lib/document-service'

// Upload a document
const document = await DocumentService.uploadDocument(
  clerkId,
  file,
  'application/pdf'
)

// Get user's documents
const documents = await DocumentService.getUserDocuments(clerkId)

// Delete a document
await DocumentService.deleteDocument(documentId, clerkId)
```

### Call Metrics

```typescript
import { CallMetricsService } from '@/lib/call-metrics-service'

// Save call metrics
const callMetrics = await CallMetricsService.saveCallMetrics(
  clerkId,
  callId,
  duration,
  transcript,
  summary,
  startTime,
  endTime,
  vendorDetails
)

// Get user's call history
const calls = await CallMetricsService.getUserCallMetrics(clerkId)

// Get call statistics
const stats = await CallMetricsService.getCallStatistics(clerkId)
```

## Security Features

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data (filtered by `clerk_id`)
- File storage is also protected with RLS policies
- All operations require proper authentication

## Troubleshooting

1. **Connection Issues**: Verify your environment variables are correct
2. **Permission Errors**: Check that RLS policies are properly set up
3. **File Upload Issues**: Ensure the storage bucket exists and policies are configured
4. **Type Errors**: Make sure to run `npm run build` to check for TypeScript errors

## Next Steps

1. Test the integration by uploading a document
2. Create a call and save metrics
3. Verify data is properly stored and accessible
4. Customize the schema as needed for your specific use case
