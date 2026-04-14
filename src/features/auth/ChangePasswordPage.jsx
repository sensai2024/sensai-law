import React, { useState } from 'react';
import { useChangePasswordMutation } from './authHooks';
import SectionCard from '../../components/ui/SectionCard';
import ActionButton from '../../components/ui/ActionButton';
import { Lock, ShieldCheck, Key } from 'lucide-react';

const ChangePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const changePasswordMutation = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Security key must be at least 6 characters.');
      return;
    }

    changePasswordMutation.mutate(password, {
      onSuccess: () => {
        setSuccess('Security credentials updated successfully.');
        setPassword('');
        setConfirmPassword('');
      },
      onError: (err) => {
        setError(err.message || 'Failed to update credentials.');
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex items-center gap-4 border-l-2 border-primary pl-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Security Protocol</h1>
          <p className="text-sm text-text-muted mt-1 uppercase tracking-[0.2em] font-bold">Credential Management System</p>
        </div>
      </div>

      <SectionCard
        title="Key Management"
        className="shadow-premium"
        headerActions={<ShieldCheck size={18} className="text-primary" />}
      >
        <div className="flex items-start gap-4 mb-8 p-4 bg-surface-highlight/50 rounded-xl border border-border/50">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Lock size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">Update Security Credentials</h4>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Your security key is the primary identifier for administrative actions.
              Ensure your new key follows the Altata Légal complexity standard.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-status-error/10 border border-status-error/30 text-status-error p-3 rounded-xl text-xs font-bold animate-in shake duration-300">
              [CRITICAL ERROR]: {error}
            </div>
          )}

          {success && (
            <div className="bg-status-success/10 border border-status-success/30 text-status-success p-3 rounded-xl text-xs font-bold animate-in fade-in zoom-in-95">
              [PROTOCOL SUCCESS]: {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold tracking-widest text-text-muted uppercase ml-1">
                New Security Key
              </label>
              <div className="relative group/input">
                <Key className="absolute left-3 top-3.5 text-text-muted group-focus-within/input:text-primary transition-colors" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-surface-highlight border border-border rounded-xl text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold tracking-widest text-text-muted uppercase ml-1">
                Confirm Verification Key
              </label>
              <div className="relative group/input">
                <Lock className="absolute left-3 top-3.5 text-text-muted group-focus-within/input:text-primary transition-colors" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 h-[46px] bg-surface-highlight border border-border rounded-xl text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <ActionButton
              type="submit"
              loading={changePasswordMutation.isPending}
              className="min-w-[200px]"
            >
              Authorize Key Update
            </ActionButton>
          </div>
        </form>
      </SectionCard>

      <div className="p-6 bg-surface-accent/20 rounded-2xl border border-dashed border-border/50 flex items-center justify-center">
        <p className="text-[10px] text-text-muted font-medium tracking-widest uppercase italic">
          Session identification remaining active during credential transition.
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
