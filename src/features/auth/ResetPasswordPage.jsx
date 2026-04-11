import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChangePasswordMutation } from './authHooks';
import ActionButton from '../../components/ui/ActionButton';
import { Lock, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const changePasswordMutation = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      },
      onError: (err) => {
        setError(err.message || 'Failed to reset password. The security link might be expired.');
      },
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full space-y-8 p-10 bg-surface rounded-2xl border border-border shadow-premium text-center animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-status-success/10 text-status-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Security Protocol Updated</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Your identification key has been successfully re-provisioned. 
            Redirecting to the secure gateway...
          </p>
          <div className="mt-10 pt-6 border-t border-border/50">
            <Link to="/login" className="text-primary hover:text-primary-hover font-bold text-xs uppercase tracking-widest">
              Click here to bypass redirection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-surface-highlight border border-border rounded-2xl flex items-center justify-center text-primary shadow-gold-glow">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text-primary tracking-tight">Finalize Recovery</h2>
          <p className="mt-2 text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase">Secure Identification Setup</p>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border shadow-premium">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-status-error/10 border border-status-error/30 text-status-error p-3 rounded-xl text-xs font-bold">
                [SECURITY ALERT]: {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="password" name="new-password-label" className="block text-[10px] font-bold tracking-widest text-text-muted uppercase ml-1 mb-2">
                  New Security Key
                </label>
                <div className="relative group/input">
                  <Key className="absolute left-3 top-3.5 text-text-muted group-focus-within/input:text-primary transition-colors" size={18} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-surface-highlight border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" name="confirm-password-label" className="block text-[10px] font-bold tracking-widest text-text-muted uppercase ml-1 mb-2">
                  Confirm Verification Key
                </label>
                <div className="relative group/input">
                  <Lock className="absolute left-3 top-3.5 text-text-muted group-focus-within/input:text-primary transition-colors" size={18} />
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-surface-highlight border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <ActionButton
                id="reset-submit-button"
                type="submit"
                loading={changePasswordMutation.isPending}
                className="w-full"
                size="lg"
              >
                Establish New Key
              </ActionButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
