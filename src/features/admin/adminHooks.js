import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as adminService from './adminService';

/**
 * Hook to fetch all user profiles
 */
export function useAdminUsersQuery() {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getAdminUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new user directly
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => adminService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

/**
 * Hook to update an existing user
 */
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }) => adminService.updateAdminUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminService.deleteAdminUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

/**
 * Hook to trigger password reset for a user
 */
export function useTriggerPasswordResetMutation() {
  return useMutation({
    mutationFn: (email) => adminService.triggerUserPasswordReset(email),
  });
}
