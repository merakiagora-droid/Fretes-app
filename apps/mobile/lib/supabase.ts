import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// These are Supabase's public client credentials. They must be bundled into
// native builds so stale or misconfigured CI secrets cannot break registration.
const supabaseUrl = 'https://rjtprnhkdqzbqrqrokvf.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHBybmhrZHF6YnFycXJva3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MzAwNzQsImV4cCI6MjEwNTMwNjA3NH0.xDFl9eigtRdjb18glfrmjpQYiHngyCfAIFIoXLTm0_U';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } },
);
