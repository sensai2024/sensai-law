import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLoginMutation } from './authHooks';
import ActionButton from '../../components/ui/ActionButton';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate(from, { replace: true });
        },
        onError: (err) => {
          setError(err.message || 'Failed to login. Please check your credentials.');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-4 relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-center text-primary shadow-gold-glow">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight">Altata Légal</h2>
          <p className="mt-2 text-sm font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">Automation Hub</p>
        </div>

        <div className="bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)] shadow-premium relative group transition-all duration-500 hover:border-primary/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-status-error/10 border border-status-error/30 text-status-error p-3 rounded-lg text-xs font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative group/input">
                  <Mail className="absolute left-3 top-3.5 text-[var(--text-muted)] group-focus-within/input:text-primary transition-colors" size={18} />
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    placeholder="name@altata.legal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label htmlFor="password" name="password" className="block text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                    Password
                  </label>
                  <Link to="/forgot-password" name="forgot-password-link" className="text-[10px] font-bold text-primary hover:text-primary-hover transition-colors uppercase tracking-wider">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-3 top-3.5 text-[var(--text-muted)] group-focus-within/input:text-primary transition-colors" size={18} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-[var(--surface)]/50 border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <ActionButton
                id="login-button"
                type="submit"
                loading={loginMutation.isPending}
                className="w-full"
                size="lg"
              >
                {loginMutation.isPending ? 'Logging in...' : 'Access Hub'}
              </ActionButton>
            </div>
          </form>

          <div className="mt-8 text-center bg-[var(--surface)]/50 -mx-8 -mb-8 p-4 rounded-b-2xl border-t border-[var(--border)]">
            <p className="text-[10px] text-[var(--text-muted)] font-bold tracking-widest uppercase">
              Secure Administrative Gateway
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center flex flex-col items-center gap-2">
           <div className="w-1 h-8 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
           <p className="text-[10px] text-[var(--text-muted)] italic px-10">
            Authorized personnel only. Digital identification required. 
            All access attempts are registered in the Altata Légal security ledger.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
