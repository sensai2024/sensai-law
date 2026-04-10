import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as authService from './authService';

/**
 * Hook for user login
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authService.signIn(email, password),
    onSuccess: () => {
      // Invalidate all queries to refresh state after login
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      // Clear all queries from cache on logout
      queryClient.clear();
      window.location.href = '/login';
    },
  });
}

/**
 * Hook for password reset request
 */
export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email) => authService.sendPasswordReset(email),
  });
}

/**
 * Hook for password change/reset
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (newPassword) => authService.updatePassword(newPassword),
  });
}

/**
 * Hook to fetch the current user's profile
 */
export function useCurrentUserProfileQuery(userId) {
  return useQuery({
    queryKey: ['currentUserProfile', userId],
    queryFn: () => authService.getCurrentUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
