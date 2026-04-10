import { supabase } from '../../lib/supabase/client';

/**
 * Fetch all users from the profiles table (Admin only)
 */
export async function getAdminUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Invite/Create a new employee
 * NOTE: This normally requires the Supabase Service Role key which should NOT be in the frontend.
 * This implementation assumes there is a Supabase Edge Function named 'invite-user' 
 * or similar that handles the secure administrative action.
 */
export async function inviteEmployee({ email, full_name, role }) {
  // Option A: Call an Edge Function (Recommended)
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { email, full_name, role },
  });
  
  // If the edge function is not setup, we'll fall back to a mock/error 
  // or a direct table insert if the user prefers that (though it won't create an Auth user)
  if (error) {
    console.warn('Edge function "invite-user" not found or failed. Ensure your Supabase project is configured.');
    throw error;
  }

  return data;
}

/**
 * Trigger a password reset for a specific user (Admin only)
 */
export async function triggerUserPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}
