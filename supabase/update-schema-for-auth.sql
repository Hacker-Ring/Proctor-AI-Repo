-- Update the schema to use user_id instead of clerk_id for better Supabase Auth integration
-- This will make the RLS policies work correctly

-- Add user_id column to knowledge_base
ALTER TABLE knowledge_base ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to call_metrics  
ALTER TABLE call_metrics ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing records to use user_id (this will be empty initially)
-- You'll need to populate this when users sign up

-- Update RLS policies to use user_id instead of clerk_id
DROP POLICY IF EXISTS "Users can view their own documents" ON knowledge_base;
DROP POLICY IF EXISTS "Users can insert their own documents" ON knowledge_base;
DROP POLICY IF EXISTS "Users can update their own documents" ON knowledge_base;
DROP POLICY IF EXISTS "Users can delete their own documents" ON knowledge_base;

DROP POLICY IF EXISTS "Users can view their own call metrics" ON call_metrics;
DROP POLICY IF EXISTS "Users can insert their own call metrics" ON call_metrics;
DROP POLICY IF EXISTS "Users can update their own call metrics" ON call_metrics;
DROP POLICY IF EXISTS "Users can delete their own call metrics" ON call_metrics;

-- Create new policies using user_id
CREATE POLICY "Users can view their own documents" ON knowledge_base
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON knowledge_base
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON knowledge_base
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON knowledge_base
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own call metrics" ON call_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own call metrics" ON call_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own call metrics" ON call_metrics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own call metrics" ON call_metrics
    FOR DELETE USING (auth.uid() = user_id);

-- Update storage policies to use user_id
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
