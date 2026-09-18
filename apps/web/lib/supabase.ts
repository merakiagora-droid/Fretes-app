import { createBrowserClient } from '@supabase/ssr';

const configuredKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseKey = configuredKey.startsWith('sb_publishable_')
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHBybmhrZHF6YnFycXJva3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MzAwNzQsImV4cCI6MjEwNTMwNjA3NH0.xDFl9eigtRdjb18glfrmjpQYiHngyCfAIFIoXLTm0_U'
  : configuredKey;

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey,
);
