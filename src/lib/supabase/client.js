import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './env';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
