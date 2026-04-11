import React, { useState } from 'react';
import { useAdminUsersQuery, useCreateUserMutation, useTriggerPasswordResetMutation } from './adminHooks';

const AdminUsersPage = () => {
  const { data: users, isLoading, error } = useAdminUsersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState({ 
    email: '', 
    password: '', 
    full_name: '', 
    role: 'employee' 
  });
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });

  const createMutation = useCreateUserMutation();
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1">Manage system access and roles</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-slate-950 font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New User
        </button>
      </div>

      {actionStatus.message && (
        <div className={`p-4 rounded-lg border flex items-center justify-between ${
          actionStatus.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          <span>{actionStatus.message}</span>
          <button onClick={() => setActionStatus({ type: '', message: '' })} className="text-current opacity-50 hover:opacity-100 italic text-sm">Dismiss</button>
        </div>
      )}

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <span className="text-slate-400">Loading users...</span>
          </div>
        ) : error ? (
          <div className="p-20 text-center text-red-500 font-medium">
            Error loading users: {error.message}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{user.full_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      user.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 ${user.is_active ? 'text-green-500' : 'text-slate-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.is_active ? 'animate-pulse bg-green-500' : 'bg-slate-500'}`}></span>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString() + ' ' + new Date(user.last_sign_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleResetPassword(user.email)}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Create New User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  value={newUserInfo.full_name}
                  onChange={(e) => setNewUserInfo({ ...newUserInfo, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  value={newUserInfo.email}
                  onChange={(e) => setNewUserInfo({ ...newUserInfo, email: e.target.value })}
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  value={newUserInfo.password}
                  onChange={(e) => setNewUserInfo({ ...newUserInfo, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                <select
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  value={newUserInfo.role}
                  onChange={(e) => setNewUserInfo({ ...newUserInfo, role: e.target.value })}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex justify-center"
                >
                  {createMutation.isPending ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-950"></span>
                  ) : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
