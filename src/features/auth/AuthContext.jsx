import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useCurrentUserProfileQuery } from './authHooks';

const AuthContext = createContext({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile ONLY when session exists
  const {
    data: profile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile
  } = useCurrentUserProfileQuery(session?.user?.id);

  const isAdmin = profile?.role === 'admin';

  // // Enhanced Debugging Lifecycle Logs
  // useEffect(() => {
  //   if (isLoadingSession) {

  //     return;
  //   }

  //   if (!session) {

  //     return;
  //   }



  //   if (isLoadingProfile) {

  //   } else if (profile) {

  //   } else {

  //   }
  // }, [session, profile, isAdmin, isLoadingSession, isLoadingProfile]);

  const value = {
    session,
    user: session?.user ?? null,
    profile: profile ?? null,
    isLoading: isLoadingSession || (!!session && isLoadingProfile),
    isAdmin,
    refetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
