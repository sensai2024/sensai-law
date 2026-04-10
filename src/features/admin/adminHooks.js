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
 * Hook to invite a new employee
 */
export function useInviteEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => adminService.inviteEmployee(userData),
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
