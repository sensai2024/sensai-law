import { supabase } from '../../lib/supabase/client';

/**
 * Sign in a user with email and password
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('DEBUG [authService]: Login failed:', error.message);
    throw error;
  }
  
  console.log('DEBUG [authService]: Login successful for:', data.user.id);
  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  console.log('DEBUG [authService]: Signing out...');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Send a password reset email
 */
export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

/**
 * Update the user's password
 */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

/**
 * Get the profile for a specific user ID
 */
export async function getCurrentUserProfile(userId) {
  if (!userId) {
    console.log('DEBUG [authService]: No userId provided to getCurrentUserProfile');
    return null;
  }

  console.log('DEBUG [authService]: Fetching profile for ID:', userId);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('DEBUG [authService]: Database error while fetching profile:', profileError);
    return null;
  }

  if (!profile) {
    console.warn('DEBUG [authService]: No profile found in database for ID:', userId);
    return null;
  }

  console.log('DEBUG [authService]: Profile fetched successfully:', profile);
  return profile;
}
