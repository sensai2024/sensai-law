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

    throw error;
  }


  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {

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

    return null;
  }



  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {

    return null;
  }

  if (!profile) {

    return null;
  }


  return profile;
}
