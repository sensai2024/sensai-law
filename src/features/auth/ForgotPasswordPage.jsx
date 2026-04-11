import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from './authHooks';
import ActionButton from '../../components/ui/ActionButton';
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (err) => {
        setError(err.message || 'Failed to send reset email.');
      },
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full space-y-8 p-10 bg-surface rounded-2xl border border-border shadow-premium text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-status-success/10 text-status-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Email Transmitted</h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            A security recovery link has been dispatched to <br/>
            <span className="text-primary font-bold">{email}</span>.
          </p>
          <div className="mt-10 pt-6 border-t border-border/50">
            <Link to="/login">
               <ActionButton variant="secondary" icon={ArrowLeft} className="w-full">
                  Return to Archive
               </ActionButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-surface-highlight border border-border rounded-2xl flex items-center justify-center text-primary shadow-gold-glow">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text-primary tracking-tight">Recovery Protocol</h2>
          <p className="mt-2 text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase">Access Restoration</p>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border shadow-premium">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <p className="text-sm text-text-muted text-center mb-4">
              Enter your identified email address to receive a secure restoration key.
            </p>

            {error && (
              <div className="bg-status-error/10 border border-status-error/30 text-status-error p-3 rounded-xl text-xs font-bold">
                [ERROR]: {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email-address" className="block text-[10px] font-bold tracking-widest text-text-muted uppercase ml-1">
                Email Address
              </label>
              <div className="relative group/input">
                <Mail className="absolute left-3 top-3.5 text-text-muted group-focus-within/input:text-primary transition-colors" size={18} />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-surface-highlight border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  placeholder="name@altata.legal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <ActionButton
                id="send-reset-button"
                type="submit"
                loading={forgotPasswordMutation.isPending}
                className="w-full"
                size="lg"
              >
                Send Recovery Key
              </ActionButton>
            </div>

            <div className="text-center pt-2">
              <Link to="/login" className="text-[10px] font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                <ArrowLeft size={12} />
                Back to Authentication
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
