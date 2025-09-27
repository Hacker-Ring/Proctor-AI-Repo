-- Enable RLS with proper Supabase Auth integration
-- This will work with the new Supabase authentication system

-- Re-enable RLS on tables
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own documents" ON knowledge_base;
DROP POLICY IF EXISTS "Users can insert their own documents" ON knowledge_base;
DROP POLICY IF EXISTS "Users can update their own documents" ON knowledge_base;
DROP POLICY IF EXISTS "Users can delete their own documents" ON knowledge_base;

DROP POLICY IF EXISTS "Users can view their own call metrics" ON call_metrics;
DROP POLICY IF EXISTS "Users can insert their own call metrics" ON call_metrics;
DROP POLICY IF EXISTS "Users can update their own call metrics" ON call_metrics;
DROP POLICY IF EXISTS "Users can delete their own call metrics" ON call_metrics;

DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create new policies that work with Supabase Auth
-- Knowledge Base policies
CREATE POLICY "Users can view their own documents" ON knowledge_base
    FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can insert their own documents" ON knowledge_base
    FOR INSERT WITH CHECK (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update their own documents" ON knowledge_base
    FOR UPDATE USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can delete their own documents" ON knowledge_base
    FOR DELETE USING (auth.uid()::text = clerk_id);

-- Call Metrics policies
CREATE POLICY "Users can view their own call metrics" ON call_metrics
    FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can insert their own call metrics" ON call_metrics
    FOR INSERT WITH CHECK (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update their own call metrics" ON call_metrics
    FOR UPDATE USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can delete their own call metrics" ON call_metrics
    FOR DELETE USING (auth.uid()::text = clerk_id);

-- Storage policies
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
