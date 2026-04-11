import { supabase } from '../../lib/supabase/client';

/**
 * Fetch all users from the profiles table (Admin only)
 */
export async function getAdminUsers() {
  const { data, error } = await supabase.functions.invoke('list-users');

  if (error) {
    console.error('Error fetching users via Edge Function:', error);
    throw error;
  }
  
  return data;
}

/**
 * Create a new user (Admin only)
 * This calls a secure Edge Function 'create-user' which verifies the 
 * admin's role before performing the administrative creation.
 */
export async function createUser({ email, password, full_name, role }) {
  // 1. Verify and log session for debugging
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current Session before calling create-user:', session);
  
  if (!session) {
    console.error('No active session found. Aborting creation.');
    throw new Error('No active session found. Please login.');
  }

  const { data, error } = await supabase.functions.invoke('create-user', {
    body: { email, password, full_name, role },
  });
  
  if (error) {
    console.error('Error in create-user function:', error);
    console.log('Error status:', error.status);
    console.log('Error name:', error.name);
    
    // Attempt to parse and log the detailed error body from the function
    try {
      if (error.context && typeof error.context.json === 'function') {
        const details = await error.context.json();
        console.error('Granular Error Details from Function (Stringified):', JSON.stringify(details, null, 2));
      }
    } catch (parseErr) {
      console.warn('Could not parse error details response:', parseErr);
    }
    
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
