import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Mail, Lock, User, Shield, X, AlertTriangle, UserPlus, RefreshCcw, Ban } from 'lucide-react';
import { 
  useAdminUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation,
  useDeleteUserMutation,
  useTriggerPasswordResetMutation 
} from './adminHooks';
import ActionButton from '../../components/ui/ActionButton';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase/client';

const AdminUsersPage = () => {
  const { data: users, isLoading, error, refetch } = useAdminUsersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Track the logged-in admin's own ID to prevent self-deletion
  const [currentUserId, setCurrentUserId] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setCurrentUserId(session.user.id);
    });
  }, []);

  // Returns true when the given row belongs to the currently logged-in user
  const isSelf = (user) => user.id === currentUserId;
  
  const [newUserInfo, setNewUserInfo] = useState({ 
    email: '', 
    password: '', 
    full_name: '', 
    role: 'employee' 
  });

  const [editUserInfo, setEditUserInfo] = useState({
    full_name: '',
    email: '',
    role: '',
    is_active: true
  });

  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();
  const resetMutation = useTriggerPasswordResetMutation();

  // Sort users: Admins first, then by creation date
  const sortedUsers = users ? [...users].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  }) : [];

  const handleCreateUser = (e) => {
    e.preventDefault();
    setActionStatus({ type: '', message: '' });
    
    createMutation.mutate(newUserInfo, {
      onSuccess: () => {
        setIsModalOpen(false);
        setNewUserInfo({ email: '', password: '', full_name: '', role: 'employee' });
        setActionStatus({ type: 'success', message: 'User created successfully!' });
      },
      onError: (err) => {
        setActionStatus({ type: 'error', message: err.message || 'Failed to create user.' });
      }
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserInfo({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setActionStatus({ type: '', message: '' });
    
    updateMutation.mutate({ userId: selectedUser.id, userData: editUserInfo }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setActionStatus({ type: 'success', message: 'User updated successfully!' });
      },
      onError: (err) => {
        setActionStatus({ type: 'error', message: err.message || 'Failed to update user.' });
      }
    });
  };

  const handleDeleteClick = (user) => {
    // Safety: never open the delete modal for the current user's own account
    if (isSelf(user)) return;
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Service-layer guard: abort if somehow triggered for self
    if (isSelf(selectedUser)) {
      setActionStatus({ type: 'error', message: 'You cannot delete your own account.' });
      setIsDeleteModalOpen(false);
      return;
    }
    setActionStatus({ type: '', message: '' });
    deleteMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setActionStatus({ type: 'success', message: 'User deleted successfully!' });
      },
      onError: (err) => {
        setIsDeleteModalOpen(false);
        setActionStatus({ type: 'error', message: err.message || 'Failed to delete user.' });
      }
    });
  };

  const handleResetPassword = (email) => {
    resetMutation.mutate(email, {
      onSuccess: () => {
        setActionStatus({ type: 'success', message: `Password reset sent to ${email}` });
      },
      onError: (err) => {
        setActionStatus({ type: 'error', message: err.message || 'Failed to send reset link.' });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight">User Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Control system access, roles and secure identifications.</p>
        </div>
        <div className="flex items-center gap-3">
           <ActionButton 
            variant="secondary" 
            icon={RefreshCcw} 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </ActionButton>
          <ActionButton 
            variant="primary" 
            icon={UserPlus} 
            onClick={() => setIsModalOpen(true)}
          >
            Add New User
          </ActionButton>
        </div>
      </div>

      {/* Status Notifications */}
      {actionStatus.message && (
        <div className={cn(
          "p-4 rounded-xl border flex items-center justify-between animate-in slide-in-from-top-2 duration-300",
          actionStatus.type === 'success' ? "bg-status-success/10 border-status-success/30 text-status-success" : "bg-status-error/10 border-status-error/30 text-status-error"
        )}>
          <div className="flex items-center gap-3 font-medium text-sm">
            <Shield size={18} />
            {actionStatus.message}
          </div>
          <button onClick={() => setActionStatus({ type: '', message: '' })} className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Table Content */}
      <SectionCard 
        title="Active Directory" 
        className="overflow-hidden"
        headerActions={<div className="text-[10px] text-[var(--text-muted)] font-bold tracking-widest uppercase">{sortedUsers.length} total users</div>}
      >
        <div className="overflow-x-auto -mx-6 -mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--surface)]/50 border-b border-[var(--border)]">
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Profile</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Access Role</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Last Active</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center text-[var(--text-muted)] italic animate-pulse">
                    Synchronizing ledger records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center text-status-error font-medium">
                    Error loading system users: {error.message}
                  </td>
                </tr>
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center text-[var(--text-muted)] italic">
                    No matching identifications found.
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--surface)]/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--text)] group-hover:text-primary transition-colors">{user.full_name || 'Anonymous User'}</span>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge status={user.role} />
                    </td>
                    <td className="px-8 py-5 text-sm">
                       <div className={cn(
                          "flex items-center gap-2 font-medium tracking-tight",
                          user.is_active ? "text-status-success" : "text-[var(--text-muted)]"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", user.is_active ? "bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-[var(--surface)]")} />
                          {user.is_active ? "Operational" : "Deactivated"}
                        </div>
                    </td>
                    <td className="px-8 py-5 text-[11px] font-medium text-[var(--text-muted)] italic">
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString() + ' ' + new Date(user.last_sign_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'First access pending'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                        <ActionButton 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleResetPassword(user.email)}
                          title="Reset Security Key"
                        >
                          Reset
                        </ActionButton>
                        <ActionButton 
                          variant="secondary" 
                          size="sm" 
                          icon={Pencil} 
                          onClick={() => handleEditUser(user)}
                        />
                        {isSelf(user) ? (
                          <div
                            title="You cannot delete your own account"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[var(--text-muted)]/40 cursor-not-allowed select-none text-[11px] font-bold uppercase tracking-wider border border-[var(--border)]/30"
                          >
                            <Ban size={13} />
                            <span>You</span>
                          </div>
                        ) : (
                          <ActionButton 
                            variant="ghost" 
                            size="sm" 
                            icon={Trash2} 
                            className="hover:text-status-error hover:bg-status-error/10"
                            onClick={() => handleDeleteClick(user)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <SectionCard 
            title="Provision New Identity" 
            className="w-full max-w-md shadow-gold-glow animate-in zoom-in-95 duration-200"
            headerActions={<button onClick={() => setIsModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"><X size={20} /></button>}
          >
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Subject Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
                   <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    value={newUserInfo.full_name}
                    onChange={(e) => setNewUserInfo({ ...newUserInfo, full_name: e.target.value })}
                    placeholder="Full Legal Name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
                   <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    value={newUserInfo.email}
                    onChange={(e) => setNewUserInfo({ ...newUserInfo, email: e.target.value })}
                    placeholder="name@altata.legal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
                   <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    value={newUserInfo.password}
                    onChange={(e) => setNewUserInfo({ ...newUserInfo, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Access Privilege</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none"
                    value={newUserInfo.role}
                    onChange={(e) => setNewUserInfo({ ...newUserInfo, role: e.target.value })}
                  >
                    <option value="employee">Standard Employee</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>
              <div className="pt-6">
                 <ActionButton
                  type="submit"
                  loading={createMutation.isPending}
                  className="w-full"
                >
                  Confirm Provisioning
                </ActionButton>
              </div>
            </form>
          </SectionCard>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <SectionCard 
            title="Modify Identification" 
            className="w-full max-w-md animate-in zoom-in-95 duration-200"
            headerActions={<button onClick={() => setIsEditModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"><X size={20} /></button>}
          >
            <div className="mb-6 p-3 bg-[var(--surface)]/50 rounded-xl border border-[var(--border)]/50">
               <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Subject UUID</p>
               <p className="text-[11px] text-primary truncate font-mono">{selectedUser?.id}</p>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Name</label>
                 <div className="relative">
                   <User className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
                   <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    value={editUserInfo.full_name}
                    onChange={(e) => setEditUserInfo({ ...editUserInfo, full_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Identified Email</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
                   <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    value={editUserInfo.email}
                    onChange={(e) => setEditUserInfo({ ...editUserInfo, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2">Role Level</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-[var(--text-muted)]" size={16} />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none"
                    value={editUserInfo.role}
                    onChange={(e) => setEditUserInfo({ ...editUserInfo, role: e.target.value })}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[var(--surface)]/30 rounded-xl border border-[var(--border)]/50">
                <input
                  id="user-active"
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--border)] text-primary focus:ring-primary/50 bg-[var(--bg)]"
                  checked={editUserInfo.is_active}
                  onChange={(e) => setEditUserInfo({ ...editUserInfo, is_active: e.target.checked })}
                />
                <label htmlFor="user-active" className="text-xs font-bold text-[var(--text-muted)] cursor-pointer uppercase tracking-wider">
                  Active Operational Status
                </label>
              </div>
              <div className="pt-6">
                 <ActionButton
                  type="submit"
                  loading={updateMutation.isPending}
                  className="w-full"
                >
                  Apply System Changes
                </ActionButton>
              </div>
            </form>
          </SectionCard>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--bg)]/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
           <div className="bg-[var(--surface)] max-w-sm w-full rounded-2xl border border-status-error/30 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-status-error/10 text-status-error rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text)] mb-3">Terminate Access?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
                You are about to permanently purge the identification record for <span className="text-[var(--text)] font-bold">{selectedUser?.full_name}</span>. 
                This action is irreversible in the security ledger.
              </p>
              <div className="flex flex-col gap-3">
                 <ActionButton
                  variant="danger"
                  className="w-full"
                  loading={deleteMutation.isPending}
                  onClick={handleDeleteConfirm}
                >
                  Confirm Termination
                </ActionButton>
                <ActionButton
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Abort Action
                </ActionButton>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
